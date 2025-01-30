// frontend/app/createshow/page.js

"use client"

import React from 'react';
import { FormInput, Form, Button } from 'semantic-ui-react';
import { useRouter } from 'next/navigation';
import { useEventEmitter } from '../components/ui/useToastEventEmitter';
import { useCreateShowViewModel } from './CreateShowViewModel';

export default function CreateShow() {
    const router = useRouter();
    const { state, actions, eventEmitter } = useCreateShowViewModel();

    useEventEmitter(eventEmitter);

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
                    disabled={state.loading || Boolean(state.successMessage)}
                    error={state.submitted && state.errors.description ? { content: state.errors.description, pointing: 'below' } : null}
                    fluid
                    label='Description'
                    placeholder='How you wanna call the show?'
                    id='form-input-description'
                    type='text'
                    value={state.description}
                    onChange={actions.onChangeDescription}
                />
                <FormInput
                    disabled={state.loading || Boolean(state.successMessage)}
                    error={state.submitted && state.errors.days ? { content: state.errors.days } : null}
                    fluid
                    label='Submission window'
                    placeholder='How many days?'
                    type='number'
                    value={state.days}
                    onChange={actions.onChangeDays}
                />
                {!state.successMessage &&
                    <Button
                        loading={state.loading}
                        disabled={state.loading || Boolean(state.successMessage) || !state.isManager}
                        onClick={actions.onSubmit}>
                        Submit
                    </Button>
                }
            </Form>

            {state.successMessage &&
                <div>
                    <br />
                    <div className="success-message text-green-600 mt-4">
                        {state.successMessage}
                    </div>
                    <Button
                        primary
                        onClick={handleBack}>
                        Back
                    </Button>
                </div>}

            {state.errorMessage && (
                <div className="error-message text-red-600 mb-4">
                    {state.errorMessage}
                </div>
            )}
        </div>
    );
}

