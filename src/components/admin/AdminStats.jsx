import React from 'react';
import { Calendar, Users, Ticket, TrendingUp } from 'lucide-react';
import { calculateCapacityPercentage } from '../../utils/formatters';

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
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 border-indigo-100',
    },
    {
      label: 'Total RSVPs Issued',
      value: totalRegistrations,
      icon: Ticket,
      color: 'text-brand-600',
      bg: 'bg-brand-50 border-brand-100',
    },
    {
      label: 'Total Seat Capacity',
      value: totalCapacity.toLocaleString(),
      icon: Users,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-100',
    },
    {
      label: 'Overall Fill Rate',
      value: `${avgOccupancy}%`,
      icon: TrendingUp,
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-100',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                {item.label}
              </p>
              <h4 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {item.value}
              </h4>
            </div>
            <div className={`w-12 h-12 rounded-2xl ${item.bg} border flex items-center justify-center ${item.color}`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        );
      })}
    </div>
  );
}
