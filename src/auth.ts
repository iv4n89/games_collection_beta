import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";

// Los providers concretos (GitHub, email, etc.) se añaden en su propio spec de
// autenticación. El scaffold deja la infraestructura lista: adapter Prisma,
// modelos de cuenta y route handler.
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  trustHost: true,
  providers: [],
});
