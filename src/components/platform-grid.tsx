"use client";

import type { PlatformOverview } from "@/modules/collection";
import { PlatformModuleCard } from "./platform-module-card";
import { useInfiniteScroll } from "./use-infinite-scroll";

// Grid dirigida por datos: solo monta las tarjetas visibles, así que solo se
// cargan los logos de esas (evita precargar los ~180 de golpe).
export function PlatformGrid({ overviews }: { overviews: PlatformOverview[] }) {
  const { count, sentinelRef } = useInfiniteScroll(overviews.length, 12);
  return (
    <>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-grid-gutter">
        {overviews.slice(0, count).map((overview) => (
          <li key={overview.platform.id}>
            <PlatformModuleCard overview={overview} />
          </li>
        ))}
      </ul>
      {count < overviews.length ? (
        <div ref={sentinelRef} aria-hidden="true" className="h-px" />
      ) : null}
    </>
  );
}
