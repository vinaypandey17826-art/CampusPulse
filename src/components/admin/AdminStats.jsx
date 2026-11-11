import React from 'react';
import { Calendar, Users, Ticket, TrendingUp } from 'lucide-react';

export function AdminStats({ events = [], registrations = [] }) {
  const totalEvents = events.length;
  const totalRegistrations = registrations.length;
  const totalCapacity = events.reduce((sum, e) => sum + (Number(e.capacity) || 0), 0);
  const avgOccupancy = totalCapacity > 0 ? Math.round((totalRegistrations / totalCapacity) * 100) : 0;

  const stats = [
    {
      label: 'Published Events',
      value: totalEvents,
      icon: Calendar,
    },
    {
      label: 'Total RSVPs Issued',
      value: totalRegistrations,
      icon: Ticket,
    },
    {
      label: 'Total Seat Capacity',
      value: totalCapacity.toLocaleString(),
      icon: Users,
    },
    {
      label: 'Overall Fill Rate',
      value: `${avgOccupancy}%`,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="p-5 bg-white border border-[#E2E2E2] rounded-[2px] flex items-center justify-between"
          >
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#6B6B6B] mb-1">
                {item.label}
              </p>
              <h4 className="font-heading text-2xl font-bold text-[#111111] tracking-tight">
                {item.value}
              </h4>
            </div>
            <div className="w-9 h-9 rounded-[2px] bg-[#FAFAFA] border border-[#E2E2E2] flex items-center justify-center text-[#1B3A8C]">
              <Icon className="w-4 h-4" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
