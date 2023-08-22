import { httpBatchLink } from "@trpc/client";
import { appRouter } from "@/server/api/routersRoot";
import SuperJSON from "superjson";
import { env } from "process";

export const apiServerside = appRouter.createCaller({
    links: [
        httpBatchLink({
            url: `${env.NEXTAUTH_URL}/api/trpc`,
        }),
    ],
    transformer: SuperJSON,
})