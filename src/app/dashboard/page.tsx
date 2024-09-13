"use client"

import {useSession} from "next-auth/react";

export default function Page() {
    const { data: session, update }= useSession();

    return (
        <div
            className="flex flex-col items-center justify-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 items-center">
        <span>Hello {session?.user?.email}</span>
            </main>
        </div>
    )
}