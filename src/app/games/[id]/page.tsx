import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getGame, getPlatform } from "@/modules/catalog";
import { getGameItems } from "@/modules/collection";
import { ItemStatus } from "@/components/item-status";
import type { UserItem } from "@/generated/prisma/client";
import { setGameOwnership, updateGameComponents } from "./actions";

const ownershipButton = "text-label-md px-5 py-2 rounded-lg transition-colors";

function ComponentCheckbox({
  name,
  label,
  defaultChecked,
}: {
  name: string;
  label: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <span className="relative flex items-center justify-center">
        <input
          type="checkbox"
          name={name}
          defaultChecked={defaultChecked}
          className="peer appearance-none w-5 h-5 border border-outline rounded bg-transparent checked:bg-primary checked:border-primary transition-all focus:ring-2 focus:ring-primary/30 focus:outline-none"
        />
        <span
          className="material-symbols-outlined text-[16px] text-on-primary absolute opacity-0 peer-checked:opacity-100 pointer-events-none"
          aria-hidden="true"
        >
          check
        </span>
      </span>
      <span className="text-body-md text-on-surface-variant group-hover:text-on-surface transition-colors">
        {label}
      </span>
    </label>
  );
}

export default async function GamePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const game = await getGame(id);
  if (!game) {
    notFound();
  }

  const platform = await getPlatform(game.platformId);
  const session = await auth();
  const userId = session?.user?.id ?? null;
  const item: UserItem | null = userId
    ? ((await getGameItems(userId, [game.id])).get(game.id) ?? null)
    : null;

  return (
    <div className="max-w-[1440px] mx-auto pt-stack-md">
      <div className="mb-6 flex items-center gap-2 text-on-surface-variant text-label-sm">
        <Link
          href="/"
          className="hover:text-primary transition-colors flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]" aria-hidden="true">
            arrow_back
          </span>
          Inicio
        </Link>
        {platform ? (
          <>
            <span className="text-outline-variant">/</span>
            <Link
              href={`/platforms/${platform.id}`}
              className="hover:text-primary transition-colors"
            >
              {platform.name}
            </Link>
          </>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-grid-gutter">
        <div className="lg:col-span-5">
          <div className="relative w-full aspect-[2/3] rounded-xl overflow-hidden bg-surface-container ambient-shadow border border-white/5 group">
            {game.coverUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={game.coverUrl}
                alt={game.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center p-6">
                <span className="text-label-md text-on-surface-variant text-center">
                  {game.name}
                </span>
              </div>
            )}
            {platform ? (
              <div className="absolute top-4 left-4 bg-surface-container-highest/90 backdrop-blur-sm px-3 py-1.5 rounded-md border border-outline-variant/30">
                <span className="text-label-md text-on-surface tracking-wider">
                  {platform.name}
                </span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-8">
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-display-lg text-on-surface leading-tight">
                {game.name}
              </h1>
              <div className="mt-2 shrink-0">
                <ItemStatus item={item} />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-body-md text-on-surface-variant">
              {game.releaseDate ? (
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                    calendar_today
                  </span>
                  {game.releaseDate.toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              ) : null}
              {platform ? (
                <span className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]" aria-hidden="true">
                    stadia_controller
                  </span>
                  {platform.name}
                </span>
              ) : null}
            </div>
            {game.summary ? (
              <p className="mt-6 text-body-md text-on-surface-variant leading-relaxed max-w-2xl">
                {game.summary}
              </p>
            ) : null}
          </div>

          <div className="bg-surface-container rounded-xl p-6 border border-outline-variant/10">
            <h2 className="text-headline-md text-on-surface mb-6">
              Gestión de biblioteca
            </h2>
            {userId ? (
              <div className="flex flex-col gap-6">
                <div className="flex gap-2">
                  <form action={setGameOwnership.bind(null, game.id, "owned")}>
                    <button
                      type="submit"
                      className={`${ownershipButton} bg-primary text-on-primary hover:bg-primary-fixed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`}
                    >
                      Tengo
                    </button>
                  </form>
                  <form
                    action={setGameOwnership.bind(null, game.id, "wishlist")}
                  >
                    <button
                      type="submit"
                      className={`${ownershipButton} bg-surface-variant text-on-surface hover:bg-surface-container-highest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`}
                    >
                      Deseo
                    </button>
                  </form>
                </div>

                {item?.ownership === "owned" ? (
                  <form
                    action={updateGameComponents.bind(null, game.id)}
                    className="flex flex-col gap-4"
                  >
                    <div className="bg-surface-container-low rounded-lg p-4 grid grid-cols-3 gap-4">
                      <ComponentCheckbox
                        name="hasGame"
                        label="Cartucho"
                        defaultChecked={item.hasGame ?? false}
                      />
                      <ComponentCheckbox
                        name="hasBox"
                        label="Caja"
                        defaultChecked={item.hasBox ?? false}
                      />
                      <ComponentCheckbox
                        name="hasManual"
                        label="Manual"
                        defaultChecked={item.hasManual ?? false}
                      />
                    </div>
                    <button
                      type="submit"
                      className="self-start text-label-md px-5 py-2 rounded-lg bg-surface-variant text-on-surface hover:bg-surface-container-highest transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      Guardar componentes
                    </button>
                  </form>
                ) : null}
              </div>
            ) : (
              <p className="text-body-md text-on-surface-variant">
                Entra con GitHub para gestionar este juego en tu colección.
              </p>
            )}
          </div>

          <div className="bg-surface-container rounded-xl p-6 border border-outline-variant/10">
            <h2 className="text-headline-md text-on-surface mb-2">
              Seguimiento de precios
            </h2>
            <p className="text-body-md text-on-surface-variant">Próximamente.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
