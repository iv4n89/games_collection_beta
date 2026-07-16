"use client";

import { useEffect, useRef, useState } from "react";
import type { GameEntry } from "@/modules/collection";
import type { GameSort } from "@/modules/igdb";
import { GameEntryCard } from "./game-entry-card";

const SORTS: { value: GameSort; label: string }[] = [
  { value: "name_asc", label: "Nombre (A-Z)" },
  { value: "name_desc", label: "Nombre (Z-A)" },
  { value: "year_desc", label: "Más recientes" },
  { value: "year_asc", label: "Más antiguos" },
];

export function PlatformGamesBrowser({
  platformName,
  initialGames,
  pageSize,
  loadMore,
  search,
}: {
  platformName: string;
  initialGames: GameEntry[];
  pageSize: number;
  loadMore: (offset: number, sort: GameSort) => Promise<GameEntry[]>;
  search: (term: string) => Promise<GameEntry[]>;
}) {
  const [games, setGames] = useState(initialGames);
  const [offset, setOffset] = useState(initialGames.length);
  const [sort, setSort] = useState<GameSort>("name_asc");
  const [done, setDone] = useState(initialGames.length < pageSize);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<GameEntry[] | null>(null);
  const [searching, setSearching] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  async function changeSort(next: GameSort) {
    setSort(next);
    setLoading(true);
    const first = await loadMore(0, next);
    setGames(first);
    setOffset(first.length);
    setDone(first.length < pageSize);
    setLoading(false);
  }

  const searchMode = query.trim() !== "";

  useEffect(() => {
    const term = query.trim();
    if (term === "") {
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      const results = await search(term);
      setSearchResults(results);
      setSearching(false);
    }, 350);
    return () => clearTimeout(timer);
  }, [query, search]);

  useEffect(() => {
    if (searchMode || done || loading) {
      return;
    }
    const node = sentinelRef.current;
    if (!node) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setLoading(true);
          loadMore(offset, sort).then((next) => {
            setGames((current) => [...current, ...next]);
            setOffset((current) => current + next.length);
            setDone(next.length < pageSize);
            setLoading(false);
          });
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [offset, sort, done, loading, searchMode, loadMore, pageSize]);

  const list = searchMode ? (searchResults ?? []) : games;

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
        <label className="flex items-center gap-2 text-label-sm text-on-surface-variant shrink-0">
          Ordenar
          <select
            value={sort}
            onChange={(event) => changeSort(event.target.value as GameSort)}
            disabled={searchMode}
            className="bg-surface-container-low border border-surface-container-high text-on-surface rounded-lg px-3 py-2 text-label-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-50"
          >
            {SORTS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {list.length === 0 && !searching && !loading ? (
        <p className="text-body-md text-on-surface-variant">
          {searchMode ? "Sin resultados." : "Aún no hay juegos oficiales."}
        </p>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-grid-gutter">
          {list.map((entry) => (
            <li key={entry.id}>
              <GameEntryCard entry={entry} />
            </li>
          ))}
        </ul>
      )}

      {(loading || searching) && (
        <p className="mt-stack-md text-label-sm text-on-surface-variant text-center">
          Cargando…
        </p>
      )}
      {!searchMode && !done ? (
        <div ref={sentinelRef} aria-hidden="true" className="h-px" />
      ) : null}
    </div>
  );
}
