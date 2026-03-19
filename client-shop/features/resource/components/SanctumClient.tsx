'use client'

import Image from 'next/image'
import { GiCrystalBall } from 'react-icons/gi'
import { SpriteFilters } from '@/features/sprite/components/filters/SpriteFilters'
import { MobileSpriteFilters } from '@/features/sprite/components/filters/MobileSpriteFilter'
import { ResourceGrid } from '@/features/resource/components/ResourceGrid'
import { AddSpritesModal } from '@/features/sprite/components/modals/AddSpriteModal'
import { Pagination } from '@/shared/components/layouts/Pagination'
import { useResources } from '@/features/resource/hooks/useResources'
import { useState } from 'react'
import type { ResourceListResponse, ResourceFilterRequest } from '@/features/resource/types/resource.types'
import type { CategoryResponse } from '@/features/category/types/category.types'
import type { PageResponse } from '@/shared/types/shared.types'

interface SanctumClientProps {
  initialResources: PageResponse<ResourceListResponse> | null
  initialCategories: CategoryResponse[]
  serverDurationMs: number
}

export function SanctumClient({
  initialResources,
  initialCategories,
  serverDurationMs,
}: SanctumClientProps) {
  const {
    resources, totalElements, totalPages, page, goToPage,
    loading, filters, updateFilters,
  } = useResources({ initialData: initialResources })

  const [addOpen, setAddOpen] = useState(false)

  const spriteFilters = { categoryIds: filters.categoryIds, keyword: filters.keyword, sortOrder: filters.sortOrder }
  const handleFilterChange = (partial: Partial<ResourceFilterRequest>) => updateFilters(partial)

  return (
    <>
      <div className='flex items-center justify-between mb-6 flex-wrap gap-3'>
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

      <div className='mb-6'>
        <div className='hidden sm:block'>
          <SpriteFilters filters={spriteFilters} categories={initialCategories} onChange={handleFilterChange} />
        </div>
        <div className='flex sm:hidden gap-2'>
          <MobileSpriteFilters filters={spriteFilters} categories={initialCategories} onChange={handleFilterChange} />
        </div>
      </div>

      <ResourceGrid resources={resources} loading={loading} />

      <Pagination page={page} totalPages={totalPages} onPageChange={goToPage} />

      <div className='fixed bottom-6 right-6 z-40 flex flex-col gap-2 items-end'>
        <button
          onClick={() => setAddOpen(true)}
          className='group flex items-center gap-2.5 pl-2.5 pr-5 py-2.5 rounded-xl bg-green-400 hover:bg-green-300 text-neutral-950 text-sm font-bold shadow-lg shadow-green-400/20 transition-all duration-200 hover:-translate-y-0.5'
        >
          <Image src='/ui-icons/forging.png' alt='' width={28} height={28}
            className='object-contain' style={{ imageRendering: 'pixelated' }} />
          <span className='hidden sm:inline tracking-wide'>Forge Relic</span>
        </button>
      </div>

      <AddSpritesModal open={addOpen} onClose={() => setAddOpen(false)} />
    </>
  )
}