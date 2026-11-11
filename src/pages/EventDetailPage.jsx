import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { BookmarkButton } from '../components/events/BookmarkButton';
import { CapacityIndicator } from '../components/events/CapacityIndicator';
import { RegistrationModal } from '../components/events/RegistrationModal';
import { TicketPassModal } from '../components/events/TicketPassModal';
import { formatDate, formatTime, formatDateRange } from '../utils/formatters';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Mail,
  User,
  Users,
  CheckCircle2,
  Share2,
  Ticket,
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
      <div className="text-center py-24 space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Event Not Found</h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto">
          The event you are looking for does not exist or may have been removed by an administrator.
        </p>
        <Button variant="outline" size="md" onClick={() => navigate('/events')}>
          <ArrowLeft className="w-4 h-4 mr-1" />
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
    <div className="space-y-8">
      {/* Back button and Share */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share</span>
        </button>
      </div>

      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden h-72 sm:h-96 w-full shadow-lg bg-slate-900 border border-slate-200">
        <img
          src={event.bannerUrl}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-black/30" />

        <div className="absolute top-4 left-4">
          <Badge category={event.category} className="text-xs px-3 py-1">
            {event.category}
          </Badge>
        </div>

        <div className="absolute top-4 right-4">
          <BookmarkButton eventId={event.id} size="lg" />
        </div>

        <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
          {isRegistered && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-bold shadow-md">
              <CheckCircle2 className="w-4 h-4" />
              <span>You have a confirmed pass for this event</span>
            </div>
          )}
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
            {event.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 font-medium">
            Hosted by <strong className="text-white">{event.organizerName}</strong>
          </p>
        </div>
      </div>

      {/* Main Grid: Details + Sticky Registration Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Description & Agenda */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview Section */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-slate-900">About the Event</h3>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Agenda / Schedule Timeline */}
          {event.agenda && event.agenda.length > 0 && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-5">
              <h3 className="text-lg font-bold text-slate-900">Event Schedule & Agenda</h3>
              <div className="space-y-4">
                {event.agenda.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                    <div className="px-2.5 py-1 rounded-lg bg-brand-50 text-brand-700 text-xs font-bold font-mono shrink-0 whitespace-nowrap">
                      {item.time}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{item.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Organizer Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Host Organization
            </h3>
            <div className="flex items-center gap-3 pt-1">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-brand-600 flex items-center justify-center font-bold text-base">
                {event.organizerName.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">{event.organizerName}</h4>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{event.organizerContact}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Key Details & RSVP Action Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-6 sticky top-24">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Registration Status
              </p>
              <CapacityIndicator
                registered={event.registeredCount}
                capacity={event.capacity}
              />
            </div>

            <div className="space-y-4 pt-2 border-t border-slate-100 text-sm">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800 text-xs">Date</p>
                  <p className="text-xs text-slate-500">{formatDate(event.startDate)}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800 text-xs">Time</p>
                  <p className="text-xs text-slate-500">
                    {formatTime(event.startDate)} - {formatTime(event.endDate)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800 text-xs">Location</p>
                  <p className="text-xs text-slate-500">{event.venue}</p>
                </div>
              </div>
            </div>

            {/* CTA RSVP Button */}
            <div className="pt-4 border-t border-slate-100">
              {isRegistered ? (
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setIssuedPass(existingRegistration)}
                    className="w-full text-brand-700 bg-brand-50 border-brand-200 hover:bg-brand-100 font-bold"
                  >
                    <Ticket className="w-4 h-4 mr-1" />
                    <span>View My Digital Pass</span>
                  </Button>
                  <p className="text-[11px] text-center text-slate-400">
                    You have reserved a confirmed seat for this event.
                  </p>
                </div>
              ) : isSoldOut ? (
                <div className="space-y-2">
                  <Button
                    variant="secondary"
                    size="lg"
                    disabled
                    className="w-full opacity-60 cursor-not-allowed"
                  >
                    Event is Fully Booked
                  </Button>
                  <p className="text-[11px] text-center text-slate-400">
                    This event has reached maximum seating capacity.
                  </p>
                </div>
              ) : (
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setIsRegModalOpen(true)}
                  className="w-full shadow-lg shadow-brand-500/25"
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
