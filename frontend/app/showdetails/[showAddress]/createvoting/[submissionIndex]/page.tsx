// frontend/app/showdetails/[showAddress]/createvoting/[submissionAdress]/page.js

"use client"

import React, { useState } from 'react';
import { useAppContext } from '@/app/components/providers/providers'
import { FormInput, Form, Button } from 'semantic-ui-react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import { InputChangeEvent } from '@/app/source/common/CommonTypes';
import _ from 'lodash';

interface RouteParams {
    showAddress: string;
    submissionIndex: string;
    // Other params can be a string or undefined
    [key: string]: string | undefined;
}

interface ErrorMessages {
    name: string;
    comment: string;
    value: string;
}

export default function CreateVoting() {
    const { comedyClashRepo } = useAppContext();
    const router = useRouter();

    const { showAddress, submissionIndex } = useParams<RouteParams>();

    const [name, setName] = useState('');
    const [comment, setComment] = useState('');
    const [value, setValue] = useState('');

    const [loading, setLoading] = useState(false);
    // State for validation errors
    const [errors, setErrors] = useState<ErrorMessages>({
        name: '',
        comment: '',
        value: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const [successMessage, setSuccessMessage] = useState('');

    const [errorMessage, setErrorMessage] = useState('');

    const onChangeName = (e: InputChangeEvent) => {
        setName(e.target.value)
        setErrorMessage('')

        if (errors.name) {
            setErrors((prevErrors) => ({ ...prevErrors, name: '' }));
            setSubmitted(false);
        }
    }

    const onChangeComment = (e: InputChangeEvent) => {
        setComment(e.target.value)
        setErrorMessage('')

        if (errors.comment) {
            setErrors((prevErrors) => ({ ...prevErrors, comment: '' }));
            setSubmitted(false);
        }
    }

    const onChangeValue = (e: InputChangeEvent) => {
        setValue(e.target.value)
        setErrorMessage('')

        if (errors.value) {
            setErrors((prevErrors) => ({ ...prevErrors, value: '' }));
            setSubmitted(false);
        }
    }

    const validate = () => {
        const newErrors: ErrorMessages = {
            name: '',
            comment: '',
            value: '',
        };
        if (!name) newErrors.name = 'Please enter your name';
        if (!comment) newErrors.comment = 'Please enter a comment';
        if (!value) {
            newErrors.value = 'Please enter a value';
        } else if (Number(value) < 1) {
            newErrors.value = 'At least 1 points';
        } else if (Number(value) > 5) {
            newErrors.value = 'Not more than 5 points';
        }
        setErrors(newErrors);

        return Object.values(newErrors).every(value => value === '');
    };

    const handleSubmit = async () => {
        if (validate()) {
            setSubmitted(true);
            const controller = new AbortController();

            try {
                const isValidNumber = _.isFinite(_.toNumber(submissionIndex));
                if (comedyClashRepo == null || showAddress == null || !isValidNumber) {
                    throw new Error('ShowDetails: dependencies null');
                }

                setLoading(true);
                setErrorMessage('');

                await comedyClashRepo.createVotingForSubmission(
                    showAddress, Number(submissionIndex), name, comment, _.toNumber(value)
                );

                if (controller.signal.aborted) return;

                setSuccessMessage('Voting successfully sent.');
                toast.success('Voting successfully sent!');
            } catch (error: unknown) {
                setSubmitted(false);
                if (controller.signal.aborted) return;

                if (error instanceof Error) {
                    console.error('Error creating voting:', error);
                    toast.error(error.message || 'Failed to submit voting. Please try again.');
                    setErrorMessage(error.message || 'Failed to submit voting. Please try again.');
                } else {
                    console.error('An unknown error occurred');
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }

            return () => controller.abort();
        }
    };

    const handleBack = async () => {
        router.back();
    }

    return (
        <div>
            <h1>Comedy Clash - Your voting matters!</h1>
            <h3>Leave your rating on submission:</h3>
            <br />
            <Form>
                <FormInput
                    error={submitted && errors.name ? { content: errors.name, pointing: 'below' } : null}
                    fluid
                    label='Name'
                    placeholder='Whats your name?'
                    id='form-input-name'
                    type='text'
                    value={name}
                    onChange={onChangeName}
                />
                <FormInput
                    error={submitted && errors.comment ? { content: errors.comment } : null}
                    fluid
                    label='Comment'
                    placeholder='Whats your comment?'
                    id='form-input-comment'
                    type='text'
                    value={comment}
                    onChange={onChangeComment}
                />
                <FormInput
                    error={submitted && errors.value ? { content: errors.value } : null}
                    fluid
                    label='Value beween 1 and 5'
                    placeholder='How many days?'
                    type='number'
                    value={value}
                    onChange={onChangeValue}
                />
                {!successMessage &&
                    <Button
                        loading={loading}
                        disabled={loading || Boolean(successMessage)}
                        onClick={handleSubmit}>
                        Submit
                    </Button>
                }
            </Form>

            {successMessage &&
                <div>
                    <br />
                    <p>{successMessage}</p>
                    <Button
                        primary
                        onClick={handleBack}>
                        Back
                    </Button>
                </div>}
            {/* Show inline error if present */}
            {errorMessage && (
                <div className="error-message text-red-600 mb-4">
                    {errorMessage}
                </div>
            )}
        </div>
    );
}