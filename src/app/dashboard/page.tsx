"use client"

import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";

export default function Page() {
    const { data: session }= useSession();

    const [email, setEmail] = useState("");

    useEffect(() => {
        setEmail(session?.user?.email || "");
    }, [session]);

    return (
        <div
            className="flex flex-col items-center justify-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 items-center">
                <h1 className="text-2xl font-bold mb-4 dark:text-blueish-100">Connecté en tant que {email}</h1>
            </main>
        </div>
    )
}