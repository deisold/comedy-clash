import { useAppContext } from '@/app/components/providers/providers';
import { validateShowInputUseCase, ShowInputErrorMessages } from '@/app/createShow/useCases/ValidateShowInput';
import { useState, useRef, useEffect } from 'react';
import { ViewModelEventEmitter } from '@/app/source/common/CommonEvents';
import { InputChangeEvent } from '../source/common/CommonTypes';

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
    const abortControllerRef = useRef<AbortController | null>(null); // Ref to store the current AbortController

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

            if (Object.values(errors).every(value => value === '')) {
                abortControllerRef.current?.abort();
                abortControllerRef.current = new AbortController();

                try {
                    setState(prevState => ({ ...prevState, loading: true, errorMessage: '' }));

                    const txResponse = await comedyTheaterRepo!!.addShow(state.description, Number(state.days));
                    var message = 'Transcation successfully created - waiting for confirmation!';
                    setState(prevState => ({ ...prevState, successMessage: message }));
                    eventEmitter.emit('success', { type: 'success', message: message });

                    console.log(`CreateShowViewModel: addShow: ${message}`);

                    await txResponse.wait();

                    message = 'Transaction confirmed!';
                    setState(prevState => ({ ...prevState, successMessage: message }));
                    eventEmitter.emit('success', { type: 'success', message: message });
                    console.log(`CreateShowViewModel: addShow: ${message}`);
                } catch (error: any) {
                    if (abortControllerRef.current?.signal.aborted) return;
                    eventEmitter.emit('error', { type: 'error', message: 'Error creating show!' });
                    console.error('CreateShowViewModel: Error creating show:', error);
                    setState(prevState => ({
                        ...prevState, errorMessage: error.message
                            || 'Failed to create show. Please try again.'
                    }));
                } finally {
                    if (abortControllerRef.current?.signal.aborted) return;
                    setState(prevState => ({ ...prevState, loading: false }));
                }

                return () => abortControllerRef.current?.abort();
            }
        }
    };

    return { state, actions, eventEmitter };
};
