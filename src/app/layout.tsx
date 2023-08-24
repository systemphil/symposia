import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import TRPCProvider from '@/lib/trpc/TRPCProvider'
import NextAuthProvider from '../lib/nextAuth/NextAuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'sPhil Symposia',
    description: 'Where each course is a symposium',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <p className="w-full bg-orange-200 flex flex-col justify-center items-center">Navbar Placeholder</p>
                <NextAuthProvider>
                    <TRPCProvider>
                        {children}
                    </TRPCProvider>
                </NextAuthProvider>
            </body>
        </html>
    );
}