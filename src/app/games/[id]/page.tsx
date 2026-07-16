import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getGame, getPlatform } from "@/modules/catalog";
import { getGameItems, isComplete } from "@/modules/collection";
import type { UserItem } from "@/generated/prisma/client";
import { addToCollection, addToWishlist } from "./actions";

function StatusChip({ item }: { item: UserItem | null }) {
  const base =
    "shrink-0 mt-2 px-3 py-1 rounded-full border text-label-sm flex items-center gap-1.5";
  if (!item) {
    return (
      <span
        className={`${base} border-outline-variant/40 bg-surface-container text-on-surface-variant`}
      >
        <span
          className="material-symbols-outlined text-[14px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
          aria-hidden="true"
        >
          visibility
        </span>
        No en tu colección
      </span>
    );
  }
  if (item.ownership === "wishlist") {
    return (
      <span
        className={`${base} border-error/30 bg-error-container/10 text-error`}
      >
        <span
          className="material-symbols-outlined text-[14px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
          aria-hidden="true"
        >
          favorite
        </span>
        En lista de deseos
      </span>
    );
  }
  const complete = isComplete(item);
  return (
    <span
      className={`${base} border-secondary/30 bg-secondary-container/10 text-secondary`}
    >
      <span
        className="material-symbols-outlined text-[14px]"
        style={{ fontVariationSettings: "'FILL' 1" }}
        aria-hidden="true"
      >
        {complete ? "check_circle" : "check"}
      </span>
      {complete ? "Completo (CIB)" : "En colección"}
    </span>
  );
}

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

const SAMPLE_BARS = [40, 45, 42, 50, 60, 55, 65, 62, 75, 80, 85, 95];

function PriceChart() {
  return (
    <div className="h-32 w-full relative mb-4 flex items-end border-b border-outline-variant/20 pb-2">
      <div className="w-full h-full flex items-end gap-1 px-1 opacity-80">
        {SAMPLE_BARS.map((height, index) => (
          <div
            key={index}
            className={`flex-1 rounded-t-sm ${
              index === SAMPLE_BARS.length - 1
                ? "bg-secondary/80"
                : "bg-outline-variant/30"
            }`}
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <path
          d="M0,60 L9,55 L18,58 L27,50 L36,40 L45,45 L54,35 L63,38 L72,25 L81,20 L90,15 L100,5"
          fill="none"
          stroke="rgba(78, 222, 163, 0.8)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </div>
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
  const owned = item?.ownership === "owned";

  return (
    <div className="max-w-[1440px] mx-auto pt-stack-md">
      <div className="mb-6 flex items-center gap-2 text-on-surface-variant text-label-sm">
        <Link
          href="/"
          className="hover:text-primary transition-colors flex items-center gap-1"
        >
          <span
            className="material-symbols-outlined text-[16px]"
            aria-hidden="true"
          >
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
        {/* Left: cover + gallery */}
        <div className="lg:col-span-5 flex flex-col gap-6">
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

          <div className="grid grid-cols-3 gap-4">
            <div className="aspect-square rounded-lg overflow-hidden border-2 border-primary bg-surface-container">
              {game.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={game.coverUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : null}
            </div>
            {["inventory_2", "menu_book"].map((icon) => (
              <div
                key={icon}
                className="aspect-square rounded-lg border border-outline-variant/30 bg-surface-container-low flex items-center justify-center text-on-surface-variant/40"
              >
                <span className="material-symbols-outlined" aria-hidden="true">
                  {icon}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: details, market data, management */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <div>
            <div className="flex items-start justify-between gap-4 mb-4">
              <h1 className="text-display-lg text-on-surface leading-tight">
                {game.name}
              </h1>
              <StatusChip item={item} />
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-body-md text-on-surface-variant">
              {game.releaseDate ? (
                <span className="flex items-center gap-2">
                  <span
                    className="material-symbols-outlined text-[18px]"
                    aria-hidden="true"
                  >
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
                  <span
                    className="material-symbols-outlined text-[18px]"
                    aria-hidden="true"
                  >
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

          {/* Market data (placeholder — pricing pendiente) */}
          <div className="bg-surface-container/70 backdrop-blur-sm rounded-xl p-6 border border-white/5 ambient-shadow">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h3 className="text-label-md text-on-surface-variant uppercase tracking-wider mb-1">
                  Valor estimado (CIB)
                </h3>
                <div className="text-headline-lg text-on-surface">
                  Próximamente
                </div>
              </div>
              <span className="text-label-sm text-on-surface-variant bg-surface-container px-2 py-1 rounded">
                3 meses
              </span>
            </div>
            <PriceChart />
            <div>
              <h4 className="text-label-sm text-on-surface-variant uppercase mb-3">
                Últimas ventas (eBay)
              </h4>
              <p className="text-body-md text-on-surface-variant">
                El seguimiento de precios con eBay se integrará próximamente.
                Gráfica con datos de ejemplo.
              </p>
            </div>
          </div>

          {/* Management */}
          <div className="bg-surface-container rounded-xl p-6 border border-outline-variant/10">
            <h2 className="text-headline-md text-on-surface mb-6">
              Gestión de biblioteca
            </h2>
            {userId ? (
              <>
                <form
                  action={addToCollection.bind(null, game.id)}
                  className="mb-8"
                >
                  <button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary-fixed transition-colors text-on-primary text-label-md py-3 px-6 rounded-lg flex justify-center items-center gap-2 mb-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      aria-hidden="true"
                    >
                      add_circle
                    </span>
                    Agregar a la Colección
                  </button>
                  <div className="bg-surface-container-low rounded-lg p-4 grid grid-cols-3 gap-4">
                    <ComponentCheckbox
                      name="hasGame"
                      label="Cartucho"
                      defaultChecked={owned ? (item?.hasGame ?? false) : true}
                    />
                    <ComponentCheckbox
                      name="hasBox"
                      label="Caja"
                      defaultChecked={owned ? (item?.hasBox ?? false) : true}
                    />
                    <ComponentCheckbox
                      name="hasManual"
                      label="Manual"
                      defaultChecked={owned ? (item?.hasManual ?? false) : true}
                    />
                  </div>
                </form>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <form action={addToWishlist.bind(null, game.id)}>
                    <button
                      type="submit"
                      className="w-full bg-transparent border border-outline-variant hover:border-primary hover:bg-primary/5 transition-colors text-on-surface text-label-md py-3 px-4 rounded-lg flex justify-center items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <span
                        className="material-symbols-outlined text-[20px]"
                        aria-hidden="true"
                      >
                        favorite
                      </span>
                      Añadir a Lista de Deseos
                    </button>
                  </form>
                  <button
                    type="button"
                    disabled
                    title="Próximamente"
                    className="w-full bg-transparent border border-outline-variant/50 text-on-surface-variant/60 text-label-md py-3 px-4 rounded-lg flex justify-center items-center gap-2 cursor-not-allowed"
                  >
                    <span
                      className="material-symbols-outlined text-[20px]"
                      aria-hidden="true"
                    >
                      notifications_active
                    </span>
                    Activar Alerta de Precio
                  </button>
                </div>
              </>
            ) : (
              <p className="text-body-md text-on-surface-variant">
                Entra con GitHub para gestionar este juego en tu colección.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
