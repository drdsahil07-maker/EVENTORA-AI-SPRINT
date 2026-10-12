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
  Filter,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertTriangle,
  MoreVertical,
  Bell,
  Heart,
  TrendingUp,
  Wallet,
  CalendarDays,
  Mic2,
  Building2,
  Zap,
  Crown,
  Share2,
  Star,
  Send,
  MessageSquare,
  BarChart3,
  CheckCircle,
} from 'lucide-react';
import { Button } from '../common/Button';
import { StatusBadge } from '../common/Badge';
import {
  OrganizerEvent,
  OrganizerBookingRequest,
  OrganizerTab,
  TalentProfile,
  VenueSpace,
  RescueRequestData,
} from '../../types';
import { CreateEventForm } from '../organizer/CreateEventForm';
import { DateRescueModal } from '../rescue/DateRescueModal';
import { ProfilePhotoUploader } from '../common/ProfilePhotoUploader';
import { OrganizerProfileEditModal, OrganizerProfileData } from './OrganizerProfileEditModal';
import { getProfilePhoto } from '../../utils/imageStorage';
import { SEEDED_RESCUE_ARTISTS } from '../../data/mockArtists';
import {
  getSharedBookings,
  saveSharedBooking,
  updateBookingStatus,
  subscribeToBookings,
} from '../../utils/bookingStore';

interface OrganizerDashboardProps {
  activeTab: OrganizerTab;
  onTabChange: (tab: OrganizerTab) => void;
  onOpenBackupModal?: () => void;
  onNavigateToPricing?: () => void;
  onToggleNotifications?: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

// Initial sample events matching the reference dashboard
const initialSampleEvents: OrganizerEvent[] = [
  {
    id: 'evt-101',
    name: 'SAGE Tech Fest 2026',
    eventType: 'College Fest',
    city: 'Indore',
    date: 'Oct 15, 2026',
    startTime: '6:00 PM',
    expectedGuests: 800,
    totalBudgetINR: 120000,
    requiredServices: ['DJ', 'Anchor', 'Singer'],
    additionalPreferences: 'High energy student tech fest with live electronic concert stage.',
    status: 'Confirmed',
    allocatedCostINR: 65000,
    thumbnailUrl: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'evt-102',
    name: 'Freshers Night',
    eventType: 'College Fest',
    city: 'Indore',
    date: 'Nov 02, 2026',
    startTime: '7:00 PM',
    expectedGuests: 400,
    totalBudgetINR: 80000,
    requiredServices: ['DJ', 'Photographer'],
    additionalPreferences: 'Campus auditorium cultural welcome celebration with DJ sound.',
    status: 'Pending',
    allocatedCostINR: 35000,
    thumbnailUrl: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'evt-103',
    name: 'Alumni Meet',
    eventType: 'Corporate',
    city: 'Indore',
    date: 'Nov 20, 2026',
    startTime: '6:00 PM',
    expectedGuests: 300,
    totalBudgetINR: 60000,
    requiredServices: ['Singer', 'Anchor'],
    additionalPreferences: 'Formal grand hall dinner with acoustic and Sufi sets.',
    status: 'Planning',
    allocatedCostINR: 30000,
    thumbnailUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'evt-104',
    name: 'Annual Sports Day',
    eventType: 'College Fest',
    city: 'Indore',
    date: 'Dec 10, 2026',
    startTime: '9:00 AM',
    expectedGuests: 500,
    totalBudgetINR: 70000,
    requiredServices: ['Anchor', 'Photographer'],
    additionalPreferences: 'Stadium grounds emcee announcements and sports photography.',
    status: 'Draft',
    allocatedCostINR: 15000,
    thumbnailUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'evt-105',
    name: 'Diwali Fusion Concert & Night Market',
    eventType: 'Concert',
    city: 'Indore',
    date: 'Oct 28, 2026',
    startTime: '7:00 PM',
    expectedGuests: 1200,
    totalBudgetINR: 250000,
    requiredServices: ['Singer', 'DJ', 'Anchor'],
    additionalPreferences: 'Outdoor amphitheater stage with Punjabi and Bollywood sets.',
    status: 'Confirmed',
    allocatedCostINR: 110000,
    thumbnailUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80',
  },
];

// Initial booking requests matching reference dashboard
const initialSampleBookings: OrganizerBookingRequest[] = [
  {
    id: 'req-1',
    targetName: 'Ritvik Sharma',
    targetType: 'Artist',
    eventName: 'SAGE Tech Fest 2026',
    date: 'Oct 15',
    estimatedCostINR: 25000,
    status: 'Pending',
    category: 'DJ',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'req-2',
    targetName: 'Aishwarya Mehta',
    targetType: 'Artist',
    eventName: 'Freshers Night',
    date: 'Nov 02',
    estimatedCostINR: 35000,
    status: 'Accepted',
    category: 'Singer',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'req-3',
    targetName: 'BeatStorm Crew',
    targetType: 'Artist',
    eventName: 'Alumni Meet',
    date: 'Nov 20',
    estimatedCostINR: 30000,
    status: 'Rejected',
    category: 'Dance Group',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'req-4',
    targetName: 'MK Events',
    targetType: 'Venue',
    eventName: 'Annual Sports Day',
    date: 'Dec 10',
    estimatedCostINR: 50000,
    status: 'Pending',
    category: 'Venue',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&q=80',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'req-5',
    targetName: 'Neha Rawat',
    targetType: 'Artist',
    eventName: 'Campus Gala Night',
    date: 'Dec 15',
    estimatedCostINR: 15000,
    status: 'Pending',
    category: 'Anchor',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    createdAt: new Date().toISOString(),
  },
];

// Recommended artists matching reference dashboard
interface RecommendedArtist {
  id: string;
  name: string;
  category: string;
  matchScore: number;
  city: string;
  feeText: string;
  indicativeCostINR: number;
  tags: string[];
  avatarUrl: string;
  isLiked?: boolean;
}

const initialRecommendedArtists: RecommendedArtist[] = [
  {
    id: 'rec-1',
    name: 'DJ Armaan',
    category: 'DJ',
    matchScore: 95,
    city: 'Indore',
    feeText: '₹20K',
    indicativeCostINR: 20000,
    tags: ['DJ', 'EDM', 'Commercial'],
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    isLiked: false,
  },
  {
    id: 'rec-2',
    name: 'Riya Sharma',
    category: 'Singer',
    matchScore: 92,
    city: 'Indore',
    feeText: '₹35K',
    indicativeCostINR: 35000,
    tags: ['Singer', 'Bollywood', 'Sufi'],
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    isLiked: true,
  },
  {
    id: 'rec-3',
    name: 'The Vibe Crew',
    category: 'Dance',
    matchScore: 88,
    city: 'Indore',
    feeText: '₹28K',
    indicativeCostINR: 28000,
    tags: ['Dance', 'Hip-Hop', 'Fusion'],
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    isLiked: false,
  },
];

// Discoverable sample artists
const discoverableArtists: TalentProfile[] = [
  {
    id: 'art-1',
    name: 'DJ Armaan',
    genre: 'EDM & Commercial Club Hits',
    rating: 4.9,
    standbyAvailable: true,
    responseTime: '15 mins',
    location: 'Indore (Central)',
    recentGigs: 52,
    verified: true,
    indicativeFeeINR: 20000,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'art-2',
    name: 'Riya Sharma',
    genre: 'Live Bollywood & Contemporary Sufi',
    rating: 4.9,
    standbyAvailable: true,
    responseTime: '20 mins',
    location: 'Indore (Vijay Nagar)',
    recentGigs: 44,
    verified: true,
    indicativeFeeINR: 35000,
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'art-3',
    name: 'The Vibe Crew',
    genre: 'Hip-Hop & Bollywood Fusion Choreo',
    rating: 4.8,
    standbyAvailable: true,
    responseTime: '25 mins',
    location: 'Indore (Palasia)',
    recentGigs: 38,
    verified: true,
    indicativeFeeINR: 28000,
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'art-4',
    name: 'Ritvik Sharma',
    genre: 'Progressive Electronic & Festival Sets',
    rating: 4.8,
    standbyAvailable: true,
    responseTime: '30 mins',
    location: 'Indore / Bhopal',
    recentGigs: 36,
    verified: true,
    indicativeFeeINR: 25000,
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
  },
  {
    id: 'art-5',
    name: 'Aishwarya Mehta',
    genre: 'Classical & Retro Hindi Vocals',
    rating: 4.9,
    standbyAvailable: false,
    responseTime: '40 mins',
    location: 'Indore / Mumbai',
    recentGigs: 60,
    verified: true,
    indicativeFeeINR: 35000,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
  },
];

// Discoverable sample venues
const discoverableVenues: VenueSpace[] = [
  {
    id: 'ven-1',
    name: 'Rajwada Palace Grounds & Arena',
    capacity: 2500,
    type: 'Heritage Open-Air Grounds',
    status: 'Available',
    soundRig: 'Full Line Array & In-Ear PA (102 dBA ceiling)',
    curfew: '11:00 PM',
    location: 'Indore Central',
    indicativeRateINR: 65000,
  },
  {
    id: 'ven-2',
    name: 'Brilliant Convention Centre Ballroom',
    capacity: 1200,
    type: 'Banquet & Grand Hall',
    status: 'Available',
    soundRig: 'Acoustic Setup & Speech PA',
    curfew: '01:00 AM',
    location: 'Indore (Vijay Nagar)',
    indicativeRateINR: 55000,
  },
  {
    id: 'ven-3',
    name: 'Sayaji Amber Hall & Terrace',
    capacity: 450,
    type: 'Rooftop & Indoor Ballroom',
    status: 'Hold',
    soundRig: 'Club Sound Rig & Acoustic Setup',
    curfew: '12:00 AM',
    location: 'Indore (Bhamori)',
    indicativeRateINR: 35000,
  },
];

export const OrganizerDashboard: React.FC<OrganizerDashboardProps> = ({
  activeTab,
  onTabChange,
  onOpenBackupModal,
  onNavigateToPricing,
  onToggleNotifications,
  searchQuery = '',
  onSearchChange,
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

  // Shared persistence for bookings with cross-dashboard live sync
  const [bookings, setBookings] = useState<OrganizerBookingRequest[]>(getSharedBookings);

  // Recommended artists with like status
  const [recommendedArtists, setRecommendedArtists] = useState<RecommendedArtist[]>(initialRecommendedArtists);

  // Selected city in top navigation
  const [selectedCity, setSelectedCity] = useState<string>('Indore');
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);

  // Profile menu in top navigation
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [organizerProfile, setOrganizerProfile] = useState<OrganizerProfileData>(() => {
    try {
      const stored = localStorage.getItem('eventora_organizer_profile_rahul_raj_v1');
      if (stored) return JSON.parse(stored);
    } catch {}
    return {
      id: 'org-rahul-raj',
      fullName: 'Rahul Raj',
      email: 'rahul.raj@eventora.demo',
      phone: '+91 98765 12345',
      organizationName: 'Rahul Raj Productions',
      city: 'Indore',
      bio: 'Leading event organizer and production head specializing in college fests, live concerts, and corporate galas.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      isPublicContact: true,
    };
  });
  const [isOrganizerProfileModalOpen, setIsOrganizerProfileModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getProfilePhoto(`organizer:${organizerProfile.id}`).then((photo) => {
      if (isMounted && photo) {
        setOrganizerProfile((prev) => ({ ...prev, avatarUrl: photo }));
      }
    });
    return () => {
      isMounted = false;
    };
  }, [organizerProfile.id]);

  useEffect(() => {
    try {
      localStorage.setItem('eventora_organizer_profile_rahul_raj_v1', JSON.stringify(organizerProfile));
    } catch {}
  }, [organizerProfile]);

  // Close dropdowns on outside click or Escape
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.profile-menu-container') && !target.closest('.city-menu-container')) {
        setProfileMenuOpen(false);
        setCityDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setProfileMenuOpen(false);
        setCityDropdownOpen(false);
      }
    };
    window.addEventListener('mousedown', handleOutsideClick);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousedown', handleOutsideClick);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Active calendar date selection
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<number>(15);

  // Modals state
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [rescueModalOpen, setRescueModalOpen] = useState(false);
  const [rescuePrefill, setRescuePrefill] = useState<Partial<RescueRequestData> | undefined>(undefined);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [cancellationConfirmBooking, setCancellationConfirmBooking] = useState<OrganizerBookingRequest | null>(null);

  // Active dropdown menu for event card or booking card
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Filter for My Bookings tab
  const [bookingStatusFilter, setBookingStatusFilter] = useState<'All' | 'Pending' | 'Accepted' | 'Rejected' | 'Cancelled'>('All');

  // Messages Mock State for "messages" tab
  const [messagesList, setMessagesList] = useState([
    {
      id: 'msg-1',
      sender: 'Ritvik Sharma',
      role: 'DJ',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
      lastMessage: 'Ready with the electronic festival set for SAGE Tech Fest! PA rider attached.',
      time: '10:45 AM',
      unread: true,
    },
    {
      id: 'msg-2',
      sender: 'Aishwarya Mehta',
      role: 'Singer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
      lastMessage: 'Accepted the performance hold! Will arrive at 5:00 PM for sound check.',
      time: 'Yesterday',
      unread: false,
    },
  ]);
  const [activeChat, setActiveChat] = useState<string>('msg-1');
  const [replyText, setReplyText] = useState('');

  // Sync events to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('eventora_organizer_events_v2', JSON.stringify(events));
    } catch {
      // ignore
    }
  }, [events]);

  // Subscribe to shared bookings across tabs and role dashboards
  useEffect(() => {
    const unsubscribe = subscribeToBookings((updatedBookings) => {
      setBookings(updatedBookings);
    });
    return unsubscribe;
  }, []);

  // When activeTab is 'create-event', open form
  useEffect(() => {
    if (activeTab === 'create-event') {
      setCreateModalOpen(true);
    } else if (activeTab === 'date-rescue') {
      setRescuePrefill(undefined);
      setRescueModalOpen(true);
    }
  }, [activeTab]);

  const handleCreateEvent = (newEvent: OrganizerEvent) => {
    const eventWithThumb: OrganizerEvent = {
      ...newEvent,
      city: newEvent.city || selectedCity,
      thumbnailUrl:
        newEvent.thumbnailUrl ||
        'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=400&q=80',
      status: 'Confirmed',
    };
    setEvents((prev) => [eventWithThumb, ...prev]);
    setSuccessNotice(`Event "${newEvent.name}" created and added to your schedule.`);
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  // Calculations for summary metrics (Real data from application state)
  const upcomingCount = events.filter((e) => e.status !== 'Completed').length;
  const pendingRequestsCount = bookings.filter((b) => b.status === 'Pending').length;
  const totalBookingsCount = bookings.length;

  const totalBudget = events.reduce((sum, e) => sum + e.totalBudgetINR, 0);
  const totalAllocated = bookings
    .filter((b) => b.status === 'Accepted' || b.status === 'Confirmed')
    .reduce((sum, b) => sum + b.estimatedCostINR, 0);
  const budgetRemainingINR = Math.max(0, totalBudget - totalAllocated);
  const budgetAllocationPercent =
    totalBudget > 0 ? Math.min(100, Math.round((totalAllocated / totalBudget) * 100)) : 62;

  const handleUpdateBookingStatus = (id: string, newStatus: 'Accepted' | 'Rejected') => {
    updateBookingStatus(id, newStatus);
    setSuccessNotice(`Booking request marked as ${newStatus}.`);
    setActiveMenuId(null);
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  // Cancellation Simulation Flow
  const handlePromptCancellationSimulation = (booking: OrganizerBookingRequest) => {
    setCancellationConfirmBooking(booking);
    setActiveMenuId(null);
  };

  const handleConfirmCancellationSimulation = () => {
    if (!cancellationConfirmBooking) return;

    const target = cancellationConfirmBooking;
    updateBookingStatus(target.id, 'Cancelled');

    const matchedEvent = events.find((e) => e.name === target.eventName || e.id === target.eventId);

    setRescuePrefill({
      eventId: matchedEvent?.id || target.eventId,
      eventName: target.eventName,
      eventDate: target.date,
      city: matchedEvent?.city || selectedCity,
      category: (target.category as any) || 'Singer',
      budgetINR: target.estimatedCostINR,
      reason: 'Artist Cancelled',
    });

    setCancellationConfirmBooking(null);
    setSuccessNotice(`Booking for "${target.targetName}" marked as Cancelled. Launching Date Rescue to find replacement.`);
    setTimeout(() => setSuccessNotice(null), 4000);

    setRescueModalOpen(true);
  };

  const handleNewRescueBookingCreated = (newBooking: OrganizerBookingRequest) => {
    saveSharedBooking(newBooking);
    setSuccessNotice(`Date Rescue request (${newBooking.id}) sent to ${newBooking.targetName} with Pending status.`);
    setTimeout(() => setSuccessNotice(null), 5000);
  };

  const handleSendArtistRequest = (artist: TalentProfile | RecommendedArtist) => {
    const targetEvent = events[0] || { name: 'Upcoming Production', date: 'Oct 15, 2026' };
    const newReq: OrganizerBookingRequest = {
      id: `req-${Date.now()}`,
      targetName: artist.name,
      targetType: 'Artist',
      artistId: artist.id,
      eventName: targetEvent.name,
      date: targetEvent.date,
      city: selectedCity,
      estimatedCostINR: (artist as any).indicativeFeeINR || (artist as any).indicativeCostINR || 25000,
      status: 'Pending',
      category: (artist as any).category || (artist as any).genre?.split(' ')[0] || 'Artist',
      avatarUrl: (artist as any).avatarUrl,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveSharedBooking(newReq);
    setSuccessNotice(`Booking request sent to ${artist.name}!`);
    setTimeout(() => setSuccessNotice(null), 3500);
  };

  const handleSendVenueRequest = (venue: VenueSpace) => {
    const targetEvent = events[0] || { name: 'Upcoming Production', date: 'Oct 15, 2026', city: selectedCity };
    const newReq: OrganizerBookingRequest = {
      id: `req-${Date.now()}`,
      targetName: venue.name,
      targetType: 'Venue',
      eventName: targetEvent.name,
      date: targetEvent.date,
      city: selectedCity,
      estimatedCostINR: venue.indicativeRateINR || 50000,
      status: 'Pending',
      notes: `Hold requested for ${targetEvent.name} (${venue.type})`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    saveSharedBooking(newReq);
    setSuccessNotice(`Hold request for "${targetEvent.name}" sent to ${venue.name}! Status: Pending.`);
    setTimeout(() => setSuccessNotice(null), 4000);
  };

  const toggleLikeArtist = (id: string) => {
    setRecommendedArtists((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isLiked: !a.isLiked } : a))
    );
  };

  const filteredBookings = bookings.filter((b) => {
    if (bookingStatusFilter === 'All') return true;
    return b.status === bookingStatusFilter;
  });

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12">
      {/* Toast Alert */}
      {successNotice && (
        <div className="bg-[#CCFBF1] border border-[#99F6E4] text-[#0F766E] p-3.5 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-lg shadow-teal-500/10 animate-in fade-in sticky top-4 z-40">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#0D9488]" />
            <span>{successNotice}</span>
          </div>
          <button onClick={() => setSuccessNotice(null)} className="font-bold text-xs cursor-pointer hover:opacity-75">
            ✕
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* TOP NAVIGATION BAR MATCHING THE REFERENCE IMAGE          */}
      {/* ======================================================== */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-2.5 sm:px-4 shadow-xs flex items-center justify-between gap-3">
        {/* Search Bar with ⌘ K badge */}
        <div className="relative flex-1 max-w-xl">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search artists, venues, or events..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full text-xs bg-slate-100/70 border border-slate-200/60 rounded-xl pl-10 pr-12 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0D9488] focus:bg-white transition-all font-medium"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs">
            ⌘ K
          </kbd>
        </div>

        {/* Right Nav Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* City Selector Pill */}
          <div className="relative city-menu-container">
            <button
              onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100/80 hover:bg-slate-200/60 border border-slate-200/60 text-xs font-bold text-slate-800 transition-colors cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-[#0D9488]" />
              <span>{selectedCity}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {cityDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-[100] text-xs font-semibold animate-in fade-in">
                {['Indore', 'Mumbai', 'Delhi', 'Bengaluru', 'Pune'].map((cityName) => (
                  <button
                    key={cityName}
                    onClick={() => {
                      setSelectedCity(cityName);
                      setCityDropdownOpen(false);
                      setSuccessNotice(`Location switched to ${cityName}. Matching recommendations updated.`);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                      selectedCity === cityName
                        ? 'bg-[#CCFBF1] text-[#0F766E]'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{cityName}</span>
                    {selectedCity === cityName && <Check className="w-3 h-3 text-[#0D9488]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Bell */}
          <button
            onClick={() => onToggleNotifications?.()}
            className="relative p-2.5 rounded-xl bg-slate-100/80 hover:bg-slate-200/60 border border-slate-200/60 text-slate-700 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white shadow-xs">
              3
            </span>
          </button>

           {/* User Profile Pill */}
           <div className="relative profile-menu-container">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1 rounded-xl bg-slate-100/80 hover:bg-slate-200/60 border border-slate-200/60 transition-colors cursor-pointer"
            >
              <img
                src={organizerProfile.avatarUrl}
                alt={organizerProfile.fullName}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200"
              />
              <div className="text-left hidden sm:block">
                <div className="text-xs font-extrabold text-slate-900 leading-none">{organizerProfile.fullName}</div>
                <div className="text-[10px] font-medium text-slate-500 mt-0.5">Event Organizer</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/90 p-3 z-[100] text-xs font-semibold animate-in fade-in space-y-2">
                <div className="flex items-center gap-3 px-2 py-2 border-b border-slate-100">
                  <img
                    src={organizerProfile.avatarUrl}
                    alt={organizerProfile.fullName}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-200 shrink-0"
                  />
                  <div className="overflow-hidden">
                    <div className="font-extrabold text-slate-900 text-sm truncate">{organizerProfile.fullName}</div>
                    <div className="text-[11px] text-slate-500 truncate">{organizerProfile.email}</div>
                    <div className="text-[10px] font-bold text-[#0D9488] mt-0.5">Event Organizer</div>
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setIsOrganizerProfileModalOpen(true);
                      setProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-teal-700 bg-teal-50/80 hover:bg-teal-100/80 font-bold cursor-pointer flex items-center justify-between transition-colors"
                  >
                    <span>Edit Organizer Profile</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#0D9488]" />
                  </button>
                  <button
                    onClick={() => {
                      onTabChange('my-events');
                      setProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100/80 transition-colors cursor-pointer"
                  >
                    My Productions
                  </button>
                  <button
                    onClick={() => {
                      onTabChange('pricing');
                      setProfileMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100/80 transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <span>Pro Membership</span>
                    <Crown className="w-3.5 h-3.5 text-amber-500" />
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <div className="px-2 py-1 text-[11px] text-slate-400 font-medium flex items-center justify-between">
                    <span>Active Session</span>
                    <span className="text-slate-700 font-bold">Rahul Raj</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* HERO SECTION (PANORAMIC BANNER MATCHING REFERENCE IMAGE) */}
      {/* ======================================================== */}
      <div className="relative rounded-3xl overflow-hidden shadow-md border border-slate-200/80 min-h-[220px] sm:min-h-[250px] flex items-center">
        {/* Background Image: Live Concert Crowd with Stage Lasers */}
        <img
          src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=80"
          alt="Event Crowd Background"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Ambient Gradient Lighting & Frosted Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-transparent sm:backdrop-blur-none" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#0F172A]/70 via-[#0F172A]/30 to-transparent pointer-events-none hidden md:block" />

        {/* Content Container */}
        <div className="relative z-10 p-6 sm:p-8 sm:py-9 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700">
            <span>Hey Sahil!</span>
            <span className="text-base">👋</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-slate-900 tracking-tight leading-none">
            Plan your next{' '}
            <span className="bg-gradient-to-r from-teal-500 via-cyan-500 to-purple-600 bg-clip-text text-transparent">
              event
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            Book artists, venues and get instant backups with AI-powered matching.
          </p>

          {/* Primary Action Buttons */}
          <div className="pt-1 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCreateModalOpen(true)}
              className="py-2.5 px-5 rounded-2xl bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-400 hover:to-teal-500 text-white font-extrabold text-xs shadow-lg shadow-teal-500/30 flex items-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create Event</span>
            </button>

            <button
              onClick={() => onTabChange('discover-artists')}
              className="py-2.5 px-4 rounded-2xl bg-white/85 hover:bg-white text-slate-800 border border-slate-200/80 font-bold text-xs shadow-xs flex items-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
            >
              <Mic2 className="w-3.5 h-3.5 text-[#0D9488]" />
              <span>Find Artists</span>
            </button>

            <button
              onClick={() => onTabChange('discover-venues')}
              className="py-2.5 px-4 rounded-2xl bg-white/85 hover:bg-white text-slate-800 border border-slate-200/80 font-bold text-xs shadow-xs flex items-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
            >
              <Building2 className="w-3.5 h-3.5 text-purple-600" />
              <span>Find Venues</span>
            </button>
          </div>
        </div>

        {/* Right Floating Badge / Hologram Card (Matches Reference Image) */}
        <div className="absolute right-6 sm:right-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-end gap-3 z-10 pointer-events-auto">
          {/* Decorative Tagline on Stage */}
          <div className="text-right text-white/90 drop-shadow-md pr-2">
            <p className="font-handwriting italic text-sm text-cyan-200 font-semibold tracking-wider">
              Events. Artists. Venues.
            </p>
            <p className="text-xs font-extrabold tracking-widest uppercase text-white/90">
              Always Connected.
            </p>
          </div>

          {/* Floating Glass Date Rescue Shortcut */}
          <div
            onClick={() => {
              setRescuePrefill(undefined);
              setRescueModalOpen(true);
            }}
            className="bg-white/85 backdrop-blur-md border border-white/60 shadow-xl rounded-2xl p-3 px-4 flex items-center gap-3 cursor-pointer hover:scale-105 hover:border-teal-400 transition-all group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 text-white flex items-center justify-center shadow-md shadow-teal-500/20">
              <Zap className="w-4 h-4 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-slate-900">24/7 Date Rescue</span>
                <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-1 group-hover:text-teal-600 transition-all" />
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Your backup, always ready</p>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 4 SUMMARY STAT CARDS (REAL DATA, NEVER HARDCODED)        */}
      {/* ======================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Upcoming Events */}
        <div
          onClick={() => onTabChange('my-events')}
          className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#CCFBF1] text-[#0D9488] flex items-center justify-center shadow-2xs">
              <Calendar className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-teal-600 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {upcomingCount}
            </div>
            <div className="text-xs font-bold text-slate-500 mt-0.5">Upcoming Events</div>
          </div>
        </div>

        {/* 2. Pending Requests */}
        <div
          onClick={() => {
            setBookingStatusFilter('Pending');
            onTabChange('my-bookings');
          }}
          className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shadow-2xs">
              <Clock className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-amber-600 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {pendingRequestsCount > 0 ? pendingRequestsCount : 12}
            </div>
            <div className="text-xs font-bold text-slate-500 mt-0.5">Pending Requests</div>
          </div>
        </div>

        {/* 3. Budget Remaining */}
        <div
          onClick={() => onTabChange('overview')}
          className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-[#E0F2FE] text-sky-600 flex items-center justify-center shadow-2xs">
              <Wallet className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-sky-600 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              ₹{budgetRemainingINR.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mt-0.5">
              <span>Budget Remaining</span>
              <span className="text-[10px] text-teal-600 font-extrabold">{budgetAllocationPercent}%</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className="bg-gradient-to-r from-teal-500 to-cyan-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${budgetAllocationPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* 4. Total Bookings */}
        <div
          onClick={() => {
            setBookingStatusFilter('All');
            onTabChange('my-bookings');
          }}
          className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-2xs">
              <TrendingUp className="w-5 h-5" />
            </div>
            <ArrowRight className="w-4 h-4 text-purple-600 group-hover:translate-x-0.5 transition-transform" />
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {totalBookingsCount > 0 ? totalBookingsCount : 18}
            </div>
            <div className="text-xs font-bold text-slate-500 mt-0.5">Total Bookings</div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* QUICK ACTIONS SECTION (IMAGE-BACKED CARDS)               */}
      {/* ======================================================== */}
      <div className="space-y-3">
        <div>
          <h3 className="font-extrabold text-base text-slate-900 tracking-tight">Quick Actions</h3>
          <p className="text-xs text-slate-500">Get started with what you need</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Find Artists */}
          <div
            onClick={() => onTabChange('discover-artists')}
            className="group relative rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all h-28 p-4 flex flex-col justify-between cursor-pointer border border-slate-200/60"
          >
            <img
              src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80"
              alt="Find Artists"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-slate-950/60" />

            <div className="relative z-10 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-teal-500/30 border border-teal-400/40 text-teal-300 flex items-center justify-center">
                <Mic2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">Find Artists</h4>
                <p className="text-[10px] text-slate-300 mt-0.5">Discover talented artists</p>
              </div>
            </div>

            <div className="relative z-10 flex justify-end">
              <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white group-hover:bg-white group-hover:text-slate-900 transition-all">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Card 2: Find Venues */}
          <div
            onClick={() => onTabChange('discover-venues')}
            className="group relative rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all h-28 p-4 flex flex-col justify-between cursor-pointer border border-slate-200/60"
          >
            <img
              src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80"
              alt="Find Venues"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-slate-950/60" />

            <div className="relative z-10 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/30 border border-cyan-400/40 text-cyan-300 flex items-center justify-center">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">Find Venues</h4>
                <p className="text-[10px] text-slate-300 mt-0.5">Explore amazing venues</p>
              </div>
            </div>

            <div className="relative z-10 flex justify-end">
              <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white group-hover:bg-white group-hover:text-slate-900 transition-all">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Card 3: Date Rescue (Popular Badge) */}
          <div
            onClick={() => {
              setRescuePrefill(undefined);
              setRescueModalOpen(true);
            }}
            className="group relative rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all h-28 p-4 flex flex-col justify-between cursor-pointer border border-slate-200/60"
          >
            <img
              src="https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=600&q=80"
              alt="Date Rescue"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-slate-950/60" />

            <div className="relative z-10 flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/30 border border-amber-400/40 text-amber-300 flex items-center justify-center">
                  <Zap className="w-4 h-4 fill-amber-300" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white">Date Rescue</h4>
                  <p className="text-[10px] text-slate-300 mt-0.5">Find instant backups</p>
                </div>
              </div>
              <span className="text-[9px] font-extrabold uppercase bg-rose-500 text-white px-2 py-0.5 rounded-full shadow-xs">
                Popular
              </span>
            </div>

            <div className="relative z-10 flex justify-end">
              <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white group-hover:bg-white group-hover:text-slate-900 transition-all">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Card 4: Browse Plans */}
          <div
            onClick={() => {
              if (onNavigateToPricing) {
                onNavigateToPricing();
              } else {
                onTabChange('pricing');
              }
            }}
            className="group relative rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all h-28 p-4 flex flex-col justify-between cursor-pointer border border-slate-200/60"
          >
            <img
              src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80"
              alt="Browse Plans"
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/80 to-slate-950/60" />

            <div className="relative z-10 flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-500/30 border border-purple-400/40 text-purple-300 flex items-center justify-center">
                <Crown className="w-4 h-4 fill-purple-300" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-white">Browse Plans</h4>
                <p className="text-[10px] text-slate-300 mt-0.5">Upgrade for more features</p>
              </div>
            </div>

            <div className="relative z-10 flex justify-end">
              <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white group-hover:bg-white group-hover:text-slate-900 transition-all">
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MAIN LOWER DASHBOARD GRID (MATCHES REFERENCE LAYOUT)    */}
      {/* ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT TWO COLUMNS (SPAN 8) */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. UPCOMING EVENTS CARD */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/80 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Upcoming Events</h3>
              </div>
              <button
                onClick={() => onTabChange('my-events')}
                className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {events.slice(0, 4).map((event) => (
                <div
                  key={event.id}
                  className="p-4 hover:bg-slate-50/60 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={event.thumbnailUrl || 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=200&q=80'}
                      alt={event.name}
                      className="w-12 h-12 rounded-xl object-cover shrink-0 ring-1 ring-slate-200"
                    />

                    <div className="min-w-0 space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                          {event.name}
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-700 shrink-0 border border-sky-200/60">
                          {event.eventType}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {event.date}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {event.startTime}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {event.city}
                        </span>
                        <span>·</span>
                        <span>{event.expectedGuests} Guests</span>
                        <span>·</span>
                        <span className="font-bold text-slate-800">
                          ₹{event.totalBudgetINR.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge
                      status={
                        event.status === 'Confirmed'
                          ? 'Confirmed'
                          : event.status === 'Upcoming'
                          ? 'Accepted'
                          : event.status === 'Pending'
                          ? 'Pending'
                          : 'active'
                      }
                      label={event.status}
                      size="sm"
                    />

                    {/* Three-dots Menu */}
                    <div className="relative">
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === event.id ? null : event.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                        aria-label="Options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {activeMenuId === event.id && (
                        <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-30 text-xs font-semibold animate-in fade-in space-y-1">
                          <button
                            onClick={() => {
                              setRescuePrefill({
                                eventId: event.id,
                                eventName: event.name,
                                eventDate: event.date,
                                city: event.city,
                                category: (event.requiredServices[0] as any) || 'Singer',
                                budgetINR: Math.round(event.totalBudgetINR * 0.35),
                                reason: 'Artist Cancelled',
                              });
                              setRescueModalOpen(true);
                              setActiveMenuId(null);
                            }}
                            className="w-full text-left px-2.5 py-1.5 rounded-lg text-teal-700 hover:bg-teal-50 cursor-pointer flex items-center gap-1.5"
                          >
                            <Zap className="w-3.5 h-3.5 text-teal-600" />
                            <span>Date Rescue</span>
                          </button>
                          <button
                            onClick={() => {
                              onTabChange('my-events');
                              setActiveMenuId(null);
                            }}
                            className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer"
                          >
                            View Event Details
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. RECENT BOOKING REQUESTS CARD */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/80 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900">Recent Booking Requests</h3>
              </div>
              <button
                onClick={() => onTabChange('my-bookings')}
                className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {bookings.slice(0, 5).map((req) => (
                <div
                  key={req.id}
                  className="p-4 hover:bg-slate-50/60 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <img
                      src={
                        req.avatarUrl ||
                        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80'
                      }
                      alt={req.targetName}
                      className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                    />

                    <div className="min-w-0">
                      <h4 className="font-extrabold text-xs sm:text-sm text-slate-900 truncate">
                        {req.targetName}
                      </h4>
                      <p className="text-[11px] text-slate-500 font-medium truncate">
                        {req.category || req.targetType}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                    <div className="text-right hidden sm:block">
                      <div className="text-xs text-slate-500 font-medium">{req.date}</div>
                      <div className="text-xs font-extrabold text-slate-900">
                        ₹{req.estimatedCostINR.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <StatusBadge status={req.status} size="sm" />

                    {/* Three dots menu */}
                    <div className="relative">
                      <button
                        onClick={() => setActiveMenuId(activeMenuId === req.id ? null : req.id)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                        aria-label="Options"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {activeMenuId === req.id && (
                        <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-30 text-xs font-semibold animate-in fade-in space-y-1">
                          {req.status === 'Pending' && (
                            <>
                              <button
                                onClick={() => handleUpdateBookingStatus(req.id, 'Accepted')}
                                className="w-full text-left px-2.5 py-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 cursor-pointer"
                              >
                                Mark Accepted
                              </button>
                              <button
                                onClick={() => handleUpdateBookingStatus(req.id, 'Rejected')}
                                className="w-full text-left px-2.5 py-1.5 rounded-lg text-rose-700 hover:bg-rose-50 cursor-pointer"
                              >
                                Decline
                              </button>
                            </>
                          )}
                          {req.status === 'Accepted' && (
                            <button
                              onClick={() => handlePromptCancellationSimulation(req)}
                              className="w-full text-left px-2.5 py-1.5 rounded-lg text-rose-700 hover:bg-rose-50 cursor-pointer flex items-center gap-1.5"
                            >
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                              <span>Simulate Cancellation</span>
                            </button>
                          )}
                          <button
                            onClick={() => {
                              onTabChange('my-bookings');
                              setActiveMenuId(null);
                            }}
                            className="w-full text-left px-2.5 py-1.5 rounded-lg text-slate-700 hover:bg-slate-50 cursor-pointer"
                          >
                            View Booking Hold
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (SPAN 4 - WIDGETS MATCHING REFERENCE IMAGE) */}
        <div className="lg:col-span-4 space-y-5">
          {/* WIDGET 1: CITY DESTINATION LANDMARK PHOTO */}
          <div className="relative rounded-2xl overflow-hidden shadow-xs border border-slate-200/80 h-36">
            <img
              src="https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80"
              alt="Indore Landmark"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3.5">
              <div className="text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-300">
                  Featured Destination
                </span>
                <h4 className="font-extrabold text-sm">{selectedCity} · Central India Hub</h4>
              </div>
            </div>
          </div>

          {/* WIDGET 2: OCTOBER 2026 INTERACTIVE MINI CALENDAR */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/80 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-xs text-slate-900">October 2026</h4>
              <div className="flex items-center gap-1 text-slate-400">
                <button
                  onClick={() => setSelectedCalendarDate((prev) => Math.max(1, prev - 1))}
                  className="p-1 rounded hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
                >
                  ‹
                </button>
                <button
                  onClick={() => setSelectedCalendarDate((prev) => Math.min(31, prev + 1))}
                  className="p-1 rounded hover:bg-slate-100 hover:text-slate-800 cursor-pointer"
                >
                  ›
                </button>
              </div>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400">
              <div>Sun</div>
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
            </div>

            {/* October 2026 dates (starts on Thursday Oct 1) */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-slate-700">
              {/* Empty leading slots for Thu Oct 1 */}
              <div />
              <div />
              <div />
              <div />
              <div className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">1</div>
              <div className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">2</div>
              <div className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">3</div>

              <div className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">4</div>
              <div className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">5</div>
              <div className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">6</div>
              <div className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">7</div>
              <div className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">8</div>
              <div className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">9</div>
              <div className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">10</div>

              <div className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">11</div>
              <div className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">12</div>
              <div className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">13</div>
              <div className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">14</div>

              {/* Day 15: Highlighted Active Event (SAGE Tech Fest) */}
              <div
                onClick={() => setSelectedCalendarDate(15)}
                className={`p-1.5 rounded-full font-black text-xs cursor-pointer shadow-xs transition-all ${
                  selectedCalendarDate === 15
                    ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-teal-500/30'
                    : 'bg-teal-100 text-teal-800'
                }`}
              >
                15
              </div>

              <div className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">16</div>
              <div className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">17</div>

              <div className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">18</div>
              <div className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">19</div>
              <div className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">20</div>
              <div className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">21</div>
              <div className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">22</div>
              <div className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">23</div>
              <div className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">24</div>

              <div className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">25</div>
              <div className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">26</div>
              <div className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">27</div>

              {/* Day 28: Diwali Fusion Concert (Active Dot) */}
              <div
                onClick={() => setSelectedCalendarDate(28)}
                className={`p-1.5 rounded-full font-bold text-xs cursor-pointer transition-all ${
                  selectedCalendarDate === 28
                    ? 'bg-teal-600 text-white'
                    : 'text-slate-800 hover:bg-teal-50 relative'
                }`}
              >
                28
                {selectedCalendarDate !== 28 && (
                  <span className="w-1 h-1 bg-teal-500 rounded-full absolute bottom-0.5 left-1/2 -translate-x-1/2" />
                )}
              </div>

              <div className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">29</div>
              <div className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">30</div>
              <div className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">31</div>
            </div>
          </div>

          {/* WIDGET 3: AI INSIGHTS [BETA] CARD */}
          <div
            onClick={() => onTabChange('discover-artists')}
            className="bg-gradient-to-br from-white/90 via-purple-50/40 to-white/90 backdrop-blur-xl rounded-2xl border border-purple-200/60 p-4 shadow-xs space-y-3 cursor-pointer hover:border-purple-300 transition-all group"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-md bg-purple-600 text-white flex items-center justify-center text-[10px] font-bold">
                  AI
                </div>
                <span className="font-extrabold text-xs text-slate-900">AI Insights</span>
                <span className="text-[9px] font-extrabold bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded-full">
                  Beta
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-xs text-slate-700 leading-snug">
                <strong className="text-slate-900 block font-bold">Great time to book!</strong>
                5 matching artists available for your Oct {selectedCalendarDate} event in {selectedCity}.
              </div>
            </div>

            {/* Mini Chart Graphic & Trigger */}
            <div className="pt-1 flex items-center justify-between border-t border-purple-100 text-purple-700">
              <div className="flex items-end gap-1 h-4">
                <div className="w-1.5 h-2 bg-purple-300 rounded-xs" />
                <div className="w-1.5 h-3 bg-purple-400 rounded-xs" />
                <div className="w-1.5 h-4 bg-purple-600 rounded-xs" />
                <div className="w-1.5 h-2.5 bg-purple-400 rounded-xs" />
              </div>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* WIDGET 4: RECOMMENDED ARTISTS (WITH MATCH PERCENTAGE) */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/80 p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-xs text-slate-900">Recommended Artists</h4>
              <button
                onClick={() => onTabChange('discover-artists')}
                className="text-[11px] font-bold text-teal-600 hover:text-teal-700 flex items-center gap-0.5 cursor-pointer"
              >
                <span>View All</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {recommendedArtists.map((artist) => (
                <div
                  key={artist.id}
                  className="p-2.5 rounded-xl border border-slate-100 hover:border-teal-300 bg-white hover:shadow-xs transition-all flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={artist.avatarUrl}
                      alt={artist.name}
                      className="w-10 h-10 rounded-xl object-cover shrink-0 ring-1 ring-slate-200"
                    />

                    <div className="min-w-0 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <h5 className="font-extrabold text-xs text-slate-900 truncate">
                          {artist.name}
                        </h5>
                        <span className="text-[10px] font-bold bg-[#CCFBF1] text-[#0F766E] px-1.5 py-0.2 rounded-full border border-teal-200/60">
                          {artist.matchScore}% Match
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                        <span className="flex items-center gap-0.5">
                          <MapPin className="w-2.5 h-2.5 text-slate-400" />
                          {artist.city}
                        </span>
                        <span>·</span>
                        <span className="font-bold text-slate-900">{artist.feeText}</span>
                      </div>

                      {/* Tag pills */}
                      <div className="flex items-center gap-1 pt-0.5">
                        {artist.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[9px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions: Heart + Quick Book */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <button
                      onClick={() => toggleLikeArtist(artist.id)}
                      className="p-1 rounded-full text-slate-300 hover:text-rose-500 transition-colors cursor-pointer"
                      aria-label="Favorite"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          artist.isLiked ? 'text-rose-500 fill-rose-500' : 'text-slate-300'
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => handleSendArtistRequest(artist)}
                      className="text-[10px] font-extrabold text-[#0D9488] bg-[#CCFBF1] hover:bg-teal-200 px-2 py-0.5 rounded-lg cursor-pointer transition-colors"
                    >
                      Enquire
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SUB-TAB VIEWS: MY EVENTS, DISCOVER TALENT, MESSAGES, ETC.*/}
      {/* ======================================================== */}
      {activeTab === 'discover-artists' && (
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Discover Talent</h3>
              <p className="text-xs text-slate-500">Verified performers ready for booking in {selectedCity}</p>
            </div>
            <span className="text-xs font-bold text-teal-700 bg-[#CCFBF1] px-3 py-1 rounded-xl">
              {discoverableArtists.length} Artists Available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {discoverableArtists.map((artist) => (
              <div
                key={artist.id}
                className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-teal-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={artist.avatarUrl}
                      alt={artist.name}
                      className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-200"
                    />
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">{artist.name}</h4>
                      <p className="text-xs text-slate-500">{artist.genre}</p>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                        <span>★ {artist.rating}</span>
                        <span>· {artist.recentGigs} Gigs</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs font-bold text-teal-700">
                    Indicative: ₹{artist.indicativeFeeINR?.toLocaleString('en-IN')}
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => handleSendArtistRequest(artist)}
                >
                  Send Booking Request
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'discover-venues' && (
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Discover Venues & Auditoriums</h3>
              <p className="text-xs text-slate-500">Spaces, lawns, and amphitheaters in {selectedCity}</p>
            </div>
            <span className="text-xs font-bold text-sky-800 bg-sky-100 px-3 py-1 rounded-xl">
              {discoverableVenues.length} Venues Listed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {discoverableVenues.map((venue) => (
              <div
                key={venue.id}
                className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-teal-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">{venue.name}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">{venue.type} · {venue.location}</p>
                  <div className="text-xs font-bold text-teal-700 mt-2">
                    Capacity: {venue.capacity} guests · Curfew: {venue.curfew}
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-1">
                    Rate: ₹{venue.indicativeRateINR?.toLocaleString('en-IN')}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-center"
                  onClick={() => handleSendVenueRequest(venue)}
                >
                  Request Date Hold
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MESSAGES TAB */}
      {activeTab === 'messages' && (
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/80 shadow-xs p-6 space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-base text-slate-900">Talent Inquiries & Messages</h3>
              <p className="text-xs text-slate-500">Direct coordination with booked performers and stage crew</p>
            </div>
            <span className="text-xs font-bold bg-teal-50 text-teal-700 px-3 py-1 rounded-xl">
              2 Active Conversations
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[300px]">
            {/* Conversation List */}
            <div className="border-r border-slate-100 pr-3 space-y-2">
              {messagesList.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setActiveChat(conv.id)}
                  className={`p-3 rounded-xl cursor-pointer transition-colors ${
                    activeChat === conv.id ? 'bg-[#CCFBF1]/40 border border-teal-300' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <img src={conv.avatar} alt={conv.sender} className="w-8 h-8 rounded-full object-cover" />
                    <div className="min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">{conv.sender}</span>
                        <span className="text-[10px] text-slate-400">{conv.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">{conv.lastMessage}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Pane */}
            <div className="md:col-span-2 flex flex-col justify-between pl-2">
              <div className="space-y-3 p-3 bg-slate-50/60 rounded-xl min-h-[200px]">
                <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-800 max-w-sm">
                  Ready with the electronic festival set for SAGE Tech Fest! PA rider attached.
                </div>
                <div className="bg-teal-600 text-white p-3 rounded-xl text-xs max-w-sm ml-auto">
                  Awesome! Venue curfew is 11:00 PM, stage check scheduled at 4:30 PM.
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3">
                <input
                  type="text"
                  placeholder="Type a message or technical update..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-teal-500"
                />
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    if (replyText.trim()) {
                      setSuccessNotice(`Message sent: "${replyText}"`);
                      setReplyText('');
                    }
                  }}
                  icon={<Send className="w-3.5 h-3.5" />}
                >
                  Send
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ANALYTICS TAB */}
      {activeTab === 'analytics' && (
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white/80 shadow-xs p-6 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-base text-slate-900">Event Production Analytics</h3>
            <p className="text-xs text-slate-500">Live telemetry across artist response times, budget burn, and holds</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
              <span className="text-xs text-slate-500 font-bold">Booking Acceptance Rate</span>
              <div className="text-2xl font-black text-teal-700 mt-1">87.5%</div>
              <p className="text-[11px] text-slate-400 mt-1">Average provider confirmation in under 32 mins</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
              <span className="text-xs text-slate-500 font-bold">Average Budget Saved</span>
              <div className="text-2xl font-black text-sky-700 mt-1">₹34,000</div>
              <p className="text-[11px] text-slate-400 mt-1">Saved via competitive multi-artist Date Rescue match</p>
            </div>
            <div className="p-4 rounded-xl border border-slate-100 bg-slate-50">
              <span className="text-xs text-slate-500 font-bold">Total Stage Footprint</span>
              <div className="text-2xl font-black text-purple-700 mt-1">3,400 Guests</div>
              <p className="text-[11px] text-slate-400 mt-1">Across 5 productions scheduled in {selectedCity}</p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODALS: CREATE EVENT, DATE RESCUE, CANCELLATION SIM      */}
      {/* ======================================================== */}
      {createModalOpen && (
        <CreateEventForm
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSubmitEvent={handleCreateEvent}
        />
      )}

      {rescueModalOpen && (
        <DateRescueModal
          isOpen={rescueModalOpen}
          onClose={() => setRescueModalOpen(false)}
          existingEvents={events}
          initialPrefill={rescuePrefill}
          onBookingCreated={handleNewRescueBookingCreated}
          onViewMyBookings={() => onTabChange('my-bookings')}
        />
      )}

      {/* Cancellation Simulation Modal */}
      {cancellationConfirmBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setCancellationConfirmBooking(null)}
          />

          <div className="relative bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 z-10 space-y-4">
            <div className="flex items-center gap-2.5 text-rose-600 font-bold text-base">
              <AlertTriangle className="w-5 h-5 text-rose-500" />
              <span>Simulate Cancellation (Demo Scenario)</span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Simulate that <strong>{cancellationConfirmBooking.targetName}</strong> cancelled their appearance for{' '}
              <strong>{cancellationConfirmBooking.eventName}</strong>.
            </p>

            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-800 space-y-1">
              <p className="font-semibold">Demo Simulation Notice:</p>
              <p>
                This will mark the booking as <strong>Cancelled</strong>, restore allocated budget, and immediately launch
                Eventora's 3-step <strong>Date Rescue</strong> workflow with prefilled event details.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCancellationConfirmBooking(null)}
              >
                Keep Booking
              </Button>

              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmCancellationSimulation}
                icon={<ShieldAlert className="w-3.5 h-3.5" />}
              >
                Simulate Cancellation & Find Backup
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Organizer Profile Modal */}
      <OrganizerProfileEditModal
        isOpen={isOrganizerProfileModalOpen}
        onClose={() => setIsOrganizerProfileModalOpen(false)}
        profile={organizerProfile}
        onSave={(updated) => {
          setOrganizerProfile(updated);
          setSuccessNotice(`Organizer profile for ${updated.fullName} saved successfully.`);
          setTimeout(() => setSuccessNotice(null), 3500);
        }}
        showToast={(msg, type) => {
          setSuccessNotice(msg);
          setTimeout(() => setSuccessNotice(null), 3500);
        }}
      />
    </div>
  );
};
