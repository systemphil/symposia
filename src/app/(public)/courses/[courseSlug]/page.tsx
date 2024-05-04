import { Suspense } from "react";
import CourseFrontPage from "@/components/CourseFrontPage";
import { PageWrapper } from "@/components/PageWrapper";
import { LoadingBall } from "@/components/LoadingBall";
import FadeIn from "@/components/animations/FadeIn";
import { errorMessages } from "@/config/errorMessages";
import { redirect } from "next/navigation";

export default async function CourseFrontPageRoute({
    params,
}: {
    params: { courseSlug: string };
}) {
    const slug = params.courseSlug;

    if (typeof slug !== "string") {
        return redirect(`/?error=${errorMessages.missingParams}`);
    }

    return (
        <PageWrapper>
            <FadeIn>
                <Suspense fallback={<LoadingBall />}>
                    <CourseFrontPage slug={slug} />
                </Suspense>
            </FadeIn>
        </PageWrapper>
    );
}
