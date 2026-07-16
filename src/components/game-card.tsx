import { isComplete } from "@/modules/collection";
import type { Game, UserItem } from "@/generated/prisma/client";

function StatusBadge({ item }: { item: UserItem }) {
  if (item.ownership === "wishlist") {
    return (
      <div
        className="absolute top-3 right-3 bg-error-container/90 backdrop-blur-sm text-error p-1.5 rounded-full border border-error/20"
        role="img"
        aria-label="En lista de deseos"
        title="En lista de deseos"
      >
        <span
          className="material-symbols-outlined text-[16px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
          aria-hidden="true"
        >
          favorite
        </span>
      </div>
    );
  }
  const complete = isComplete(item);
  return (
    <div
      className="absolute top-3 right-3 bg-secondary-container/90 backdrop-blur-sm text-secondary-fixed-dim p-1.5 rounded-full border border-secondary/20"
      role="img"
      aria-label={complete ? "Completo" : "En colección"}
      title={complete ? "Completo" : "En colección"}
    >
      <span
        className="material-symbols-outlined text-[16px]"
        style={{ fontVariationSettings: "'FILL' 1" }}
        aria-hidden="true"
      >
        {complete ? "check_circle" : "check"}
      </span>
    </div>
  );
}

export function GameCard({
  game,
  item,
}: {
  game: Game;
  item: UserItem;
}) {
  return (
    <article className="group relative aspect-[2/3] rounded-xl overflow-hidden bg-surface-container-low ambient-shadow border border-white/5">
      {game.coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={game.coverUrl}
          alt={game.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-surface-container flex items-center justify-center p-3">
          <span className="text-label-md text-on-surface-variant text-center">
            {game.name}
          </span>
        </div>
      )}
      <StatusBadge item={item} />
      <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 left-0 p-3 w-full">
        <h3 className="text-label-md text-on-surface truncate">{game.name}</h3>
      </div>
    </article>
  );
}
