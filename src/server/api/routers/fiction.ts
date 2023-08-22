import { dbGetAllUsers, multiplyFunc, testFunc } from "@/server/controllers/controller";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

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
        })
});
