'use client'

import { useEffect, useState } from 'react'
import { SpriteCardPreview } from '@/features/sprite/components/SpriteCardPreview'
import type { SpriteUploadItem } from '@/features/sprite/hooks/useAddingSprites'

interface SpritePreviewModalProps {
  item: SpriteUploadItem | null
  categories: { id: string; name: string }[]
}

export function SpritePreviewModal ({ item, categories }: SpritePreviewModalProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (item) {
      const t = setTimeout(() => setVisible(true), 10)
      return () => clearTimeout(t)
    } else {
      setVisible(false)
    }
  }, [item])

  if (!item) return null

  const selectedCategories = categories.filter(c =>
    item.categoryIds.includes(c.id)
  )

  return (
    <div
      className={`fixed z-60 pointer-events-none transition-all duration-300 ease-out hidden xl:block
        ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}
      `}
      style={{
        top: '50%',
        left: 'calc(50% + 420px)',
        transform: `translateY(-50%)`
      }}
    >
      <div className='flex flex-col items-center gap-3'>
        {/* Label */}
        <div className='flex items-center gap-2'>
          <div className='w-1 h-1 rounded-full bg-green-400 animate-pulse' />
          <span className='text-green-300 text-xs tracking-[0.2em] uppercase font-semibold'>
            Preview
          </span>
        </div>

        {/* Card */}
        <div style={{ width: '180px' }}>
          <SpriteCardPreview item={item} />
        </div>

        {/* Category tags */}
        {selectedCategories.length > 0 ? (
          <div className='flex flex-wrap gap-1 justify-center max-w-45'>
            {selectedCategories.map(cat => (
              <span
                key={cat.id}
                className='px-2 py-0.5 rounded-full text-[10px] bg-green-400/10 border border-green-400/30 text-green-300'
              >
                {cat.name}
              </span>
            ))}
          </div>
        ) : (
          <span className='text-neutral-600 text-[10px]'>No categories selected</span>
        )}
      </div>
    </div>
  )
}