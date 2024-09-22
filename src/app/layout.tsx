import "./globals.css";
import "@mdxeditor/editor/style.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import TRPCProvider from "@/lib/trpc/TRPCProvider";
import NextAuthProvider from "../lib/nextAuth/NextAuthProvider";
import { RootNavbar } from "@/components/RootNavbar";
import "../styles/styles.css";
import Footer from "@/components/Footer";
import { ToastSearchParams } from "@/components/ToastSearchParams";
import { Suspense } from "react";
import { Analytics } from "@/components/Analytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "sPhil Symposia",
    description:
        "Where each course is a symposium. Learn about philosophy and the history of ideas in a community of learners.",
};

const rootClasses =
    "antialiased text-gray-900 bg-gray-100 dark:bg-gray-900 dark:text-gray-800 bg-white dark:bg-white";

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" data-theme="fantasy">
            <body className={`${inter.className} ${rootClasses}`}>
                <NextAuthProvider>
                    <TRPCProvider>
                        <RootNavbar />
                        <div className="relative">{children}</div>
                        <Footer />
                        {/* <Suspense>
                            <ToastSearchParams />
                        </Suspense> */}
                        <Toaster position="bottom-right" />
                        <Analytics />
                    </TRPCProvider>
                </NextAuthProvider>
            </body>
        </html>
    );
}
