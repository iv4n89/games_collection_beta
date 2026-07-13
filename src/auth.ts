import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";

// GitHub lee AUTH_GITHUB_ID / AUTH_GITHUB_SECRET del entorno por convención de
// Auth.js. Sesión por base de datos (por defecto con el adapter Prisma).
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  providers: [GitHub],
});
