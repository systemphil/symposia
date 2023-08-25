import { env } from "process";

/**
 * Utility function for obtaining the base URL of the application.
 * @returns base URL
 */
export const getBaseUrl = (): string => {
    // Check if the code is running in a browser environment
    if (typeof window !== "undefined") return "";

    const baseUrl = 
        env.NODE_ENV === "development"  // Check if environment is development
            ? `http://localhost:3000`   // If development, use localhost:3000
            : `${env.NEXTAUTH_URL}`;    // If not development, use URL provided in environment variable

    return baseUrl;
}