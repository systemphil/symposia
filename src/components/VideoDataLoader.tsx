"use client";

import { useEffect, useRef, useState } from "react";
import VideoViewer from "./VideoViewer";
import { apiClientside } from "@/lib/trpc/trpcClientside";
import toast from "react-hot-toast";
import { Video } from "@prisma/client";

export function VideoDataLoader({ videoEntry }: { videoEntry: Video }) {
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [isError, setIsError] = useState(false);
    const isCalledRef = useRef(false);

    const createSignedReadUrlMutation =
        apiClientside.gc.createSignedReadUrl.useMutation({
            onError: (error) => {
                console.error(error);
            },
        });

    useEffect(() => {
        if (videoEntry && !videoUrl) {
            if (isCalledRef.current === true) return;
            if (isError) return;
            isCalledRef.current = true; // Stop double call in strict mode.
            createSignedReadUrlMutation
                .mutateAsync({
                    id: videoEntry.id,
                    fileName: videoEntry.fileName,
                })
                .then((url) => {
                    setVideoUrl(url);
                })
                .catch((error) => {
                    setIsError(true);
                    toast.error("Oops! Unable to get video preview");
                    console.error("Error retrieving preview URL: ", error);
                })
                .finally(() => {
                    isCalledRef.current = false;
                });
        }
    }, [videoEntry, createSignedReadUrlMutation, videoUrl, isError]);

    if (videoUrl) {
        return <VideoViewer videoUrl={videoUrl} />;
    }

    if (isError) {
        return (
            <div className="flex items-center justify-center w-full h-full">
                <div className="text-center mt-4">
                    <h1 className="text-2xl font-semibold">Error ⛓️‍💥</h1>
                    <p className="text-sm text-gray-500">
                        Unable to load video preview
                    </p>
                </div>
            </div>
        );
    }

    return <div className="skeleton w-full h-full"></div>;
}
