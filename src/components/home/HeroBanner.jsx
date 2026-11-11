import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../common/Button';
import { ArrowRight, Ticket } from 'lucide-react';

export function HeroBanner({ totalEvents = 0, totalRegistrations = 0 }) {
  return (
    <div className="relative overflow-hidden bg-white border border-[#E2E2E2] rounded-[2px] p-8 sm:p-12 lg:p-16 mb-12">
      {/* Large outlined display word "Events" behind/beside the heading (Reference style) */}
      <div
        aria-hidden="true"
        className="stroke-text font-heading text-7xl sm:text-9xl lg:text-[11rem] font-bold uppercase select-none absolute right-2 sm:right-8 -bottom-4 sm:bottom-0 opacity-40 pointer-events-none leading-none tracking-tighter"
      >
        Events
      </div>

      <div className="relative max-w-2xl space-y-6 z-10">
        <div className="text-[11px] font-bold uppercase tracking-widest text-[#1B3A8C]">
          University Event Portal
        </div>

        {/* Headline without awkward word wrap */}
        <h1 className="font-heading text-3xl sm:text-5xl lg:text-[3.25rem] font-medium tracking-tight text-[#111111] leading-[1.12] [text-wrap:balance]">
          Events at ABES Engineering College
        </h1>

        <p className="text-sm sm:text-base text-[#6B6B6B] leading-relaxed max-w-xl font-normal">
          Hackathons, cultural fests, sports and workshops. Affiliated to Dr. A.P.J. Abdul Kalam Technical University (AKTU).
        </p>

        {/* CTA Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link to="/events">
            <Button variant="primary" size="md">
              <span>Explore All Events</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>

          <Link to="/my-registrations">
            <Button variant="outline" size="md">
              <Ticket className="w-3.5 h-3.5" />
              <span>My Registrations</span>
            </Button>
          </Link>
        </div>

        {/* Stats Row: Only displays real stats > 0; hides any showing "0+" */}
        <div className="pt-6 border-t border-[#E2E2E2] flex flex-wrap items-center gap-8 text-xs text-[#6B6B6B]">
          {totalEvents > 0 && (
            <div>
              <strong className="font-heading text-2xl font-bold text-[#111111] block">
                {totalEvents}+
              </strong>
              <span className="uppercase text-[10px] tracking-wider font-semibold text-[#6B6B6B]">
                Active Campus Events
              </span>
            </div>
          )}

          {totalRegistrations > 0 && (
            <div>
              <strong className="font-heading text-2xl font-bold text-[#111111] block">
                {totalRegistrations}+
              </strong>
              <span className="uppercase text-[10px] tracking-wider font-semibold text-[#6B6B6B]">
                Student RSVPs
              </span>
            </div>
          )}

          <div>
            <strong className="font-heading text-2xl font-bold text-[#111111] block">
              4 Tracks
            </strong>
            <span className="uppercase text-[10px] tracking-wider font-semibold text-[#6B6B6B]">
              Tech, Arts, Sports & Workshop
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
