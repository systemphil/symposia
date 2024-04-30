import { LessonFrontPage } from "@/components/LessonFrontPage";
import { PageWrapper } from "@/components/PageWrapper";
import { errorMessages } from "@/config/errorMessages";
import { getServerAuthSession } from "@/server/auth";
import { dbGetUserPurchasedCourses } from "@/server/controllers/dbController";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function LessonFrontPageRoute({
    params,
}: {
    params: { lessonSlug: string; courseSlug: string };
}) {
    const lessonSlug = params.lessonSlug;
    const courseSlug = params.courseSlug;
    const notPurchasedRedirect = `/courses/${courseSlug}?error=${errorMessages.courseNotPurchased}`;

    if (typeof lessonSlug !== "string") {
        throw new Error("missing slugs");
    }

    const session = await getServerAuthSession();
    if (!session) {
        redirect(
            `/courses/${courseSlug}?error=${errorMessages.mustBeLoggedIn}`
        );
    }

    const purchasedCourses = await dbGetUserPurchasedCourses(session.user.id);
    if (!purchasedCourses) {
        redirect(notPurchasedRedirect);
    }
    const hasPurchased = purchasedCourses.some((purchasedCourse) => {
        return purchasedCourse.slug === courseSlug;
    });
    if (!hasPurchased) {
        redirect(notPurchasedRedirect);
    }

    return (
        <PageWrapper>
            <Suspense fallback={<p>Loading...</p>}>
                <LessonFrontPage lessonSlug={lessonSlug} />
            </Suspense>
        </PageWrapper>
    );
}
