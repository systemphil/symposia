import { LessonFrontPage } from "@/components/LessonFrontPage";
import { LoadingBall } from "@/components/LoadingBall";
import FadeIn from "@/components/animations/FadeIn";
import { errorMessages } from "@/config/errorMessages";
import { getServerAuthSession } from "@/server/auth";
import { dbGetUserPurchasedCourses } from "@/server/controllers/dbController";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

export default async function LessonFrontPageRoute({
    params,
}: {
    params: { lessonSlug: string; courseSlug: string };
}) {
    const lessonSlug = params.lessonSlug;
    const courseSlug = params.courseSlug;
    const notPurchasedRedirect = `/courses/${courseSlug}?error=${errorMessages.courseNotPurchased}`;

    if (typeof lessonSlug !== "string") {
        return redirect(`/?error=${errorMessages.missingParams}`);
    }

    const session = await getServerAuthSession();
    if (!session) {
        return redirect(
            `/courses/${courseSlug}?error=${errorMessages.mustBeLoggedIn}`
        );
    }

    const purchasedCourses = await dbGetUserPurchasedCourses(session.user.id);
    if (!purchasedCourses) {
        return redirect(notPurchasedRedirect);
    }
    const hasPurchased = purchasedCourses.some((purchasedCourse) => {
        return purchasedCourse.slug === courseSlug;
    });
    if (!hasPurchased) {
        return redirect(notPurchasedRedirect);
    }

    return (
        <FadeIn>
            <Suspense fallback={<Loading />}>
                <LessonFrontPage lessonSlug={lessonSlug} />
            </Suspense>
        </FadeIn>
    );
}

function Loading() {
    return (
        <div className="flex w-full justify-center mt-10 min-h-screen">
            <LoadingBall />
        </div>
    );
}
