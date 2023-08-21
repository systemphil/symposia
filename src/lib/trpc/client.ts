import { createTRPCReact } from "@trpc/react-query";

import { type AppRouter } from "@/server/api/routersRoot";

export const trpc = createTRPCReact<AppRouter>({});