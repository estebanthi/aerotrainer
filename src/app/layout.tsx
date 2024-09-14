import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import React, {Suspense} from "react";
import {auth, signIn, signOut} from "@/auth";
import AuthWrapper from "@/app/auth_wrapper";
import Image from "next/image";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Aerotrainer",
  description: "Un site pour préparer les examens aéronautiques",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

    const session = await auth();

  return (
    <html lang="en">
    <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900 dark:bg-blueish-500 dark:text-blueish-100`}
    >
    <AuthWrapper>
    <header className="flex flex-col items-center justify-between p-4 bg-white dark:bg-blueish-400 border-b border-gray-200 dark:border-blueish-600 sm:flex-row">
        <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-blueish-100">Aerotrainer</h1>
        </div>
        <nav className="space-x-4 flex items-center">
            <Link href="/">
                <span className="text-gray-700 hover:text-blue-500 transition-colors dark:text-blueish-100">
                    Accueil
                </span>
            </Link>
            {session ? <>
                <Link href="/dashboard">
                <span className="text-gray-700 hover:text-blue-500 transition-colors dark:text-blueish-100">
                    Mon compte
                </span>
                </Link>
                <form
                action={async () => {
                    'use server';
                    await signOut({redirectTo: "/"});
                }}
            >
                <button
                    type="submit"
                    className="bg-white text-gray-900 dark:bg-blueish-400 dark:text-blueish-100 px-4 py-2 rounded-md flex items-center gap-2 border border-gray-300"
                >
                    Se déconnecter
                </button>
            </form>
            </> : <form
                action={async () => {
                    "use server"
                    await signIn("google", {redirectTo: "/dashboard"});
                }}
            >
                <button
                    type="submit"
                    className="bg-white text-gray-900 dark:bg-blueish-400 dark:text-blueish-100 px-4 py-2 rounded-md flex items-center gap-2 border border-gray-300"
                >
                    <Image src="/google.svg" alt="Google" className="w-6 h-6 mr-2" width={24} height={24}/>
                    Connexion
                </button>
            </form>}
        </nav>
    </header>
        <Suspense>{children}</Suspense>
    </AuthWrapper>
    </body>
    </html>
  );
}
