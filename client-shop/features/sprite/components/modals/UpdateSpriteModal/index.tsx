'use client'

import Image from 'next/image'
import { useRef, useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useUpdatingSprite } from '@/features/sprite/hooks/useUpdatingSprite'
import { useCategories } from '@/features/category/hooks/useCategories'
import { UpdateSpriteFields } from './UpdateSpriteFields'
import { UpdateSpritePreview } from './UpdateSpritePreview'
import type { SpriteListResponse } from '@/features/sprite/types/sprite.types'

interface UpdateSpriteModalProps {
  open: boolean
  sprite: SpriteListResponse | null
  categoryIds: string[]
  categories?: ReturnType<typeof import('@/features/category/hooks/useCategories').useCategories>['categories']
  onClose: () => void
  onSuccess?: () => void
  onUpdated?: (name: string, categoryIds: string[], isPublic: boolean) => void
}

export function UpdateSpriteModal({
  open,
  sprite,
  categoryIds,
  categories: categoriesProp,
  onClose,
  onSuccess,
  onUpdated,
}: UpdateSpriteModalProps) {
  const { categories: categoriesFetched, loading: categoriesLoading, error: categoriesError } = useCategories()
  const categories = categoriesProp ?? categoriesFetched
  const handleCloseRef = useRef<() => void>(() => {})
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const { item, isSubmitting, canSubmit, error, open: openItem, reset, updateItem, submit } =
    useUpdatingSprite({ onSuccess, onClose: () => handleCloseRef.current(), onUpdated })

  const handleClose = useCallback(() => {
    if (isSubmitting) return
    reset()
    onClose()
  }, [isSubmitting, reset, onClose])

  useEffect(() => {
    handleCloseRef.current = handleClose
  }, [handleClose])

  useEffect(() => {
    if (open && sprite) {
      openItem(sprite, categoryIds)
    }
  }, [open, sprite])

  if (!open || !item || !mounted) return null

  const categoryList = categories.map(c => ({ id: c.id, name: c.name }))

  return createPortal(
    <div className='fixed inset-0 z-9999 flex items-center justify-center'>
      <div className='absolute inset-0 bg-black/70 backdrop-blur-sm' onClick={handleClose} />

      <div className='relative z-10 w-full max-w-4xl max-h-[90vh] flex flex-col bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl'>

        {/* Header */}
        <div className='flex items-center justify-between px-6 py-4 border-b border-neutral-800'>
          <div className='flex items-center gap-3'>
            <Image
              src='/ui-icons/forging.png'
              alt=''
              width={28}
              height={28}
              className='object-contain'
              style={{ imageRendering: 'pixelated' }}
            />
            <div>
              <h2 className='text-white font-bold text-sm tracking-wide'>Edit Relic</h2>
              <p className='text-neutral-600 text-xs'>Changes reflect on the card instantly</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className='text-neutral-500 hover:text-white transition-colors text-lg leading-none disabled:opacity-30 disabled:cursor-not-allowed'
          >
            ✕
          </button>
        </div>

        {/* Body — form (left) | preview (right) */}
        <div className='flex flex-1 min-h-0 overflow-hidden'>
          {/* Form */}
          <div className='flex-1 overflow-y-auto px-6 py-5'>
            {categoriesError && (
              <div className='mb-4 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30'>
                <p className='text-red-400 text-xs'>Failed to load categories: {categoriesError}</p>
              </div>
            )}
            <UpdateSpriteFields
              item={item}
              categories={categoryList}
              categoriesLoading={categoriesLoading}
              onChange={updateItem}
            />
          </div>

          {/* Divider */}
          <div className='w-px bg-neutral-800 my-5 shrink-0' />

          {/* Preview */}
          <div className='w-72 flex flex-col items-center justify-center gap-4 px-8 py-5 shrink-0 bg-neutral-900/30'>
            <UpdateSpritePreview item={item} />
          </div>
        </div>

        {/* Footer */}
        <div className='flex items-center justify-between px-6 py-4 border-t border-neutral-800'>
          {error ? (
            <p className='text-xs text-red-400'>{error}</p>
          ) : (
            <span />
          )}

          <div className='flex gap-2'>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className='px-4 py-2 rounded-xl text-sm text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-600 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed'
            >
              Cancel
            </button>
            <button
              onClick={submit}
              disabled={!canSubmit}
              className='px-5 py-2 rounded-xl text-sm font-semibold bg-green-400 text-neutral-950 hover:bg-green-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200'
            >
              {isSubmitting ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </div>

      </div>
    </div>,
    document.body
  )
}