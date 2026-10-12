import React, { useState, useEffect } from 'react';
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
  ShieldCheck,
  Inbox,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/Badge';
import { VenueTab, SharedBookingRequest } from '../../types';
import {
  getSharedBookings,
  updateBookingStatus,
  subscribeToBookings,
} from '../../utils/bookingStore';

interface VenueDashboardProps {
  activeTab?: VenueTab;
  onTabChange?: (tab: VenueTab) => void;
  onOpenDateRescue?: () => void;
}

const VENUES_LIST = [
  {
    id: 'Metro Amphitheater & Grounds',
    name: 'Metro Amphitheater & Grounds',
    location: 'Mumbai Central',
    capacity: 3500,
    curfew: '11:00 PM',
    soundRig: 'Full Line Array & In-Ear Systems (102 dBA ceiling)',
  },
  {
    id: 'Grand Hyatt Terrace & Ballroom',
    name: 'Grand Hyatt Terrace & Ballroom',
    location: 'Bengaluru North',
    capacity: 600,
    curfew: '01:00 AM',
    soundRig: 'Acoustic Setup & Speech PA (98 dBA ceiling)',
  },
  {
    id: 'The Copper Vault Intimate Hall',
    name: 'The Copper Vault Intimate Hall',
    location: 'Delhi NCR',
    capacity: 300,
    curfew: '02:00 AM',
    soundRig: 'Club Sound Rig & Acoustic Piano (100 dBA ceiling)',
  },
  {
    id: 'all',
    name: 'All Spaces (Consolidated)',
    location: 'Multi-Location Network',
    capacity: 4400,
    curfew: 'Per Stage',
    soundRig: 'Active Stage Telemetry',
  },
];

export const VenueDashboard: React.FC<VenueDashboardProps> = ({
  activeTab = 'overview',
  onTabChange,
  onOpenDateRescue,
}) => {
  const [allBookings, setAllBookings] = useState<SharedBookingRequest[]>(getSharedBookings);
  const [selectedVenueId, setSelectedVenueId] = useState<string>('Metro Amphitheater & Grounds');

  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [showAddDateModal, setShowAddDateModal] = useState(false);
  const [isProcessingId, setIsProcessingId] = useState<string | null>(null);

  // Calendar dates with interactive slot management
  const [calendarDates, setCalendarDates] = useState([
    { day: 'Fri, Oct 28', status: 'Booked', event: 'Diwali Fusion Concert' },
    { day: 'Wed, Nov 05', status: 'Booked', event: 'TechPulse Innovation Gala' },
    { day: 'Sat, Nov 08', status: 'Available', event: 'Open for booking' },
    { day: 'Thu, Nov 12', status: 'Available', event: 'Open for booking' },
    { day: 'Fri, Nov 13', status: 'Available', event: 'Open for booking' },
    { day: 'Sat, Nov 14', status: 'Available', event: 'Open for booking' },
  ]);

  // Subscribe to real-time shared bookings
  useEffect(() => {
    const unsubscribe = subscribeToBookings((updated) => {
      setAllBookings(updated);
    });
    return unsubscribe;
  }, []);

  // Filter shared venue requests
  const venueRequests = allBookings.filter((b) => {
    if (b.targetType !== 'Venue') return false;
    if (selectedVenueId === 'all') return true;
    const target = b.targetName.toLowerCase().trim();
    const selected = selectedVenueId.toLowerCase().trim();
    
    // Direct or substring match
    if (target.includes(selected) || selected.includes(target)) return true;
    
    // Semantic venue keywords
    if (selected.includes('metro') && target.includes('metro')) return true;
    if (selected.includes('hyatt') && target.includes('hyatt')) return true;
    if (selected.includes('copper') && target.includes('copper')) return true;
    
    return false;
  });

  const pendingEnquiries = venueRequests.filter((b) => b.status === 'Pending');
  const acceptedBookings = venueRequests.filter((b) => b.status === 'Accepted');

  const activeVenueInfo =
    VENUES_LIST.find((v) => v.id === selectedVenueId) || VENUES_LIST[0];

  const handleAcceptEnquiry = (booking: SharedBookingRequest) => {
    if (isProcessingId) return;
    setIsProcessingId(booking.id);

    // Update shared source of truth
    updateBookingStatus(booking.id, 'Accepted');

    // Automatically update venue calendar slot to Booked
    const dateLower = booking.date.toLowerCase();
    const existingDateIdx = calendarDates.findIndex((d) =>
      d.day.toLowerCase().includes(dateLower) || dateLower.includes(d.day.toLowerCase())
    );

    if (existingDateIdx >= 0) {
      setCalendarDates((prev) =>
        prev.map((d, idx) =>
          idx === existingDateIdx
            ? { ...d, status: 'Booked', event: booking.eventName }
            : d
        )
      );
    } else {
      setCalendarDates((prev) => [
        { day: booking.date, status: 'Booked', event: booking.eventName },
        ...prev,
      ]);
    }

    setSuccessToast(`Accepted booking for "${booking.eventName}". Status updated in Organizer Console.`);
    setTimeout(() => {
      setIsProcessingId(null);
      setSuccessToast(null);
    }, 3500);
  };

  const handleDeclineEnquiry = (booking: SharedBookingRequest) => {
    if (isProcessingId) return;
    setIsProcessingId(booking.id);

    // Update shared source of truth to Rejected
    updateBookingStatus(booking.id, 'Rejected');

    setSuccessToast(`Declined booking request for "${booking.eventName}". Status updated in Organizer Console.`);
    setTimeout(() => {
      setIsProcessingId(null);
      setSuccessToast(null);
    }, 3500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Toast Alert */}
      {successToast && (
        <div className="bg-[#CCFBF1] border border-[#99F6E4] text-[#0F766E] p-3 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in sticky top-20 z-20">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#0D9488]" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="font-bold text-xs cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Header and Venue Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
            Venue Console
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Manage stage booking inquiries, calendar slots, and production specifications.
          </p>
        </div>

        {/* Demo Venue Switcher Toolbar */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#E2E8F0] shadow-2xs">
          <span className="text-[11px] text-[#64748B] font-medium hidden sm:inline">
            Active Space:
          </span>
          <select
            value={selectedVenueId}
            onChange={(e) => setSelectedVenueId(e.target.value)}
            className="text-xs font-bold text-[#0F172A] bg-transparent outline-none cursor-pointer"
          >
            {VENUES_LIST.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.location})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Venue Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span>Pending Inquiries</span>
            <Inbox className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-1.5">
            {pendingEnquiries.length}
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">
            Organizers waiting for date hold confirmation
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span>Confirmed Bookings</span>
            <Building2 className="w-4 h-4 text-[#0D9488]" />
          </div>
          <div className="text-2xl font-bold text-[#0F172A] mt-1.5">
            {acceptedBookings.length}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">
            Scheduled shows on stage
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span>Available Calendar Slots</span>
            <Calendar className="w-4 h-4 text-[#0F2747]" />
          </div>
          <div className="text-2xl font-bold text-[#0D9488] mt-1.5">
            {calendarDates.filter((d) => d.status === 'Available').length} Open
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">
            Published for organizer discovery
          </div>
        </div>
      </div>

      {/* Booking Enquiries (Shared Source of Truth) */}
      {(activeTab === 'overview' || activeTab === 'inquiries') && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#0F172A]">Booking Enquiries</h3>
              <p className="text-xs text-[#64748B]">
                Organizers requesting to book your venue spaces (Shared Real-Time Pipeline)
              </p>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
              {pendingEnquiries.length} Pending
            </span>
          </div>

          {pendingEnquiries.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#64748B] space-y-2">
              <Inbox className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="font-medium text-[#0F172A]">No pending venue requests at this time.</p>
              <p>
                When an organizer requests a date hold from the Discover Venues tab, it will appear here immediately for approval.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#F1F5F9]">
              {pendingEnquiries.map((enq) => (
                <div key={enq.id} className="p-4 sm:p-5 hover:bg-slate-50/50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-[#0F172A]">{enq.eventName}</h4>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {enq.targetName}
                        </span>
                        <StatusBadge status="Pending" size="sm" />
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B]">
                        <span className="flex items-center gap-1 font-semibold text-[#0F172A]">
                          <Calendar className="w-3.5 h-3.5 text-[#0D9488]" />
                          {enq.date}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#64748B]" />
                          {enq.city || 'Local Area'}
                        </span>
                        <span>·</span>
                        <span className="font-bold text-[#0D9488]">
                          Offered Rate: ₹{enq.estimatedCostINR.toLocaleString('en-IN')}
                        </span>
                      </div>

                      {enq.notes && (
                        <p className="text-xs text-slate-600 bg-[#F8FAFC] p-2 rounded-lg border border-[#E2E8F0] mt-1.5 leading-relaxed">
                          <strong>Organizer Requirement:</strong> "{enq.notes}"
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isProcessingId === enq.id}
                        onClick={() => handleDeclineEnquiry(enq)}
                      >
                        Decline
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={isProcessingId === enq.id}
                        onClick={() => handleAcceptEnquiry(enq)}
                        icon={<Check className="w-3.5 h-3.5" />}
                      >
                        {isProcessingId === enq.id ? 'Processing...' : 'Accept Hold'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Availability Calendar */}
      {(activeTab === 'overview' || activeTab === 'calendar') && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <div>
              <h3 className="font-bold text-sm text-[#0F172A]">Availability Calendar</h3>
              <p className="text-xs text-[#64748B]">
                View open dates and confirmed rentals for {activeVenueInfo.name}
              </p>
            </div>
            <button
              onClick={() => setShowAddDateModal(true)}
              className="text-xs font-semibold text-[#0D9488] hover:text-[#0F766E] cursor-pointer flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Open Slot
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {calendarDates.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border text-xs text-center space-y-1 transition-all ${
                  item.status === 'Available'
                    ? 'bg-[#CCFBF1]/30 border-[#99F6E4] text-[#0F766E]'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}
              >
                <div className="font-bold text-[#0F172A]">{item.day}</div>
                <div className="text-[11px] font-medium">
                  {item.status === 'Available' ? 'Open Slot' : 'Booked'}
                </div>
                <div className="text-[10px] text-[#64748B] truncate" title={item.event}>
                  {item.event}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Bookings (With Technical Metadata Hidden behind "View Details") */}
      {(activeTab === 'overview' || activeTab === 'spaces' || activeTab === 'stage-specs') && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#0F172A]">Upcoming Bookings</h3>
              <p className="text-xs text-[#64748B]">Confirmed stage rentals on your schedule</p>
            </div>
            <span className="text-xs font-semibold text-[#0F172A]">
              {acceptedBookings.length} Confirmed
            </span>
          </div>

          {acceptedBookings.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#64748B]">
              No confirmed bookings currently. Accept incoming hold requests to populate your schedule.
            </div>
          ) : (
            <div className="divide-y divide-[#F1F5F9]">
              {acceptedBookings.map((b) => {
                const isExpanded = expandedBookingId === b.id;
                return (
                  <div key={b.id} className="p-4 sm:p-5 hover:bg-slate-50/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm text-[#0F172A]">{b.eventName}</h4>
                          <StatusBadge status="Accepted" size="sm" />
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B]">
                          <span>
                            Stage: <strong className="text-[#0F172A]">{b.targetName}</strong>
                          </span>
                          <span>·</span>
                          <span>{b.date}</span>
                          <span>·</span>
                          <span>City: {b.city || 'Mumbai'}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <span className="text-xs font-bold text-[#0D9488]">
                          ₹{b.estimatedCostINR.toLocaleString('en-IN')}
                        </span>
                        <button
                          onClick={() => setExpandedBookingId(isExpanded ? null : b.id)}
                          className="text-xs font-medium text-[#0D9488] hover:text-[#0F766E] flex items-center gap-1 cursor-pointer"
                        >
                          <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Important Product Fix: Technical details hidden by default */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-[#F1F5F9] text-xs bg-[#F8FAFC] p-3 rounded-xl space-y-1 text-[#475569]">
                        <div className="font-medium text-[#0F172A]">
                          Production & Acoustic Specifications:
                        </div>
                        <p className="text-[11px] leading-relaxed">
                          Rig: {activeVenueInfo.soundRig}. Curfew curfew: {activeVenueInfo.curfew}. Max stage capacity: {activeVenueInfo.capacity} attendees. Two load-in ramps active.
                        </p>
                        {b.notes && (
                          <p className="text-[11px] text-slate-600 pt-1">
                            <strong>Organizer Notes:</strong> {b.notes}
                          </p>
                        )}
                        <p className="text-[11px] text-emerald-700 font-medium pt-1">
                          ✓ Synchronized with Organizer schedule.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Manage Venue Card */}
      {(activeTab === 'overview' || activeTab === 'spaces' || activeTab === 'stage-specs') && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-[#0F172A]">{activeVenueInfo.name}</h3>
              <span className="text-[10px] font-semibold bg-[#CCFBF1] text-[#0F766E] px-2 py-0.5 rounded">
                Verified Venue
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              {activeVenueInfo.capacity.toLocaleString()} Max Capacity · {activeVenueInfo.location} · Curfew {activeVenueInfo.curfew}
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
      )}

      {/* Simple Add Available Date Modal */}
      {showAddDateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setShowAddDateModal(false)} />
          <div className="relative bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-[#E2E8F0] z-10 space-y-4">
            <h3 className="font-bold text-base text-[#0F172A]">Add Open Available Date</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Date</label>
                <input
                  type="text"
                  placeholder="e.g., Fri, Nov 20"
                  className="w-full p-2.5 border rounded-xl"
                  defaultValue="Fri, Nov 20"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Space</label>
                <select className="w-full p-2.5 border rounded-xl bg-white text-xs">
                  {VENUES_LIST.filter((v) => v.id !== 'all').map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name}
                    </option>
                  ))}
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
                  setCalendarDates((prev) => [
                    ...prev,
                    { day: 'Fri, Nov 20', status: 'Available', event: 'Open for booking' },
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
