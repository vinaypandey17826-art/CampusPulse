import React, { useState } from 'react';
import { useEvents } from '../context/EventContext';
import { BookmarkedEventsList } from '../components/user/BookmarkedEventsList';
import { RegistrationModal } from '../components/events/RegistrationModal';
import { TicketPassModal } from '../components/events/TicketPassModal';
import { Bookmark } from 'lucide-react';

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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-100 mb-2">
          <Bookmark className="w-3.5 h-3.5 fill-rose-600" />
          <span>Curated List</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Saved Events
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Explore bookmarked campus activities you plan to attend.
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
