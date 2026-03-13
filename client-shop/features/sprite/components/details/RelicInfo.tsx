import { Hash } from "lucide-react";
import { RuneSeparator } from "@/shared/components/ui/RuneSeparator";
import { RelicCategories } from "./RelicCategories";
import { RelicMeta } from "./RelicMeta";
import { DownloadButton } from "./DownloadButton";
import type { SpriteResponse } from "@/features/sprite/types/sprite.types";

interface RelicInfoServerProps {
  sprite: SpriteResponse;
}

export function RelicInfo({ sprite }: RelicInfoServerProps) {
  return (
    <div className="flex flex-col gap-6 pt-2">
      <div className="inline-flex items-center gap-2 bg-green-950/50 border border-green-400/20 px-3 py-1.5 rounded-full w-fit">
        <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
        <span className="text-green-300 text-xs tracking-[0.2em] uppercase">
          Pixel Art Realm
        </span>
      </div>

      <div>
        <h1 className="text-4xl sm:text-5xl font-black leading-none tracking-tight mb-2">
          {sprite.name}
        </h1>
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