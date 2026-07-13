import NextAuth, { type DefaultSession } from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";

declare module "next-auth" {
  interface Session {
    user: { id: string } & DefaultSession["user"];
  }
}

// GitHub lee AUTH_GITHUB_ID / AUTH_GITHUB_SECRET del entorno por convención de
// Auth.js. Sesión por base de datos (por defecto con el adapter Prisma).
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  providers: [GitHub],
  callbacks: {
    session({ session, user }) {
      if (user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});
