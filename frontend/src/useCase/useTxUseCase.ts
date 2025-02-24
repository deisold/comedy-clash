import { useState, useCallback } from 'react';
import { ContractTransactionResponse } from 'ethers';

export const TxUseCaseState = {
    Idle: 'Idle',
    Launched: 'Launched',
    TxCreated: 'TxCreated',
    TxConfirmed: 'TxConfirmed',
    Error: 'Error'
} as const;

export type TxUseCaseStateType = typeof TxUseCaseState[keyof typeof TxUseCaseState];

export interface TxUseCaseState {
    state: TxUseCaseStateType;
    msg: string;
    txHash?: string;
}

export const useTxUseCase = (
    tag: string,
    txCallback: () => Promise<ContractTransactionResponse>,
) => {
    const [state, setState] = useState<TxUseCaseState>({ state: 'Idle', msg: '' });

    const start = useCallback(async () => {
        try {
            var msg = 'Transaction launched.';
            setState({ state: 'Launched', msg: msg });

            // Execute the transaction
            const txResponse = await txCallback();

            const txHash = txResponse.hash;
            msg = `Transaction successfully created - waiting for confirmation! (${txHash})`;
            setState({ state: 'TxCreated', msg: msg, txHash: txHash });
            console.log(`TxUseCase(${tag}): ${msg}`);

            // Wait for the transaction to be confirmed
            await txResponse.wait();

            msg = `Transaction confirmed! (${txHash})`;
            setState({ state: 'TxConfirmed', msg: msg, txHash: txHash });
            console.log(`TxUseCase(${tag}): ${msg}`);

        } catch (error: unknown) {
            if (error instanceof Error) {
                const msg = error.message || 'Error executing transaction!';
                setState({ state: 'Error', msg: msg });
                console.error(`TxUseCase(${tag}): ${msg}`);
            } else {
                const msg = 'An unknown error occurred';
                setState({ state: 'Error', msg: msg });
                console.error(`TxUseCase(${tag}): ${msg}`);
            }
        }

        return { state };
    }, [tag, txCallback]);

    return { state, start };
};
