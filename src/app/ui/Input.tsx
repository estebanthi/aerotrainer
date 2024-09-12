import React from 'react';

interface InputProps {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    className?: string;
    type?: string;
    disabled?: boolean;
}

const Input: React.FC<InputProps> = ({ value, onChange, placeholder = '', className = '', type = 'text', disabled = false }) => {
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-200 disabled:cursor-not-allowed ${className}`}
        />
    );
};

export default Input;
