import LessonFrontPage from "@/components/LessonFrontPage";
import { stylesConfig } from "@/config/stylesConfig";
import { Suspense } from "react";

export default async function CourseFrontPageRoute ({ params }: { params: { lessonSlug: string, courseSlug: string }}) {
    const lessonSlug = params.lessonSlug;

    if (typeof lessonSlug !== "string") {
        throw new Error("missing slugs");
    }

    return (
        <main className={`h-screen flex flex-col justify-front items-center gap-4 ${stylesConfig.coursesPage.bgColor}`}>
            <Suspense fallback={<p>Loading...</p>}>
                <LessonFrontPage lessonSlug={lessonSlug} />
            </Suspense>
        </main>
    )
}