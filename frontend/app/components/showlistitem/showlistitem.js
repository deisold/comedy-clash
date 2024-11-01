"use client"

import React from 'react';
import { useEffect, useState } from 'react';

import { useAppContext } from '@/app/components/providers';

export default function ShowListItem({ index }) {
    const { comedyTheaterRepo } = useAppContext();
    const { comedyClashRepo } = useAppContext();

    const [showDetails, setShowDetails] = useState({
        address: null,
        description: null,
    });

    useEffect(() => {
        const init = async () => {
            try {
                const showAddress = await comedyTheaterRepo.getShowAdress(index);
                console.log(`showAddress=${showAddress}`);

                const description = await comedyClashRepo.getDescription(showAddress);

                setShowDetails({
                    address: showAddress,
                    description: description,
                });

            } catch (err) {
                console.error(err);
            }
        }

        init();
    }, []);

    return (
        <div>
            The showAddress: {showDetails.address}
            <br/>
            Description:  {showDetails.description}
        </div>
    );
}
