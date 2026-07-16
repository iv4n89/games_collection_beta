import Link from "next/link";
import type { SessionUser } from "@/lib/session";
import { SignInForm, SignOutForm } from "@/components/auth-forms";

export function Sidebar({ user }: { user: SessionUser }) {
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
            className="flex items-center gap-stack-sm px-4 py-3 rounded-lg text-primary font-bold border-r-2 border-primary bg-surface-container-low focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
              aria-hidden="true"
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
            <span className="text-label-md text-on-surface truncate">{user.name}</span>
            <SignOutForm
              buttonClassName="text-label-sm text-on-surface-variant hover:text-primary underline rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              label="Salir"
            />
          </div>
        ) : (
          <SignInForm
            className="px-4"
            buttonClassName="w-full bg-primary text-on-primary text-label-md px-4 py-2 rounded-lg hover:bg-primary-fixed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            label="Entrar con GitHub"
          />
        )}
      </div>
    </nav>
  );
}
