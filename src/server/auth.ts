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
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from 'next-auth/providers/email';

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
            role: Role;
            provider: string | null;
        } & DefaultSession["user"];
    }
    interface User extends DefaultUser {
        role: Role;
    }
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    callbacks: {
        session: ({ session, user, token }) => ({
            ...session,
            user: {
                ...session.user,
                id: user.id,
                role: user.role,
                provider: token?.provider,
            },
        }),
        jwt: async ({token, user, account}) => {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.provider = account?.provider;
            }
            return token;
        }
    },
    providers: [
        GitHubProvider({
            clientId: env.AUTH_GITHUB_ID ?? "",
            clientSecret: env.AUTH_GITHUB_SECRET ?? "",
        }),
        GoogleProvider({
            clientId: env.AUTH_GOOGLE_ID ?? "",
            clientSecret: env.AUTH_GOOGLE_SECRET ?? "",
        }),
        EmailProvider({
            server: {
                host: process.env.AUTH_EMAIL_SERVER_HOST,
                port: process.env.AUTH_EMAIL_SERVER_PORT,
                auth: {
                    user: process.env.AUTH_EMAIL_SERVER_USER,
                    pass: process.env.AUTH_EMAIL_SERVER_PASSWORD,
                },
            },
            from: process.env.AUTH_EMAIL_FROM,
        }),
    ],
    theme: {
        colorScheme: "light",
        brandColor: "#AA336A",
        // TODO fix logo source
        logo: "https://avatars.githubusercontent.com/u/147748257?s=200&v=4",
    }
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
/**
 * Admin check wrapper with exception handling. Use by inputting the intended function as an argument to this one.
 * @param retrieveFunc 
 * @returns void if successful, throws error if not
 */
export const checkIfAdmin = async <T>(retrieveFunc: () => Promise<T>): Promise<T> => {
    try {
        await requireAdminAuth();
        return await retrieveFunc();
    } catch (error) {
        if (error instanceof AuthenticationError) {
            throw error; // Rethrow error as-is
            // TODO add forbidden response here
        }
        throw error;
    }
}