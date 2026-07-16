"use client";

import { Children, type ReactNode } from "react";
import { useInfiniteScroll } from "./use-infinite-scroll";

// Envuelve una lista ya renderizada (children = <li>...) y la revela por tramos
// al hacer scroll. El servidor renderiza todos los ítems; solo se montan los
// visibles, así que las imágenes de los ocultos no se cargan hasta revelarse.
export function InfiniteGrid({
  children,
  className,
  step = 24,
}: {
  children: ReactNode;
  className?: string;
  step?: number;
}) {
  const items = Children.toArray(children);
  const { count, sentinelRef } = useInfiniteScroll(items.length, step);
  return (
    <>
      <ul className={className}>{items.slice(0, count)}</ul>
      {count < items.length ? (
        <div ref={sentinelRef} aria-hidden="true" className="h-px" />
      ) : null}
    </>
  );
}
