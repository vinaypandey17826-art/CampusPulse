import React from 'react';
import { ArrowDownAZ, ArrowUp10, Calendar } from 'lucide-react';

export function DateSortDropdown({ sortBy, onSortChange }) {
  return (
    <div className="relative inline-block text-left">
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="appearance-none bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-3.5 py-2.5 pr-8 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 shadow-sm cursor-pointer"
      >
        <option value="date-asc">Date: Soonest First</option>
        <option value="date-desc">Date: Furthest First</option>
        <option value="popular">Most Popular (High Capacity)</option>
        <option value="title-asc">Title: A to Z</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
        <Calendar className="w-3.5 h-3.5" />
      </div>
    </div>
  );
}
