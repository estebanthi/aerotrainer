import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import {Suspense} from "react";
import {auth, signOut} from "@/auth";
import AuthWrapper from "@/app/auth_wrapper";

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
    <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between dark:bg-blueish-400 dark:text-blueish-100">
        <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-blueish-100">Aerotrainer</h1>
        </div>
        <nav className="space-x-4 flex items-center">
            <Link href="/">
                <span className="text-gray-700 hover:text-blue-500 transition-colors dark:text-blueish-100">
                    Accueil
                </span>
            </Link>
            {session ? <form
                action={async () => {
                    'use server';
                    await signOut({redirectTo: "/"});
                }}
            >
                <button className="text-gray-700 hover:text-blue-300 transition-colors dark:text-blueish-100 bg-blue-500 text-white px-4 py-2 rounded-md dark:bg-blueish-300">
                    Déconnexion
                </button>
            </form> : <Link href="/login">
                <span className="text-gray-700 hover:text-blue-300 transition-colors dark:text-blueish-100 bg-blue-500 text-white px-4 py-2 rounded-md dark:bg-blueish-300">
                    Connexion
                </span>
            </Link>}
        </nav>
    </header>
    <Suspense fallback={<div>Chargement...</div>}>{children}</Suspense>
    </AuthWrapper>
    </body>
    </html>
  );
}
