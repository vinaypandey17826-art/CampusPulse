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
  Ticket,
  Search,
} from 'lucide-react';

export function Navbar() {
  const { isAdmin } = useAuth();
  const { bookmarkedIds, registrations } = useEvents();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const activeLinkClass = ({ isActive }) =>
    `flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
      isActive
        ? 'text-[#1B3A8C] border-b-2 border-[#1B3A8C]'
        : 'text-[#6B6B6B] hover:text-[#111111] border-b-2 border-transparent'
    }`;

  const mobileLinkClass = ({ isActive }) =>
    `flex items-center justify-between px-4 py-3 text-xs font-bold uppercase tracking-wider border-b border-[#E2E2E2] ${
      isActive
        ? 'bg-[#FAFAFA] text-[#1B3A8C]'
        : 'text-[#6B6B6B] hover:text-[#111111] hover:bg-[#FAFAFA]'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E2E2E2] transition-colors">
      {isAdmin && (
        <div className="bg-[#2B2B2B] text-white text-[11px] font-medium py-1 px-4 text-center tracking-wider uppercase flex items-center justify-center gap-2">
          <Shield className="w-3.5 h-3.5 text-amber-400" />
          <span>Administrator Mode Active — Manage, Edit and Publish Events</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Wordmark (Step 3: College Branding) */}
          <Link to="/" className="flex items-center gap-3 group">
            {/* Logo Image Placeholder spot */}
            <div
              className="w-11 h-11 border border-[#E2E2E2] bg-[#FAFAFA] flex items-center justify-center text-[10px] font-bold text-[#1B3A8C] tracking-tighter shrink-0 rounded-[2px]"
              title="Logo Image Placeholder (File will be added later)"
            >
              <span className="font-heading font-black text-xs">ABES</span>
            </div>

            <div className="leading-tight">
              <div className="font-heading font-bold text-base tracking-tight text-[#111111] uppercase">
                ABES
              </div>
              <div className="text-[11px] font-medium uppercase tracking-wider text-[#6B6B6B] -mt-0.5">
                Engineering College
              </div>
              <div className="text-[9px] font-bold uppercase tracking-widest text-[#1B3A8C] mt-0.5">
                Affiliated to AKTU
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLink to="/" end className={activeLinkClass}>
              <Compass className="w-3.5 h-3.5" />
              <span>Discover</span>
            </NavLink>

            <NavLink to="/events" className={activeLinkClass}>
              <Calendar className="w-3.5 h-3.5" />
              <span>Events</span>
            </NavLink>

            <NavLink to="/my-registrations" className={activeLinkClass}>
              <Ticket className="w-3.5 h-3.5" />
              <span>My Registrations</span>
              {registrations.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-[#1B3A8C] text-white rounded-[2px]">
                  {registrations.length}
                </span>
              )}
            </NavLink>

            <NavLink to="/saved-events" className={activeLinkClass}>
              <Bookmark className="w-3.5 h-3.5" />
              <span>Saved Events</span>
              {bookmarkedIds.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-[#2B2B2B] text-white rounded-[2px]">
                  {bookmarkedIds.length}
                </span>
              )}
            </NavLink>

            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                    isActive
                      ? 'text-[#1B3A8C] border-b-2 border-[#1B3A8C]'
                      : 'text-[#6B6B6B] hover:text-[#111111] border-b-2 border-transparent'
                  }`
                }
              >
                <Shield className="w-3.5 h-3.5 text-[#1B3A8C]" />
                <span>Admin Console</span>
              </NavLink>
            )}
          </nav>

          {/* Right Action Bar */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate('/events')}
              className="p-2 text-[#6B6B6B] hover:text-[#111111] hover:bg-[#FAFAFA] border border-transparent hover:border-[#E2E2E2] rounded-[2px] transition-colors"
              title="Search Events"
              aria-label="Search Events"
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
              className="p-2 border border-[#E2E2E2] rounded-[2px] text-[#111111] hover:bg-[#FAFAFA]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E2E2E2] bg-white">
          <NavLink
            to="/"
            end
            onClick={() => setMobileMenuOpen(false)}
            className={mobileLinkClass}
          >
            <div className="flex items-center gap-2.5">
              <Compass className="w-4 h-4" />
              <span>Discover</span>
            </div>
          </NavLink>

          <NavLink
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileLinkClass}
          >
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4" />
              <span>Events</span>
            </div>
          </NavLink>

          <NavLink
            to="/my-registrations"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileLinkClass}
          >
            <div className="flex items-center gap-2.5">
              <Ticket className="w-4 h-4" />
              <span>My Registrations</span>
            </div>
            {registrations.length > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#1B3A8C] text-white rounded-[2px]">
                {registrations.length}
              </span>
            )}
          </NavLink>

          <NavLink
            to="/saved-events"
            onClick={() => setMobileMenuOpen(false)}
            className={mobileLinkClass}
          >
            <div className="flex items-center gap-2.5">
              <Bookmark className="w-4 h-4" />
              <span>Saved Events</span>
            </div>
            {bookmarkedIds.length > 0 && (
              <span className="px-1.5 py-0.5 text-[10px] font-bold bg-[#2B2B2B] text-white rounded-[2px]">
                {bookmarkedIds.length}
              </span>
            )}
          </NavLink>

          {isAdmin && (
            <NavLink
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className={mobileLinkClass}
            >
              <div className="flex items-center gap-2.5 text-[#1B3A8C]">
                <Shield className="w-4 h-4" />
                <span>Admin Console</span>
              </div>
            </NavLink>
          )}
        </div>
      )}
    </header>
  );
}
