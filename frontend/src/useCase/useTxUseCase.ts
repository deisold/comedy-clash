import { useState, useRef, useCallback } from 'react';
import { ContractTransactionResponse } from 'ethers';

export enum TxUseCaseStateEnum {
    Idle = 'Idle',
    Launched = 'Launched',
    TxCreated = 'TxCreated',
    TxConfirmed = 'TxConfirmed',
    Error = 'Error',
}

export interface TxUseCaseState {
    state: TxUseCaseStateEnum;
    msg: string;
}

export const useTxUseCase = (
    tag: string,
    txCallback: () => Promise<ContractTransactionResponse>,
) => {
    const [state, setState] = useState<TxUseCaseState>({
        state: TxUseCaseStateEnum.Idle,
        msg: '',
    });

    const abortControllerRef = useRef<AbortController | null>(null); // Ref to store the current AbortController

    const start = useCallback(async () => {
        try {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            // Create a new AbortController for this request
            abortControllerRef.current = new AbortController();

            var msg = 'Transaction launched.';
            setState({ state: TxUseCaseStateEnum.Launched, msg: msg });

            // Execute the transaction
            const txResponse = await txCallback();
            if (abortControllerRef.current?.signal.aborted) return;

            msg = 'Transaction successfully created - waiting for confirmation!';
            setState({ state: TxUseCaseStateEnum.TxCreated, msg: msg });
            console.log(`TxUseCase(${tag}): ${msg}`);

            // Wait for the transaction to be confirmed
            await txResponse.wait();
            if (abortControllerRef.current?.signal.aborted) return;

            msg = 'Transaction confirmed!';
            setState({ state: TxUseCaseStateEnum.TxConfirmed, msg: msg });
            console.log(`TxUseCase(${tag}): ${msg}`);

        } catch (error: unknown) {
            if (abortControllerRef.current?.signal.aborted) return;
            if (error instanceof Error) {
                const msg = error.message || 'Error executing transaction!';
                setState({ state: TxUseCaseStateEnum.Error, msg: msg });
                console.error(`TxUseCase(${tag}): ${msg}`);
            } else {
                const msg = 'An unknown error occurred';
                setState({ state: TxUseCaseStateEnum.Error, msg: msg });
                console.error(`TxUseCase(${tag}): ${msg}`);
            }
        }

        return { state };
    }, [tag, txCallback]);

    return { state, start, abortControllerRef };
};
