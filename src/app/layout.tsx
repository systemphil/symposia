import './globals.css'
import '@mdxeditor/editor/style.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'react-hot-toast';
import TRPCProvider from '@/lib/trpc/TRPCProvider'
import NextAuthProvider from '../lib/nextAuth/NextAuthProvider'
import RootNavbar from '@/components/RootNavbar'

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
                <NextAuthProvider>
                    <TRPCProvider>

                        <RootNavbar />
                        {children}

                        <Toaster position="bottom-right" />
                    </TRPCProvider>
                </NextAuthProvider>
            </body>
        </html>
    );
}