import React, { useState } from 'react';
import { useEvents } from '../context/EventContext';
import { BookmarkedEventsList } from '../components/user/BookmarkedEventsList';
import { RegistrationModal } from '../components/events/RegistrationModal';
import { TicketPassModal } from '../components/events/TicketPassModal';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export function SavedEventsPage() {
  const { events, bookmarkedIds, registerForEvent } = useEvents();
  const [selectedEventForReg, setSelectedEventForReg] = useState(null);
  const [issuedPass, setIssuedPass] = useState(null);

  // Look up events by bookmarked IDs (one source of truth)
  const savedEvents = events.filter((e) => bookmarkedIds.includes(e.id));

  const handleRegistrationSubmit = async (eventId, studentData) => {
    const pass = await registerForEvent(eventId, studentData);
    setIssuedPass(pass);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb (Step 3) */}
      <Breadcrumbs items={[{ label: 'Saved Events' }]} />

      {/* Header */}
      <div className="border-b border-[#E2E2E2] pb-4">
        <div className="text-[10px] uppercase font-bold tracking-widest text-[#1B3A8C] mb-1">
          Favorites
        </div>
        <h1 className="font-heading text-2xl sm:text-4xl font-bold uppercase tracking-tight text-[#111111]">
          Saved Events
        </h1>
        <p className="text-xs text-[#6B6B6B] mt-1">
          Curated shortlist of campus activities you plan to attend.
        </p>
      </div>

      {/* Bookmarked Events / Empty state */}
      <BookmarkedEventsList
        events={savedEvents}
        onRegisterClick={(target) => setSelectedEventForReg(target)}
      />

      {/* Registration Modals */}
      {selectedEventForReg && (
        <RegistrationModal
          isOpen={Boolean(selectedEventForReg)}
          onClose={() => setSelectedEventForReg(null)}
          event={selectedEventForReg}
          onRegistrationSuccess={handleRegistrationSubmit}
        />
      )}

      {issuedPass && (
        <TicketPassModal
          isOpen={Boolean(issuedPass)}
          onClose={() => setIssuedPass(null)}
          registration={issuedPass}
        />
      )}
    </div>
  );
}

export default SavedEventsPage;
