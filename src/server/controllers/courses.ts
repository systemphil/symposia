import { prisma } from "../db";
import { getServerAuthSession } from "../auth";
import * as z from "zod";

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
 * Calls the database to retrieve specific course and lessons by slug identifier.
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
 * Updates or creates course details by slug as identifier.
 * @access "ADMIN""
 */
export const dbUpsertCourseById = async ({
    id, name, description, slug, imageUrl, published, author
}: {
    id: string, slug: string, name: string, description: string, imageUrl?: string, published?: boolean, author?: string
}) => {
    try {
        await requireAdminAuth();

        const validId = z.string().parse(id);
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