import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { useEvents } from '../../context/EventContext';
import { validateRegistrationForm } from '../../utils/validation';
import { formatDateRange } from '../../utils/formatters';
import { Sparkles, Calendar, MapPin, User, Mail, Tag } from 'lucide-react';

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
          <div className="p-4 rounded-2xl bg-brand-50/60 border border-brand-100 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm leading-tight">
              {selectedEvent.title}
            </h4>
            <div className="text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                <span>{formatDateRange(selectedEvent.startDate, selectedEvent.endDate)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                <span>{selectedEvent.venue}</span>
              </div>
            </div>
          </div>
        )}

        {/* Demo 1-Click Autofill pill */}
        <div className="flex items-center justify-between text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
          <span className="text-slate-500 font-medium">Testing as Student?</span>
          <button
            type="button"
            onClick={handleAutofill}
            className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-800 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autofill Student Profile</span>
          </button>
        </div>

        {serverError && (
          <div className="p-3 text-xs rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-medium">
            {serverError}
          </div>
        )}

        {/* Form Inputs */}
        <div className="space-y-4">
          {/* Event Selection Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Event *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Tag className="w-4 h-4" />
              </div>
              <select
                value={formData.eventId}
                onChange={(e) => {
                  setFormData({ ...formData, eventId: e.target.value });
                  if (errors.eventId) setErrors({ ...errors, eventId: undefined });
                }}
                className={`w-full pl-9 pr-3 py-2 text-sm bg-white rounded-xl border ${
                  errors.eventId
                    ? 'border-rose-400 ring-1 ring-rose-200'
                    : 'border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
                } transition-all cursor-pointer`}
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
              <p className="mt-1 text-xs text-rose-600">{errors.eventId}</p>
            )}
          </div>

          {/* Student Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
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
                className={`w-full pl-9 pr-3 py-2 text-sm bg-white rounded-xl border ${
                  errors.studentName
                    ? 'border-rose-400 ring-1 ring-rose-200'
                    : 'border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
                } transition-all`}
              />
            </div>
            {errors.studentName && (
              <p className="mt-1 text-xs text-rose-600">{errors.studentName}</p>
            )}
          </div>

          {/* College Email */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={formData.studentEmail}
                onChange={(e) => {
                  setFormData({ ...formData, studentEmail: e.target.value });
                  if (errors.studentEmail) setErrors({ ...errors, studentEmail: undefined });
                }}
                placeholder="e.g. alex.rivera@campus.edu"
                className={`w-full pl-9 pr-3 py-2 text-sm bg-white rounded-xl border ${
                  errors.studentEmail
                    ? 'border-rose-400 ring-1 ring-rose-200'
                    : 'border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
                } transition-all`}
              />
            </div>
            {errors.studentEmail && (
              <p className="mt-1 text-xs text-rose-600">{errors.studentEmail}</p>
            )}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
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
