import React from 'react';
import {register_} from "@/app/lib/actions";
import {useFormState} from 'react-dom'
import Link from "next/link";

const RegisterForm: React.FC = () => {
    const [errorMessage, formAction, isPending] = useFormState(
        register_,
        undefined,
    );

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold mb-4 dark:text-blueish-100">Inscription</h1>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    formAction(new FormData(e.currentTarget));
                }}
                className="flex flex-col gap-4"
            >
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    className="p-2 border border-gray-300 rounded dark:bg-blueish-400"
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Mot de passe"
                    className="p-2 border border-gray-300 rounded dark:bg-blueish-400"
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white p-2 rounded dark:bg-blueish-300"
                    disabled={isPending}
                >
                    {isPending ? 'Inscription...' : 'Inscription'}
                </button>
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            </form>

            <Link href="/login" className="mt-4">
                <p className="text-blue-500 hover:underline cursor-pointer">Déjà un compte ? Connectez-vous</p>
            </Link>
        </div>
    );
};

export default RegisterForm;
