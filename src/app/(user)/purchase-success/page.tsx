import { PageWrapper } from "@/components/PageWrapper";
import { VerifyPurchase } from "@/components/VerifyPurchase";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function PublishedCourses({
    searchParams,
}: {
    searchParams: { p: string; s: string };
}) {
    const { p: purchasePriceId, s: slug } = searchParams;
    if (!purchasePriceId || !slug) {
        return redirect("/?error=missing-params");
    }

    const user = await getServerAuthSession();
    if (!user) {
        /**
         * TODO fix redirect properly
         */
        return redirect("/?missing=login");
    }

    return (
        <PageWrapper>
            <VerifyPurchase />
        </PageWrapper>
    );
}
