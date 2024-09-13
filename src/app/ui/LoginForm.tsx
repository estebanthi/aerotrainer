import React from 'react';
import {authenticate} from "@/app/lib/actions";
import {useFormState} from 'react-dom'
import Link from "next/link";

const LoginForm: React.FC = () => {
    const [errorMessage, formAction, isPending] = useFormState(
        authenticate,
        undefined,
    );

    return (
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold mb-4 dark:text-blueish-100">Connexion</h1>
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
                        {isPending ? 'Connexion...' : 'Connexion'}
                    </button>
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                </form>

                <Link href="/forgot-password" className="mt-4">
                    <p className="text-blue-500 hover:underline cursor-pointer">Mot de passe oublié ?</p>
                </Link>

                <Link href="/register" className="mt-4">
                    <p className="text-blue-500 hover:underline cursor-pointer">Pas encore de compte ? Inscrivez-vous</p>
                </Link>
            </div>
    );
};

export default LoginForm;
