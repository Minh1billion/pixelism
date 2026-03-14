'use client'

import { useCallback, useState } from "react"
import { SpriteService } from "../api/sprite.client"

export interface SpriteUpdateItem {
    id: string
    name: string
    preview: string
    categoryIds: string[]
    isPublic: boolean
}

interface UseUpdatingSpritesOptions {
  onSuccess?: () => void
  onClose?: () => void
}

function useUpdatingSprite({ onSuccess, onClose }: UseUpdatingSpritesOptions ) {
    const [item, setItem] = useState<SpriteUpdateItem>()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const updateItem = useCallback(
        (patch: Partial<Pick<SpriteUpdateItem, "name" | "categoryIds" | "isPublic">>) => {
            setItem(prev => (prev ? { ...prev, ...patch } : prev))
    }, 
    [])

    const submitUpdate = useCallback(async (item: SpriteUpdateItem) => {
        if (!item) return

        setIsSubmitting(true)
        setError(null)

        try {
            await SpriteService.update(
                item.id, 
                { name: item.name, categoryIds: item.categoryIds, isPublic: item.isPublic }
            )

            onSuccess?.()
            onClose?.()
        } catch (err: any) {
            setError(err.message ?? "Update sprite failed")
        } finally {
            setIsSubmitting(false)
        }
    }, [item, onSuccess, onClose])

    return {
        item,
        setItem,
        updateItem,
        submitUpdate,
        isSubmitting,
        error
    }
}