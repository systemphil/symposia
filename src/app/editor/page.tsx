import Editor from "@/components/Editor";
import { Suspense } from "react";

// TODO test route for editor, needs CLEANUP once done
export default function EditorPage() {
    return (
        <Suspense fallback={<span className="loading loading-bars loading-lg justify-center flex items-center"></span>}>
            <Editor />
        </Suspense>
    )
}