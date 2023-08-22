import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { env } from "process";
import { appRouter } from "@/server/api/routersRoot";
import { createTRPCContext } from "@/server/api/trpc";
import type { NextRequest, NextResponse } from "next/server";

/**
 * API handler for tRPC requests. The APIs here are called via typical endpoints.
 * @example /api/trpc/<router-namespace>.<protocol>
 */
const handler = (req: NextRequest, res: NextResponse) => 
    fetchRequestHandler({
        endpoint: "/api/trpc",
        req: req,
        router: appRouter,
        createContext: () => createTRPCContext({ req, res }),
        onError:
            env.NODE_ENV === "development"
            ? ({ path, error }) => {
                    console.error(
                        `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`,
                    );
                }
            : undefined,
    });

export { handler as GET, handler as POST };