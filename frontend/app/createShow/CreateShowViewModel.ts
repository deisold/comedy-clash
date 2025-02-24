import { validateShowInputUseCase, ShowInputErrorMessages } from '@/app/createShow/useCases/ValidateShowInput';
import { useState, useRef, useEffect } from 'react';
import { ViewModelEventEmitter } from '@/app/source/common/CommonEvents';
import { InputChangeEvent } from '../source/common/CommonTypes';
import { useTxUseCase, TxUseCaseState } from '../source/useCase/useTxUseCase';
import { hasNoErrors } from '@/app/source/utils/utils';
import { ComedyTheaterRepoType } from '../source/repositories/ComedyTheaterRepo';
import { ShowRepositoryType } from '../source/repositories/ShowRepo';
//
export interface CreateShowState {
    description: string;
    days: string;
    image: File | null;
    isManager: boolean;
    loading: boolean;
    successMessage?: string;
    errorMessage?: string;
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
    onChangeImage: (file: File) => void;
    onSubmit: () => void;
}

export const useCreateShowViewModel = (
    comedyTheaterRepo: ComedyTheaterRepoType,
    showRepo: ShowRepositoryType,
    isManager: boolean,
    viewModelEventEmitter: ViewModelEventEmitter
) => {
    const eventEmitter = useRef(viewModelEventEmitter).current;

    const {
        state: addShowTxState,
        start: addShowTxStart,
    } = useTxUseCase(
        'CreateShowViewModel::addShow',
        () => comedyTheaterRepo!!.addShow(state.description, Number(state.days)),
    );

    const [state, setState] = useState<CreateShowState>({
        description: '',
        days: '',
        image: null,
        isManager: isManager,
        loading: false,
        successMessage: '',
        errorMessage: '',
        errors: { description: '', days: '' },
        submitted: false,
    });

    useEffect(() => {
        if (!isManager) {
            setState(prevState => ({ ...prevState, errorMessage: 'You are not authorized to create a show' }));
        }
    }, [isManager]);

    // Function to handle transaction state changes
    const handleTransactionStateChange = (useCaseState: TxUseCaseState) => {
        const { msg } = useCaseState;
        switch (useCaseState.state) {
            case TxUseCaseState.Launched:
                setState(prevState => ({ ...prevState, loading: true }));
                break;
            case TxUseCaseState.TxCreated:
                createShow(useCaseState.txHash!!);
                setState(prevState => ({ ...prevState }));
                break;
            case TxUseCaseState.TxConfirmed:
                setState(prevState => ({
                    ...prevState, successMessage: msg,
                    loading: false
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

    const createShow = async (txHash: string) => {
        try {
            console.log(`CreateShowViewModel::onSubmit image file=${state.image?.name}`);

            showRepo!!.createShow(txHash, state.description, state.image)
        } catch (error) {
            console.error(error);
        }
    }

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
        onChangeImage: (file: File) => {
            setState(prevState => ({ ...prevState, image: file }));
        },
        onSubmit: async () => {
            // eventEmitter.emit('success', { type: 'success', message: 'TEST' });
            setState(prevState => ({ ...prevState, submitted: true }));

            const errors: ShowInputErrorMessages = validateShowInputUseCase(state.description, state.days);
            setState(prevState => ({ ...prevState, errors }));

            if (hasNoErrors(errors)) {
                // const imageBlob = await imageFileToBase64(state.image);
                // console.log(`CreateShowViewModel::onSubmit imageBlob=${imageBlob}`);
                // Start the transaction use case
                // createShow('0x1234567890123456789012345678901234567890fakeTxHash');
                addShowTxStart();
            }
        }
    };

    return { state, actions, eventEmitter };
};

