import React from 'react';
import { calculateCapacityPercentage } from '../../utils/formatters';

export function CapacityIndicator({ registered = 0, capacity = 1, showBar = true }) {
  const percentage = calculateCapacityPercentage(registered, capacity);
  const remaining = Math.max(0, capacity - registered);
  const isFull = remaining === 0;
  // Under 20% spots remaining trigger muted red warning
  const isUrgent = !isFull && (remaining / capacity <= 0.2 || percentage >= 80);

  return (
    <div className="w-full space-y-1">
      <div className="flex items-center justify-between text-[11px] font-medium text-[#6B6B6B]">
        <span>
          Cap: <strong className="text-[#111111]">{registered}</strong>/{capacity}
        </span>
        <span
          className={`font-semibold ${
            isFull || isUrgent ? 'text-[#DC2626]' : 'text-[#6B6B6B]'
          }`}
        >
          {isFull
            ? 'Sold Out'
            : isUrgent
            ? `${remaining} spot${remaining === 1 ? '' : 's'} left`
            : `${remaining} spots remaining`}
        </span>
      </div>

      {showBar && (
        <div className="w-full bg-[#E2E2E2] h-1 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isFull || isUrgent ? 'bg-[#DC2626]' : 'bg-[#1B3A8C]'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
}
