import { redirect } from "next/navigation";
import { auth } from "@/auth";

// Devuelve el usuario de la sesión o redirige a la home si no hay sesión.
// Úsalo en páginas y server actions con contenido por-usuario.
export async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/");
  }
  return session.user;
}
