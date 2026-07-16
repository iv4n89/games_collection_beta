"use client";

import Link from "next/link";
import type { PlatformOverview } from "@/modules/collection";

export function PlatformModuleCard({
  overview,
}: {
  overview: PlatformOverview;
}) {
  const { platform, owned } = overview;
  const total = platform.gameCount ?? overview.total;
  const progress = total > 0 ? Math.round((owned / total) * 100) : 0;
  return (
    <Link
      href={`/platforms/${platform.id}`}
      className="block bg-surface-container-high rounded-xl border border-white/5 ambient-shadow p-5 relative overflow-hidden group hover:border-primary/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center border border-white/10 overflow-hidden">
          {platform.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={platform.imageUrl}
              alt=""
              className="w-full h-full object-contain p-1"
            />
          ) : (
            <span
              className="material-symbols-outlined text-on-surface-variant"
              aria-hidden="true"
            >
              sports_esports
            </span>
          )}
        </div>
        {platform.generation ? (
          <span className="bg-primary/20 text-primary px-2 py-1 rounded-full text-label-sm">
            Gen {platform.generation}
          </span>
        ) : null}
      </div>
      <h3 className="text-headline-md text-on-surface mb-1">{platform.name}</h3>
      <p className="text-label-sm text-on-surface-variant mb-6">
        {total} {total === 1 ? "juego" : "juegos"}
      </p>
      <div>
        <div className="flex justify-between text-label-sm mb-2">
          <span className="text-on-surface-variant">En colección</span>
          <span className="text-secondary font-bold">
            {owned} / {total}
          </span>
        </div>
        <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-secondary rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </Link>
  );
}
