/**
 * Formatting utilities for dates, times, currency, and capacity.
 */

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export function formatTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

export function formatDateTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

export function formatDateRange(startDate, endDate) {
  if (!startDate) return '';
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;

  if (!end || isNaN(end.getTime())) {
    return formatDateTime(startDate);
  }

  const isSameDay = start.toDateString() === end.toDateString();

  if (isSameDay) {
    return `${formatDate(startDate)} • ${formatTime(startDate)} - ${formatTime(endDate)}`;
  }

  return `${formatDate(startDate)} ${formatTime(startDate)} - ${formatDate(endDate)} ${formatTime(endDate)}`;
}

export function calculateCapacityPercentage(registered = 0, capacity = 1) {
  if (!capacity || capacity <= 0) return 100;
  return Math.min(100, Math.round((registered / capacity) * 100));
}

export function getCapacityStatus(registered = 0, capacity = 1) {
  const remaining = Math.max(0, capacity - registered);
  const percentage = calculateCapacityPercentage(registered, capacity);

  if (remaining === 0) {
    return {
      label: 'Sold Out',
      color: 'red',
      bg: 'bg-red-50 text-red-700 border-red-200',
      badge: 'bg-red-100 text-red-800',
      remaining: 0,
      isFull: true,
    };
  }

  if (percentage >= 85) {
    return {
      label: `${remaining} spot${remaining === 1 ? '' : 's'} left!`,
      color: 'amber',
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      badge: 'bg-amber-100 text-amber-800',
      remaining,
      isFull: false,
    };
  }

  return {
    label: `${remaining} spot${remaining === 1 ? '' : 's'} remaining`,
    color: 'emerald',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-800',
    remaining,
    isFull: false,
  };
}

export function generateTicketCode(prefix = 'CC') {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomStr = '';
  for (let i = 0; i < 6; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}-${randomStr}`;
}
