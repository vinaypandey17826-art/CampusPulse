# CampusConnect - College Event Discovery & Management Portal

CampusConnect is a centralized web application designed for universities to streamline event discovery, student registrations, ticketing, and administrative event lifecycle management.

---

## 🚀 Key Features

### For Students
* **Discover & Explore:** Browse upcoming hackathons, cultural fests, sports championships, guest lectures, and hands-on workshops.
* **Instant Search & Multi-Track Filtering:** Filter by category (*Technical, Cultural, Sports, Academic, Workshops*) or search by title, topic, organizer, or venue with debounced real-time performance.
* **Live Capacity Indicators:** Visual progress bars displaying real-time available spots, urgent warning badges when spots are running low, and "Sold Out" badges when events reach capacity.
* **One-Click RSVP & Digital Passes:** Self-service registration with input validation, duplicate prevention, and digital boarding-pass style tickets featuring QR codes, timestamps, and confirmation codes.
* **Personal Portal ("My Passes"):** Track your registered event tickets and saved bookmarks in one unified place, with the ability to cancel RSVPs and release seats back to the community.
* **Interactive Bookmarking:** Save upcoming events to your favorites list with optimistic UI updates.

### For Administrators
* **Role Switcher:** Easily toggle between **Student Mode** and **Admin Mode** right from the navigation bar.
* **Executive Metrics Dashboard:** Monitor active events, total registrations, campus seating capacity, and overall fill rates.
* **Complete Event CRUD:**
  * **Create:** Publish new campus events with custom banner images (or sample presets), dates, venues, categories, agendas, and seating capacities.
  * **Edit:** Modify event details at any time while preserving student registrations.
  * **Delete:** Safely remove events with two-step confirmation safeguards.
  * **Attendee Roster:** View complete lists of registered student names, emails, and ticket codes for any event.

---

## 🛠️ Technology Stack
* **Frontend:** React 18
* **Build Tool:** Vite
* **Routing:** React Router v6
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **Delight & Animations:** Canvas-Confetti, Tailwind Animation Transitions
* **Storage Layer:** Decoupled `localStorage` service architecture (ready for seamless drop-in Supabase integration)

---

## 💻 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

---

## 📁 Architecture Overview
```
src/
├── components/
│   ├── common/         # Button, Modal, ConfirmDialog, Badge, RoleSwitcher, EmptyState
│   ├── layout/         # Navbar, Footer, AppLayout
│   ├── home/           # HeroBanner, CategoryHighlights
│   ├── events/         # EventCard, EventGrid, SearchBar, CategoryFilter, CapacityIndicator, Modals
│   ├── user/           # RegisteredEventsList, BookmarkedEventsList
│   └── admin/          # AdminStats, AdminEventTable, EventFormModal
├── context/            # AuthContext (Role Switcher), EventContext, ToastContext
├── data/               # Rich campus seed events
├── hooks/              # useDebounce
├── pages/              # HomePage, EventsPage, EventDetailPage, MyEventsPage, AdminPage, NotFoundPage
├── services/           # eventService, registrationService, bookmarkService, storageService
└── utils/              # formatters, validators
```
