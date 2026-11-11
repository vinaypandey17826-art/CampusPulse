import React from 'react';
import { useEvents } from '../context/EventContext';
import { RegisteredEventsList } from '../components/user/RegisteredEventsList';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

export function MyRegistrationsPage() {
  const { registrations, cancelRegistration } = useEvents();

  return (
    <div className="space-y-6">
      {/* Breadcrumb (Step 3) */}
      <Breadcrumbs items={[{ label: 'My Registrations' }]} />

      {/* Header */}
      <div className="border-b border-[#E2E2E2] pb-4">
        <div className="text-[10px] uppercase font-bold tracking-widest text-[#1B3A8C] mb-1">
          Student Portal
        </div>
        <h1 className="font-heading text-2xl sm:text-4xl font-bold uppercase tracking-tight text-[#111111]">
          My Registrations
        </h1>
        <p className="text-xs text-[#6B6B6B] mt-1">
          Review your confirmed event admission passes and manage seat reservations.
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
