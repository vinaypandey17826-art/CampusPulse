import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { HeroBanner } from '../components/home/HeroBanner';
import { CategoryHighlights } from '../components/home/CategoryHighlights';
import { EventCard } from '../components/events/EventCard';
import { RegistrationModal } from '../components/events/RegistrationModal';
import { TicketPassModal } from '../components/events/TicketPassModal';
import { ArrowRight, Flame } from 'lucide-react';
import { Button } from '../components/common/Button';

export function HomePage() {
  const { events, registrations, registerForEvent } = useEvents();
  const [selectedEventForReg, setSelectedEventForReg] = useState(null);
  const [issuedPass, setIssuedPass] = useState(null);

  // Take top 3 featured events
  const featuredEvents = events.slice(0, 3);

  const handleRegistrationSubmit = async (eventId, studentData) => {
    const createdPass = await registerForEvent(eventId, studentData);
    setIssuedPass(createdPass);
  };

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <HeroBanner
        totalEvents={events.length}
        totalRegistrations={registrations.length}
      />

      {/* Featured / Trending Events */}
      <section className="space-y-6">
        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>Trending on Campus</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Highlights
            </h2>
            <p className="text-sm text-slate-500">
              High-capacity events happening across campus over the coming weeks.
            </p>
          </div>
          <Link
            to="/events"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-800"
          >
            <span>View All ({events.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredEvents.map((evt) => (
            <EventCard
              key={evt.id}
              event={evt}
              onRegisterClick={(target) => setSelectedEventForReg(target)}
            />
          ))}
        </div>

        <div className="text-center sm:hidden pt-4">
          <Link to="/events">
            <Button variant="outline" size="md" className="w-full">
              <span>View All Events ({events.length})</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Category Tracks */}
      <CategoryHighlights />

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
