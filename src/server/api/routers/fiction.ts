import { dbGetAllUsers, multiplyFunc, testFunc } from "@/server/controllers/controller";
import { createTRPCRouter, publicProcedure, protectedProcedure, protectedAdminProcedure } from "../trpc";
import { z } from "zod";

// TODO delete this example router when no longer useful

export const fictionRouter = createTRPCRouter({
    getTodos: publicProcedure.query(async () => {
        const result = testFunc()
        return result;
    }),
    multiply: publicProcedure
        .input(
            z
                .object({
                    multiplier: z.number(),
                    multiplicand: z.number(),
                })
        )
        .output(
            z
                .object({
                    result: z.number(),
                })
        )
        .query(async (opts) => {
            const result = multiplyFunc(opts.input.multiplier, opts.input.multiplicand);
            return { result };
        }),
    getAllUsers: publicProcedure
        .query(async () => {
            const result = dbGetAllUsers();
            return { result };
        }),
    getSecretMessage: protectedProcedure.query(() => {
        return "you can now see this secret message!";
    }),
    getSuperSecretMessage: protectedAdminProcedure.query(() => {
        return "you can now see this super secret message!!!";
    }),
});
