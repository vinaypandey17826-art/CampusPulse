import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { HeroBanner } from '../components/home/HeroBanner';
import { CategoryHighlights } from '../components/home/CategoryHighlights';
import { EventCard } from '../components/events/EventCard';
import { RegistrationModal } from '../components/events/RegistrationModal';
import { TicketPassModal } from '../components/events/TicketPassModal';
import { ArrowRight } from 'lucide-react';
import { Button } from '../components/common/Button';

export function HomePage() {
  const { events, registrations, registerForEvent } = useEvents();
  const [selectedEventForReg, setSelectedEventForReg] = useState(null);
  const [issuedPass, setIssuedPass] = useState(null);

  // Take top 4 events for the 4-column grid
  const featuredEvents = events.slice(0, 4);

  const handleRegistrationSubmit = async (eventId, studentData) => {
    const createdPass = await registerForEvent(eventId, studentData);
    setIssuedPass(createdPass);
  };

  return (
    <div className="space-y-12">
      {/* Hero Section (Step 3: College Branding) */}
      <HeroBanner
        totalEvents={events.length}
        totalRegistrations={registrations.length}
      />

      {/* Featured Events (4-column grid matching reference) */}
      <section className="space-y-6">
        <div className="flex items-end justify-between border-b border-[#E2E2E2] pb-3">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-[#1B3A8C] mb-1">
              Highlights
            </div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold uppercase tracking-tight text-[#111111]">
              Upcoming Campus Events
            </h2>
          </div>
          <Link
            to="/events"
            className="text-xs font-bold uppercase tracking-wider text-[#1B3A8C] hover:underline flex items-center gap-1"
          >
            <span>View All ({events.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredEvents.map((evt) => (
            <EventCard
              key={evt.id}
              event={evt}
              onRegisterClick={(target) => setSelectedEventForReg(target)}
            />
          ))}
        </div>

        <div className="text-center sm:hidden pt-2">
          <Link to="/events">
            <Button variant="outline" size="md" className="w-full">
              <span>View All Events ({events.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
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

export default HomePage;
