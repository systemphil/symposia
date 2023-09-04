import { Storage } from "@google-cloud/storage";

const storage = new Storage({keyFilename: 'key.json'});

const BUCKET_NAME = "sphil-test-assets-bucket"

/**
 * Storage bucket reference instance. Call methods on this object to interact with the bucket.
 * @see https://cloud.google.com/nodejs/docs/reference/storage/latest
 */
export const bucket = storage.bucket(BUCKET_NAME);