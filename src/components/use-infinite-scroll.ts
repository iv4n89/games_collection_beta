"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

// Revelado progresivo: muestra `count` elementos de un total ya cargado y va
// ampliando al acercarse el centinela al viewport (rootMargin = "cerca del final").
export function useInfiniteScroll(
  total: number,
  step = 24,
): { count: number; sentinelRef: RefObject<HTMLDivElement | null> } {
  const [count, setCount] = useState(() => Math.min(step, total));
  const [prevTotal, setPrevTotal] = useState(total);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Reset al cambiar el conjunto (patrón de ajuste de estado en render).
  if (total !== prevTotal) {
    setPrevTotal(total);
    setCount(Math.min(step, total));
  }

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || count >= total) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setCount((current) => Math.min(current + step, total));
        }
      },
      { rootMargin: "400px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [count, total, step]);

  return { count, sentinelRef };
}
