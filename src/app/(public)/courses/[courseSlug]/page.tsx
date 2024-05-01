import { Suspense } from "react";
import CourseFrontPage from "@/components/CourseFrontPage";
import { PageWrapper } from "@/components/PageWrapper";
import { LoadingBall } from "@/components/LoadingBall";
import FadeIn from "@/components/animations/FadeIn";

export default async function CourseFrontPageRoute({
    params,
}: {
    params: { courseSlug: string };
}) {
    const slug = params.courseSlug;

    if (typeof slug !== "string") {
        throw new Error("missing course slug");
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
