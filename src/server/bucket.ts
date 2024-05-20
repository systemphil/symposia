import { Storage } from "@google-cloud/storage";
import { env } from "process";

const rawKey = env.GCP_BUCKET_HANDLER_KEY ?? "";

const creds = rawKey
    ? JSON.parse(Buffer.from(rawKey, "base64").toString())
    : {};

const storage = new Storage({
    projectId: creds.project_id,
    credentials: creds,
});

// const storage = new Storage();

const PRIMARY_BUCKET_NAME = env.GCP_PRIMARY_BUCKET_NAME ?? "invalid";
const SECONDARY_BUCKET_NAME = env.GCP_SECONDARY_BUCKET_NAME ?? "invalid";

/**
 * Storage bucket reference instance. Call methods on this object to interact with the bucket.
 * @see https://cloud.google.com/nodejs/docs/reference/storage/latest
 */
export const primaryBucket = storage.bucket(PRIMARY_BUCKET_NAME);
export const secondaryBucket = storage.bucket(SECONDARY_BUCKET_NAME);

export async function TestBucket() {
    console.log("rawKey", rawKey);
    const sa = await storage.getProjectId();
    console.log(sa);
    const a = await storage.getServiceAccount();
    console.log(a);
}
