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
export const dbGetCourseAndLessonsBySlug = async (slug: string) => {
    try {
        const validSlug = z.string().parse(slug);
        await requireAdminAuth();
        return await prisma.course.findFirst({
            where: {
                slug: validSlug,
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
export const dbUpsertCourseBySlug = async ({
    name, description, slug
}: {
    slug: string, name: string, description: string
}) => {
    try {
        const validName = z.string().parse(name);
        const validDescription = z.string().parse(description);
        const validSlug = z.string().parse(slug);
        
        await requireAdminAuth();
        return await prisma.course.upsert({
            where: {
                slug: validSlug
            },
            update: {
                name: validName,
                description: validDescription,
            },
            create: {
                name: validName,
                description: validDescription,
                slug: validSlug,
            }
            
        });
    } catch (error) {
        if (error instanceof AuthenticationError) {
            throw error; // Rethrow custom error as-is
        }
        throw new Error("An error occurred while fetching the course.");
    }
}