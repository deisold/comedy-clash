import { useAppContext } from '@/app/components/providers/AppProvider';
import { validateRatingInputUseCase, RatingInputErrorMessages } from './useCases/ValidateRatingInput';
import { useState, useRef, useEffect } from 'react';
import { ViewModelEventEmitter } from '@/app/source/common/CommonEvents';
import { useBlockchainState } from '@/app/components/providers/BlockchainStateProvider';
import _ from 'lodash';
import { InputChangeEvent } from '@/app/source/common/CommonTypes';
import { TxUseCaseState, useTxUseCase } from '@/app/source/useCase/useTxUseCase';
import { hasNoErrors } from '@/app/source/utils/utils';
//
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

    const isValidNumber = _.isFinite(_.toNumber(submissionIndex));
    if (comedyClashRepo == null || showAddress == null || !isValidNumber) {
        throw new Error('CreateRatingViewModel: dependencies null');
    }

    const {
        state: createVotingForSubmissionTxState,
        start: createVotingForSubmissionTxStart,
    } = useTxUseCase(
        'CreateRatingViewModel::createVotingForSubmission',
        () => comedyClashRepo.createVotingForSubmission(
            showAddress, Number(submissionIndex), state.name, state.comment, _.toNumber(state.value)
        ),
    );

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

    // Function to handle transaction state changes
    const handleTransactionStateChange = (state: TxUseCaseState) => {
        const { msg } = state;
        switch (state.state) {
            case TxUseCaseState.Launched:
                setState(prevState => ({ ...prevState, loading: true }));
                break;
            case TxUseCaseState.TxCreated:
            case TxUseCaseState.TxConfirmed:
                setState(prevState => ({
                    ...prevState, successMessage: msg,
                    loading: state.state === TxUseCaseState.TxConfirmed ? false : prevState.loading
                }));
                eventEmitter.emit('success', { type: 'success', message: msg });
                break;
            case TxUseCaseState.Error:
                setState(prevState => ({ ...prevState, errorMessage: msg, loading: false }));
                eventEmitter.emit('error', { type: 'error', message: msg });
                break;
            default:
                break;
        }
    };

    // Handle the transaction state from the txUseCase
    useEffect(() => {
        handleTransactionStateChange(createVotingForSubmissionTxState);
    }, [createVotingForSubmissionTxState]);

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

            if (hasNoErrors(errors)) {
                createVotingForSubmissionTxStart();
            }
        }
    };

    return { state, actions, eventEmitter };
};
