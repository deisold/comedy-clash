"use client"

import React from 'react';
import { useEffect, useState } from 'react';
import { useAppContext } from '@/app/components/providers/providers';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import RetryButton from '../ui/RetryButton';
import { buttonClassNameListCTA, buttonStyleCTAClassName } from '../ui/styles/buttonClassNames';
//
interface ShowDetailsState {
    address: string | null;
    description: string | null;
    isClosed: boolean;
    submissionCount: number;
}

export default function ShowListItem({ index }: { index: number }) {
    const { comedyTheaterRepo, comedyClashRepo } = useAppContext();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const [showDetails, setShowDetails] = useState<ShowDetailsState>({
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

                const showAddress = await comedyTheaterRepo!!.getShowAdress(index);

                if (controller.signal.aborted || !comedyClashRepo) return;

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
            } catch (error: any) {
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
            if (!comedyClashRepo || !showDetails.address) {
                return;
            }
            await comedyClashRepo.closeSubmission(showDetails.address);
            setShowDetails(prevDetails => ({
                ...prevDetails,
                isClosed: true
            }));
        } catch (error: any) {
            console.error('Error closing show:', error);
            toast.error(error.message || 'Failed to close show');
        } finally {
            setIsClosing(false);
        }
    };

    if (loading) {
        return (
            <tr>
                <td colSpan={4} className="text-center">Loading...</td>
            </tr>
        );
    }

    if (errorMessage) {
        return (
            <tr>
                <td colSpan={4} className="text-center">
                    <div className="text-red-600 mb-2">
                        Error: {errorMessage}
                    </div>
                    <RetryButton onClick={() => window.location.reload()} />
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
                <button
                    className={buttonClassNameListCTA(showDetails.isClosed)}
                    disabled={showDetails.address == null}
                    onClick={handleNavigate}>
                    Show
                </button>
                {!showDetails.isClosed && (
                    <button
                        className={buttonClassNameListCTA(isClosing)}
                        disabled={showDetails.address == null || isClosing}
                        onClick={handleClose}>
                        {isClosing ? 'Closing...' : 'Close'}
                    </button>
                )}
            </td>
        </tr>
    );
}


