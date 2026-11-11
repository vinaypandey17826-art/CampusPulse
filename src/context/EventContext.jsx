import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { eventService } from '../services/eventService';
import { registrationService } from '../services/registrationService';
import { bookmarkService } from '../services/bookmarkService';
import { useToast } from './ToastContext';

const EventContext = createContext();

export function EventProvider({ children }) {
  const { showToast } = useToast();
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initialize and load all state from service
  const reloadData = useCallback(() => {
    try {
      const loadedEvents = eventService.getAllEvents();
      const loadedRegs = registrationService.getAllRegistrations();
      const loadedBookmarks = bookmarkService.getBookmarkedIds();

      setEvents(loadedEvents);
      setRegistrations(loadedRegs);
      setBookmarkedIds(loadedBookmarks);
    } catch (err) {
      console.error('Failed to load initial event data:', err);
      showToast('Error loading event data', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    reloadData();
  }, [reloadData]);

  // Event CRUD actions
  const createEvent = useCallback((eventData) => {
    try {
      const created = eventService.createEvent(eventData);
      setEvents((prev) => [created, ...prev]);
      showToast(`Event "${created.title}" created successfully!`, 'success');
      return created;
    } catch (err) {
      showToast(err.message || 'Failed to create event', 'error');
      throw err;
    }
  }, [showToast]);

  const updateEvent = useCallback((id, updatedFields) => {
    try {
      const updated = eventService.updateEvent(id, updatedFields);
      setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));
      showToast('Event details updated successfully!', 'success');
      return updated;
    } catch (err) {
      showToast(err.message || 'Failed to update event', 'error');
      throw err;
    }
  }, [showToast]);

  const deleteEvent = useCallback((id) => {
    try {
      const target = events.find((e) => e.id === id);
      eventService.deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      // Remove any registrations or bookmarks for this deleted event
      setBookmarkedIds((prev) => {
        const next = prev.filter((bId) => bId !== id);
        bookmarkService.removeBookmark(id);
        return next;
      });
      showToast(`Deleted "${target?.title || 'Event'}"`, 'info');
      return true;
    } catch (err) {
      showToast(err.message || 'Failed to delete event', 'error');
      throw err;
    }
  }, [events, showToast]);

  // Bookmarking
  const toggleBookmark = useCallback((eventId) => {
    const isNowBookmarked = bookmarkService.toggleBookmark(eventId);
    setBookmarkedIds((prev) =>
      isNowBookmarked ? [...prev, eventId] : prev.filter((id) => id !== eventId)
    );
    showToast(
      isNowBookmarked ? 'Event added to your bookmarks' : 'Event removed from bookmarks',
      'info'
    );
    return isNowBookmarked;
  }, [showToast]);

  const isEventBookmarked = useCallback((eventId) => {
    return bookmarkedIds.includes(eventId);
  }, [bookmarkedIds]);

  // Registrations
  const registerForEvent = useCallback((eventId, studentData) => {
    try {
      const newRegistration = registrationService.register(eventId, studentData);
      setRegistrations((prev) => [...prev, newRegistration]);
      // Update local event registered count
      setEvents((prev) =>
        prev.map((e) =>
          e.id === eventId ? { ...e, registeredCount: e.registeredCount + 1 } : e
        )
      );
      showToast(`Registration confirmed! Your pass is ready.`, 'success');
      return newRegistration;
    } catch (err) {
      showToast(err.message || 'Failed to register', 'error');
      throw err;
    }
  }, [showToast]);

  const cancelRegistration = useCallback((registrationId) => {
    try {
      const target = registrations.find((r) => r.id === registrationId);
      registrationService.cancelRegistration(registrationId);
      setRegistrations((prev) => prev.filter((r) => r.id !== registrationId));
      if (target) {
        setEvents((prev) =>
          prev.map((e) =>
            e.id === target.eventId
              ? { ...e, registeredCount: Math.max(0, e.registeredCount - 1) }
              : e
          )
        );
      }
      showToast('Registration has been cancelled.', 'info');
      return true;
    } catch (err) {
      showToast(err.message || 'Failed to cancel registration', 'error');
      throw err;
    }
  }, [registrations, showToast]);

  const resetAllData = useCallback(() => {
    eventService.resetToDefaults();
    bookmarkService.clearAllBookmarks?.() || localStorage.removeItem('campusconnect_bookmarks_v1');
    localStorage.removeItem('campusconnect_registrations_v1');
    reloadData();
    showToast('Reset application to original demo seed events!', 'success');
  }, [reloadData, showToast]);

  const value = {
    events,
    loading,
    registrations,
    bookmarkedIds,
    createEvent,
    updateEvent,
    deleteEvent,
    toggleBookmark,
    isEventBookmarked,
    registerForEvent,
    cancelRegistration,
    resetAllData,
    reloadData,
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
}

export function useEvents() {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}
