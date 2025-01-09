// frontend/app/createshow/page.js

"use client"

import React, { useState, useEffect } from 'react';
import { useAppContext } from '../components/providers/providers';
import { FormInput, Form, Button } from 'semantic-ui-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { InputChangeEvent } from '../source/common/CommonTypes';

interface ErrorMessages {
    description: string;
    days: string;
}

export default function CreateShow() {
    const { comedyTheaterRepo, isManager: appIsManager } = useAppContext();
    const router = useRouter();

    const [description, setDescription] = useState<string>('');
    const [days, setDays] = useState<string>('');
    const [isManager, setIsManager] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [errors, setErrors] = useState<ErrorMessages>({ description: '', days: '' });
    const [submitted, setSubmitted] = useState<boolean>(false);

    useEffect(() => {
        const isManager = appIsManager;
        setIsManager(isManager);
        if (!isManager) {
            setErrorMessage('You are not authorized to create a show');
        }
    }, [isManager, router]);

    const onChangeDescription = (e: InputChangeEvent) => {
        setDescription(e.target.value)
        if (errors.description) {
            setErrors((prevErrors) => ({ ...prevErrors, description: '' }));
            setSubmitted(false);
        }
    }
    const onChangeDays = (e: InputChangeEvent) => {
        setDays(e.target.value)
        if (errors.days) {
            setErrors((prevErrors) => ({ ...prevErrors, days: '' }));
            setSubmitted(false);
        }
    }

    const validate = () => {
        const newErrors: ErrorMessages = { description: '', days: '' };
        if (!description.trim()) {
            newErrors.description = 'Please enter a description';
        }
        const daysNum = Number(days);
        if (!days) {
            newErrors.days = 'Please enter the submission window in days';
        } else if (isNaN(daysNum) || !Number.isInteger(daysNum)) {
            newErrors.days = 'Please enter a valid whole number';
        } else if (daysNum < 1) {
            newErrors.days = 'At least 1 day is required';
        } else if (daysNum > 30) {
            newErrors.days = 'Maximum 30 days allowed';
        }
        setErrors(newErrors);

        return Object.values(newErrors).every(value => value === '');
    };

    const handleSubmit = async () => {
        setSubmitted(true);

        if (validate()) {
            const controller = new AbortController();

            try {
                setLoading(true);
                setErrorMessage('');

                const txResponse = await comedyTheaterRepo!!.addShow(description, Number(days));
                setSuccessMessage('Transcation successfully created - waiting for confirmation!');
                toast.success('Transcation successfully created!');

                console.log('addShow: tx created - waiting for confirmation');
                await txResponse.wait();
                console.log('addShow: tx confirmed');

                setSuccessMessage('Show successfully created!');
                toast.success('Show successfully created!');
            } catch (error: any) {
                if (controller.signal.aborted) return;

                console.error('Error creating show:', error);
                toast.error(error.message || 'Failed to create show. Please try again.');
                setErrorMessage(error.message || 'Failed to create show. Please try again.');
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }

            return () => controller.abort();
        }
    };

    const handleBack = () => {
        router.back();
    };

    return (
        <div className="container mx-auto p-4 max-w-md">
            <header className="text-center mb-6">
                <h1 className="text-2xl font-bold mb-2">Comedy Clash</h1>
                <h3 className="text-xl">Create a new show</h3>
            </header>

            <Form className="space-y-4">
                <FormInput
                    disabled={loading || Boolean(successMessage)}
                    error={submitted && errors.description ? { content: errors.description, pointing: 'below' } : null}
                    fluid
                    label='Description'
                    placeholder='How you wanna call the show?'
                    id='form-input-description'
                    type='text'
                    value={description}
                    onChange={onChangeDescription}
                />
                <FormInput
                    disabled={loading || Boolean(successMessage)}
                    error={submitted && errors.days ? { content: errors.days } : null}
                    fluid
                    label='Submission window'
                    placeholder='How many days?'
                    type='number'
                    value={days}
                    onChange={onChangeDays}
                />
                {!successMessage &&
                    <Button
                        loading={loading}
                        disabled={loading || Boolean(successMessage) || !isManager}
                        onClick={handleSubmit}>
                        Submit
                    </Button>
                }
            </Form>

            {successMessage &&
                <div>
                    <br />
                    <div className="success-message text-green-600 mt-4">
                        {successMessage}
                    </div>
                    <Button
                        primary
                        onClick={handleBack}>
                        Back
                    </Button>
                </div>}

            {errorMessage && (
                <div className="error-message text-red-600 mb-4">
                    {errorMessage}
                </div>
            )}
        </div>
    );
}

