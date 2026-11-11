import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useEvents } from '../../context/EventContext';
import { validateRegistrationForm } from '../../utils/validation';
import { formatDateRange } from '../../utils/formatters';
import { Calendar, MapPin, User, Mail, Tag, CheckCircle } from 'lucide-react';

export function RegistrationModal({
  isOpen,
  onClose,
  event = null,
  onRegistrationSuccess,
}) {
  const { currentUser } = useAuth();
  const { events } = useEvents();

  const [formData, setFormData] = useState({
    studentName: '',
    studentEmail: '',
    eventId: event?.id || '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormData({
        studentName: '',
        studentEmail: '',
        eventId: event?.id || '',
      });
      setErrors({});
      setServerError('');
    }
  }, [isOpen, event]);

  const selectedEvent = events.find((e) => e.id === formData.eventId) || event;

  const handleAutofill = () => {
    setFormData((prev) => ({
      ...prev,
      studentName: currentUser.name,
      studentEmail: currentUser.email,
      eventId: prev.eventId || event?.id || (events[0]?.id || ''),
    }));
    setErrors({});
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    // Phase 2: Validate using utils/validation.js
    const validation = validateRegistrationForm({
      studentName: formData.studentName,
      studentEmail: formData.studentEmail,
      eventId: formData.eventId,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      if (onRegistrationSuccess) {
        await onRegistrationSuccess(formData.eventId, {
          studentName: formData.studentName,
          studentEmail: formData.studentEmail,
          studentId: currentUser.studentId || 'STU-' + Math.floor(1000 + Math.random() * 9000),
        });
      }
      onClose();
    } catch (err) {
      setServerError(err.message || 'Failed to complete registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register for Event"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Event Quick Summary (if event selected) */}
        {selectedEvent && (
          <div className="p-4 rounded-[2px] bg-[#FAFAFA] border border-[#E2E2E2] space-y-2">
            <h4 className="font-heading font-medium text-univ-text text-sm leading-tight">
              {selectedEvent.title}
            </h4>
            <div className="text-xs text-univ-muted space-y-1">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#1B3A8C] shrink-0" />
                <span>{formatDateRange(selectedEvent.startDate, selectedEvent.endDate)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#1B3A8C] shrink-0" />
                <span>{selectedEvent.venue}</span>
              </div>
            </div>
          </div>
        )}

        {/* Demo 1-Click Autofill pill */}
        <div className="flex items-center justify-between text-xs bg-[#FAFAFA] p-2.5 rounded-[2px] border border-[#E2E2E2]">
          <span className="text-univ-muted">Testing as Student?</span>
          <button
            type="button"
            onClick={handleAutofill}
            className="inline-flex items-center gap-1 text-xs font-mono font-medium text-[#1B3A8C] hover:underline transition-colors"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Autofill Profile</span>
          </button>
        </div>

        {serverError && (
          <div className="p-3 text-xs rounded-[2px] bg-red-50 border border-red-200 text-[#DC2626] font-mono">
            {serverError}
          </div>
        )}

        {/* Form Inputs */}
        <div className="space-y-4">
          {/* Event Selection Dropdown */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-univ-text mb-1.5">
              Select Event *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-univ-muted">
                <Tag className="w-4 h-4" />
              </div>
              <select
                value={formData.eventId}
                onChange={(e) => {
                  setFormData({ ...formData, eventId: e.target.value });
                  if (errors.eventId) setErrors({ ...errors, eventId: undefined });
                }}
                className={`w-full pl-9 pr-3 py-2 text-sm bg-white rounded-[2px] border ${
                  errors.eventId
                    ? 'border-[#DC2626] focus:border-[#DC2626]'
                    : 'border-[#E2E2E2] focus:border-[#1B3A8C]'
                } text-univ-text focus:outline-none transition-all cursor-pointer`}
              >
                <option value="">-- Choose an event --</option>
                {events.map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    {evt.title} ({evt.category})
                  </option>
                ))}
              </select>
            </div>
            {errors.eventId && (
              <p className="mt-1 text-xs text-[#DC2626] font-mono">{errors.eventId}</p>
            )}
          </div>

          {/* Student Name */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-univ-text mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-univ-muted">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={formData.studentName}
                onChange={(e) => {
                  setFormData({ ...formData, studentName: e.target.value });
                  if (errors.studentName) setErrors({ ...errors, studentName: undefined });
                }}
                placeholder="e.g. Alex Rivera"
                className={`w-full pl-9 pr-3 py-2 text-sm bg-white rounded-[2px] border ${
                  errors.studentName
                    ? 'border-[#DC2626] focus:border-[#DC2626]'
                    : 'border-[#E2E2E2] focus:border-[#1B3A8C]'
                } text-univ-text placeholder:text-univ-muted/60 focus:outline-none transition-all`}
              />
            </div>
            {errors.studentName && (
              <p className="mt-1 text-xs text-[#DC2626] font-mono">{errors.studentName}</p>
            )}
          </div>

          {/* College Email */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-univ-text mb-1.5">
              College Email *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-univ-muted">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={formData.studentEmail}
                onChange={(e) => {
                  setFormData({ ...formData, studentEmail: e.target.value });
                  if (errors.studentEmail) setErrors({ ...errors, studentEmail: undefined });
                }}
                placeholder="e.g. alex.rivera@abes.ac.in"
                className={`w-full pl-9 pr-3 py-2 text-sm bg-white rounded-[2px] border ${
                  errors.studentEmail
                    ? 'border-[#DC2626] focus:border-[#DC2626]'
                    : 'border-[#E2E2E2] focus:border-[#1B3A8C]'
                } text-univ-text placeholder:text-univ-muted/60 focus:outline-none transition-all`}
              />
            </div>
            {errors.studentEmail && (
              <p className="mt-1 text-xs text-[#DC2626] font-mono">{errors.studentEmail}</p>
            )}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E2E2]">
          <Button variant="outline" size="md" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
          >
            Confirm Registration
          </Button>
        </div>
      </form>
    </Modal>
  );
}
