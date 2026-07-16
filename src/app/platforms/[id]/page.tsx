import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import {
  getPlatformWithSummary,
  getPlatformGames,
  getPlatformAccessories,
  getPlatformEditions,
} from "@/modules/catalog";
import { getPlatformCollection, getGameItems, isComplete } from "@/modules/collection";
import { ItemStatus } from "@/components/item-status";
import { PlatformTabs } from "@/components/platform-tabs";
import { GamesBrowser, type GameEntry } from "@/components/games-browser";
import type {
  Accessory,
  SpecialEdition,
  UserItem,
} from "@/generated/prisma/client";
const toggleButton =
  "text-label-md px-6 py-2 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary";
const toggleActive = "bg-primary text-on-primary hover:bg-primary-fixed";
const toggleInactive =
  "bg-surface-variant text-on-surface hover:bg-surface-container-highest";

function AccessoriesPanel({ accessories }: { accessories: Accessory[] }) {
  if (accessories.length === 0) {
    return (
      <p className="text-body-md text-on-surface-variant">
        Aún no hay accesorios registrados para esta plataforma.
      </p>
    );
  }
  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-grid-gutter">
      {accessories.map((accessory) => (
        <li
          key={accessory.id}
          className="bg-surface-container-low rounded-xl border border-white/5 p-4 flex flex-col items-center gap-3 text-center"
        >
          <div className="w-16 h-16 rounded-lg bg-surface-variant flex items-center justify-center overflow-hidden text-on-surface-variant">
            {accessory.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={accessory.imageUrl}
                alt=""
                className="w-full h-full object-contain p-1"
              />
            ) : (
              <span className="material-symbols-outlined" aria-hidden="true">
                stadia_controller
              </span>
            )}
          </div>
          <span className="text-label-md text-on-surface">{accessory.name}</span>
        </li>
      ))}
    </ul>
  );
}

function EditionsPanel({ editions }: { editions: SpecialEdition[] }) {
  if (editions.length === 0) {
    return (
      <p className="text-body-md text-on-surface-variant">
        Aún no hay ediciones de consola registradas para esta plataforma.
      </p>
    );
  }
  return (
    <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-grid-gutter">
      {editions.map((edition) => (
        <li
          key={edition.id}
          className="bg-surface-container-low rounded-xl border border-white/5 p-4 flex flex-col items-center gap-3 text-center"
        >
          <div className="w-16 h-16 rounded-lg bg-surface-variant flex items-center justify-center overflow-hidden text-on-surface-variant">
            {edition.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={edition.imageUrl}
                alt=""
                className="w-full h-full object-contain p-1"
              />
            ) : (
              <span className="material-symbols-outlined" aria-hidden="true">
                stars
              </span>
            )}
          </div>
          <span className="text-label-md text-on-surface">{edition.name}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function PlatformPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ view?: string }>;
}) {
  const { id } = await params;
  const { view } = await searchParams;
  const wishlistView = view === "wishlist";
  const platform = await getPlatformWithSummary(id);
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

  const entries: GameEntry[] = games.map((game) => {
    const item = gameItems.get(game.id) ?? null;
    const owned = item?.ownership === "owned";
    return {
      id: game.id,
      name: game.name,
      coverUrl: game.coverUrl,
      year: game.releaseDate ? game.releaseDate.getFullYear() : null,
      status: item ? item.ownership : null,
      complete: owned ? isComplete(item!) : false,
      onlyCartridge: owned
        ? item!.hasGame === true && !item!.hasBox && !item!.hasManual
        : false,
    };
  });

  const viewEntries = wishlistView
    ? entries.filter((entry) => entry.status === "wishlist")
    : entries;

  const accessories = await getPlatformAccessories(id);
  const editions = await getPlatformEditions(id);

  return (
    <div className="max-w-[1440px] mx-auto pt-stack-md">
      <section className="relative rounded-xl overflow-hidden bg-surface-container-low ambient-shadow border border-white/5 h-72 md:h-80">
        {platform.imageUrl ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={platform.imageUrl}
              alt=""
              className="absolute inset-y-0 right-0 h-full w-2/3 object-contain object-right p-8 opacity-30"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest via-surface-container-lowest/90 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-transparent to-transparent" />
          </>
        ) : null}
        <div className="absolute bottom-0 left-0 w-full p-grid-gutter">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-stack-md">
            <div className="max-w-2xl">
              {platform.category ?? platform.generation ? (
                <span className="inline-block px-2 py-1 bg-surface-variant text-on-surface text-label-sm rounded mb-2 border border-white/10 uppercase tracking-widest">
                  {platform.category ?? `Gen ${platform.generation}`}
                </span>
              ) : null}
              <h1 className="text-headline-lg md:text-display-lg text-on-surface leading-tight mb-2">
                {platform.name}
              </h1>
              {platform.summary ? (
                <p className="text-body-md text-on-surface-variant leading-relaxed line-clamp-2 md:line-clamp-3">
                  {platform.summary}
                </p>
              ) : null}
              {userId ? (
                <div className="mt-2">
                  <ItemStatus item={consoleItem} />
                </div>
              ) : null}
            </div>
            <div className="flex gap-2 shrink-0">
              <Link
                href={`/platforms/${id}`}
                aria-current={!wishlistView ? "page" : undefined}
                className={`${toggleButton} ${!wishlistView ? toggleActive : toggleInactive}`}
              >
                Añadir a Colección
              </Link>
              <Link
                href={`/platforms/${id}?view=wishlist`}
                aria-current={wishlistView ? "page" : undefined}
                className={`${toggleButton} ${wishlistView ? toggleActive : toggleInactive}`}
              >
                Deseo
              </Link>
            </div>
          </div>
        </div>
      </section>

      <PlatformTabs
        juegos={
          games.length === 0 ? (
            <p className="text-body-md text-on-surface-variant">
              Aún no hay juegos para esta plataforma.
            </p>
          ) : (
            <GamesBrowser
              entries={viewEntries}
              platformName={platform.name}
              emptyMessage={
                wishlistView
                  ? "No tienes juegos en la lista de deseos para esta plataforma."
                  : undefined
              }
            />
          )
        }
        accesorios={<AccessoriesPanel accessories={accessories} />}
        ediciones={<EditionsPanel editions={editions} />}
      />
    </div>
  );
}
