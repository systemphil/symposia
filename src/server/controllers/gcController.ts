import {
    type GetSignedUrlConfig,
    type GenerateSignedPostPolicyV4Options,
} from "@google-cloud/storage";
import { TestBucket, primaryBucket, secondaryBucket } from "../bucket";
import { dbUpsertVideoById } from "./dbController";
import { AuthenticationError, requireAdminAuth } from "@/server/auth";
import { colorLog } from "@/utils/utils";

type GcGenerateSignedPostUploadURLProps = {
    fileName: string;
    id?: string;
    lessonId: string;
};
/**
 * Creates a signed post url for video upload. Requires name of file and the ID of the lesson under which the video
 * will be related. Will create (using lessonId) or update Video entry based on whether existing video ID is provided.
 * Finally, will update the Video record if post url returned provided.
 * @description All lesson videos will be stored the directory named after their ID in the Video entry: /video/[VideoId]/[fileName].ext
 * @access "ADMIN"
 */
export async function gcGenerateSignedPostUploadUrl({
    fileName,
    id,
    lessonId,
}: GcGenerateSignedPostUploadURLProps) {
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
        const filePath = `video/${videoEntry.id}/${videoEntry.fileName}`;
        const file = primaryBucket.file(filePath);
        const options: GenerateSignedPostPolicyV4Options = {
            expires: Date.now() + 1 * 60 * 1000, //  1 minute,
            fields: { "x-goog-meta-test": "data" },
        };
        const [response] = await file.generateSignedPostPolicyV4(options);
        if (response.url) {
            await dbUpsertVideoById({
                lessonId: videoEntry.lessonId,
                id: videoEntry.id,
                fileName: videoEntry.fileName,
            });
        } else {
            throw new Error(
                "Response from generateSignedPostPolicy should contain URL"
            );
        }
        return response;
    } catch (error) {
        if (error instanceof AuthenticationError) {
            throw new Error("Unauthorized.");
        }
        throw error; // Rethrow error as-is
    }
}
type GcVideoFilePathProps = {
    fileName: string;
    id: string;
};
/**
 * Deletes a video file in storage. Requires the ID of the Video entry from db and the filename.
 * @access "ADMIN"
 * @note "Directories" are automatically deleted when empty.
 */
export async function gcDeleteVideoFile({
    fileName,
    id,
}: GcVideoFilePathProps) {
    await requireAdminAuth();
    const filePath = `video/${id}/${fileName}`;
    const res = await primaryBucket
        .file(filePath)
        .delete()
        .then((data) => {
            return data[0];
        });
    if (res && res.statusCode === 204) {
        colorLog(`===OBJECT DELETED->${filePath}`);
        return;
    } else {
        console.error(`Failed to delete object ${filePath}`);
        console.log(res);
        throw new Error("Failed to delete object.");
    }
}
/**
 * Generates a signed Read Url for specific video from bucket. Requires the ID of the Video entry from db and the filename.
 * @access PUBLIC
 */
export async function gcGenerateReadSignedUrl({
    fileName,
    id,
}: GcVideoFilePathProps) {
    await TestBucket();
    const filePath = `video/${id}/${fileName}`;
    const options: GetSignedUrlConfig = {
        version: "v4",
        action: "read",
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    };
    const [url] = await primaryBucket.file(filePath).getSignedUrl(options);
    return url;
}
/**
 * Uploads image to secondary bucket and returns the public URL.
 * @access "ADMIN"
 */
export function gcPipeImageUpload({
    file,
    fileName,
}: {
    file: Buffer;
    fileName: string;
}) {
    const filePath = `images/${fileName}`;
    const blob = secondaryBucket.file(filePath);
    const blobStream = blob.createWriteStream();
    blobStream.write(file);
    blobStream.on("error", (err) => {
        console.error(err);
        throw new Error("Failed to upload image");
    });
    blobStream.on("finish", () => {
        console.log(`Image ${fileName} uploaded`);
    });
    blobStream.end(file);
    return `https://storage.googleapis.com/${process.env.GCP_SECONDARY_BUCKET_NAME}/${filePath}`;
}

// Optional for Options:
// Set a generation-match precondition to avoid potential race conditions
// and data corruptions. The request to upload is aborted if the object's
// generation number does not match your precondition. For a destination
// object that does not yet exist, set the ifGenerationMatch precondition to 0
// If the destination object already exists in your bucket, set instead a
// generation-match precondition using its generation number.
