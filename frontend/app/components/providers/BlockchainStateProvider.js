"use client"

import React, { createContext, useContext, useState, useEffect } from 'react';
import { initWeb3Provider, isWriteProvider, getSigner, getNetwork } from '../../source/utils/web3';

const BlockchainStateContext = createContext({});

export function BlockchainStateProvider({ children }) {
    const [state, setState] = useState({
        provider: null,
        signer: null,
        currentAddress: null,
        networkId: null,
        isConnected: false,
        canWrite: false,
        isLoading: true,
        error: null
    });

    const updateBlockchainState = async (provider) => {
        console.log(`updateBlockchainState: provider=${provider}`);
        
        try {
            const network = await getNetwork(provider);
    
            const canWrite = isWriteProvider(provider);
            console.log(`updateBlockchainState: canWrite=${canWrite}`);
            
            let signer = null;
            let address = null;

            setState({
                provider,
                signer,
                currentAddress: address,
                networkId: network?.chainId,
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
                error: error.message
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
                    error: error.message
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
        if (typeof window !== 'undefined' && window.ethereum) {
            window.ethereum.on('accountsChanged', initialize);
            window.ethereum.on('chainChanged', initialize);
            window.ethereum.on('disconnect', handleDisconnect);
        }

        // Initial setup
        initialize();

        // Cleanup listeners
        return () => {
            if (typeof window !== 'undefined' && window.ethereum) {
                window.ethereum.removeListener('accountsChanged', initialize);
                window.ethereum.removeListener('chainChanged', initialize);
                window.ethereum.removeListener('disconnect', handleDisconnect);
            }
        };
    }, []);

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
