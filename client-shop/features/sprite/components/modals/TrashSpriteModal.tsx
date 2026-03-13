"use client";

import Image from "next/image";
import { useEffect } from "react";
import { useRemovedSprites } from "@/features/sprite/hooks/useRemovedSprites";
import type { SpriteListResponse } from "@/features/sprite/types/sprite.types";

interface TrashSpriteModalProps {
  open: boolean;
  onClose: () => void;
  onRestore: (sprite: SpriteListResponse) => void;
}

export function TrashSpriteModal({ open, onClose, onRestore }: TrashSpriteModalProps) {
  const { sprites, loading, page, totalPages, actioningId, restore, hardDelete, goToPage, refetch } =
    useRemovedSprites({ onRestore });

  useEffect(() => {
    if (open) refetch();
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-4xl max-h-[90vh] flex flex-col bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <Image
              src="/ui-icons/obliterating.png"
              alt=""
              width={28}
              height={28}
              className="object-contain opacity-80"
              style={{ imageRendering: "pixelated" }}
            />
            <div>
              <h2 className="text-white font-bold text-sm tracking-wide">The Void</h2>
              <p className="text-neutral-600 text-xs">
                Relics banished from the realm
                {sprites.length > 0 && (
                  <span className="ml-1 text-neutral-500 font-mono">· {sprites.length}</span>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-white transition-colors text-lg leading-none"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-xl bg-neutral-900 border border-neutral-800 animate-pulse aspect-square" />
              ))}
            </div>
          ) : sprites.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
              <Image
                src="/ui-icons/obliterating.png"
                alt=""
                width={48}
                height={48}
                className="object-contain opacity-20"
                style={{ imageRendering: "pixelated" }}
              />
              <p className="text-neutral-500 text-sm">The void is empty</p>
              <p className="text-neutral-700 text-xs">No relics have been banished</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {sprites.map((sprite) => (
                <BanishedCard
                  key={sprite.id}
                  sprite={sprite}
                  actioning={actioningId === sprite.id}
                  onRestore={() => restore(sprite.id)}
                  onHardDelete={() => hardDelete(sprite.id)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 px-6 py-4 border-t border-neutral-800">
            <button
              onClick={() => goToPage(page - 1)}
              disabled={page === 0}
              className="px-3 py-1.5 rounded-lg border border-neutral-800 text-xs text-neutral-400 hover:border-neutral-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              ← Prev
            </button>
            <span className="text-neutral-600 text-xs font-mono">{page + 1} / {totalPages}</span>
            <button
              onClick={() => goToPage(page + 1)}
              disabled={page >= totalPages - 1}
              className="px-3 py-1.5 rounded-lg border border-neutral-800 text-xs text-neutral-400 hover:border-neutral-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface BanishedCardProps {
  sprite: SpriteListResponse;
  actioning: boolean;
  onRestore: () => void;
  onHardDelete: () => void;
}

function BanishedCard({ sprite, actioning, onRestore, onHardDelete }: BanishedCardProps) {
  return (
    <div className="group relative rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all duration-200">
      <div className="relative aspect-square bg-neutral-950">
        <img
          src={sprite.imageUrl}
          alt={sprite.name}
          className="w-full h-full object-contain p-3 opacity-40 group-hover:opacity-60 transition-opacity"
          style={{ imageRendering: "pixelated" }}
        />
        <div className="absolute inset-0 bg-red-950/20" />
      </div>

      <div className="p-2 border-t border-neutral-800">
        <p className="text-xs text-neutral-400 font-semibold truncate">{sprite.name}</p>
        {sprite.deletedAt && (
          <p className="text-xs text-neutral-600 font-mono mt-0.5">
            Banished {new Date(sprite.deletedAt).toLocaleDateString("en-GB", {
              day: "2-digit", month: "short", year: "numeric",
            })}
          </p>
        )}
      </div>

      <div className="absolute inset-0 bg-neutral-950/85 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 p-3">
        <button
          onClick={onRestore}
          disabled={actioning}
          className="w-full py-1.5 rounded-lg bg-green-400/20 border border-green-400/40 text-green-300 text-xs font-semibold hover:bg-green-400/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {actioning ? "…" : "Reclaim"}
        </button>
        <button
          onClick={onHardDelete}
          disabled={actioning}
          className="w-full py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold hover:bg-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {actioning ? "…" : "Obliterate"}
        </button>
      </div>
    </div>
  );
}