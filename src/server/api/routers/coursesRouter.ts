import { dbGetAllCourses, dbGetCourseAndLessonsBySlug, dbUpsertCourseBySlug } from "@/server/controllers/courses";
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
    getCourseAndLessonsBySlug: protectedAdminProcedure
        .input(
            z
                .object({
                    slug: z.string()
                })
        )
        .query(async (opts) => {
            return await dbGetCourseAndLessonsBySlug(opts.input.slug);
        }),
    upsertCourse: protectedAdminProcedure
        .input(
            z
                .object({
                    name: z.string(),
                    slug: z.string(),
                    description: z.string(),
                })
        )
        .mutation(async (opts) => {
            return await dbUpsertCourseBySlug(opts.input);
        }),
})