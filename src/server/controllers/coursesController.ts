import { prisma } from "../db";
import * as z from "zod";
import { Course, CourseDetails, LessonContent, LessonTranscript } from "@prisma/client";
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
 * Calls the database to retrieve specific course, its course details and lessons by id identifier.
 * @access "ADMIN""
 */
export const dbGetCourseAndDetailsAndLessonsById = async (id: string) => {
    try {
        const validId = z.string().parse(id);
        await requireAdminAuth();
        return await prisma.course.findFirst({
            where: {
                id: validId,
            },
            include: {
                lessons: true,
                details: {
                    select: {
                        id: true
                    }
                }
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
 * Calls the database to retrieve mdx content by id of the model as identifier.
 * Converts binary content of found record to string so that it can pass the tRPC network boundary
 * and/or be passed down to Client Components from Server Components.
 * @supports LessonContent | LessonTranscript | CourseDetails
 * @access "ADMIN""
 */
export const dbGetMdxContentByModelId = async (id: string) => {
    try {
        await requireAdminAuth();
        const validId = z.string().parse(id);
        /**
         * tRPC cannot handle binary transmission, so the buffer from each below must be converted to string.
         * And then new object is made from shallow copy of the result with the updated content field.
         * 
         * First we look for a match in the LessonContent Model
         */
        const lessonContent = await prisma.lessonContent.findUnique({
            where: {
                id: validId,
            },
        });
        if (!lessonContent) {
            /**
             * If no matching id found, proceed to query LessonTranscript.
             */
            const lessonTranscript = await prisma.lessonTranscript.findUnique({
                where: {
                    id: validId,
                }
            })
            if (!lessonTranscript) {
                /**
                 * If no matching id found, proceed to query CourseDetails.
                 */
                const courseDetails = await prisma.courseDetails.findUnique({
                    where: {
                        id: validId,
                    }
                })
                /**
                 * All three query attempts failed, throw error.
                 */
                if (!courseDetails) throw new Error("No lessonTranscript, lessonContent or courseDetails found at db call")
                /**
                 * Resolve third attempt if query successful.
                 */
                const courseDetailsContentAsString = courseDetails.content.toString("utf-8");
                const newResult = {
                    ...courseDetails,
                    content: courseDetailsContentAsString,
                }
                return newResult;
            }
            /**
             * Resolve second attempt if query successful.
             */
            const transcriptAsString = lessonTranscript.transcript.toString("utf-8");
            const newResult = {
                ...lessonTranscript,
                transcript: transcriptAsString,
            }
            return newResult;
        };
        /**
         * Resolve first attempt if query successful.
         */
        const contentAsString = lessonContent.content.toString("utf-8");
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
export type DBGetMdxContentByModelIdReturnType = Awaited<ReturnType<typeof dbGetMdxContentByModelId>>;

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
 * Updates an existing CourseDetails  model by id as identifier or creates a new one if id is not provided.
 * Must have the id of the Course this CourseDetails relates to.
 * @access "ADMIN""
 */
export const dbUpsertCourseDetailsById = async ({
    id, courseId, content
}: {
    id?: CourseDetails["id"], 
    courseId: Course["id"], 
    content: string,
}) => {
    try {
        await requireAdminAuth();

        const validId = id ? z.string().parse(id) : "x"; // Prisma needs id of some value
        const validCourseId = z.string().parse(courseId);

        const contentAsBuffer = Buffer.from(content, 'utf-8');
        
        const result = await prisma.courseDetails.upsert({
            where: {
                id: validId
            },
            update: {
                content: contentAsBuffer,
            },
            create: {
                courseId: validCourseId,
                content: contentAsBuffer
            }
        });

        const resultWithoutContent = exclude(result, ["content"])
        return resultWithoutContent;
    } catch (error) {
        if (error instanceof AuthenticationError) {
            throw error; // Rethrow custom error as-is
        }
        throw new Error("An error occurred while upserting CourseDetails.");
    }
}

/**
 * Updates an existing lessonContent or lessonTranscript by id as identifier.
 * @description If lessonContent, updates the content field.
 * @description If lessonTranscript, updates the transcript field.
 * @access "ADMIN""
 */
export const dbUpdateMdxContentByModelId = async ({
    id, content
}: {
    id: LessonContent["id"] | LessonTranscript["id"] | CourseDetails["id"], 
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
        if (result === 0) {
            result = await prisma.$executeRaw`UPDATE "CourseDetails" SET content = ${contentAsBuffer} WHERE id = ${validId};`
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