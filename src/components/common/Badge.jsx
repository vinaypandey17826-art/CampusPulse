import React from 'react';

export function Badge({ children, category, variant = 'default', className = '' }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider border border-[#E2E2E2] bg-white text-[#111111] rounded-[2px] ${className}`}
    >
      {children}
    </span>
  );
}
