'use client'

import { useState, useCallback } from 'react'
import { SpriteService } from '@/features/sprite/api/sprite.client'
import type { SpriteListResponse } from '@/features/sprite/types/sprite.types'

export interface SpriteUpdateItem {
  id: string
  name: string
  preview: string
  categoryIds: string[]
  isPublic: boolean
}

interface UseUpdatingSpriteOptions {
  onSuccess?: () => void
  onClose?: () => void
  onUpdated?: (name: string, categoryIds: string[], isPublic: boolean) => void
}

export function useUpdatingSprite({ onSuccess, onClose, onUpdated }: UseUpdatingSpriteOptions = {}) {
  const [item, setItem] = useState<SpriteUpdateItem | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const open = useCallback((sprite: SpriteListResponse, categoryIds: string[]) => {
    setItem({
      id: sprite.id,
      name: sprite.name,
      preview: sprite.imageUrl,
      categoryIds,
      isPublic: sprite.isPublic,
    })
    setError(null)
  }, [])

  const updateItem = useCallback(
    (patch: Partial<Pick<SpriteUpdateItem, 'name' | 'categoryIds' | 'isPublic'>>) => {
      setItem(prev => (prev ? { ...prev, ...patch } : prev))
    },
    []
  )

  const reset = useCallback(() => {
    setItem(null)
    setError(null)
    setIsSubmitting(false)
  }, [])

  const submit = useCallback(async () => {
    if (!item) return

    if (!item.name.trim()) {
      setError('Relic name is required')
      return
    }
    if (item.categoryIds.length === 0) {
      setError('At least one category is required')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      await SpriteService.update(item.id, {
        name: item.name.trim(),
        categoryIds: item.categoryIds,
        isPublic: item.isPublic,
      })
      onUpdated?.(item.name.trim(), item.categoryIds, item.isPublic)
      onSuccess?.()
      onClose?.()
      reset()
    } catch (err: any) {
      setError(err.message ?? 'Update failed')
    } finally {
      setIsSubmitting(false)
    }
  }, [item, onUpdated, onSuccess, onClose, reset])

  const canSubmit =
    !isSubmitting &&
    !!item?.name.trim() &&
    (item?.categoryIds.length ?? 0) > 0

  return {
    item,
    isSubmitting,
    canSubmit,
    error,
    open,
    reset,
    updateItem,
    submit,
  }
}