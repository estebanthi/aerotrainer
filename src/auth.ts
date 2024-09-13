import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials";
import {z} from "zod";
import {login} from "@/app/lib/data";
import {authConfig} from "@/auth.config";
import {User} from "next-auth";

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials, request): Promise<User | null> {
                const parsedCredentials = z
                    .object({ email: z.string(), password: z.string().min(4) })
                    .safeParse(credentials);
                if (parsedCredentials.success) {
                    const {email, password} = parsedCredentials.data;
                    const user = await login(email, password);
                    if (!user) return null;
                    return user;
                }

                return null;
            }
        }),
    ],
});
