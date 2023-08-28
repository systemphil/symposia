"use client";

import React, { forwardRef } from "react";
import dynamic from "next/dynamic";
import { headingsPlugin } from '@mdxeditor/editor/plugins/headings'
import { listsPlugin } from '@mdxeditor/editor/plugins/lists'
import { quotePlugin } from '@mdxeditor/editor/plugins/quote'
import { thematicBreakPlugin } from '@mdxeditor/editor/plugins/thematic-break'
import { UndoRedo } from '@mdxeditor/editor/plugins/toolbar/components/UndoRedo'
import { BoldItalicUnderlineToggles } from '@mdxeditor/editor/plugins/toolbar/components/BoldItalicUnderlineToggles'
import { toolbarPlugin } from '@mdxeditor/editor/plugins/toolbar'
import { 
    AdmonitionDirectiveDescriptor,
    AdmonitionKind,
    BlockTypeSelect,
    ChangeAdmonitionType,
    ChangeCodeMirrorLanguage,
    CodeBlockEditorDescriptor,
    CodeToggle,
    ConditionalContents,
    CreateLink,
    DiffSourceToggleWrapper,
    EditorInFocus,
    InsertAdmonition,
    InsertCodeBlock,
    InsertFrontmatter,
    InsertImage,
    InsertTable,
    InsertThematicBreak,
    ListsToggle,
    MDXEditor,
    MDXEditorMethods, 
    MDXEditorProps, 
    Separator, 
    ShowSandpackInfo, 
    codeBlockPlugin, 
    codeMirrorPlugin, 
    diffSourcePlugin, 
    directivesPlugin,
    frontmatterPlugin,
    imagePlugin,
    linkDialogPlugin,
    linkPlugin,
    markdownShortcutPlugin,
    tablePlugin,
    useCodeBlockEditorContext,
} from "@mdxeditor/editor";
import { apiClientside } from "@/lib/trpc/trpcClientside";

// const DynamicMDXEditor = dynamic(
//     () => import('@mdxeditor/editor').then((mod) => mod.MDXEditor), 
//     { ssr: false }
// )

// const MDXEditor = React.forwardRef<MDXEditorMethods, MDXEditorProps>((props, editorRef) => {
//     return <DynamicMDXEditor ref={editorRef} {...props} />;
// });

// const PlainTextCodeEditorDescriptor: CodeBlockEditorDescriptor = {
//         // always use the editor, no matter the language or the meta of the code block
//         match: (language, meta) => true,
//         // You can have multiple editors with different priorities, so that there's a "catch-all" editor (with the lowest priority)
//         priority: 0,
//         // The Editor is a React component
//         Editor: (props) => {
//             const cb = useCodeBlockEditorContext()
//             // stops the proppagation so that the parent lexical editor does not handle certain events.
//             return (
//                 <div onKeyDown={(e) => e.nativeEvent.stopImmediatePropagation()}>
//                     <textarea rows={10} cols={100} defaultValue={props.code} onChange={(e) => cb.setCode(e.target.value)} />
//                 </div>
//             )
//         }
//     }

export default function Editor() {
    const editorRef = React.useRef<MDXEditorMethods>(null)
    const utils = apiClientside.useContext();
    const upsertLessonContentMutation = apiClientside.courses.upsertLessonContent.useMutation({
        onSuccess: () => {
            // toast.success('Course updated successfully')
            console.log("success! lesson content updated/created")
            utils.courses.getLessonContentById.invalidate();
        },
        onError: (error) => {
            console.error(error)
            // toast.error('Something went wrong')
        }
    })
    const {data: incomingLessonContent} = apiClientside.courses.getLessonContentById.useQuery({
        id: "cllv8cfcy0001u22swg51l885",
    })
    
    const handleSave = async () => {
        const markdownValue = editorRef.current?.getMarkdown();
        if (!markdownValue) {
            console.log("no markdown value", markdownValue)
            return;    
        }
        
        upsertLessonContentMutation.mutate({
            id: "cllv8cfcy0001u22swg51l885",
            lessonId: "cllrxst0m0002u28key43ydf9",
            content: markdownValue
        })
    };

    const handleFetchMarkdown = async () => {
        if (!incomingLessonContent) {
            console.log("Attempting invalidate...");
            utils.courses.getLessonContentById.invalidate();
        }
        if (incomingLessonContent) {
            editorRef.current?.setMarkdown(incomingLessonContent.content);
        }
    }

    return (
        <>
            <button className="btn btn-primary" onClick={() => editorRef.current?.setMarkdown("# Test \n Here we go \n - dope \n - cool")}>Set new markdown</button>
            <button className="btn btn-primary" onClick={() => console.log(editorRef.current?.getMarkdown())}>Get markdown</button>
            <button className="btn btn-primary" onClick={() => handleSave()}>Save markdown to db</button>
            <button className="btn btn-primary" onClick={() => handleFetchMarkdown()}>Get markdown from db</button>
            <MDXEditor 
                ref={editorRef}
                markdown="Hello **world**!"
                contentEditableClassName="prose max-w-none"
                plugins={[
                    listsPlugin(),
                    quotePlugin(),
                    headingsPlugin(),
                    linkPlugin(),
                    linkDialogPlugin(),
                    imagePlugin(),
                    tablePlugin(),
                    thematicBreakPlugin(),
                    frontmatterPlugin(),
                    codeBlockPlugin({ defaultCodeBlockLanguage: 'txt' }),
                    // codeBlockPlugin({ codeBlockEditorDescriptors: [PlainTextCodeEditorDescriptor] }),
                    codeMirrorPlugin({ codeBlockLanguages: { js: 'JavaScript', css: 'CSS', txt: 'text', tsx: 'TypeScript' } }),
                    directivesPlugin({ directiveDescriptors: [ AdmonitionDirectiveDescriptor] }),
                    diffSourcePlugin({ viewMode: 'rich-text', diffMarkdown: 'boo' }),
                    markdownShortcutPlugin(),
                    toolbarPlugin({
                        toolbarContents: () => (
                            <DefaultToolbar />
                        )
                    })
                ]}
            />
            <div className="border-neutral-border border-dashed border-t-[1px]"></div>
        </>
    )
}

const DefaultToolbar: React.FC = () => {
    return (
        <DiffSourceToggleWrapper>
            <ConditionalContents
                options={[
                    { when: (editor) => editor?.editorType === 'codeblock', contents: () => <ChangeCodeMirrorLanguage /> },
                    { when: (editor) => editor?.editorType === 'sandpack', contents: () => <ShowSandpackInfo /> },
                    { fallback: () => (
                        <>
                            <UndoRedo />
                            <Separator />
                            <BoldItalicUnderlineToggles />
                            <CodeToggle />
                            <Separator />
                            <ListsToggle />
                            <Separator />
            
                            <ConditionalContents
                                options={[
                                    { when: whenInAdmonition, contents: () => <ChangeAdmonitionType /> }, 
                                    { fallback: () => <BlockTypeSelect /> }
                                ]}
                            />
            
                            <Separator />
            
                            <CreateLink />
                            <InsertImage />
            
                            <Separator />
            
                            <InsertTable />
                            <InsertThematicBreak />
            
                            <Separator />
                            <InsertCodeBlock />
            
                            <ConditionalContents
                                options={[
                                    {
                                        when: (editorInFocus) => !whenInAdmonition(editorInFocus),
                                        contents: () => (
                                        <>
                                            <Separator />
                                            <InsertAdmonition />
                                        </>
                                        )
                                    }
                                ]}
                            />
            
                            <Separator />
                            <InsertFrontmatter />
                        </>
                    )}
                ]}
            />
        </DiffSourceToggleWrapper>
    )
}

function whenInAdmonition(editorInFocus: EditorInFocus | null) {
    const node = editorInFocus?.rootNode
    if (!node || node.getType() !== 'directive') {
        return false
    }
  
    return ['note', 'tip', 'danger', 'info', 'caution'].includes(node.getMdastNode().name as AdmonitionKind)
}