"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Game } from "@/generated/prisma/client";

const GAP = 16;
const INTERVAL_MS = 5000;

export function HeroCarousel({ games }: { games: Game[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  function scrollByCard(direction: 1 | -1) {
    const scroller = scrollerRef.current;
    if (!scroller) {
      return;
    }
    const card = scroller.querySelector<HTMLElement>("[data-slide]");
    const step = card ? card.offsetWidth + GAP : scroller.clientWidth;
    const atEnd =
      scroller.scrollLeft + scroller.clientWidth >= scroller.scrollWidth - 8;
    const atStart = scroller.scrollLeft <= 8;

    if (direction === 1 && atEnd) {
      scroller.scrollTo({ left: 0, behavior: "smooth" });
    } else if (direction === -1 && atStart) {
      scroller.scrollTo({ left: scroller.scrollWidth, behavior: "smooth" });
    } else {
      scroller.scrollBy({ left: direction * step, behavior: "smooth" });
    }
  }

  useEffect(() => {
    if (paused || games.length < 2) {
      return;
    }
    const id = setInterval(() => scrollByCard(1), INTERVAL_MS);
    return () => clearInterval(id);
  }, [paused, games.length]);

  if (games.length === 0) {
    return null;
  }

  const showArrows = paused && games.length > 1;

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        ref={scrollerRef}
        className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {games.map((game) => (
          <Link
            key={game.id}
            data-slide
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

      {showArrows ? (
        <>
          <button
            type="button"
            aria-label="Anterior"
            onClick={() => scrollByCard(-1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-surface/80 backdrop-blur-sm border border-white/10 text-on-surface hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              chevron_left
            </span>
          </button>
          <button
            type="button"
            aria-label="Siguiente"
            onClick={() => scrollByCard(1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-surface/80 backdrop-blur-sm border border-white/10 text-on-surface hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              chevron_right
            </span>
          </button>
        </>
      ) : null}
    </div>
  );
}
