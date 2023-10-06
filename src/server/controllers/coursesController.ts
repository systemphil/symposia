import { prisma } from "../db";
import * as z from "zod";
import { Course, CourseDetails, LessonContent, LessonTranscript, Video } from "@prisma/client";
import { exclude } from "@/utils/utils";
import { Access, AuthenticationError, requireAdminAuth } from "@/server/auth";
import { mdxCompiler } from "../mdxCompiler";


/**
 * Exception handler with admin check.
 * TODO consider scrapping or using
 * ? validation needs to be part of the error handling but these can be quite varied,
 * ? and would have to be accounted for here, which increases complexity and defeats the purpose of the function
 * @param retrieveFunc 
 * @returns 
 */
const checkIfAdmin = async <T>(retrieveFunc: () => Promise<T>): Promise<T> => {
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
 * Calls the database to retrieve mdx field by id of the model as identifier.
 * Converts binary content of found record to string so that it can pass the tRPC network boundary
 * and/or be passed down to Client Components from Server Components.
 * @supports LessonContent | LessonTranscript | CourseDetails
 * @access "ADMIN" | "INTERNAL" (add `true` as second argument to bypass Auth check)
 */
export const dbGetMdxByModelId = async (id: string, internal?: boolean) => {
    try {
        if (!internal) await requireAdminAuth();
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
            });
            if (!lessonTranscript) {
                /**
                 * If no matching id found, proceed to query CourseDetails.
                 */
                const courseDetails = await prisma.courseDetails.findUnique({
                    where: {
                        id: validId,
                    }
                });
                /**
                 * All three query attempts failed, throw error.
                 */
                if (!courseDetails) throw new Error("No lessonTranscript, lessonContent or courseDetails found at db call")
                /**
                 * Resolve third attempt if query successful.
                 */
                const courseDetailsContentAsString = courseDetails.mdx.toString("utf-8");
                const newResult = {
                    ...courseDetails,
                    mdx: courseDetailsContentAsString,
                }
                return newResult;
            }
            /**
             * Resolve second attempt if query successful.
             */
            const transcriptAsString = lessonTranscript.mdx.toString("utf-8");
            const newResult = {
                ...lessonTranscript,
                mdx: transcriptAsString,
            }
            return newResult;
        };
        /**
         * Resolve first attempt if query successful.
         */
        const contentAsString = lessonContent.mdx.toString("utf-8");
        const newResult = {
            ...lessonContent,
            mdx: contentAsString,
        }
        return newResult;
    } catch (error) {
        if (error instanceof AuthenticationError) {
            throw error; // Rethrow custom error as-is
        }
        throw new Error("An error occurred while fetching the course.");
    }
}
export type DBGetMdxContentByModelIdReturnType = Awaited<ReturnType<typeof dbGetMdxByModelId>>;

export type LessonTypes = "CONTENT" | "TRANSCRIPT";
export type DBGetCompiledMdxBySlugsProps = {
    courseSlug: string;
    partSlug?: string;
    access: Access;
} & (
    {
        lessonSlug: string,
        lessonType: LessonTypes;
    } | {
        lessonSlug?: never;
        lessonType?: never;
    }
)
/**
 * Get compiled MDX by Course slug and/or Lesson slug. If only Course slug is provided, the
 * function will attempt to find and retrieve the MDX of the CourseDetails that is
 * related to this course. To get the MDX pertaining to a Lesson, a lessonType must
 * be specified.
 * @todo // TODO configure access guards properly
 * @access CUSTOM - must be defined on call
 * @returns compiled MDX string OR compiled placeholder string if data model non-existent
 */
export const dbGetCompiledMdxBySlugs = async ({ 
    courseSlug, 
    lessonSlug,
    lessonType,
    partSlug,
    access,
}: DBGetCompiledMdxBySlugsProps): Promise<string> => {
    /**
     * Authentication and authorization
     */
    if (access === "ADMIN") {
        await requireAdminAuth();
    } else if (access === "USER") {
        // TODO perform "USER" checks here
    }
    const validCourseSlug = z.string().parse(courseSlug);
    const validLessonSlug = z.string().optional().parse(lessonSlug);
    const defaultMdx = `
        /*@jsxRuntime automatic @jsxImportSource react*/
        const {jsx: _jsx} = arguments[0];
        function _createMdxContent(props) {
            return _jsx("p", {
                children: "Coming soon..."
            });
        }
        function MDXContent(props = {}) {
            const {wrapper: MDXLayout} = props.components || ({});
            return MDXLayout ? _jsx(MDXLayout, Object.assign({}, props, {
                children: _jsx(_createMdxContent, props)
            })) : _createMdxContent(props);
        }
        return {
            default: MDXContent
        };
    `;
    /**
     * Since a Course may exist without CourseDetails, and Lesson may exist
     * without LessonContent and LessonTranscript, instead of throwing an error
     * a pre-compiled placeholder is returned while the respective MDX data models are non-existant.
     */
    if (validCourseSlug && validLessonSlug && lessonType) {
        if (lessonType === "CONTENT") {
            const lessonContentMdx = await prisma.lessonContent.findFirst({
                where: {
                    lesson: {
                        slug: validLessonSlug,
                        course: {
                            slug: validCourseSlug,
                        }
                    }
                },
                select: {
                    mdxCompiled: true
                }
            });
            if (!lessonContentMdx || lessonContentMdx.mdxCompiled === null) return defaultMdx;
            return lessonContentMdx.mdxCompiled;
        }
        if (lessonType === "TRANSCRIPT") {
            const lessonTranscriptMdx = await prisma.lessonTranscript.findFirst({
                where: {
                    lesson: {
                        slug: validLessonSlug,
                        course: {
                            slug: validCourseSlug,
                        }
                    }
                },
                select: {
                    mdxCompiled: true
                }
            });
            if (!lessonTranscriptMdx || lessonTranscriptMdx.mdxCompiled === null) return defaultMdx;
            return lessonTranscriptMdx.mdxCompiled;
        }
    }
    if (validCourseSlug) {
        const courseDetailsMdx = await prisma.courseDetails.findFirst({
            where: {
                course: {
                    slug: validCourseSlug,
                }
            },
            select: {
                mdxCompiled: true,
            }
        });
        if (!courseDetailsMdx || courseDetailsMdx.mdxCompiled === null) return defaultMdx;
        return courseDetailsMdx.mdxCompiled;
    }
    throw new Error("Error occured when attempting to find data models by slug(s)");
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
                mdx: contentAsBuffer,
            },
            create: {
                lessonId: validLessonId,
                mdx: contentAsBuffer
            }
        });

        const resultWithoutContent = exclude(result, ["mdx"])
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
                mdx: contentAsBuffer,
            },
            create: {
                lessonId: validLessonId,
                mdx: contentAsBuffer
            }
        });

        const resultWithoutTranscript = exclude(result, ["mdx"])
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
                mdx: contentAsBuffer,
            },
            create: {
                courseId: validCourseId,
                mdx: contentAsBuffer
            }
        });

        const resultWithoutContent = exclude(result, ["mdx"])
        return resultWithoutContent;
    } catch (error) {
        if (error instanceof AuthenticationError) {
            throw error; // Rethrow custom error as-is
        }
        throw new Error("An error occurred while upserting CourseDetails.");
    }
}

/**
 * Updates mdx field for an existing model by id as identifier.
 * @access "ADMIN""
 */
export const dbUpdateMdxByModelId = async ({
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
         * If 1, then proceed to compile mdx string for user consumption and return, otherwise proceed to check the next table until ID hit.
         * @see {@link https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#executeraw PrismaExecuteRaw}
         * @see {@link https://www.cockroachlabs.com/docs/stable/sql-statements SQL@CockroachDB}
         */
        let result: number = await prisma.$executeRaw`UPDATE "LessonContent" SET mdx = ${contentAsBuffer} WHERE id = ${validId};`
        if (result === 1) {
            const compiledMdx = await mdxCompiler(validContent);
            await prisma.lessonContent.update({
                where: {
                    id: validId,
                },
                data: {
                    mdxCompiled: compiledMdx,
                },
            });
            return;
        }
        result = await prisma.$executeRaw`UPDATE "LessonTranscript" SET mdx = ${contentAsBuffer} WHERE id = ${validId};`
        if (result === 1) {
            const compiledMdx = await mdxCompiler(validContent);
            await prisma.lessonTranscript.update({
                where: {
                    id: validId,
                },
                data: {
                    mdxCompiled: compiledMdx,
                },
            });
            return;
        }
        result = await prisma.$executeRaw`UPDATE "CourseDetails" SET mdx = ${contentAsBuffer} WHERE id = ${validId};`
        if (result === 1) {
            const compiledMdx = await mdxCompiler(validContent);
            await prisma.courseDetails.update({
                where: {
                    id: validId,
                },
                data: {
                    mdxCompiled: compiledMdx,
                },
            });
            return;
        }
        throw new Error("Database update should have returned exactly 1 updated record.")
    } catch (error) {
        if (error instanceof AuthenticationError) {
            throw error; // Rethrow custom error as-is
        }
        throw new Error("An error occurred while updating MDX resources.");
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

// TODO cleanup?
export const BACKUP_dbDeleteLessonContentById = async ({id}: {id: LessonContent["id"]}) => {
    try {
        await requireAdminAuth();
        const validId = z.string().parse(id);

        return await prisma.lessonContent.delete({
            where: {
                id: validId
            }
        });
    } catch (error) {
        if (error instanceof AuthenticationError) {
            throw error; // Rethrow custom error as-is
        }
        throw new Error("An error occured wile trying to delete LessonContent");
    }
}

// TODO cleanup?
export const BACKUP_dbDeleteLessonTranscriptById = async ({id}: {id: LessonTranscript["id"]}) => {
    try {
        await requireAdminAuth();
        const validId = z.string().parse(id);

        return await prisma.lessonTranscript.delete({
            where: {
                id: validId
            }
        });
    } catch (error) {
        
        if (error instanceof AuthenticationError) {
            throw error; // Rethrow custom error as-is
        }
        throw new Error("An error occured wile trying to delete LessonTranscript");
    }
}
/**
 * Deletes entry from the LessonTranscript model.
 * @access ADMIN
 */
export const dbDeleteLessonTranscriptById = async ({id}: {id: LessonTranscript["id"]}) => {
    const deleteEntry = async () => {
        const validId = z.string().parse(id);
        return await prisma.lessonTranscript.delete({
            where: { id: validId },
            select: { id: true },
        });
    }
    return await checkIfAdmin(deleteEntry);
}
/**
 * Deletes entry from the LessonContent model.
 * @access ADMIN
 */
export const dbDeleteLessonContentById = async ({id}: {id: LessonContent["id"]}) => {
    const deleteEntry = async () => {
        const validId = z.string().parse(id);
        return await prisma.lessonContent.delete({
            where: { id: validId },
            select: { id: true },
        });
    }
    return await checkIfAdmin(deleteEntry);
}
/**
 * Deletes entry from the Video model.
 * @access ADMIN
 */
export const dbDeleteVideoById = async ({id}: {id: Video["id"]}) => {
    const deleteEntry = async () => {
        const validId = z.string().parse(id);
        return await prisma.video.delete({
            where: { id: validId },
            select: { id: true },
        });
    }
    return await checkIfAdmin(deleteEntry);
}
/**
 * Deletes entry from the CourseDetails model
 * @access ADMIN
 */
export const dbDeleteCourseDetailsById = async ({id}: {id: CourseDetails["id"]}) => {
    const deleteEntry = async () => {
        const validId = z.string().parse(id);
        return await prisma.courseDetails.delete({ 
            where: { id: validId },
            select: { id: true },
        });
    }
    return await checkIfAdmin(deleteEntry);
}
export type ModelName = "LessonTranscript" | "LessonContent" | "Video" | "CourseDetails" | "Lesson"
type dbDeleteModelEntryProps = {
    id: string;
    modelName: ModelName;
}

export const dbDeleteModelEntry = async({id, modelName}: dbDeleteModelEntryProps) => {
    const deleteEntry = async () => {
        const validId = z.string().parse(id);

        switch(modelName) {
            case "CourseDetails":
                return await dbDeleteCourseDetailsById({ id: validId });
            case "LessonContent":
                return await dbDeleteLessonContentById({ id: validId });
            case "LessonTranscript":
                return await dbDeleteLessonTranscriptById({ id: validId });
            case "Video":
                return await dbDeleteVideoById({ id: validId });
            case "Lesson":
                console.error("INCOMPLETE");
                throw new Error("INCOMPLETE");
        }
    }
    return await checkIfAdmin(deleteEntry);
}