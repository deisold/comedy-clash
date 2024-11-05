"use client"

import React from 'react';
import { useEffect, useState } from 'react';

import { useAppContext } from '@/app/components/providers';
import { Button } from 'semantic-ui-react';
import { useRouter } from 'next/navigation';

export default function ShowListItem({ index }) {
    const { comedyTheaterRepo } = useAppContext();
    const { comedyClashRepo } = useAppContext();
    const router = useRouter();

    const [showDetails, setShowDetails] = useState({
        address: null,
        description: null,
        isClosed: true,
        submissionCount: 0,
    });

    useEffect(() => {
        const init = async () => {
            try {
                const showAddress = await comedyTheaterRepo.getShowAdress(index);
                console.log(`showAddress=${showAddress}`);

                const description = await comedyClashRepo.getDescription(showAddress);
                const isClosed = await comedyClashRepo.isClosed(showAddress);
                const submissionCount = await comedyClashRepo.getSubmissionCount(showAddress);
                console.log(`isClosed=${isClosed}`);

                setShowDetails({
                    address: showAddress,
                    description: description,
                    isClosed: isClosed,
                    submissionCount: submissionCount,
                });

            } catch (err) {
                console.error(err);
            }
        }

        init();
    }, []);

    const handleNavigate = () => {
        console.log(`showDetails.address:${showDetails.address}`);
        
        router.push(`/showdetails/${showDetails.address}`);
    };

    return (
        <tr >
            <td>{index}</td>
            <td>{showDetails.description}</td>
            <td>{showDetails.submissionCount}</td>
            <td>
                <Button basic
                    disabled={showDetails.address == null}
                    onClick={handleNavigate}>
                    Show
                </Button>
            </td>
        </tr>
    );
}
