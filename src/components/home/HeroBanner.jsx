import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../common/Button';
import { Sparkles, Calendar, ArrowRight, ShieldCheck, Ticket } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export function HeroBanner({ totalEvents = 0, totalRegistrations = 0 }) {
  const { isAdmin } = useAuth();

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-indigo-900/40">
      {/* Decorative blurred backdrop orbs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-3xl space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-brand-300 text-xs font-bold border border-white/15 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>The University Experience, Unified</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
          Discover, register & thrive in <span className="bg-gradient-to-r from-brand-300 via-indigo-200 to-purple-300 bg-clip-text text-transparent">campus events.</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
          No more lost WhatsApp posters or broken registration forms. CampusConnect is your single hub to explore hackathons, cultural festivals, tech workshops, and sports tournaments.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Link to="/events">
            <Button variant="primary" size="lg" className="shadow-lg shadow-brand-500/30">
              <span>Explore Upcoming Events</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>

          <Link to="/my-events">
            <Button
              variant="outline"
              size="lg"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 backdrop-blur-sm"
            >
              <Ticket className="w-4 h-4" />
              <span>View My Passes</span>
            </Button>
          </Link>
        </div>

        {/* Metrics Row */}
        <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 sm:gap-10 text-xs text-slate-300">
          <div>
            <strong className="text-xl font-extrabold text-white block">
              {totalEvents}+
            </strong>
            <span>Active Campus Events</span>
          </div>
          <div className="h-8 w-px bg-white/15 hidden sm:block" />
          <div>
            <strong className="text-xl font-extrabold text-white block">
              {totalRegistrations}+
            </strong>
            <span>Student RSVPs</span>
          </div>
          <div className="h-8 w-px bg-white/15 hidden sm:block" />
          <div>
            <strong className="text-xl font-extrabold text-white block">
              4 Tracks
            </strong>
            <span>Tech, Arts, Sports & Workshop</span>
          </div>
        </div>
      </div>
    </div>
  );
}
