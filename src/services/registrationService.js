import { STORAGE_KEYS } from './storageKeys';
import { storageService } from './storageService';
import { eventService } from './eventService';
import { generateTicketCode } from '../utils/formatters';

export const registrationService = {
  /**
   * Get all registered tickets.
   */
  getAllRegistrations() {
    return storageService.get(STORAGE_KEYS.REGISTRATIONS, []);
  },

  /**
   * Get registrations for a specific event.
   */
  getRegistrationsForEvent(eventId) {
    const list = this.getAllRegistrations();
    return list.filter((r) => r.eventId === eventId);
  },

  /**
   * Check if a student is already registered for this event.
   */
  isUserRegistered(eventId, email, studentId) {
    const list = this.getAllRegistrations();
    const cleanEmail = email?.trim().toLowerCase();
    const cleanId = studentId?.trim().toLowerCase();

    return list.some(
      (r) =>
        r.eventId === eventId &&
        r.status !== 'cancelled' &&
        (r.studentEmail.toLowerCase() === cleanEmail || r.studentId.toLowerCase() === cleanId)
    );
  },

  /**
   * Register a student for an event.
   */
  register(eventId, studentData) {
    const event = eventService.getEventById(eventId);
    if (!event) {
      throw new Error('Event not found.');
    }

    if (event.registeredCount >= event.capacity) {
      throw new Error('Sorry, this event has reached maximum capacity.');
    }

    const { studentName, studentEmail, studentId } = studentData;

    if (this.isUserRegistered(eventId, studentEmail, studentId)) {
      throw new Error('You are already registered for this event with this email or student ID.');
    }

    const registrations = this.getAllRegistrations();
    const ticketCode = generateTicketCode(event.title.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'CC') || 'CC');

    const newRegistration = {
      id: `reg-${Date.now()}`,
      eventId,
      eventTitle: event.title,
      eventCategory: event.category,
      eventVenue: event.venue,
      eventStartDate: event.startDate,
      eventBannerUrl: event.bannerUrl,
      studentName: studentName.trim(),
      studentEmail: studentEmail.trim().toLowerCase(),
      studentId: studentId.trim().toUpperCase(),
      ticketCode,
      status: 'confirmed',
      registeredAt: new Date().toISOString(),
    };

    // Save registration
    registrations.push(newRegistration);
    storageService.set(STORAGE_KEYS.REGISTRATIONS, registrations);

    // Increment event registration counter
    eventService.updateEvent(eventId, {
      registeredCount: event.registeredCount + 1,
    });

    return newRegistration;
  },

  /**
   * Cancel an existing registration.
   */
  cancelRegistration(registrationId) {
    const registrations = this.getAllRegistrations();
    const index = registrations.findIndex((r) => r.id === registrationId);

    if (index === -1) {
      throw new Error('Registration record not found.');
    }

    const registration = registrations[index];
    const event = eventService.getEventById(registration.eventId);

    // Remove registration
    registrations.splice(index, 1);
    storageService.set(STORAGE_KEYS.REGISTRATIONS, registrations);

    // Decrement event counter if event still exists
    if (event && event.registeredCount > 0) {
      eventService.updateEvent(event.id, {
        registeredCount: Math.max(0, event.registeredCount - 1),
      });
    }

    return true;
  },
};
