import { Suspense } from "react";
import CourseFrontPage from "@/components/CourseFrontPage";
import { PageWrapper } from "@/components/PageWrapper";

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
            <Suspense fallback={<p>Loading...</p>}>
                <CourseFrontPage slug={slug} />
            </Suspense>
        </PageWrapper>
    );
}
