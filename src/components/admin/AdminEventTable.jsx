import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { CapacityIndicator } from '../events/CapacityIndicator';
import { formatDate, formatTime } from '../../utils/formatters';
import { Edit2, Trash2, Users, Eye } from 'lucide-react';
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
    <div className="bg-white rounded-[2px] border border-[#E2E2E2] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E2E2E2] bg-[#FAFAFA] text-[10px] font-bold uppercase tracking-wider text-[#6B6B6B]">
              <th className="py-3 px-4 sm:px-6">Event & Organizer</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Date & Time</th>
              <th className="py-3 px-4 min-w-[130px]">Capacity</th>
              <th className="py-3 px-4 text-center">Attendees</th>
              <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E2E2] text-xs">
            {events.map((evt) => {
              const eventRegs = getEventRegistrations(evt.id);

              return (
                <tr
                  key={evt.id}
                  className="hover:bg-[#FAFAFA] transition-colors"
                >
                  {/* Event & Organizer */}
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={evt.bannerUrl}
                        alt=""
                        className="w-10 h-10 rounded-[2px] object-cover shrink-0 border border-[#E2E2E2]"
                      />
                      <div className="max-w-xs">
                        <Link
                          to={`/events/${evt.id}`}
                          className="font-heading font-bold text-xs text-[#111111] hover:text-[#1B3A8C] transition-colors line-clamp-1"
                        >
                          {evt.title}
                        </Link>
                        <p className="text-[11px] text-[#6B6B6B] truncate">
                          {evt.organizerName} • {evt.venue}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <Badge category={evt.category}>{evt.category}</Badge>
                  </td>

                  {/* Date & Time */}
                  <td className="py-3.5 px-4 whitespace-nowrap text-[11px] text-[#6B6B6B]">
                    <div className="font-semibold text-[#111111]">
                      {formatDate(evt.startDate)}
                    </div>
                    <div className="text-[#A3A3A3]">
                      {formatTime(evt.startDate)}
                    </div>
                  </td>

                  {/* Capacity */}
                  <td className="py-3.5 px-4">
                    <CapacityIndicator
                      registered={evt.registeredCount}
                      capacity={evt.capacity}
                    />
                  </td>

                  {/* Attendees Count / Preview */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => setAttendeeModalEvent(evt)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] text-xs font-bold text-[#1B3A8C] bg-[#FAFAFA] hover:bg-[#E2E2E2] border border-[#E2E2E2] transition-colors"
                      title="View attendee roster"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>{eventRegs.length}</span>
                    </button>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1">
                      <Link
                        to={`/events/${evt.id}`}
                        className="p-1.5 text-[#6B6B6B] hover:text-[#111111] hover:bg-[#FAFAFA] rounded-[2px]"
                        title="View Public Page"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      <button
                        onClick={() => onEdit(evt)}
                        className="p-1.5 text-[#1B3A8C] hover:text-[#162e70] hover:bg-[#FAFAFA] rounded-[2px]"
                        title="Edit Event"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDelete(evt)}
                        className="p-1.5 text-[#DC2626] hover:text-[#b91c1c] hover:bg-[#FAFAFA] rounded-[2px]"
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
            <p className="text-xs text-[#6B6B6B]">
              Registered students for <strong className="text-[#111111]">{attendeeModalEvent.title}</strong>:
            </p>

            {getEventRegistrations(attendeeModalEvent.id).length === 0 ? (
              <p className="text-center py-8 text-xs text-[#6B6B6B] italic">
                No students have registered for this event yet.
              </p>
            ) : (
              <div className="max-h-72 overflow-y-auto divide-y divide-[#E2E2E2] border border-[#E2E2E2] rounded-[2px]">
                {getEventRegistrations(attendeeModalEvent.id).map((reg) => (
                  <div key={reg.id} className="p-3 text-xs flex items-center justify-between hover:bg-[#FAFAFA]">
                    <div>
                      <p className="font-bold text-[#111111]">{reg.studentName}</p>
                      <p className="text-[#6B6B6B]">{reg.studentEmail} • ID: {reg.studentId}</p>
                    </div>
                    <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded-[2px] bg-[#FAFAFA] text-[#1B3A8C] border border-[#E2E2E2]">
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
