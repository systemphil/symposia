
import { gcGenerateSignedPostUploadUrl } from "@/server/controllers/gcController";
import { createTRPCRouter, protectedAdminProcedure } from "../trpc";
import * as z from "zod";

/**
 * TypeScript Remote Procedure Call router for all things related to Google Cloud, such as interactions with the storage bucket.
 */
export const gcRouter = createTRPCRouter({
    /**
     * Generates POST Url for Video upload to bucket. Will generate or update Video entry in db,
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
})