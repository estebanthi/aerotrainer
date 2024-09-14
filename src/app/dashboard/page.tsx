import {auth} from "@/auth";

export default async function Page() {
    const session = await auth();

    return (
        <div
            className="flex flex-col items-center justify-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <main className="flex flex-col gap-8 items-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-blueish-100">Connecté en tant que {session?.user?.email}</h1>
            </main>
        </div>
    )
}
