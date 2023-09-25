import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { 
    getServerSession,
    type DefaultSession, 
    type NextAuthOptions, 
    type DefaultUser
} from "next-auth";
import { prisma } from "./db";
import { type Role } from "@prisma/client";
import { env } from "process";
import GitHubProvider from "next-auth/providers/github";

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
            role: Role;
        } & DefaultSession["user"];
    }
    interface User extends DefaultUser {
        role: Role;
    }
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    callbacks: {
        session: ({ session, user }) => ({
            ...session,
            user: {
                ...session.user,
                id: user.id,
                role: user.role,
            },
        }),
    },
    providers: [
        GitHubProvider({
            clientId: env.GITHUB_ID ?? "",
            clientSecret: env.GITHUB_SECRET ?? "",
        }),
    ],
};

export type Access = "PUBLIC" | "USER" | "ADMIN";
/**
 * Helper function to get Auth Session on serverside.
 */
export const getServerAuthSession = () => {
    return getServerSession(authOptions);
};
/**
 * Checks the user's authentication session for admin access.
 *
 * This function verifies whether the user's authentication session is valid and
 * has the role of "ADMIN". If the user is not authenticated or doesn't have the
 * required role, an AuthenticationError is thrown.
 *
 * @throws {AuthenticationError} If the user is not authenticated or lacks admin access.
 * @returns {Promise<void>} A Promise that resolves if the user has admin access.
 * @async
 */
export const requireAdminAuth = async (): Promise<void> => {
    const session = await getServerAuthSession();

    if (!session || session.user.role !== "ADMIN") {
        throw new AuthenticationError();
    }
};
export class AuthenticationError extends Error {
    constructor() {
        super("Access denied. Insufficient Authentication.");
        this.name = "AuthenticationError";
    }
}