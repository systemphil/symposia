import { DBGetMdxContentByModelIdReturnType } from "@/server/controllers/coursesController";
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

/**
 * Utility function to remove properties from an object by field
 * @param obj Object to modify
 * @param keys[] An array of properties to omit by key
 * @returns New object with the omitted properties
 */
export function exclude<Obj, Key extends keyof Obj>(
    obj: Obj,
    keys: Key[]
): Omit<Obj, Key> {
    const newObj = { ...obj };
    keys.forEach((key) => delete newObj[key]);
    return newObj;
}

/**
 * Utility function to log to console with color. Default color is teal.
 * Adds a timestamp to the log.
 */
export function colorLog(text: string, color?: "teal" | null) {
    if (!color) console.log(`\x1b[36m${new Date().toLocaleString()} - ${text}\x1b[0m`);
    if (color === "teal") console.log(`\x1b[36m${new Date().toLocaleString()} - ${text}\x1b[0m`);
}
