import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDateRange } from '../../utils/formatters';
import { Button } from '../common/Button';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { TicketPassModal } from '../events/TicketPassModal';
import { Calendar, MapPin, Ticket } from 'lucide-react';
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
        title="No Event Passes"
        description="You have not registered for any campus events yet. Explore upcoming activities and reserve your seat."
        icon={Ticket}
        actionLabel="Explore All Events"
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
            className="bg-white rounded-[2px] border border-[#E2E2E2] p-5 hover:border-[#111111] transition-colors flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-[2px] bg-[#FAFAFA] text-[#1B3A8C] border border-[#E2E2E2] flex items-center gap-1.5">
                  <Ticket className="w-3.5 h-3.5" />
                  {reg.ticketCode}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#1B3A8C] bg-[#FAFAFA] px-2 py-0.5 rounded-[2px] border border-[#E2E2E2]">
                  Confirmed Pass
                </span>
              </div>

              <div>
                <Link
                  to={`/events/${reg.eventId}`}
                  className="font-heading font-bold text-sm sm:text-base text-[#111111] hover:text-[#1B3A8C] transition-colors line-clamp-1"
                >
                  {reg.eventTitle}
                </Link>
                <div className="mt-2 space-y-1 text-xs text-[#6B6B6B]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#1B3A8C]" />
                    <span>{formatDateRange(reg.eventStartDate)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#1B3A8C]" />
                    <span className="truncate">{reg.eventVenue}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#E2E2E2] flex items-center justify-between gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedPass(reg)}
              >
                View Pass
              </Button>

              <button
                type="button"
                onClick={() => setCancellingRegistration(reg)}
                className="text-xs font-bold uppercase tracking-wider text-[#DC2626] hover:underline p-1"
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
          message={`Are you sure you want to cancel your pass for "${cancellingRegistration.eventTitle}"? Your seat will be released immediately.`}
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
