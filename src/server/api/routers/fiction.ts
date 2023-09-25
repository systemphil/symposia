import { createTRPCRouter, publicProcedure, protectedProcedure, protectedAdminProcedure } from "../trpc";
import { z } from "zod";

// TODO delete this example router when no longer useful

export const fictionRouter = createTRPCRouter({
    getSecretMessage: protectedProcedure.query(() => {
        return "you can now see this secret message! | means you are logged in";
    }),
    getSuperSecretMessage: protectedAdminProcedure.query(() => {
        return "you can now see this super secret message!!! | means you are an admin - you're special :)";
    }),
});
