import { auth, signIn, signOut } from "@/auth";

export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="flex items-center justify-between border-b border-zinc-200 px-6 py-3">
      <span className="text-sm font-semibold tracking-tight">gameColector</span>
      {session?.user ? (
        <div className="flex items-center gap-3">
          <span className="text-sm text-zinc-600">{session.user.name}</span>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button type="submit" className="text-sm text-zinc-600 underline">
              Salir
            </button>
          </form>
        </div>
      ) : (
        <form
          action={async () => {
            "use server";
            await signIn("github");
          }}
        >
          <button
            type="submit"
            className="rounded border border-zinc-300 px-3 py-1 text-sm"
          >
            Entrar con GitHub
          </button>
        </form>
      )}
    </header>
  );
}
