import { signIn, signOut } from "@/auth";

type TopBarUser = { name?: string | null } | null;

export function TopBar({ user }: { user: TopBarUser }) {
  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-surface-dim/80 backdrop-blur-md z-30 flex items-center justify-between px-grid-gutter">
      <h1 className="text-headline-md font-bold text-primary md:hidden">
        gameColector
      </h1>
      <div className="ml-auto flex items-center gap-stack-sm">
        {user ? (
          <>
            <span className="text-label-md text-on-surface-variant hidden sm:inline">
              {user.name}
            </span>
            <form
              className="md:hidden"
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
          </>
        ) : (
          <form
            className="md:hidden"
            action={async () => {
              "use server";
              await signIn("github");
            }}
          >
            <button type="submit" className="text-label-md text-primary">
              Entrar
            </button>
          </form>
        )}
      </div>
    </header>
  );
}
