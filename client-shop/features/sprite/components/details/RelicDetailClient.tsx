"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { RelicImage } from "@/features/sprite/components/details/RelicImage";
import { RelicInfo } from "@/features/sprite/components/details/RelicInfo";
import { UpdateSpriteModal } from "@/features/sprite/components/modals/UpdateSpriteModal";
import { useCategories } from "@/features/category/hooks/useCategories";
import { useAuth } from "@/features/auth/hooks/useAuth";
import type { SpriteResponse } from "@/features/sprite/types/sprite.types";

interface RelicDetailClientProps {
  sprite: SpriteResponse;
}

export function RelicDetailClient({ sprite: initialSprite }: RelicDetailClientProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [sprite, setSprite] = useState(initialSprite);
  const [editOpen, setEditOpen] = useState(false);
  const { categories } = useCategories();

  const isOwner = !!user && user.username === sprite.createdBy;

  const handleEditSuccess = useCallback(() => {
    setEditOpen(false);
    router.refresh();
  }, [router]);

  const handleUpdated = useCallback((name: string, categoryIds: string[], isPublic: boolean) => {
    const updatedCategoryNames = categories
      .filter(c => categoryIds.includes(c.id))
      .map(c => c.name);

    setSprite(prev => ({
      ...prev,
      name,
      categoryIds,
      categoryNames: updatedCategoryNames,
      isPublic,
    }));
  }, [categories]);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <RelicImage imageUrl={sprite.imageUrl} name={sprite.name} />
        <RelicInfo
          sprite={sprite}
          onEdit={isOwner ? () => setEditOpen(true) : undefined}
        />
      </div>

      {isOwner && (
        <UpdateSpriteModal
          open={editOpen}
          sprite={{ ...sprite, deletedAt: null }}
          categoryIds={sprite.categoryIds}
          categories={categories}
          onClose={() => setEditOpen(false)}
          onSuccess={handleEditSuccess}
          onUpdated={handleUpdated}
        />
      )}
    </>
  );
}