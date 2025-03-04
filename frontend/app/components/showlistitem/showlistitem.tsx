"use client"

import React from 'react';
import { useEffect, useState } from 'react';
import { useAppContext } from '@/app/components/providers/AppProvider';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import RetryButton from '../ui/RetryButton';
import { buttonClassNameListCTA, buttonStyleCTAClassName } from '../ui/styles/buttonClassNames';
import { useShowStore } from '@/app/source/store/ShowStore';
//
interface ShowDetailsState {
    address: string | null;
    description: string | null;
    isClosed: boolean;
    submissionCount: number;
}

export default function ShowListItem({ index }: { index: number }) {
    const { showService, comedyTheaterRepo, comedyClashRepo } = useAppContext();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const { setShowForIndex, getShowForIndex, updateShowForIndex } = useShowStore();
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        const init = async () => {
            try {
                setLoading(true);
                setErrorMessage('');

                const show = await showService!!.getShow(index);
                if (show === null) {
                    throw new Error('Show not found');
                }
                setShowForIndex(index, show);
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
        const show = getShowForIndex(index)!!;
        console.log(`showDetails.address:${show.id}`);

        router.push(`/showdetails/${show.id}`);
    };

    const handleClose = async () => {
        const show = getShowForIndex(index)!!;
        console.log(`handleClose: address:${show.id}`);
        setIsClosing(true);
        try {
            if (!comedyClashRepo || !show.id) {
                return;
            }
            await comedyClashRepo.closeSubmission(show.id);
            updateShowForIndex(index, { closed: true });
        } catch (error: any) {
            console.error('Error closing show:', error);
            toast.error(error.message || 'Failed to close show');
        } finally {
            setIsClosing(false);
        }
    };

    const show = getShowForIndex(index);
    if (loading || show === null) {
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
        <tr className={`${show!!.closed ? 'bg-gray-200' : ''}`}>
            <td>{index}</td>
            <td>{show!!.description}</td>
            <td>{show!!.submissionCount}</td>
            <td>
                <button
                    className={buttonClassNameListCTA(show!!.closed)}
                    disabled={show!!.id == null}
                    onClick={handleNavigate}>
                    Show
                </button>
                {!show!!.closed && (
                    <button
                        className={buttonClassNameListCTA(isClosing)}
                        disabled={show!!.id == null || isClosing}
                        onClick={handleClose}>
                        {isClosing ? 'Closing...' : 'Close'}
                    </button>
                )}
            </td>
        </tr>
    );
}


