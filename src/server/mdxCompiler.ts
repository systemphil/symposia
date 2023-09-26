import {compile} from '@mdx-js/mdx'
import remarkGfm from "remark-gfm";
import remarkDirective from 'remark-directive';


/**
 * Compiles MDX strings into JavaScript. Configure additional plugins here.
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
            remarkPlugins: [remarkGfm, remarkDirective, adminitionPlugin],
        }));
        return mdxCompiled;
    } catch(e) {
        throw new Error("An error occured in the mdxCompiler");
    }
}
export type MDXCompilerReturnType = Awaited<ReturnType<typeof mdxCompiler>>;


// Register `hName`, `hProperties` types, used when turning markdown to HTML:
/// <reference types="mdast-util-to-hast" />
// Register directive nodes in mdast:
/// <reference types="mdast-util-directive" />

import {h} from 'hastscript'
import {visit} from 'unist-util-visit'

const ADMONITION_TYPES = ["note", "tip", "danger", "info", "caution"]

// import {Node as MDASTNode} from 'mdast-util-definitions/lib';

// This plugin is an example to turn `::youtube` into iframes.
// This plugin is an example to turn `::note` into divs, passing arbitrary
// attributes.
function adminitionPlugin() {
    // TODO review library
    // tree ought to be Node from mdast-util-definitions/lib but TS is throwing that
    // type instantiation is excessively deep and possibly infinite.
    // @ts-ignore
    return (tree) => {
        visit(tree, (node) => {
            if (
                node.type === 'containerDirective' ||
                node.type === 'leafDirective' ||
                node.type === 'textDirective'
            ) {
                if (ADMONITION_TYPES.includes(node.name)) {

                    const data = node.data || (node.data = {})
                    const tagName = node.type === 'textDirective' ? 'span' : 'div'
                    
                    if (node.name === ADMONITION_TYPES[0]) {
                        node.attributes = {
                            ...node.attributes,
                            class: '_admonitionNote_13nbk_63', 
                        };
                    } else if (node.name === ADMONITION_TYPES[1]) {
                        node.attributes = {
                            ...node.attributes,
                            class: '_admonitionTip_13nbk_63', 
                        };
                    } else if (node.name === ADMONITION_TYPES[2]) {
                        node.attributes = {
                            ...node.attributes,
                            class: '_admonitionDanger_13nbk_63', 
                        };
                    } else if (node.name === ADMONITION_TYPES[3]) {
                        node.attributes = {
                            ...node.attributes,
                            class: '_admonitionInfo_13nbk_63', 
                        };
                    } else if (node.name === ADMONITION_TYPES[4]) {
                        node.attributes = {
                            ...node.attributes,
                            class: '_admonitionCaution_13nbk_63', 
                        };
                    }
                    
                    data.hName = tagName
                    data.hProperties = h(tagName, node.attributes || {}).properties
                }
            }
        })
    }
}