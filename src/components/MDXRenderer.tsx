"use client";

import { run } from '@mdx-js/mdx';
import { Fragment, useEffect, useState } from 'react';
import * as runtime from 'react/jsx-runtime';
import { type MDXModule } from 'mdx/types';
import { type MDXCompilerReturnType } from '@/server/mdxCompiler';
import LoadingBars from './LoadingBars';


/**
 * Renders MDX content to the UI. Requires compiled MDX string. TailwindCSS formatting applied through prose using tailwindcss/typography.
 * To configure MDX plugins, please see the compiler.
 * @docs {@link https://mdxjs.com/guides/mdx-on-demand/ | MDX on-demand}
 */
const MDXRenderer = ({ data }: {data: MDXCompilerReturnType}) => {
    const [mdxModule, setMdxModule] = useState<MDXModule | undefined>(undefined);
    const Content = mdxModule ? mdxModule.default : Fragment

    /**
     * The `;` at the start of the code in the useEffect below is used to ensure correct interpretation by the JS parser.
     * The `(() => {})()` is an immediately invoked function expression (IIFE). Creates a self-contained scope for variables and
     * execution without polluting the surrounding scope.
     * @docs {@link https://developer.mozilla.org/en-US/docs/Glossary/IIFE | About IIFE }
     */
    useEffect(() => {
        ;(async () => {
            setMdxModule(await run(data, runtime))
        })()
    }, [data])

    return (
        <>
            {(
                mdxModule
            ) ? (
                <article className="_editorRoot_w1wlt_36 _editorWrapper_w1wlt_133 mdxeditor">
                    <div className="block">
                        <div className="_rootContentEditableWrapper_w1wlt_1022">
                            <div className="_contentEditable_w1wlt_339 prose max-w-none w-full">
                                <Content />
                            </div>
                        </div>
                    </div>
                </article>
            ) : (
                <LoadingBars />
            )}
        </>
    )
}

export default MDXRenderer;