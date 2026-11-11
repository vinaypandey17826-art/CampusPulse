import React from 'react';
import { Link } from 'react-router-dom';
import { useEvents } from '../../context/EventContext';
import { RotateCcw, Mail, MapPin, Phone } from 'lucide-react';

export function Footer() {
  const { resetAllData } = useEvents();

  const handleReset = () => {
    if (window.confirm('Reset all events and registrations back to initial mock seed data?')) {
      resetAllData();
    }
  };

  return (
    <footer className="bg-white border-t border-[#E2E2E2] mt-24 text-xs text-[#6B6B6B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Column 1: College Branding */}
          <div className="space-y-3 md:col-span-1">
            <div className="leading-tight">
              <div className="font-heading font-bold text-base uppercase text-[#111111] tracking-tight">
                ABES Engineering College
              </div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-[#1B3A8C] mt-0.5">
                Affiliated to AKTU
              </div>
            </div>
            <p className="text-[#6B6B6B] leading-relaxed pt-1">
              Official campus event directory and student ticketing system for academic, technical, cultural, and sports activities.
            </p>
            <div className="pt-2">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold text-[#6B6B6B] bg-[#FAFAFA] hover:bg-[#E2E2E2] hover:text-[#111111] border border-[#E2E2E2] rounded-[2px] transition-colors"
                title="Restore default demo seed events"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Demo Data</span>
              </button>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#111111] mb-3">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-[#1B3A8C] transition-colors">
                  Discover Home
                </Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-[#1B3A8C] transition-colors">
                  All Events
                </Link>
              </li>
              <li>
                <Link to="/my-registrations" className="hover:text-[#1B3A8C] transition-colors">
                  My Registrations
                </Link>
              </li>
              <li>
                <Link to="/saved-events" className="hover:text-[#1B3A8C] transition-colors">
                  Saved Events
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-[#1B3A8C] transition-colors">
                  Admin Management
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Event Tracks */}
          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#111111] mb-3">
              Event Categories
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/events?category=technical" className="hover:text-[#1B3A8C] transition-colors">
                  Technical & Hackathons
                </Link>
              </li>
              <li>
                <Link to="/events?category=cultural" className="hover:text-[#1B3A8C] transition-colors">
                  Cultural & Showcases
                </Link>
              </li>
              <li>
                <Link to="/events?category=sports" className="hover:text-[#1B3A8C] transition-colors">
                  Sports & Tournaments
                </Link>
              </li>
              <li>
                <Link to="/events?category=workshop" className="hover:text-[#1B3A8C] transition-colors">
                  Workshops & Labs
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Placeholder */}
          <div className="space-y-2">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#111111] mb-3">
              Campus Contact
            </h4>
            <p className="flex items-start gap-2 leading-relaxed">
              <MapPin className="w-3.5 h-3.5 text-[#1B3A8C] shrink-0 mt-0.5" />
              <span>19th KM Stone, NH-09, Ghaziabad, UP 201009</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#1B3A8C] shrink-0" />
              <span>events@abes.ac.in</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#1B3A8C] shrink-0" />
              <span>+91 120 7135112</span>
            </p>
          </div>
        </div>

        <div className="border-t border-[#E2E2E2] mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#6B6B6B] gap-4">
          <p>© {new Date().getFullYear()} ABES Engineering College. All rights reserved.</p>
          <p className="text-[#6B6B6B]">Affiliated to Dr. A.P.J. Abdul Kalam Technical University, Lucknow</p>
        </div>
      </div>
    </footer>
  );
}
