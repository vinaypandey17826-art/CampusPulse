import React, { useState } from 'react';
import { useEvents } from '../context/EventContext';
import { RegisteredEventsList } from '../components/user/RegisteredEventsList';
import { BookmarkedEventsList } from '../components/user/BookmarkedEventsList';
import { RegistrationModal } from '../components/events/RegistrationModal';
import { TicketPassModal } from '../components/events/TicketPassModal';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Ticket, Bookmark } from 'lucide-react';

export function MyEventsPage() {
  const { events, registrations, bookmarkedIds, cancelRegistration, registerForEvent } = useEvents();
  const [activeTab, setActiveTab] = useState('registered');

  const [selectedEventForReg, setSelectedEventForReg] = useState(null);
  const [issuedPass, setIssuedPass] = useState(null);

  // Compute bookmarked events objects
  const bookmarkedEvents = events.filter((e) => bookmarkedIds.includes(e.id));

  const handleRegistrationSubmit = async (eventId, studentData) => {
    const pass = await registerForEvent(eventId, studentData);
    setIssuedPass(pass);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={[{ label: 'Student Portal' }]} />

      {/* Header */}
      <div className="border-b border-[#E2E2E2] pb-4">
        <div className="text-[10px] uppercase font-bold tracking-widest text-[#1B3A8C] mb-1">
          Student Portal
        </div>
        <h1 className="font-heading text-2xl sm:text-4xl font-bold uppercase tracking-tight text-[#111111]">
          My Passes & Saved Events
        </h1>
        <p className="text-xs text-[#6B6B6B] mt-1">
          Access your digital admission passes or revisit bookmarked activities.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-[#E2E2E2]">
        <button
          onClick={() => setActiveTab('registered')}
          className={`flex items-center gap-2 pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'registered'
              ? 'border-[#1B3A8C] text-[#1B3A8C]'
              : 'border-transparent text-[#6B6B6B] hover:text-[#111111]'
          }`}
        >
          <Ticket className="w-3.5 h-3.5" />
          <span>Registered Passes</span>
          <span className="px-1.5 py-0.2 rounded-[2px] text-[10px] bg-[#FAFAFA] text-[#111111] border border-[#E2E2E2]">
            {registrations.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center gap-2 pb-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
            activeTab === 'saved'
              ? 'border-[#1B3A8C] text-[#1B3A8C]'
              : 'border-transparent text-[#6B6B6B] hover:text-[#111111]'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Saved Events</span>
          <span className="px-1.5 py-0.2 rounded-[2px] text-[10px] bg-[#FAFAFA] text-[#111111] border border-[#E2E2E2]">
            {bookmarkedEvents.length}
          </span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'registered' ? (
        <RegisteredEventsList
          registrations={registrations}
          onCancelRegistration={cancelRegistration}
        />
      ) : (
        <BookmarkedEventsList
          events={bookmarkedEvents}
          onRegisterClick={(target) => setSelectedEventForReg(target)}
        />
      )}

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

export default MyEventsPage;
