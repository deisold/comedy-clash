"use client"

import React from 'react';
import { useEffect, useState } from 'react';

import { useAppContext } from '@/app/components/providers';
import { Button } from 'semantic-ui-react';
// import 'semantic-ui-css/semantic.min.css';

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
            <div>
                <h2>The number of shows: {showAmount}</h2>
                <Button primary floated='right'>
                    Add Show
                </Button>
            </div>
            <br />
            <table>
                <thead>
                    <tr>
                        <th>Number</th>
                        <th>Description</th>
                        <th>Submission Count</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: showAmount }, (_, index) => (
                        <ShowListItem key={showAmount - 1 - index} index={showAmount - 1 - index} />
                    ))}
                </tbody>
            </table>

        </div>
    );
}
