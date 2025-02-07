// frontend/app/showdetails/[showAddress]/createvoting/[submissionAdress]/page.js

"use client"

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import _ from 'lodash';
import { useCreateRatingViewModel } from './CreateRatingViewModel';
import { useEventEmitter } from '@/app/components/ui/useToastEventEmitter';
import InputField from '@/app/components/ui/InputField';
import { buttonClassNameListCTA } from '@/app/components/ui/styles/buttonClassNames';
//
interface RouteParams {
    showAddress: string;
    submissionIndex: string;
    // Other params can be a string or undefined
    [key: string]: string | undefined;
}

export default function CreateVoting() {
    const router = useRouter();
    const { showAddress, submissionIndex } = useParams<RouteParams>();

    const { state, actions, eventEmitter } = useCreateRatingViewModel(showAddress, submissionIndex);

    useEventEmitter(eventEmitter);

    const handleBack = async () => { router.back(); }

    return (
        <div>
            <h1>Comedy Clash - Your voting matters!</h1>
            <h3>Leave your rating on submission:</h3>
            <br />
            <form className="space-y-4 w-1/2">
                <InputField
                    value={state.name}
                    submitted={state.submitted}
                    error={state.errors.name}
                    placeholder="What's your name?"
                    onChangeEvent={actions.onChangeName}
                    label="Name"
                />
                <InputField
                    value={state.comment}
                    submitted={state.submitted}
                    error={state.errors.comment}
                    placeholder="What's your comment?"
                    onChangeEvent={actions.onChangeComment}
                    label="Comment"
                />
                <InputField
                    value={state.value}
                    submitted={state.submitted}
                    error={state.errors.value}
                    placeholder="Value beween 1 and 5"
                    onChangeEvent={actions.onChangeValue}
                    label="Your rating"
                />
                <button
                    type="button"
                    className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={actions.onSubmit}
                    disabled={state.loading || Boolean(state.successMessage)}>
                    Submit
                </button>
            </form>

            {state.successMessage &&
                <div>
                    <br />
                    <p>{state.successMessage}</p>
                    <button
                        type="button"
                        className={buttonClassNameListCTA(state.loading || Boolean(state.successMessage))}
                        onClick={handleBack}>
                        Back
                    </button>
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
