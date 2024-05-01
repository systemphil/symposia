"use client";

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
            switch (error) {
                case "must-be-logged-in":
                    toast.error(
                        "You must be logged in to purchase this course."
                    );
                    break;
                case "course-not-purchased":
                    toast.error(
                        "You must purchase this course in order to access it."
                    );
                    break;
            }
        }
        return () => {
            setTimeout(() => {
                router.replace(
                    window.location.origin + window.location.pathname,
                    { scroll: false }
                );
            }, 2000);
        };
    }, [searchParams, path, router]);

    return null;
};
