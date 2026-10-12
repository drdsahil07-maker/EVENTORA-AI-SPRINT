import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  MapPin,
  Music,
  IndianRupee,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldAlert,
  Clock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Filter,
  User,
  Info,
} from 'lucide-react';
import { Button } from '../common/Button';
import {
  OrganizerEvent,
  OrganizerBookingRequest,
  RescueArtistCategory,
  RescueReason,
  RescueRequestData,
  RescueArtistProfile,
} from '../../types';
import { matchRescueArtists, MatchedRescueCandidate } from '../../utils/rescueMatcher';
import { saveSharedBooking } from '../../utils/bookingStore';

interface DateRescueModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingEvents?: OrganizerEvent[];
  initialPrefill?: Partial<RescueRequestData>;
  onBookingCreated?: (booking: OrganizerBookingRequest) => void;
  onViewMyBookings?: () => void;
}

const CATEGORIES: RescueArtistCategory[] = [
  'DJ',
  'Singer',
  'Photographer',
  'Anchor',
  'Dancer',
  'Makeup Artist',
  'Mehndi Artist',
  'Band',
  'Other',
];

const RESCUE_REASONS: RescueReason[] = [
  'Artist Cancelled',
  'Artist Unavailable',
  'Emergency Replacement',
  'Other',
];

export const DateRescueModal: React.FC<DateRescueModalProps> = ({
  isOpen,
  onClose,
  existingEvents = [],
  initialPrefill,
  onBookingCreated,
  onViewMyBookings,
}) => {
  // Step indicator: 1 = Request Details, 2 = Matching Artists, 3 = Review Request, 4 = Success
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1 Form Fields
  const [selectedExistingEventId, setSelectedExistingEventId] = useState<string>('');
  const [eventName, setEventName] = useState('Diwali Fusion Concert');
  const [eventDate, setEventDate] = useState('Oct 28, 2026');
  const [city, setCity] = useState('Mumbai');
  const [category, setCategory] = useState<RescueArtistCategory>('Singer');
  const [budgetINR, setBudgetINR] = useState<number | ''>(50000);
  const [reason, setReason] = useState<RescueReason>('Artist Cancelled');

  // Optional "More Options" fields
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [startTime, setStartTime] = useState('19:00');
  const [eventType, setEventType] = useState('Concert');
  const [skillsPreferences, setSkillsPreferences] = useState('Sufi, Acoustic, Live Vocals');
  const [additionalNotes, setAdditionalNotes] = useState('');

  // Validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 2 Candidates & Filters
  const [candidates, setCandidates] = useState<MatchedRescueCandidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<MatchedRescueCandidate | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterAvailability, setFilterAvailability] = useState<'all' | 'available' | 'unconfirmed'>('all');
  const [showOverBudget, setShowOverBudget] = useState(false);
  const [viewingProfileId, setViewingProfileId] = useState<string | null>(null);

  // Step 3 Confirmation & Notes
  const [requestNote, setRequestNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBookingId, setConfirmedBookingId] = useState<string>('');

  // Prefill effect when opening or when initialPrefill changes
  useEffect(() => {
    if (isOpen) {
      if (initialPrefill) {
        if (initialPrefill.eventId) setSelectedExistingEventId(initialPrefill.eventId);
        if (initialPrefill.eventName) setEventName(initialPrefill.eventName);
        if (initialPrefill.eventDate) setEventDate(initialPrefill.eventDate);
        if (initialPrefill.city) setCity(initialPrefill.city);
        if (initialPrefill.category) setCategory(initialPrefill.category);
        if (initialPrefill.budgetINR) setBudgetINR(initialPrefill.budgetINR);
        if (initialPrefill.reason) setReason(initialPrefill.reason);
        if (initialPrefill.startTime) setStartTime(initialPrefill.startTime);
        if (initialPrefill.skillsPreferences) setSkillsPreferences(initialPrefill.skillsPreferences);
      } else if (existingEvents.length > 0 && !selectedExistingEventId) {
        // default to first event if not prefilled
        const firstEvt = existingEvents[0];
        setSelectedExistingEventId(firstEvt.id);
        setEventName(firstEvt.name);
        setEventDate(firstEvt.date);
        setCity(firstEvt.city);
        if (firstEvt.requiredServices.length > 0) {
          const firstServ = firstEvt.requiredServices[0] as RescueArtistCategory;
          if (CATEGORIES.includes(firstServ)) setCategory(firstServ);
        }
        setBudgetINR(Math.round(firstEvt.totalBudgetINR * 0.35));
      }
    }
  }, [isOpen, initialPrefill, existingEvents]);

  if (!isOpen) return null;

  // Handle existing event selection dropdown
  const handleSelectEvent = (eventId: string) => {
    setSelectedExistingEventId(eventId);
    if (eventId === 'custom') {
      return;
    }
    const matchedEvt = existingEvents.find((e) => e.id === eventId);
    if (matchedEvt) {
      setEventName(matchedEvt.name);
      setEventDate(matchedEvt.date);
      setCity(matchedEvt.city);
      setStartTime(matchedEvt.startTime);
      setEventType(matchedEvt.eventType);
      if (matchedEvt.requiredServices.length > 0) {
        const primaryService = matchedEvt.requiredServices[0] as RescueArtistCategory;
        if (CATEGORIES.includes(primaryService)) {
          setCategory(primaryService);
        }
      }
      setBudgetINR(Math.round(matchedEvt.totalBudgetINR * 0.35));
    }
  };

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!eventName.trim()) errs.eventName = 'Event name is required';
    if (!eventDate.trim()) errs.eventDate = 'Event date is required';
    if (!city.trim()) errs.city = 'City is required';
    if (!budgetINR || Number(budgetINR) <= 0) errs.budgetINR = 'Enter valid budget in INR';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFindMatches = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep1()) return;

    const requestData: RescueRequestData = {
      eventId: selectedExistingEventId !== 'custom' ? selectedExistingEventId : undefined,
      eventName: eventName.trim(),
      eventDate: eventDate.trim(),
      city: city.trim(),
      category,
      budgetINR: Number(budgetINR),
      reason,
      startTime,
      eventType,
      skillsPreferences,
      additionalNotes,
    };

    const matches = matchRescueArtists(requestData);
    setCandidates(matches);

    // Default select first available candidate if exists
    const firstWithinBudget = matches.find((m) => !m.isOverBudget);
    setSelectedCandidate(firstWithinBudget || matches[0] || null);

    setStep(2);
  };

  // Step 2 Filters logic
  const filteredCandidates = candidates.filter((item) => {
    // Over budget toggle
    if (!showOverBudget && item.isOverBudget) {
      return false;
    }
    // Category filter
    if (filterCategory !== 'all' && item.artist.category !== filterCategory) {
      return false;
    }
    // Availability filter
    if (filterAvailability === 'available' && item.artist.availabilityStatus !== 'Available (Demo)') {
      return false;
    }
    if (filterAvailability === 'unconfirmed' && item.artist.availabilityStatus !== 'Availability Unconfirmed') {
      return false;
    }
    return true;
  });

  const handleProceedToStep3 = (candidate: MatchedRescueCandidate) => {
    setSelectedCandidate(candidate);
    setStep(3);
  };

  const handleConfirmBookingRequest = () => {
    if (!selectedCandidate || isSubmitting) return;

    setIsSubmitting(true);
    const uniqueId = `req-rescue-${Date.now()}`;

    const newBooking: OrganizerBookingRequest = {
      id: uniqueId,
      targetName: selectedCandidate.artist.name,
      targetType: 'Artist',
      eventName,
      date: eventDate,
      city: city.trim(),
      estimatedCostINR: selectedCandidate.artist.indicativePriceINR,
      status: 'Pending',
      eventId: selectedExistingEventId !== 'custom' ? selectedExistingEventId : undefined,
      artistId: selectedCandidate.artist.id,
      category: selectedCandidate.artist.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: requestNote.trim() || undefined,
      isDateRescue: true,
    };

    // Store in shared storage to maintain single source of truth across roles
    saveSharedBooking(newBooking);

    if (onBookingCreated) {
      onBookingCreated(newBooking);
    }

    setConfirmedBookingId(uniqueId);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep(4);
    }, 400);
  };

  const handleResetAndClose = () => {
    setStep(1);
    setSelectedCandidate(null);
    setViewingProfileId(null);
    setRequestNote('');
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={handleResetAndClose}
      />

      <div className="relative bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-[#E2E8F0] overflow-hidden z-10 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#0F2747] text-[#CCFBF1] flex items-center justify-center font-bold">
              <ShieldAlert className="w-4 h-4 text-[#0D9488]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-[#0F2747]">Date Rescue</h3>
                <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                  Demo Workflow
                </span>
              </div>
              <p className="text-xs text-[#64748B]">
                {step === 1 && 'Step 1 of 3: Request Details — Tell us what replacement you need'}
                {step === 2 && 'Step 2 of 3: Matching Artists — Deterministically ranked candidates'}
                {step === 3 && 'Step 3 of 3: Review Request — Confirm & send booking offer'}
                {step === 4 && 'Request Sent — Confirmation & status tracking'}
              </p>
            </div>
          </div>

          <button
            onClick={handleResetAndClose}
            className="text-[#64748B] hover:text-[#0F172A] p-1.5 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 3-Step Indicator Bar */}
        {step < 4 && (
          <div className="grid grid-cols-3 border-b border-[#E2E8F0] bg-white text-xs text-center font-medium">
            <div
              className={`py-2.5 border-b-2 transition-colors ${
                step >= 1 ? 'border-[#0D9488] text-[#0D9488] font-bold' : 'border-transparent text-slate-400'
              }`}
            >
              1. Request Details
            </div>
            <div
              className={`py-2.5 border-b-2 transition-colors ${
                step >= 2 ? 'border-[#0D9488] text-[#0D9488] font-bold' : 'border-transparent text-slate-400'
              }`}
            >
              2. Matching Artists
            </div>
            <div
              className={`py-2.5 border-b-2 transition-colors ${
                step >= 3 ? 'border-[#0D9488] text-[#0D9488] font-bold' : 'border-transparent text-slate-400'
              }`}
            >
              3. Review Request
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {/* STEP 1: CREATE A RESCUE REQUEST */}
          {step === 1 && (
            <form onSubmit={handleFindMatches} className="space-y-4">
              {/* Existing Event Selection / Custom Toggle */}
              {existingEvents.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Select Event (Prefills Date & City)
                  </label>
                  <select
                    value={selectedExistingEventId}
                    onChange={(e) => handleSelectEvent(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-[#E2E8F0] rounded-xl outline-none focus:border-[#0D9488] bg-white"
                  >
                    <option value="custom">-- Enter Custom Event Details --</option>
                    {existingEvents.map((evt) => (
                      <option key={evt.id} value={evt.id}>
                        {evt.name} ({evt.city} · {evt.date})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Event Name */}
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Event Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Annual Fest Main Stage"
                  value={eventName}
                  onChange={(e) => {
                    setEventName(e.target.value);
                    if (errors.eventName) setErrors({ ...errors, eventName: '' });
                  }}
                  className={`w-full text-xs px-3 py-2 border rounded-xl outline-none focus:border-[#0D9488] ${
                    errors.eventName ? 'border-rose-300 bg-rose-50/20' : 'border-[#E2E8F0]'
                  }`}
                />
                {errors.eventName && (
                  <p className="text-[11px] text-rose-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.eventName}
                  </p>
                )}
              </div>

              {/* Event Date & City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Event Date <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="e.g., Oct 28, 2026"
                      value={eventDate}
                      onChange={(e) => {
                        setEventDate(e.target.value);
                        if (errors.eventDate) setErrors({ ...errors, eventDate: '' });
                      }}
                      className={`w-full text-xs pl-8 pr-3 py-2 border rounded-xl outline-none focus:border-[#0D9488] ${
                        errors.eventDate ? 'border-rose-300 bg-rose-50/20' : 'border-[#E2E8F0]'
                      }`}
                    />
                  </div>
                  {errors.eventDate && (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.eventDate}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="e.g., Mumbai, Bengaluru, Delhi"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        if (errors.city) setErrors({ ...errors, city: '' });
                      }}
                      className={`w-full text-xs pl-8 pr-3 py-2 border rounded-xl outline-none focus:border-[#0D9488] ${
                        errors.city ? 'border-rose-300 bg-rose-50/20' : 'border-[#E2E8F0]'
                      }`}
                    />
                  </div>
                  {errors.city && (
                    <p className="text-[11px] text-rose-500 mt-1">{errors.city}</p>
                  )}
                </div>
              </div>

              {/* Artist Category & Reason */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Artist Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as RescueArtistCategory)}
                    className="w-full text-xs px-3 py-2 border border-[#E2E8F0] rounded-xl outline-none focus:border-[#0D9488] bg-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                    Replacement Reason <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value as RescueReason)}
                    className="w-full text-xs px-3 py-2 border border-[#E2E8F0] rounded-xl outline-none focus:border-[#0D9488] bg-white"
                  >
                    {RESCUE_REASONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Budget (INR) */}
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Budget in INR <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <IndianRupee className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="number"
                    min={5000}
                    step={1000}
                    placeholder="e.g., 45000"
                    value={budgetINR}
                    onChange={(e) => {
                      setBudgetINR(e.target.value ? Number(e.target.value) : '');
                      if (errors.budgetINR) setErrors({ ...errors, budgetINR: '' });
                    }}
                    className={`w-full text-xs pl-8 pr-3 py-2 border rounded-xl outline-none focus:border-[#0D9488] ${
                      errors.budgetINR ? 'border-rose-300 bg-rose-50/20' : 'border-[#E2E8F0]'
                    }`}
                  />
                </div>
                {errors.budgetINR && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.budgetINR}</p>
                )}
              </div>

              {/* Progressive Disclosure: More Options */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowMoreOptions(!showMoreOptions)}
                  className="text-xs font-medium text-[#0D9488] hover:text-[#0F766E] flex items-center gap-1 cursor-pointer"
                >
                  {showMoreOptions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  <span>{showMoreOptions ? 'Fewer Options' : 'More Options'}</span>
                </button>

                {showMoreOptions && (
                  <div className="mt-3 p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-medium text-[#475569] mb-1">
                          Start Time
                        </label>
                        <input
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 border border-[#E2E8F0] rounded-lg bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-[#475569] mb-1">
                          Event Type
                        </label>
                        <input
                          type="text"
                          value={eventType}
                          onChange={(e) => setEventType(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 border border-[#E2E8F0] rounded-lg bg-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-[#475569] mb-1">
                        Skills / Genre Preferences
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Bollywood, Acoustic, EDM, Retro"
                        value={skillsPreferences}
                        onChange={(e) => setSkillsPreferences(e.target.value)}
                        className="w-full text-xs px-2.5 py-1.5 border border-[#E2E8F0] rounded-lg bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-[#475569] mb-1">
                        Additional Notes
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Stage specifications, PA availability, or emergency call-time notes..."
                        value={additionalNotes}
                        onChange={(e) => setAdditionalNotes(e.target.value)}
                        className="w-full text-xs p-2 border border-[#E2E8F0] rounded-lg bg-white resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-end gap-2.5">
                <Button variant="ghost" size="sm" type="button" onClick={handleResetAndClose}>
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  icon={<ArrowRight className="w-4 h-4" />}
                  iconPosition="right"
                >
                  Find Matches
                </Button>
              </div>
            </form>
          )}

          {/* STEP 2: MATCH SUITABLE ARTISTS */}
          {step === 2 && (
            <div className="space-y-4">
              {/* Context Summary & Filter Bar */}
              <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-[#64748B]">Matching for: </span>
                  <strong className="text-[#0F172A]">{category} in {city}</strong>
                  <span className="text-[#64748B]"> · Date: </span>
                  <strong className="text-[#0F172A]">{eventDate}</strong>
                  <span className="text-[#64748B]"> · Budget: </span>
                  <strong className="text-[#0D9488]">₹{Number(budgetINR).toLocaleString('en-IN')}</strong>
                </div>

                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-[#0D9488] hover:text-[#0F766E] flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Refine Search
                </button>
              </div>

              {/* Filters Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-[#64748B] font-medium">Filter by:</span>
                  <select
                    value={filterAvailability}
                    onChange={(e) => setFilterAvailability(e.target.value as any)}
                    className="text-xs px-2 py-1 border border-[#E2E8F0] rounded-lg bg-white text-[#0F172A]"
                  >
                    <option value="all">All Availabilities</option>
                    <option value="available">Available (Demo) only</option>
                    <option value="unconfirmed">Availability Unconfirmed</option>
                  </select>

                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="text-xs px-2 py-1 border border-[#E2E8F0] rounded-lg bg-white text-[#0F172A]"
                  >
                    <option value="all">All Categories</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <label className="flex items-center gap-1.5 cursor-pointer text-xs text-[#64748B]">
                  <input
                    type="checkbox"
                    checked={showOverBudget}
                    onChange={(e) => setShowOverBudget(e.target.checked)}
                    className="rounded text-[#0D9488] focus:ring-0"
                  />
                  <span>Show Over-Budget Artists</span>
                </label>
              </div>

              {/* Candidate Cards List */}
              {filteredCandidates.length === 0 ? (
                <div className="p-8 text-center text-xs text-[#64748B] space-y-2 border border-dashed border-[#E2E8F0] rounded-xl">
                  <Info className="w-6 h-6 text-slate-400 mx-auto" />
                  <p className="font-semibold text-[#0F172A]">No replacement matches found for this filter.</p>
                  <p>Try enabling "Show Over-Budget Artists" or broadening the city/category search.</p>
                  <Button variant="outline" size="sm" onClick={() => setStep(1)}>
                    Edit Request Details
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                  {filteredCandidates.map((candidate) => {
                    const isViewingProfile = viewingProfileId === candidate.artist.id;

                    return (
                      <div
                        key={candidate.artist.id}
                        className={`p-4 rounded-xl border transition-all ${
                          candidate.isOverBudget
                            ? 'border-slate-200 bg-slate-50/50'
                            : 'border-[#E2E8F0] hover:border-[#0D9488]/50 bg-white'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm text-[#0F172A]">
                                {candidate.artist.name}
                              </h4>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                                {candidate.artist.category}
                              </span>
                              {candidate.artist.availabilityStatus === 'Available (Demo)' ? (
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#CCFBF1] text-[#0F766E] border border-[#99F6E4]">
                                  Available (Demo)
                                </span>
                              ) : (
                                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                                  Availability Unconfirmed
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B]">
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-[#0D9488]" />
                                {candidate.artist.city} (Serves: {candidate.artist.serviceArea.join(', ')})
                              </span>
                              <span>·</span>
                              <span className="font-bold text-[#0D9488]">
                                Indicative Fee: ₹{candidate.artist.indicativePriceINR.toLocaleString('en-IN')}
                              </span>
                              {candidate.isOverBudget && (
                                <span className="text-rose-600 font-semibold text-[10px]">
                                  (Over Budget)
                                </span>
                              )}
                            </div>

                            {/* Match Reasons Tags */}
                            <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                              {candidate.matchReasons.map((reason) => (
                                <span
                                  key={reason}
                                  className="text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200"
                                >
                                  ✓ {reason}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Action Buttons for Card */}
                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            <button
                              onClick={() =>
                                setViewingProfileId(isViewingProfile ? null : candidate.artist.id)
                              }
                              className="text-xs font-semibold text-[#64748B] hover:text-[#0F172A] px-2.5 py-1.5 rounded-lg border border-[#E2E8F0] hover:bg-slate-50 cursor-pointer"
                            >
                              {isViewingProfile ? 'Hide Profile' : 'View Profile'}
                            </button>

                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => handleProceedToStep3(candidate)}
                              icon={<ArrowRight className="w-3.5 h-3.5" />}
                              iconPosition="right"
                            >
                              Request Backup
                            </Button>
                          </div>
                        </div>

                        {/* Expandable Profile Drawer */}
                        {isViewingProfile && (
                          <div className="mt-3 pt-3 border-t border-[#F1F5F9] bg-[#F8FAFC] p-3 rounded-xl text-xs space-y-2">
                            <div className="flex items-center justify-between text-[11px] text-[#64748B]">
                              <span>Artist ID: {candidate.artist.id}</span>
                              <span className="italic">Sample Demo Profile</span>
                            </div>
                            <p className="text-[#334155] leading-relaxed">
                              {candidate.artist.shortDescription}
                            </p>
                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                              <span className="text-[#64748B] font-semibold text-[10px]">Skills:</span>
                              {candidate.artist.skills.map((s) => (
                                <span key={s} className="px-2 py-0.5 bg-white border border-[#E2E8F0] rounded text-[10px] text-slate-700">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Step 2 Footer Nav */}
              <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep(1)}
                  icon={<ArrowLeft className="w-3.5 h-3.5" />}
                >
                  Back to Details
                </Button>
                <span className="text-[11px] text-[#64748B]">
                  {filteredCandidates.length} potential matches ranked
                </span>
              </div>
            </div>
          )}

          {/* STEP 3: CREATE A BOOKING REQUEST */}
          {step === 3 && selectedCandidate && (
            <div className="space-y-4">
              <div className="p-4 bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] space-y-3">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2">
                  <h4 className="font-bold text-sm text-[#0F172A]">Request Summary</h4>
                  <span className="text-[10px] font-semibold bg-[#CCFBF1] text-[#0F766E] px-2 py-0.5 rounded">
                    Date Rescue Protocol
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#64748B] block text-[11px]">Selected Replacement:</span>
                    <strong className="text-[#0F172A] text-sm">{selectedCandidate.artist.name}</strong>
                    <span className="text-[11px] text-[#64748B] block">
                      Category: {selectedCandidate.artist.category}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#64748B] block text-[11px]">Indicative Fee:</span>
                    <strong className="text-[#0D9488] text-sm">
                      ₹{selectedCandidate.artist.indicativePriceINR.toLocaleString('en-IN')}
                    </strong>
                    <span className="text-[10px] text-slate-500 block">
                      Your budget: ₹{Number(budgetINR).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#64748B] block text-[11px]">Event Name & Date:</span>
                    <strong className="text-[#0F172A]">{eventName}</strong>
                    <span className="text-[11px] text-[#64748B] block">
                      {eventDate} · {startTime || 'TBD'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#64748B] block text-[11px]">Location & City:</span>
                    <strong className="text-[#0F172A]">{city}</strong>
                    <span className="text-[11px] text-[#64748B] block">
                      Replacement Reason: {reason}
                    </span>
                  </div>
                </div>
              </div>

              {/* Optional Note Field */}
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Optional Note to Artist
                </label>
                <textarea
                  rows={3}
                  value={requestNote}
                  onChange={(e) => setRequestNote(e.target.value)}
                  placeholder="e.g., We experienced a cancellation for our evening slot. Sound equipment is ready on-site. Looking forward to your response..."
                  className="w-full text-xs p-3 border border-[#E2E8F0] rounded-xl outline-none focus:border-[#0D9488] resize-none"
                />
              </div>

              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-amber-800 space-y-1">
                <p className="font-semibold text-[11px]">Booking Status Notice:</p>
                <p className="text-[11px] leading-relaxed">
                  Upon confirmation, this booking request will be saved with a <strong>Pending</strong> status.
                  It will not be marked confirmed until explicitly accepted by the provider.
                </p>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setStep(2)}
                  icon={<ArrowLeft className="w-3.5 h-3.5" />}
                  disabled={isSubmitting}
                >
                  Go Back
                </Button>

                <Button
                  variant="primary"
                  size="md"
                  onClick={handleConfirmBookingRequest}
                  disabled={isSubmitting}
                  icon={<Check className="w-4 h-4" />}
                >
                  {isSubmitting ? 'Transmitting Request...' : 'Confirm Request'}
                </Button>
              </div>
            </div>
          )}

          {/* STEP 4: SUCCESS CONFIRMATION */}
          {step === 4 && (
            <div className="p-6 text-center space-y-4">
              <CheckCircle2 className="w-14 h-14 text-[#0D9488] mx-auto animate-bounce" />

              <div>
                <h4 className="text-lg font-bold text-[#0F172A]">
                  Rescue Booking Request Transmitted
                </h4>
                <p className="text-xs text-[#64748B] mt-1">
                  Your replacement request has been registered and sent with <strong>Pending</strong> status.
                </p>
              </div>

              <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl text-xs max-w-sm mx-auto space-y-1 text-left">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Request Reference ID:</span>
                  <strong className="text-[#0F172A] font-mono">{confirmedBookingId}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Artist:</span>
                  <span className="text-[#0F172A] font-medium">{selectedCandidate?.artist.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Event & Date:</span>
                  <span className="text-[#0F172A]">{eventName} ({eventDate})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Status:</span>
                  <span className="text-amber-700 font-semibold">Pending</span>
                </div>
              </div>

              <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetAndClose}
                >
                  Close & Return
                </Button>

                {onViewMyBookings && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      onViewMyBookings();
                      handleResetAndClose();
                    }}
                    icon={<ArrowRight className="w-3.5 h-3.5" />}
                    iconPosition="right"
                  >
                    Open in My Bookings
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
