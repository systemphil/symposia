"use client";

import { run } from "@mdx-js/mdx";
import { Fragment, useEffect, useState } from "react";
import * as runtime from "react/jsx-runtime";
import { type MDXModule } from "mdx/types";
import { type MDXCompilerReturnType } from "@/server/mdxCompiler";
import LoadingBars from "./LoadingBars";

/**
 * Renders MDX content to the UI. Requires compiled MDX string. TailwindCSS formatting applied through prose using tailwindcss/typography.
 * To configure MDX plugins, please see the compiler.
 * @docs {@link https://mdxjs.com/guides/mdx-on-demand/ | MDX on-demand}
 */
export const MDXRenderer = ({ data }: { data: MDXCompilerReturnType }) => {
    const [mdxModule, setMdxModule] = useState<MDXModule | undefined>(
        undefined
    );
    const Content = mdxModule ? mdxModule.default : Fragment;

    /**
     * The `;` at the start of the code in the useEffect below is used to ensure correct interpretation by the JS parser.
     * The `(() => {})()` is an immediately invoked function expression (IIFE). Creates a self-contained scope for variables and
     * execution without polluting the surrounding scope.
     * @docs {@link https://developer.mozilla.org/en-US/docs/Glossary/IIFE | About IIFE }
     */
    useEffect(() => {
        (async () => {
            setMdxModule(await run(data, runtime));
        })();
    }, [data]);

    return (
        <>
            {mdxModule ? (
                <article className="mdxeditor _editorRoot_uazmk_53 _editorWrapper_uazmk_154">
                    <div className="mdxeditor-rich-text-editor block">
                        <div className="_rootContentEditableWrapper_uazmk_1097 mdxeditor-root-contenteditable">
                            <div className="_contentEditable_uazmk_379 prose max-w-none w-full">
                                <Content />
                            </div>
                        </div>
                    </div>
                </article>
            ) : (
                <LoadingBars />
            )}
        </>
    );
};
