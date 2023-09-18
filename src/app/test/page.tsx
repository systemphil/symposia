import LoadingBars from "@/components/LoadingBars";
import MDXRenderer from "@/components/MDXRenderer";
import { dbGetMdxContentByModelId } from "@/server/controllers/coursesController"
import { mdxCompiler } from "@/server/mdxCompiler";
import { Suspense } from "react";



export default async function TestPage() {

    // TODO all these serverside things can be put into a single controller function.
    const dataString = await dbGetMdxContentByModelId("cllv8cfcy0001u22swg51l885");

    // TODO refactor this to its own function
    let incomingMarkdown: string;
    let incomingType: string;
    if ("transcript" in dataString) {
        incomingMarkdown = dataString.transcript;
        incomingType = "transcript";
    } else if ("content" in dataString) {
        incomingMarkdown = dataString.content;
        incomingType = "content";
    } else {
        incomingType = "nothing";
        incomingMarkdown = "No content available.";
    }

    const compiledMdx = await mdxCompiler(incomingMarkdown);

    return (
        <main className="h-screen flex flex-col justify-front items-center gap-4 bg-slate-200">
            <p>Test page with hardcoded retrieval from db</p>
            <div className="container">
                <Suspense fallback={<LoadingBars />}>
                    <MDXRenderer data={compiledMdx} />
                </Suspense>
            </div>
            
            
        </main>
    )
}