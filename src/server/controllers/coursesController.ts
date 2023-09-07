import { prisma } from "../db";
import * as z from "zod";
import { LessonContent, LessonTranscript } from "@prisma/client";
import { exclude } from "@/utils/utils";
import { AuthenticationError, requireAdminAuth } from "@/server/auth";


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
 * Calls the database to retrieve all published courses.
 * @access PUBLIC
 */
export const dbGetAllPublishedCourses = async () => {
    return await prisma.course.findMany({
        where: {
            published: true,
        }
    })
}

/**
 * Calls the database to retrieve specific course by slug identifier
 * @access PUBLIC
 */
export const dbGetCourseBySlug = async (slug: string) => {
    return await prisma.course.findUnique({
        where: {
            slug: slug,
        }
    })
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
 * Calls the database to retrieve specific lesson and relations by id identifier. Does not include fields with byte objects, only plain objects.
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
                content: {
                    select: {
                        id: true,
                        lessonId: true,
                    }
                },
                transcript: {
                    select: {
                        id: true,
                        lessonId: true
                    }
                },
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
 * Calls the database to retrieve specific lessonContent or lessonTranscript by id identifier.
 * Converts binary content of found record to string so that it can pass the tRPC network boundary
 * and/or be passed down to Client Components from Server Components. 
 * @access "ADMIN""
 */
export const dbGetLessonContentOrLessonTranscriptById = async (id: string) => {
    try {
        await requireAdminAuth();
        const validId = z.string().parse(id);
        const lessonContent = await prisma.lessonContent.findUnique({
            where: {
                id: validId,
            },
        });
        if (!lessonContent) {
            const lessonTranscript = await prisma.lessonTranscript.findUnique({
                where: {
                    id: validId,
                }
            })
            if (!lessonTranscript) throw new Error("No lessonTranscript or lessonContent found at db call")
            const transcriptAsString = lessonTranscript.transcript.toString("utf-8");
            const newResult = {
                ...lessonTranscript,
                transcript: transcriptAsString,
            }
            return newResult;
        };
        // tRPC cannot handle binary transmission, so the buffer must be converted to string here.
        const contentAsString = lessonContent.content.toString("utf-8");
        // New object is made from shallow copy of the result with the updated content field.
        const newResult = {
            ...lessonContent,
            content: contentAsString,
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
 * Calls the database to retrieve specific Video entry based on the ID of the Lesson it is related to. 
 * Returns null when either Lesson or its related Video is not found.
 * @access "ADMIN"
 */
export const dbGetVideoByLessonId = async (id: string) => {
    try {
        const validId = z.string().parse(id);
        await requireAdminAuth();
        const lessonWithVideo = await prisma.lesson.findUnique({
            where: {
                id: validId,
            },
            include: {
                video: true
            }
        });
        if (lessonWithVideo) {
            if (lessonWithVideo.video) {
                return lessonWithVideo.video;
            }
            return null;
        }
        return null;
    } catch (error) {
        if (error instanceof AuthenticationError) {
            throw error; // Rethrow custom error as-is
        }
        throw new Error("An error occurred while retrieving the video from database.");
    }
}

type DbUpsertCourseByIdProps = {
    id?: string, 
    slug: string, 
    name: string, 
    description: string, 
    imageUrl?: string | null, 
    published?: boolean | null, 
    author?: string | null,
}

/**
 * Updates an existing course details by id as identifier or creates a new one if id is not provided.
 * @access "ADMIN""
 */
export const dbUpsertCourseById = async ({
    id, name, description, slug, imageUrl, published, author
}: DbUpsertCourseByIdProps) => {
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
        
        const result = await prisma.lessonContent.upsert({
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

        const resultWithoutContent = exclude(result, ["content"])
        return resultWithoutContent;
    } catch (error) {
        if (error instanceof AuthenticationError) {
            throw error; // Rethrow custom error as-is
        }
        throw new Error("An error occurred while fetching the course.");
    }
}

/**
 * Updates an existing LessonTranscript model by id as identifier or creates a new one if id is not provided.
 * Must have the id of the Lesson this LessonTranscript relates to.
 * @access "ADMIN""
 */
export const dbUpsertLessonTranscriptById = async ({
    id, lessonId, transcript
}: {
    id?: LessonTranscript["id"], 
    lessonId: LessonContent["lessonId"], 
    transcript: string,
}) => {
    try {
        await requireAdminAuth();

        const validId = id ? z.string().parse(id) : "x"; // Prisma needs id of some value
        const validLessonId = z.string().parse(lessonId);

        const contentAsBuffer = Buffer.from(transcript, 'utf-8');
        
        const result = await prisma.lessonTranscript.upsert({
            where: {
                id: validId
            },
            update: {
                transcript: contentAsBuffer,
            },
            create: {
                lessonId: validLessonId,
                transcript: contentAsBuffer
            }
        });

        const resultWithoutTranscript = exclude(result, ["transcript"])
        return resultWithoutTranscript;
    } catch (error) {
        if (error instanceof AuthenticationError) {
            throw error; // Rethrow custom error as-is
        }
        throw new Error("An error occurred while fetching the course.");
    }
}

/**
 * Updates an existing lessonContent or lessonTranscript by id as identifier.
 * @description If lessonContent, updates the content field.
 * @description If lessonTranscript, updates the transcript field.
 * @access "ADMIN""
 */
export const dbUpdateLessonContentOrLessonTranscriptById = async ({
    id, content
}: {
    id: LessonContent["id"] | LessonTranscript["id"], 
    content: string,
}) => {
    try {
        await requireAdminAuth();
        const validId = z.string().parse(id);
        const validContent = z.string().parse(content);

        const contentAsBuffer = Buffer.from(validContent, 'utf-8');
        /**
         * Prisma does not allow us to traverse two tables at once, so we made SQL executions directly with $executeRaw where
         * prisma returns the number of rows affected by the query instead of an error in the usual prisma.update(). 
         * First we try to update one table where there is an id match, and, then, we check how many rows were affected.
         * If 0, then that means the first update did not find an id match, and so we try with the second
         * table, which should work. The overall result should be exactly 1 number of records updated.
         * @see {@link https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#executeraw PrismaExecuteRaw}
         * @see {@link https://www.cockroachlabs.com/docs/stable/sql-statements SQL@CockroachDB}
         */
        let result = await prisma.$executeRaw`UPDATE "LessonContent" SET content = ${contentAsBuffer} WHERE id = ${validId};`

        if (result === 0) {
            result = await prisma.$executeRaw`UPDATE "LessonTranscript" SET transcript = ${contentAsBuffer} WHERE id = ${validId};`
        }

        if (result === 1) {
            return;
        } else {
            throw new Error("Database update should have returned exactly 1 updated record.")
        }
    } catch (error) {
        if (error instanceof AuthenticationError) {
            throw error; // Rethrow custom error as-is
        }
        throw new Error("An error occurred while fetching the course.");
    }
}

/**
 * Updates Video details by id as identifier or creates a new one if id is not provided, in which case 
 * the id of the lesson this video is related to must be provided.
 * @access "ADMIN""
 */
export const dbUpsertVideoById = async ({
    id, lessonId, fileName
}: {
    id?: string, 
    lessonId: string,
    fileName?: string,
}) => {
    try {
        await requireAdminAuth();

        const validId = id ? z.string().parse(id) : "x"; // Prisma needs id of some value in order to query
        const validLessonId = z.string().parse(lessonId);
        const validFileName = fileName ? z.string().parse(fileName) : "";
        
        return await prisma.video.upsert({
            where: {
                id: validId,
            },
            update: {
                fileName: validFileName,
            },
            create: {
                lessonId: validLessonId,
                fileName: validFileName,
            }
        });
    } catch (error) {
        if (error instanceof AuthenticationError) {
            throw error; // Rethrow custom error as-is
        }
        throw new Error("An error occurred while fetching the course.");
    }
}