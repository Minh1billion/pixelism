'use client'

import { useState, useCallback } from 'react'
import { SpriteService } from '@/features/sprite/api/sprite.client'

const CONCURRENCY = 3

export interface SpriteUploadItem {
  id: string
  file: File
  preview: string
  name: string
  categoryIds: string[]
  isPublic: boolean
  status: 'idle' | 'uploading' | 'done' | 'error'
  error?: string
}

interface UseAddingSpritesOptions {
  onSuccess?: () => void
  onClose?: () => void
}

export function useAddingSprites({ onSuccess, onClose }: UseAddingSpritesOptions = {}) {
  const [items, setItems] = useState<SpriteUploadItem[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addFiles = useCallback((files: File[]) => {
    const newItems: SpriteUploadItem[] = files.map(file => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      name: file.name.replace(/\.[^.]+$/, ''),
      categoryIds: [],
      isPublic: true,
      status: 'idle'
    }))
    setItems(prev => [...prev, ...newItems])
  }, [])

  const updateItem = useCallback(
    (id: string, patch: Partial<Pick<SpriteUploadItem, 'name' | 'categoryIds' | 'isPublic'>>) => {
      setItems(prev =>
        prev.map(item => (item.id === id ? { ...item, ...patch } : item))
      )
    },
    []
  )

  const removeItem = useCallback((id: string) => {
    setItems(prev => {
      const item = prev.find(i => i.id === id)
      if (item) URL.revokeObjectURL(item.preview)
      return prev.filter(i => i.id !== id)
    })
  }, [])

  const reset = useCallback(() => {
    setItems(prev => {
      prev.forEach(i => URL.revokeObjectURL(i.preview))
      return []
    })
  }, [])

  const retryFailed = useCallback(() => {
    setItems(prev =>
      prev.map(i => (i.status === 'error' ? { ...i, status: 'idle', error: undefined } : i))
    )
  }, [])

  const runUpload = useCallback(async (pending: SpriteUploadItem[]) => {
    setIsSubmitting(true)

    let hasSuccess = false
    let cursor = 0

    const runNext = async (): Promise<void> => {
      if (cursor >= pending.length) return
      const item = pending[cursor++]

      setItems(prev =>
        prev.map(i => (i.id === item.id ? { ...i, status: 'uploading' } : i))
      )

      try {
        await SpriteService.create(
          { name: item.name, categoryIds: item.categoryIds, isPublic: item.isPublic },
          item.file
        )
        hasSuccess = true
        setItems(prev =>
          prev.map(i => (i.id === item.id ? { ...i, status: 'done' } : i))
        )
      } catch (err: any) {
        setItems(prev =>
          prev.map(i =>
            i.id === item.id
              ? { ...i, status: 'error', error: err.message ?? 'Upload failed' }
              : i
          )
        )
      }

      await runNext()
    }

    await Promise.all(Array.from({ length: CONCURRENCY }, runNext))

    setIsSubmitting(false)
    if (hasSuccess) onSuccess?.()
  }, [onSuccess])

  const submitAll = useCallback(async () => {
    const pending = items.filter(i => i.status === 'idle')
    if (!pending.length || isSubmitting) return

    onClose?.()
    runUpload(pending)
  }, [items, isSubmitting, onClose, runUpload])

  const canSubmit =
    !isSubmitting &&
    items.some(i => i.status === 'idle') &&
    items.filter(i => i.status === 'idle').every(i => i.name.trim())

  const hasErrors = items.some(i => i.status === 'error')

  return {
    items,
    isSubmitting,
    canSubmit,
    hasErrors,
    addFiles,
    updateItem,
    removeItem,
    reset,
    retryFailed,
    submitAll,
  }
}