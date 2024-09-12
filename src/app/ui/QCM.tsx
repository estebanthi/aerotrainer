import React from 'react';

interface QCMProps {
    question: string;
    number: number;
    explanation: string;
    options: string[];
    onSelect: (selectedAnswer: string) => void;
    image_url: string | null;
    selectedAnswer: string | null;
    correctionMode: boolean;
}

const QCM: React.FC<QCMProps> = ({ question, number, explanation, options, onSelect, image_url, selectedAnswer, correctionMode }) => {

    const handleAnswerClick = (answer: string) => {
        if (correctionMode) {
            return;
        }
        if (selectedAnswer === answer) {
            onSelect('');
            return;
        }

        onSelect(answer);
    };

    const handleImageClick = (image: string) => {
        window.open(image, '_blank');
    }

    return (
        <div className="bg-white border border-gray-300 rounded-lg shadow-md p-4 w-full dark:bg-blueish-600 dark:border-blueish-800 dark:text-blueish-100">
            <div className="flex flex-col items-start mb-4">
                <div className="flex items-center mb-2 w-full justify-between">
                    <div className="text-lg font-semibold mb-4">
                        <span className="text-blue-600 dark:text-blue-300">
                            Q{number}:</span> {question}
                    </div>
                        {
                            correctionMode && (
                                selectedAnswer === options[0] ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                )
                            )
                        }
                </div>
                {
                    image_url && (
                        <span
                            onClick={() => handleImageClick(image_url)}
                            className="cursor-pointer text-blue-600 whitespace-nowrap hover:bg-gray-100 p-2 rounded-lg transition-colors duration-300 ease-in-out dark:text-blue-300 dark:hover:bg-blueish-700"
                        >Voir l&apos;annexe</span>
                    )
                }
            </div>
            <div className="space-y-2">
                {options.map((option) => (
                    <div
                        key={option}
                        onClick={() => handleAnswerClick(option)}
                        className={`cursor-pointer p-2 rounded-lg transition-colors duration-300 ease-in-out ${
                            correctionMode ? (selectedAnswer === option ? (
                                option === options[0] ? 'bg-green-600 text-white dark:bg-green-700 dark:text-green-100' : 'bg-red-600 text-white dark:bg-red-700 dark:text-red-100'
                                ) : option === options[0] ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700') :
                                selectedAnswer === option
                                    ? 'bg-blue-600 text-white dark:bg-blueish-800 dark:text-blueish-100'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-blueish-700 dark:text-blueish-100 dark:hover:bg-blueish-800'
                        }`}
                    >
                        {options && option.charAt(0).toUpperCase() + option.slice(1)}
                    </div>
                ))}
            </div>
            {correctionMode && explanation && (
                <div className="mt-4 bg-blue-100 p-4 rounded-lg dark:bg-blueish-700">
                    <span className="text-lg font-semibold text-blue-600 dark:text-blue-300">
                        Explication:</span> <br />
                    <span dangerouslySetInnerHTML={{ __html: explanation }} />
                </div>
            )}
        </div>
    );
};

export default QCM;
