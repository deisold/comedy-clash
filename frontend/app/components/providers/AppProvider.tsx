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
import RetryButton from '../ui/RetryButton';
import axios from 'axios';
import { ShowApiAdapter } from '../../source/adapters/api/ShowApiAdapter';
import { ShowRepository, ShowRepositoryType } from '../../source/repositories/ShowRepo';
import { ShowService, ShowServiceType } from '../../source/service/ShowService';
import { WebSocketInstance, WebSocketInstanceType } from '../../source/websocket/Websocket';
//
interface AppContextType {
    showService: ShowServiceType | null;
    comedyTheaterRepo: ComedyTheaterRepoType | null;
    comedyClashRepo: ComedyClashRepoType | null;
    isManager: boolean;
    showRepo: ShowRepositoryType | null;
    websocket: WebSocketInstanceType | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
    children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
    const [state, setState] = useState<{
        isLoading: boolean;
        error: unknown;
        showService: ShowServiceType | null;
        showRepo: ShowRepositoryType | null;
        comedyTheaterRepo: ComedyTheaterRepoType | null;
        comedyClashRepo: ComedyClashRepoType | null;
        isManager: boolean;
        websocket: WebSocketInstanceType | null;
    }>({
        isLoading: true,
        error: null,
        showService: null,
        showRepo: null,
        comedyTheaterRepo: null,
        comedyClashRepo: null,
        isManager: false,
        websocket: null
    });

    const { isLoading: blockchainInitLoading, provider, signer, error: blockchainError } = useBlockchainState();
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
                const useHttps = JSON.parse(process.env.NEXT_PUBLIC_USE_HTTPS as string);
                //
                const apiHost = process.env.NEXT_PUBLIC_API_HOST;
                const apiPort = process.env.NEXT_PUBLIC_API_PORT;
                const apiPath = process.env.NEXT_PUBLIC_API_PATH;
                if (!apiHost || !apiPort || !apiPath) {
                    throw new Error('API configuration is missing');
                }
                const protocolApi = useHttps ? 'https://' : 'http://';
                const apiUrl = `${protocolApi}${apiHost}:${apiPort}${apiPath}`;

                const httpClient = axios.create({
                    baseURL: apiUrl,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const websocketHost = process.env.NEXT_PUBLIC_WEBSOCKET_HOST;
                const websocketPort = process.env.NEXT_PUBLIC_WEBSOCKET_PORT;
                const websocketMaxRetries = process.env.NEXT_PUBLIC_WEBSOCKET_MAX_RETRIES;
                const websocketRetryDelayMs = process.env.NEXT_PUBLIC_WEBSOCKET_RETRY_DELAY_MS;
                if (!websocketHost || !websocketPort || !websocketMaxRetries || !websocketRetryDelayMs) {
                    throw new Error('WebSocket configuration is missing');
                }
                //
                const protocolWebSocket = useHttps ? 'wss://' : 'ws://';
                const websocketUrl = `${protocolWebSocket}${websocketHost}:${websocketPort}`;

                const websocket = WebSocketInstance(websocketUrl, parseInt(websocketMaxRetries), parseInt(websocketRetryDelayMs));
                websocket.start();
                //
                const showApiAdapter = ShowApiAdapter(httpClient);
                const showRepo = ShowRepository(showApiAdapter);

                const theaterRepo = ComedyTheaterRepo(
                    useMockData
                        ? MockComedyTheaterAdapter()
                        : ComedyTheaterAdapter(provider!!, signer, comedyTheaterAddress)
                );

                const clashRepo = ComedyClashRepo(
                    provider!!,
                    signer,
                    useMockData ? MockComedyClashAdapter : ComedyClashAdapter
                );

                const showService = ShowService(
                    theaterRepo,
                    clashRepo,
                    showRepo
                );

                const isManager = await theaterRepo.isManager();
                console.log("isManager", isManager);

                setState({
                    isLoading: false,
                    error: null,
                    showService: showService,
                    showRepo: showRepo,
                    comedyTheaterRepo: theaterRepo,
                    comedyClashRepo: clashRepo,
                    isManager: isManager,
                    websocket: websocket
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
                <RetryButton onClick={() => window.location.reload()} />
            </div>
        );
    }

    return (
        <AppContext.Provider value={{
            showService: state.showService,
            showRepo: state.showRepo,
            comedyTheaterRepo: state.comedyTheaterRepo,
            comedyClashRepo: state.comedyClashRepo,
            isManager: state.isManager,
            websocket: state.websocket
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
