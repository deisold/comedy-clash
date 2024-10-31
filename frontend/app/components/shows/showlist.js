"use client"

import React from 'react';
import { useEffect, useState } from 'react';

import { useAppContext } from '@/app/components/providers';

export default function Home() {
    const { comedyTheaterRepo } = useAppContext();

    const [data, setData] = useState(null);

    useEffect(() => {
        const init = async () => {
            try {
                const amount = await comedyTheaterRepo.getShowAmount();
                console.log(`amount=${amount}`);
                setData(amount);
            } catch (err) {
                console.error(err);
            }
        }

        init();
    }, []);

    return (
        <div>
            <h2>The number of shows: {data}</h2>
        </div>
    );
}
