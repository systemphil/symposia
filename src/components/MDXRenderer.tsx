"use client";

import {run} from '@mdx-js/mdx'
import { MDXModule } from 'mdx/types';
import { Fragment, useEffect, useState } from 'react';
import * as runtime from 'react/jsx-runtime' 

const MDXRenderer = ({data}: {data: string}) => {

    const [mdxModule, setMdxModule] = useState<MDXModule | undefined>(undefined);
    const Content = mdxModule ? mdxModule.default : Fragment

    useEffect(() => {
        ;(async () => {
            setMdxModule(await run(data, runtime))
        })()
    }, [data])

    return (
        <article className="prose max-w-none w-full">
            <Content />
        </article>
    )
}

export default MDXRenderer;