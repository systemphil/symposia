/**
 * Set in seconds
 */
export const CACHE_REVALIDATION_INTERVAL = 60; // 60 * 60 * 24 * 1; // 1 day

export const CACHE_REVALIDATION_INTERVAL_MAINTENANCE =
    process.env.NODE_ENV === "development" ? 10 : 60 * 60; // 1 hour
