// frontend/app/showdetails/page.js

"use client"

import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/app/components/providers'
import { Container, Header, Button } from 'semantic-ui-react';
import { useRouter, useParams } from 'next/navigation';

import SubmissionListItem from '@/app/components/submission-listitem/submission-listitem'

export default function ShowDetails() {
    const { comedyClashRepo } = useAppContext();
    const router = useRouter();

    const [error, setError] = useState('');
    const [details, setDetails] = useState({
        loading: false,
        description: '',
        submissionCount: 0
    });

    const { showAddress } = useParams();

    useEffect(() => {
        const init = async () => {
            setDetails(prevState => ({ ...prevState, loading: true }));

            try {
                const showDescription = await comedyClashRepo.getDescription(showAddress);
                const submissionCount = await comedyClashRepo.getSubmissionCount(showAddress);
                console.log("ShowDetails: comedyClashRepo.getDescription done");

                setDetails({
                    loading: false,
                    description: showDescription,
                    submissionCount: submissionCount,
                });
            }
            catch (err) {
                setError(err);
            }
        }
        init();
    }, []);

    let content;

    if (details.loading) {
        content = <p>Loading...</p>;
    } else if (error) {
        content = <p>Error: {error.message}</p>;
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