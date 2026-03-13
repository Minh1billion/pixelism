'use client'

import Image from 'next/image'
import { useState, useRef, useCallback, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'
import { useAddingSprites, type SpriteUploadItem } from '@/features/sprite/hooks/useAddingSprites'
import { useCategories } from '@/features/category/hooks/useCategories'
import { SpritePreviewModal } from '@/features/sprite/components/modals/SpritePreviewModal'
import { DropZone } from './DropZone'
import { UploadItemRow } from './UploadItemRow'

interface AddSpritesModalProps {
  open: boolean
  onClose: () => void
}

export function AddSpritesModal({ open, onClose }: AddSpritesModalProps) {
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories()
  const [previewItem, setPreviewItem] = useState<SpriteUploadItem | null>(null)
  const handleCloseRef = useRef<() => void>(() => {})

  const {
    items, isSubmitting, canSubmit, hasErrors,
    addFiles, updateItem, removeItem, reset, retryFailed, submitAll
  } = useAddingSprites({ onClose: () => handleCloseRef.current() })

  const handleClose = useCallback(() => {
    if (isSubmitting) return
    setPreviewItem(null)
    reset()
    onClose()
  }, [isSubmitting, reset, onClose])

  useEffect(() => {
    handleCloseRef.current = handleClose
  }, [handleClose])

  if (!open) return null

  const doneCount = items.filter(i => i.status === 'done').length
  const errorCount = items.filter(i => i.status === 'error').length
  const categoryList = categories.map(c => ({ id: c.id, name: c.name }))

  return (
    <>
      <div className='fixed inset-0 z-50 flex items-center justify-center'>
        <div className='absolute inset-0 bg-black/70 backdrop-blur-sm' onClick={handleClose} />

        <div className='relative z-10 w-full max-w-3xl max-h-[90vh] flex flex-col bg-neutral-950 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl'>
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
                <h2 className='text-white font-bold text-sm tracking-wide'>The Forge</h2>
                <p className='text-neutral-600 text-xs'>Bind new relics to the realm</p>
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

          <DropZone onFiles={addFiles} />

          {categoriesError && (
            <div className='mx-6 mt-3 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/30'>
              <p className='text-red-400 text-xs'>Failed to load categories: {categoriesError}</p>
            </div>
          )}

          {items.length > 0 && (
            <div className='flex-1 overflow-y-auto px-6 py-4 space-y-3 min-h-0'>
              {items.map(item => (
                <UploadItemRow
                  key={item.id}
                  item={item}
                  categories={categoryList}
                  categoriesLoading={categoriesLoading}
                  onChange={patch => updateItem(item.id, patch)}
                  onRemove={() => removeItem(item.id)}
                  onHover={() => setPreviewItem(item)}
                  onLeave={() => setPreviewItem(null)}
                />
              ))}
            </div>
          )}

          <div className='flex items-center justify-between px-6 py-4 border-t border-neutral-800'>
            <div className='flex items-center gap-3'>
              <p className='text-neutral-600 text-xs'>{doneCount}/{items.length} relics bound</p>
              {hasErrors && !isSubmitting && (
                <button
                  onClick={retryFailed}
                  className='flex items-center gap-1 text-xs text-red-400 hover:text-red-300 transition-colors'
                >
                  <RefreshCw className='w-3 h-3' />
                  Retry {errorCount} failed
                </button>
              )}
            </div>
            <div className='flex gap-2'>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className='px-4 py-2 rounded-xl text-sm text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-600 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed'
              >
                Retreat
              </button>
              <button
                onClick={submitAll}
                disabled={!canSubmit}
                className='px-5 py-2 rounded-xl text-sm font-semibold bg-green-400 text-neutral-950 hover:bg-green-300 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200'
              >
                Forge All
              </button>
            </div>
          </div>
        </div>
      </div>

      <SpritePreviewModal item={previewItem} categories={categoryList} />
    </>
  )
}