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
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className={`rounded-full transition-all duration-150 backdrop-blur-md shadow-md ${
        isBookmarked
          ? 'bg-rose-50 text-rose-600 hover:bg-rose-100'
          : 'bg-white/80 text-slate-700 hover:bg-white hover:text-slate-900'
      } ${sizeClasses[size] || sizeClasses.md} ${className}`}
      aria-label={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
      title={isBookmarked ? 'Remove bookmark' : 'Bookmark event'}
    >
      <Bookmark
        className={`${iconSizes[size] || iconSizes.md} transition-transform active:scale-75 ${
          isBookmarked ? 'fill-rose-600 text-rose-600' : ''
        }`}
      />
    </button>
  );
}
