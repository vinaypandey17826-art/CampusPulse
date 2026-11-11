import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Badge } from '../common/Badge';
import { CapacityIndicator } from './CapacityIndicator';
import { BookmarkButton } from './BookmarkButton';
import { useEvents } from '../../context/EventContext';

export function EventCard({ event, onRegisterClick }) {
  const { registrations } = useEvents();
  const isRegistered = registrations.some((r) => r.eventId === event.id);
  const isSoldOut = event.registeredCount >= event.capacity;

  const dateObj = new Date(event.startDate);
  const dayNum = !isNaN(dateObj) ? dateObj.getDate() : '--';
  const monthStr = !isNaN(dateObj)
    ? dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase()
    : '';
  const weekdayStr = !isNaN(dateObj)
    ? dateObj.toLocaleString('en-US', { weekday: 'short' }).toUpperCase()
    : '';
  const yearStr = !isNaN(dateObj) ? dateObj.getFullYear() : '';

  return (
    <div className="group bg-white border border-[#E2E2E2] rounded-[2px] overflow-hidden flex flex-col justify-between transition-colors hover:border-[#111111]">
      {/* Top Header: Title, Date Number, Venue, Category */}
      <div className="p-4 space-y-3">
        {/* Category tag & Venue */}
        <div className="flex items-center justify-between gap-2">
          <Badge category={event.category}>{event.category}</Badge>
          <div className="flex items-center gap-1 text-[11px] text-[#6B6B6B] truncate">
            <MapPin className="w-3 h-3 text-[#A3A3A3] shrink-0" />
            <span className="truncate">{event.venue}</span>
          </div>
        </div>

        {/* Title */}
        <Link to={`/events/${event.id}`}>
          <h3 className="font-heading font-bold text-sm text-[#111111] hover:text-[#1B3A8C] transition-colors line-clamp-2 leading-snug">
            {event.title}
          </h3>
        </Link>

        {/* Large Date Number stacked with Month (Reference Design) */}
        <div className="flex items-baseline gap-2 pt-1 border-t border-[#F0F0F0]">
          <span className="font-heading text-3xl font-bold text-[#111111] leading-none">
            {dayNum}
          </span>
          <div className="text-[10px] uppercase font-bold tracking-wider leading-tight text-[#6B6B6B]">
            <div>{monthStr} {yearStr}</div>
            <div className="text-[#A3A3A3] font-medium">{weekdayStr}</div>
          </div>
        </div>

        {/* Thin flat capacity bar */}
        <CapacityIndicator
          registered={event.registeredCount}
          capacity={event.capacity}
        />
      </div>

      {/* Middle Photo with subtle hover effect (grayscale to color) */}
      <div className="relative h-40 w-full overflow-hidden bg-[#FAFAFA] border-y border-[#E2E2E2]">
        <img
          src={event.bannerUrl}
          alt={event.title}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
          loading="lazy"
        />

        {/* Bookmark icon positioned over the photo */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <BookmarkButton eventId={event.id} size="sm" />
        </div>

        {isRegistered && (
          <div className="absolute bottom-2 left-2 z-10 bg-[#1B3A8C] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-[2px]">
            Registered
          </div>
        )}
      </div>

      {/* Dark Bottom Bar with two actions: "Register" and "More info" separated by a thin divider */}
      <div className="bg-[#2B2B2B] text-white grid grid-cols-2 divide-x divide-white/20 text-xs font-bold uppercase tracking-wider">
        {isSoldOut ? (
          <button
            type="button"
            disabled
            className="py-3 text-center text-[#DC2626] font-bold cursor-not-allowed opacity-90 text-[11px]"
          >
            Sold Out
          </button>
        ) : isRegistered ? (
          <Link
            to="/my-registrations"
            className="py-3 text-center text-white/90 hover:text-white hover:bg-black/30 transition-colors text-[11px]"
          >
            My Pass
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => onRegisterClick && onRegisterClick(event)}
            className="py-3 text-center text-white hover:bg-[#1B3A8C] transition-colors text-[11px]"
          >
            Register
          </button>
        )}

        <Link
          to={`/events/${event.id}`}
          className="py-3 text-center text-white/80 hover:text-white hover:bg-black/30 transition-colors text-[11px]"
        >
          More info
        </Link>
      </div>
    </div>
  );
}
