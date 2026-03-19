import { GiScrollUnfurled } from 'react-icons/gi'
import type { ResourceListResponse } from '@/features/resource/types/resource.types'
import { SpriteCard } from '@/features/sprite/components/SpriteCard'

interface ResourceGridProps {
  resources: ResourceListResponse[]
  loading?: boolean
}

export function ResourceGrid({ resources, loading }: ResourceGridProps) {
  const showFullSkeleton = loading && resources.length === 0

  if (showFullSkeleton) {
    return (
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 gap-y-6'>
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className='rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 animate-pulse'>
            <div className='aspect-square w-full bg-neutral-800' />
          </div>
        ))}
      </div>
    )
  }

  if (resources.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center py-24 text-center'>
        <div className='w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4'>
          <GiScrollUnfurled className='w-7 h-7 text-neutral-600' />
        </div>
        <p className='text-neutral-400 font-semibold text-sm'>No relics found</p>
        <p className='text-neutral-600 text-xs mt-1'>Try adjusting your filters or search query</p>
      </div>
    )
  }

  return (
    <div className='relative'>
      {loading && (
        <div className='absolute inset-0 z-10 bg-neutral-950/60 backdrop-blur-[1px] rounded-xl flex items-center justify-center transition-opacity duration-150'>
          <div className='flex flex-col items-center gap-3'>
            <div className='w-8 h-8 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin' />
            <span className='text-green-400/60 text-xs tracking-widest uppercase'>Searching</span>
          </div>
        </div>
      )}
      <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 transition-opacity duration-150 ${loading ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
        {resources.map((resource) => (
          resource.type === 'SPRITE' && resource.imageUrl
            ? <SpriteCard key={resource.id} sprite={resource as any} />
            : <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </div>
  )
}

function ResourceCard({ resource }: { resource: ResourceListResponse }) {
  return (
    <div className='rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 p-3 flex flex-col gap-2'>
      <div className='aspect-square w-full bg-neutral-800 rounded-lg flex items-center justify-center'>
        <span className='text-xs text-neutral-500 uppercase tracking-widest'>{resource.type}</span>
      </div>
      <p className='text-xs text-neutral-300 font-semibold truncate'>{resource.name}</p>
      {resource.durationSeconds && (
        <p className='text-xs text-neutral-500'>{resource.durationSeconds}s · {resource.format}</p>
      )}
    </div>
  )
}