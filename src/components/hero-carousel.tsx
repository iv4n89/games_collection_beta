import Link from "next/link";
import type { Game } from "@/generated/prisma/client";

export function HeroCarousel({ games }: { games: Game[] }) {
  if (games.length === 0) {
    return null;
  }
  return (
    <div className="flex overflow-x-auto gap-grid-gutter pb-2 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {games.map((game) => (
        <Link
          key={game.id}
          href={`/platforms/${game.platformId}`}
          className="group relative shrink-0 snap-start w-[88%] md:w-[600px] h-[260px] rounded-xl overflow-hidden ambient-shadow border border-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {game.coverUrl ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={game.coverUrl}
                alt=""
                className="absolute inset-0 w-full h-full object-cover blur-2xl scale-110 opacity-40"
              />
              <div className="absolute inset-0 bg-surface-container-lowest/70" />
            </>
          ) : null}
          <div className="relative flex items-center gap-grid-gutter h-full p-grid-gutter">
            {game.coverUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={game.coverUrl}
                  alt={game.name}
                  className="h-full aspect-[2/3] rounded-lg object-cover shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-500"
                />
              </>
            ) : null}
            <div className="min-w-0">
              <span className="inline-block px-3 py-1 bg-surface/80 backdrop-blur-sm rounded-full text-primary text-label-sm mb-3">
                Destacado
              </span>
              <h3 className="text-headline-lg text-on-surface font-bold leading-tight line-clamp-3">
                {game.name}
              </h3>
              {game.releaseDate ? (
                <p className="text-body-md text-on-surface-variant mt-2">
                  {game.releaseDate.getFullYear()}
                </p>
              ) : null}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
