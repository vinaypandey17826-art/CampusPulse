import React from 'react';
import { EventCard } from './EventCard';
import { EmptyState } from '../common/EmptyState';
import { Search } from 'lucide-react';

export function EventGrid({
  events = [],
  onRegisterClick,
  onClearFilters,
  searchQuery = '',
  selectedCategory = 'all',
}) {
  if (events.length === 0) {
    const hasSearch = searchQuery.trim().length > 0;
    const hasCategory = selectedCategory && selectedCategory !== 'all';

    let title = "No events found.";
    let description = "No events found. Try a different search or category.";

    if (hasSearch && hasCategory) {
      title = `No events found.`;
      description = `No events found matching "${searchQuery}" in ${selectedCategory}. Try a different search or category.`;
    } else if (hasSearch) {
      title = `No events found.`;
      description = `No events found matching "${searchQuery}". Try a different search or category.`;
    } else if (hasCategory) {
      title = `No events found.`;
      description = `No events found in ${selectedCategory}. Try a different search or category.`;
    }

    return (
      <EmptyState
        title={title}
        description={description}
        icon={Search}
        actionLabel={onClearFilters ? "Clear All Filters" : undefined}
        onAction={onClearFilters}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          onRegisterClick={onRegisterClick}
        />
      ))}
    </div>
  );
}
