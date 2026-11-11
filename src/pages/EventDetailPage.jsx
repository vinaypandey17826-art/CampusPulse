import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { BookmarkButton } from '../components/events/BookmarkButton';
import { CapacityIndicator } from '../components/events/CapacityIndicator';
import { RegistrationModal } from '../components/events/RegistrationModal';
import { TicketPassModal } from '../components/events/TicketPassModal';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { formatDate, formatTime } from '../utils/formatters';
import {
  Calendar,
  Clock,
  MapPin,
  Mail,
  Share2,
  Ticket,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

export function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events, registrations, registerForEvent } = useEvents();
  const { showToast } = useToast();

  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [issuedPass, setIssuedPass] = useState(null);

  const event = events.find((e) => e.id === id);

  if (!event) {
    return (
      <div className="text-center py-24 space-y-4 max-w-md mx-auto">
        <h2 className="font-heading text-2xl font-bold uppercase tracking-tight text-[#111111]">
          Event Not Found
        </h2>
        <p className="text-xs text-[#6B6B6B]">
          The event you are looking for does not exist or may have been removed.
        </p>
        <Button variant="outline" size="sm" onClick={() => navigate('/events')}>
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          <span>Back to All Events</span>
        </Button>
      </div>
    );
  }

  const existingRegistration = registrations.find((r) => r.eventId === event.id);
  const isRegistered = Boolean(existingRegistration);
  const isSoldOut = event.registeredCount >= event.capacity;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.shortDescription,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Event link copied to clipboard!', 'info');
    }
  };

  const handleRegistrationSubmit = async (eventId, studentData) => {
    const pass = await registerForEvent(eventId, studentData);
    setIssuedPass(pass);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb (Step 3) */}
      <Breadcrumbs
        items={[
          { label: 'Events', to: '/events' },
          { label: event.title },
        ]}
      />

      {/* Top Header & Share Bar */}
      <div className="flex items-start justify-between gap-4 border-b border-[#E2E2E2] pb-6">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2">
            <Badge category={event.category}>{event.category}</Badge>
            <span className="text-[11px] uppercase font-bold tracking-wider text-[#6B6B6B]">
              ABES Engineering College
            </span>
          </div>

          <h1 className="font-heading text-2xl sm:text-4xl font-bold tracking-tight text-[#111111] leading-tight">
            {event.title}
          </h1>

          <p className="text-xs text-[#6B6B6B]">
            Organized by <strong className="text-[#111111] font-semibold">{event.organizerName}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <BookmarkButton eventId={event.id} size="md" />
          <button
            onClick={handleShare}
            className="p-2 border border-[#E2E2E2] bg-white hover:bg-[#FAFAFA] rounded-[2px] text-[#6B6B6B] hover:text-[#111111] transition-colors"
            title="Share Event"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Photo Banner (Flat, minimal border) */}
      <div className="relative h-64 sm:h-96 w-full overflow-hidden bg-[#FAFAFA] border border-[#E2E2E2] rounded-[2px]">
        <img
          src={event.bannerUrl}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        {isRegistered && (
          <div className="absolute top-4 left-4 bg-[#1B3A8C] text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-[2px] flex items-center gap-1.5 shadow-md">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>You have a confirmed pass for this event</span>
          </div>
        )}
      </div>

      {/* Main Grid: Description + Key Details Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-2">
        {/* Left Column: Description & Agenda */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-[#E2E2E2] rounded-[2px] p-6 sm:p-8 space-y-4">
            <h3 className="font-heading text-base font-bold uppercase tracking-wider text-[#111111] border-b border-[#E2E2E2] pb-2">
              Event Overview
            </h3>
            <p className="text-xs sm:text-sm text-[#444444] leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Agenda */}
          {event.agenda && event.agenda.length > 0 && (
            <div className="bg-white border border-[#E2E2E2] rounded-[2px] p-6 sm:p-8 space-y-4">
              <h3 className="font-heading text-base font-bold uppercase tracking-wider text-[#111111] border-b border-[#E2E2E2] pb-2">
                Event Schedule & Agenda
              </h3>
              <div className="space-y-3">
                {event.agenda.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-4 pb-3 border-b border-[#F0F0F0] last:border-0 last:pb-0"
                  >
                    <div className="px-2.5 py-1 bg-[#FAFAFA] border border-[#E2E2E2] text-[#1B3A8C] text-[11px] font-mono font-bold shrink-0 rounded-[2px]">
                      {item.time}
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-[#111111]">
                      {item.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Host Info */}
          <div className="bg-white border border-[#E2E2E2] rounded-[2px] p-6 space-y-2">
            <h4 className="font-heading text-xs uppercase font-bold tracking-wider text-[#6B6B6B]">
              Host Department / Society
            </h4>
            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="font-heading font-bold text-sm text-[#111111]">
                  {event.organizerName}
                </p>
                <p className="text-xs text-[#6B6B6B] flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-[#1B3A8C]" />
                  <span>{event.organizerContact}</span>
                </p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border border-[#E2E2E2] bg-[#FAFAFA] rounded-[2px]">
                Verified Host
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Key Details & RSVP Action Card */}
        <div className="space-y-6">
          <div className="bg-white border border-[#E2E2E2] rounded-[2px] p-6 space-y-5 sticky top-24">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-[#6B6B6B] mb-1">
                Admission Status
              </div>
              <CapacityIndicator
                registered={event.registeredCount}
                capacity={event.capacity}
              />
            </div>

            <div className="space-y-3 pt-3 border-t border-[#E2E2E2] text-xs">
              <div className="flex items-start gap-3">
                <Calendar className="w-4 h-4 text-[#1B3A8C] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#111111] uppercase tracking-wider text-[10px]">Date</p>
                  <p className="text-[#6B6B6B]">{formatDate(event.startDate)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#1B3A8C] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#111111] uppercase tracking-wider text-[10px]">Time</p>
                  <p className="text-[#6B6B6B]">
                    {formatTime(event.startDate)} - {formatTime(event.endDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#1B3A8C] shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-[#111111] uppercase tracking-wider text-[10px]">Venue</p>
                  <p className="text-[#6B6B6B]">{event.venue}</p>
                </div>
              </div>
            </div>

            {/* RSVP CTA Button */}
            <div className="pt-4 border-t border-[#E2E2E2]">
              {isRegistered ? (
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => setIssuedPass(existingRegistration)}
                    className="w-full font-bold"
                  >
                    <Ticket className="w-3.5 h-3.5 mr-1 text-[#1B3A8C]" />
                    <span>View Digital Pass</span>
                  </Button>
                  <p className="text-[10px] text-center text-[#6B6B6B]">
                    Your registration has been confirmed.
                  </p>
                </div>
              ) : isSoldOut ? (
                <div className="space-y-2">
                  <Button
                    variant="secondary"
                    size="md"
                    disabled
                    className="w-full opacity-60 cursor-not-allowed bg-[#2B2B2B] text-[#DC2626]"
                  >
                    Sold Out
                  </Button>
                  <p className="text-[10px] text-center text-[#DC2626]">
                    Seating capacity reached.
                  </p>
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setIsRegModalOpen(true)}
                  className="w-full"
                >
                  Register for This Event
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {isRegModalOpen && (
        <RegistrationModal
          isOpen={isRegModalOpen}
          onClose={() => setIsRegModalOpen(false)}
          event={event}
          onRegistrationSuccess={handleRegistrationSubmit}
        />
      )}

      {/* Ticket Pass Modal */}
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

export default EventDetailPage;
