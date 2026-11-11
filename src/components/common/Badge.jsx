import React from 'react';

const CATEGORY_STYLES = {
  technical: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
  cultural: 'bg-pink-50 text-pink-700 border-pink-200/80',
  sports: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
  academic: 'bg-blue-50 text-blue-700 border-blue-200/80',
  workshop: 'bg-amber-50 text-amber-700 border-amber-200/80',
  workshops: 'bg-amber-50 text-amber-700 border-amber-200/80',
  default: 'bg-slate-100 text-slate-700 border-slate-200',
};

export function Badge({ children, category, variant = 'default', className = '' }) {
  const style = category
    ? CATEGORY_STYLES[category.toLowerCase()] || CATEGORY_STYLES.default
    : CATEGORY_STYLES[variant] || CATEGORY_STYLES.default;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${style} ${className}`}
    >
      {children}
    </span>
  );
}
