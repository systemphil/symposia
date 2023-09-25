import LoadingBars from "@/components/LoadingBars";
import MDXRenderer from "@/components/MDXRenderer";
import { DBGetCompiledMdxBySlugsProps, dbGetCompiledMdxBySlugs } from "@/server/controllers/coursesController";
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
    const mdxGetArgs: DBGetCompiledMdxBySlugsProps = {
        courseSlug: courseSlug,
        access: "PUBLIC",
    }

    // const compiledMdx = await mdxGetCompiledSource(mdxGetArgs)
    const mdxCompiled = await dbGetCompiledMdxBySlugs(mdxGetArgs);

    // if (!mdxResource || mdxResource.mdxCompiled === null) {
    //     return(
    //         <p>compiledMdx is null</p>
    //     )
    // }
    return (
        <main className="h-screen flex flex-col justify-front items-center gap-4 bg-slate-200">
            <p>Test page with 1 dynamic retrieval from db</p>
            <div className="container">
                <Suspense fallback={<LoadingBars />}>
                    <MDXRenderer data={mdxCompiled} />
                </Suspense>
            </div>
            
            
        </main>
    )
}