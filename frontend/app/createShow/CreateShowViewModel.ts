import { useAppContext } from '@/app/components/providers/providers';
import { validateShowInputUseCase, ShowInputErrorMessages, hasNoErrors } from '@/app/createShow/useCases/ValidateShowInput';
import { useState, useRef, useEffect, useCallback } from 'react';
import { ViewModelEventEmitter } from '@/app/source/common/CommonEvents';
import { InputChangeEvent } from '../source/common/CommonTypes';
import { useTxUseCase, TxUseCaseState, TxUseCaseStateEnum } from '../source/useCase/useTxUseCase';

export interface CreateShowState {
    description: string;
    days: string;
    isManager: boolean;
    loading: boolean;
    successMessage: string;
    errorMessage: string;
    errors: ErrorMessages;
    submitted: boolean;
}

export interface ErrorMessages {
    description: string;
    days: string;
}

export interface CreateShowViewModelActions {
    onChangeDescription: (e: InputChangeEvent) => void;
    onChangeDays: (e: InputChangeEvent) => void;
    onSubmit: () => void;
}

export const useCreateShowViewModel = () => {
    const { comedyTheaterRepo, isManager: appIsManager } = useAppContext();
    const eventEmitter = useRef(new ViewModelEventEmitter()).current;

    const {
        state: addShowTxState,
        start: addShowTxStart,
        abortControllerRef: addShowTxAbortControllerRef
    } = useTxUseCase(
        'CreateShowViewModel::addShow',
        () => comedyTheaterRepo!!.addShow(state.description, Number(state.days)),
    );

    const [state, setState] = useState<CreateShowState>({
        description: '',
        days: '',
        isManager: appIsManager,
        loading: false,
        successMessage: '',
        errorMessage: '',
        errors: { description: '', days: '' },
        submitted: false,
    });

    useEffect(() => {
        if (!appIsManager) {
            setState(prevState => ({ ...prevState, errorMessage: 'You are not authorized to create a show' }));
        }
    }, [appIsManager]);

    // Function to handle transaction state changes
    const handleTransactionStateChange = (state: TxUseCaseState) => {
        const { msg } = state;
        switch (state.state) {
            case TxUseCaseStateEnum.Launched:
                setState(prevState => ({ ...prevState, loading: true }));
                break;
            case TxUseCaseStateEnum.TxCreated:
            case TxUseCaseStateEnum.TxConfirmed:
                setState(prevState => ({
                    ...prevState, successMessage: msg,
                    loading: state.state === TxUseCaseStateEnum.TxConfirmed ? false : prevState.loading
                }));
                eventEmitter.emit('success', { type: 'success', message: msg });
                break;
            case TxUseCaseStateEnum.Error:
                setState(prevState => ({ ...prevState, errorMessage: msg, loading: false }));
                eventEmitter.emit('error', { type: 'error', message: msg });
                break;
            default:
                break;
        }
    };

    // Handle the transaction state from the txUseCase
    useEffect(() => {
        handleTransactionStateChange(addShowTxState);
    }, [addShowTxState]);

    const actions: CreateShowViewModelActions = {
        onChangeDescription: (e: InputChangeEvent) => {
            setState(prevState => ({
                ...prevState,
                description: e.target.value,
                errors: { ...prevState.errors, description: '' },
                submitted: false
            }));
        },
        onChangeDays: (e: InputChangeEvent) => {
            setState(prevState => ({
                ...prevState,
                days: e.target.value,
                errors: { ...prevState.errors, days: '' },
                submitted: false
            }));
        },
        onSubmit: async () => {
            // eventEmitter.emit('success', { type: 'success', message: 'TEST' });
            setState(prevState => ({ ...prevState, submitted: true }));

            const errors: ShowInputErrorMessages = validateShowInputUseCase(state.description, state.days);
            setState(prevState => ({ ...prevState, errors }));

            if (hasNoErrors(errors)) {
                // Start the transaction use case
                addShowTxStart();
                return () => addShowTxAbortControllerRef.current?.abort();
            }
        }
    };

    return { state, actions, eventEmitter };
};

