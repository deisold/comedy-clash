// frontend/app/components/submission-listitem/submission-listitem.js

"use client"

import React from 'react';
import { useEffect, useState } from 'react';

import { useAppContext } from '@/app/components/providers';
import { Button } from 'semantic-ui-react';
import { useRouter, useParams } from 'next/navigation';
import { useBlockchainState } from '../providers/BlockchainStateProvider';
import { Submission } from '@/app/source/data/submission';
import { isNotNullOrEmpty } from '@/app/source/utils/utils';

interface RouteParams {
    showAddress: string;
    // Other params can be a string or undefined
    [key: string]: string | undefined;
}

interface ListItemData {
    loading: boolean;
    id: number;
    isClosed: boolean;
    artistAddress: string;
    name: string;
    topic: string;
    preview: string;
    averageTotal: number;
    averageCount: number;
    averageValue: string;
}

export default function SubmissionListItem({ address, index, submission }: { address: string, index: number, submission: Submission }) {
    const { comedyClashRepo } = useAppContext();
    const { canWrite } = useBlockchainState();
    const router = useRouter();

    const [data, setData] = useState<ListItemData>({
        loading: true,
        id: 0,
        isClosed: false,
        artistAddress: '',
        name: '',
        topic: '',
        preview: '',
        averageTotal: 0,
        averageCount: 0,
        averageValue: '',
    });
    const [errorMessage, setErrorMessage] = useState<string>('');

    const { showAddress } = useParams<RouteParams>();

    useEffect(() => {
        const init = async () => {
            try {
                if (comedyClashRepo == null || showAddress == null) {
                    throw new Error('ShowDetails: dependencies null');
                }

                setData((prev) => ({ ...prev, loading: true }));
                const precision = await comedyClashRepo.getPrecision(showAddress);
                const isClosed = await comedyClashRepo.isClosed(showAddress);

                const scaledValue = submission.averageValue * 100n; // Scaled for two decimals
                const averageWithTwoDecimals = scaledValue / precision; // Divide by PRECISION to scale it back down
                let result = (averageWithTwoDecimals / 100n).toString(); // First divide to remove the scaling
                const remainder = averageWithTwoDecimals % 100n; // Get the remainder for the fractional part
                if (remainder !== 0n) {
                    result += '.' + remainder.toString().padStart(2, '0'); // Append the fractional part with 2 decimals
                }

                setData((prev) => ({
                    ...prev,
                    loading: false,
                    id: submission.id,
                    isClosed: isClosed,
                    name: submission.name,
                    topic: submission.topic,
                    preview: submission.preview,
                    averageTotal: submission.averageTotal,
                    averageCount: submission.averageCount,
                    averageValue: result,
                }));

            } catch (error: unknown) {
                if (error instanceof Error) {
                    setErrorMessage(error.message);
                } else {
                    console.error('An unknown error occurred');
                }
            }
        }

        init();
    }, [comedyClashRepo, address, index, submission]);

    const handleNavigate = () => {
        console.log(`SubmissionListItem: submission address:${address}`);

        router.push(`/showdetails/${showAddress}/createvoting/${address}`);
    };

    let content;

    if (data.loading) {
        content = <tr><td>Loading...</td></tr>;
    } else if (isNotNullOrEmpty(errorMessage)) {
        content = <tr><td>Error: {errorMessage}</td></tr>;
    } else {
        content = (
            <tr >
                <td>{data.name}</td>
                <td>{data.topic}</td>
                <td>{data.preview}</td>
                <td>{data.averageCount}</td>
                <td>{data.averageValue}</td>
                <td>
                    {!data.isClosed && (
                        <Button basic
                            disabled={data.loading || !canWrite}
                            onClick={handleNavigate}>
                            Vote
                        </Button>
                    )}
                </td>
            </tr >
        );
    }

    return (content);
}