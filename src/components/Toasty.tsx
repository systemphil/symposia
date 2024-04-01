"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

export const Toasty = () => {
    const searchParams = useSearchParams();

    useEffect(() => {
        const canceled = searchParams.get("canceled");
        if (canceled) {
            toast.success("Your purchase was canceled.");
        }
        
    }, [searchParams])

    return null;
}