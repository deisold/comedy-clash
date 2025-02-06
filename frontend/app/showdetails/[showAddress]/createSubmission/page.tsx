// frontend/app/showdetails/[showAddress]/createSubmission/page.js

"use client"

import React from 'react';
import { FormInput, Form, Button } from 'semantic-ui-react';
import { useRouter, useParams } from 'next/navigation';
import _ from 'lodash';
import { useCreateSubmissionViewModel } from './CreateSubmissionViewModel';
import { useEventEmitter } from '@/app/components/ui/useToastEventEmitter';

interface RouteParams {
    showAddress: string;
    // Other params can be a string or undefined
    [key: string]: string | undefined;
}

export default function CreateSubmission() {
    const router = useRouter();
    const { showAddress } = useParams<RouteParams>();
    const { state, actions, eventEmitter } = useCreateSubmissionViewModel(showAddress);

    useEventEmitter(eventEmitter);

    const handleBack = async () => { router.back(); }

    return (
        <div>
            <h1>Comedy Clash - Your performance matters!</h1>
            <h3>Submit your performance to the show:</h3>
            <br />
            <Form>
                <FormInput
                    error={state.submitted && state.errors.name ? { content: state.errors.name, pointing: 'below' } : null}
                    fluid
                    label='Name'
                    placeholder='Whats your name?'
                    id='form-input-name'
                    type='text'
                    value={state.name}
                    onChange={actions.onChangeName}
                />
                <FormInput
                    error={state.submitted && state.errors.topic ? { content: state.errors.topic } : null}
                    fluid
                    label='Topic'
                    placeholder='Whats your topic?'
                    id='form-input-topic'
                    type='text'
                    value={state.topic}
                    onChange={actions.onChangeTopic}
                />
                <FormInput
                    error={state.submitted && state.errors.preview ? { content: state.errors.preview } : null}
                    fluid
                    label='Preview'
                    placeholder='Give us a preview of your performance'
                    type='text'
                    value={state.preview}
                    onChange={actions.onChangePreview}
                />
                {!state.successMessage &&
                    <Button
                        primary
                        loading={state.loading}
                        disabled={state.loading || Boolean(state.successMessage)}
                        onClick={actions.onSubmit}>
                        Submit
                    </Button>
                }
            </Form>

            {state.successMessage &&
                <div>
                    <br />
                    <p>{state.successMessage}</p>
                    <Button
                        primary
                        onClick={handleBack}>
                        Back
                    </Button>
                </div>}
            {/* Show inline error if present */}
            {state.errorMessage && (
                <div className="error-message text-red-600 mb-4">
                    {state.errorMessage}
                </div>
            )}
        </div>
    );
}