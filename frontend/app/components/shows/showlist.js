"use client"

import React from 'react';
import { useEffect, useState } from 'react';

import { ComedyTheaterAdapter } from '../../source/adapters/ComedyTheaterAdapter';
import { MockComedyTheaterAdapter } from '../../source/adapters/MockComedyTheaterAdapter';
import { ComedyTheaterRepo } from '../../source/repositories/ComedyTheaterRepo'

const isDevelopment = process.env.NODE_ENV === 'development';

const comedyTheaterAddress = "0x907b77166997FD2f8b347301AD76A30ab11FD908";
const comedyTheaterRepo = ComedyTheaterRepo(isDevelopment
    ? MockComedyTheaterAdapter() : ComedyTheaterAdapter(comedyTheaterAddress));

export default function Home() {
    const [data, setData] = useState(null);

    useEffect(() => {
        const initializeComedyTheater = async () => {

            try {
                const amount = await comedyTheaterRepo.getShowAmount();
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
