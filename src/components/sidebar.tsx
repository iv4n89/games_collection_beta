import Link from "next/link";
import { signIn, signOut } from "@/auth";

type SidebarUser = { name?: string | null } | null;

export function Sidebar({ user }: { user: SidebarUser }) {
  return (
    <nav className="hidden md:flex flex-col w-64 fixed left-0 top-0 h-full py-stack-md bg-surface-dim border-r border-surface-container-low z-40">
      <div className="px-grid-gutter mb-stack-lg">
        <h1 className="text-headline-md font-bold text-primary">gameColector</h1>
        <p className="text-label-sm text-on-surface-variant mt-1">Colección retro</p>
      </div>
      <ul className="flex-1 flex flex-col gap-base px-stack-sm">
        <li>
          <Link
            href="/"
            className="flex items-center gap-stack-sm px-4 py-3 rounded-lg text-primary font-bold border-r-2 border-primary bg-surface-container-low"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              home
            </span>
            <span className="text-body-md">Inicio</span>
          </Link>
        </li>
      </ul>
      <div className="px-stack-sm mt-auto">
        {user ? (
          <div className="px-4 flex items-center justify-between gap-3">
            <span className="text-label-md text-on-surface truncate">
              {user.name}
            </span>
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button
                type="submit"
                className="text-label-sm text-on-surface-variant hover:text-primary underline"
              >
                Salir
              </button>
            </form>
          </div>
        ) : (
          <form
            className="px-4"
            action={async () => {
              "use server";
              await signIn("github");
            }}
          >
            <button
              type="submit"
              className="w-full bg-primary text-on-primary text-label-md px-4 py-2 rounded-lg hover:bg-primary-fixed transition-colors"
            >
              Entrar con GitHub
            </button>
          </form>
        )}
      </div>
    </nav>
  );
}
