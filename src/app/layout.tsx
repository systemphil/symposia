import TRPCProvider from '@/app/_lib/trpc/TRPCProvider'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

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
            <TRPCProvider>
            {children}
            </TRPCProvider>
        </body>
        </html>
    )
}