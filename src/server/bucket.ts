import { Storage } from "@google-cloud/storage";
import { env } from "process";

const creds = {
    type: "service_account",
    project_id: env.GCP_PROJECT_ID,
    private_key_id: env.GCP_PRIVATE_KEY_ID,
    private_key: env.GCP_PRIVATE_KEY,
    client_email: env.GCP_CLIENT_EMAIL,
    client_id: env.GCP_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: env.GCP_CLIENT_X509_CERT_URL,
    universe_domain: "googleapis.com",
};

const storage = new Storage({
    projectId: env.GCP_PROJECT_ID,
    credentials: creds,
});

const PRIMARY_BUCKET_NAME = env.GCP_PRIMARY_BUCKET_NAME ?? "invalid";
const SECONDARY_BUCKET_NAME = env.GCP_SECONDARY_BUCKET_NAME ?? "invalid";

/**
 * Storage bucket reference instance. Call methods on this object to interact with the bucket.
 * @see https://cloud.google.com/nodejs/docs/reference/storage/latest
 */
export const primaryBucket = storage.bucket(PRIMARY_BUCKET_NAME);
export const secondaryBucket = storage.bucket(SECONDARY_BUCKET_NAME);
