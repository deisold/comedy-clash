"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useBlockchainState } from './BlockchainStateProvider';
import { ComedyTheaterAdapter } from '../../source/adapters/ComedyTheaterAdapter';
import { MockComedyTheaterAdapter } from '../../source/adapters/MockComedyTheaterAdapter';
import { ComedyTheaterRepo, ComedyTheaterRepoType } from '../../source/repositories/ComedyTheaterRepo'
import { ComedyClashAdapter } from '../../source/adapters/ComedyClashAdapter';
import { MockComedyClashAdapter } from '../../source/adapters/MockComedyClashAdapter';
import { ComedyClashRepo, ComedyClashRepoType } from '../../source/repositories/ComedyClashRepo';
import { LoadingSpinner } from '../ui/LoadingSpinner';

interface AppContextType {
    comedyTheaterRepo: ComedyTheaterRepoType | null;
    comedyClashRepo: ComedyClashRepoType | null;
    isManager: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
    children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
    const [state, setState] = useState<{
        isLoading: boolean;
        error: unknown;
        comedyTheaterRepo: ComedyTheaterRepoType | null;
        comedyClashRepo: ComedyClashRepoType | null;
        isManager: boolean;
    }>({
        isLoading: true,
        error: null,
        comedyTheaterRepo: null,
        comedyClashRepo: null,
        isManager: false
    });

    const { isLoading: blockchainInitLoading, provider, error: blockchainError } = useBlockchainState();
    console.log(`AppProvider: blockchainInitLoading=${blockchainInitLoading}`);

    const useMockData = JSON.parse(process.env.NEXT_PUBLIC_USE_MOCKDATA as string);
    const comedyTheaterAddress = process.env.NEXT_PUBLIC_COMEDY_THEATER_ADDRESS;

    useEffect(() => {
        const init = async () => {
            console.log(`AppProvider: init: blockchainInitLoading=${blockchainInitLoading}`);

            if (blockchainInitLoading) {
                return; // Wait until the blockchain state is ready
            }

            if (blockchainError) {
                setState(prev => ({
                    ...prev,
                    error: blockchainError
                }));
                return;
            }

            try {
                console.log(`AppProvider: init: provider=${provider}`);

                if (!comedyTheaterAddress) {
                    throw new Error('Comedy Theater contract address not configured');
                }

                const theaterRepo = ComedyTheaterRepo(
                    useMockData
                        ? MockComedyTheaterAdapter()
                        : ComedyTheaterAdapter(provider!!, comedyTheaterAddress)
                );

                const clashRepo = ComedyClashRepo(
                    provider!!,
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
            } catch (error: any) {
                console.error('Failed to initialize repositories:', error);
                setState(prev => ({
                    ...prev,
                    isLoading: false,
                    error: error.message || 'Failed to initialize application'
                }));
            }
        };

        init();
    }, [blockchainInitLoading, provider]);

    if (state.isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen" >
                <LoadingSpinner />
                < p className="ml-2" > Initializing application...</p>
            </div>
        );
    }

    if (state.error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen" >
                <div className="text-red-500 mb-4" >
                    {state.error.toString()}
                </div>
                < button
                    onClick={() => window.location.reload()
                    }
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
