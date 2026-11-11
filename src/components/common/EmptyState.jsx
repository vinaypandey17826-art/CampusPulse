import React from 'react';
import { CalendarX } from 'lucide-react';
import { Button } from './Button';

export function EmptyState({
  title = 'No events found.',
  description = 'No events found. Try a different search or category.',
  icon: Icon = CalendarX,
  actionLabel,
  onAction,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white rounded-[2px] border border-[#E2E2E2] max-w-lg mx-auto my-8">
      <div className="w-12 h-12 rounded-[2px] bg-[#FAFAFA] flex items-center justify-center text-[#6B6B6B] mb-3 border border-[#E2E2E2]">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="font-heading text-base font-bold text-[#111111] mb-1 uppercase tracking-tight">{title}</h3>
      <p className="text-xs text-[#6B6B6B] max-w-sm mb-5 leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
