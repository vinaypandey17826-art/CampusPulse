import React from 'react';
import { Bookmark } from 'lucide-react';
import { useEvents } from '../../context/EventContext';

export function BookmarkButton({ eventId, className = '', size = 'md' }) {
  const { isEventBookmarked, toggleBookmark } = useEvents();
  const isBookmarked = isEventBookmarked(eventId);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(eventId);
  };

  const sizeClasses = {
    sm: 'p-1',
    md: 'p-1.5',
    lg: 'p-2',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className={`rounded-[2px] transition-colors border ${
        isBookmarked
          ? 'bg-white text-[#DC2626] border-[#DC2626]'
          : 'bg-white/95 text-[#111111] hover:text-[#1B3A8C] border-[#E2E2E2]'
      } ${sizeClasses[size] || sizeClasses.md} ${className}`}
      aria-label={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
      title={isBookmarked ? 'Remove bookmark' : 'Bookmark event'}
    >
      <Bookmark
        className={`${iconSizes[size] || iconSizes.md} ${
          isBookmarked ? 'fill-[#DC2626] text-[#DC2626]' : ''
        }`}
      />
    </button>
  );
}
