import { SharedBookingRequest, BookingStatus } from '../types';

const STORAGE_KEY = 'eventora_shared_bookings_v2';
const LEGACY_STORAGE_KEY = 'eventora_organizer_bookings_v2';

// Seeded initial booking requests preserving existing Phase 2 & 3 data
const INITIAL_SHARED_BOOKINGS: SharedBookingRequest[] = [
  {
    id: 'req-1',
    targetName: 'Aanya Sen (Live Acoustic & Sufi)',
    targetType: 'Artist',
    artistId: 'demo-art-102',
    category: 'Singer',
    eventName: 'Diwali Fusion Concert & Night Market',
    date: 'Oct 28, 2026',
    city: 'Mumbai',
    estimatedCostINR: 45000,
    status: 'Accepted',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    isDateRescue: false,
    notes: 'Acoustic stage opener with Sufi and contemporary sets.',
  },
  {
    id: 'req-2',
    targetName: 'Grand Hyatt Terrace & Ballroom',
    targetType: 'Venue',
    eventName: 'TechPulse Annual Innovation Gala',
    date: 'Nov 05, 2026',
    city: 'Bengaluru',
    estimatedCostINR: 45000,
    status: 'Accepted',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'req-3',
    targetName: 'DJ Kabir (Urban Beats)',
    targetType: 'Artist',
    artistId: 'demo-art-101',
    category: 'DJ',
    eventName: 'Suncrest College Cultural Fest — Day 2',
    date: 'Nov 12, 2026',
    city: 'Delhi',
    estimatedCostINR: 35000,
    status: 'Pending',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    isDateRescue: true,
    notes: 'Emergency replacement set needed for college fest electronic night.',
  },
  {
    id: 'req-4',
    targetName: 'Studio 9 Photography & Drone Coverage',
    targetType: 'Artist',
    eventName: 'TechPulse Annual Innovation Gala',
    date: 'Nov 05, 2026',
    city: 'Bengaluru',
    estimatedCostINR: 20000,
    status: 'Rejected',
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    category: 'Photographer',
  },
  {
    id: 'req-5',
    targetName: 'Metro Amphitheater & Grounds',
    targetType: 'Venue',
    eventName: 'Suncrest College Cultural Fest — Day 2',
    date: 'Nov 12, 2026',
    city: 'Mumbai',
    estimatedCostINR: 85000,
    status: 'Pending',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    notes: 'Main amphitheater stage hold requested for college festival rock band night.',
  },
];

/**
 * Retrieve shared bookings safely from localStorage.
 * Migrates legacy records if found.
 */
export function getSharedBookings(): SharedBookingRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }

    // Check legacy storage key
    const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyRaw) {
      const legacyParsed = JSON.parse(legacyRaw);
      if (Array.isArray(legacyParsed) && legacyParsed.length > 0) {
        const migrated: SharedBookingRequest[] = legacyParsed.map((item: any) => ({
          ...item,
          createdAt: item.createdAt || new Date().toISOString(),
          updatedAt: item.updatedAt || item.createdAt || new Date().toISOString(),
          city: item.city || 'Mumbai',
        }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        return migrated;
      }
    }
  } catch (err) {
    console.error('Error reading shared bookings:', err);
  }

  // Fallback to initial seeded bookings
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SHARED_BOOKINGS));
  return INITIAL_SHARED_BOOKINGS;
}

/**
 * Save or append a new booking request.
 */
export function saveSharedBooking(newBooking: SharedBookingRequest): void {
  try {
    const current = getSharedBookings();
    // Prevent duplicate IDs
    const exists = current.some((b) => b.id === newBooking.id);
    const updated = exists
      ? current.map((b) => (b.id === newBooking.id ? newBooking : b))
      : [newBooking, ...current];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    // Also maintain legacy key for any legacy reader
    localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(updated));

    // Notify all in-app components
    notifySync();
  } catch (err) {
    console.error('Error saving shared booking:', err);
  }
}

/**
 * Update the status of an existing booking request.
 */
export function updateBookingStatus(
  id: string,
  newStatus: BookingStatus,
  optionalNote?: string
): SharedBookingRequest | null {
  try {
    const current = getSharedBookings();
    let updatedBooking: SharedBookingRequest | null = null;

    const next = current.map((b) => {
      if (b.id === id) {
        updatedBooking = {
          ...b,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          notes: optionalNote !== undefined ? optionalNote : b.notes,
        };
        return updatedBooking;
      }
      return b;
    });

    if (updatedBooking) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(next));
      notifySync();
    }

    return updatedBooking;
  } catch (err) {
    console.error('Error updating booking status:', err);
    return null;
  }
}

/**
 * Cross-tab and in-tab event dispatching
 */
function notifySync() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('eventora-booking-sync'));
  }
}

/**
 * Subscribe to booking updates in React components.
 */
export function subscribeToBookings(
  listener: (bookings: SharedBookingRequest[]) => void
): () => void {
  const handler = () => {
    listener(getSharedBookings());
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('eventora-booking-sync', handler);
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY || e.key === LEGACY_STORAGE_KEY) {
        handler();
      }
    });
  }

  return () => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('eventora-booking-sync', handler);
    }
  };
}
