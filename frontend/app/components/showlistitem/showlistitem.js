"use client"

import React from 'react';
import { useEffect, useState } from 'react';
import { useAppContext } from '@/app/components/providers';
import { Button } from 'semantic-ui-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function ShowListItem({ index }) {
    const { comedyTheaterRepo, comedyClashRepo } = useAppContext();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [showDetails, setShowDetails] = useState({
        address: null,
        description: null,
        isClosed: true,
        submissionCount: 0,
    });
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        const init = async () => {
            try {
                setLoading(true);
                setErrorMessage('');

                const showAddress = await comedyTheaterRepo.getShowAdress(index);
                
                if (controller.signal.aborted) return;

                const description = await comedyClashRepo.getDescription(showAddress);
                const isClosed = await comedyClashRepo.isClosed(showAddress);
                const submissionCount = await comedyClashRepo.getSubmissionCount(showAddress);
                
                if (controller.signal.aborted) return;

                setShowDetails({
                    address: showAddress,
                    description: description,
                    isClosed: isClosed,
                    submissionCount: submissionCount,
                });
            } catch (error) {
                if (controller.signal.aborted) return;
                
                console.error('Error loading show details:', error);
                setErrorMessage(error.message || 'Failed to load show details');
                toast.error(error.message || 'Failed to load show details');
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        init();

        return () => controller.abort();
    }, [comedyTheaterRepo, comedyClashRepo, index]);

    const handleNavigate = () => {
        console.log(`showDetails.address:${showDetails.address}`);

        router.push(`/showdetails/${showDetails.address}`);
    };

    const handleClose = async () => {
        console.log(`handleClose: address:${showDetails.address}`);
        setIsClosing(true);
        try {
            await comedyClashRepo.closeSubmission(showDetails.address);
            setShowDetails(prevDetails => ({
                ...prevDetails,
                isClosed: true
            }));
        } catch (error) {
            console.error('Error closing show:', error);
            toast.error(error.message || 'Failed to close show');
        } finally {
            setIsClosing(false);
        }
    };

    if (loading) {
        return (
            <tr>
                <td colSpan="4" className="text-center">Loading...</td>
            </tr>
        );
    }

    if (errorMessage) {
        return (
            <tr>
                <td colSpan="4" className="text-center">
                    <div className="text-red-600 mb-2">
                        Error: {errorMessage}
                    </div>
                    <Button 
                        basic 
                        size='small'
                        onClick={() => window.location.reload()}>
                        Try Again
                    </Button>
                </td>
            </tr>
        );
    }

    return (
        <tr className={`${showDetails.isClosed ? 'bg-gray-200' : ''}`}>
            <td>{index}</td>
            <td>{showDetails.description}</td>
            <td>{showDetails.submissionCount}</td>
            <td>
                <Button basic
                    disabled={showDetails.address == null}
                    onClick={handleNavigate}>
                    Show
                </Button>
                {!showDetails.isClosed && (
                    <Button basic
                        disabled={showDetails.address == null || isClosing}
                        loading={isClosing}
                        onClick={handleClose}>
                        Close
                    </Button>
                )}
            </td>
        </tr>
    );
}
