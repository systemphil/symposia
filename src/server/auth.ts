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

export const getServerAuthSession = () => {
    return getServerSession(authOptions);
};