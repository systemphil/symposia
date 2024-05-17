"use client";

import { ErrorMessages } from "@/config/errorMessages";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

export const ToastSearchParams = () => {
    const searchParams = useSearchParams();
    const path = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (searchParams.toString() === "") return;
        const canceled = searchParams.get("canceled");
        const error = searchParams.get("error");
        if (canceled) {
            toast.success("Your purchase was canceled.");
        }
        if (error) {
            switch (error as ErrorMessages) {
                case "course-not-found":
                    toast.error("Course not found.");
                    break;
                case "course-not-purchased":
                    toast.error(
                        "You must purchase this course in order to access it."
                    );
                    break;
                case "lesson-not-found":
                    toast.error("Lesson not found.");
                    break;
                case "missing-search-params":
                    toast.error("Missing details in the URL.");
                    break;
                case "missing-params":
                    toast.error("Missing details in the URL.");
                    break;
                case "must-be-logged-in":
                    toast.error(
                        "You must be logged in to purchase this course."
                    );
                    break;
                case "unauthorized":
                    toast.error("Unauthorized access.");
                    break;
            }
        }
        // First attempted this as a cleanup function, but it didn't work
        // as expected. So, it's inserted here into the main function.
        setTimeout(() => {
            router.replace(window.location.origin + window.location.pathname, {
                scroll: false,
            });
        }, 2000);
    }, [searchParams, path, router]);

    return null;
};
