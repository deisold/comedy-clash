// frontend/app/components/submission-listitem/submission-listitem.js

"use client"

import React from 'react';
import { useEffect, useState } from 'react';

import { useAppContext } from '@/app/components/providers';
import { Button } from 'semantic-ui-react';
import { useRouter, useParams } from 'next/navigation';

export default function SubmissionListItem({ address, index }) {
    const { comedyClashRepo } = useAppContext();
    const router = useRouter();

    const [data, setData] = useState({ loading: true });
    const [error, setError] = useState(null);

    const { showAddress } = useParams();

    useEffect(() => {
        const init = async () => {
            try {
                setData({ loading: true });
                const precision = await comedyClashRepo.getPrecision();
                const isClosed = await comedyClashRepo.isClosed(showAddress);
                const submission = await comedyClashRepo.getSubmission(address, index);

                const scaledValue = submission.averageValue * 100n; // Scaled for two decimals
                const averageWithTwoDecimals = scaledValue / precision; // Divide by PRECISION to scale it back down
                let result = (averageWithTwoDecimals / 100n).toString(); // First divide to remove the scaling
                const remainder = averageWithTwoDecimals % 100n; // Get the remainder for the fractional part
                if (remainder !== 0n) {
                    result += '.' + remainder.toString().padStart(2, '0'); // Append the fractional part with 2 decimals
                }

                setData({
                    loading: false,
                    id: submission.id,
                    isClosed: isClosed,
                    artistAddress: submission.artist,
                    name: submission.name,
                    topic: submission.topic,
                    preview: submission.preview,
                    votes: submission.votes,
                    averageTotal: submission.averageTotal,
                    averageCount: submission.averageCount,
                    averageValue: result,
                });
            } catch (error) {
                setError(error);
            }
        }

        init();
    }, [comedyClashRepo, address, index]);

    const handleNavigate = () => {
        console.log(`SubmissionListItem: submission address:${address}`);

        router.push(`/showdetails/${showAddress}/createvoting/${address}`);
    };

    let content;

    if (data.loading) {
        content = <tr><td>Loading...</td></tr>;
    } else if (error) {
        content = <tr><td>Error: {error.message}</td></tr>;
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
                            disabled={data.loading}
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