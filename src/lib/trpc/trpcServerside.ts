import { httpBatchLink } from "@trpc/client";
import { appRouter } from "@/server/api/routersRoot";
import SuperJSON from "superjson";
import { env } from "process";
import { createInnerTRPCContext } from "@/server/api/trpc";

/**
 * TODO type error even though this caller appears to work? needs fix. consider removing due to redundancy
 */
export const apiServerside = appRouter.createCaller({
    // @ts-ignore
    ctx: createInnerTRPCContext()
    // links: [
    //     httpBatchLink({
    //         url: `${env.NEXTAUTH_URL}/api/trpc`,
    //     }),
    // ],
});

    // links: [
    //     httpBatchLink({
    //         url: `${env.NEXTAUTH_URL}/api/trpc`,
    //     }),
    // ],
    // transformer: SuperJSON,