import { 
    dbGetAllCourses, 
    dbGetCourseAndLessonsById, 
    dbGetLessonAndRelationsById, 
    dbGetLessonContentById, 
    dbUpsertCourseById, 
    dbUpsertLessonById, 
    dbUpsertLessonContentById 
} from "@/server/controllers/courses";
import { createTRPCRouter, publicProcedure, protectedProcedure, protectedAdminProcedure } from "../trpc";
import * as z from "zod";
import { Buffer } from "node:buffer";


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
                return await dbGetCourseAndLessonsById(opts.input.id);
            } else {
                return null;
            }
        }),
    getLessonAndContentsById: protectedAdminProcedure
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
    getLessonContentById: protectedAdminProcedure
        .input(
            z
                .object({
                    id: z.string(),
                })
        )
        .query(async (opts) => {
            return await dbGetLessonContentById(opts.input.id);
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
    upsertLessonContent: protectedAdminProcedure
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
})