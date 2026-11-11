import React, { useState } from 'react';
import { useEvents } from '../context/EventContext';
import { RegisteredEventsList } from '../components/user/RegisteredEventsList';
import { Ticket } from 'lucide-react';

export function MyRegistrationsPage() {
  const { registrations, cancelRegistration } = useEvents();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold border border-brand-100 mb-2">
          <Ticket className="w-3.5 h-3.5" />
          <span>Student Admission Passes</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          My Registrations
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Review your confirmed event registrations and view digital access passes.
        </p>
      </div>

      {/* Registrations List / Empty State */}
      <RegisteredEventsList
        registrations={registrations}
        onCancelRegistration={cancelRegistration}
      />
    </div>
  );
}

export default MyRegistrationsPage;
