import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Plus,
  Users,
  Building,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  Sparkles,
  IndianRupee,
  Search,
  CheckCircle2,
  XCircle,
  Clock3,
  Filter,
  ArrowRight,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/Badge';
import {
  OrganizerEvent,
  OrganizerBookingRequest,
  OrganizerTab,
  TalentProfile,
  VenueSpace,
} from '../../types';
import { CreateEventForm } from '../organizer/CreateEventForm';

interface OrganizerDashboardProps {
  activeTab: OrganizerTab;
  onTabChange: (tab: OrganizerTab) => void;
  onOpenBackupModal: () => void;
}

// Initial sample events (clearly labelled sample data)
const initialSampleEvents: OrganizerEvent[] = [
  {
    id: 'evt-101',
    name: 'Diwali Fusion Concert & Night Market',
    eventType: 'Concert',
    city: 'Mumbai',
    date: 'Oct 28, 2026',
    startTime: '19:00',
    expectedGuests: 1200,
    totalBudgetINR: 250000,
    requiredServices: ['Singer', 'DJ', 'Anchor'],
    additionalPreferences: 'Outdoor amphitheater stage with Punjabi and Bollywood sets.',
    status: 'Upcoming',
    allocatedCostINR: 110000,
  },
  {
    id: 'evt-102',
    name: 'TechPulse Annual Innovation Gala',
    eventType: 'Corporate',
    city: 'Bengaluru',
    date: 'Nov 05, 2026',
    startTime: '18:30',
    expectedGuests: 450,
    totalBudgetINR: 180000,
    requiredServices: ['Anchor', 'Photographer', 'DJ'],
    additionalPreferences: 'Formal banquet hall setup with keynotes and ambient cocktail music.',
    status: 'Upcoming',
    allocatedCostINR: 65000,
  },
  {
    id: 'evt-103',
    name: 'Suncrest College Cultural Fest — Day 2',
    eventType: 'College Fest',
    city: 'Delhi',
    date: 'Nov 12, 2026',
    startTime: '16:00',
    expectedGuests: 2500,
    totalBudgetINR: 320000,
    requiredServices: ['DJ', 'Dancer', 'Singer', 'Anchor'],
    additionalPreferences: 'High energy campus grounds with student battle of bands.',
    status: 'Planning',
    allocatedCostINR: 140000,
  },
];

// Initial sample booking requests
const initialSampleBookings: OrganizerBookingRequest[] = [
  {
    id: 'req-1',
    targetName: 'Aarav Mehta & The Groove Collective',
    targetType: 'Artist',
    eventName: 'Diwali Fusion Concert',
    date: 'Oct 28, 2026',
    estimatedCostINR: 65000,
    status: 'Accepted',
  },
  {
    id: 'req-2',
    targetName: 'Grand Hyatt Terrace & Ballroom',
    targetType: 'Venue',
    eventName: 'TechPulse Innovation Gala',
    date: 'Nov 05, 2026',
    estimatedCostINR: 45000,
    status: 'Accepted',
  },
  {
    id: 'req-3',
    targetName: 'DJ Rhea (Live Electronic Sets)',
    targetType: 'Artist',
    eventName: 'Suncrest College Fest',
    date: 'Nov 12, 2026',
    estimatedCostINR: 35000,
    status: 'Pending',
  },
  {
    id: 'req-4',
    targetName: 'Studio 9 Photography & Drone Coverage',
    targetType: 'Artist',
    eventName: 'TechPulse Innovation Gala',
    date: 'Nov 05, 2026',
    estimatedCostINR: 20000,
    status: 'Rejected',
  },
];

// Discoverable sample artists
const discoverableArtists: TalentProfile[] = [
  {
    id: 'art-1',
    name: 'Aarav Mehta & Band',
    genre: 'Bollywood & Sufi Rock',
    rating: 4.9,
    standbyAvailable: true,
    responseTime: '20 mins',
    location: 'Mumbai (4.2 km)',
    recentGigs: 48,
    verified: true,
    indicativeFeeINR: 65000,
  },
  {
    id: 'art-2',
    name: 'DJ Rhea',
    genre: 'EDM & Commercial Hits',
    rating: 4.8,
    standbyAvailable: true,
    responseTime: '30 mins',
    location: 'Bengaluru (3.1 km)',
    recentGigs: 36,
    verified: true,
    indicativeFeeINR: 35000,
  },
  {
    id: 'art-3',
    name: 'Rohan Deshmukh (Emcee)',
    genre: 'Corporate & Live Anchor',
    rating: 5.0,
    standbyAvailable: true,
    responseTime: '15 mins',
    location: 'Delhi (2.8 km)',
    recentGigs: 62,
    verified: true,
    indicativeFeeINR: 25000,
  },
  {
    id: 'art-4',
    name: 'Symphony Strings Ensemble',
    genre: 'Classical & Fusion Quartet',
    rating: 4.9,
    standbyAvailable: false,
    responseTime: '45 mins',
    location: 'Mumbai (6.5 km)',
    recentGigs: 29,
    verified: true,
    indicativeFeeINR: 45000,
  },
];

// Discoverable sample venues
const discoverableVenues: VenueSpace[] = [
  {
    id: 'ven-1',
    name: 'Metro Amphitheater & Grounds',
    capacity: 3500,
    type: 'Open-Air Arena',
    status: 'Available',
    soundRig: 'Full Line Array & In-Ear Systems',
    curfew: '11:00 PM',
    location: 'Mumbai Central',
    indicativeRateINR: 85000,
  },
  {
    id: 'ven-2',
    name: 'Grand Hyatt Terrace & Ballroom',
    capacity: 600,
    type: 'Banquet & Rooftop',
    status: 'Available',
    soundRig: 'Acoustic Setup & Speech PA',
    curfew: '01:00 AM',
    location: 'Bengaluru North',
    indicativeRateINR: 45000,
  },
  {
    id: 'ven-3',
    name: 'The Copper Vault Intimate Hall',
    capacity: 300,
    type: 'Acoustic Underground',
    status: 'Hold',
    soundRig: 'Club Sound Rig',
    curfew: '02:00 AM',
    location: 'Delhi NCR',
    indicativeRateINR: 30000,
  },
];

export const OrganizerDashboard: React.FC<OrganizerDashboardProps> = ({
  activeTab,
  onTabChange,
  onOpenBackupModal,
}) => {
  // LocalStorage persistence for created events
  const [events, setEvents] = useState<OrganizerEvent[]>(() => {
    try {
      const stored = localStorage.getItem('eventora_organizer_events_v2');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return initialSampleEvents;
  });

  // LocalStorage persistence for bookings
  const [bookings, setBookings] = useState<OrganizerBookingRequest[]>(() => {
    try {
      const stored = localStorage.getItem('eventora_organizer_bookings_v2');
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return initialSampleBookings;
  });

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('eventora_organizer_events_v2', JSON.stringify(events));
    } catch {
      // ignore
    }
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem('eventora_organizer_bookings_v2', JSON.stringify(bookings));
    } catch {
      // ignore
    }
  }, [bookings]);

  // When activeTab is 'create-event', open form
  useEffect(() => {
    if (activeTab === 'create-event') {
      setCreateModalOpen(true);
    }
  }, [activeTab]);

  const handleCreateEvent = (newEvent: OrganizerEvent) => {
    setEvents((prev) => [newEvent, ...prev]);
    setSuccessNotice(`Event "${newEvent.name}" created and added to your schedule.`);
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  // Calculations for summary metrics
  const upcomingCount = events.filter((e) => e.status !== 'Completed').length;
  const pendingRequestsCount = bookings.filter((b) => b.status === 'Pending').length;

  // Calculate budget remaining = Total Budget of active events minus total allocated/accepted costs
  const totalBudget = events.reduce((sum, e) => sum + e.totalBudgetINR, 0);
  const totalAllocated = bookings
    .filter((b) => b.status === 'Accepted')
    .reduce((sum, b) => sum + b.estimatedCostINR, 0);
  const budgetRemainingINR = Math.max(0, totalBudget - totalAllocated);

  const handleUpdateBookingStatus = (id: string, newStatus: 'Accepted' | 'Rejected') => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b))
    );
    setSuccessNotice(`Booking request marked as ${newStatus}.`);
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  const handleSendArtistRequest = (artist: TalentProfile) => {
    const targetEvent = events[0] || { name: 'Upcoming Production', date: 'Next Weekend' };
    const newReq: OrganizerBookingRequest = {
      id: `req-${Date.now()}`,
      targetName: artist.name,
      targetType: 'Artist',
      eventName: targetEvent.name,
      date: targetEvent.date,
      estimatedCostINR: artist.indicativeFeeINR || 35000,
      status: 'Pending',
    };
    setBookings([newReq, ...bookings]);
    setSuccessNotice(`Booking request sent to ${artist.name}!`);
    setTimeout(() => setSuccessNotice(null), 3500);
  };

  const handleSendVenueRequest = (venue: VenueSpace) => {
    const targetEvent = events[0] || { name: 'Upcoming Production', date: 'Next Weekend' };
    const newReq: OrganizerBookingRequest = {
      id: `req-${Date.now()}`,
      targetName: venue.name,
      targetType: 'Venue',
      eventName: targetEvent.name,
      date: targetEvent.date,
      estimatedCostINR: venue.indicativeRateINR || 50000,
      status: 'Pending',
    };
    setBookings([newReq, ...bookings]);
    setSuccessNotice(`Hold request sent to ${venue.name}!`);
    setTimeout(() => setSuccessNotice(null), 3500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Toast Alert */}
      {successNotice && (
        <div className="bg-[#CCFBF1] border border-[#99F6E4] text-[#0F766E] p-3 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#0D9488]" />
            <span>{successNotice}</span>
          </div>
          <button onClick={() => setSuccessNotice(null)} className="font-bold text-xs">
            ✕
          </button>
        </div>
      )}

      {/* 1 & 2. Greeting & Primary Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E2E8F0]">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
            Plan your next event
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Coordinate talent, venues, and backup plans for all your upcoming shows.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab !== 'overview' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onTabChange('overview')}
              icon={<ArrowLeft className="w-3.5 h-3.5" />}
            >
              Overview
            </Button>
          )}

          <Button
            variant="primary"
            size="md"
            onClick={() => setCreateModalOpen(true)}
            icon={<Plus className="w-4 h-4" />}
          >
            + Create Event
          </Button>
        </div>
      </div>

      {/* 3. Three Compact Summary Cards (Clearly labelled sample data) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Upcoming Events */}
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span>Upcoming Events</span>
            <Calendar className="w-4 h-4 text-[#0D9488]" />
          </div>
          <div className="text-2xl font-bold text-[#0F172A] mt-1.5">
            {upcomingCount}
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[11px] text-emerald-600 font-medium">
              Active in schedule
            </span>
            <span className="text-[9px] uppercase font-semibold text-slate-400 bg-slate-50 px-1 py-0.2 rounded border">
              Sample Data
            </span>
          </div>
        </div>

        {/* Card 2: Pending Requests */}
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span>Pending Requests</span>
            <Clock3 className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-1.5">
            {pendingRequestsCount}
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[11px] text-[#64748B]">
              Awaiting artist / venue reply
            </span>
            <span className="text-[9px] uppercase font-semibold text-slate-400 bg-slate-50 px-1 py-0.2 rounded border">
              Sample Data
            </span>
          </div>
        </div>

        {/* Card 3: Budget Remaining */}
        <div className="bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span>Budget Remaining</span>
            <IndianRupee className="w-4 h-4 text-[#0F2747]" />
          </div>
          <div className="text-2xl font-bold text-[#0D9488] mt-1.5">
            ₹{budgetRemainingINR.toLocaleString('en-IN')}
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[11px] text-[#64748B]">
              ₹{totalAllocated.toLocaleString('en-IN')} allocated
            </span>
            <span className="text-[9px] uppercase font-semibold text-slate-400 bg-slate-50 px-1 py-0.2 rounded border">
              Sample Data
            </span>
          </div>
        </div>
      </div>

      {/* 4. Quick-Action Cards: Find Artists, Find Venues, Find Backup */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Quick Action: Find Artists */}
        <div
          onClick={() => onTabChange('discover-artists')}
          className="bg-white p-4 rounded-xl border border-[#E2E8F0] hover:border-[#0D9488]/40 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#0F172A] group-hover:text-[#0D9488] transition-colors">
                Find Artists
              </h3>
              <p className="text-[11px] text-[#64748B] mt-0.5">
                Browse verified DJs, singers, anchors, and performers.
              </p>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#F1F5F9] text-[11px] font-semibold text-[#0D9488] flex items-center justify-between">
            <span>Discover talent</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Quick Action: Find Venues */}
        <div
          onClick={() => onTabChange('discover-venues')}
          className="bg-white p-4 rounded-xl border border-[#E2E8F0] hover:border-[#0D9488]/40 hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E0F2FE] text-[#0F2747] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Building className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#0F172A] group-hover:text-[#0D9488] transition-colors">
                Find Venues
              </h3>
              <p className="text-[11px] text-[#64748B] mt-0.5">
                Explore halls, banquet spaces, and amphitheaters.
              </p>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#F1F5F9] text-[11px] font-semibold text-[#0F2747] flex items-center justify-between">
            <span>Explore spaces</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>

        {/* Quick Action: Find Backup */}
        <div
          onClick={onOpenBackupModal}
          className="bg-gradient-to-r from-[#0F2747] to-[#0D9488] p-4 rounded-xl text-white shadow-xs hover:shadow transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 text-[#CCFBF1] flex items-center justify-center shrink-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                Find Backup
              </h3>
              <p className="text-[11px] text-sky-100 mt-0.5">
                Last-minute artist dropout? Find available replacements now.
              </p>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-white/20 text-[11px] font-bold text-[#CCFBF1] flex items-center justify-between">
            <span>Date Rescue</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* DISCOVER ARTISTS SUB-VIEW (When navigated via sidebar or quick-action) */}
      {activeTab === 'discover-artists' && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <div>
              <h3 className="font-bold text-base text-[#0F172A]">Discover Artists</h3>
              <p className="text-xs text-[#64748B]">Verified performers ready for booking</p>
            </div>
            <span className="text-xs font-semibold text-[#0D9488] bg-[#CCFBF1] px-2.5 py-1 rounded-lg">
              {discoverableArtists.length} Artists Available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {discoverableArtists.map((artist) => (
              <div
                key={artist.id}
                className="p-4 rounded-xl border border-[#E2E8F0] hover:border-[#0D9488]/40 transition-colors bg-white flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#0F172A]">{artist.name}</h4>
                      <p className="text-xs text-[#64748B]">{artist.genre}</p>
                    </div>
                    <span className="text-xs font-bold text-[#0D9488]">
                      ₹{artist.indicativeFeeINR?.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-[#64748B] mt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#0D9488]" />
                      {artist.location}
                    </span>
                    <span>★ {artist.rating.toFixed(1)}</span>
                    <span>· {artist.recentGigs} Gigs</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#F1F5F9] flex justify-end">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleSendArtistRequest(artist)}
                  >
                    Send Booking Request
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DISCOVER VENUES SUB-VIEW (When navigated via sidebar or quick-action) */}
      {activeTab === 'discover-venues' && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <div>
              <h3 className="font-bold text-base text-[#0F172A]">Discover Venues</h3>
              <p className="text-xs text-[#64748B]">Auditoriums, open grounds, and banquet halls</p>
            </div>
            <span className="text-xs font-semibold text-[#0F2747] bg-[#E0F2FE] px-2.5 py-1 rounded-lg">
              {discoverableVenues.length} Venues Listed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {discoverableVenues.map((venue) => (
              <div
                key={venue.id}
                className="p-4 rounded-xl border border-[#E2E8F0] hover:border-[#0D9488]/40 transition-colors bg-white flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#0F172A]">{venue.name}</h4>
                      <p className="text-xs text-[#64748B]">{venue.type} · {venue.location}</p>
                    </div>
                    <span className="text-xs font-bold text-[#0D9488]">
                      ₹{venue.indicativeRateINR?.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] text-[#64748B] mt-2">
                    <span>Capacity: <strong>{venue.capacity} guests</strong></span>
                    <span>· Curfew: {venue.curfew}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#F1F5F9] flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSendVenueRequest(venue)}
                  >
                    Request Date Hold
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Upcoming Events List */}
      {(activeTab === 'overview' || activeTab === 'my-events') && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#0F172A]">Upcoming Events</h3>
              <p className="text-xs text-[#64748B]">
                Your scheduled productions and guest line-ups
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#64748B]">
                {events.length} Events
              </span>
              <button
                onClick={() => setCreateModalOpen(true)}
                className="text-xs font-semibold text-[#0D9488] hover:text-[#0F766E] cursor-pointer ml-2"
              >
                + Add
              </button>
            </div>
          </div>

          {events.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#64748B] space-y-2">
              <Calendar className="w-8 h-8 text-slate-300 mx-auto" />
              <p>No events planned yet.</p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setCreateModalOpen(true)}
              >
                Create your first event
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-[#F1F5F9]">
              {events.map((event) => {
                const isExpanded = expandedEventId === event.id;
                return (
                  <div
                    key={event.id}
                    className="p-4 sm:p-5 hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-[#0F172A]">
                            {event.name}
                          </h4>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#E0F2FE] text-[#0F2747]">
                            {event.eventType}
                          </span>
                          <StatusBadge
                            status={event.status === 'Upcoming' ? 'Accepted' : 'Pending'}
                            label={event.status}
                            size="sm"
                          />
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B]">
                          <span className="flex items-center gap-1 text-[#0F172A] font-medium">
                            <Calendar className="w-3.5 h-3.5 text-[#0D9488]" />
                            {event.date} · {event.startTime}
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#64748B]" />
                            {event.city}
                          </span>
                          <span>·</span>
                          <span>{event.expectedGuests.toLocaleString()} Guests</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <div className="text-right">
                          <span className="text-[10px] text-[#64748B] block">Budget</span>
                          <span className="text-xs font-bold text-[#0D9488]">
                            ₹{event.totalBudgetINR.toLocaleString('en-IN')}
                          </span>
                        </div>

                        <button
                          onClick={() =>
                            setExpandedEventId(isExpanded ? null : event.id)
                          }
                          className="text-xs font-medium text-[#0D9488] hover:text-[#0F766E] flex items-center gap-1 cursor-pointer ml-2"
                        >
                          <span>{isExpanded ? 'Hide' : 'Details'}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Expandable Details */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-[#F1F5F9] bg-[#F8FAFC] p-3 rounded-xl text-xs space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[#64748B] font-medium">
                            Required Services:
                          </span>
                          {event.requiredServices.map((srv) => (
                            <span
                              key={srv}
                              className="px-2 py-0.5 rounded-md bg-white border border-[#E2E8F0] text-[#0F172A] text-[10px]"
                            >
                              {srv}
                            </span>
                          ))}
                        </div>

                        {event.additionalPreferences && (
                          <p className="text-[11px] text-slate-600">
                            <strong>Preferences:</strong> {event.additionalPreferences}
                          </p>
                        )}

                        <div className="pt-2 flex items-center justify-between text-[11px] border-t border-[#E2E8F0]/60">
                          <span className="text-[#64748B]">Event Reference: {event.id}</span>
                          <button
                            onClick={onOpenBackupModal}
                            className="text-[#0D9488] hover:underline font-semibold cursor-pointer"
                          >
                            Find Backup for this event →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 6. Recent Booking Requests (with Pending, Accepted, Rejected statuses) */}
      {(activeTab === 'overview' || activeTab === 'my-bookings') && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-[#E2E8F0] flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[#0F172A]">
                Recent Booking Requests
              </h3>
              <p className="text-xs text-[#64748B]">
                Direct offers sent to performers and venues
              </p>
            </div>
            <span className="text-xs text-[#64748B]">
              {bookings.length} Requests
            </span>
          </div>

          {bookings.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#64748B]">
              No booking requests yet. Discover artists or venues to send an offer.
            </div>
          ) : (
            <div className="divide-y divide-[#F1F5F9]">
              {bookings.map((req) => (
                <div
                  key={req.id}
                  className="p-4 sm:p-5 hover:bg-slate-50/50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm text-[#0F172A]">
                          {req.targetName}
                        </h4>
                        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                          {req.targetType}
                        </span>
                        <StatusBadge status={req.status} size="sm" />
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B]">
                        <span>Event: <strong className="text-[#0F172A]">{req.eventName}</strong></span>
                        <span>·</span>
                        <span>{req.date}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center">
                      <span className="text-xs font-bold text-[#0F172A]">
                        ₹{req.estimatedCostINR.toLocaleString('en-IN')}
                      </span>

                      {req.status === 'Pending' ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleUpdateBookingStatus(req.id, 'Accepted')}
                            title="Simulate Acceptance"
                            className="px-2 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 cursor-pointer"
                          >
                            Mark Accepted
                          </button>
                          <button
                            onClick={() => handleUpdateBookingStatus(req.id, 'Rejected')}
                            title="Simulate Decline"
                            className="px-2 py-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 cursor-pointer"
                          >
                            Decline
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#64748B]">
                          {req.status === 'Accepted' ? 'Confirmed on stage' : 'Slot released'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CREATE EVENT MODAL / FORM */}
      <CreateEventForm
        isOpen={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          if (activeTab === 'create-event') onTabChange('overview');
        }}
        onSubmitEvent={handleCreateEvent}
      />
    </div>
  );
};
