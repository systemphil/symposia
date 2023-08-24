import { coursesRouter } from "./routers/coursesRouter";
import { fictionRouter } from "./routers/fiction";
import { createTRPCRouter } from "./trpc";

/**
 * Primary Remote Procedure Call router.
 * 
 * All routers in /api/routers need to be manually added here.
 */
export const appRouter = createTRPCRouter({
    fiction: fictionRouter,
    courses: coursesRouter,
});

export type AppRouter = typeof appRouter;