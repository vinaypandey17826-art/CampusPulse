import React from 'react';
import { ChevronDown } from 'lucide-react';

export function DateSortDropdown({ sortBy, onSortChange }) {
  return (
    <div className="relative inline-block text-left">
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="appearance-none bg-white border border-[#E2E2E2] text-[#111111] text-xs font-bold uppercase tracking-wider rounded-[2px] px-3.5 py-2.5 pr-8 hover:border-[#111111] focus:outline-none focus:border-[#1B3A8C] cursor-pointer"
      >
        <option value="date-asc">Date: Soonest First</option>
        <option value="date-desc">Date: Furthest First</option>
        <option value="popular">Most Popular</option>
        <option value="title-asc">Title: A to Z</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-[#6B6B6B]">
        <ChevronDown className="w-3.5 h-3.5" />
      </div>
    </div>
  );
}
