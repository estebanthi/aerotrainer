import React from 'react';
import {authenticate} from "@/app/lib/actions";
import {useFormState} from 'react-dom'

const LoginForm: React.FC = () => {
    const [errorMessage, formAction, isPending] = useFormState(
        authenticate,
        undefined,
    );

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    formAction(new FormData(e.currentTarget));
                }}
                className="flex flex-col gap-4"
            >
                <input
                    type="text"
                    name="email"
                    placeholder="Username"
                    className="p-2 border border-gray-300 rounded"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="p-2 border border-gray-300 rounded"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded"
                    disabled={isPending}
                >
                    {isPending ? 'Loading...' : 'Login'}
                </button>
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            </form>
        </div>
    );
};

export default LoginForm;
