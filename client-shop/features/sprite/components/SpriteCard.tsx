"use client";

import Link from "next/link";
import Image from "next/image";
import { Globe, Lock } from "lucide-react";
import { useMemo } from "react";
import type { SpriteListResponse } from "@/features/sprite/types/sprite.types";

interface SpriteCardProps {
  sprite: SpriteListResponse;
  onClick?: (sprite: SpriteListResponse) => void;
  onDelete?: (id: string) => void;
  showVisibility?: boolean;
}

function seededRandom(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return ((h >>> 0) / 0xFFFFFFFF);
}

export function SpriteCard({ sprite, onClick, onDelete, showVisibility = false }: SpriteCardProps) {
  const { rotate, translateY } = useMemo(() => {
    const r = seededRandom(sprite.id);
    const r2 = seededRandom(sprite.id + "y");
    return {
      rotate: (r - 0.5) * 4,
      translateY: (r2 - 0.5) * 8,
    };
  }, [sprite.id]);

  const inner = (
    <div
      className="group relative cursor-pointer transition-all duration-300 hover:rotate-0! hover:-translate-y-1! hover:drop-shadow-[0_0_16px_rgba(74,222,128,0.25)]"
      style={{
        aspectRatio: "1 / 1",
        width: "100%",
        transform: `rotate(${rotate}deg) translateY(${translateY}px)`,
      }}
    >
      {/* 0. Card Background */}
      <Image
        src="/sprite-card/themes/forest-theme.png"
        alt=""
        fill
        draggable={false}
        className="object-contain select-none pointer-events-none"
        style={{ imageRendering: "pixelated" }}
      />

      {/* 1. Sprite image */}
      <div
        className="absolute overflow-hidden"
        style={{ top: "18%", left: "13%", width: "74%", height: "60%" }}
      >
        <img
          src={sprite.imageUrl}
          alt={sprite.name}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
          style={{
            imageRendering: "pixelated",
            filter: "drop-shadow(0 0 1px #000) drop-shadow(0 0 1px #000) drop-shadow(0 0 1px #000)",
          }}
        />
        <div className="absolute inset-0 bg-green-400/0 group-hover:bg-green-400/8 transition-colors duration-300" />
      </div>

      {/* 2. Slot frame */}
      <Image
        src="/sprite-card/sprite-body.png"
        alt=""
        fill
        draggable={false}
        className="object-contain select-none pointer-events-none"
        style={{ imageRendering: "pixelated" }}
      />

      {/* 3. Title banner */}
      <Image
        src="/sprite-card/title-banner.png"
        alt=""
        fill
        draggable={false}
        className="object-contain select-none pointer-events-none"
        style={{ imageRendering: "pixelated" }}
      />

      {/* 4. Sprite name */}
      <div
        className="absolute pointer-events-none"
        style={{ top: "3%", left: "15%", width: "70%", height: "12%" }}
      >
        <p
          className="w-full h-full flex items-center justify-center font-bold text-neutral-200 group-hover:text-green-300 transition-colors duration-200"
          style={{
            fontSize: "clamp(0.48rem, 1.3vw, 0.68rem)",
            textShadow: "0 1px 4px rgba(0,0,0,0.95)",
            WebkitMaskImage: "linear-gradient(to right, white 70%, transparent 100%)",
            maskImage: "linear-gradient(to right, white 70%, transparent 100%)",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {sprite.name}
        </p>
      </div>

      {/* 5. Date badge */}
      <p
        className="absolute text-center text-neutral-500 group-hover:text-green-300/70 transition-colors duration-200 truncate pointer-events-none"
        style={{
          bottom: "8%",
          left: "10%",
          width: "80%",
          fontSize: "clamp(0.4rem, 1.1vw, 0.58rem)",
        }}
      >
        {new Date(sprite.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </p>

      {/* 6. Visibility badge */}
      {showVisibility && (
        <div className="absolute pointer-events-none" style={{ top: "3%", right: "8%" }}>
          {sprite.isPublic ? (
            <span
              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-green-400/15 border border-green-400/30 text-green-300"
              style={{ fontSize: "clamp(0.35rem, 0.9vw, 0.55rem)" }}
            >
              <Globe style={{ width: "clamp(0.4rem, 0.9vw, 0.55rem)", height: "clamp(0.4rem, 0.9vw, 0.55rem)" }} />
            </span>
          ) : (
            <span
              className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-neutral-800/80 border border-neutral-700 text-neutral-400"
              style={{ fontSize: "clamp(0.35rem, 0.9vw, 0.55rem)" }}
            >
              <Lock style={{ width: "clamp(0.4rem, 0.9vw, 0.55rem)", height: "clamp(0.4rem, 0.9vw, 0.55rem)" }} />
            </span>
          )}
        </div>
      )}

      {/* 7. Banish button */}
      {onDelete && (
        <button
          onClick={(e) => {
            e.preventDefault(); 
            e.stopPropagation();
            onDelete(sprite.id);
          }}
          className="absolute -top-5 -right-5 z-10 opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200 hover:scale-110"
        >
          <Image
            src="/ui-icons/banishing.png"
            alt="Banish"
            width={40}
            height={40}
            className="object-contain rounded-full bg-red-600 ring-2 ring-red-400 shadow-[0_0_0_4px_#dc2626]"
            style={{ imageRendering: "pixelated" }}
          />
        </button>
      )}

      {/* Corner glow */}
      <div className="absolute top-[5%] right-[8%] w-1 h-1 rounded-full bg-transparent group-hover:bg-green-400 transition-all duration-300 group-hover:shadow-[0_0_8px_3px_rgba(74,222,128,0.5)]" />
    </div>
  );

  if (onClick) {
    return <div onClick={() => onClick(sprite)}>{inner}</div>;
  }

  return (
    <Link href={`/sanctum/${sprite.id}`} prefetch>
      {inner}
    </Link>
  );
}