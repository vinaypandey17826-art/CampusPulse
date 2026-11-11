import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { CapacityIndicator } from '../events/CapacityIndicator';
import { formatDate, formatTime } from '../../utils/formatters';
import { Edit2, Trash2, ExternalLink, Users, Calendar, Eye } from 'lucide-react';
import { Modal } from '../common/Modal';

export function AdminEventTable({
  events = [],
  registrations = [],
  onEdit,
  onDelete,
}) {
  const [attendeeModalEvent, setAttendeeModalEvent] = useState(null);

  const getEventRegistrations = (eventId) => {
    return registrations.filter((r) => r.eventId === eventId);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-4 sm:px-6">Event & Organizer</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Date & Time</th>
              <th className="py-3.5 px-4 min-w-[140px]">Capacity</th>
              <th className="py-3.5 px-4 text-center">Attendees</th>
              <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {events.map((evt) => {
              const eventRegs = getEventRegistrations(evt.id);

              return (
                <tr
                  key={evt.id}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  {/* Event & Organizer */}
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={evt.bannerUrl}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-200"
                      />
                      <div className="max-w-xs">
                        <Link
                          to={`/events/${evt.id}`}
                          className="font-bold text-slate-900 hover:text-brand-600 transition-colors line-clamp-1"
                        >
                          {evt.title}
                        </Link>
                        <p className="text-xs text-slate-500 truncate">
                          by {evt.organizerName} • {evt.venue}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <Badge category={evt.category}>{evt.category}</Badge>
                  </td>

                  {/* Date & Time */}
                  <td className="py-4 px-4 whitespace-nowrap text-xs text-slate-600">
                    <div className="font-semibold text-slate-800">
                      {formatDate(evt.startDate)}
                    </div>
                    <div className="text-slate-400">
                      {formatTime(evt.startDate)}
                    </div>
                  </td>

                  {/* Capacity */}
                  <td className="py-4 px-4">
                    <CapacityIndicator
                      registered={evt.registeredCount}
                      capacity={evt.capacity}
                    />
                  </td>

                  {/* Attendees Count / Preview */}
                  <td className="py-4 px-4 text-center">
                    <button
                      onClick={() => setAttendeeModalEvent(evt)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 transition-colors"
                      title="View registered student list"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>{eventRegs.length}</span>
                    </button>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <Link
                        to={`/events/${evt.id}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        title="View Event Public Page"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => onEdit(evt)}
                        className="p-1.5 rounded-lg text-brand-600 hover:text-brand-800 hover:bg-brand-50 transition-colors"
                        title="Edit Event"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDelete(evt)}
                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors"
                        title="Delete Event"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Attendee Roster Modal */}
      {attendeeModalEvent && (
        <Modal
          isOpen={Boolean(attendeeModalEvent)}
          onClose={() => setAttendeeModalEvent(null)}
          title={`Registered Attendees (${getEventRegistrations(attendeeModalEvent.id).length})`}
          maxWidth="max-w-xl"
        >
          <div className="space-y-4">
            <p className="text-xs text-slate-500">
              Students registered for <strong className="text-slate-800">{attendeeModalEvent.title}</strong>:
            </p>

            {getEventRegistrations(attendeeModalEvent.id).length === 0 ? (
              <p className="text-center py-8 text-xs text-slate-400 italic">
                No students have registered for this event yet.
              </p>
            ) : (
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-xl">
                {getEventRegistrations(attendeeModalEvent.id).map((reg) => (
                  <div key={reg.id} className="p-3 text-xs flex items-center justify-between hover:bg-slate-50">
                    <div>
                      <p className="font-bold text-slate-900">{reg.studentName}</p>
                      <p className="text-slate-500">{reg.studentEmail} • ID: {reg.studentId}</p>
                    </div>
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {reg.ticketCode}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <Button variant="outline" size="sm" onClick={() => setAttendeeModalEvent(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
