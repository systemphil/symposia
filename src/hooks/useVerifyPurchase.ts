import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { apiClientside } from "@/lib/trpc/trpcClientside";

export const useVerifyPurchase = () => {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<string>("");
    const searchParams = useSearchParams();
    const user = useSession();
    const purchasePriceId = searchParams.get("p");
    const slug = searchParams.get("s");

    const {
        data: apiData,
        error: apiError,
        status,
    } = apiClientside.db.getVerifiedPurchase.useQuery(
        {
            userId: user.data ? user.data.user.id : "missing",
            purchasePriceId: purchasePriceId as string,
        },
        {
            enabled: user.data !== null && purchasePriceId !== null,
            retry: 10,
        }
    );

    useEffect(() => {
        if (status === "success") {
            if (apiData) {
                setSuccess(true);
                setData(slug as string);
            } else {
                setError(true);
            }
            setLoading(false);
        }

        if (status === "error") {
            console.log(apiError.message);
            setError(true);
            setLoading(false);
        }
    }, [status, apiData, apiError, slug]);

    return { success, error, loading, data };
};
