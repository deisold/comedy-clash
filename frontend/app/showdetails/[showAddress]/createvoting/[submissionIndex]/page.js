// frontend/app/showdetails/[showAddress]/createvoting/[submissionAdress]/page.js

"use client"

import React, { useState } from 'react';
import { useAppContext } from '@/app/components/providers'
import { FormInput, Form, Button } from 'semantic-ui-react';
import { useRouter, useParams } from 'next/navigation';

export default function CreateVoting() {
    const { comedyClashRepo } = useAppContext();
    const router = useRouter();

    const { showAddress, submissionIndex } = useParams();

    const [name, setName] = useState('');
    const [comment, setComment] = useState('');
    const [value, setValue] = useState('');

    const [loading, setLoading] = useState(false);
    // State for validation errors
    const [errors, setErrors] = useState({
        name: '',
        comment: '',
        value: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const [successMessage, setSuccessMessage] = useState('');

    const onChangeName = (e) => {
        setName(e.target.value)
        if (errors.name) {
            setErrors((prevErrors) => ({ ...prevErrors, name: '' }));
            setSubmitted(false);
        }
    }

    const onChangeComment = (e) => {
        setComment(e.target.value)
        if (errors.comment) {
            setErrors((prevErrors) => ({ ...prevErrors, comment: '' }));
            setSubmitted(false);
        }
    }

    const onChangeValue = (e) => {
        setValue(e.target.value)
        if (errors.value) {
            setErrors((prevErrors) => ({ ...prevErrors, value: '' }));
            setSubmitted(false);
        }
    }

    const validate = () => {
        const newErrors = {};
        if (!name) newErrors.name = 'Please enter your name';
        if (!comment) newErrors.comment = 'Please enter a comment';
        if (!value) {
            newErrors.value = 'Please enter a value';
        } else if (value < 1) {
            newErrors.value = 'At least 1 points';
        } else if (value > 5) {
            newErrors.value = 'Not more than 5 points';
        }
        setErrors(newErrors);

        return Object.keys(newErrors).length === 0; // Returns true if no errors
    };

    const handleSubmit = async () => {
        setSubmitted(true); // Indicate that the form was submitted
        if (validate()) {
            console.log('Form submitted with:', { comment, value });

            setLoading(true)

            await comedyClashRepo.createVotingForSubmission(
                showAddress, submissionIndex, name, comment, value
            );
            // await comedyTheaterRepo.addShow(description, days)
            setLoading(false)
            setSuccessMessage('Voting successfully sent.');
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
                        disabled={loading || successMessage}
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
        </div>
    );
}