"use client"

import React, { useState } from 'react';
import { useAppContext } from '../components/providers';
import { FormInput, Form, Button } from 'semantic-ui-react';
import { useRouter } from 'next/navigation';

export default function createShow() {
    const { comedyTheaterRepo } = useAppContext();
    const router = useRouter(); 

    const [description, setDescription] = useState('');
    const [days, setDays] = useState('');

    const [loading, setLoading] = useState(false);
    // State for validation errors
    const [errors, setErrors] = useState({
        description: '',
        days: ''
    });

    // State to control validation display
    const [submitted, setSubmitted] = useState(false);

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
        if (!description) newErrors.description = 'Please enter a description';
        if (!days) {
            newErrors.days = 'Please enter the submission window in days';
        } else if (days < 1) {
            newErrors.days = 'At least 1 days';
        }
        setErrors(newErrors);

        return Object.keys(newErrors).length === 0; // Returns true if no errors
    };

    const handleSubmit = async () => {
        setSubmitted(true); // Indicate that the form was submitted
        if (validate()) {
            console.log('Form submitted with:', { description, days });
            
            setLoading(true)
            await comedyTheaterRepo.addShow(description, days)
            setLoading(false)

            router.back();
        }
    };

    return (
        <div>
                <h1>Comedy Clash</h1>
                <h3>Create a new show</h3>
                <br />
                <Form>
                    <FormInput
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
                        error={submitted && errors.days ? { content: errors.days } : null}
                        fluid
                        label='Submission window'
                        placeholder='How many days?'
                        type='number'
                        value={days}
                        onChange={onChangeDays}
                    />
                    <Button
                        loading={loading}
                        disabled={loading}
                        onClick={handleSubmit}>
                        Submit
                    </Button>
                </Form>
        </div>
    );
}

