"use client";

import { useEffect, useState } from "react";
import { SpriteService } from "@/features/sprite/api/sprite.client";
import type { SpriteResponse } from "@/features/sprite/types/sprite.types";

export function useSprite(id: string) {
  const [sprite, setSprite] = useState<SpriteResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    setLoading(true); 
    setError(null); 

    SpriteService.getById(id)
      .then(setSprite)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { sprite, loading, error };
}