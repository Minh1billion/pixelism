'use client'

import Image from 'next/image'
import { useState, useCallback, useEffect } from 'react'
import { GiCrystalBall } from 'react-icons/gi'
import { SpriteFilters } from '@/features/sprite/components/filters/SpriteFilters'
import { MobileSpriteFilters } from '@/features/sprite/components/filters/MobileSpriteFilter'
import { SpriteGrid } from '@/features/sprite/components/SpriteGrid'
import { AddSpritesModal } from '@/features/sprite/components/modals/AddSpriteModal'
import { TrashSpriteModal } from '@/features/sprite/components/modals/TrashSpriteModal'
import { DeleteConfirmModal } from '@/features/sprite/components/modals/DeleteConfirmModal'
import { UpdateSpriteModal } from '@/features/sprite/components/modals/UpdateSpriteModal'
import { Pagination } from '@/shared/components/layouts/Pagination'
import { useSprites } from '@/features/sprite/hooks/useSprites'
import { useRemovingSprites } from '@/features/sprite/hooks/useRemovingSprites'
import { SpriteService } from '@/features/sprite/api/sprite.client'
import type { SpriteTab } from '@/features/sprite/hooks/useSprites'
import type { SpriteListResponse } from '@/features/sprite/types/sprite.types'
import type { CategoryResponse } from '@/features/category/types/category.types'
import type { PageResponse } from '@/shared/types/shared.types'

const TABS: { key: SpriteTab; label: string }[] = [
  { key: 'public', label: 'All Relics' },
  { key: 'mine', label: 'My Collection' },
]

interface SanctumClientProps {
  initialSprites: PageResponse<SpriteListResponse>
  initialCategories: CategoryResponse[]
  serverDurationMs: number
}

export function SanctumClient({
  initialSprites,
  initialCategories,
  serverDurationMs,
}: SanctumClientProps) {
  const {
    tab, switchTab,
    sprites, totalElements, totalPages, page, goToPage,
    loading, filters, updateFilters,
    prependSprites, removeSprite,
  } = useSprites({ initialData: initialSprites })

  const [addOpen, setAddOpen] = useState(false)
  const [trashOpen, setTrashOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<{
    sprite: SpriteListResponse
    categoryIds: string[]
  } | null>(null)

  const { pendingId, loading: deleteLoading, requestDelete, cancelDelete, confirmDelete } =
    useRemovingSprites({ onRemoved: removeSprite })

  useEffect(() => {
    const onReady = async (e: Event) => {
      const { spriteId } = (e as CustomEvent).detail
      try {
        const sprite = await SpriteService.getById(spriteId)
        prependSprites([{ ...sprite, deletedAt: null }])
      } catch {}
    }
    const onRejected = (e: Event) => {
      const { spriteId } = (e as CustomEvent).detail
      removeSprite(spriteId)
    }
    window.addEventListener('sprite:ready', onReady)
    window.addEventListener('sprite:rejected', onRejected)
    return () => {
      window.removeEventListener('sprite:ready', onReady)
      window.removeEventListener('sprite:rejected', onRejected)
    }
  }, [prependSprites, removeSprite])

  const handleRestore = useCallback(
    (sprite: SpriteListResponse) => prependSprites([sprite]),
    [prependSprites]
  )

  const handleEdit = useCallback(async (sprite: SpriteListResponse) => {
    try {
      const full = await SpriteService.getById(sprite.id)
      setEditTarget({ sprite, categoryIds: full.categoryIds })
    } catch {}
  }, [])

  return (
    <>
      {/* Tabs + Count */}
      <div className='flex items-center justify-between mb-6 flex-wrap gap-3'>
        <div className='flex gap-1 bg-neutral-900 border border-neutral-800 rounded-xl p-1'>
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => switchTab(key)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                tab === key
                  ? 'bg-green-400 text-neutral-950'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {!loading && (
          <div className='flex items-center gap-2 text-neutral-500 text-sm'>
            <GiCrystalBall className='w-4 h-4 text-green-400/60' />
            <span>
              <span className='text-neutral-200 font-semibold'>{totalElements}</span>{' '}
              relics found{' '}
              <span className='text-neutral-600'>in</span>{' '}
              <span className='text-green-400/70 font-mono'>{serverDurationMs}ms</span>
            </span>
          </div>
        )}
      </div>

      {/* Filters */}
      <div className='mb-6'>
        <div className='hidden sm:block'>
          <SpriteFilters filters={filters} categories={initialCategories} onChange={updateFilters} />
        </div>
        <div className='flex sm:hidden gap-2'>
          <MobileSpriteFilters filters={filters} categories={initialCategories} onChange={updateFilters} />
        </div>
      </div>

      {/* Grid */}
      <SpriteGrid
        sprites={sprites}
        loading={loading}
        onCardClick={tab === 'mine' ? handleEdit : undefined}
        onDelete={tab === 'mine' ? requestDelete : undefined}
      />

      <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />

      {/* FABs */}
      <div className='fixed bottom-6 right-6 z-40 flex flex-col gap-2 items-end'>
        <button
          onClick={() => setTrashOpen(true)}
          className='group flex items-center gap-2.5 pl-2.5 pr-4 py-2 rounded-xl bg-neutral-900 border border-neutral-700 hover:border-red-500/50 text-neutral-400 hover:text-red-300 text-sm font-semibold shadow-lg transition-all duration-200 hover:-translate-y-0.5'
        >
          <Image src='/ui-icons/obliterating.png' alt='' width={28} height={28}
            className='object-contain opacity-60 group-hover:opacity-100 transition-opacity'
            style={{ imageRendering: 'pixelated' }} />
          <span className='hidden sm:inline tracking-wide'>Banished</span>
        </button>

        <button
          onClick={() => setAddOpen(true)}
          className='group flex items-center gap-2.5 pl-2.5 pr-5 py-2.5 rounded-xl bg-green-400 hover:bg-green-300 text-neutral-950 text-sm font-bold shadow-lg shadow-green-400/20 transition-all duration-200 hover:-translate-y-0.5'
        >
          <Image src='/ui-icons/forging.png' alt='' width={28} height={28}
            className='object-contain' style={{ imageRendering: 'pixelated' }} />
          <span className='hidden sm:inline tracking-wide'>Forge Relic</span>
        </button>
      </div>

      {/* Modals */}
      <AddSpritesModal open={addOpen} onClose={() => setAddOpen(false)} />
      <TrashSpriteModal open={trashOpen} onClose={() => setTrashOpen(false)} onRestore={handleRestore} />
      <DeleteConfirmModal
        open={!!pendingId}
        loading={deleteLoading}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
      <UpdateSpriteModal
        open={!!editTarget}
        sprite={editTarget?.sprite ?? null}
        categoryIds={editTarget?.categoryIds ?? []}
        onClose={() => setEditTarget(null)}
        onSuccess={() => setEditTarget(null)}
      />
    </>
  )
}