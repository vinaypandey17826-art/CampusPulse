import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import { AdminStats } from '../components/admin/AdminStats';
import { AdminEventTable } from '../components/admin/AdminEventTable';
import { EventFormModal } from '../components/admin/EventFormModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { Button } from '../components/common/Button';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { SearchBar } from '../components/events/SearchBar';
import { Plus, Shield, ShieldAlert } from 'lucide-react';

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
      <div className="space-y-6">
        <Breadcrumbs items={[{ label: 'Admin Portal' }]} />
        <div className="max-w-lg mx-auto my-12 bg-white rounded-[2px] border border-[#E2E2E2] p-8 text-center space-y-4 shadow-none">
          <div className="w-12 h-12 rounded-[2px] bg-[#FAFAFA] text-[#1B3A8C] flex items-center justify-center mx-auto border border-[#E2E2E2]">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-heading font-normal text-univ-text">Administrator Access Required</h2>
          <p className="text-sm text-univ-muted leading-relaxed">
            You are currently previewing CampusConnect as a <strong className="text-univ-text">Student</strong>. Switch to Administrator Mode to manage, edit, and create campus events.
          </p>
          <div className="pt-2">
            <Button variant="primary" size="md" onClick={() => setRole('admin')}>
              <Shield className="w-4 h-4 mr-1.5" />
              <span>Switch to Admin Mode</span>
            </Button>
          </div>
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
      <Breadcrumbs items={[{ label: 'Admin Portal' }]} />

      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E2E2] pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-heading font-normal text-univ-text tracking-tight">
              Event Management Portal
            </h1>
            <span className="px-2 py-0.5 rounded-[2px] text-[11px] font-bold uppercase tracking-wider bg-[#FAFAFA] text-univ-text border border-[#E2E2E2]">
              Admin
            </span>
          </div>
          <p className="text-sm text-univ-muted mt-1">
            Publish upcoming campus events, monitor RSVPs, and manage event schedules.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={handleOpenCreateModal}
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
          <p className="text-xs text-univ-muted self-end sm:self-center font-mono">
            Showing <strong className="text-univ-text">{filteredEvents.length}</strong> of {events.length} events
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
