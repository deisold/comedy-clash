// frontend/app/showdetails/page.js

"use client"

import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../components/providers';
import { FormInput, Form, Button } from 'semantic-ui-react';
import { useRouter, useParams } from 'next/navigation';

export default function ShowDetails() {
    const { comedyClashRepo } = useAppContext();
    const router = useRouter();

    const [error, setError] = useState('');
    const [details, setDetails] = useState({
        loading: false,
        description: '',
    });

    const {address} = useParams();

    useEffect(() => {
        const init = async () => {
            setDetails(prevState => ({ ...prevState, loading: true }));

            try {
                const showDescription = await comedyClashRepo.getDescription(address);
               console.log("ShowDetails: comedyClashRepo.getDescription done");
               
                setDetails({
                    loading: false,
                    description: showDescription,
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
            <h3>Show: {details.description}</h3>
        );
    }

    return (
        <div>
            <h1>Comedy Clash Description</h1>
            {content}
        </div>
    );
}