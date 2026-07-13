import Link from "next/link";
import { auth } from "@/auth";
import { getUserPlatforms } from "@/modules/collection";
import { searchPlatforms } from "@/modules/catalog";
import { SearchForm } from "@/components/search-form";
import { addConsoleToCollection } from "./actions";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return (
      <main className="mx-auto w-full max-w-3xl px-6 py-16">
        <p className="text-sm text-stone-600">
          Entra con GitHub para gestionar tu colección.
        </p>
      </main>
    );
  }

  const { q } = await searchParams;
  const platforms = await getUserPlatforms(session.user.id);
  const results = q ? await searchPlatforms(q) : [];

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <h1 className="text-lg font-semibold tracking-tight">Tus consolas</h1>
      {platforms.length === 0 ? (
        <p className="mt-2 text-sm text-stone-500">
          Aún no has añadido consolas.
        </p>
      ) : (
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {platforms.map(({ item, platform }) => (
            <li key={item.id}>
              <Link
                href={`/platforms/${platform.id}`}
                className="block rounded-md border border-stone-200 bg-white p-4 hover:border-stone-400"
              >
                <span className="text-sm font-medium">{platform.name}</span>
                {platform.generation ? (
                  <span className="ml-2 text-xs text-stone-400">
                    Gen {platform.generation}
                  </span>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}

      <section className="mt-10">
        <h2 className="text-sm font-semibold">Añadir consola</h2>
        <div className="mt-3">
          <SearchForm
            action="/"
            placeholder="Buscar consola (p. ej. Super Nintendo)"
            defaultValue={q}
          />
        </div>
        {q ? (
          <ul className="mt-4 divide-y divide-stone-200 rounded-md border border-stone-200 bg-white">
            {results.length === 0 ? (
              <li className="p-3 text-sm text-stone-500">Sin resultados.</li>
            ) : (
              results.map((platform) => (
                <li
                  key={platform.id}
                  className="flex items-center justify-between p-3"
                >
                  <span className="text-sm">{platform.name}</span>
                  <form action={addConsoleToCollection.bind(null, platform.id)}>
                    <button
                      type="submit"
                      className="rounded border border-stone-300 px-3 py-1 text-xs hover:bg-stone-100"
                    >
                      Añadir
                    </button>
                  </form>
                </li>
              ))
            )}
          </ul>
        ) : null}
      </section>
    </main>
  );
}
