import { STORAGE_KEYS } from './storageKeys';
import { storageService } from './storageService';
import { INITIAL_EVENTS } from '../data/seedEvents';

export const eventService = {
  /**
   * Retrieves all events from storage.
   * Auto-populates seed events on first run.
   */
  getAllEvents() {
    let events = storageService.get(STORAGE_KEYS.EVENTS, null);
    if (!events || !Array.isArray(events) || events.length === 0) {
      events = [...INITIAL_EVENTS];
      storageService.set(STORAGE_KEYS.EVENTS, events);
    }
    return events;
  },

  /**
   * Fetch single event by ID.
   */
  getEventById(id) {
    const events = this.getAllEvents();
    return events.find((evt) => evt.id === id) || null;
  },

  /**
   * Create and persist a new event.
   */
  createEvent(eventData) {
    const events = this.getAllEvents();
    const newEvent = {
      id: `evt-${Date.now()}`,
      title: eventData.title.trim(),
      category: eventData.category,
      description: eventData.description.trim(),
      shortDescription: eventData.shortDescription?.trim() || eventData.description.trim().slice(0, 120) + '...',
      venue: eventData.venue.trim(),
      startDate: eventData.startDate,
      endDate: eventData.endDate,
      capacity: Number(eventData.capacity) || 50,
      registeredCount: 0,
      bannerUrl: eventData.bannerUrl?.trim() || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
      organizerName: eventData.organizerName.trim(),
      organizerContact: eventData.organizerContact?.trim() || 'events@campus.edu',
      agenda: eventData.agenda || [
        { time: 'TBA', title: 'Schedule will be announced shortly' },
      ],
      status: 'upcoming',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const updatedList = [newEvent, ...events];
    storageService.set(STORAGE_KEYS.EVENTS, updatedList);
    return newEvent;
  },

  /**
   * Update existing event by ID.
   */
  updateEvent(id, updatedFields) {
    const events = this.getAllEvents();
    const index = events.findIndex((e) => e.id === id);

    if (index === -1) {
      throw new Error(`Event with ID "${id}" was not found.`);
    }

    const currentEvent = events[index];
    const updatedEvent = {
      ...currentEvent,
      ...updatedFields,
      // Ensure capacity is a valid number and doesn't fall below current registrations
      capacity: updatedFields.capacity !== undefined ? Math.max(Number(updatedFields.capacity), currentEvent.registeredCount) : currentEvent.capacity,
      updatedAt: new Date().toISOString(),
    };

    events[index] = updatedEvent;
    storageService.set(STORAGE_KEYS.EVENTS, events);
    return updatedEvent;
  },

  /**
   * Delete an event by ID.
   */
  deleteEvent(id) {
    const events = this.getAllEvents();
    const filtered = events.filter((e) => e.id !== id);
    storageService.set(STORAGE_KEYS.EVENTS, filtered);
    return true;
  },

  /**
   * Reset data back to default initial seed events.
   */
  resetToDefaults() {
    storageService.set(STORAGE_KEYS.EVENTS, [...INITIAL_EVENTS]);
    return [...INITIAL_EVENTS];
  },
};
