import { createTRPCReact } from "@trpc/react-query";

import { type AppRouter } from "@/server/api/routersRoot";

/**
 * Entrypoint for the in-app Client-side tRPC Router, making tRPC routes available for front end components.
 * 
 * @config See /trpc/TRPCProvider.tsx for the configuration of the Client Router.
 */
export const apiClientside = createTRPCReact<AppRouter>({});