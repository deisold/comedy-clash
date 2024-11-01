// context.js

"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { initWeb3Provider } from '../source/utils/web3';

import { ComedyTheaterAdapter } from '../source/adapters/ComedyTheaterAdapter';
import { MockComedyTheaterAdapter } from '../source/adapters/MockComedyTheaterAdapter';
import { ComedyTheaterRepo } from '../source/repositories/ComedyTheaterRepo'

const comedyTheaterAddress = "0x907b77166997FD2f8b347301AD76A30ab11FD908";

// // Step 1: Create the Context
const AppContext = createContext();

// Step 2: Create a Provider Component
export const AppProvider = ({ children }) => {
    const useMockData = JSON.parse(process.env.NEXT_PUBLIC_USE_MOCKDATA || false);
    console.log(`USE_MOCKDATA=${useMockData}`);

    const [initLoading, setInitLoading] = useState(true);
    const [comedyTheaterRepo, setComedyTheaterRepo] = useState(null);

    useEffect(() => {
        const init = async () => {
            setInitLoading(true);
            const web3Provider = await initWeb3Provider();

            setComedyTheaterRepo(ComedyTheaterRepo(useMockData ? MockComedyTheaterAdapter() :
                ComedyTheaterAdapter(web3Provider, comedyTheaterAddress)));

            setInitLoading(false);
        };
        init();
    }, []);


    // const comedyTheaterRepo = useMemo(() =>
    //     ComedyTheaterRepo(useMockData ? MockComedyTheaterAdapter() :
    //         ComedyTheaterAdapter(comedyTheaterAddress)), []);

    // Define the state you want to share
    // const [myState, setMyState] = useState("Initial State");

    // // Function to update the state
    // const updateMyState = (newState) => {
    //     setMyState(newState);
    // };

    if (initLoading) {
        return <p>Loading...</p>; // Loading indicator
    }

    return (
        <AppContext.Provider value={{ comedyTheaterRepo }}>
            {children}
        </AppContext.Provider>
    );
};

// Custom hook to use the context easily
export const useAppContext = () => useContext(AppContext);
