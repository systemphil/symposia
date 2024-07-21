import {
    dbCreateNewsletterEmail,
    dbGetAllCourses,
    dbGetCourseAndDetailsAndLessonsById,
    dbGetLessonAndRelationsById,
    dbGetMdxByModelId,
    dbGetVideoByLessonId,
    dbUpdateMdxByModelId,
    dbUpsertLessonById,
    dbUpsertLessonContentById,
    dbVerifyUserPurchase,
} from "@/server/controllers/dbController";
import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
    protectedAdminProcedure,
} from "../trpc";
import * as z from "zod";
import {
    orderCreateOrUpdateCourse,
    orderDeleteModelEntry,
} from "@/server/controllers/orderController";

/**
 * TypeScript Remote Procedure Call router for all matters related to the Course data model and its relations.
 */
export const dbRouter = createTRPCRouter({
    getAllCourses: publicProcedure.query(async () => {
        return await dbGetAllCourses();
    }),
    getCourseAndLessonsById: protectedAdminProcedure
        .input(
            z.object({
                id: z.string().optional(),
            })
        )
        .query(async (opts) => {
            if (opts.input.id) {
                return await dbGetCourseAndDetailsAndLessonsById(opts.input.id);
            } else {
                return null;
            }
        }),
    getLessonAndRelationsById: protectedAdminProcedure
        .input(
            z.object({
                id: z.string().optional(),
            })
        )
        .query(async (opts) => {
            if (opts.input.id) {
                return await dbGetLessonAndRelationsById(opts.input.id);
            } else {
                return null;
            }
        }),
    getMdxByModelId: protectedAdminProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .query(async (opts) => {
            return await dbGetMdxByModelId(opts.input.id);
        }),
    getVideoByLessonId: protectedAdminProcedure
        .input(
            z.object({
                id: z.string(),
            })
        )
        .query(async (opts) => {
            return await dbGetVideoByLessonId(opts.input.id);
        }),
    getVerifiedPurchase: protectedProcedure
        .input(
            z.object({
                userId: z.string(),
                purchasePriceId: z.string(),
            })
        )
        .query(async (opts) => {
            return await dbVerifyUserPurchase(
                opts.input.userId,
                opts.input.purchasePriceId
            );
        }),
    upsertCourse: protectedAdminProcedure
        .input(
            z.object({
                id: z.string().optional(),
                name: z.string(),
                slug: z.string().toLowerCase(),
                description: z.string(),
                basePrice: z.number().positive(),
                seminarPrice: z.number().positive(),
                dialoguePrice: z.number().positive(),
                imageUrl: z.string().url().nullable(),
                author: z.string().nullable(),
                published: z.boolean(),
                baseAvailability: z.date(),
                seminarAvailability: z.date(),
                dialogueAvailability: z.date(),
            })
        )
        .mutation(async (opts) => {
            return await orderCreateOrUpdateCourse(opts.input);
        }),
    upsertLesson: protectedAdminProcedure
        .input(
            z.object({
                id: z.string().optional(),
                name: z.string(),
                slug: z.string().toLowerCase(),
                description: z.string(),
                partId: z.string().optional().nullish(),
                courseId: z.string(),
            })
        )
        .mutation(async (opts) => {
            return await dbUpsertLessonById(opts.input);
        }),
    upsertLessonContent: protectedAdminProcedure //TODO schedule for deletion and CLEANUP
        .input(
            z.object({
                id: z.string().optional(),
                lessonId: z.string(),
                content: z.string(),
            })
        )
        .mutation(async (opts) => {
            return await dbUpsertLessonContentById(opts.input);
        }),
    updateMdxByModelId: protectedAdminProcedure
        .input(
            z.object({
                id: z.string(),
                content: z.string(),
            })
        )
        .mutation(async (opts) => {
            return await dbUpdateMdxByModelId(opts.input);
        }),
    deleteModelEntry: protectedAdminProcedure
        .input(
            z.object({
                id: z.string(),
                modelName: z.enum([
                    "LessonTranscript",
                    "LessonContent",
                    "Video",
                    "CourseDetails",
                    "Lesson",
                    "Course",
                ]),
            })
        )
        .mutation(async (opts) => {
            return await orderDeleteModelEntry(opts.input);
        }),
    createNewsletterEmailEntry: publicProcedure
        .input(
            z.object({
                email: z.string().email(),
            })
        )
        .mutation(async (opts) => {
            return await dbCreateNewsletterEmail(opts.input);
        }),
});
