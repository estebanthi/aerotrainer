import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import {Suspense} from "react";
import { signOut } from "@/auth";
import {NextAuthProvider} from "@/app/NextAuthProvider";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

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
        <nav className="space-x-4">
            <Link href="/">
                <span className="text-gray-700 hover:text-blue-500 transition-colors dark:text-blueish-100">
                    Accueil
                </span>
            </Link>
            <form
                action={async () => {
                    'use server';
                    await signOut();
                }}
            >
                <button
                    className="flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
                    <svg
                        className="w-6 h-6 text-gray-700 dark:text-blueish-100"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        ></path>
                    </svg>
                    <div className="hidden md:block">Sign Out</div>
                </button>
            </form>
        </nav>
    </header>
    <Suspense fallback={<div>Chargement...</div>}>{children}</Suspense>
    </AuthWrapper>
    </body>
    </html>
  );
}
