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
import { CATEGORIES } from '../data/seedEvents';
import { Calendar, Filter } from 'lucide-react';

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
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Explore Campus Events
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Search, filter by track, and register for student activities across all departments.
        </p>
      </div>

      {/* Control Bar: Search & Sort */}
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

      {/* Category Pills */}
      <CategoryFilter
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        eventCounts={eventCounts}
      />

      {/* Active Filter Status & Count */}
      <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b border-slate-200/80">
        <span>
          Showing <strong className="text-slate-800">{filteredEvents.length}</strong> of{' '}
          {events.length} total events
          {selectedCategory !== 'all' && ` in ${selectedCategory}`}
          {debouncedQuery && ` matching "${debouncedQuery}"`}
        </span>

        {(selectedCategory !== 'all' || debouncedQuery) && (
          <button
            onClick={handleClearFilters}
            className="font-semibold text-brand-600 hover:text-brand-800 hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Grid */}
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
