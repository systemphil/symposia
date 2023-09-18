import {compile} from '@mdx-js/mdx'
import remarkGfm from "remark-gfm";


/**
 * Compiles strings into MDX. Configure additional plugins here.
 * @docs {@link https://mdxjs.com/packages/mdx/#compilefile-options | MDX compiler options}
 */
export const mdxCompiler = async (mdxSource: string) => {
    try {
        const mdxCompiled = String(await compile(mdxSource, {
            outputFormat: 'function-body',
            development: false,
            // ^-- Generate code for production.
            // `false` if you use `/jsx-runtime` on client, `true` if you use
            // `/jsx-dev-runtime`.
            remarkPlugins: [remarkGfm],
        }))
        return mdxCompiled;
    } catch(e) {
        throw new Error("An error occured in the mdxCompiler");
    }
}
export type MDXCompilerReturnType = Awaited<ReturnType<typeof mdxCompiler>>;