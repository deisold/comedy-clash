"use client"

import React, { useEffect, useState } from 'react';
import { useAppContext } from '@/app/components/providers/providers';
import { Button } from 'semantic-ui-react';
import { useRouter } from 'next/navigation';
import ShowListItem from '../showlistitem/showlistitem'

export default function Home() {
    const { comedyTheaterRepo, isManager } = useAppContext();
    const router = useRouter();

    // isManager is true if the user is the manager of the theater (contract) AND can write to the blockchain
    const [showAmount, setShowAmount] = useState<number>(0);

    const handleNavigate = () => {
        router.push('/createShow');
    };

    useEffect(() => {
        const init = async () => {
            try {
                const amount: number = await comedyTheaterRepo!!.getShowAmount();
                console.log(`amount=${amount}`);
                setShowAmount(amount);
            } catch (err) {
                console.error(err);
            }
        };

        init();
    }, [comedyTheaterRepo]);

    return (
        <div>
            <div>
                <h2>The number of shows: {showAmount}</h2>
                <Button
                    primary
                    floated='right'
                    style={{ display: !isManager ? 'none' : undefined }}
                    disabled={!isManager}
                    onClick={handleNavigate}>
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

        </div >
    );
}
