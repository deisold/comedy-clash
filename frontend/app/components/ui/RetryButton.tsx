import React from 'react';

interface RetryButtonProps {
    caption?: string;
    onClick: () => void;
}

const RetryButton: React.FC<RetryButtonProps> = ({ caption, onClick }) => {
    return (
        <button
            className="bg-transparent border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-100"
            onClick={onClick}>
            {caption ?? 'Try Again'}
        </button>
    );
};

export default RetryButton;