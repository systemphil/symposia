import { prisma } from "../db";
import { getServerAuthSession } from "../auth";
import * as z from "zod";
import { LessonContent } from "@prisma/client";

class AuthenticationError extends Error {
    constructor() {
        super("Access denied. Insufficient Authentication.");
        this.name = "AuthenticationError";
    }
}

/**
 * Checks the user's authentication session for admin access.
 *
 * This function verifies whether the user's authentication session is valid and
 * has the role of "ADMIN". If the user is not authenticated or doesn't have the
 * required role, an AuthenticationError is thrown.
 *
 * @throws {AuthenticationError} If the user is not authenticated or lacks admin access.
 * @returns {Promise<void>} A Promise that resolves if the user has admin access.
 * @async
 */
const requireAdminAuth = async (): Promise<void> => {
    const session = await getServerAuthSession();

    if (!session || session.user.role !== "ADMIN") {
        throw new AuthenticationError();
    }
};

/**
 * Exception handler with admin check.
 * TODO consider scrapping or using
 * ? validation needs to be part of the error handling but these can be quite varied,
 * ? and would have to be accounted for here, which increases complexity and defeats the purpose of the function
 * @param retrieveFunc 
 * @returns 
 */
const adminDatabaseErrorHandling = async <T>(retrieveFunc: () => Promise<T>): Promise<T> => {
    try {
        await requireAdminAuth();
        return await retrieveFunc();
    } catch (error) {
        if (error instanceof AuthenticationError) {
            throw error; // Rethrow error as-is
        }
        throw new Error("An error occured while fetching the data.");
    }
}

/**
 * Calls the database to retrieve all courses.
 * @access "ADMIN""
 */
export const dbGetAllCourses = async () => {
    try {
        await requireAdminAuth();
        return await prisma.course.findMany();
    } catch (error) {
        if (error instanceof AuthenticationError) {
            throw error; // Rethrow custom error as-is
        }
        throw new Error("An error occurred while fetching courses.");
    }
}

/**
 * Calls the database to retrieve specific course and lessons by id identifier.
 * @access "ADMIN""
 */
export const dbGetCourseAndLessonsById = async (id: string) => {
    try {
        const validId = z.string().parse(id);
        await requireAdminAuth();
        return await prisma.course.findFirst({
            where: {
                id: validId,
            },
            include: {
                lessons: true
            }
        });
    } catch (error) {
        if (error instanceof AuthenticationError) {
            throw error; // Rethrow custom error as-is
        }
        throw new Error("An error occurred while fetching the course.");
    }
}

/**
 * Calls the database to retrieve specific lesson and its contents by id identifier.
 * @access "ADMIN""
 */
export const dbGetLessonAndRelationsById = async (id: string) => {
    try {
        await requireAdminAuth();
        const validId = z.string().parse(id);
        return await prisma.lesson.findFirst({
            where: {
                id: validId,
            },
            include: {
                part: true,
                content: true,
                transcript: true,
                video: true,
            }
        });
    } catch (error) {
        if (error instanceof AuthenticationError) {
            throw error; // Rethrow custom error as-is
        }
        throw new Error("An error occurred while fetching the course.");
    }
}

/**
 * Calls the database to retrieve specific lessonContent data by id identifier.
 * @access "ADMIN""
 */
export const dbGetLessonContentById = async (id: string) => {
    try {
        await requireAdminAuth();
        const validId = z.string().parse(id);
        const result = await prisma.lessonContent.findFirst({
            where: {
                id: validId,
            },
        });
        if (!result) return;
        // tRPC cannot handle binary transfer, so the buffer must be converted to string here.
        const contentAsString = result?.content.toString("utf-8");
        const newResult = {
            ...result,
            content: contentAsString
        }
        return newResult;
    } catch (error) {
        if (error instanceof AuthenticationError) {
            throw error; // Rethrow custom error as-is
        }
        throw new Error("An error occurred while fetching the course.");
    }
}

/**
 * Updates an existing course details by id as identifier or creates a new one if id is not provided.
 * @access "ADMIN""
 */
export const dbUpsertCourseById = async ({
    id, name, description, slug, imageUrl, published, author
}: {
    id?: string, 
    slug: string, 
    name: string, 
    description: string, 
    imageUrl?: string | null, 
    published?: boolean | null, 
    author?: string | null,
}) => {
    try {
        await requireAdminAuth();

        const validId = id ? z.string().parse(id) : "x"; // Prisma needs id of some value
        const validName = z.string().parse(name);
        const validDescription = z.string().parse(description);
        const validSlug = z.string().toLowerCase().parse(slug);
        const validImageUrl = imageUrl ? z.string().url().parse(imageUrl) : undefined;
        const validAuthor = author ? z.string().parse(author) : undefined;
        const validPublished = published ? z.boolean().parse(published) : undefined;
        
        return await prisma.course.upsert({
            where: {
                id: validId
            },
            update: {
                name: validName,
                slug: validSlug,
                description: validDescription,
                imageUrl: validImageUrl,
                author: validAuthor,
                published: validPublished
            },
            create: {
                name: validName,
                description: validDescription,
                slug: validSlug,
                imageUrl: validImageUrl,
                author: validAuthor,
                published: validPublished,
            }
        });
    } catch (error) {
        if (error instanceof AuthenticationError) {
            throw error; // Rethrow custom error as-is
        }
        throw new Error("An error occurred while fetching the course.");
    }
}

/**
 * Updates an existing lesson details by id as identifier or creates a new one if id is not provided.
 * @access "ADMIN""
 */
export const dbUpsertLessonById = async ({
    id, name, description, slug, partId, courseId
}: {
    id?: string, 
    slug: string, 
    name: string, 
    description: string, 
    partId?: string | null, 
    courseId: string | null,
}) => {
    try {
        await requireAdminAuth();

        const validId = id ? z.string().parse(id) : "x"; // Prisma needs id of some value
        const validName = z.string().parse(name);
        const validDescription = z.string().parse(description);
        const validSlug = z.string().toLowerCase().parse(slug);
        const validPartId = partId ? z.string().parse(partId) : undefined;
        const validCourseId = z.string().parse(courseId);
        
        return await prisma.lesson.upsert({
            where: {
                id: validId
            },
            update: {
                name: validName,
                slug: validSlug,
                description: validDescription,
                partId: validPartId,
            },
            create: {
                name: validName,
                description: validDescription,
                slug: validSlug,
                courseId: validCourseId,
                partId: validPartId,
            }
        });
    } catch (error) {
        if (error instanceof AuthenticationError) {
            throw error; // Rethrow custom error as-is
        }
        throw new Error("An error occurred while fetching the course.");
    }
}

/**
 * Updates an existing lessonContent details by id as identifier or creates a new one if id is not provided.
 * @access "ADMIN""
 */
export const dbUpsertLessonContentById = async ({
    id, lessonId, content
}: {
    id?: LessonContent["id"], 
    lessonId: LessonContent["lessonId"], 
    content: string,
}) => {
    try {
        await requireAdminAuth();

        const validId = id ? z.string().parse(id) : "x"; // Prisma needs id of some value
        const validLessonId = z.string().parse(lessonId);

        const contentAsBuffer = Buffer.from(content, 'utf-8');
        
        await prisma.lessonContent.upsert({
            where: {
                id: validId
            },
            update: {
                content: contentAsBuffer,
            },
            create: {
                lessonId: validLessonId,
                content: contentAsBuffer
            }
        });
        return;
    } catch (error) {
        if (error instanceof AuthenticationError) {
            throw error; // Rethrow custom error as-is
        }
        throw new Error("An error occurred while fetching the course.");
    }
}