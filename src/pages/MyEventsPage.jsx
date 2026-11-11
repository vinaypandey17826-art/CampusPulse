import React, { useState } from 'react';
import { useEvents } from '../context/EventContext';
import { RegisteredEventsList } from '../components/user/RegisteredEventsList';
import { BookmarkedEventsList } from '../components/user/BookmarkedEventsList';
import { RegistrationModal } from '../components/events/RegistrationModal';
import { TicketPassModal } from '../components/events/TicketPassModal';
import { Ticket, Bookmark, Sparkles } from 'lucide-react';

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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          My Passes & Saved Events
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Access your digital admission passes or revisit bookmarked activities.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('registered')}
          className={`flex items-center gap-2 pb-3 px-2 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'registered'
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Ticket className="w-4 h-4" />
          <span>Registered Passes</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700">
            {registrations.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center gap-2 pb-3 px-2 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'saved'
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Bookmarked Events</span>
          <span className="px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-700">
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
