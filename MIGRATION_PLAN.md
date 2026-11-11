# CampusConnect: Supabase & PostgreSQL Migration Plan

This document details the architectural plan to transition CampusConnect from client-side `localStorage` to **Supabase** (PostgreSQL + Supabase Auth + Row-Level Security).

---

## 1. Architectural Stack

* **Database Engine:** PostgreSQL 15+ hosted on Supabase
* **Authentication:** Supabase Auth (Email/Password & Magic Link, generating signed JWT tokens)
* **Access Control:** PostgreSQL Row Level Security (RLS) enforced at the database layer
* **Client Interface:** `@supabase/supabase-js` using standard HTTPS / WebSockets
* **Security Principle:** Frontend executes **only** using the public/publishable `anon` key (`VITE_SUPABASE_ANON_KEY`). The elevated `service_role` key is **never** bundled or exposed in client-side code.

---

## 2. Database Schema & Relational Modeling

```
+-------------------------------------------------------------+
|                          auth.users                         |
|  (Managed internally by Supabase Auth with encrypted pw)   |
+-------------------------------------------------------------+
                              | 1:1
                              v
+-------------------------------------------------------------+
|                          profiles                           |
|-------------------------------------------------------------|
| id (UUID, PK) ----------> references auth.users(id)         |
| name (TEXT)                                                 |
| email (TEXT, UNIQUE)                                        |
| role (TEXT) ------------> CHECK (role IN ('student','admin')|
| student_id (TEXT)                                           |
| created_at (TIMESTAMPTZ)                                    |
+-------------------------------------------------------------+
       |                                              |
       | 1:N                                          | 1:N
       v                                              v
+------------------------------------+   +------------------------------------+
|            registrations           |   |             bookmarks              |
|------------------------------------|   |------------------------------------|
| id (UUID, PK)                      |   | id (UUID, PK)                      |
| user_id (UUID, FK -> profiles.id)  |   | user_id (UUID, FK -> profiles.id)  |
| event_id (UUID, FK -> events.id)   |   | event_id (UUID, FK -> events.id)   |
| ticket_code (TEXT, UNIQUE)         |   | created_at (TIMESTAMPTZ)           |
| status (TEXT)                      |   +------------------------------------+
| created_at (TIMESTAMPTZ)           |                  ^
+------------------------------------+                  |
                 |                                      |
                 | N:1                                  | N:1
                 +-------------------+  +---------------+
                                     |  |
                                     v  v
                    +------------------------------------+
                    |               events               |
                    |------------------------------------|
                    | id (UUID, PK)                      |
                    | title (TEXT)                       |
                    | description (TEXT)                 |
                    | category (TEXT)                    |
                    | date (TIMESTAMPTZ)                 |
                    | end_date (TIMESTAMPTZ)             |
                    | venue (TEXT)                       |
                    | banner_url (TEXT)                  |
                    | capacity (INT)                     |
                    | organizer_name (TEXT)              |
                    | created_by (UUID, FK->profiles.id) |
                    | created_at (TIMESTAMPTZ)           |
                    +------------------------------------+
```

---

## 3. SQL DDL & Table Specifications

```sql
-- 1. Profiles Table (Linked 1:1 with Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  student_id TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- 2. Events Table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('technical', 'cultural', 'sports', 'workshop')),
  date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  venue TEXT NOT NULL,
  banner_url TEXT,
  capacity INT NOT NULL DEFAULT 50 CHECK (capacity > 0),
  organizer_name TEXT NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  CONSTRAINT valid_date_range CHECK (end_date >= date)
);

-- 3. Registrations Table
CREATE TABLE public.registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  ticket_code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  -- Enforces that a user cannot register twice for the same event
  CONSTRAINT unique_user_event_registration UNIQUE (user_id, event_id)
);

-- 4. Bookmarks Table
CREATE TABLE public.bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  -- Enforces that an event can only be bookmarked once per user
  CONSTRAINT unique_user_event_bookmark UNIQUE (user_id, event_id)
);
```

---

## 4. Keys & Relational Cardinality

1. **Primary Keys:** Every record uses standard `UUID` v4 identifiers as primary keys (`id`).
2. **Foreign Keys:**
   * `profiles.id` $\rightarrow$ `auth.users(id)`: One-to-one link extending authenticated credentials.
   * `registrations.user_id` $\rightarrow$ `profiles.id` & `registrations.event_id` $\rightarrow$ `events.id`.
   * `bookmarks.user_id` $\rightarrow$ `profiles.id` & `bookmarks.event_id` $\rightarrow$ `events.id`.
3. **One-to-Many Relationships:**
   * One **Profile** has many **Registrations**.
   * One **Profile** has many **Bookmarks**.
   * One **Event** has many **Registrations** and **Bookmarks**.
4. **Many-to-Many Relationships:**
   * `registrations` acts as the join table bridging `profiles` $\leftrightarrow$ `events`.
   * `bookmarks` acts as the join table bridging `profiles` $\leftrightarrow$ `events`.

---

## 5. Authentication & Authorization Workflow

1. **Sign Up / Sign In:** User logs in via `supabase.auth.signInWithPassword({ email, password })`. Supabase issues a cryptographically signed JWT.
2. **Profile Creation Trigger:** A PostgreSQL trigger automatically creates a row in `public.profiles` whenever a new user signs up in `auth.users`:
   ```sql
   CREATE OR REPLACE FUNCTION public.handle_new_user()
   RETURNS TRIGGER AS $$
   BEGIN
     INSERT INTO public.profiles (id, name, email, role, student_id)
     VALUES (
       NEW.id,
       COALESCE(NEW.raw_user_meta_data->>'name', 'Student'),
       NEW.email,
       COALESCE(NEW.raw_user_meta_data->>'role', 'student'),
       NEW.raw_user_meta_data->>'student_id'
     );
     RETURN NEW;
   END;
   $$ LANGUAGE plpgsql SECURITY DEFINER;

   CREATE TRIGGER on_auth_user_created
     AFTER INSERT ON auth.users
     FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
   ```
3. **Admin Verification Helper Function:** To avoid recursive RLS checks, a security definer helper checks whether the active session user is an administrator:
   ```sql
   CREATE OR REPLACE FUNCTION public.is_admin()
   RETURNS BOOLEAN AS $$
     SELECT EXISTS (
       SELECT 1 FROM public.profiles
       WHERE id = auth.uid() AND role = 'admin'
     );
   $$ LANGUAGE sql SECURITY DEFINER;
   ```

---

## 6. Row Level Security (RLS) Policies

All tables have RLS enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`). Admin rights are enforced **at the database level**, ensuring API manipulation cannot bypass security.

### 6.1 `profiles` Table
```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can view their own profile; admins can view all profiles
CREATE POLICY "Users can view own profile or admins view all"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR public.is_admin());

-- Users can only update their own non-role profile fields
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);
```

### 6.2 `events` Table
```sql
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Anyone (even unauthenticated guests) can view events
CREATE POLICY "Public read access for events"
  ON public.events FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only verified administrators can insert, update, or delete events
CREATE POLICY "Admins can insert events"
  ON public.events FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update events"
  ON public.events FOR UPDATE
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can delete events"
  ON public.events FOR DELETE
  TO authenticated
  USING (public.is_admin());
```

### 6.3 `registrations` Table
```sql
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Students view their own registrations; admins can view all registrations
CREATE POLICY "Users can view own registrations or admin views all"
  ON public.registrations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

-- Students can insert registrations for themselves only
CREATE POLICY "Students can register themselves"
  ON public.registrations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Students can cancel (delete) their own registrations; admins can delete any
CREATE POLICY "Users can cancel own registrations"
  ON public.registrations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());
```

### 6.4 `bookmarks` Table
```sql
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

-- Users can only view and mutate their own bookmarks
CREATE POLICY "Users manage own bookmarks"
  ON public.bookmarks FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

---

## 7. Client-Side React Integration

Because CampusConnect was built with an isolated service layer (`eventService`, `registrationService`, `bookmarkService`), migrating from `localStorage` to Supabase requires **zero changes** to React UI components.

### 7.1 Supabase Client Initialization (`src/services/supabaseClient.js`)
```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only publishable anon key is used
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 7.2 Service Layer Swap (`src/services/eventService.js`)
```javascript
import { supabase } from './supabaseClient';

export const eventService = {
  async getAllEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*, registrations(count)')
      .order('date', { ascending: true });

    if (error) throw error;
    return data;
  },

  async createEvent(eventData) {
    const { data, error } = await supabase
      .from('events')
      .insert([eventData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteEvent(id) {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};
```

---

## 8. Security Guarantees & Best Practices

1. **No Secret Leaks:** Only `VITE_SUPABASE_ANON_KEY` is placed in client environment files. The `service_role` key is strictly kept in secure backend environments.
2. **Database-Enforced Authorization:** Even if an attacker uses the browser console to call `supabase.from('events').delete().eq('id', '...')`, the PostgreSQL RLS policy checks `is_admin()` and denies the request with an HTTP 403 Forbidden.
3. **Data Integrity:** Capacity limits and unique constraints (`unique_user_event_registration`) prevent race-condition ticket overflows and duplicate registrations at the database level.
