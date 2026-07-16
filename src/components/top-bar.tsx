import Link from "next/link";
import type { SessionUser } from "@/lib/session";
import { SignInForm, SignOutForm } from "@/components/auth-forms";

export function TopBar({ user }: { user: SessionUser }) {
  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-surface-dim/80 backdrop-blur-md z-30 flex items-center justify-between px-grid-gutter">
      <Link
        href="/"
        className="text-headline-md font-bold text-primary md:hidden rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
      >
        gameColector
      </Link>
      <div className="ml-auto flex items-center gap-stack-sm">
        {user ? (
          <>
            <span className="text-label-md text-on-surface-variant hidden sm:inline">{user.name}</span>
            <SignOutForm
              className="md:hidden"
              buttonClassName="text-label-sm text-on-surface-variant hover:text-primary underline rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              label="Salir"
            />
          </>
        ) : (
          <SignInForm
            className="md:hidden"
            buttonClassName="text-label-md text-primary rounded focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            label="Entrar"
          />
        )}
      </div>
    </header>
  );
}
