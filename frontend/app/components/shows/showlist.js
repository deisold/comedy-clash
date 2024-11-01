"use client"

import React from 'react';
import { useEffect, useState } from 'react';

import { useAppContext } from '@/app/components/providers';

import ShowListItem from '../showlistitem/showlistitem'

export default function Home() {
    const { comedyTheaterRepo } = useAppContext();
    const { comedyClashRepo } = useAppContext();

    const [showAmount, setShowAmount] = useState(null);

    useEffect(() => {
        const init = async () => {
            try {
                const amount = await comedyTheaterRepo.getShowAmount();
                console.log(`amount=${amount}`);
                setShowAmount(amount);

                // get all show details

            } catch (err) {
                console.error(err);
            }
        }

        init();
    }, []);

    return (
        <div>
            <h2>The number of shows: {showAmount}</h2>
            {Array.from({ length: showAmount }, (_, index) => (
                <ShowListItem key={index} index={index} />
            ))}

        </div>
    );
}
