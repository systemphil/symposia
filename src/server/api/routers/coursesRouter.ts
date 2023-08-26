import { dbGetAllCourses, dbGetCourseAndLessonsById, dbGetLessonById, dbUpsertCourseById, dbUpsertLessonById } from "@/server/controllers/courses";
import { createTRPCRouter, publicProcedure, protectedProcedure, protectedAdminProcedure } from "../trpc";
import * as z from "zod";


export const coursesRouter = createTRPCRouter({
    getAllCourses: publicProcedure
        // .output(
        //     z
        //         .object({
        //             result: z.number(),
        //         })
        // )
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
                return await dbGetLessonById(opts.input.id);
            } else {
                return null;
            }
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
})