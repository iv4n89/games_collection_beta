import Link from "next/link";
import type { Game } from "@/generated/prisma/client";

export function HeroCarousel({ games }: { games: Game[] }) {
  if (games.length === 0) {
    return null;
  }
  return (
    <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {games.map((game) => (
        <Link
          key={game.id}
          href={`/platforms/${game.platformId}`}
          className="group relative shrink-0 snap-center min-w-[85%] md:min-w-[600px] h-[300px] md:h-[400px] rounded-xl overflow-hidden bg-surface-container ambient-shadow border border-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {game.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={game.coverUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/40 to-transparent" />
          <div className="absolute bottom-0 left-0 p-6 w-full">
            <span className="inline-block px-3 py-1 bg-surface/80 backdrop-blur-sm rounded-full text-primary text-label-sm mb-3">
              Destacado
            </span>
            <h3 className="text-headline-lg text-white font-bold leading-tight">
              {game.name}
            </h3>
            {game.summary ? (
              <p className="text-body-md text-on-surface-variant mt-2 max-w-md line-clamp-2">
                {game.summary}
              </p>
            ) : null}
            <span className="mt-4 inline-block bg-primary text-on-primary text-label-md px-6 py-2 rounded-lg group-hover:bg-primary-fixed transition-colors">
              Ver
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
