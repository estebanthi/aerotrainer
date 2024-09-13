'use server';

import { signIn} from "@/auth";
import { AuthError } from 'next-auth';


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
