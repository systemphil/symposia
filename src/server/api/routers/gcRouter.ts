
import { gcDeleteVideoFile, gcGenerateReadSignedUrl, gcGenerateSignedPostUploadUrl } from "@/server/controllers/gcController";
import { createTRPCRouter, protectedAdminProcedure, publicProcedure } from "../trpc";
import * as z from "zod";

/**
 * TypeScript Remote Procedure Call router for all things related to Google Cloud, such as interactions with the storage bucket.
 */
export const gcRouter = createTRPCRouter({
    /**
     * Generates signed POST URL for Video upload to bucket. Will generate or update Video entry in db,
     * but requires id of Lesson under which Video will be related.
     */
    createSignedPostUrl: protectedAdminProcedure
        .input(
            z
                .object({
                    id: z.string().optional(),
                    lessonId: z.string(),
                    fileName: z.string(),
                })
        )
        .mutation(async (opts) => {
            return await gcGenerateSignedPostUploadUrl(opts.input);
        }),
    /**
     * Generates signed READ URL for Video from bucket. Requires Video id and fileName.
     */
    createSignedReadUrl: publicProcedure
        .input(
            z
                .object({
                    id: z.string(),
                    fileName: z.string(),
                })
        )
        .mutation(async (opts) => {
            return await gcGenerateReadSignedUrl(opts.input);
        }),
    /**
     * Deletes a video file in the bucket. Requires ID of the video entry and the filename.
     */
    deleteVideoFile: protectedAdminProcedure
        .input(
            z
                .object({
                    id: z.string(),
                    fileName: z.string(),
                })
        )
        .mutation(async (opts) => {
            return await gcDeleteVideoFile(opts.input);
        })
})