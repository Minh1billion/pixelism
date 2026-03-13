import { Globe, Lock } from 'lucide-react'
import { CategoryPills } from './CategoryPills'
import type { SpriteUploadItem } from '@/features/sprite/hooks/useAddingSprites'

interface UploadItemRowProps {
  item: SpriteUploadItem
  categories: { id: string; name: string }[]
  categoriesLoading: boolean
  onChange: (patch: Partial<Pick<SpriteUploadItem, 'name' | 'categoryIds' | 'isPublic'>>) => void
  onRemove: () => void
  onHover: () => void
  onLeave: () => void
}

export function UploadItemRow({
  item, categories, categoriesLoading,
  onChange, onRemove, onHover, onLeave
}: UploadItemRowProps) {
  const statusColor = {
    idle: 'border-neutral-800',
    uploading: 'border-green-400/40 animate-pulse',
    done: 'border-green-500/60',
    error: 'border-red-500/60'
  }[item.status]

  const isIdle = item.status === 'idle'

  return (
    <div
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={`flex gap-3 p-3 rounded-xl border ${statusColor} bg-neutral-900 transition-colors duration-300 cursor-default`}
    >
      <img
        src={item.preview}
        alt={item.name}
        className='w-14 h-14 rounded-lg object-contain bg-neutral-950 shrink-0'
        style={{ imageRendering: 'pixelated' }}
      />

      <div className='flex-1 min-w-0 space-y-2'>
        <div className='flex gap-2'>
          <input
            type='text'
            value={item.name}
            onChange={e => onChange({ name: e.target.value })}
            disabled={!isIdle}
            placeholder='Relic name...'
            className='flex-1 min-w-0 bg-neutral-800 border border-neutral-700 focus:border-green-400/60 rounded-lg px-3 py-1.5 text-sm text-white placeholder-neutral-500 outline-none transition-colors disabled:opacity-50'
          />
          <button
            onClick={() => onChange({ isPublic: !item.isPublic })}
            disabled={!isIdle}
            title={item.isPublic ? 'Public — click to make private' : 'Private — click to make public'}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 disabled:opacity-50 ${
              item.isPublic
                ? 'bg-green-400/10 border-green-400/40 text-green-300 hover:bg-green-400/20'
                : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:text-neutral-200'
            }`}
          >
            {item.isPublic
              ? <><Globe className='w-3 h-3' /><span className='hidden sm:inline'>Public</span></>
              : <><Lock className='w-3 h-3' /><span className='hidden sm:inline'>Private</span></>
            }
          </button>
        </div>

        <CategoryPills
          categoryIds={item.categoryIds}
          categories={categories}
          loading={categoriesLoading}
          disabled={!isIdle}
          onChange={ids => onChange({ categoryIds: ids })}
        />

        {item.error && <p className='text-red-400 text-xs'>{item.error}</p>}
      </div>

      <div className='shrink-0 flex items-start pt-1'>
        {item.status === 'done' && <span className='text-green-400 text-xs font-mono'>✓</span>}
        {item.status === 'uploading' && <span className='text-green-400/60 text-xs font-mono animate-pulse'>…</span>}
        {item.status === 'error' && <span className='text-red-400 text-xs font-mono'>✗</span>}
        {item.status === 'idle' && (
          <button onClick={onRemove} className='text-neutral-600 hover:text-red-400 transition-colors text-sm leading-none'>✕</button>
        )}
      </div>
    </div>
  )
}