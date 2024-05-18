import LoadingBars from "@/components/LoadingBars";
import { MDXRenderer } from "@/components/MDXRenderer";
import {
    DBGetCompiledMdxBySlugsProps,
    dbGetCompiledMdxBySlugs,
} from "@/server/controllers/dbController";
import { Suspense } from "react";

export const dynamic = "force-dynamic";
/**
 * * TEST ROUTE
 * * /test/first-course-updated/logic-introduction
 */
export default async function TestPage2({
    params,
}: {
    params: { courseSlug: string; lessonSlug: string };
}) {
    const courseSlug = params.courseSlug;
    const lessonSlug = params.lessonSlug;
    /**
     * TODO Why must I add the Props here for TS not to yell at me!?
     */
    const mdxGetArgs: DBGetCompiledMdxBySlugsProps = {
        courseSlug: courseSlug,
        lessonSlug: lessonSlug,
        lessonType: "CONTENT",
        access: "PUBLIC",
    };
    const compiledMdx = await dbGetCompiledMdxBySlugs(mdxGetArgs);

    const mdxGetArgs2: DBGetCompiledMdxBySlugsProps = {
        courseSlug: courseSlug,
        lessonSlug: lessonSlug,
        lessonType: "TRANSCRIPT",
        access: "PUBLIC",
    };
    const compiledMdx2 = await dbGetCompiledMdxBySlugs(mdxGetArgs2);

    return (
        <main className="h-full flex flex-col justify-front items-center gap-4 bg-slate-200">
            <p>Test page with 2 dynamic retrieval from db</p>
            <div className="container">
                <p className="bg-red-400 w-full p-2">Content:</p>
                <div className="border-black border-2 border-dashed">
                    <Suspense fallback={<LoadingBars />}>
                        <MDXRenderer data={compiledMdx} />
                    </Suspense>
                </div>

                <p className="bg-blue-400 w-full p-2 mt-12">Transcript</p>
                <div className="border-black border-2 border-dashed mb-28">
                    <Suspense fallback={<LoadingBars />}>
                        <MDXRenderer data={compiledMdx2} />
                    </Suspense>
                </div>
            </div>
        </main>
    );
}
