"use client";

import React, { createContext, useContext } from "react";
import {
    AdmonitionDirectiveDescriptor,
    BlockTypeSelect,
    BoldItalicUnderlineToggles,
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
    MDXEditor,
    MDXEditorMethods,
    Separator,
    ShowSandpackInfo,
    TooltipWrap,
    UndoRedo,
    codeBlockPlugin,
    codeMirrorPlugin,
    diffSourcePlugin,
    directivesPlugin,
    frontmatterPlugin,
    headingsPlugin,
    imagePlugin,
    linkDialogPlugin,
    linkPlugin,
    listsPlugin,
    markdownShortcutPlugin,
    quotePlugin,
    tablePlugin,
    thematicBreakPlugin,
    toolbarPlugin,
} from "@mdxeditor/editor";
import { apiClientside } from "@/lib/trpc/trpcClientside";
import { type dbGetMdxByModelId } from "@/server/controllers/dbController";
import Heading from "./Heading";
import toast from "react-hot-toast";
import LoadingBars from "./LoadingBars";
import { DebugBtn } from "./DebugBtn";
import { UploadProfileImageResponse } from "@/app/api/image-upload/route";

/**
 * Context to hold the state of mutation loading as passing props did not work with the MDXEditor Toolbar.
 */
const EditorContext = createContext(false);

export type EditorProps = {
    initialMaterial: Awaited<ReturnType<typeof dbGetMdxByModelId>>;
    title: string;
};
/**
 * MDX Editor that allows live, rich text editing of markdown files on the client.
 * Renders only on Clientside through Next's dynamic import and a forwardRef wrapping so
 * that useRef hook properly is passed down to the function.
 * @param props includes MDX string and title string
 */
export default function EditorInternals({
    initialMaterial,
    title,
}: EditorProps) {
    const editorRef = React.useRef<MDXEditorMethods>(null);
    const utils = apiClientside.useContext();
    const updateMaterialMutation =
        apiClientside.db.updateMdxByModelId.useMutation({
            onSuccess: () => {
                toast.success("Success! Saved to database.");
                utils.db.getMdxByModelId.invalidate();
            },
            onError: (error) => {
                console.error(error);
                toast.error("Something went wrong");
            },
        });

    if (!initialMaterial)
        throw new Error(
            "lessonMaterial Data missing / could not be retrieved from server"
        );

    const { data: material } = apiClientside.db.getMdxByModelId.useQuery(
        { id: initialMaterial.id },
        {
            initialData: initialMaterial,
            refetchOnMount: false,
            refetchOnReconnect: false,
        }
    );

    if (!material)
        throw new Error(
            "lessonMaterial Data missing / could not be retrieved from client query"
        );

    const handleSave = async () => {
        const markdownValue = editorRef.current?.getMarkdown();
        if (!markdownValue) {
            console.error("No markdown value in handleSave", markdownValue);
            return;
        }

        updateMaterialMutation.mutate({
            id: material.id,
            content: markdownValue,
        });
    };

    const handleSelectedFileImageUpload = async (file: File) => {
        if (!file) {
            throw new Error("No file selected");
        }
        const body = new FormData();
        body.set("image", file);

        const response = await fetch("/api/image-upload", {
            method: "POST",
            body,
        });
        if (!response.ok) {
            toast.error("Error uploading profile image");
            throw new Error("Error uploading profile image");
        }

        const result: UploadProfileImageResponse = await response.json();
        if (!result) {
            toast.error("Error uploading profile image");
            throw new Error("Error uploading profile image");
        }
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return result.imageUrl;
    };

    return (
        <>
            <Heading as="h1">
                Editing {material.mdxCategory.toLowerCase()} of &quot;
                <span className="italic">{title}</span>&nbsp;&quot;
            </Heading>
            <EditorContext.Provider value={updateMaterialMutation.isLoading}>
                <MDXEditor
                    ref={editorRef}
                    markdown={material.mdx}
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
                        codeBlockPlugin({ defaultCodeBlockLanguage: "txt" }),
                        // codeBlockPlugin({ codeBlockEditorDescriptors: [PlainTextCodeEditorDescriptor] }),
                        imagePlugin({
                            imageUploadHandler: handleSelectedFileImageUpload,
                        }),
                        codeMirrorPlugin({
                            codeBlockLanguages: {
                                js: "JavaScript",
                                css: "CSS",
                                txt: "text",
                                tsx: "TypeScript",
                            },
                        }),
                        directivesPlugin({
                            directiveDescriptors: [
                                AdmonitionDirectiveDescriptor,
                            ],
                        }),
                        diffSourcePlugin({
                            viewMode: "rich-text",
                            diffMarkdown: "boo",
                        }),
                        markdownShortcutPlugin(),
                        toolbarPlugin({
                            toolbarContents: () => (
                                <DefaultToolbar handleSave={handleSave} />
                            ),
                        }),
                    ]}
                />
            </EditorContext.Provider>
            <div className="border-neutral-border border-dashed border-t-[1px] mb-16"></div>
            <DebugBtn
                onClick={() => console.log(editorRef.current?.getMarkdown())}
            >
                DEBUG:Print markdown to console
            </DebugBtn>
        </>
    );
}

type DefaultToolbarProps = {
    handleSave: () => void;
};
const DefaultToolbar: React.FC<DefaultToolbarProps> = ({ handleSave }) => {
    const isLoading = useContext(EditorContext);

    const handleSaveButton = () => {
        handleSave();
    };

    return (
        <DiffSourceToggleWrapper>
            <ConditionalContents
                options={[
                    {
                        when: (editor) => editor?.editorType === "codeblock",
                        contents: () => <ChangeCodeMirrorLanguage />,
                    },
                    {
                        when: (editor) => editor?.editorType === "sandpack",
                        contents: () => <ShowSandpackInfo />,
                    },
                    {
                        fallback: () => (
                            <>
                                <TooltipWrap title="Save to database">
                                    <div className="w-[29px] h-[32px]">
                                        {isLoading ? (
                                            <LoadingBars size="xs" />
                                        ) : (
                                            <Button
                                                onClick={() =>
                                                    handleSaveButton()
                                                }
                                            >
                                                💾
                                            </Button>
                                        )}
                                    </div>
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
                                        {
                                            when: whenInAdmonition,
                                            contents: () => (
                                                <ChangeAdmonitionType />
                                            ),
                                        },
                                        { fallback: () => <BlockTypeSelect /> },
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
                                            when: (editorInFocus) =>
                                                !whenInAdmonition(
                                                    editorInFocus
                                                ),
                                            contents: () => (
                                                <>
                                                    <Separator />
                                                    <InsertAdmonition />
                                                </>
                                            ),
                                        },
                                    ]}
                                />

                                <Separator />
                                <InsertFrontmatter />
                            </>
                        ),
                    },
                ]}
            />
        </DiffSourceToggleWrapper>
    );
};

function whenInAdmonition(editorInFocus: EditorInFocus | null) {
    const node = editorInFocus?.rootNode;
    if (!node || node.getType() !== "directive") {
        return false;
    }
    return ["note", "tip", "danger", "info", "caution"].includes(
        // @ts-expect-error
        node.getMdastNode().name
    );
}
