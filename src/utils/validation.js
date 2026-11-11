/**
 * Input validation utilities for forms.
 */

export function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  // RFC 5322 compliant regex for standard email addresses
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}

export function validateRegistrationForm({ studentName, studentEmail, eventId }) {
  const errors = {};

  if (!studentName || typeof studentName !== 'string' || !studentName.trim()) {
    errors.studentName = 'Full name is required';
  } else if (studentName.trim().length < 2) {
    errors.studentName = 'Name must be at least 2 characters long';
  }

  if (!studentEmail || typeof studentEmail !== 'string' || !studentEmail.trim()) {
    errors.studentEmail = 'Email address is required';
  } else if (!validateEmail(studentEmail)) {
    errors.studentEmail = 'Please provide a valid email address (e.g., student@campus.edu)';
  }

  if (!eventId || typeof eventId !== 'string' || !eventId.trim()) {
    errors.eventId = 'Please select an event to register for';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export default {
  validateEmail,
  validateRegistrationForm,
};
