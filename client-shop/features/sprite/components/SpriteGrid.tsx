import { GiScrollUnfurled } from "react-icons/gi";
import type { SpriteListResponse } from "@/features/sprite/types/sprite.types";
import { SpriteCard } from "@/features/sprite/components/SpriteCard";

interface SpriteGridProps {
  sprites: SpriteListResponse[];
  onCardClick?: (sprite: SpriteListResponse) => void;
  onDelete?: (id: string) => void;
  loading?: boolean;
}

export function SpriteGrid({ sprites, onCardClick, onDelete, loading }: SpriteGridProps) {
  const showFullSkeleton = loading && sprites.length === 0;

  if (showFullSkeleton) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 gap-y-6">
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 animate-pulse"
          >
            <div className="aspect-square w-full bg-neutral-800" />
            <div className="p-3 space-y-2">
              <div className="h-3 bg-neutral-800 rounded w-3/4" />
              <div className="h-2.5 bg-neutral-800 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (sprites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4">
          <GiScrollUnfurled className="w-7 h-7 text-neutral-600" />
        </div>
        <p className="text-neutral-400 font-semibold text-sm">No relics found</p>
        <p className="text-neutral-600 text-xs mt-1">
          Try adjusting your filters or search query
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 z-10 bg-neutral-950/60 backdrop-blur-[1px] rounded-xl flex items-center justify-center transition-opacity duration-150">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin" />
            <span className="text-green-400/60 text-xs tracking-widest uppercase">Searching</span>
          </div>
        </div>
      )}

      <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 transition-opacity duration-150 ${loading ? "opacity-40 pointer-events-none" : "opacity-100"}`}>
        {sprites.map((sprite) => (
          <SpriteCard
            key={sprite.id}
            sprite={sprite}
            onClick={onCardClick}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}