import type { SessionUser } from "@/lib/session";
import { SignInForm, SignOutForm } from "@/components/auth-forms";
import { SidebarNav } from "@/components/sidebar-nav";

export function Sidebar({ user }: { user: SessionUser }) {
  return (
    <nav className="hidden md:flex flex-col w-64 fixed left-0 top-0 h-full py-stack-md bg-surface-dim border-r border-surface-container-low z-40">
      <div className="px-grid-gutter mb-stack-lg">
        <h1 className="text-headline-md font-bold text-primary">gameColector</h1>
        <p className="text-label-sm text-on-surface-variant mt-1">Colección retro</p>
      </div>
      <SidebarNav />
      <div className="px-stack-sm mt-stack-md">
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
