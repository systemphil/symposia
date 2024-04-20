import { Suspense } from "react";
import CourseFrontPage from "@/components/CourseFrontPage";

export default async function CourseFrontPageRoute ({ params }: { params: { courseSlug: string }}) {
    const slug = params.courseSlug;

    if (typeof slug !== "string") {
        throw new Error("missing course slug");
    }

    return (
        <main className={`h-screen flex flex-col justify-front items-center gap-4`}>
            <Suspense fallback={<p>Loading...</p>}>
                <CourseFrontPage slug={slug}/>
            </Suspense>
        </main>
    )
}