"use client"

import { createContext, useContext, useState, useEffect } from 'react';
import { initWeb3Provider } from '../source/utils/web3';
import { BlockchainStateProvider } from './providers/BlockchainStateProvider';
import { ComedyTheaterAdapter } from '../source/adapters/ComedyTheaterAdapter';
import { MockComedyTheaterAdapter } from '../source/adapters/MockComedyTheaterAdapter';
import { ComedyTheaterRepo } from '../source/repositories/ComedyTheaterRepo'

import { ComedyClashAdapter } from '../source/adapters/ComedyClashAdapter';
import { MockComedyClashAdapter } from '../source/adapters/MockComedyClashAdapter';
import { ComedyClashRepo } from '../source/repositories/ComedyClashRepo'

import { LoadingSpinner } from '../components/ui/LoadingSpinner';

const AppContext = createContext({
    comedyTheaterRepo: null,
    comedyClashRepo: null,
    isManager: false
});

export function AppProvider({ children }) {
    const [state, setState] = useState({
        isLoading: true,
        error: null,
        comedyTheaterRepo: null,
        comedyClashRepo: null,
        isManager: false
    });
    
    const useMockData = JSON.parse(process.env.NEXT_PUBLIC_USE_MOCKDATA || false);
    const comedyTheaterAddress = process.env.NEXT_PUBLIC_COMEDY_THEATER_ADDRESS;

    useEffect(() => {
        const init = async () => {
            try {
                if (!comedyTheaterAddress && !useMockData) {
                    throw new Error('Comedy Theater contract address not configured');
                }

                const provider = await initWeb3Provider();
                
                const theaterRepo = ComedyTheaterRepo(
                    useMockData 
                        ? MockComedyTheaterAdapter()
                        : ComedyTheaterAdapter(provider, comedyTheaterAddress)
                );

                const clashRepo = ComedyClashRepo(
                    provider, 
                    useMockData ? MockComedyClashAdapter : ComedyClashAdapter
                );

                const isManager = await theaterRepo.isManager();
                console.log("isManager", isManager);

                setState({
                    isLoading: false,
                    error: null,
                    comedyTheaterRepo: theaterRepo,
                    comedyClashRepo: clashRepo,
                    isManager
                });
            } catch (error) {
                console.error('Failed to initialize repositories:', error);
                setState(prev => ({
                    ...prev,
                    isLoading: false,
                    error: error.message || 'Failed to initialize application'
                }));
            }
        };

        init();
    }, []);

    if (state.isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner /> 
                <p className="ml-2">Initializing application...</p>
            </div>
        );
    }

    if (state.error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <div className="text-red-500 mb-4">
                    {state.error}
                </div>
                <button 
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <AppContext.Provider value={{ 
            comedyTheaterRepo: state.comedyTheaterRepo, 
            comedyClashRepo: state.comedyClashRepo,
            isManager: state.isManager
        }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
}

export function Providers({ children }) {
    return (
        <BlockchainStateProvider>
            <AppProvider>
                {children}
            </AppProvider>
        </BlockchainStateProvider>
    );
}
