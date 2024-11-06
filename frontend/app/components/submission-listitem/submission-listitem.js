"use client"

import React from 'react';
import { useEffect, useState } from 'react';

import { useAppContext } from '@/app/components/providers';
import { Button } from 'semantic-ui-react';
import { useRouter } from 'next/navigation';

export default function SubmissionListItem({ address, index }) {
    const { comedyClashRepo } = useAppContext();
    const router = useRouter();

    const [data, setData] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        const init = async () => {
            try {
                setData({ loading: true });
                const precision = await comedyClashRepo.getPrecision();
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
    }, []);

    const handleNavigate = () => {
        console.log(`SubmissionListItem: submission address:${address}`);
        
        // router.push(`/showdetails/${showDetails.address}`);
    };

    return (
        <tr >
            <td>{data.name}</td>
            <td>{data.topic}</td>
            <td>{data.preview}</td>
            <td>{data.averageCount}</td>
            <td>{data.averageValue}</td>
            <td>
                <Button basic
                    disabled={data.loading}
                    onClick={handleNavigate}>
                    Vote
                </Button>
                </td>
        </tr >
    );
}