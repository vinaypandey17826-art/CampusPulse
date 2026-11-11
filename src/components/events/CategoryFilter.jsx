import React from 'react';
import { CATEGORIES } from '../../data/seedEvents';

export function CategoryFilter({ selectedCategory, onSelectCategory, eventCounts = {} }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none scroll-smooth py-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat.id;
        const count = eventCounts[cat.id];

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory(cat.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 border ${
              isSelected
                ? 'bg-brand-600 text-white border-brand-600 shadow-sm shadow-brand-500/25 scale-[1.02]'
                : 'bg-white text-slate-600 border-slate-200/90 hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <span>{cat.name}</span>
            {count !== undefined && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
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
