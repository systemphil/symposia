import LoadingBars from "@/components/LoadingBars";
import MDXRenderer from "@/components/MDXRenderer";
import { DBGetCompiledMdxBySlugsProps, dbGetCompiledMdxBySlugs } from "@/server/controllers/coursesController";
import { Suspense } from "react";


/**
 * * TEST ROUTE
 * * /test/first-course-updated/logic-introduction
 */
export default async function TestPage2({ params }: { params: { courseSlug: string, lessonSlug: string}}) {
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
    }
    const compiledMdx = await dbGetCompiledMdxBySlugs(mdxGetArgs)

    const mdxGetArgs2: DBGetCompiledMdxBySlugsProps = {
        courseSlug: courseSlug,
        lessonSlug: lessonSlug,
        lessonType: "TRANSCRIPT",
        access: "PUBLIC",
    }
    const compiledMdx2 = await dbGetCompiledMdxBySlugs(mdxGetArgs2)

    return (
        <main className="h-screen flex flex-col justify-front items-center gap-4 bg-slate-200">
            <p>Test page with 2 dynamic retrieval from db</p>
            <div className="container">
                <p>Content:</p>
                <Suspense fallback={<LoadingBars />}>
                    <MDXRenderer data={compiledMdx} />
                </Suspense>

                <p>Transcript</p>
                <Suspense fallback={<LoadingBars />}>
                    <MDXRenderer data={compiledMdx2} />
                </Suspense>
            </div>
            
            
        </main>
    )
}