import LoadingBars from "@/components/LoadingBars";
import MDXRenderer from "@/components/MDXRenderer";
import { MdxGetCompiledSourceProps, mdxGetCompiledSource } from "@/server/controllers/mdxController";
import { Suspense } from "react";


/**
 * * TEST ROUTE
 * * /test/first-course-updated
 */
export default async function TestPage1({ params }: { params: { courseSlug: string }}) {
    const courseSlug = params.courseSlug;
    /**
     * TODO Why must I add the Props here for TS not to yell at me!?
     */
    const mdxGetArgs: MdxGetCompiledSourceProps = {
        courseSlug: courseSlug,
        access: "PUBLIC",
    }
    const compiledMdx = await mdxGetCompiledSource(mdxGetArgs)

    return (
        <main className="h-screen flex flex-col justify-front items-center gap-4 bg-slate-200">
            <p>Test page with 1 dynamic retrieval from db</p>
            <div className="container">
                <Suspense fallback={<LoadingBars />}>
                    <MDXRenderer data={compiledMdx} />
                </Suspense>
            </div>
            
            
        </main>
    )
}