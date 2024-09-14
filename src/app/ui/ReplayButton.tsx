"use client";

import React from 'react';
import {History} from "@/app/lib/data";

interface ReplayButtonProps {
    children: React.ReactNode;
    history: History;
    className?: string;
    disabled?: boolean;
}

const ReplayButton: React.FC<ReplayButtonProps> = ({ children, history, className = '', disabled = false }) => {
    "use client";

    const replay = () => {
        const searchParams = new URLSearchParams()
        searchParams.set('examId', history.examId.toString())
        searchParams.set('moduleId', history.moduleId?.toString() || "")
        searchParams.set('collectionId', history.collectionId?.toString() || "")
        searchParams.set('questions', history.questions.join(','))

        window.location.href = `/qcm?${searchParams.toString()}`
    }

    return (
        <button
            onClick={replay}
            disabled={disabled}
            className={`w-full bg-blue-500 text-white py-2 px-4 rounded shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors dark:bg-blueish-400 dark:text-blueish-100 dark:hover:bg-blueish-500 dark:focus:ring-blue-300 dark:disabled:bg-gray-700 dark:disabled:text-gray-300 ${className}`}
        >
            {children}
        </button>
    );
};

export default ReplayButton;
