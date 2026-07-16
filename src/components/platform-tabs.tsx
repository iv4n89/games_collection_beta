"use client";

import { useState, type ReactNode } from "react";

const TABS = [
  { key: "juegos", label: "Juegos" },
  { key: "accesorios", label: "Accesorios" },
  { key: "ediciones", label: "Ediciones de Consola" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function PlatformTabs({
  juegos,
  accesorios,
  ediciones,
}: {
  juegos: ReactNode;
  accesorios: ReactNode;
  ediciones: ReactNode;
}) {
  const [tab, setTab] = useState<TabKey>("juegos");
  const panels: Record<TabKey, ReactNode> = { juegos, accesorios, ediciones };

  return (
    <div>
      <nav className="mt-stack-lg border-b border-surface-container-high flex gap-stack-md">
        {TABS.map((option) => {
          const active = tab === option.key;
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => setTab(option.key)}
              aria-current={active ? "page" : undefined}
              className={`pb-3 border-b-2 text-label-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                active
                  ? "border-primary text-primary"
                  : "border-transparent text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </nav>
      <div className="mt-stack-md">{panels[tab]}</div>
    </div>
  );
}
