import { dbGetAllCourses, dbGetCourseAndLessonsById, dbUpsertCourseById } from "@/server/controllers/courses";
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
                    id: z.string()
                })
        )
        .query(async (opts) => {
            return await dbGetCourseAndLessonsById(opts.input.id);
        }),
    upsertCourse: protectedAdminProcedure
        .input(
            z
                .object({
                    id: z.string(),
                    name: z.string(),
                    slug: z.string().toLowerCase(),
                    description: z.string(),
                })
        )
        .mutation(async (opts) => {
            return await dbUpsertCourseById(opts.input);
        }),
})