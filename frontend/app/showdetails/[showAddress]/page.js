// frontend/app/showdetails/page.js

"use client"

import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/app/components/providers'
import { Button } from 'semantic-ui-react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';

import SubmissionListItem from '@/app/components/submission-listitem/submission-listitem'

export default function ShowDetails() {
    const { comedyClashRepo } = useAppContext();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [details, setDetails] = useState({
        loading: false,
        description: '',
        submissionCount: 0
    });

    const { showAddress } = useParams();

    useEffect(() => {
        const controller = new AbortController();

        const init = async () => {
            try {
                setLoading(true);
                setError('');

                const showDescription = await comedyClashRepo.getDescription(showAddress);

                if (controller.signal.aborted) return;
                const submissionCount = await comedyClashRepo.getSubmissionCount(showAddress);

                if (controller.signal.aborted) return;

                setDetails({
                    description: showDescription,
                    submissionCount: submissionCount,
                });
            }
            catch (err) {
                if (controller.signal.aborted) return;

                setError(err.message || 'Failed to load show details');
                toast.error(err.message || 'Failed to load show details');
            }
            finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        init();

        return () => controller.abort();
    }, [comedyClashRepo, showAddress]);

    let content;

    if (loading) {
        content = <p>Loading...</p>;
    } else if (error) {
        content = (
            <div className="error-container">
                <p className="text-red-600">Error: {error}</p>
                <Button onClick={() => window.location.reload()}>
                    Try Again
                </Button>
            </div>
        );
    } else {
        content = (
            <div>
                <h3>Show: {details.description}</h3>
                <h4>Submissions: {details.submissionCount}</h4>
                <table>
                    <thead>
                        <tr>
                            <th>Artist</th>
                            <th>Topic</th>
                            <th>Preview</th>
                            <th>Votes #</th>
                            <th>Average</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.from({ length: details.submissionCount }, (_, index) => (
                            <SubmissionListItem key={index} address={showAddress} index={index} />
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div>
            <h1>Comedy Clash Description</h1>
            {content}
        </div>
    );
}