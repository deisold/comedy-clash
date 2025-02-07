// frontend/app/showdetails/[showAddress]/createSubmission/page.js

"use client"

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import _ from 'lodash';
import { useCreateSubmissionViewModel } from './CreateSubmissionViewModel';
import { useEventEmitter } from '@/app/components/ui/useToastEventEmitter';
import InputField from '@/app/components/ui/InputField';
import { buttonClassNameListCTA } from '@/app/components/ui/styles/buttonClassNames';
//
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
                    value={state.topic}
                    submitted={state.submitted}
                    error={state.errors.topic}
                    placeholder="What's your topic?"
                    onChangeEvent={actions.onChangeTopic}
                    label="Topic"
                />
                <InputField
                    value={state.preview}
                    submitted={state.submitted}
                    error={state.errors.preview}
                    placeholder="What's your preview?"
                    onChangeEvent={actions.onChangePreview}
                    label="Preview"
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