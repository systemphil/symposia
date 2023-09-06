import { type GenerateSignedPostPolicyV4Options } from "@google-cloud/storage";
import { bucket } from "../bucket";
import { dbUpsertVideoById } from "./coursesController";


interface gcGenerateSignedPostUploadURLProps {
    fileName: string;
    id?: string;
    lessonId: string;
}

export const gcGenerateSignedPostUploadUrl = async ({
    fileName,
    id,
    lessonId,
}: gcGenerateSignedPostUploadURLProps) => {
    try {
        const videoEntry = {
            id: id,
            fileName: fileName,
            lessonId: lessonId,
        };
        if (!videoEntry.id) {
            const newVideoEntry = await dbUpsertVideoById({ lessonId });
            videoEntry.id = newVideoEntry.id;
        }
        const filePath = `video/${videoEntry.id}/${videoEntry.fileName}`
        const file = bucket.file(filePath);
        const options: GenerateSignedPostPolicyV4Options = {
            expires: Date.now() + 1 * 60 * 1000, //  1 minute,
            fields: { 'x-goog-meta-test': 'data' },
        }
        const [response] = await file.generateSignedPostPolicyV4(options);
        if (response.url) {
            await dbUpsertVideoById({
                lessonId: videoEntry.lessonId,
                id: videoEntry.id,
                fileName: videoEntry.fileName,
            })
        } else {
            throw new Error("Response from generateSignedPostPolicy should contain URL");
        }
        return response;
    } catch (error) {
        throw new Error("An error occurred while attempting to get the upload link.")
    }
}