"use client";

import Image from "next/image";
import { GiCrystalBall } from "react-icons/gi";

interface RelicImageProps {
  imageUrl: string;
  name: string;
}

export function RelicImage({ imageUrl, name }: RelicImageProps) {
  return (
    <div className="sticky top-10">
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-green-400/30 transition-colors duration-300 group shadow-[0_0_60px_0_rgba(0,0,0,0.6)]">
        {/* Checkered bg for pixel art transparency */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-conic-gradient(#1a1a1a 0% 25%, #141414 0% 50%)",
            backgroundSize: "24px 24px",
          }}
        />

        <Image
          src={imageUrl}
          alt={name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-contain p-8 transition-transform duration-500 group-hover:scale-105"
          style={{ imageRendering: "pixelated" }}
        />

        <div className="absolute inset-0 rounded-2xl ring-1 ring-green-400/0 group-hover:ring-green-400/20 transition-all duration-500" />
      </div>

      <div className="flex items-center justify-center gap-2 mt-4">
        <GiCrystalBall className="w-3.5 h-3.5 text-green-400/50" />
        <span className="text-xs text-neutral-600 tracking-[0.2em] uppercase font-mono">
          Pixel Relic
        </span>
        <GiCrystalBall className="w-3.5 h-3.5 text-green-400/50" />
      </div>
    </div>
  );
}