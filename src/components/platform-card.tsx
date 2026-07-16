import Link from "next/link";
import type { Platform } from "@/generated/prisma/client";

export function PlatformCard({ platform }: { platform: Platform }) {
  return (
    <Link
      href={`/platforms/${platform.id}`}
      className="bg-surface-container-low hover:bg-surface-container transition-colors rounded-xl p-4 flex flex-col items-center justify-center gap-3 border border-white/5 shadow-sm group focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
    >
      <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center overflow-hidden text-on-surface-variant group-hover:text-primary transition-colors">
        {platform.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={platform.imageUrl}
            alt=""
            className="w-full h-full object-contain p-2"
          />
        ) : (
          <span
            className="material-symbols-outlined text-[28px]"
            aria-hidden="true"
          >
            sports_esports
          </span>
        )}
      </div>
      <span className="text-label-md text-on-surface text-center">{platform.name}</span>
      {platform.generation ? (
        <span className="text-label-sm text-on-surface-variant">Gen {platform.generation}</span>
      ) : null}
    </Link>
  );
}
