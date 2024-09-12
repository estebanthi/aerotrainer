import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import {Suspense} from "react";

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
    <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
        <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">Aerotrainer</h1>
        </div>
        <nav className="space-x-4">
            <Link href="/">
                <span className="text-gray-700 hover:text-blue-500 transition-colors">Accueil</span>
            </Link>
        </nav>
    </header>
    <Suspense fallback={<div>Chargement...</div>}>{children}</Suspense>
    </body>
    </html>
  );
}
