import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEvents } from '../../context/EventContext';
import { RoleSwitcher } from '../common/RoleSwitcher';
import {
  Compass,
  Calendar,
  Bookmark,
  Shield,
  Menu,
  X,
  Sparkles,
  Ticket,
  Search,
} from 'lucide-react';

export function Navbar() {
  const { isAdmin } = useAuth();
  const { bookmarkedIds, registrations } = useEvents();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const activeLinkClass = ({ isActive }) =>
    `flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
      isActive
        ? 'bg-brand-50 text-brand-700'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold ${
      isActive
        ? 'bg-brand-50 text-brand-700'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      {isAdmin && (
        <div className="bg-amber-500 text-white text-xs font-bold py-1 px-4 text-center tracking-wide flex items-center justify-center gap-2">
          <Shield className="w-3.5 h-3.5" />
          <span>ADMINISTRATOR MODE ACTIVE — You have full permissions to create, edit, and delete events.</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-brand-900 to-indigo-800 bg-clip-text text-transparent">
                Campus<span className="text-brand-600">Connect</span>
              </span>
              <span className="hidden sm:block text-[10px] font-semibold tracking-wider text-slate-400 uppercase -mt-1">
                University Event Hub
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={activeLinkClass}>
              <Compass className="w-4 h-4" />
              <span>Discover</span>
            </NavLink>

            <NavLink to="/events" className={activeLinkClass}>
              <Calendar className="w-4 h-4" />
              <span>Events</span>
            </NavLink>

            <NavLink to="/my-registrations" className={activeLinkClass}>
              <Ticket className="w-4 h-4" />
              <span>My Registrations</span>
              {registrations.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[11px] font-bold rounded-full bg-brand-100 text-brand-700">
                  {registrations.length}
                </span>
              )}
            </NavLink>

            <NavLink to="/saved-events" className={activeLinkClass}>
              <Bookmark className="w-4 h-4" />
              <span>Saved Events</span>
              {bookmarkedIds.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[11px] font-bold rounded-full bg-rose-100 text-rose-700">
                  {bookmarkedIds.length}
                </span>
              )}
            </NavLink>

            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-amber-100 text-amber-900 font-bold'
                      : 'text-amber-800 hover:bg-amber-50'
                  }`
                }
              >
                <Shield className="w-4 h-4 text-amber-600" />
                <span>Admin Console</span>
              </NavLink>
            )}
          </nav>

          {/* Right Action Bar */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate('/events')}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              title="Quick Search"
            >
              <Search className="w-4 h-4" />
            </button>

            <RoleSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <RoleSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-1">
          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className={mobileLinkClass}
          >
            <div className="flex items-center gap-3">
              <Compass className="w-5 h-5" />
              <span>Discover</span>
            </div>
          </NavLink>

          <NavLink
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileLinkClass}
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5" />
              <span>Events</span>
            </div>
          </NavLink>

          <NavLink
            to="/my-registrations"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileLinkClass}
          >
            <div className="flex items-center gap-3">
              <Ticket className="w-5 h-5" />
              <span>My Registrations</span>
            </div>
            {registrations.length > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-brand-100 text-brand-700">
                {registrations.length}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/saved-events"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileLinkClass}
          >
            <div className="flex items-center gap-3">
              <Bookmark className="w-5 h-5" />
              <span>Saved Events</span>
            </div>
            {bookmarkedIds.length > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-rose-100 text-rose-700">
                {bookmarkedIds.length}
              </span>
            )}
          </NavLink>

          {isAdmin && (
            <NavLink
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-4 py-3 rounded-xl text-base font-bold ${
                  isActive ? 'bg-amber-100 text-amber-900' : 'text-amber-800 bg-amber-50/70'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-amber-600" />
                <span>Admin Console</span>
              </div>
            </NavLink>
          )}
        </div>
      )}
    </header>
  );
}
