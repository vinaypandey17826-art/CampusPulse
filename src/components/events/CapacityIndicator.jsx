import React from 'react';
import { getCapacityStatus, calculateCapacityPercentage } from '../../utils/formatters';

export function CapacityIndicator({ registered = 0, capacity = 1, showBar = true }) {
  const status = getCapacityStatus(registered, capacity);
  const percentage = calculateCapacityPercentage(registered, capacity);

  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-slate-500">
          Capacity: <strong className="text-slate-800">{registered}</strong> / {capacity}
        </span>
        <span
          className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
            status.isFull
              ? 'bg-rose-100 text-rose-700'
              : percentage >= 85
              ? 'bg-amber-100 text-amber-850'
              : 'bg-emerald-50 text-emerald-700'
          }`}
        >
          {status.label}
        </span>
      </div>

      {showBar && (
        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              status.isFull
                ? 'bg-rose-500'
                : percentage >= 85
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
}
