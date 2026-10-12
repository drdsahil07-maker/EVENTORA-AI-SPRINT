import { RescueArtistProfile, RescueRequestData } from '../types';
import { SEEDED_RESCUE_ARTISTS } from '../data/mockArtists';

export interface MatchedRescueCandidate {
  artist: RescueArtistProfile;
  matchScore: number;
  matchReasons: string[];
  isOverBudget: boolean;
  isUnavailable: boolean;
}

/**
 * Deterministic matching algorithm for Date Rescue.
 * Ranks candidates based on Category, Availability, Location, Budget, and Skills.
 */
export function matchRescueArtists(
  request: RescueRequestData,
  artists: RescueArtistProfile[] = SEEDED_RESCUE_ARTISTS
): MatchedRescueCandidate[] {
  const reqCity = request.city.trim().toLowerCase();
  const reqCategory = request.category;
  const maxBudget = Number(request.budgetINR) || 0;
  const userPreferences = (request.skillsPreferences || '').toLowerCase();
  const reqDate = request.eventDate.trim().toLowerCase();

  const results: MatchedRescueCandidate[] = [];

  for (const artist of artists) {
    // 1. Check Date Availability & Exclusions
    const isExplicitlyBooked =
      artist.availabilityStatus === 'Booked (Demo)' ||
      (artist.bookedDates &&
        artist.bookedDates.some((d) => d.toLowerCase().includes(reqDate)));

    // If explicitly booked for date, flag as unavailable
    if (isExplicitlyBooked) {
      continue; // Exclude candidates explicitly marked booked/unavailable
    }

    let score = 0;
    const reasons: string[] = [];

    // 2. Category Match
    if (artist.category === reqCategory) {
      score += 100;
      reasons.push('Category Match');
    } else if (
      (reqCategory === 'Singer' && artist.category === 'Band') ||
      (reqCategory === 'Band' && artist.category === 'Singer') ||
      (reqCategory === 'DJ' && artist.category === 'Band')
    ) {
      score += 40;
      reasons.push('Related Category');
    }

    // 3. Location / Service Area Match
    const cleanReqCity = reqCity.replace(/[^a-z0-9]/g, '');
    const cleanArtistCity = artist.city.toLowerCase().replace(/[^a-z0-9]/g, '');
    const isDirectCityMatch = cleanArtistCity === cleanReqCity;
    const servesCity = artist.serviceArea.some((area) => {
      const cleanArea = area.toLowerCase().replace(/[^a-z0-9]/g, '');
      return (
        cleanArea === cleanReqCity ||
        cleanArea.includes(cleanReqCity) ||
        cleanReqCity.includes(cleanArea)
      );
    });

    if (isDirectCityMatch) {
      score += 45;
      reasons.push(`Base City Match (${artist.city})`);
    } else if (servesCity) {
      score += 35;
      reasons.push(`Serves Area (${request.city})`);
    }

    // 4. Budget Compatibility
    const isOverBudget = maxBudget > 0 && artist.indicativePriceINR > maxBudget;
    if (!isOverBudget && maxBudget > 0) {
      score += 30;
      reasons.push('Within Budget');
    }

    // 5. Skills & Preferences Match
    if (userPreferences) {
      const hasSkillMatch = artist.skills.some((skill) =>
        userPreferences.includes(skill.toLowerCase())
      );
      if (hasSkillMatch) {
        score += 25;
        reasons.push('Skills Match');
      }
    }

    // 6. Availability Label
    if (artist.availabilityStatus === 'Available (Demo)') {
      score += 15;
      reasons.push('Date Available (Demo)');
    }

    results.push({
      artist,
      matchScore: score,
      matchReasons: reasons,
      isOverBudget,
      isUnavailable: false,
    });
  }

  // Sort candidates by matchScore descending, then by price ascending
  return results.sort((a, b) => {
    // Put within-budget first
    if (a.isOverBudget !== b.isOverBudget) {
      return a.isOverBudget ? 1 : -1;
    }
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    return a.artist.indicativePriceINR - b.artist.indicativePriceINR;
  });
}
