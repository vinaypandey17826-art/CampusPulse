import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDateRange } from '../../utils/formatters';
import { Button } from '../common/Button';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { TicketPassModal } from '../events/TicketPassModal';
import { Calendar, MapPin, Ticket, AlertCircle, ArrowRight } from 'lucide-react';
import { EmptyState } from '../common/EmptyState';

export function RegisteredEventsList({
  registrations = [],
  onCancelRegistration,
}) {
  const [selectedPass, setSelectedPass] = useState(null);
  const [cancellingRegistration, setCancellingRegistration] = useState(null);

  if (registrations.length === 0) {
    return (
      <EmptyState
        title="No Event Passes Yet"
        description="You haven't registered for any campus events. Explore upcoming events and claim your pass!"
        icon={Ticket}
        actionLabel="Explore Events"
        onAction={() => window.location.assign('/events')}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {registrations.map((reg) => (
          <div
            key={reg.id}
            className="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-brand-50 text-brand-700 border border-brand-100 flex items-center gap-1.5">
                  <Ticket className="w-3.5 h-3.5" />
                  {reg.ticketCode}
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  Confirmed
                </span>
              </div>

              <div>
                <Link
                  to={`/events/${reg.eventId}`}
                  className="font-bold text-base text-slate-900 hover:text-brand-600 transition-colors line-clamp-1"
                >
                  {reg.eventTitle}
                </Link>
                <div className="mt-2 space-y-1 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDateRange(reg.eventStartDate)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{reg.eventVenue}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedPass(reg)}
                className="text-xs font-semibold"
              >
                View Pass
              </Button>

              <button
                type="button"
                onClick={() => setCancellingRegistration(reg)}
                className="text-xs font-semibold text-rose-600 hover:text-rose-800 hover:underline p-1"
              >
                Cancel RSVP
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Ticket Pass Modal */}
      {selectedPass && (
        <TicketPassModal
          isOpen={Boolean(selectedPass)}
          onClose={() => setSelectedPass(null)}
          registration={selectedPass}
        />
      )}

      {/* Cancellation Confirmation Dialog */}
      {cancellingRegistration && (
        <ConfirmDialog
          isOpen={Boolean(cancellingRegistration)}
          onClose={() => setCancellingRegistration(null)}
          title="Cancel RSVP"
          message={`Are you sure you want to cancel your registration for "${cancellingRegistration.eventTitle}"? Your spot will be released to other students.`}
          confirmText="Yes, Cancel RSVP"
          confirmVariant="danger"
          onConfirm={() => {
            onCancelRegistration(cancellingRegistration.id);
            setCancellingRegistration(null);
          }}
        />
      )}
    </div>
  );
}
