import Link from "next/link";
import type { GameEntry } from "@/modules/collection";

function StatusBadge({ status }: { status: GameEntry["status"] }) {
  if (status === "owned") {
    return (
      <div
        className="absolute top-3 right-3 bg-secondary-container/90 backdrop-blur-sm text-secondary-fixed-dim p-1.5 rounded-full border border-secondary/20"
        role="img"
        aria-label="En colección"
      >
        <span
          className="material-symbols-outlined text-[16px]"
          style={{ fontVariationSettings: "'FILL' 1" }}
          aria-hidden="true"
        >
          check
        </span>
      </div>
    );
  }
  if (status === "wishlist") {
    return (
      <div
        className="absolute top-3 right-3 bg-error-container/90 backdrop-blur-sm text-error p-1.5 rounded-full border border-error/20"
        role="img"
        aria-label="En lista de deseos"
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
  return null;
}

export function GameEntryCard({ entry }: { entry: GameEntry }) {
  return (
    <Link
      href={`/games/${entry.id}`}
      className="group block relative aspect-[2/3] rounded-xl overflow-hidden bg-surface-container-low ambient-shadow border border-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {entry.coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={entry.coverUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-surface-container flex items-center justify-center p-3">
          <span className="text-label-md text-on-surface-variant text-center">
            {entry.name}
          </span>
        </div>
      )}
      <StatusBadge status={entry.status} />
      <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
      <div className="absolute bottom-0 left-0 p-3 w-full">
        <h3 className="text-label-md text-on-surface truncate">{entry.name}</h3>
        {entry.year ? (
          <p className="text-label-sm text-on-surface-variant truncate">
            {entry.year}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
