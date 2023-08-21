import { createTRPCRouter, publicProcedure } from "../trpc";

export const fictionRouter = createTRPCRouter({
    getTodos: publicProcedure.query(async () => {
        return [10, 20, 30];
    }),
});
