// frontend/app/createshow/page.js

"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { useEventEmitter } from '../components/ui/useToastEventEmitter';
import { useCreateShowViewModel } from './CreateShowViewModel';
import InputField from '../components/ui/InputField';
import { buttonClassNameListCTA } from '../components/ui/styles/buttonClassNames';

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

            <form className="space-y-4 w-1/2">
                <InputField
                    value={state.description}
                    disabled={state.loading || Boolean(state.successMessage)}
                    submitted={state.submitted}
                    error={state.errors.description}
                    placeholder="What's your description?"
                    onChangeEvent={actions.onChangeDescription}
                    label="Description"
                />
                <InputField
                    value={state.days}
                    disabled={state.loading || Boolean(state.successMessage)}
                    submitted={state.submitted}
                    error={state.errors.days}
                    placeholder="How many days?"
                    onChangeEvent={actions.onChangeDays}
                    label="Submission window"
                />
                {/* TODO: Add LOADING INDICATOR */}
                <button
                    type="button"
                    className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={actions.onSubmit}
                    disabled={state.loading || Boolean(state.successMessage) || !state.isManager}>
                    Submit
                </button>
            </form>

            {state.successMessage &&
                <div>
                    <br />
                    <div className="success-message text-green-600 mt-4">
                        {state.successMessage}
                    </div>
                    <button
                        type="button"
                        className={buttonClassNameListCTA(state.loading)}
                        onClick={handleBack}>
                        Back
                    </button>
                </div>}

            {state.errorMessage && (
                <div className="error-message text-red-600 mb-4">
                    {state.errorMessage}
                </div>
            )}
        </div>
    );
}

