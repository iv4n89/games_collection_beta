import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import {
  getPlatform,
  getPlatformGames,
  searchGamesForPlatform,
} from "@/modules/catalog";
import { getPlatformCollection, getGameItems } from "@/modules/collection";
import { SearchForm } from "@/components/search-form";
import { ItemStatus } from "@/components/item-status";
import { GameCard } from "@/components/game-card";
import type { UserItem } from "@/generated/prisma/client";
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
  const { id } = await params;
  const platform = await getPlatform(id);
  if (!platform) {
    notFound();
  }

  const session = await auth();
  const userId = session?.user?.id ?? null;

  const games = await getPlatformGames(id);
  let consoleItem: UserItem | null = null;
  let gameItems: Map<string, UserItem> = new Map();
  if (userId) {
    consoleItem = (await getPlatformCollection(userId, id)).console;
    gameItems = await getGameItems(
      userId,
      games.map((game) => game.id),
    );
  }

  const { q } = await searchParams;
  const results = userId && q ? await searchGamesForPlatform(id, q) : [];
  const collectedGameIds = new Set(gameItems.keys());

  return (
    <div className="max-w-[1440px] mx-auto pt-stack-md">
      <section className="rounded-xl bg-surface-container-low ambient-shadow border border-white/5 p-grid-gutter">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-stack-md">
          <div className="flex items-center gap-4">
            {platform.imageUrl ? (
              <div className="w-16 h-16 shrink-0 rounded-lg bg-surface border border-white/10 flex items-center justify-center overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={platform.imageUrl}
                  alt=""
                  className="w-full h-full object-contain p-2"
                />
              </div>
            ) : null}
            <div>
              {platform.generation ? (
                <span className="inline-block px-2 py-1 bg-surface-variant text-on-surface text-label-sm rounded mb-2 border border-white/10 uppercase tracking-widest">
                  Gen {platform.generation}
                </span>
              ) : null}
              <h1 className="text-display-lg text-on-surface leading-tight">
                {platform.name}
              </h1>
              {userId ? (
                <div className="mt-2">
                  <ItemStatus item={consoleItem} />
                </div>
              ) : null}
            </div>
          </div>
          {userId ? (
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
          ) : null}
        </div>
      </section>

      <section className="mt-stack-lg">
        <h2 className="text-headline-md text-on-surface mb-stack-md">Juegos</h2>
        {games.length === 0 ? (
          <p className="text-body-md text-on-surface-variant">
            Aún no hay juegos para esta plataforma.
          </p>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-grid-gutter">
            {games.map((game) => (
              <li key={game.id}>
                <Link
                  href={`/games/${game.id}`}
                  className="block rounded-xl focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                >
                  <GameCard game={game} item={gameItems.get(game.id) ?? null} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {userId ? (
        <section className="mt-stack-lg">
          <h2 className="text-headline-md text-on-surface mb-stack-md">
            Añadir juegos
          </h2>
          <SearchForm
            action={`/platforms/${id}`}
            placeholder="Buscar juego"
            defaultValue={q}
          />
          {q ? (
            <ul className="mt-stack-md rounded-xl border border-surface-container-high bg-surface-container-low divide-y divide-surface-container-high">
              {results.length === 0 ? (
                <li className="p-4 text-body-md text-on-surface-variant">
                  Sin resultados.
                </li>
              ) : (
                results.map((game) => (
                  <li
                    key={game.id}
                    className="flex items-center justify-between p-4 gap-3"
                  >
                    <span className="text-body-md">
                      {game.name}
                      {collectedGameIds.has(game.id) ? (
                        <span className="ml-2 text-label-sm text-on-surface-variant">
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
                        <button
                          type="submit"
                          className={`${addButton} bg-primary text-on-primary hover:bg-primary-fixed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`}
                        >
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
      ) : null}
    </div>
  );
}
