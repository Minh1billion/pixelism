interface RelicCategoriesProps {
  categoryNames: string[];
  categoryIds?: string[];
}

export function RelicCategories({ categoryNames, categoryIds }: RelicCategoriesProps) {
  if (!categoryNames?.length) return null;

  return (
    <div>
      <p className="text-xs text-neutral-600 tracking-[0.15em] uppercase mb-3">
        Categories
      </p>
      <div className="flex flex-wrap gap-2">
        {categoryNames.map((name, i) => (
          <span
            key={categoryIds?.[i] ?? name}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-green-400/10 border border-green-400/30 text-green-300"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}