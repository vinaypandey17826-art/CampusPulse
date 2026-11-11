import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { formatDateRange } from '../../utils/formatters';
import { Sparkles, Calendar, MapPin, User, CheckCircle2, Ticket, QrCode } from 'lucide-react';

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
      title="Registration Confirmed!"
      maxWidth="max-w-md"
    >
      <div className="space-y-6">
        {/* Success Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h4 className="text-lg font-bold text-slate-900">You're on the guest list!</h4>
          <p className="text-xs text-slate-500">
            A copy of this digital event pass has been added to your Passes tab.
          </p>
        </div>

        {/* Digital Boarding Pass Ticket */}
        <div className="relative rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-5 shadow-xl border border-indigo-900/50 overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute -right-12 -top-12 w-32 h-32 bg-brand-500/20 rounded-full blur-2xl" />

          {/* Ticket Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-brand-400" />
              <span className="text-xs font-bold tracking-wider uppercase text-slate-300">
                Official Event Pass
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              CONFIRMED
            </span>
          </div>

          {/* Ticket Body */}
          <div className="py-4 space-y-3">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Event
              </p>
              <h5 className="font-bold text-base text-white leading-snug">
                {registration.eventTitle}
              </h5>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Date & Time</p>
                <p className="text-slate-200 font-medium">
                  {formatDateRange(registration.eventStartDate)}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Venue</p>
                <p className="text-slate-200 font-medium truncate">
                  {registration.eventVenue}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-white/10">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Attendee</p>
                <p className="text-white font-semibold truncate">
                  {registration.studentName}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Student ID</p>
                <p className="font-mono text-brand-300 font-bold">
                  {registration.studentId}
                </p>
              </div>
            </div>
          </div>

          {/* Ticket Footer / Verification Code */}
          <div className="pt-3 border-t border-dashed border-white/20 flex items-center justify-between">
            <div>
              <p className="text-[9px] uppercase font-bold text-slate-400">Ticket Pass Code</p>
              <p className="text-sm font-mono font-extrabold tracking-widest text-brand-300">
                {registration.ticketCode}
              </p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white/80">
              <QrCode className="w-6 h-6" />
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
