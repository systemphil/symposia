import { z } from "zod";
import { type Access, AuthenticationError, requireAdminAuth } from "../auth";
import { DBGetCompiledMdxBySlugsProps } from "./coursesController";
import { mdxCompiler } from "../mdxCompiler";

// TODO delete this as we now use the db to retrieve ready-compiled mdx
export type MdxGetCompiledSourceProps = {
    partSlug?: string;
    access: Access;
} & DBGetCompiledMdxBySlugsProps;
/**
 * Get compiled, render-ready MDX by Course slug and/or Lesson slug identifiers.
 * If only Course slug is provided, it will attempt to retrieve MDX from CourseDetails,
 * otherwise lesson type must be added along with Lesson slug to retrieve MDX from
 * either LessonContent or LessonTranscript. If records are nonexistent for any of these
 * MDX models, then a placeholder string is returned.
 * @access Access must be specified.
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
        /**
         * Validation and retrieval from db
         */
        const dbGetArgs = lessonSlug && lessonType 
            ? 
                {
                    courseSlug: z.string().parse(courseSlug),
                    lessonSlug: z.string().parse(lessonSlug),
                    lessonType: lessonType,
                } 
            :
                {
                    courseSlug: z.string().parse(courseSlug),
                }
        // const uncompiledMdxContainer = await dbGetMdxBySlugs(dbGetArgs);
        /**
         * If records are non-existent in db, placeholder strings will be returned.
         * Otherwise, an object of one of many possible models is returned,
         * which needs to be filtered for the MDX string before it is compiled.
         */
        // if (typeof uncompiledMdxContainer === "string") {
        //     return await mdxCompiler(uncompiledMdxContainer);
        // }
        // return await mdxCompiler(uncompiledMdxContainer.mdx);
    } catch (error) {
        if (error instanceof AuthenticationError) {
            throw error; // Rethrow custom error as-is
        }
        throw new Error("An error occurred while fetching courses.");
    }
}