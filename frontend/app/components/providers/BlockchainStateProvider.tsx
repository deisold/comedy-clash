"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initWeb3Provider, isWriteProvider, getNetwork, getSigner } from '../../source/utils/web3';
import { ethers, Provider, Signer } from 'ethers';

interface BlockchainStateType {
    provider: Provider | null;
    signer: Signer | null;
    currentAddress: string | null;
    networkId: number | null;
    isConnected: boolean;
    canWrite: boolean;
    isLoading: boolean;
    error: string | null;
}

export const BlockchainStateContext = createContext<BlockchainStateType | undefined>(undefined);

export function BlockchainStateProvider({ children }: { children: ReactNode }) {

    const [state, setState] = useState<BlockchainStateType>({
        provider: null,
        signer: null,
        currentAddress: null,
        networkId: null,
        isConnected: false,
        canWrite: false,
        isLoading: true,
        error: null
    });

    const updateBlockchainState = async (provider: ethers.Provider) => {
        console.log(`updateBlockchainState: provider=${provider}`);

        try {
            const network = await getNetwork(provider);
            const canWrite = isWriteProvider(provider);
            const signer = canWrite ? await getSigner(provider) : null;
            console.log(`updateBlockchainState: canWrite=${canWrite}, signer=${signer}`);

            let address = null;

            setState({
                provider,
                signer,
                currentAddress: address,
                networkId: network?.chainId ? Number(network.chainId) : null,
                isConnected: !!address,
                canWrite,
                isLoading: false,
                error: null
            });
        } catch (error) {
            console.error('Failed to update blockchain state:', error);
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: (error as Error).message
            }));
        }
    };

    // Initial setup
    useEffect(() => {
        const initialize = async () => {
            try {
                const provider = await initWeb3Provider();
                await updateBlockchainState(provider);
            } catch (error) {
                console.error('Failed to initialize blockchain state:', error);
                setState(prev => ({
                    ...prev,
                    isLoading: false,
                    error: (error as Error).message
                }));
            }
        };

        // Store disconnect handler as a reference so we can remove it later
        const handleDisconnect = () => {
            setState(prev => ({
                ...prev,
                isConnected: false,
                canWrite: false,
                currentAddress: null,
                signer: null
            }));
        };

        // Set up listeners
        if (typeof window !== 'undefined' && (window as any).ethereum) {
            (window as any).ethereum.on('accountsChanged', initialize);
            (window as any).ethereum.on('chainChanged', initialize);
            (window as any).ethereum.on('disconnect', handleDisconnect);
        }

        // Initial setup
        initialize();

        // Cleanup listeners
        return () => {
            if (typeof window !== 'undefined' && (window as any).ethereum) {
                (window as any).ethereum.removeListener('accountsChanged', initialize);
                (window as any).ethereum.removeListener('chainChanged', initialize);
                (window as any).ethereum.removeListener('disconnect', handleDisconnect);
            }
        };
    }, []);

    BlockchainStateContext.displayName = 'BlockchainStateContext';

    return (
        <BlockchainStateContext.Provider
            value={{
                ...state,
            }}
        >
            {children}
        </BlockchainStateContext.Provider>
    );
}

export function useBlockchainState() {
    const context = useContext(BlockchainStateContext);
    if (context === undefined) {
        throw new Error('useBlockchainState must be used within a BlockchainStateProvider');
    }
    return context;
}
