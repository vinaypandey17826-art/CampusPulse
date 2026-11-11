import React from 'react';
import { EventGrid } from '../events/EventGrid';
import { EmptyState } from '../common/EmptyState';
import { Bookmark } from 'lucide-react';

export function BookmarkedEventsList({
  events = [],
  onRegisterClick,
}) {
  if (events.length === 0) {
    return (
      <EmptyState
        title="No Saved Events"
        description="Click the bookmark icon on any event card to save events you want to attend later."
        icon={Bookmark}
        actionLabel="Browse Events"
        onAction={() => window.location.assign('/events')}
      />
    );
  }

  return (
    <EventGrid
      events={events}
      onRegisterClick={onRegisterClick}
    />
  );
}
