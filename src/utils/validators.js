/**
 * Input validation utilities.
 */

export function validateEmail(email) {
  if (!email || typeof email !== 'string') return false;
  // Standard email regex
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email.trim());
}

export function validateStudentId(id) {
  if (!id || typeof id !== 'string') return false;
  return id.trim().length >= 3;
}

export function validateRegistrationForm(formData) {
  const errors = {};

  if (!formData.studentName?.trim()) {
    errors.studentName = 'Full name is required';
  } else if (formData.studentName.trim().length < 2) {
    errors.studentName = 'Name must be at least 2 characters';
  }

  if (!formData.studentEmail?.trim()) {
    errors.studentEmail = 'College email is required';
  } else if (!validateEmail(formData.studentEmail)) {
    errors.studentEmail = 'Please provide a valid email address';
  }

  if (!formData.studentId?.trim()) {
    errors.studentId = 'Student ID is required';
  } else if (!validateStudentId(formData.studentId)) {
    errors.studentId = 'Student ID must be at least 3 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateEventForm(formData) {
  const errors = {};

  if (!formData.title?.trim()) {
    errors.title = 'Event title is required';
  }

  if (!formData.category?.trim()) {
    errors.category = 'Category is required';
  }

  if (!formData.description?.trim()) {
    errors.description = 'Description is required';
  } else if (formData.description.trim().length < 15) {
    errors.description = 'Description must be at least 15 characters long';
  }

  if (!formData.venue?.trim()) {
    errors.venue = 'Venue/location is required';
  }

  if (!formData.startDate) {
    errors.startDate = 'Start date and time are required';
  }

  if (!formData.endDate) {
    errors.endDate = 'End date and time are required';
  } else if (formData.startDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
    errors.endDate = 'End date must be after the start date';
  }

  const capacityNum = Number(formData.capacity);
  if (!formData.capacity || isNaN(capacityNum) || capacityNum <= 0) {
    errors.capacity = 'Capacity must be a positive integer greater than 0';
  }

  if (!formData.organizerName?.trim()) {
    errors.organizerName = 'Organizer name is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
