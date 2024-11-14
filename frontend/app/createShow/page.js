// frontend/app/createshow/page.js

"use client"

import React, { useState, useEffect } from 'react';
import { useAppContext } from '../components/providers';
import { FormInput, Form, Button } from 'semantic-ui-react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

export default function CreateShow() {
    const { comedyTheaterRepo, isManager: appIsManager } = useAppContext();
    const router = useRouter();

    const [description, setDescription] = useState('');
    const [days, setDays] = useState('');

    const [isManager, setIsManager] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [errors, setErrors] = useState({
        description: '',
        days: ''
    });

    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const isManager = appIsManager;
        setIsManager(isManager);
        if (!isManager ) {
            setErrorMessage('You are not authorized to create a show');
        }
    }, [isManager, router]);

    const onChangeDescription = (e) => {
        setDescription(e.target.value)
        if (errors.description) {
            setErrors((prevErrors) => ({ ...prevErrors, description: '' }));
            setSubmitted(false);
        }
    }
    const onChangeDays = (e) => {
        setDays(e.target.value)
        if (errors.days) {
            setErrors((prevErrors) => ({ ...prevErrors, days: '' }));
            setSubmitted(false);
        }
    }

    const validate = () => {
        const newErrors = {};
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
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        setSubmitted(true);
        if (validate()) {
            const controller = new AbortController();

            try {
                setLoading(true);
                setErrorMessage('');

                await comedyTheaterRepo.addShow(description, days);

                if (controller.signal.aborted) return;

                setSuccessMessage('Show successfully created!');
                toast.success('Show successfully created!');
            } catch (error) {
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
                    disabled={loading || successMessage}
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
                    disabled={loading || successMessage}
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
                        disabled={loading || successMessage || !isManager}
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

