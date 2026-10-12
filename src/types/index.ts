export type UserRole = 'organizer' | 'artist' | 'venue';

export type CurrentView = 'landing' | 'organizer' | 'artist' | 'venue';

export type OrganizerTab =
  | 'overview'
  | 'my-events'
  | 'create-event'
  | 'discover-artists'
  | 'discover-venues'
  | 'date-rescue'
  | 'my-bookings';

export type ArtistTab = 'overview' | 'gigs' | 'standby-beacon' | 'invitations' | 'profile';
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
  status: 'Upcoming' | 'Planning' | 'Completed';
  allocatedCostINR?: number;
}

export interface OrganizerBookingRequest {
  id: string;
  targetName: string;
  targetType: 'Artist' | 'Venue';
  eventName: string;
  date: string;
  estimatedCostINR: number;
  status: 'Pending' | 'Accepted' | 'Rejected';
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
