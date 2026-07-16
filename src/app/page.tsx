import Link from "next/link";
import { auth } from "@/auth";
import { getUserPlatforms, getGameItems } from "@/modules/collection";
import { searchPlatforms, getShowcaseGames } from "@/modules/catalog";
import { SearchForm } from "@/components/search-form";
import { PlatformCard } from "@/components/platform-card";
import { GameCard } from "@/components/game-card";
import { HeroCarousel } from "@/components/hero-carousel";
import type { UserItem } from "@/generated/prisma/client";
import { addConsoleToCollection } from "./actions";

const HERO_COUNT = 5;
const GRID_COUNT = 12;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await auth();
  const userId = session?.user?.id ?? null;

  const games = await getShowcaseGames(HERO_COUNT + GRID_COUNT);
  const heroGames = games.slice(0, HERO_COUNT);
  const gridGames = games.slice(HERO_COUNT);
  const gameItems: Map<string, UserItem> = userId
    ? await getGameItems(
        userId,
        games.map((game) => game.id),
      )
    : new Map();

  const { q } = await searchParams;
  const platforms = userId ? await getUserPlatforms(userId) : [];
  const results = userId && q ? await searchPlatforms(q) : [];

  return (
    <div className="max-w-[1440px] mx-auto pt-stack-md">
      {heroGames.length > 0 ? (
        <section className="mb-stack-lg">
          <h2 className="text-headline-lg text-on-surface mb-stack-sm">
            Destacados
          </h2>
          <HeroCarousel games={heroGames} />
        </section>
      ) : null}

      <section className="mb-stack-lg">
        <h2 className="text-headline-md text-on-surface mb-stack-md flex items-center gap-2">
          <span
            className="material-symbols-outlined text-primary"
            aria-hidden="true"
          >
            grid_view
          </span>
          Explora el catálogo
        </h2>
        {gridGames.length === 0 ? (
          <p className="text-body-md text-on-surface-variant">
            Aún no hay juegos en el catálogo.
          </p>
        ) : (
          <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-grid-gutter">
            {gridGames.map((game) => (
              <li key={game.id}>
                <Link
                  href={`/platforms/${game.platformId}`}
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
        <>
          <section className="mb-stack-lg">
            <h2 className="text-headline-md text-on-surface mb-stack-md flex items-center gap-2">
              <span
                className="material-symbols-outlined text-primary"
                aria-hidden="true"
              >
                videogame_asset
              </span>
              Tus consolas
            </h2>
            {platforms.length === 0 ? (
              <p className="text-body-md text-on-surface-variant">
                Aún no has añadido consolas. Busca una abajo para empezar.
              </p>
            ) : (
              <ul className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {platforms.map(({ item, platform }) => (
                  <li key={item.id}>
                    <PlatformCard platform={platform} />
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="mb-stack-lg">
            <h2 className="text-headline-md text-on-surface mb-stack-md">
              Añadir consola
            </h2>
            <SearchForm
              action="/"
              placeholder="Buscar consola (p. ej. Super Nintendo)"
              defaultValue={q}
            />
            {q ? (
              <ul className="mt-stack-md rounded-xl border border-surface-container-high bg-surface-container-low divide-y divide-surface-container-high">
                {results.length === 0 ? (
                  <li className="p-4 text-body-md text-on-surface-variant">
                    Sin resultados.
                  </li>
                ) : (
                  results.map((platform) => (
                    <li
                      key={platform.id}
                      className="flex items-center justify-between p-4"
                    >
                      <span className="text-body-md">{platform.name}</span>
                      <form
                        action={addConsoleToCollection.bind(null, platform.id)}
                      >
                        <button
                          type="submit"
                          className="bg-primary text-on-primary text-label-md px-4 py-1.5 rounded-lg hover:bg-primary-fixed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
        </>
      ) : (
        <section className="mb-stack-lg">
          <p className="text-body-md text-on-surface-variant">
            Entra con GitHub para gestionar tu colección y tu lista de deseos.
          </p>
        </section>
      )}
    </div>
  );
}
