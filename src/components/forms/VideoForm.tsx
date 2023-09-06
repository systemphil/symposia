"use client";

import { useState } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import VideoFileInput from "./VideoFileInput";
import { Video } from "@prisma/client";
import SubmitInput from "./SubmitInput";
import { apiClientside } from "@/lib/trpc/trpcClientside";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";


const VideoForm = () => {
    const [selectedFile, setSelectedFile] = useState<File>();
    const [handlerLoading, setHandlerLoading] = useState<boolean>(false);
    const params = useParams();
    const utils = apiClientside.useContext();
    const lessonId = typeof params.lessonId === "string" ? params.lessonId : "";

    const { data: videoEntry } = apiClientside.courses.getVideoByLessonId.useQuery({ id: lessonId})

    const createSignedPostUrlMutation = apiClientside.gc.createSignedPostUrl.useMutation({
        onSuccess: () => {
            // toast.success('Course updated successfully')
            // If course is new, it should not match existing path and push user to new path. Otherwise, refresh data.
            // if (params.lessonId !== newLesson.id) {
            //     console.log("pushing to new route")
            //     router.push(`/admin/courses/${courseId}/lessons/${newLesson.id}`)
            // } else {
            //     void utils.courses.invalidate();
            // }
        },
        onError: (error) => {
            console.error(error)
            toast.error('Oops! Something went wrong')
        }
    })

    // const upsertVideoMutation = apiClientside.courses.upsertVideo.useMutation({
    //     onError: (error) => {
    //         console.error(error)
    //         toast.error('Oops! Something went wrong')
    //     }
    // })

    const handleSelectedFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target && e.target.files && e.target.files[0];
        if (file) {
            setSelectedFile(file);
        }
    }

    type VideoFormValues = Video & {
        fileInput: FileList;
    };

    const methods = useForm<VideoFormValues>({ 
        defaultValues: {
            id: videoEntry?.id || "",
            lessonId: lessonId,
            fileName: videoEntry?.fileName || "",
            fileInput: undefined,
        }
    });

    const onSubmit: SubmitHandler<VideoFormValues> = async (data) => {
        try {
            setHandlerLoading(true);
            console.log(data)

            if (!data.fileInput || data.fileInput.length === 0) {
                toast.error('No files selected!')
                setSelectedFile(undefined);
                methods.reset()
                setHandlerLoading(false);
                return;
            }
            const file = data.fileInput[0];
            // 1 encode
            const filename = encodeURIComponent(file.name);
            // 2 get signedPostUrl to gc -- use tRPC here
            const response = await createSignedPostUrlMutation.mutateAsync({
                id: videoEntry?.id || undefined,
                lessonId: lessonId,
                fileName: filename,
            })
            if (!response.url) {
                setHandlerLoading(false);
                setSelectedFile(undefined);
                methods.reset()
                toast.error('Oops! Something went wrong')
                console.error(response);
                throw new Error("No URL in the response from gc.");
            }
            const { url, fields } = response;

            const formData = new FormData();
        
            Object.entries({ ...fields, file }).forEach(([key, value]) => {
                if (typeof value === "string") {
                    formData.append(key, value);
                } else if (value instanceof Blob) {
                    formData.append(key, value, file.name);
                }
            });
            
            // 4 External post to gc
            const upload = await fetch(url, {
                method: 'POST',
                body: formData,
            });
            if (upload.ok) {
                if (videoEntry && (filename !== videoEntry.fileName)) {
                    /**
                     * If there is an existing entry and the incoming upload filename is different,
                     * the bucket will not overwrite the old file, in which case we must manually
                     * send a signal to the bucket to delete the old file. 
                     */
                    // TODO
                    console.log(`New file name detected! \nNew: ${filename} \nOld: ${videoEntry.fileName} \nInitiating signal to delete old file`)
                }
                toast.success("Success! Video uploaded / updated.")
                console.log('Uploaded successfully!');
            } else {
                toast.error('Oops! Something went wrong')
                setSelectedFile(undefined);
                methods.reset()
                setHandlerLoading(false);
                console.error('Upload failed.');
                throw new Error("Post to GC did not return OK");
            }

            void utils.courses.getVideoByLessonId.invalidate();
            setSelectedFile(undefined);
            methods.reset()
            setHandlerLoading(false);
        } catch(error) {
            setSelectedFile(undefined);
            methods.reset()
            setHandlerLoading(false);
            toast.error('Oops! Something went wrong')
            throw error;
        }
    }

    return(
        <FormProvider {...methods}>
            <form 
                className='flex flex-col max-w-lg border-dotted border-2 border-slate-500 p-4 rounded-md' 
                onSubmit={methods.handleSubmit(onSubmit)}
            >
                { videoEntry && <p>Existing video: {videoEntry.fileName}</p>}
                <VideoFileInput 
                    label='File*' 
                    name='fileInput'
                    options={{ 
                        required: true,
                        onChange: (e) => handleSelectedFileChange(e)
                    }} 
                />
                {selectedFile && (
                    <div>
                        <p>Selected File: {selectedFile.name}</p>
                    </div>
                )}

                <SubmitInput value={`${(videoEntry && videoEntry.id) ? 'Update' : 'Upload'} video`} isLoading={handlerLoading} />
            </form>
        </FormProvider>
    )
}

export default VideoForm;