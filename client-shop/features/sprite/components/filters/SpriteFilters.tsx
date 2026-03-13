"use client";

import { Search, ArrowDownUp, X } from "lucide-react";
import type { SpriteFilterRequest } from "@/features/sprite/types/sprite.types";
import type { CategoryResponse } from "@/features/category/types/category.types";

interface SpriteFiltersProps {
  filters: SpriteFilterRequest;
  categories: CategoryResponse[];
  onChange: (partial: Partial<SpriteFilterRequest>) => void;
}

export function SpriteFilters({ filters, categories, onChange }: SpriteFiltersProps) {
  const toggleCategory = (id: string) => {
    const ids = filters.categoryIds ?? [];
    onChange({
      categoryIds: ids.includes(id) ? ids.filter((c) => c !== id) : [...ids, id],
    });
  };

  const toggleSort = () => {
    onChange({ sortOrder: filters.sortOrder === "asc" ? "desc" : "asc" });
  };

  const clearKeyword = () => onChange({ keyword: "" });

  const activeCategories = filters.categoryIds?.length ?? 0;

  return (
    <div className="space-y-4">

      {/* Search + Sort row */}
      <div className="flex gap-3">

        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search relics..."
            value={filters.keyword ?? ""}
            onChange={(e) => onChange({ keyword: e.target.value })}
            className="w-full bg-neutral-900 border border-neutral-800 focus:border-green-400/50 rounded-xl pl-10 pr-9 py-2.5 text-sm text-neutral-200 placeholder-neutral-600 outline-none transition-colors duration-200"
          />
          {filters.keyword && (
            <button
              onClick={clearKeyword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-600 hover:text-neutral-300 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort toggle */}
        <button
          onClick={toggleSort}
          title={filters.sortOrder === "asc" ? "Oldest first" : "Newest first"}
          className="flex items-center gap-2 px-4 py-2.5 bg-neutral-900 border border-neutral-800 hover:border-green-400/40 rounded-xl text-sm text-neutral-400 hover:text-green-300 transition-all duration-200 whitespace-nowrap"
        >
          <ArrowDownUp className="w-4 h-4" />
          <span className="hidden sm:inline">
            {filters.sortOrder === "asc" ? "Oldest" : "Newest"}
          </span>
        </button>
      </div>

      {/* Category pills */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {/* All pill */}
          <button
            onClick={() => onChange({ categoryIds: [] })}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
              activeCategories === 0
                ? "bg-green-400/10 border-green-400/40 text-green-300"
                : "bg-neutral-900 border-neutral-800 text-neutral-500 hover:border-neutral-600 hover:text-neutral-300"
            }`}
          >
            All
          </button>

          {categories.map((cat) => {
            const active = (filters.categoryIds ?? []).includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                  active
                    ? "bg-green-400/10 border-green-400/40 text-green-300"
                    : "bg-neutral-900 border-neutral-800 text-neutral-500 hover:border-neutral-600 hover:text-neutral-300"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}