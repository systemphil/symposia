import { createTRPCReact } from "@trpc/react-query";

import { type AppRouter } from "@/server/api/routersRoot";

/**
 * Entrypoint for the in-app Client-side tRPC Router, making tRPC routes available for front end components.
 */
export const apiClientside = createTRPCReact<AppRouter>({});