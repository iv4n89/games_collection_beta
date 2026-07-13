import { notFound } from "next/navigation";
import { requireUser } from "@/lib/session";
import { getPlatform, searchGamesForPlatform } from "@/modules/catalog";
import { getPlatformCollection } from "@/modules/collection";
import { SearchForm } from "@/components/search-form";
import { ItemStatus } from "@/components/item-status";
import { addGameToCollection, setConsoleOwnership } from "./actions";

const quickButton =
  "rounded border border-stone-300 px-3 py-1 text-xs hover:bg-stone-100";

export default async function PlatformPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  const platform = await getPlatform(id);
  if (!platform) {
    notFound();
  }

  const { q } = await searchParams;
  const collection = await getPlatformCollection(user.id, id);
  const results = q ? await searchGamesForPlatform(id, q) : [];
  const collectedGameIds = new Set(collection.games.map(({ game }) => game.id));

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-10">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">
            {platform.name}
          </h1>
          <div className="mt-1">
            <ItemStatus item={collection.console} />
          </div>
        </div>
        <div className="flex gap-2">
          <form action={setConsoleOwnership.bind(null, id, "owned")}>
            <button type="submit" className={quickButton}>
              Tengo
            </button>
          </form>
          <form action={setConsoleOwnership.bind(null, id, "wishlist")}>
            <button type="submit" className={quickButton}>
              Deseo
            </button>
          </form>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="text-sm font-semibold">Tus juegos</h2>
        {collection.games.length === 0 ? (
          <p className="mt-2 text-sm text-stone-500">Ninguno todavía.</p>
        ) : (
          <ul className="mt-3 divide-y divide-stone-200 rounded-md border border-stone-200 bg-white">
            {collection.games.map(({ item, game }) => (
              <li
                key={item.id}
                className="flex items-center justify-between p-3"
              >
                <span className="text-sm">{game.name}</span>
                <ItemStatus item={item} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-semibold">Añadir juegos</h2>
        <div className="mt-3">
          <SearchForm
            action={`/platforms/${id}`}
            placeholder="Buscar juego"
            defaultValue={q}
          />
        </div>
        {q ? (
          <ul className="mt-4 divide-y divide-stone-200 rounded-md border border-stone-200 bg-white">
            {results.length === 0 ? (
              <li className="p-3 text-sm text-stone-500">Sin resultados.</li>
            ) : (
              results.map((game) => (
                <li
                  key={game.id}
                  className="flex items-center justify-between p-3"
                >
                  <span className="text-sm">
                    {game.name}
                    {collectedGameIds.has(game.id) ? (
                      <span className="ml-2 text-xs text-stone-400">
                        · ya en tu colección
                      </span>
                    ) : null}
                  </span>
                  <div className="flex gap-2">
                    <form
                      action={addGameToCollection.bind(
                        null,
                        id,
                        game.id,
                        "owned",
                      )}
                    >
                      <button type="submit" className={quickButton}>
                        Tengo
                      </button>
                    </form>
                    <form
                      action={addGameToCollection.bind(
                        null,
                        id,
                        game.id,
                        "wishlist",
                      )}
                    >
                      <button type="submit" className={quickButton}>
                        Deseo
                      </button>
                    </form>
                  </div>
                </li>
              ))
            )}
          </ul>
        ) : null}
      </section>
    </main>
  );
}
