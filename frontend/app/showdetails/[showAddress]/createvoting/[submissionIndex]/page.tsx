// frontend/app/showdetails/[showAddress]/createvoting/[submissionAdress]/page.js

"use client"

import React from 'react';
import { useAppContext } from '@/app/components/providers/providers'
import { FormInput, Form, Button } from 'semantic-ui-react';
import { useRouter, useParams } from 'next/navigation';
import _ from 'lodash';
import { useCreateRatingViewModel } from './CreateRatingViewModel';
import { useEventEmitter } from '@/app/components/ui/useToastEventEmitter';

interface RouteParams {
    showAddress: string;
    submissionIndex: string;
    // Other params can be a string or undefined
    [key: string]: string | undefined;
}

export default function CreateVoting() {
    const { comedyClashRepo } = useAppContext();
    const router = useRouter();
    const { showAddress, submissionIndex } = useParams<RouteParams>();

    const { state, actions, eventEmitter } = useCreateRatingViewModel(showAddress, submissionIndex);

    useEventEmitter(eventEmitter);

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
                    error={state.submitted && state.errors.comment ? { content: state.errors.comment } : null}
                    fluid
                    label='Comment'
                    placeholder='Whats your comment?'
                    id='form-input-comment'
                    type='text'
                    value={state.comment}
                    onChange={actions.onChangeComment}
                />
                <FormInput
                    error={state.submitted && state.errors.value ? { content: state.errors.value } : null}
                    fluid
                    label='Your rating'
                    placeholder='Value beween 1 and 5'
                    type='number'
                    value={state.value}
                    onChange={actions.onChangeValue}
                />
                {!state.successMessage &&
                    <Button
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
