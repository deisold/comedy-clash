import { useEffect } from "react";
import { ViewModelEventEmitter, ViewModelEvents } from "@/app/source/common/CommonEvents";

import { toast } from 'react-toastify';

function showToastSuccess(message: string) {
    toast.success(message);
}

function showToastError(message: string) {
    toast.error(message);
}

export const useEventEmitter = (eventEmitter: ViewModelEventEmitter) => {
    useEffect(() => {
        const handleSuccess = (event: ViewModelEvents) => {
            console.log(`handleSuccess: ${event.message}`);
            showToastSuccess(event.message);
        };

        const handleError = (event: ViewModelEvents) => {
            console.log(`handleError: ${event.message}`);
            showToastError(event.message);
        };

        // Attach the listeners
        eventEmitter.on('success', handleSuccess);
        eventEmitter.on('error', handleError);

        // Cleanup function to remove listeners
        return () => {
            eventEmitter.removeAllListeners();
        };
    }, [eventEmitter]); // Only eventEmitter as a dependency
}