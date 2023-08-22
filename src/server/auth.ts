import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { 
    getServerSession,
    type DefaultSession, 
    type NextAuthOptions 
} from "next-auth";
import { prisma } from "./db";
import { env } from "process";
import GitHubProvider from "next-auth/providers/github";

declare module "next-auth" {
    interface Session extends DefaultSession {
      user: {
        id: string;
        // ...other properties
        // role: UserRole;
      } & DefaultSession["user"];
    }
  
    // interface User {
    //   // ...other properties
    //   // role: UserRole;
    // }
}

export const authOptions: NextAuthOptions = {
    callbacks: {
        session: ({ session, user }) => ({
            ...session,
            user: {
            ...session.user,
            id: user.id,
            },
        }),
    },
    adapter: PrismaAdapter(prisma),
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