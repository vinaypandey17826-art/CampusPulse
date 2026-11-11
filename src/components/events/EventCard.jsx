import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Badge } from '../common/Badge';
import { CapacityIndicator } from './CapacityIndicator';
import { BookmarkButton } from './BookmarkButton';
import { formatDate, formatTime } from '../../utils/formatters';
import { useEvents } from '../../context/EventContext';

export function EventCard({ event, onRegisterClick }) {
  const { registrations } = useEvents();
  const isRegistered = registrations.some((r) => r.eventId === event.id);
  const isSoldOut = event.registeredCount >= event.capacity;

  return (
    <div className="group bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-brand-200 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Banner & Category */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={event.bannerUrl}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20" />

        <div className="absolute top-3 left-3">
          <Badge category={event.category}>{event.category}</Badge>
        </div>

        <div className="absolute top-3 right-3">
          <BookmarkButton eventId={event.id} size="sm" />
        </div>

        {isRegistered && (
          <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/95 text-white text-xs font-bold shadow-md backdrop-blur-sm">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Registered</span>
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-brand-600">
              <Calendar className="w-3.5 h-3.5" />
              <span>
                {formatDate(event.startDate)} • {formatTime(event.startDate)}
              </span>
            </div>

            <Link to={`/events/${event.id}`}>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2 leading-snug">
                {event.title}
              </h3>
            </Link>
          </div>

          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {event.shortDescription || event.description}
          </p>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>

        {/* Footer Capacity & Action */}
        <div className="pt-4 mt-4 border-t border-slate-100 space-y-3">
          <CapacityIndicator
            registered={event.registeredCount}
            capacity={event.capacity}
          />

          <div className="flex items-center gap-2 pt-1">
            <Link
              to={`/events/${event.id}`}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {!isRegistered && !isSoldOut && onRegisterClick && (
              <button
                type="button"
                onClick={() => onRegisterClick(event)}
                className="px-3.5 py-2 text-xs font-bold rounded-xl bg-brand-600 text-white hover:bg-brand-700 shadow-sm shadow-brand-500/20 transition-all active:scale-95"
              >
                RSVP
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
