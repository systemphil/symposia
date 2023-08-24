import { TRPCError, initTRPC } from "@trpc/server";
import { type NextRequest, type NextResponse } from "next/server";
import { Session } from "next-auth";
import SuperJSON from "superjson";
import { prisma } from "../db";
import { getServerAuthSession } from "../auth";
import { ZodError } from "zod";


/**
 * 1. CONTEXT SETUP
 * 
 * This section defines the "contexts" that are available in the backend API
 *
 * These allow you to access things like the database, the session, etc, when
 * processing a request
 */
type CreateContextOptions = {
    session: Session | null;
    req: NextRequest;
    res: NextResponse;
};

export const createInnerTRPCContext = (opts: CreateContextOptions) => {
    return {
        ...opts,
        prisma,
    };
};

export const createTRPCContext = async (opts: { req: NextRequest, res: NextResponse}) => {
    const { req, res } = opts;
  
    // Get the session from the server using the getServerAuthSession wrapper function
    const session = await getServerAuthSession();
  
    return createInnerTRPCContext({
        session,
        req,
        res,
    });
};

/**
 * 2. INITIALIZATION
 * 
 * This is where the trpc api is initialized, connecting the context and
 * transformer
 */
const t = initTRPC.context<typeof createInnerTRPCContext>().create({
    transformer: SuperJSON,
    errorFormatter({ shape, error }) {
        return {
            ...shape,
            data: {
                ...shape.data,
                zodError:
                error.cause instanceof ZodError ? error.cause.flatten() : null,
            },
        };
    },
});

/**
 * 3. ROUTER & DEFINING PROCEDURES
 *
 * These are the pieces you use to build your tRPC API. You should import these
 * a lot in the /src/server/api/routers folder
 */

/**
 * This is how you create new routers and subrouters in your tRPC API
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Public (unauthed) procedure
 *
 * This is the base piece you use to build new queries and mutations on your
 * tRPC API. It does not guarantee that a user querying is authorized, but you
 * can still access user session data if they are logged in
 */
export const publicProcedure = t.procedure;

/** Reusable middleware that enforces users are logged in before running the procedure. */
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
        ctx: {
            // infers the `session` as non-nullable
            session: { ...ctx.session, user: ctx.session.user },
        },
    });
});

const enforceUserIsAdmin = enforceUserIsAuthed.unstable_pipe(
    async ({ ctx, next }) => {
        if (ctx.session.user.role !== "ADMIN") {
                throw new TRPCError({
                    code: "UNAUTHORIZED",
                    message: "You must be an admin to perform this action",
            });
        }
  
        return next({
            ctx: {
                session: {...ctx.session, user: ctx.session.user.role },
            },
        });
    },
);

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);

/**
 * Protected Admin procedure
 * 
 * Verifies if the user in session is Admin by checking against information in db.
 */
export const protectedAdminProcedure = t.procedure.use(enforceUserIsAdmin);