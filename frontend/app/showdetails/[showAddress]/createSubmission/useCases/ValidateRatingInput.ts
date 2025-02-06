import { BaseErrorMessage } from "@/app/source/common/BaseErrorMessage";

export interface SubmissionInputErrorMessages extends BaseErrorMessage {
    name: string;
    topic: string;
    preview: string;
}

export const validateSubmissionInputUseCase = (
    name: string,
    topic: string,
    preview: string,
): SubmissionInputErrorMessages => {
    const errors: SubmissionInputErrorMessages = { name: '', topic: '', preview: '' };
    if (!name) errors.name = 'Please enter your name';
    if (!topic) errors.topic = 'Please enter a topic';
    if (!preview) errors.preview = 'Please enter a preview';

    return errors;
};

