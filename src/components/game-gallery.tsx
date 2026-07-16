"use client";

import { useState } from "react";

export function GameGallery({ images }: { images: string[] }) {
  const [selected, setSelected] = useState(0);
  if (images.length === 0) {
    return null;
  }
  const main = images[Math.min(selected, images.length - 1)];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-surface-container ambient-shadow border border-white/5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={main} alt="" className="w-full h-full object-contain" />
      </div>

      {images.length > 1 ? (
        <div className="flex gap-3">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setSelected(index)}
              aria-label={`Imagen ${index + 1}`}
              aria-pressed={index === selected}
              className={`flex-1 aspect-square rounded-lg overflow-hidden border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                index === selected
                  ? "border-primary"
                  : "border-outline-variant/30 hover:border-primary/50"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt=""
                className={`w-full h-full object-cover transition-opacity ${
                  index === selected ? "" : "opacity-70 hover:opacity-100"
                }`}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
