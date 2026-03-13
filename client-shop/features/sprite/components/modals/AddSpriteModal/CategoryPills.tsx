interface CategoryPillsProps {
  categoryIds: string[]
  categories: { id: string; name: string }[]
  loading: boolean
  disabled: boolean
  onChange: (ids: string[]) => void
}

export function CategoryPills({ categoryIds, categories, loading, disabled, onChange }: CategoryPillsProps) {
  const toggle = (id: string) => {
    const next = categoryIds.includes(id)
      ? categoryIds.filter(c => c !== id)
      : [...categoryIds, id]
    onChange(next)
  }

  if (loading) return (
    <div className='flex gap-1'>
      {[1, 2, 3].map(i => (
        <div key={i} className='h-5 w-16 rounded-full bg-neutral-800 animate-pulse' />
      ))}
    </div>
  )

  if (!categories.length) return (
    <p className='text-neutral-600 text-xs'>No categories available</p>
  )

  return (
    <div className='flex flex-wrap gap-1'>
      {categories.map(cat => {
        const active = categoryIds.includes(cat.id)
        return (
          <button
            key={cat.id}
            onClick={() => toggle(cat.id)}
            disabled={disabled}
            className={`px-2 py-0.5 rounded-full text-xs font-medium transition-all duration-150 disabled:opacity-50 ${
              active
                ? 'bg-green-400/20 text-green-300 border border-green-400/40'
                : 'bg-neutral-800 text-neutral-500 border border-neutral-700 hover:text-neutral-300'
            }`}
          >
            {cat.name}
          </button>
        )
      })}
    </div>
  )
}