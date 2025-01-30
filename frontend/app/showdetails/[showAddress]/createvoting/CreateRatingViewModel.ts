import { useAppContext } from '../../../components/providers/providers';
import { validateRatingInputUseCase, RatingInputErrorMessages } from './useCases/ValidateRatingInput';
import { useState, useRef } from 'react';
import { ViewModelEventEmitter } from '@/app/source/common/CommonEvents';
import { useBlockchainState } from '../../../components/providers/BlockchainStateProvider';
import _ from 'lodash';
import { InputChangeEvent } from '@/app/source/common/CommonTypes';

export interface CreateRatingState {
    name: string;
    comment: string;
    value: string;
    loading: boolean;
    successMessage: string;
    errorMessage: string;
    errors: RatingInputErrorMessages;
    submitted: boolean;
    canWrite: boolean;
}

export interface CreateRatingViewModelActions {
    onChangeName: (e: InputChangeEvent) => void;
    onChangeComment: (e: InputChangeEvent) => void;
    onChangeValue: (e: InputChangeEvent) => void;
    onSubmit: () => void;
}

export const useCreateRatingViewModel = (showAddress: string, submissionIndex: string) => {
    const { canWrite } = useBlockchainState();
    const { comedyClashRepo } = useAppContext();
    const eventEmitter = useRef(new ViewModelEventEmitter()).current;
    const abortControllerRef = useRef<AbortController | null>(null); // Ref to store the current AbortController

    const isValidNumber = _.isFinite(_.toNumber(submissionIndex));
    if (comedyClashRepo == null || showAddress == null || !isValidNumber) {
        throw new Error('CreateRatingViewModel: dependencies null');
    }

    const [state, setState] = useState<CreateRatingState>({
        name: '',
        comment: '',
        value: '',
        loading: false,
        successMessage: '',
        errorMessage: '',
        errors: { name: '', comment: '', value: '' },
        submitted: false,
        canWrite: canWrite
    });

    const actions: CreateRatingViewModelActions = {
        onChangeName: (e: InputChangeEvent) => {
            setState(prevState => ({
                ...prevState,
                name: e.target.value,
                errors: { ...prevState.errors, name: '' },
                errorMessage: '',
                submitted: false
            }));
        },
        onChangeComment: (e: InputChangeEvent) => {
            setState(prevState => ({
                ...prevState,
                comment: e.target.value,
                errors: { ...prevState.errors, comment: '' },
                errorMessage: '',
                submitted: false
            }));
        },
        onChangeValue: (e: InputChangeEvent) => {
            setState(prevState => ({
                ...prevState,
                value: e.target.value,
                errors: { ...prevState.errors, value: '' },
                errorMessage: '',
                submitted: false
            }));
        },
        onSubmit: async () => {
            setState(prevState => ({ ...prevState, submitted: true }));

            const errors: RatingInputErrorMessages = validateRatingInputUseCase(state.name, state.comment, state.value);
            setState(prevState => ({ ...prevState, errors }));

            if (Object.values(errors).every(value => value === '')) {

                abortControllerRef.current?.abort();
                abortControllerRef.current = new AbortController();

                try {
                    setState(prevState => ({ ...prevState, loading: true, errorMessage: '' }));

                    const txResponse = await comedyClashRepo.createVotingForSubmission(
                        showAddress, Number(submissionIndex), state.name, state.comment, _.toNumber(state.value)
                    );
                    var message = 'Transcation successfully created - waiting for confirmation!';
                    setState(prevState => ({ ...prevState, successMessage: message }));
                    eventEmitter.emit('success', { type: 'success', message: message });

                    console.log(`CreateRatingViewModel: createVotingForSubmission: ${message}`);

                    await txResponse.wait();

                    message = 'Transaction confirmed!';
                    setState(prevState => ({ ...prevState, successMessage: message }));
                    eventEmitter.emit('success', { type: 'success', message: message });
                    console.log(`CreateRatingViewModel: createVotingForSubmission: ${message}`);

                } catch (error: unknown) {
                    if (abortControllerRef.current?.signal.aborted) return;
                    if (error instanceof Error) {
                        console.log(`CreateRatingViewModel: createVotingForSubmission: ${error.message}`);
                        setState(prevState => ({
                            ...prevState, errorMessage: error.message
                                || 'Failed to submit voting. Please try again.'
                        }));
                    } else {
                        const errorMessage = 'An unknown error occurred';
                        console.log(`CreateRatingViewModel: createVotingForSubmission: ${errorMessage}`);
                        setState(prevState => ({ ...prevState, errorMessage }));
                    }
                    eventEmitter.emit('error', { type: 'error', message: 'Error creating show!' });
                    console.error('CreateRatingViewModel: createVotingForSubmission: Error creating show:', error);
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
