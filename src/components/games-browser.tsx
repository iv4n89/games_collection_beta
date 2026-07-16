"use client";

import Link from "next/link";
import { useState } from "react";

export interface GameEntry {
  id: string;
  name: string;
  coverUrl: string | null;
  year: number | null;
  status: "owned" | "wishlist" | null;
  complete: boolean;
  onlyCartridge: boolean;
}

const FILTERS = [
  { key: "todos", label: "Todos" },
  { key: "owned", label: "Poseídos" },
  { key: "cib", label: "Completos (CIB)" },
  { key: "cart", label: "Solo cartucho" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

function matches(entry: GameEntry, filter: FilterKey): boolean {
  switch (filter) {
    case "owned":
      return entry.status === "owned";
    case "cib":
      return entry.complete;
    case "cart":
      return entry.onlyCartridge;
    default:
      return true;
  }
}

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

export function GamesBrowser({
  entries,
  platformName,
  emptyMessage = "No hay juegos que coincidan.",
}: {
  entries: GameEntry[];
  platformName: string;
  emptyMessage?: string;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("todos");
  const q = query.trim().toLowerCase();
  const visible = entries.filter(
    (entry) =>
      matches(entry, filter) &&
      (q === "" || entry.name.toLowerCase().includes(q)),
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-stack-sm justify-between mb-stack-md">
        <div className="relative w-full max-w-sm">
          <span
            className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
            aria-hidden="true"
          >
            search
          </span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Buscar en ${platformName}...`}
            className="w-full bg-surface-container-low border border-surface-container-high text-on-surface rounded-lg py-2 pl-10 pr-4 text-body-md placeholder:text-on-surface-variant/60 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FILTERS.map((option) => {
            const active = filter === option.key;
            return (
              <button
                key={option.key}
                type="button"
                onClick={() => setFilter(option.key)}
                aria-pressed={active}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-label-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  active
                    ? "bg-primary/10 text-primary border border-primary/30"
                    : "bg-surface-container-low text-on-surface-variant border border-surface-container-high hover:border-outline-variant hover:text-on-surface"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {visible.length === 0 ? (
        <p className="text-body-md text-on-surface-variant">{emptyMessage}</p>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-grid-gutter">
          {visible.map((entry) => (
            <li key={entry.id}>
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
                  <h3 className="text-label-md text-on-surface truncate">
                    {entry.name}
                  </h3>
                  {entry.year ? (
                    <p className="text-label-sm text-on-surface-variant truncate">
                      {entry.year}
                    </p>
                  ) : null}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
