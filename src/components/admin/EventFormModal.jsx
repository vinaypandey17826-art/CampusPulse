import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { validateEventForm } from '../../utils/validators';
import { CATEGORIES } from '../../data/seedEvents';

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
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Title */}
        <div>
          <label className="block text-[10px] font-bold text-[#111111] uppercase tracking-wider mb-1">
            Event Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Annual Technical Fest 2026"
            className={`w-full px-3 py-2 text-xs bg-white rounded-[2px] border ${
              errors.title
                ? 'border-[#DC2626]'
                : 'border-[#E2E2E2] focus:border-[#1B3A8C]'
            } focus:outline-none transition-colors`}
          />
          {errors.title && <p className="mt-1 text-[11px] text-[#DC2626]">{errors.title}</p>}
        </div>

        {/* Category & Capacity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-[#111111] uppercase tracking-wider mb-1">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-white rounded-[2px] border border-[#E2E2E2] focus:border-[#1B3A8C] focus:outline-none transition-colors cursor-pointer capitalize"
            >
              {CATEGORIES.filter((c) => c.id !== 'all').map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#111111] uppercase tracking-wider mb-1">
              Maximum Capacity (Seats) *
            </label>
            <input
              type="number"
              min={initialData ? initialData.registeredCount : 1}
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              className={`w-full px-3 py-2 text-xs bg-white rounded-[2px] border ${
                errors.capacity
                  ? 'border-[#DC2626]'
                  : 'border-[#E2E2E2] focus:border-[#1B3A8C]'
              } focus:outline-none transition-colors`}
            />
            {errors.capacity && <p className="mt-1 text-[11px] text-[#DC2626]">{errors.capacity}</p>}
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-[#111111] uppercase tracking-wider mb-1">
              Start Date & Time *
            </label>
            <input
              type="datetime-local"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className={`w-full px-3 py-2 text-xs bg-white rounded-[2px] border ${
                errors.startDate
                  ? 'border-[#DC2626]'
                  : 'border-[#E2E2E2] focus:border-[#1B3A8C]'
              } focus:outline-none transition-colors`}
            />
            {errors.startDate && <p className="mt-1 text-[11px] text-[#DC2626]">{errors.startDate}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#111111] uppercase tracking-wider mb-1">
              End Date & Time *
            </label>
            <input
              type="datetime-local"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className={`w-full px-3 py-2 text-xs bg-white rounded-[2px] border ${
                errors.endDate
                  ? 'border-[#DC2626]'
                  : 'border-[#E2E2E2] focus:border-[#1B3A8C]'
              } focus:outline-none transition-colors`}
            />
            {errors.endDate && <p className="mt-1 text-[11px] text-[#DC2626]">{errors.endDate}</p>}
          </div>
        </div>

        {/* Venue */}
        <div>
          <label className="block text-[10px] font-bold text-[#111111] uppercase tracking-wider mb-1">
            Venue / Hall Location *
          </label>
          <input
            type="text"
            value={formData.venue}
            onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
            placeholder="e.g. Auditorium Hall B, ABES Campus"
            className={`w-full px-3 py-2 text-xs bg-white rounded-[2px] border ${
              errors.venue
                ? 'border-[#DC2626]'
                : 'border-[#E2E2E2] focus:border-[#1B3A8C]'
            } focus:outline-none transition-colors`}
          />
          {errors.venue && <p className="mt-1 text-[11px] text-[#DC2626]">{errors.venue}</p>}
        </div>

        {/* Organizer Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-bold text-[#111111] uppercase tracking-wider mb-1">
              Host / Department Name *
            </label>
            <input
              type="text"
              value={formData.organizerName}
              onChange={(e) => setFormData({ ...formData, organizerName: e.target.value })}
              placeholder="e.g. Computer Science Society"
              className={`w-full px-3 py-2 text-xs bg-white rounded-[2px] border ${
                errors.organizerName
                  ? 'border-[#DC2626]'
                  : 'border-[#E2E2E2] focus:border-[#1B3A8C]'
              } focus:outline-none transition-colors`}
            />
            {errors.organizerName && <p className="mt-1 text-[11px] text-[#DC2626]">{errors.organizerName}</p>}
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#111111] uppercase tracking-wider mb-1">
              Contact Email
            </label>
            <input
              type="email"
              value={formData.organizerContact}
              onChange={(e) => setFormData({ ...formData, organizerContact: e.target.value })}
              placeholder="e.g. events@abes.ac.in"
              className="w-full px-3 py-2 text-xs bg-white rounded-[2px] border border-[#E2E2E2] focus:border-[#1B3A8C] focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Banner Image URL + Presets */}
        <div>
          <label className="block text-[10px] font-bold text-[#111111] uppercase tracking-wider mb-1">
            Banner Image URL
          </label>
          <input
            type="url"
            value={formData.bannerUrl}
            onChange={(e) => setFormData({ ...formData, bannerUrl: e.target.value })}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-3 py-2 text-xs bg-white rounded-[2px] border border-[#E2E2E2] focus:border-[#1B3A8C] focus:outline-none transition-colors mb-2"
          />
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] text-[#6B6B6B] font-semibold uppercase tracking-wider">Presets:</span>
            {SAMPLE_IMAGE_OPTIONS.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setFormData({ ...formData, bannerUrl: opt.url })}
                className="text-[10px] px-2 py-0.5 rounded-[2px] bg-[#FAFAFA] hover:bg-[#E2E2E2] text-[#111111] border border-[#E2E2E2] font-medium"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-[10px] font-bold text-[#111111] uppercase tracking-wider mb-1">
            Event Description *
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Provide complete details about the schedule, eligibility, and rules..."
            className={`w-full px-3 py-2 text-xs bg-white rounded-[2px] border ${
              errors.description
                ? 'border-[#DC2626]'
                : 'border-[#E2E2E2] focus:border-[#1B3A8C]'
            } focus:outline-none transition-colors`}
          />
          {errors.description && <p className="mt-1 text-[11px] text-[#DC2626]">{errors.description}</p>}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#E2E2E2]">
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            loading={loading}
          >
            {isEditing ? 'Save Changes' : 'Publish Event'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
