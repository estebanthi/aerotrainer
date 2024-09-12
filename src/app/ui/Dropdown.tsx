import React, { useState } from 'react';

interface DropdownProps {
    options: string[];
    selected?: string;
    placeholder?: string;
    onSelect: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ options, selected, placeholder = 'Select an option', onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);
    const handleOptionClick = (option: string) => {
        onSelect(option);
        setIsOpen(false);
    };

    return (
        <div className="relative inline-block w-64">
            <button
                onClick={toggleDropdown}
                className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex justify-between items-center"
            >
                <span>{selected || placeholder}</span>
                <svg
                    className={`w-5 h-5 transition-transform transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                    ></path>
                </svg>
            </button>
            {isOpen && (
                <div className="absolute mt-1 w-full rounded-md bg-white shadow-lg z-10">
                    <ul className="py-1 text-gray-700">
                        {options.map((option) => (
                            <li
                                key={option}
                                onClick={() => handleOptionClick(option)}
                                className="cursor-pointer hover:bg-gray-100 px-4 py-2"
                            >
                                {option}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Dropdown;
