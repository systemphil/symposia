import { AuthenticationError, requireAdminAuth } from "../auth";

type MdxGetCompiledSourceProps = {
    courseSlug: string;
    partSlug?: string;
    lessonSlug?: string;
    access: "PUBLIC" | "USER" | "ADMIN";
}
/**
 * WIP
 */
const mdxGetCompiledSource = async ({
    courseSlug, partSlug, lessonSlug, access
}: MdxGetCompiledSourceProps) => {
    try {
        await requireAdminAuth();





        return;
    } catch (error) {
        
        if (error instanceof AuthenticationError) {
            throw error; // Rethrow custom error as-is
        }
        throw new Error("An error occurred while fetching courses.");
    }
}