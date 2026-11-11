import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { formatDateRange } from '../../utils/formatters';
import { Calendar, MapPin, User, CheckCircle2, Ticket, QrCode } from 'lucide-react';

export function TicketPassModal({ isOpen, onClose, registration }) {
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // Fallback gracefully if canvas-confetti is not loaded
      }
    }
  }, [isOpen]);

  if (!registration) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registration Confirmed"
      maxWidth="max-w-md"
    >
      <div className="space-y-6">
        {/* Success Header */}
        <div className="text-center space-y-1.5 pb-2">
          <div className="w-12 h-12 rounded-[2px] bg-[#FAFAFA] text-[#1B3A8C] border border-[#E2E2E2] flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-lg font-heading font-normal text-univ-text">Registration Confirmed</h4>
          <p className="text-xs text-univ-muted">
            A copy of this digital event pass has been added to your Passes tab.
          </p>
        </div>

        {/* Digital Boarding Pass Ticket */}
        <div className="relative rounded-[2px] bg-[#FFFFFF] text-univ-text p-5 border border-[#E2E2E2]">
          {/* Ticket Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E2E2]">
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-[#1B3A8C]" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-univ-text font-mono">
                Official Event Pass
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-[2px] text-[10px] font-mono font-bold bg-[#FAFAFA] text-[#1B3A8C] border border-[#E2E2E2]">
              CONFIRMED
            </span>
          </div>

          {/* Ticket Body */}
          <div className="py-4 space-y-3.5">
            <div>
              <p className="text-[10px] uppercase font-bold text-univ-muted tracking-wider">
                Event
              </p>
              <h5 className="font-heading font-medium text-base text-univ-text leading-snug mt-0.5">
                {registration.eventTitle}
              </h5>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-[10px] uppercase font-bold text-univ-muted">Date & Time</p>
                <p className="text-univ-text font-medium mt-0.5">
                  {formatDateRange(registration.eventStartDate)}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-univ-muted">Venue</p>
                <p className="text-univ-text font-medium truncate mt-0.5">
                  {registration.eventVenue}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-3 border-t border-[#E2E2E2]">
              <div>
                <p className="text-[10px] uppercase font-bold text-univ-muted">Attendee</p>
                <p className="text-univ-text font-semibold truncate mt-0.5">
                  {registration.studentName}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-univ-muted">Student ID</p>
                <p className="font-mono text-[#1B3A8C] font-bold mt-0.5">
                  {registration.studentId}
                </p>
              </div>
            </div>
          </div>

          {/* Ticket Footer / Verification Code */}
          <div className="pt-3 border-t border-dashed border-[#E2E2E2] flex items-center justify-between bg-[#FAFAFA] -mx-5 -mb-5 p-4 rounded-b-[2px]">
            <div>
              <p className="text-[9px] uppercase font-bold text-univ-muted tracking-wider">Pass Verification Code</p>
              <p className="text-sm font-mono font-bold tracking-wider text-univ-text">
                {registration.ticketCode}
              </p>
            </div>
            <div className="w-10 h-10 rounded-[2px] bg-white border border-[#E2E2E2] flex items-center justify-center text-univ-text">
              <QrCode className="w-6 h-6 text-univ-text" />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-center pt-2">
          <Button variant="primary" size="md" onClick={onClose} className="w-full">
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}
