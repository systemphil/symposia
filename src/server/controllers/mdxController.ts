import { AuthenticationError, requireAdminAuth } from "../auth";
import { type LessonTypes } from "./coursesController";

type MdxGetCompiledSourceProps = {
    courseSlug: string;
    partSlug?: string;
    lessonSlug?: string;
    lessonType?: LessonTypes;
    access: "PUBLIC" | "USER" | "ADMIN";
}
/**
 * TODO - WIP
 */
export const mdxGetCompiledSource = async ({
    courseSlug, partSlug, lessonSlug, lessonType, access
}: MdxGetCompiledSourceProps) => {
    try {
        /**
         * Authentication and authorization
         */
        if (access === "ADMIN") {
            await requireAdminAuth();
        } else if (access === "USER") {
            // TODO perform "USER" checks here
        }
        

        return;
    } catch (error) {
        
        if (error instanceof AuthenticationError) {
            throw error; // Rethrow custom error as-is
        }
        throw new Error("An error occurred while fetching courses.");
    }
}