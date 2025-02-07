import React from 'react';

interface InputFieldProps {
    submitted: boolean;
    placeholder: string;
    disabled?: boolean | false;
    error?: string;
    value: string;
    label: string;
    onChangeEvent: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({ value, submitted, error, placeholder, onChangeEvent, label, disabled }) => (
    <div className="relative">
        {submitted && error && (
            <div className="inline-block mb-2 rounded-md border border-red-500 bg-red-100 p-2 text-sm text-red-700 w-auto">
                {error}
            </div>
        )}
        <label htmlFor="form-input-name" className="block text-md font-medium text-gray-700">
            {label}
        </label>
        <input
            id="form-input-name"
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={onChangeEvent}
            disabled={disabled}
            className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${submitted && error ? 'border-red-500' : 'border-gray-300'
                } placeholder-gray-300`}
        />
    </div>
);

export default InputField;