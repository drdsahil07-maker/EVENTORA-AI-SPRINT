import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Users,
  IndianRupee,
  CalendarCheck2,
  Inbox,
  Clock3,
  Filter,
  Edit2,
  Save,
  Info,
} from 'lucide-react';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/Badge';
import {
  ArtistTab,
  SharedBookingRequest,
  RescueArtistProfile,
  DateAvailabilityStatus,
  ArtistAvailabilityDate,
} from '../../types';
import { SEEDED_RESCUE_ARTISTS } from '../../data/mockArtists';
import {
  getSharedBookings,
  updateBookingStatus,
  subscribeToBookings,
} from '../../utils/bookingStore';

interface ArtistDashboardProps {
  activeTab?: ArtistTab;
  onTabChange?: (tab: ArtistTab) => void;
  onOpenDateRescue?: () => void;
}

// Initial demo availability dates for the artist
const INITIAL_DEMO_DATES: ArtistAvailabilityDate[] = [
  { date: 'Oct 28, 2026', status: 'Booked', eventName: 'Diwali Fusion Concert & Night Market' },
  { date: 'Oct 29, 2026', status: 'Available', note: 'Open for evening acoustic gigs' },
  { date: 'Oct 30, 2026', status: 'Available', note: 'Open for corporate & cocktail sets' },
  { date: 'Nov 01, 2026', status: 'Tentative', note: 'Hold placed by private client' },
  { date: 'Nov 05, 2026', status: 'Available', note: 'Full day open' },
  { date: 'Nov 12, 2026', status: 'Available', note: 'Weekend booking open' },
];

export const ArtistDashboard: React.FC<ArtistDashboardProps> = ({
  activeTab = 'overview',
  onTabChange = () => {},
  onOpenDateRescue,
}) => {
  // Shared bookings subscription
  const [allBookings, setAllBookings] = useState<SharedBookingRequest[]>(getSharedBookings);

  // Active Demo Artist Profile (Default: Aanya Sen, with quick switcher to any seeded artist)
  const [activeArtist, setActiveArtist] = useState<RescueArtistProfile>(() => {
    try {
      const stored = localStorage.getItem('eventora_active_artist_profile_v1');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return SEEDED_RESCUE_ARTISTS[1]; // Aanya Sen (Singer)
  });

  // Artist Availability Calendar state
  const [availabilityDates, setAvailabilityDates] = useState<ArtistAvailabilityDate[]>(() => {
    try {
      const stored = localStorage.getItem(`eventora_artist_dates_${activeArtist.id}`);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return INITIAL_DEMO_DATES;
  });

  // Selected date to edit in availability manager
  const [selectedDateToEdit, setSelectedDateToEdit] = useState<string>('Oct 29, 2026');
  const [newDateStatus, setNewDateStatus] = useState<DateAvailabilityStatus>('Available');
  const [newDateNote, setNewDateNote] = useState<string>('');

  // Editing profile fields
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileCity, setProfileCity] = useState(activeArtist.city);
  const [profilePrice, setProfilePrice] = useState(activeArtist.indicativePriceINR);
  const [profileServiceArea, setProfileServiceArea] = useState(activeArtist.serviceArea.join(', '));

  // Modals & Feedback
  const [rejectConfirmBooking, setRejectConfirmBooking] = useState<SharedBookingRequest | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [isProcessingId, setIsProcessingId] = useState<string | null>(null);

  // Expanded booking item
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);

  // Subscribe to real-time shared bookings
  useEffect(() => {
    const unsubscribe = subscribeToBookings((updated) => {
      setAllBookings(updated);
    });
    return unsubscribe;
  }, []);

  // Save active artist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('eventora_active_artist_profile_v1', JSON.stringify(activeArtist));
    } catch {
      // ignore
    }
  }, [activeArtist]);

  // Save dates to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`eventora_artist_dates_${activeArtist.id}`, JSON.stringify(availabilityDates));
    } catch {
      // ignore
    }
  }, [availabilityDates, activeArtist.id]);

  // Filter bookings for this active artist (or match targetName/artistId)
  // In demo prototype, we show requests directed to this artist, or requests matching artist category
  const artistRelevantBookings = allBookings.filter((b) => {
    if (b.targetType !== 'Artist') return false;
    if (b.artistId === activeArtist.id) return true;
    if (b.targetName.toLowerCase().includes(activeArtist.name.toLowerCase().split(' ')[0])) return true;
    // Also include if category matches and artist was chosen
    if (b.category && b.category === activeArtist.category) return true;
    return false;
  });

  // Segregate into pending requests and upcoming/accepted bookings
  const pendingRequests = artistRelevantBookings.filter((b) => b.status === 'Pending');
  const acceptedBookings = artistRelevantBookings.filter((b) => b.status === 'Accepted');
  const availableDatesCount = availabilityDates.filter((d) => d.status === 'Available').length;

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Switch demo artist profile
  const handleSwitchArtist = (artistId: string) => {
    const found = SEEDED_RESCUE_ARTISTS.find((a) => a.id === artistId);
    if (found) {
      setActiveArtist(found);
      setProfileCity(found.city);
      setProfilePrice(found.indicativePriceINR);
      setProfileServiceArea(found.serviceArea.join(', '));
      showToast(`Switched active demo profile to ${found.name}.`);
    }
  };

  // Handle Accept Booking Request
  const handleAcceptRequest = (booking: SharedBookingRequest) => {
    if (isProcessingId) return; // Prevent duplicate clicks
    setIsProcessingId(booking.id);

    // Update in shared store
    updateBookingStatus(booking.id, 'Accepted');

    // Automatically synchronize availability date to Booked
    const dateExists = availabilityDates.some((d) => d.date.toLowerCase() === booking.date.toLowerCase());
    if (dateExists) {
      setAvailabilityDates((prev) =>
        prev.map((d) =>
          d.date.toLowerCase() === booking.date.toLowerCase()
            ? { ...d, status: 'Booked', bookingId: booking.id, eventName: booking.eventName }
            : d
        )
      );
    } else {
      setAvailabilityDates((prev) => [
        {
          date: booking.date,
          status: 'Booked',
          bookingId: booking.id,
          eventName: booking.eventName,
          note: `Confirmed booking for ${booking.eventName}`,
        },
        ...prev,
      ]);
    }

    showToast(`Accepted booking for "${booking.eventName}". Status updated in Organizer dashboard.`);
    setTimeout(() => setIsProcessingId(null), 500);
  };

  // Prompt Reject Confirmation
  const handlePromptReject = (booking: SharedBookingRequest) => {
    setRejectConfirmBooking(booking);
  };

  // Confirm Rejection
  const handleConfirmReject = () => {
    if (!rejectConfirmBooking || isProcessingId) return;
    setIsProcessingId(rejectConfirmBooking.id);

    updateBookingStatus(rejectConfirmBooking.id, 'Rejected');
    showToast(`Declined request for "${rejectConfirmBooking.eventName}". Status updated in Organizer dashboard.`);

    setRejectConfirmBooking(null);
    setTimeout(() => setIsProcessingId(null), 500);
  };

  // Update Availability Date with Conflict Prevention
  const handleSaveDateAvailability = (e: React.FormEvent) => {
    e.preventDefault();

    // Conflict Check: Check if an accepted booking exists for this date
    const hasAcceptedBooking = acceptedBookings.some(
      (b) => b.date.toLowerCase() === selectedDateToEdit.toLowerCase()
    );

    if (newDateStatus === 'Available' && hasAcceptedBooking) {
      showToast(
        `Date conflict: You have an accepted booking for this date (${selectedDateToEdit}). Cancel that booking before marking Available.`,
        'error'
      );
      return;
    }

    const existingIndex = availabilityDates.findIndex(
      (d) => d.date.toLowerCase() === selectedDateToEdit.toLowerCase()
    );

    if (existingIndex >= 0) {
      setAvailabilityDates((prev) =>
        prev.map((d, idx) =>
          idx === existingIndex
            ? { ...d, status: newDateStatus, note: newDateNote.trim() || undefined }
            : d
        )
      );
    } else {
      setAvailabilityDates((prev) => [
        {
          date: selectedDateToEdit,
          status: newDateStatus,
          note: newDateNote.trim() || undefined,
        },
        ...prev,
      ]);
    }

    showToast(`Updated availability for ${selectedDateToEdit} to "${newDateStatus}".`);
    setNewDateNote('');
  };

  // Save Profile Edits
  const handleSaveProfile = () => {
    setActiveArtist((prev) => ({
      ...prev,
      city: profileCity,
      indicativePriceINR: Number(profilePrice) || prev.indicativePriceINR,
      serviceArea: profileServiceArea.split(',').map((s) => s.trim()).filter(Boolean),
    }));
    setIsEditingProfile(false);
    showToast('Artist profile details updated successfully.');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`p-3 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in border ${
            toastType === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-[#CCFBF1] border-[#99F6E4] text-[#0F766E]'
          }`}
        >
          <div className="flex items-center gap-2">
            {toastType === 'error' ? (
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#0D9488]" />
            )}
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="font-bold text-xs cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Header with Heading & Active Demo Artist Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
            Your next booking starts here.
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Review live booking offers, manage your performance calendar, and accept Date Rescue calls.
          </p>
        </div>

        {/* Demo Artist Switcher Toolbar */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#E2E8F0] shadow-2xs">
          <div className="text-[11px] text-[#64748B] font-medium hidden sm:inline">
            Active Demo Artist:
          </div>
          <select
            value={activeArtist.id}
            onChange={(e) => handleSwitchArtist(e.target.value)}
            className="text-xs font-bold text-[#0F172A] bg-transparent outline-none cursor-pointer"
          >
            {SEEDED_RESCUE_ARTISTS.map((artist) => (
              <option key={artist.id} value={artist.id}>
                {artist.name} ({artist.category} · {artist.city})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards: New Requests, Upcoming Bookings, Available Dates */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: New Requests */}
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span>New Requests</span>
            <Inbox className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-1.5">
            {pendingRequests.length}
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[11px] text-[#64748B]">
              Awaiting your response
            </span>
            <span className="text-[9px] uppercase font-semibold text-slate-400 bg-slate-50 px-1 py-0.2 rounded border">
              Shared Store
            </span>
          </div>
        </div>

        {/* Card 2: Upcoming Bookings */}
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span>Upcoming Bookings</span>
            <CalendarCheck2 className="w-4 h-4 text-[#0D9488]" />
          </div>
          <div className="text-2xl font-bold text-[#0F172A] mt-1.5">
            {acceptedBookings.length}
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[11px] text-emerald-600 font-medium">
              Confirmed on schedule
            </span>
            <span className="text-[9px] uppercase font-semibold text-slate-400 bg-slate-50 px-1 py-0.2 rounded border">
              Shared Store
            </span>
          </div>
        </div>

        {/* Card 3: Available Dates */}
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span>Available Dates</span>
            <Calendar className="w-4 h-4 text-[#0F2747]" />
          </div>
          <div className="text-2xl font-bold text-[#0D9488] mt-1.5">
            {availableDatesCount} Days
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[11px] text-[#64748B]">
              Open on calendar
            </span>
            <span className="text-[9px] uppercase font-semibold text-slate-400 bg-slate-50 px-1 py-0.2 rounded border">
              Demo Data
            </span>
          </div>
        </div>
      </div>

      {/* Compact Artist Profile Card (Section requested in Main Dashboard) */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#CCFBF1] text-[#0F766E] font-bold text-lg flex items-center justify-center shrink-0">
              {activeArtist.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#0F172A]">{activeArtist.name}</h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {activeArtist.category}
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#CCFBF1] text-[#0F766E]">
                  Demo Profile
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B]">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#0D9488]" />
                  Base: {activeArtist.city} (Serves: {activeArtist.serviceArea.join(', ')})
                </span>
                <span>·</span>
                <span className="font-bold text-[#0D9488]">
                  Indicative Fee: ₹{activeArtist.indicativePriceINR.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {activeArtist.skills.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onTabChange('profile')}
              icon={<Edit2 className="w-3.5 h-3.5" />}
            >
              Manage Profile
            </Button>
          </div>
        </div>
      </div>

      {/* TAB VIEW: OVERVIEW or BOOKING REQUESTS */}
      {(activeTab === 'overview' || activeTab === 'requests') && (
        <div className="space-y-6">
          {/* Booking Requests List */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#0F172A]">
                  Booking Requests
                </h3>
                <p className="text-xs text-[#64748B]">
                  Direct inquiries and Date Rescue requests sent by organizers
                </p>
              </div>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
                {pendingRequests.length} Pending
              </span>
            </div>

            {pendingRequests.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#64748B] space-y-1">
                <Inbox className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-semibold text-[#0F172A]">No pending requests right now.</p>
                <p>When an organizer books or requests a Date Rescue for your category, it will appear here immediately.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#F1F5F9]">
                {pendingRequests.map((req) => (
                  <div key={req.id} className="p-4 sm:p-5 hover:bg-slate-50/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-[#0F172A]">{req.eventName}</h4>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {req.category || 'Talent'}
                          </span>
                          {req.isDateRescue && (
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#CCFBF1] text-[#0F766E] border border-[#99F6E4]">
                              Date Rescue
                            </span>
                          )}
                          <StatusBadge status="Pending" size="sm" />
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B]">
                          <span className="flex items-center gap-1 font-medium text-[#0F172A]">
                            <Calendar className="w-3.5 h-3.5 text-[#0D9488]" />
                            {req.date}
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#64748B]" />
                            {req.city || 'City Venue'}
                          </span>
                          <span>·</span>
                          <span className="font-bold text-[#0D9488]">
                            Offered Fee: ₹{req.estimatedCostINR.toLocaleString('en-IN')}
                          </span>
                        </div>

                        {req.notes && (
                          <p className="text-xs text-slate-600 bg-[#F8FAFC] p-2 rounded-lg border border-[#E2E8F0] mt-1.5 leading-relaxed">
                            <strong>Organizer Note:</strong> "{req.notes}"
                          </p>
                        )}
                      </div>

                      {/* Explicit Accept / Reject actions */}
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={isProcessingId === req.id}
                          onClick={() => handlePromptReject(req)}
                        >
                          Reject
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          disabled={isProcessingId === req.id}
                          onClick={() => handleAcceptRequest(req)}
                          icon={<Check className="w-3.5 h-3.5" />}
                        >
                          {isProcessingId === req.id ? 'Processing...' : 'Accept Request'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Bookings List */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#0F172A]">
                  Upcoming Bookings
                </h3>
                <p className="text-xs text-[#64748B]">
                  Confirmed and accepted performances on your schedule
                </p>
              </div>
              <span className="text-xs font-semibold text-[#0F172A]">
                {acceptedBookings.length} Booked
              </span>
            </div>

            {acceptedBookings.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#64748B] space-y-1">
                <CalendarCheck2 className="w-8 h-8 text-slate-300 mx-auto" />
                <p>No confirmed bookings yet. Accept incoming requests to add shows to your calendar.</p>
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
                            <span>{b.date}</span>
                            <span>·</span>
                            <span>{b.city || 'Local Stage'}</span>
                            <span>·</span>
                            <span className="font-bold text-[#0D9488]">
                              ₹{b.estimatedCostINR.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-center">
                          <button
                            onClick={() => setExpandedBookingId(isExpanded ? null : b.id)}
                            className="text-xs font-medium text-[#0D9488] hover:text-[#0F766E] flex items-center gap-1 cursor-pointer"
                          >
                            <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-[#F1F5F9] bg-[#F8FAFC] p-3 rounded-xl text-xs space-y-1 text-[#475569]">
                          <div className="flex justify-between text-[11px] text-[#64748B]">
                            <span>Booking ID: {b.id}</span>
                            <span>Updated: {b.updatedAt ? new Date(b.updatedAt).toLocaleDateString() : 'Recent'}</span>
                          </div>
                          {b.notes && (
                            <p className="text-[11px] leading-relaxed pt-1">
                              <strong>Notes:</strong> {b.notes}
                            </p>
                          )}
                          <p className="text-[11px] text-emerald-700 font-medium pt-1">
                            ✓ Synchronized with organizer schedule.
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB VIEW: MY AVAILABILITY (Or calendar section on Overview) */}
      {(activeTab === 'overview' || activeTab === 'availability') && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
            <div>
              <h3 className="font-bold text-sm text-[#0F172A]">
                My Availability Calendar
              </h3>
              <p className="text-xs text-[#64748B]">
                Manage open and blocked dates. Conflicting accepted bookings are protected.
              </p>
            </div>
            <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
              Demo Calendar
            </span>
          </div>

          {/* Quick Date Availability Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {availabilityDates.map((item, idx) => {
              const isSelected = selectedDateToEdit === item.date;
              return (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedDateToEdit(item.date);
                    setNewDateStatus(item.status);
                    setNewDateNote(item.note || '');
                  }}
                  className={`p-3 rounded-xl border text-xs text-center cursor-pointer transition-all ${
                    isSelected ? 'ring-2 ring-[#0D9488]' : ''
                  } ${
                    item.status === 'Available'
                      ? 'bg-[#CCFBF1]/40 border-[#99F6E4] text-[#0F766E]'
                      : item.status === 'Booked'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      : 'bg-amber-50 border-amber-200 text-amber-800'
                  }`}
                >
                  <div className="font-bold text-[#0F172A]">{item.date}</div>
                  <div className="text-[11px] font-semibold mt-0.5">
                    {item.status}
                  </div>
                  {item.eventName && (
                    <div className="text-[10px] truncate text-[#64748B] mt-0.5">
                      {item.eventName}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Availability Modifier Form */}
          <form onSubmit={handleSaveDateAvailability} className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-[#0F172A]">Editing Date:</span>
                <input
                  type="text"
                  value={selectedDateToEdit}
                  onChange={(e) => setSelectedDateToEdit(e.target.value)}
                  className="px-2 py-1 border border-[#E2E8F0] rounded-lg bg-white text-xs font-semibold"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[#64748B]">Set Status:</span>
                {(['Available', 'Booked', 'Tentative'] as DateAvailabilityStatus[]).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setNewDateStatus(status)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      newDateStatus === status
                        ? 'bg-[#0D9488] text-white'
                        : 'bg-white border border-[#E2E8F0] text-slate-700'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Optional availability note (e.g., Evening set preferred)..."
                value={newDateNote}
                onChange={(e) => setNewDateNote(e.target.value)}
                className="w-full text-xs p-2 border border-[#E2E8F0] rounded-lg bg-white"
              />
              <Button variant="primary" size="sm" type="submit" className="shrink-0">
                Update Date
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* TAB VIEW: MY PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <div>
              <h3 className="font-bold text-base text-[#0F172A]">My Profile & Pricing</h3>
              <p className="text-xs text-[#64748B]">Update your location, service area, and indicative rates</p>
            </div>
            {!isEditingProfile ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditingProfile(true)} icon={<Edit2 className="w-3.5 h-3.5" />}>
                Edit Details
              </Button>
            ) : (
              <Button variant="primary" size="sm" onClick={handleSaveProfile} icon={<Save className="w-3.5 h-3.5" />}>
                Save Profile
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-[#0F172A] mb-1">Artist / Act Name</label>
              <input
                type="text"
                disabled
                value={activeArtist.name}
                className="w-full p-2.5 border border-[#E2E8F0] rounded-xl bg-slate-50 text-slate-700"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#0F172A] mb-1">Category</label>
              <input
                type="text"
                disabled
                value={activeArtist.category}
                className="w-full p-2.5 border border-[#E2E8F0] rounded-xl bg-slate-50 text-slate-700"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#0F172A] mb-1">Base City</label>
              <input
                type="text"
                disabled={!isEditingProfile}
                value={profileCity}
                onChange={(e) => setProfileCity(e.target.value)}
                className={`w-full p-2.5 border rounded-xl ${
                  isEditingProfile ? 'border-[#0D9488] bg-white' : 'border-[#E2E8F0] bg-slate-50 text-slate-700'
                }`}
              />
            </div>

            <div>
              <label className="block font-semibold text-[#0F172A] mb-1">Indicative Price (INR)</label>
              <input
                type="number"
                disabled={!isEditingProfile}
                value={profilePrice}
                onChange={(e) => setProfilePrice(Number(e.target.value) || 0)}
                className={`w-full p-2.5 border rounded-xl ${
                  isEditingProfile ? 'border-[#0D9488] bg-white' : 'border-[#E2E8F0] bg-slate-50 text-slate-700'
                }`}
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-[#0F172A] mb-1">Service Area (Comma separated)</label>
              <input
                type="text"
                disabled={!isEditingProfile}
                value={profileServiceArea}
                onChange={(e) => setProfileServiceArea(e.target.value)}
                className={`w-full p-2.5 border rounded-xl ${
                  isEditingProfile ? 'border-[#0D9488] bg-white' : 'border-[#E2E8F0] bg-slate-50 text-slate-700'
                }`}
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB VIEW: DATE RESCUE OPPORTUNITIES */}
      {activeTab === 'rescue-opportunities' && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <div>
              <h3 className="font-bold text-base text-[#0F172A]">Date Rescue Opportunities</h3>
              <p className="text-xs text-[#64748B]">Urgent show replacement calls matching your talent category</p>
            </div>
            <span className="text-xs font-semibold bg-[#CCFBF1] text-[#0F766E] px-2.5 py-1 rounded-lg">
              Priority Standby Network
            </span>
          </div>

          <div className="space-y-3">
            {allBookings.filter((b) => b.isDateRescue || b.status === 'Pending').length === 0 ? (
              <p className="text-xs text-[#64748B] text-center py-6">
                No active Date Rescue broadcasts currently. Keep your availability updated to receive instant pings.
              </p>
            ) : (
              allBookings
                .filter((b) => b.isDateRescue || b.status === 'Pending')
                .map((opp) => (
                  <div
                    key={opp.id}
                    className="p-4 rounded-xl border border-[#E2E8F0] bg-white hover:border-[#0D9488]/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-[#CCFBF1] text-[#0F766E] px-2 py-0.5 rounded">
                          Rescue Call
                        </span>
                        <h4 className="font-bold text-sm text-[#0F172A]">{opp.eventName}</h4>
                      </div>
                      <p className="text-[#64748B] mt-1">
                        Date: {opp.date} · City: {opp.city || 'Mumbai'} · Target Role: {opp.category || 'Performer'}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className="font-bold text-sm text-[#0D9488]">
                        ₹{opp.estimatedCostINR.toLocaleString('en-IN')}
                      </span>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          handleAcceptRequest(opp);
                        }}
                      >
                        Accept Opportunity
                      </Button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}

      {/* TAB VIEW: PLANS */}
      {activeTab === 'plans' && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#0F172A]">Artist Membership & Growth Tiers</h3>
                <span className="text-[10px] font-bold bg-[#E0F2FE] text-[#0F2747] px-2 py-0.5 rounded-full border border-[#BAE6FD]">
                  Proposed Demo Rates
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                Simulate artist tier privileges. No credit card or binding transaction required.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Tier 1: Free Artist */}
            <div className="p-5 rounded-2xl border border-[#E2E8F0] bg-white flex flex-col justify-between space-y-4 hover:border-slate-300 transition-colors">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#64748B] uppercase">Free Artist</span>
                  <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">Standard</span>
                </div>
                <div className="text-2xl font-black text-[#0F172A]">₹0</div>
                <p className="text-[11px] text-[#64748B]">Basic profile and standard organizer enquiries.</p>
                <ul className="space-y-1.5 pt-2 text-[11px] text-[#475569]">
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#0D9488]" /> Talent profile listing</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#0D9488]" /> Receive direct organizer inquiries</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#0D9488]" /> Basic availability calendar</li>
                </ul>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-center"
                onClick={() => {
                  try { localStorage.setItem('eventora_active_plan_tier', 'free-artist'); } catch {}
                  showToast('Free Artist plan active (Demo mode).');
                }}
              >
                Select Free Plan
              </Button>
            </div>

            {/* Tier 2: Seasonal Pass */}
            <div className="p-5 rounded-2xl border border-[#0D9488]/40 bg-[#CCFBF1]/15 flex flex-col justify-between space-y-4 hover:border-[#0D9488] transition-colors">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#0D9488] uppercase">Seasonal Pass</span>
                  <span className="text-[10px] font-bold bg-[#CCFBF1] text-[#0F766E] px-2 py-0.5 rounded">Gig Match</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-[#0F172A]">₹199</span>
                  <span className="text-[11px] text-[#64748B]">proposed / mo</span>
                </div>
                <p className="text-[11px] text-[#64748B]">Open-date opportunities and seasonal matching.</p>
                <ul className="space-y-1.5 pt-2 text-[11px] text-[#475569]">
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#0D9488]" /> Open-date gig opportunities board</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#0D9488]" /> Festival & wedding seasonal matches</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#0D9488]" /> Multi-city coverage (3 areas)</li>
                </ul>
              </div>
              <Button
                variant="secondary"
                size="sm"
                className="w-full justify-center"
                onClick={() => {
                  try { localStorage.setItem('eventora_active_plan_tier', 'seasonal-pass'); } catch {}
                  showToast('Seasonal Pass activated in demo simulation mode.');
                }}
              >
                Choose Seasonal Pass
              </Button>
            </div>

            {/* Tier 3: Premium Artist */}
            <div className="p-5 rounded-2xl border-2 border-[#0D9488] bg-white shadow-xs flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#0D9488] uppercase">Premium Artist</span>
                  <span className="text-[10px] font-bold bg-[#0D9488] text-white px-2 py-0.5 rounded">Priority</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-[#0F172A]">₹499</span>
                  <span className="text-[11px] text-[#64748B]">proposed / mo</span>
                </div>
                <p className="text-[11px] text-[#64748B]">Priority matching and cancellation recovery alerts.</p>
                <ul className="space-y-1.5 pt-2 text-[11px] text-[#475569]">
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#0D9488]" /> Top priority in organizer searches</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#0D9488]" /> Real-time Date Rescue radar alerts</li>
                  <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-[#0D9488]" /> Verified talent badge & sound rider passport</li>
                </ul>
              </div>
              <Button
                variant="primary"
                size="sm"
                className="w-full justify-center"
                onClick={() => {
                  try { localStorage.setItem('eventora_active_plan_tier', 'premium-artist'); } catch {}
                  showToast('Premium Artist tier activated in demo simulation mode.');
                }}
              >
                Choose Premium Artist
              </Button>
            </div>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] p-4 rounded-xl text-[11px] text-[#64748B] flex items-center justify-between gap-3">
            <span>
              <strong>Note:</strong> Proposed hackathon pricing. No guaranteed bookings or cancellation compensation claims.
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onTabChange('overview')}
            >
              Back to Overview
            </Button>
          </div>
        </div>
      )}

      {/* REJECT CONFIRMATION MODAL */}
      {rejectConfirmBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setRejectConfirmBooking(null)}
          />

          <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E2E8F0] z-10 space-y-4">
            <div className="flex items-center gap-2.5 text-rose-600 font-bold text-base">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <span>Decline Booking Request?</span>
            </div>

            <p className="text-xs text-[#475569] leading-relaxed">
              Are you sure you want to decline the request for <strong>{rejectConfirmBooking.eventName}</strong> on{' '}
              <strong>{rejectConfirmBooking.date}</strong>?
            </p>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-800 space-y-1">
              <p className="font-semibold">Notification:</p>
              <p>
                The event organizer will be notified with <strong>Rejected</strong> status so they can quickly search for
                an alternate performer via Date Rescue.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#F1F5F9]">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRejectConfirmBooking(null)}
              >
                Keep Request
              </Button>

              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmReject}
              >
                Confirm Rejection
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
