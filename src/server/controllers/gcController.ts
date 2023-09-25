import { type GetSignedUrlConfig, type GenerateSignedPostPolicyV4Options } from "@google-cloud/storage";
import { bucket } from "../bucket";
import { dbUpsertVideoById } from "./coursesController";
import { AuthenticationError, requireAdminAuth } from "@/server/auth";


type gcGenerateSignedPostUploadURLProps = {
    fileName: string;
    id?: string;
    lessonId: string;
}
/**
 * Creates a signed post url for video upload. Requires name of file and the ID of the lesson under which the video
 * will be related. Will create (using lessonId) or update Video entry based on whether existing video ID is provided.
 * Finally, will update the Video record if post url returned provided.
 * @description All lesson videos will be stored the directory named after their ID in the Video entry: /video/[VideoId]/[fileName].ext
 * @access "ADMIN"
 */
export const gcGenerateSignedPostUploadUrl = async ({
    fileName,
    id,
    lessonId,
}: gcGenerateSignedPostUploadURLProps) => {
    try {
        await requireAdminAuth();
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
        if (error instanceof AuthenticationError) {
            throw error; // Rethrow error as-is
        }
        throw new Error("An error occurred while attempting to get the upload link.");
    }
}
type gcVideoFilePathProps = {
    fileName: string;
    id: string;
}
/**
 * Deletes a video file in storage. Requires the ID of the Video entry from db and the filename.
 * @access "ADMIN"
 */
export const gcDeleteVideoFile = async ({
    fileName,
    id,
}: gcVideoFilePathProps) => {
    try {
        await requireAdminAuth();
        const filePath = `video/${id}/${fileName}`
        const res = await bucket
            .file(filePath)
            .delete()
            .then((data) => {
                return data[0];
            });
        if (res && res.statusCode === 204) {
            console.log(`${new Date().toLocaleString()} | Object ${fileName} deleted successfully.`);
            return;
        } else {
            console.error(`Failed to delete object ${filePath}`);
            console.log(res);
            throw new Error("Failed to delete object.");
        }
    } catch(error) {
        if (error instanceof AuthenticationError) {
            throw error; // Rethrow error as-is
        }
        throw new Error("An error occurred while attempting to delete file in storage.");
    }
}
/**
 * Generates a signed Read Url for specific video from bucket. Requires the ID of the Video entry from db and the filename.
 * @access PUBLIC
 */
export const gcGenerateReadSignedUrl = async ({
    fileName,
    id,
}: gcVideoFilePathProps) => {
    try {
        const filePath = `video/${id}/${fileName}`
        const options: GetSignedUrlConfig = {
            version: 'v4',
            action: "read",
            expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        };
        const [url] = await bucket
            .file(filePath)
            .getSignedUrl(options);
        return url;
    } catch(error) {
        throw new Error("An error occurred while attempting to delete file in storage.");
    }
}

// Optional for Options:
// Set a generation-match precondition to avoid potential race conditions
// and data corruptions. The request to upload is aborted if the object's
// generation number does not match your precondition. For a destination
// object that does not yet exist, set the ifGenerationMatch precondition to 0
// If the destination object already exists in your bucket, set instead a
// generation-match precondition using its generation number.