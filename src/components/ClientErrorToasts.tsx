"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import toast from "react-hot-toast";

const ClientErrorToasts = () => {
    const params = useSearchParams();
    const errorParams = params.get('error');

    useEffect(() => {
        if (errorParams === 'unauthorized') {
            toast.error('You are not authorized to access that page.');
        } else if (errorParams) {
            toast.error('An unknown error occurred.');
        }

    }, [errorParams]);

    return <></>;
}

export default ClientErrorToasts;
