import {
    dbGetAllCourses, 
    dbGetCourseAndDetailsAndLessonsById, 
    dbGetLessonAndRelationsById, 
    dbGetMdxByModelId, 
    dbGetVideoByLessonId, 
    dbUpdateMdxByModelId, 
    dbUpsertCourseById, 
    dbUpsertLessonById, 
    dbUpsertLessonContentById, 
} from "@/server/controllers/coursesController";
import { createTRPCRouter, publicProcedure, protectedProcedure, protectedAdminProcedure } from "../trpc";
import * as z from "zod";
import { orderDeleteModelEntry } from "@/server/controllers/orderController";

/**
 * TypeScript Remote Procedure Call router for all matters related to the Course data model and its relations.
 */
export const coursesRouter = createTRPCRouter({
    getAllCourses: publicProcedure
        .query(async () => {
            return await dbGetAllCourses();
        }),
    getCourseAndLessonsById: protectedAdminProcedure
        .input(
            z
                .object({
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
            z
                .object({
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
            z
                .object({
                    id: z.string(),
                })
        )
        .query(async (opts) => {
            return await dbGetMdxByModelId(opts.input.id);
        }),
    getVideoByLessonId: protectedAdminProcedure
        .input(
            z
                .object({
                    id: z.string(),
                })
        )
        .query(async (opts) => {
            return await dbGetVideoByLessonId(opts.input.id);
        }),
    upsertCourse: protectedAdminProcedure
        .input(
            z
                .object({
                    id: z.string().optional(),
                    name: z.string(),
                    slug: z.string().toLowerCase(),
                    description: z.string(),
                    imageUrl: z.string().url().optional().nullish(),
                    author: z.string().optional().nullish(),
                    published: z.boolean().optional().nullish(),
                })
        )
        .mutation(async (opts) => {
            return await dbUpsertCourseById(opts.input);
        }),
    upsertLesson: protectedAdminProcedure
        .input(
            z
                .object({
                    id: z.string().optional(),
                    name: z.string(),
                    slug: z.string().toLowerCase(),
                    description: z.string(),
                    partId: z.string().optional().nullish(),
                    courseId: z.string()
                })
        )
        .mutation(async (opts) => {
            return await dbUpsertLessonById(opts.input);
        }),
    upsertLessonContent: protectedAdminProcedure //TODO schedule for deletion and CLEANUP
        .input(
            z
                .object({
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
            z
                .object({
                    id: z.string(),
                    content: z.string(),
                })
        )
        .mutation(async (opts) => {
            return await dbUpdateMdxByModelId(opts.input);
        }),
    deleteModelEntry: protectedAdminProcedure
        .input(
            z
                .object({
                    id: z.string(),
                    modelName: z.enum(["LessonTranscript", "LessonContent", "Video", "CourseDetails", "Lesson", "Course"]),
                })
        )
        .mutation(async (opts) => {
            return await orderDeleteModelEntry(opts.input);
        }),
})