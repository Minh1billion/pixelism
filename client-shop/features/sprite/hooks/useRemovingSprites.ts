"use client";

import { useState, useCallback } from "react";
import { SpriteService } from "@/features/sprite/api/sprite.client";

interface UseRemovingSpritesOptions {
  onRemoved?: (id: string) => void;
}

export function useRemovingSprites({ onRemoved }: UseRemovingSpritesOptions = {}) {
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const requestDelete = useCallback((id: string) => {
    setPendingId(id);
  }, []);

  const cancelDelete = useCallback(() => {
    setPendingId(null);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!pendingId) return;
    setLoading(true);
    try {
      await SpriteService.deleteById(pendingId);
      onRemoved?.(pendingId);
      setPendingId(null);
    } finally {
      setLoading(false);
    }
  }, [pendingId, onRemoved]);

  return {
    pendingId,
    loading,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
}