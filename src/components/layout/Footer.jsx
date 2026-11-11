import React from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../../context/EventContext';
import { Sparkles, RotateCcw, Heart, Calendar } from 'lucide-react';

export function Footer() {
  const { resetAllData } = useEvents();

  const handleReset = () => {
    if (window.confirm('Reset all events and registrations back to initial mock seed data?')) {
      resetAllData();
    }
  };

  return (
    <footer className="bg-white border-t border-slate-200 mt-20 text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-slate-900">CampusConnect</span>
            </Link>
            <p className="text-slate-500 max-w-sm text-sm leading-relaxed">
              The centralized event discovery and registration portal for universities. Never miss a hackathon, cultural fest, or guest lecture again.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 hover:text-slate-900 rounded-lg transition-colors border border-slate-200"
                title="Restores seed events if you modified or deleted them"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo Data</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-3 uppercase tracking-wider text-xs">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-brand-600 transition-colors">
                  Campus Home
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-brand-600 transition-colors">
                  Explore Events
                </Link>
              </li>
              <li>
                <Link to="/my-events" className="hover:text-brand-600 transition-colors">
                  My Registrations & Passes
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-brand-600 transition-colors">
                  Admin Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-bold text-slate-900 text-sm mb-3 uppercase tracking-wider text-xs">
              Popular Tracks
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/events?category=technical" className="hover:text-brand-600 transition-colors">
                  Hackathons & Tech
                </Link>
              </li>
              <li>
                <Link to="/events?category=cultural" className="hover:text-brand-600 transition-colors">
                  Cultural Nights
                </Link>
              </li>
              <li>
                <Link to="/events?category=sports" className="hover:text-brand-600 transition-colors">
                  Tournaments & Sports
                </Link>
              </li>
              <li>
                <Link to="/events?category=workshop" className="hover:text-brand-600 transition-colors">
                  Masterclasses & Labs
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} CampusConnect. Built with React, Tailwind CSS, & Vite.</p>
          <p className="flex items-center gap-1">
            <span>Crafted for collegiate communities</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
