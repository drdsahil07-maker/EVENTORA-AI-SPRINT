import React, { useState } from 'react';
import {
  Building2,
  Calendar,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Plus,
  MapPin,
  Clock,
  Sparkles,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/Badge';

interface VenueDashboardProps {
  onOpenDateRescue?: () => void;
}

export const VenueDashboard: React.FC<VenueDashboardProps> = ({
  onOpenDateRescue,
}) => {
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [showAddDateModal, setShowAddDateModal] = useState(false);

  // Booking Enquiries
  const [enquiries, setEnquiries] = useState([
    {
      id: 'ven-enq-1',
      event: 'Electronic Music Showcase',
      organizer: 'Nexus Live Productions',
      stage: 'Grand Amphitheater',
      date: 'Friday, Oct 27',
      time: '6:00 PM – 11:30 PM',
      guestCount: '1,200 guests',
      offer: '$3,200',
      status: 'Pending' as const,
      techSpecs: 'Organizer bringing console. Needs venue 3-phase power and FOH speakers.',
    },
    {
      id: 'ven-enq-2',
      event: 'Private Brand Gala',
      organizer: 'Aura Agency',
      stage: 'Skyline Panorama Loft',
      date: 'Saturday, Nov 04',
      time: '7:00 PM – 10:00 PM',
      guestCount: '250 guests',
      offer: '$1,800',
      status: 'Pending' as const,
      techSpecs: 'Cocktail layout. Minimal sound reinforcement. Ambient lighting only.',
    },
  ]);

  // Upcoming Bookings
  const [upcomingBookings, setUpcomingBookings] = useState([
    {
      id: 'v-bk-1',
      event: 'Neon Horizon Music Festival',
      stage: 'Grand Amphitheater',
      date: 'Tonight, Oct 11 · 8:30 PM',
      organizer: 'Nexus Events',
      payout: '$4,500',
      status: 'Accepted' as const,
      // Technical specs hidden behind "View Details"
      techDetails: 'Full Line Array rig active. Municipal decibel curfew at 11:30 PM (102 dBA ceiling). 2 dedicated load-in bays.',
    },
    {
      id: 'v-bk-2',
      event: 'Velvet Sessions Jazz Night',
      stage: 'The Copper Vault',
      date: 'Tomorrow, Oct 12 · 9:00 PM',
      organizer: 'City Arts Collective',
      payout: '$1,400',
      status: 'Accepted' as const,
      techDetails: 'In-house acoustic piano, 4 monitor sends. Curfew: 2:00 AM.',
    },
  ]);

  // Calendar dates
  const [calendarDates, setCalendarDates] = useState([
    { day: 'Fri, Oct 11', status: 'Booked', event: 'Neon Horizon' },
    { day: 'Sat, Oct 12', status: 'Booked', event: 'Velvet Sessions' },
    { day: 'Sun, Oct 13', status: 'Available', event: 'Open for booking' },
    { day: 'Thu, Oct 18', status: 'Available', event: 'Open for booking' },
    { day: 'Fri, Oct 19', status: 'Booked', event: 'Corporate Gala' },
    { day: 'Sat, Oct 20', status: 'Available', event: 'Open for booking' },
  ]);

  const handleAcceptEnquiry = (id: string, eventName: string) => {
    const item = enquiries.find((e) => e.id === id);
    if (item) {
      setEnquiries(enquiries.filter((e) => e.id !== id));
      setUpcomingBookings([
        {
          id: `v-bk-${Date.now()}`,
          event: item.event,
          stage: item.stage,
          date: item.date,
          organizer: item.organizer,
          payout: item.offer,
          status: 'Accepted',
          techDetails: item.techSpecs,
        },
        ...upcomingBookings,
      ]);
      setSuccessToast(`Accepted booking for "${eventName}"!`);
      setTimeout(() => setSuccessToast(null), 3000);
    }
  };

  const handleDeclineEnquiry = (id: string) => {
    setEnquiries(enquiries.filter((e) => e.id !== id));
    setSuccessToast('Enquiry declined.');
    setTimeout(() => setSuccessToast(null), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Toast Alert */}
      {successToast && (
        <div className="bg-[#CCFBF1] border border-[#99F6E4] text-[#0F766E] p-3 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#0D9488]" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Header and Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
            Venue Console
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Manage stage bookings, calendar availability, and venue inquiries.
          </p>
        </div>

        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowAddDateModal(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Update Available Dates
        </Button>
      </div>

      {/* Booking Enquiries */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-[#0F172A]">Booking Enquiries</h3>
            <p className="text-xs text-[#64748B]">Organizers requesting to book your venue spaces</p>
          </div>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
            {enquiries.length} New
          </span>
        </div>

        {enquiries.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#64748B]">
            No pending booking requests. Your available dates are live for organizers.
          </div>
        ) : (
          <div className="divide-y divide-[#F1F5F9]">
            {enquiries.map((enq) => (
              <div key={enq.id} className="p-4 sm:p-5 hover:bg-slate-50/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-[#0F172A]">{enq.event}</h4>
                      <StatusBadge status="Pending" size="sm" />
                    </div>
                    <p className="text-xs text-[#64748B]">
                      <strong className="text-[#0F172A]">{enq.stage}</strong> · {enq.date} · {enq.time}
                    </p>
                    <div className="text-[11px] text-[#64748B]">
                      Organizer: {enq.organizer} · Expected: {enq.guestCount}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="text-sm font-bold text-[#0D9488]">{enq.offer}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeclineEnquiry(enq.id)}
                    >
                      Decline
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAcceptEnquiry(enq.id, enq.event)}
                      icon={<Check className="w-3.5 h-3.5" />}
                    >
                      Accept Booking
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Availability Calendar */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm text-[#0F172A]">Availability Calendar</h3>
            <p className="text-xs text-[#64748B]">View open dates and confirmed rentals</p>
          </div>
          <button
            onClick={() => setShowAddDateModal(true)}
            className="text-xs font-semibold text-[#0D9488] hover:text-[#0F766E] cursor-pointer"
          >
            + Add Available Slot
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {calendarDates.map((item, idx) => (
            <div
              key={idx}
              className={`p-3 rounded-xl border text-xs text-center space-y-1 ${
                item.status === 'Available'
                  ? 'bg-[#CCFBF1]/30 border-[#99F6E4] text-[#0F766E]'
                  : 'bg-slate-50 border-[#E2E8F0] text-slate-700'
              }`}
            >
              <div className="font-bold text-[#0F172A]">{item.day}</div>
              <div className="text-[11px] font-medium">
                {item.status === 'Available' ? 'Available' : 'Booked'}
              </div>
              <div className="text-[10px] text-[#64748B] truncate">{item.event}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Bookings (With Technical Metadata Hidden behind "View Details") */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-[#0F172A]">Upcoming Bookings</h3>
            <p className="text-xs text-[#64748B]">Scheduled shows and venue rentals</p>
          </div>
          <span className="text-xs text-[#64748B]">
            {upcomingBookings.length} confirmed
          </span>
        </div>

        <div className="divide-y divide-[#F1F5F9]">
          {upcomingBookings.map((b) => {
            const isExpanded = expandedBookingId === b.id;
            return (
              <div key={b.id} className="p-4 sm:p-5 hover:bg-slate-50/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-[#0F172A]">{b.event}</h4>
                      <StatusBadge status="Accepted" size="sm" />
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B]">
                      <span>Stage: <strong className="text-[#0F172A]">{b.stage}</strong></span>
                      <span>·</span>
                      <span>{b.date}</span>
                      <span>·</span>
                      <span>Organizer: {b.organizer}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="text-xs font-bold text-[#0F172A]">{b.payout}</span>
                    <button
                      onClick={() => setExpandedBookingId(isExpanded ? null : b.id)}
                      className="text-xs font-medium text-[#0D9488] hover:text-[#0F766E] flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Important Product Fix: Technical details hidden by default */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-[#F1F5F9] text-xs bg-[#F8FAFC] p-3 rounded-xl space-y-1 text-[#475569]">
                    <div className="font-medium text-[#0F172A]">Production & Acoustic Specifications:</div>
                    <p className="text-[11px] leading-relaxed">{b.techDetails}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Manage Venue Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-sm text-[#0F172A]">Manage Venue</h3>
          <p className="text-xs text-[#64748B] mt-0.5">
            Metro Pavilion & Amphitheater · 3,500 Max Capacity · Downtown Arts District
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setSuccessToast('Venue profile up to date.');
            setTimeout(() => setSuccessToast(null), 2500);
          }}
        >
          Edit Venue Profile
        </Button>
      </div>

      {/* Simple Add Available Date Modal */}
      {showAddDateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/30" onClick={() => setShowAddDateModal(false)} />
          <div className="relative bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-[#E2E8F0] z-10 space-y-4">
            <h3 className="font-bold text-base text-[#0F172A]">Add Open Available Date</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Date</label>
                <input
                  type="text"
                  placeholder="e.g., Fri, Oct 26"
                  className="w-full p-2 border rounded-xl"
                  defaultValue="Sun, Oct 28"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Space</label>
                <select className="w-full p-2 border rounded-xl bg-white">
                  <option>Grand Amphitheater</option>
                  <option>The Copper Vault</option>
                  <option>Skyline Panorama Loft</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setShowAddDateModal(false)}>
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setCalendarDates([
                    ...calendarDates,
                    { day: 'Sun, Oct 28', status: 'Available', event: 'Open for booking' },
                  ]);
                  setShowAddDateModal(false);
                  setSuccessToast('New available date published to organizers!');
                  setTimeout(() => setSuccessToast(null), 3000);
                }}
              >
                Publish Date
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
