"use client";

import { useState } from "react";
import { ArrowDownUp, X, SlidersHorizontal } from "lucide-react";
import type { SpriteFilterRequest } from "@/features/sprite/types/sprite.types";
import type { CategoryResponse } from "@/features/category/types/category.types";

interface MobileFiltersProps {
  filters: SpriteFilterRequest;
  categories: CategoryResponse[];
  onChange: (partial: Partial<SpriteFilterRequest>) => void;
}

export function MobileSpriteFilters({ filters, categories, onChange }: MobileFiltersProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleCategory = (id: string) => {
    const ids = filters.categoryIds ?? [];
    onChange({
      categoryIds: ids.includes(id) ? ids.filter((c) => c !== id) : [...ids, id],
    });
  };

  const activeCategories = filters.categoryIds?.length ?? 0;
  const activeCount = activeCategories + (filters.sortOrder ? 1 : 0);

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setDrawerOpen(true)}
        className="relative flex items-center gap-2 px-3 py-2.5 bg-neutral-900 border border-neutral-800 hover:border-green-400/40 rounded-xl text-neutral-400 hover:text-green-300 transition-all duration-200"
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span className="text-sm">Filters</span>
        {activeCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-green-400 text-neutral-950 text-[10px] font-bold flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {/* Backdrop */}
      <div
        onClick={() => setDrawerOpen(false)}
        className={`fixed inset-0 z-40 bg-neutral-950/70 backdrop-blur-sm transition-opacity duration-300 ${
          drawerOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Bottom sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 bg-neutral-900 border-t border-neutral-800 rounded-t-2xl transition-transform duration-300 ease-out ${
          drawerOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-neutral-700" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-800">
          <span className="font-bold text-neutral-100">Filters</span>
          <button
            onClick={() => setDrawerOpen(false)}
            className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="px-5 py-5 space-y-6 overflow-y-auto max-h-[60dvh]">

          {/* Sort */}
          <div>
            <p className="text-xs text-neutral-600 tracking-[0.15em] uppercase mb-3">
              Sort by
            </p>
            <div className="flex gap-2">
              {(["desc", "asc"] as const).map((order) => (
                <button
                  key={order}
                  onClick={() => onChange({ sortOrder: order })}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${
                    (filters.sortOrder ?? "desc") === order
                      ? "bg-green-400/10 border-green-400/40 text-green-300"
                      : "bg-neutral-800 border-neutral-700 text-neutral-400"
                  }`}
                >
                  <ArrowDownUp className="w-3.5 h-3.5" />
                  {order === "desc" ? "Newest" : "Oldest"}
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div>
              <p className="text-xs text-neutral-600 tracking-[0.15em] uppercase mb-3">
                Categories
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onChange({ categoryIds: [] })}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                    activeCategories === 0
                      ? "bg-green-400/10 border-green-400/40 text-green-300"
                      : "bg-neutral-800 border-neutral-700 text-neutral-500"
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
                          : "bg-neutral-800 border-neutral-700 text-neutral-500"
                      }`}
                    >
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Apply CTA */}
        <div className="px-5 py-4 border-t border-neutral-800">
          <button
            onClick={() => setDrawerOpen(false)}
            className="w-full py-3 bg-green-400 text-neutral-950 font-bold rounded-xl hover:bg-green-300 transition-colors duration-200"
          >
            Apply Filters
            {activeCount > 0 && (
              <span className="ml-2 bg-neutral-950/20 px-2 py-0.5 rounded-full text-xs">
                {activeCount} active
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
}