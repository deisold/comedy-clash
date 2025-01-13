// frontend/app/showdetails/[showAddress]/createSubmission/page.js

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
    // Other params can be a string or undefined
    [key: string]: string | undefined;
}

interface ErrorMessages {
    name: string;
    topic: string;
    preview: string;
}

export default function CreateSubmission() {
    const { comedyClashRepo } = useAppContext();
    const router = useRouter();

    const { showAddress } = useParams<RouteParams>();

    const [name, setName] = useState('');
    const [topic, setTopic] = useState('');
    const [preview, setPreview] = useState('');

    const [loading, setLoading] = useState(false);
    // State for validation errors
    const [errors, setErrors] = useState<ErrorMessages>({
        name: '',
        topic: '',
        preview: '',
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

    const onChangeTopic = (e: InputChangeEvent) => {
        setTopic(e.target.value)
        setErrorMessage('')

        if (errors.topic) {
            setErrors((prevErrors) => ({ ...prevErrors, topic: '' }));
            setSubmitted(false);
        }
    }

    const onChangePreview = (e: InputChangeEvent) => {
        setPreview(e.target.value)
        setErrorMessage('')

        if (errors.preview) {
            setErrors((prevErrors) => ({ ...prevErrors, preview: '' }));
            setSubmitted(false);
        }
    }

    const validate = () => {
        console.log('validate');
        const newErrors: ErrorMessages = {
            name: '',
            topic: '',
            preview: '',
        };
        if (!name) newErrors.name = 'Please enter your name';
        if (!topic) newErrors.topic = 'Please enter a topic';
        if (!preview) newErrors.preview = 'Please enter a preview';

        setErrors(newErrors);
        const valid = Object.values(newErrors).every(value => value === '');
        console.log(`validate: ${valid}`);

        return valid;
    };

    const handleSubmit = async () => {
        setSubmitted(true);
        
        if (validate()) {
            setSubmitted(true);
            const controller = new AbortController();

            try {
                if (comedyClashRepo == null || showAddress == null) {
                    throw new Error('ShowDetails: dependencies null');
                }

                setLoading(true);
                setErrorMessage('');

                const txResponse = await comedyClashRepo.createSubmissions(showAddress, name, topic, preview);
                setSuccessMessage('Transcation successfully created - waiting for confirmation!');
                toast.success('Transcation successfully created!');

                if (controller.signal.aborted) return;
                await txResponse.wait();

                setSuccessMessage('Submission successfully created.');
                toast.success('Submission successfully created!');
            } catch (error: unknown) {
                setSubmitted(false);
                if (controller.signal.aborted) return;

                if (error instanceof Error) {
                    console.error('Error creating submission:', error);
                    toast.error(error.message || 'Failed to submit submission. Please try again.');
                    setErrorMessage(error.message || 'Failed to submit submission. Please try again.');
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
            <h1>Comedy Clash - Your performance matters!</h1>
            <h3>Submit your performance to the show:</h3>
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
                    error={submitted && errors.topic ? { content: errors.topic } : null}
                    fluid
                    label='Topic'
                    placeholder='Whats your topic?'
                    id='form-input-topic'
                    type='text'
                    value={topic}
                    onChange={onChangeTopic}
                />
                <FormInput
                    error={submitted && errors.preview ? { content: errors.preview } : null}
                    fluid
                    label='Preview'
                    placeholder='Give us a preview of your performance'
                    type='text'
                    value={preview}
                    onChange={onChangePreview}
                />
                {!successMessage &&
                    <Button
                        primary
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