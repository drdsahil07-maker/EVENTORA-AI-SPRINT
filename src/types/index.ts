export type UserRole = 'organizer' | 'artist' | 'venue';

export type CurrentView = 'landing' | 'organizer' | 'artist' | 'venue' | 'pricing';

export type OrganizerTab =
  | 'overview'
  | 'my-events'
  | 'create-event'
  | 'discover-artists'
  | 'discover-venues'
  | 'date-rescue'
  | 'my-bookings'
  | 'messages'
  | 'analytics'
  | 'pricing';

export type ArtistTab =
  | 'overview'
  | 'requests'
  | 'availability'
  | 'profile'
  | 'rescue-opportunities'
  | 'plans';

export type VenueTab = 'overview' | 'spaces' | 'calendar' | 'stage-specs' | 'inquiries';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'urgent' | 'backup' | 'confirmed' | 'info';
  read: boolean;
  roleTarget?: UserRole;
}

export type EventTypeOption =
  | 'College Fest'
  | 'Birthday'
  | 'Wedding'
  | 'Corporate'
  | 'Concert'
  | 'Engagement'
  | 'Other';

export type ServiceTypeOption =
  | 'DJ'
  | 'Singer'
  | 'Photographer'
  | 'Anchor'
  | 'Dancer'
  | 'Makeup Artist'
  | 'Other';

export interface OrganizerEvent {
  id: string;
  name: string;
  eventType: EventTypeOption;
  city: string;
  date: string;
  startTime: string;
  expectedGuests: number;
  totalBudgetINR: number;
  requiredServices: ServiceTypeOption[];
  additionalPreferences?: string;
  status: 'Upcoming' | 'Planning' | 'Completed' | 'Confirmed' | 'Pending' | 'Draft';
  allocatedCostINR?: number;
  thumbnailUrl?: string;
}

export type RescueArtistCategory =
  | 'DJ'
  | 'Singer'
  | 'Musician'
  | 'Photographer'
  | 'Anchor'
  | 'Dancer'
  | 'Makeup Artist'
  | 'Mehndi Artist'
  | 'Band'
  | 'Other';

export type RescueReason =
  | 'Artist Cancelled'
  | 'Artist Unavailable'
  | 'Emergency Replacement'
  | 'Other';

export interface RescueArtistProfile {
  id: string;
  name: string;
  category: RescueArtistCategory;
  city: string;
  serviceArea: string[];
  indicativePriceINR: number;
  skills: string[];
  availabilityStatus: 'Available (Demo)' | 'Availability Unconfirmed' | 'Booked (Demo)';
  shortDescription: string;
  bookedDates?: string[];
  avatarUrl?: string;
  bio?: string;
  subscriptionTier?: 'free' | 'seasonal-pass' | 'premium-artist';
  contactPhone?: string;
  contactEmail?: string;
  isPublicContact?: boolean;
}

export interface RescueRequestData {
  eventId?: string;
  eventName: string;
  eventDate: string;
  city: string;
  category: RescueArtistCategory;
  budgetINR: number;
  reason: RescueReason;
  startTime?: string;
  eventType?: string;
  skillsPreferences?: string;
  additionalNotes?: string;
}

export type BookingStatus = 'Pending' | 'Accepted' | 'Rejected' | 'Cancelled' | 'Confirmed';

export interface SharedBookingRequest {
  id: string;
  targetName: string;
  targetType: 'Artist' | 'Venue';
  eventName: string;
  date: string;
  city?: string;
  estimatedCostINR: number;
  status: BookingStatus;
  eventId?: string;
  artistId?: string;
  category?: string;
  createdAt?: string;
  updatedAt?: string;
  notes?: string;
  isDateRescue?: boolean;
  avatarUrl?: string;
}

// Backward compatibility alias
export type OrganizerBookingRequest = SharedBookingRequest;

export type DateAvailabilityStatus = 'Available' | 'Booked' | 'Tentative';

export interface ArtistAvailabilityDate {
  date: string; // e.g. "2026-10-28" or "Oct 28, 2026"
  status: DateAvailabilityStatus;
  bookingId?: string;
  eventName?: string;
  note?: string;
}

export interface TalentProfile {
  id: string;
  name: string;
  genre: string;
  rating: number;
  standbyAvailable: boolean;
  responseTime: string;
  location: string;
  recentGigs: number;
  avatarUrl?: string;
  verified: boolean;
  indicativeFeeINR?: number;
}

export interface VenueSpace {
  id: string;
  name: string;
  capacity: number;
  type: string;
  status: 'Available' | 'Booked' | 'Hold';
  soundRig: string;
  curfew: string;
  location: string;
  indicativeRateINR?: number;
}
