import { notFound } from "next/navigation";
import { requireUser } from "@/lib/session";
import { getPlatform, searchGamesForPlatform } from "@/modules/catalog";
import { getPlatformCollection } from "@/modules/collection";
import { SearchForm } from "@/components/search-form";
import { ItemStatus } from "@/components/item-status";
import { GameCard } from "@/components/game-card";
import { addGameToCollection, setConsoleOwnership } from "./actions";

const ownershipButton = "text-label-md px-5 py-2 rounded-lg transition-colors";
const addButton = "text-label-md px-4 py-1.5 rounded-lg transition-colors";

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
    <div className="max-w-[1440px] mx-auto pt-stack-md">
      <section className="relative rounded-xl overflow-hidden bg-surface-container-low ambient-shadow border border-white/5">
        <div className="relative min-h-64 md:min-h-80 flex flex-col justify-end p-grid-gutter">
          {platform.imageUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={platform.imageUrl}
                alt={platform.name}
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/80 to-transparent" />
            </>
          ) : null}
          <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-stack-sm">
            <div className="max-w-3xl">
              {platform.generation ? (
                <span className="inline-block px-2 py-1 bg-surface-variant text-on-surface text-label-sm rounded mb-2 border border-white/10 uppercase tracking-widest">
                  Gen {platform.generation}
                </span>
              ) : null}
              <h1 className="text-display-lg text-on-surface mb-2">
                {platform.name}
              </h1>
              <ItemStatus item={collection.console} />
            </div>
            <div className="flex gap-2">
              <form action={setConsoleOwnership.bind(null, id, "owned")}>
                <button
                  type="submit"
                  className={`${ownershipButton} bg-primary text-on-primary hover:bg-primary-fixed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`}
                >
                  Tengo
                </button>
              </form>
              <form action={setConsoleOwnership.bind(null, id, "wishlist")}>
                <button
                  type="submit"
                  className={`${ownershipButton} bg-surface-variant text-on-surface hover:bg-surface-container-highest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`}
                >
                  Deseo
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-stack-lg">
        <h2 className="text-headline-md text-on-surface mb-stack-md">Tus juegos</h2>
        {collection.games.length === 0 ? (
          <p className="text-body-md text-on-surface-variant">Ninguno todavía.</p>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-grid-gutter">
            {collection.games.map(({ item, game }) => (
              <li key={item.id}>
                <GameCard game={game} item={item} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-stack-lg">
        <h2 className="text-headline-md text-on-surface mb-stack-md">Añadir juegos</h2>
        <SearchForm
          action={`/platforms/${id}`}
          placeholder="Buscar juego"
          defaultValue={q}
        />
        {q ? (
          <ul className="mt-stack-md rounded-xl border border-surface-container-high bg-surface-container-low divide-y divide-surface-container-high">
            {results.length === 0 ? (
              <li className="p-4 text-body-md text-on-surface-variant">Sin resultados.</li>
            ) : (
              results.map((game) => (
                <li key={game.id} className="flex items-center justify-between p-4 gap-3">
                  <span className="text-body-md">
                    {game.name}
                    {collectedGameIds.has(game.id) ? (
                      <span className="ml-2 text-label-sm text-on-surface-variant">
                        · ya en tu colección
                      </span>
                    ) : null}
                  </span>
                  <div className="flex gap-2">
                    <form action={addGameToCollection.bind(null, id, game.id, "owned")}>
                      <button
                        type="submit"
                        className={`${addButton} bg-primary text-on-primary hover:bg-primary-fixed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`}
                      >
                        Tengo
                      </button>
                    </form>
                    <form action={addGameToCollection.bind(null, id, game.id, "wishlist")}>
                      <button
                        type="submit"
                        className={`${addButton} bg-surface-variant text-on-surface hover:bg-surface-container-highest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`}
                      >
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
    </div>
  );
}
