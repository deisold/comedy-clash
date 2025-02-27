// frontend/app/createshow/page.js

"use client"

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useEventEmitter } from '../components/ui/useToastEventEmitter';
import { useCreateShowViewModel } from './CreateShowViewModel';
import InputField from '../components/ui/InputField';
import { buttonClassNameListCTA } from '../components/ui/styles/buttonClassNames';
import { useDropzone } from "react-dropzone";
import { useAppContext } from '@/app/components/providers/AppProvider';
import { ViewModelEventEmitter } from '../source/common/CommonEvents';
//
export default function CreateShow() {
    const router = useRouter();
    const { comedyTheaterRepo, isManager, showRepo } = useAppContext();
    const { state, actions, eventEmitter } = useCreateShowViewModel(
        comedyTheaterRepo!!,
        showRepo!!,
        isManager,
        new ViewModelEventEmitter()
    );

    useEventEmitter(eventEmitter);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            actions.onChangeImage(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { 'image/*': [] }, // Accept only images
        maxFiles: 1, // Only allow one file
    });

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
                <div>
                    <div>
                        <label>Name: {state?.image?.name}</label>
                    </div>
                    <div
                        {...getRootProps()}
                        style={{
                            border: "2px dashed #ccc",
                            padding: "20px",
                            cursor: "pointer",
                            textAlign: "center",
                            marginBottom: "10px",
                        }}>
                        <input {...getInputProps()} />
                        <p>Drag & drop an image here, or click to select one</p>
                    </div>
                    {state.image && (
                        <div>
                            <img src={URL.createObjectURL(state.image)} alt="Preview"
                                style={{ width: "100%", maxHeight: "200px", objectFit: "contain", marginTop: "10px" }}
                            />
                        </div>
                    )}
                </div>
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

