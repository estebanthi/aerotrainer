'use server';

import { signIn} from "@/auth";
import { AuthError } from 'next-auth';
import { register } from "@/app/lib/data";


export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Identifiants incorrects.';
                default:
                    return 'Une erreur est survenue.';
            }
        }
        throw error;
    }
}


export async function register_(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        await register(email, password);
    }
    catch (error) {
        if (error instanceof Error) {
            return error.message;
        }
    }
}
