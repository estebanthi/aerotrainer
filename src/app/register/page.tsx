"use client";

import RegisterForm from "@/app/ui/RegisterForm";

export default function Page() {
    return (
        <div className="flex flex-col items-center justify-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 items-center">
                <RegisterForm/>
            </main>
        </div>
    )
}