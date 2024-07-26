"use client";

import { useVerifyPurchase } from "@/hooks/useVerifyPurchase";
import Heading from "./Heading";
import Link from "next/link";

export const VerifyPurchase = () => {
    const { loading, success, data, error } = useVerifyPurchase();
    const commonAlertClasses = "md:min-w-[600px]";

    return (
        <div>
            <Heading>Confirming Purchase</Heading>
            {loading && (
                <div
                    role="alert"
                    className={`alert alert-info md:min-w-[600px] ${commonAlertClasses}`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="stroke-current shrink-0 w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        ></path>
                    </svg>
                    <span>
                        Please wait while your purchase is being confirmed.
                    </span>
                    <span className="loading loading-dots loading-md"></span>
                </div>
            )}
            {error && (
                <div
                    role="alert"
                    className={`alert alert-error ${commonAlertClasses}`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="stroke-current shrink-0 h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>
                        There was an error in confirming your purchase. Please
                        contact support{" "}
                        <a
                            href="mailto:support@systemphil.com"
                            className="text-blue-400 underline hover:text-blue-700"
                        >
                            at this email
                        </a>
                        .
                    </span>
                </div>
            )}
            {!loading && success && (
                <>
                    <div
                        role="alert"
                        className={`alert alert-success ${commonAlertClasses}`}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="stroke-current shrink-0 h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <span>
                            Thank you for your purchase! You can access the
                            course&nbsp;
                            <Link
                                href={`/courses/${data}`}
                                className="link link-primary"
                            >
                                here
                            </Link>
                            .
                        </span>
                    </div>
                    <div className="flex justify-center">
                        <p className="mt-12 text-gray-500 max-w-md">
                            A receipt has been sent to the email address
                            attached to the account in which the purchase was
                            made.
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};
