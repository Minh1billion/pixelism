import { Hash, Pencil } from "lucide-react";
import { RuneSeparator } from "@/shared/components/ui/RuneSeparator";
import { RelicCategories } from "./RelicCategories";
import { RelicMeta } from "./RelicMeta";
import { DownloadButton } from "./DownloadButton";
import type { SpriteResponse } from "@/features/sprite/types/sprite.types";

interface RelicInfoProps {
  sprite: SpriteResponse;
  onEdit?: () => void;
}

export function RelicInfo({ sprite, onEdit }: RelicInfoProps) {
  return (
    <div className="flex flex-col gap-6 pt-2">
      <div className="inline-flex items-center gap-2 bg-green-950/50 border border-green-400/20 px-3 py-1.5 rounded-full w-fit">
        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
        <span className="text-green-300 text-xs tracking-[0.2em] uppercase">
          Pixel Art Realm
        </span>
      </div>

      {/* Title row */}
      <div>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-4xl sm:text-5xl font-black leading-none tracking-tight mb-2">
            {sprite.name}
          </h1>

          {onEdit && (
            <button
              onClick={onEdit}
              className="shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl border border-neutral-800 hover:border-green-400/40 text-neutral-400 hover:text-green-300 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 mt-1"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <Hash className="w-3.5 h-3.5 text-neutral-600" />
          <span className="text-neutral-500 text-sm font-mono">{sprite.slug}</span>
        </div>
      </div>

      <RuneSeparator />

      <RelicCategories
        categoryNames={sprite.categoryNames}
        categoryIds={sprite.categoryIds}
      />

      <RuneSeparator />

      <RelicMeta createdBy={sprite.createdBy} createdAt={sprite.createdAt} />

      <DownloadButton imageUrl={sprite.imageUrl} slug={sprite.slug} />
    </div>
  );
}