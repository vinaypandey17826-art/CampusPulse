import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import { AdminStats } from '../components/admin/AdminStats';
import { AdminEventTable } from '../components/admin/AdminEventTable';
import { EventFormModal } from '../components/admin/EventFormModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Button } from '../components/common/Button';
import { SearchBar } from '../components/events/SearchBar';
import { Plus, Shield, ShieldAlert, Sparkles } from 'lucide-react';

export function AdminPage() {
  const { isAdmin, setRole } = useAuth();
  const { events, registrations, createEvent, updateEvent, deleteEvent } = useEvents();

  // Search filter inside admin console
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [deletingEvent, setDeletingEvent] = useState(null);

  // If user is currently in Student mode, display role switcher gate
  if (!isAdmin) {
    return (
      <div className="max-w-lg mx-auto my-16 bg-white rounded-3xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-100">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Administrator Access Required</h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          You are currently previewing CampusConnect as a <strong>Student</strong>. Switch to Administrator Mode to manage, edit, and create campus events.
        </p>
        <div className="pt-2">
          <Button variant="primary" size="md" onClick={() => setRole('admin')}>
            <Shield className="w-4 h-4 mr-1" />
            <span>Switch to Admin Mode</span>
          </Button>
        </div>
      </div>
    );
  }

  // Filter events by search query in table
  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return events;
    const q = searchQuery.toLowerCase();
    return events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q) ||
        e.organizerName.toLowerCase().includes(q)
    );
  }, [events, searchQuery]);

  const handleOpenCreateModal = () => {
    setEditingEvent(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (event) => {
    setEditingEvent(event);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (formData) => {
    if (editingEvent) {
      await updateEvent(editingEvent.id, formData);
    } else {
      await createEvent(formData);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingEvent) {
      deleteEvent(deletingEvent.id);
      setDeletingEvent(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Event Management Portal
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
              Admin
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Publish upcoming campus events, monitor RSVPs, and manage event schedules.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={handleOpenCreateModal}
          className="shadow-md shadow-brand-500/20"
        >
          Create New Event
        </Button>
      </div>

      {/* Analytics Dashboard */}
      <AdminStats events={events} registrations={registrations} />

      {/* Search & Filter Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:max-w-md">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Filter by title, organizer, or venue..."
            />
          </div>
          <p className="text-xs text-slate-500 self-end sm:self-center">
            Showing <strong className="text-slate-800">{filteredEvents.length}</strong> of {events.length} events
          </p>
        </div>

        {/* Data Table */}
        <AdminEventTable
          events={filteredEvents}
          registrations={registrations}
          onEdit={handleOpenEditModal}
          onDelete={(evt) => setDeletingEvent(evt)}
        />
      </div>

      {/* Create / Edit Modal */}
      {isFormModalOpen && (
        <EventFormModal
          isOpen={isFormModalOpen}
          onClose={() => setIsFormModalOpen(false)}
          initialData={editingEvent}
          onSubmit={handleFormSubmit}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingEvent && (
        <ConfirmDialog
          isOpen={Boolean(deletingEvent)}
          onClose={() => setDeletingEvent(null)}
          title="Delete Campus Event?"
          message={`Are you sure you want to permanently delete "${deletingEvent.title}"? Any existing registrations will also be removed.`}
          confirmText="Yes, Delete Event"
          confirmVariant="danger"
          onConfirm={handleConfirmDelete}
        />
      )}
    </div>
  );
}
