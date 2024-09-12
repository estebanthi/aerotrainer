import React from 'react';

interface ButtonProps {
    onClick: () => void;
    children: React.ReactNode;
    className?: string;
    disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ onClick, children, className = '', disabled = false }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors dark:bg-blueish-400 dark:text-blueish-100 dark:hover:bg-blueish-500 dark:focus:ring-blue-300 dark:disabled:bg-gray-700 dark:disabled:text-gray-300 ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;
