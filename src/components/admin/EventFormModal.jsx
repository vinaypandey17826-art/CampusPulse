import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { validateEventForm } from '../../utils/validators';
import { CATEGORIES } from '../../data/seedEvents';
import { Image, Calendar, MapPin, Users, Tag, FileText, User } from 'lucide-react';

const SAMPLE_IMAGE_OPTIONS = [
  { label: 'Hackathon / Tech', url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Concert / Cultural', url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Sports Arena', url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Keynote / Auditorium', url: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?auto=format&fit=crop&w=1200&q=80' },
  { label: 'Lab / Workshop', url: 'https://images.unsplash.com/photo-1581291518655-9523c932edcf?auto=format&fit=crop&w=1200&q=80' },
];

export function EventFormModal({
  isOpen,
  onClose,
  initialData = null,
  onSubmit,
}) {
  const isEditing = Boolean(initialData);

  const [formData, setFormData] = useState({
    title: '',
    category: 'technical',
    description: '',
    shortDescription: '',
    venue: '',
    startDate: '',
    endDate: '',
    capacity: 50,
    bannerUrl: SAMPLE_IMAGE_OPTIONS[0].url,
    organizerName: '',
    organizerContact: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        category: initialData.category || 'technical',
        description: initialData.description || '',
        shortDescription: initialData.shortDescription || '',
        venue: initialData.venue || '',
        startDate: initialData.startDate ? initialData.startDate.slice(0, 16) : '',
        endDate: initialData.endDate ? initialData.endDate.slice(0, 16) : '',
        capacity: initialData.capacity || 50,
        bannerUrl: initialData.bannerUrl || SAMPLE_IMAGE_OPTIONS[0].url,
        organizerName: initialData.organizerName || '',
        organizerContact: initialData.organizerContact || '',
      });
    } else {
      // Default dates for new event (e.g. tomorrow)
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const tomorrowEnd = new Date(tomorrow.getTime() + 4 * 60 * 60 * 1000);

      setFormData({
        title: '',
        category: 'technical',
        description: '',
        shortDescription: '',
        venue: '',
        startDate: tomorrow.toISOString().slice(0, 16),
        endDate: tomorrowEnd.toISOString().slice(0, 16),
        capacity: 50,
        bannerUrl: SAMPLE_IMAGE_OPTIONS[0].url,
        organizerName: '',
        organizerContact: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateEventForm(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Event Details' : 'Create New Campus Event'}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Event Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Spring Robotics Showcase 2026"
            className={`w-full px-3.5 py-2.5 text-sm bg-white rounded-xl border ${
              errors.title
                ? 'border-rose-400 ring-1 ring-rose-200'
                : 'border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
            } transition-all`}
          />
          {errors.title && <p className="mt-1 text-xs text-rose-600">{errors.title}</p>}
        </div>

        {/* Category & Capacity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-white rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all cursor-pointer capitalize"
            >
              {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Maximum Capacity (Seats) *
            </label>
            <input
              type="number"
              min={initialData ? initialData.registeredCount : 1}
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              className={`w-full px-3.5 py-2.5 text-sm bg-white rounded-xl border ${
                errors.capacity
                  ? 'border-rose-400 ring-1 ring-rose-200'
                  : 'border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
              } transition-all`}
            />
            {errors.capacity && <p className="mt-1 text-xs text-rose-600">{errors.capacity}</p>}
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Start Date & Time *
            </label>
            <input
              type="datetime-local"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className={`w-full px-3.5 py-2.5 text-sm bg-white rounded-xl border ${
                errors.startDate
                  ? 'border-rose-400 ring-1 ring-rose-200'
                  : 'border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
              } transition-all`}
            />
            {errors.startDate && <p className="mt-1 text-xs text-rose-600">{errors.startDate}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              End Date & Time *
            </label>
            <input
              type="datetime-local"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className={`w-full px-3.5 py-2.5 text-sm bg-white rounded-xl border ${
                errors.endDate
                  ? 'border-rose-400 ring-1 ring-rose-200'
                  : 'border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
              } transition-all`}
            />
            {errors.endDate && <p className="mt-1 text-xs text-rose-600">{errors.endDate}</p>}
          </div>
        </div>

        {/* Venue */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Venue / Hall Location *
          </label>
          <input
            type="text"
            value={formData.venue}
            onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
            placeholder="e.g. Science Quad Lecture Hall 2"
            className={`w-full px-3.5 py-2.5 text-sm bg-white rounded-xl border ${
              errors.venue
                ? 'border-rose-400 ring-1 ring-rose-200'
                : 'border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
            } transition-all`}
          />
          {errors.venue && <p className="mt-1 text-xs text-rose-600">{errors.venue}</p>}
        </div>

        {/* Organizer Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Host / Club Name *
            </label>
            <input
              type="text"
              value={formData.organizerName}
              onChange={(e) => setFormData({ ...formData, organizerName: e.target.value })}
              placeholder="e.g. IEEE Student Chapter"
              className={`w-full px-3.5 py-2.5 text-sm bg-white rounded-xl border ${
                errors.organizerName
                  ? 'border-rose-400 ring-1 ring-rose-200'
                  : 'border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
              } transition-all`}
            />
            {errors.organizerName && <p className="mt-1 text-xs text-rose-600">{errors.organizerName}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Contact Email
            </label>
            <input
              type="email"
              value={formData.organizerContact}
              onChange={(e) => setFormData({ ...formData, organizerContact: e.target.value })}
              placeholder="e.g. ieee@campus.edu"
              className="w-full px-3.5 py-2.5 text-sm bg-white rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all"
            />
          </div>
        </div>

        {/* Banner Image URL + Presets */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Banner Image URL
          </label>
          <input
            type="url"
            value={formData.bannerUrl}
            onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-3.5 py-2.5 text-sm bg-white rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 transition-all mb-2"
          />
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[11px] text-slate-400 font-semibold mr-1">Sample Photos:</span>
            {SAMPLE_IMAGE_OPTIONS.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setFormData({ ...formData, bannerUrl: opt.url })}
                className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-medium transition-colors"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Event Description *
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Provide complete details about the schedule, requirements, eligibility, and what students will gain..."
            className={`w-full px-3.5 py-2.5 text-sm bg-white rounded-xl border ${
              errors.description
                ? 'border-rose-400 ring-1 ring-rose-200'
                : 'border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
            } transition-all`}
          />
          {errors.description && <p className="mt-1 text-xs text-rose-600">{errors.description}</p>}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <Button variant="outline" size="md" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
          >
            {isEditing ? 'Save Changes' : 'Publish Event'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
