"use client";

import { useState, useCallback, useEffect } from "react";
import { SpriteService } from "@/features/sprite/api/sprite.client";
import type { SpriteListResponse } from "@/features/sprite/types/sprite.types";

interface UseTrashOptions {
  onRestore?: (sprite: SpriteListResponse) => void;
  onHardDelete?: (id: string) => void;
}

export function useRemovedSprites({ onRestore, onHardDelete }: UseTrashOptions = {}) {
  const [sprites, setSprites] = useState<SpriteListResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [actioningId, setActioningId] = useState<string | null>(null);

  const fetch = useCallback(async (p = 0) => {
    setLoading(true);
    try {
      const data = await SpriteService.getTrash(p);
      setSprites(data.content);
      setTotalPages(data.totalPages);
      setPage(p);
    } catch {
      // keep previous state on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch(0);
  }, [fetch]);

  const restore = useCallback(
    async (id: string) => {
      setActioningId(id);
      try {
        const sprite = await SpriteService.restoreById(id);
        setSprites((prev) => prev.filter((s) => s.id !== id));
        onRestore?.(sprite);
      } finally {
        setActioningId(null);
      }
    },
    [onRestore]
  );

  const hardDelete = useCallback(
    async (id: string) => {
      setActioningId(id);
      try {
        await SpriteService.hardDeleteById(id);
        setSprites((prev) => prev.filter((s) => s.id !== id));
        onHardDelete?.(id);
      } finally {
        setActioningId(null);
      }
    },
    [onHardDelete]
  );

  const goToPage = useCallback((p: number) => fetch(p), [fetch]);

  return {
    sprites,
    loading,
    page,
    totalPages,
    actioningId,
    restore,
    hardDelete,
    goToPage,
    refetch: () => fetch(page),
  };
}