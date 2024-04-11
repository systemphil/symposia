"use client";

import { useEffect, useRef, useState } from "react";
import VideoViewer from "./VideoViewer";
import { apiClientside } from "@/lib/trpc/trpcClientside";
import toast from "react-hot-toast";
import { Video } from "@prisma/client";



export function VideoDisplay({videoEntry}: {videoEntry: Video }) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const isCalledRef = useRef(false);

    const createSignedReadUrlMutation = apiClientside.gc.createSignedReadUrl.useMutation({
        onError: (error) => { console.error(error)}
    })

    useEffect(() => {
        if (videoEntry && !previewUrl) {
            if (isCalledRef.current === true) return;
            isCalledRef.current = true; // Stop double call in strict mode.
            createSignedReadUrlMutation
                .mutateAsync({ id: videoEntry.id, fileName: videoEntry.fileName})
                .then((url) => {
                    setPreviewUrl(url);
                })
                .catch((error) => {
                    toast.error("Oops! Unable to get video preview");
                    console.error("Error retrieving preview URL: ", error);
                })
                .finally(() => {
                    isCalledRef.current = false;
                });
        }
    }, [videoEntry, createSignedReadUrlMutation, previewUrl]);

    if (previewUrl) {
        return <VideoViewer videoUrl={previewUrl} />
    } 

    return <div>Loading</div>
}