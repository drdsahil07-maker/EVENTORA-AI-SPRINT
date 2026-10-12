import React, { useState } from 'react';
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
} from 'lucide-react';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/Badge';

interface ArtistDashboardProps {
  onOpenDateRescue?: () => void;
}

export const ArtistDashboard: React.FC<ArtistDashboardProps> = ({
  onOpenDateRescue,
}) => {
  const [isAvailable, setIsAvailable] = useState(true);
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // New Enquiries
  const [enquiries, setEnquiries] = useState([
    {
      id: 'enq-1',
      event: 'Neon Horizon Main Stage',
      organizer: 'Nexus Live Productions',
      date: 'Tonight, Oct 11 · 8:30 PM',
      city: 'Downtown Pavilion',
      fee: '$1,850',
      status: 'Pending' as const,
      details: 'Stage PA and wireless monitoring provided. Sound check at 7:30 PM.',
    },
    {
      id: 'enq-2',
      event: 'Sunset Rooftop Lounge',
      organizer: 'Skyline Events',
      date: 'Sunday, Oct 15 · 5:00 PM',
      city: 'Harbor Pier',
      fee: '$850',
      status: 'Pending' as const,
      details: 'Acoustic background set. 2 vocal mics and DI box needed.',
    },
  ]);

  // Upcoming Bookings
  const [upcomingBookings, setUpcomingBookings] = useState([
    {
      id: 'bk-1',
      event: 'Velvet Sessions Jazz Night',
      date: 'Tomorrow, Oct 12 · 9:00 PM',
      venue: 'The Copper Vault',
      fee: '$1,200',
      status: 'Accepted' as const,
      techNotes: 'Venue provides acoustic piano and sound engineer. Arrival time 8:00 PM.',
    },
    {
      id: 'bk-2',
      event: 'Harbor Fall Music Festival',
      date: 'Oct 24, 2026 · 4:00 PM',
      venue: 'Pier 12 Amphitheater',
      fee: '$2,100',
      status: 'Accepted' as const,
      techNotes: 'Outdoor covered stage. Full monitor mix on channel 3 & 4.',
    },
  ]);

  // Opportunities
  const [opportunities, setOpportunities] = useState([
    {
      id: 'opp-1',
      title: 'Acoustic Duo Needed',
      date: 'Oct 19, 2026',
      city: 'Mission District',
      budget: '$900',
      applied: false,
    },
    {
      id: 'opp-2',
      title: 'Opening Act for Indie Showcase',
      date: 'Oct 22, 2026',
      city: 'Downtown Arts',
      budget: '$1,100',
      applied: false,
    },
  ]);

  const handleAcceptEnquiry = (id: string, eventName: string) => {
    const enq = enquiries.find((e) => e.id === id);
    if (enq) {
      setEnquiries(enquiries.filter((e) => e.id !== id));
      setUpcomingBookings([
        {
          id: `bk-${Date.now()}`,
          event: enq.event,
          date: enq.date,
          venue: enq.city,
          fee: enq.fee,
          status: 'Accepted',
          techNotes: enq.details,
        },
        ...upcomingBookings,
      ]);
      setSuccessToast(`Accepted booking for ${eventName}!`);
      setTimeout(() => setSuccessToast(null), 3500);
    }
  };

  const handleDeclineEnquiry = (id: string) => {
    setEnquiries(enquiries.filter((e) => e.id !== id));
    setSuccessToast('Enquiry declined.');
    setTimeout(() => setSuccessToast(null), 2500);
  };

  const handleApplyOpp = (id: string) => {
    setOpportunities(
      opportunities.map((o) => (o.id === id ? { ...o, applied: true } : o))
    );
    setSuccessToast('Application sent to event organizer!');
    setTimeout(() => setSuccessToast(null), 3000);
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

      {/* Header and My Availability Status Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
            Artist & Performer Hub
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Review booking requests and manage your gig calendar.
          </p>
        </div>

        {/* My Availability Toggle */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-[#E2E8F0]">
          <div className="text-xs">
            <span className="text-[#64748B] block text-[10px] uppercase font-semibold">
              My Availability
            </span>
            <span className="font-bold text-[#0F172A]">
              {isAvailable ? 'Open for Bookings' : 'Unavailable'}
            </span>
          </div>
          <button
            onClick={() => {
              setIsAvailable(!isAvailable);
              setSuccessToast(
                !isAvailable
                  ? 'Availability set to Open. Organizers can send booking requests.'
                  : 'Availability paused.'
              );
              setTimeout(() => setSuccessToast(null), 3000);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
              isAvailable
                ? 'bg-[#0D9488] text-white'
                : 'bg-slate-200 text-slate-700'
            }`}
          >
            {isAvailable ? 'Available' : 'Set Available'}
          </button>
        </div>
      </div>

      {/* Cancellation Recovery Card */}
      <div className="bg-gradient-to-r from-[#0F2747] to-[#0D9488] rounded-2xl p-5 text-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-[11px] font-semibold text-[#CCFBF1]">
            <ShieldAlert className="w-3.5 h-3.5" />
            Cancellation Recovery
          </div>
          <h2 className="text-base sm:text-lg font-bold">
            Fill Last-Minute Date Rescue Gigs
          </h2>
          <p className="text-xs text-sky-100 max-w-lg">
            When another artist cancels, nearby organizers request immediate cover. High rates and instant booking.
          </p>
        </div>

        <Button
          variant="mint"
          size="sm"
          onClick={onOpenDateRescue}
          className="shrink-0 font-bold"
        >
          View Rescue Calls
        </Button>
      </div>

      {/* New Enquiries */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-[#0F172A]">New Enquiries</h3>
            <p className="text-xs text-[#64748B]">Organizers waiting for your confirmation</p>
          </div>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
            {enquiries.length} New
          </span>
        </div>

        {enquiries.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#64748B]">
            No pending enquiries right now. Your profile is active for new dates.
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
                      From <strong className="text-[#0F172A]">{enq.organizer}</strong> · {enq.date} · {enq.city}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="text-sm font-bold text-[#0D9488]">{enq.fee}</span>
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

      {/* Upcoming Bookings */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-[#0F172A]">Upcoming Bookings</h3>
            <p className="text-xs text-[#64748B]">Confirmed shows on your calendar</p>
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
                      <span>{b.date}</span>
                      <span>·</span>
                      <span>{b.venue}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <span className="text-xs font-bold text-[#0F172A]">{b.fee}</span>
                    <button
                      onClick={() => setExpandedBookingId(isExpanded ? null : b.id)}
                      className="text-xs font-medium text-[#0D9488] hover:text-[#0F766E] flex items-center gap-1 cursor-pointer"
                    >
                      <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Hidden by default; only shown if user clicks View Details */}
                {isExpanded && (
                  <div className="mt-3 pt-3 border-t border-[#F1F5F9] text-xs bg-[#F8FAFC] p-3 rounded-xl space-y-1 text-[#475569]">
                    <div className="font-medium text-[#0F172A]">Stage & Rider Information:</div>
                    <p className="text-[11px] leading-relaxed">{b.techNotes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Find More Opportunities */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-sm text-[#0F172A]">Find More Opportunities</h3>
            <p className="text-xs text-[#64748B]">Open calls from local event organizers</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              className="p-4 rounded-xl border border-[#E2E8F0] bg-white flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between">
                  <h4 className="font-semibold text-xs text-[#0F172A]">{opp.title}</h4>
                  <span className="text-xs font-bold text-[#0D9488]">{opp.budget}</span>
                </div>
                <p className="text-[11px] text-[#64748B] mt-1">{opp.date} · {opp.city}</p>
              </div>

              <div className="pt-2">
                <Button
                  variant={opp.applied ? 'ghost' : 'outline'}
                  size="sm"
                  fullWidth
                  disabled={opp.applied}
                  onClick={() => handleApplyOpp(opp.id)}
                >
                  {opp.applied ? 'Application Sent' : 'Apply for Gig'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
