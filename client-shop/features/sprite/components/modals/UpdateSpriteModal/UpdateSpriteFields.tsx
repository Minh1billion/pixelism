'use client'

import { Globe, Lock } from 'lucide-react'
import type { SpriteUpdateItem } from '@/features/sprite/hooks/useUpdatingSprite'

interface CategoryOption {
  id: string
  name: string
}

interface UpdateSpriteFieldsProps {
  item: SpriteUpdateItem
  categories: CategoryOption[]
  categoriesLoading: boolean
  onChange: (patch: Partial<Pick<SpriteUpdateItem, 'name' | 'categoryIds' | 'isPublic'>>) => void
}

export function UpdateSpriteFields({
  item,
  categories,
  categoriesLoading,
  onChange,
}: UpdateSpriteFieldsProps) {
  function toggleCategory(id: string) {
    const selected = item.categoryIds.includes(id)
    // guard: cannot deselect the last category
    if (selected && item.categoryIds.length === 1) return
    onChange({
      categoryIds: selected
        ? item.categoryIds.filter(c => c !== id)
        : [...item.categoryIds, id],
    })
  }

  return (
    <div className='flex flex-col gap-5'>
      {/* Name */}
      <div className='flex flex-col gap-1.5'>
        <label className='text-xs font-semibold text-neutral-400 uppercase tracking-wider'>
          Relic Name
        </label>
        <input
          type='text'
          value={item.name}
          onChange={e => onChange({ name: e.target.value })}
          placeholder='Enter relic name…'
          className='w-full px-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-100 text-sm placeholder:text-neutral-600 focus:outline-none focus:border-green-400/50 focus:ring-1 focus:ring-green-400/20 transition-all duration-200'
        />
      </div>

      {/* Categories */}
      <div className='flex flex-col gap-1.5'>
        <div className='flex items-center justify-between'>
          <label className='text-xs font-semibold text-neutral-400 uppercase tracking-wider'>
            Categories
          </label>
          <span className='text-xs text-neutral-600'>{item.categoryIds.length} selected</span>
        </div>

        {categoriesLoading ? (
          <div className='flex gap-2'>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className='h-7 w-16 rounded-lg bg-neutral-800 animate-pulse' />
            ))}
          </div>
        ) : (
          <div className='flex flex-wrap gap-2'>
            {categories.map(cat => {
              const selected = item.categoryIds.includes(cat.id)
              const isLast = selected && item.categoryIds.length === 1
              return (
                <button
                  key={cat.id}
                  type='button'
                  onClick={() => toggleCategory(cat.id)}
                  title={isLast ? 'At least one category is required' : undefined}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-150
                    ${selected
                      ? 'bg-green-400/15 border-green-400/40 text-green-300'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-neutral-200'
                    }
                    ${isLast ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  {cat.name}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Visibility */}
      <div className='flex flex-col gap-1.5'>
        <label className='text-xs font-semibold text-neutral-400 uppercase tracking-wider'>
          Visibility
        </label>
        <div className='flex gap-2'>
          {(
            [
              { value: true, label: 'Public', Icon: Globe },
              { value: false, label: 'Private', Icon: Lock },
            ] as const
          ).map(({ value, label, Icon }) => {
            const active = item.isPublic === value
            return (
              <button
                key={label}
                type='button'
                onClick={() => onChange({ isPublic: value })}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-150
                  ${active
                    ? value
                      ? 'bg-green-400/15 border-green-400/40 text-green-300'
                      : 'bg-neutral-800 border-neutral-600 text-neutral-200'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-500 hover:border-neutral-600 hover:text-neutral-300'
                  }`}
              >
                <Icon className='w-4 h-4' />
                {label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}