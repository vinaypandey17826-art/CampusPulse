import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { useDebounce } from '../hooks/useDebounce';
import { SearchBar } from '../components/events/SearchBar';
import { CategoryFilter } from '../components/events/CategoryFilter';
import { DateSortDropdown } from '../components/events/DateSortDropdown';
import { EventGrid } from '../components/events/EventGrid';
import { RegistrationModal } from '../components/events/RegistrationModal';
import { TicketPassModal } from '../components/events/TicketPassModal';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { CATEGORIES } from '../data/seedEvents';

export function EventsPage() {
  const { events, registerForEvent } = useEvents();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filters State
  const initialCategory = searchParams.get('category') || 'all';
  const initialQuery = searchParams.get('q') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('date-asc');

  // Registration modal states
  const [selectedEventForReg, setSelectedEventForReg] = useState(null);
  const [issuedPass, setIssuedPass] = useState(null);

  // Debounce search query for smooth filtering
  const debouncedQuery = useDebounce(searchQuery, 200);

  // Keep URL search params in sync
  useEffect(() => {
    const params = {};
    if (selectedCategory && selectedCategory !== 'all') {
      params.category = selectedCategory;
    }
    if (debouncedQuery.trim()) {
      params.q = debouncedQuery.trim();
    }
    setSearchParams(params, { replace: true });
  }, [selectedCategory, debouncedQuery, setSearchParams]);

  // Helper to match category (handles case and singular/plural workshop)
  const matchesCategory = (evtCat, selectedCat) => {
    if (!selectedCat || selectedCat === 'all') return true;
    const normEvt = (evtCat || '').toLowerCase().trim();
    const normSel = selectedCat.toLowerCase().trim();
    if (normEvt === normSel) return true;
    if ((normSel === 'workshop' || normSel === 'workshops') && (normEvt === 'workshop' || normEvt === 'workshops')) {
      return true;
    }
    return false;
  };

  // Compute event counts per category
  const eventCounts = useMemo(() => {
    const counts = { all: events.length };
    CATEGORIES.forEach((cat) => {
      if (cat.id !== 'all') {
        counts[cat.id] = events.filter((e) => matchesCategory(e.category, cat.id)).length;
      }
    });
    return counts;
  }, [events]);

  // Filter and Sort Events
  const filteredEvents = useMemo(() => {
    return events
      .filter((evt) => {
        // 1. Category filter (Technical, Cultural, Sports, Workshop, All)
        if (!matchesCategory(evt.category, selectedCategory)) {
          return false;
        }

        // 2. Search by event title (case-insensitive, partial match)
        // Safely treats empty, undefined or null search values, and events with missing titles
        const safeQuery = (debouncedQuery || '').toString().toLowerCase().trim();
        if (safeQuery.length > 0) {
          const safeTitle = (evt?.title || '').toString().toLowerCase();
          if (!safeTitle.includes(safeQuery)) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date-asc') {
          return new Date(a.startDate) - new Date(b.startDate);
        }
        if (sortBy === 'date-desc') {
          return new Date(b.startDate) - new Date(a.startDate);
        }
        if (sortBy === 'popular') {
          return b.registeredCount - a.registeredCount;
        }
        if (sortBy === 'title-asc') {
          return a.title.localeCompare(b.title);
        }
        return 0;
      });
  }, [events, selectedCategory, debouncedQuery, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('date-asc');
  };

  const handleRegistrationSubmit = async (eventId, studentData) => {
    const pass = await registerForEvent(eventId, studentData);
    setIssuedPass(pass);
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb on inner page (Step 3) */}
      <Breadcrumbs items={[{ label: 'Events' }]} />

      {/* Header */}
      <div className="border-b border-[#E2E2E2] pb-4">
        <div className="text-[10px] uppercase font-bold tracking-widest text-[#1B3A8C] mb-1">
          Campus Calendar
        </div>
        <h1 className="font-heading text-2xl sm:text-4xl font-bold uppercase tracking-tight text-[#111111]">
          Events Directory
        </h1>
        <p className="text-xs text-[#6B6B6B] mt-1">
          Browse upcoming academic workshops, hackathons, sports tournaments and cultural programs.
        </p>
      </div>

      {/* Control Bar: Search & Sort visible at top */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="w-full sm:flex-1">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search events by title..."
          />
        </div>
        <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-2">
          <DateSortDropdown sortBy={sortBy} onSortChange={setSortBy} />
        </div>
      </div>

      {/* Category Pills as Flat Tags with active in #1B3A8C */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        eventCounts={eventCounts}
      />

      {/* Active Filter Status & Count */}
      <div className="flex items-center justify-between text-xs text-[#6B6B6B] pb-2 border-b border-[#E2E2E2]">
        <span>
          Showing <strong className="text-[#111111]">{filteredEvents.length}</strong> of{' '}
          {events.length} total events
          {selectedCategory !== 'all' && ` in ${selectedCategory}`}
          {debouncedQuery && ` matching "${debouncedQuery}"`}
        </span>

        {(selectedCategory !== 'all' || debouncedQuery) && (
          <button
            onClick={handleClearFilters}
            className="font-bold uppercase tracking-wider text-[11px] text-[#1B3A8C] hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* 4-column Grid */}
      <EventGrid
        events={filteredEvents}
        onRegisterClick={(target) => setSelectedEventForReg(target)}
        onClearFilters={handleClearFilters}
        searchQuery={debouncedQuery}
        selectedCategory={selectedCategory}
      />

      {/* Registration & Ticket Pass Modals */}
      {selectedEventForReg && (
        <RegistrationModal
          isOpen={Boolean(selectedEventForReg)}
          onClose={() => setSelectedEventForReg(null)}
          event={selectedEventForReg}
          onRegistrationSuccess={handleRegistrationSubmit}
        />
      )}

      {issuedPass && (
        <TicketPassModal
          isOpen={Boolean(issuedPass)}
          onClose={() => setIssuedPass(null)}
          registration={issuedPass}
        />
      )}
    </div>
  );
}

export default EventsPage;
