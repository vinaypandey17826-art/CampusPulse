import React from 'react';
import { CATEGORIES } from '../../data/seedEvents';

export function CategoryFilter({ selectedCategory, onSelectCategory, eventCounts = {} }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none scroll-smooth py-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        const count = eventCounts[cat.id];

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-[2px] text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-colors border ${
              isSelected
                ? 'bg-[#1B3A8C] text-white border-[#1B3A8C]'
                : 'bg-white text-[#6B6B6B] border-[#E2E2E2] hover:border-[#111111] hover:text-[#111111]'
            }`}
          >
            <span>{cat.name}</span>
            {count !== undefined && (
              <span
                className={`px-1.5 py-0.2 rounded-[2px] text-[10px] ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-[#FAFAFA] text-[#6B6B6B] border border-[#E2E2E2]'
                }`}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
