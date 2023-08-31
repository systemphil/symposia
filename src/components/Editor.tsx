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
    Button,
    ChangeAdmonitionType,
    ChangeCodeMirrorLanguage,
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
    MDXEditorMethods, 
    MDXEditorProps, 
    Separator, 
    ShowSandpackInfo, 
    TooltipWrap, 
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
} from "@mdxeditor/editor";
import { apiClientside } from "@/lib/trpc/trpcClientside";
import { type dbGetLessonContentOrLessonTranscriptById } from "@/server/controllers/coursesController";
import Heading from "./Heading";
import { Lesson } from "@prisma/client";


const DynamicMDXEditor = dynamic(
    () => import('./WrappedEditor'), 
    { ssr: false }
)
const ForwardedRefMDXEditor = forwardRef<MDXEditorMethods, MDXEditorProps>((props, ref) => (
    <DynamicMDXEditor {...props} editorRef={ref} />
))

type EditorProps = {
    initialLessonMaterial: Awaited<ReturnType<(typeof dbGetLessonContentOrLessonTranscriptById)>>;
    lessonName: Lesson["name"];
}

/**
 * MDX Editor that allows live, rich text editing of markdown files on the client. 
 * Renders only on Clientside through Next's dynamic import and a forwardRef wrapping so
 * that useRef hook properly is passed down to the function.
 * @param props includes LessonContent object and lessonName string
 */
export default function Editor({ initialLessonMaterial, lessonName }: EditorProps) {
    const editorRef = React.useRef<MDXEditorMethods>(null)
    const utils = apiClientside.useContext();
    const updateLessonMaterialMutation = apiClientside.courses.updateLessonContentOrLessonTranscript.useMutation({
        onSuccess: () => {
            // toast.success('Course updated successfully')
            console.log("success! lesson content updated/created")
            utils.courses.getLessonContentOrLessonTranscriptById.invalidate();
        },
        onError: (error) => {
            console.error(error)
            // toast.error('Something went wrong')
        }
    })

    if (!initialLessonMaterial) throw new Error("lessonMaterial Data missing / could not be retrieved from server")

    const {data: lessonMaterial} = apiClientside.courses.getLessonContentOrLessonTranscriptById.useQuery({ id: initialLessonMaterial.id}, {
        initialData: initialLessonMaterial,
        refetchOnMount: false,
        refetchOnReconnect: false,
    })
    
    if (!lessonMaterial) throw new Error("lessonMaterial Data missing / could not be retrieved from client query")

    const handleSave = async () => {
        const markdownValue = editorRef.current?.getMarkdown();
        if (!markdownValue) {
            console.error("No markdown value in handleSave", markdownValue)
            return;    
        }
        
        updateLessonMaterialMutation.mutate({
            id: lessonMaterial.id,
            content: markdownValue
        });
    }

    // const handleFetchMarkdown = async () => {
    //     if (!lessonMaterial) {
    //         console.log("Attempting invalidate...");
    //         utils.courses.getLessonContentOrLessonTranscriptById.invalidate();
    //     }
    //     if (lessonMaterial) {
    //         editorRef.current?.setMarkdown(lessonMaterial.content);
    //     }
    // }

    let incomingMarkdown: string;
    if ("transcript" in lessonMaterial) {
        incomingMarkdown = lessonMaterial.transcript;
    } else if ("content" in lessonMaterial) {
        incomingMarkdown = lessonMaterial.content;
    } else {
        incomingMarkdown = "No content available.";
    }

    return (
        <>
            <Heading as="h1">Editing contents of "<span className="italic">{lessonName}</span>&nbsp;"</Heading>
            {/* //TODO BTN below only for testing, CLEANUP when done */}
            <button className="btn btn-primary" onClick={() => console.log(editorRef.current?.getMarkdown())}>Get markdown</button>
            <ForwardedRefMDXEditor 
                ref={editorRef}
                markdown={incomingMarkdown}
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
                            <DefaultToolbar handleSave={handleSave}/>
                        )
                    })
                ]}
            />
            <div className="border-neutral-border border-dashed border-t-[1px] mb-16"></div>
        </>
    )
}

type DefaultToolbarProps = {
    handleSave: () => void;
}
const DefaultToolbar: React.FC<DefaultToolbarProps> = ({ handleSave }) => {

    const handleSaveButton = () => {
        handleSave();
    }

    return (
        <DiffSourceToggleWrapper>
            <ConditionalContents
                options={[
                    { when: (editor) => editor?.editorType === 'codeblock', contents: () => <ChangeCodeMirrorLanguage /> },
                    { when: (editor) => editor?.editorType === 'sandpack', contents: () => <ShowSandpackInfo /> },
                    { fallback: () => (
                        <>  
                            <TooltipWrap title="Save to database">
                                <Button onClick={() => handleSaveButton()}>💾</Button>
                            </TooltipWrap>
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