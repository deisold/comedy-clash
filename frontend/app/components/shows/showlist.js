"use client"

import React from 'react';
import { useEffect, useState } from 'react';

import { initComedyTheater } from '../../../src/comedyTheater';

export default function Home() {
    const [data, setData] = useState(null);

    useEffect(() => {
        const initializeComedyTheater = async () => {

            try {
                const comedyTheater = await initComedyTheater();

                const amount = await comedyTheater.getShowAmount();
                console.log(`amount=${amount}`);
                setData(amount);
            } catch (err) {
                console.error(err);
            }
        }

        initializeComedyTheater();
    }, []);

    return (
        <div>
            <h2>The number of shows: {data}</h2>
        </div>
    );
}
