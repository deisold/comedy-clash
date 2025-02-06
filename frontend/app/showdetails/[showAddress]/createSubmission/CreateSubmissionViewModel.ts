import { useEffect, useRef, useState } from "react";
import { SubmissionInputErrorMessages, validateSubmissionInputUseCase } from "./useCases/ValidateRatingInput";
import { useBlockchainState } from "@/app/components/providers/BlockchainStateProvider";
import { TxUseCaseState, TxUseCaseStateEnum, useTxUseCase } from "@/app/source/useCase/useTxUseCase";
import { useAppContext } from "@/app/components/providers/providers";
import { InputChangeEvent } from "@/app/source/common/CommonTypes";
import { ViewModelEventEmitter } from "@/app/source/common/CommonEvents";
import { hasNoErrors } from "@/app/source/utils/utils";
//
export interface CreateSubmissionState {
    name: string;
    topic: string;
    preview: string;
    loading: boolean;
    successMessage: string;
    errorMessage: string;
    errors: SubmissionInputErrorMessages;
    submitted: boolean;
    canWrite: boolean;
}

export interface CreateSubmissionViewModelActions {
    onChangeName: (e: InputChangeEvent) => void;
    onChangeTopic: (e: InputChangeEvent) => void;
    onChangePreview: (e: InputChangeEvent) => void;
    onSubmit: () => void;
}

export const useCreateSubmissionViewModel = (showAddress: string) => {
    const { canWrite } = useBlockchainState();
    const { comedyClashRepo } = useAppContext();
    const eventEmitter = useRef(new ViewModelEventEmitter()).current;

    const [state, setState] = useState<CreateSubmissionState>({
        name: '',
        topic: '',
        preview: '',
        loading: false,
        successMessage: '',
        errorMessage: '',
        errors: {
            name: '',
            topic: '',
            preview: '',
        },
        submitted: false,
        canWrite: canWrite
    });

    const {
        state: createSubmissionTxState,
        start: createSubmissionTxStart,
        abortControllerRef: createSubmissionTxAbortControllerRef
    } = useTxUseCase(
        'CreateSubmissionViewModel::createSubmission',
        () => comedyClashRepo!!.createSubmissions(showAddress, state.name, state.topic, state.preview),
    );

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
        handleTransactionStateChange(createSubmissionTxState);
    }, [createSubmissionTxState]);

    const actions: CreateSubmissionViewModelActions = {
        onChangeName: (e: InputChangeEvent) => {
            setState(prevState => ({
                ...prevState,
                name: e.target.value,
                errors: { ...prevState.errors, name: '' },
                errorMessage: '',
                submitted: false
            }));
        },
        onChangeTopic: (e: InputChangeEvent) => {
            setState(prevState => ({
                ...prevState,
                topic: e.target.value,
                errors: { ...prevState.errors, topic: '' },
                errorMessage: '',
                submitted: false
            }));
        },
        onChangePreview: (e: InputChangeEvent) => {
            setState(prevState => ({
                ...prevState,
                preview: e.target.value,
                errors: { ...prevState.errors, preview: '' },
                errorMessage: '',
                submitted: false
            }));
        },
        onSubmit: async () => {
            setState(prevState => ({ ...prevState, submitted: true }));

            const errors: SubmissionInputErrorMessages = validateSubmissionInputUseCase(state.name, state.topic, state.preview);
            setState(prevState => ({ ...prevState, errors }));

            if (hasNoErrors(errors)) {
                createSubmissionTxStart();
                return () => createSubmissionTxAbortControllerRef.current?.abort();
            }
        }
    };

    return { state, actions, eventEmitter };
}