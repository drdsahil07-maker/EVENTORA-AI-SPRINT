import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Calendar,
  MapPin,
  Music,
  DollarSign,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Button } from './Button';

interface BackupRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (request: {
    eventTitle: string;
    roleNeeded: string;
    urgency: string;
    timeLimit: string;
    location: string;
    budget: string;
  }) => void;
}

interface MatchedArtist {
  id: string;
  name: string;
  category: string;
  location: string;
  rate: string;
  rating: number;
  tags: string[];
  availabilityNote: string;
}

export const BackupRequestModal: React.FC<BackupRequestModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1 Fields: Date, City, Artist Category, Budget
  const [eventDate, setEventDate] = useState('Tomorrow, Oct 12');
  const [city, setCity] = useState('San Francisco, CA');
  const [category, setCategory] = useState('Live Band & Acoustic');
  const [budget, setBudget] = useState('$1,200');

  // Optional "More Options" toggle
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [timeSlot, setTimeSlot] = useState('Evening (8:00 PM – 11:00 PM)');
  const [soundProvided, setSoundProvided] = useState('PA System Provided');
  const [specialNotes, setSpecialNotes] = useState('');

  // Step 2: Selected Artist
  const [selectedArtistId, setSelectedArtistId] = useState<string>('art-1');

  // Step 3: Message to artist
  const [message, setMessage] = useState('Hi! Looking for a replacement act for our evening showcase. Would love to have you.');

  if (!isOpen) return null;

  const mockMatchedArtists: MatchedArtist[] = [
    {
      id: 'art-1',
      name: 'Valerie & Key',
      category: 'Neo-Soul & Acoustic Duo',
      location: 'Downtown (3.8 miles away)',
      rate: '$1,100',
      rating: 5.0,
      tags: ['Date fits', 'Within budget', 'Category match'],
      availabilityNote: 'Accepting inquiries for this date',
    },
    {
      id: 'art-2',
      name: 'The Midnight Syndicate',
      category: 'Indie Band & Acoustic',
      location: 'Mission District (4.2 miles away)',
      rate: '$1,200',
      rating: 4.9,
      tags: ['Date fits', 'Within budget', 'Category match'],
      availabilityNote: 'Accepting inquiries for this date',
    },
    {
      id: 'art-3',
      name: 'Echo Aurora',
      category: 'Electronic & Ambient',
      location: 'SOMA (2.4 miles away)',
      rate: '$950',
      rating: 4.9,
      tags: ['Date fits', 'Under budget'],
      availabilityNote: 'Accepting inquiries for this date',
    },
  ];

  const selectedArtist = mockMatchedArtists.find((a) => a.id === selectedArtistId) || mockMatchedArtists[0];

  const handleNextToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleNextToStep3 = () => {
    setStep(3);
  };

  const handleSendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(4);
    setTimeout(() => {
      onSubmit({
        eventTitle: `Date Rescue: ${category} in ${city}`,
        roleNeeded: selectedArtist.name,
        urgency: 'Date Rescue',
        timeLimit: eventDate,
        location: city,
        budget,
      });
    }, 400);
  };

  const handleResetAndClose = () => {
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={handleResetAndClose}
      />

      <div className="relative bg-white rounded-2xl max-w-lg w-full shadow-xl border border-[#E2E8F0] overflow-hidden z-10">
        {/* Simple Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
          <div>
            <h3 className="font-bold text-base text-[#0F2747]">
              Date Rescue
            </h3>
            <p className="text-xs text-[#64748B]">
              {step === 1 && 'Step 1 of 3: Tell us what you need'}
              {step === 2 && 'Step 2 of 3: Review matching artists'}
              {step === 3 && 'Step 3 of 3: Send booking request'}
              {step === 4 && 'Request Sent'}
            </p>
          </div>
          <button
            onClick={handleResetAndClose}
            className="text-[#64748B] hover:text-[#0F172A] p-1.5 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Bar */}
        {step < 4 && (
          <div className="flex border-b border-[#E2E8F0] bg-white text-xs text-center font-medium">
            <div
              className={`flex-1 py-2 border-b-2 ${
                step >= 1 ? 'border-[#0D9488] text-[#0D9488] font-semibold' : 'border-transparent text-slate-400'
              }`}
            >
              1. Event Needs
            </div>
            <div
              className={`flex-1 py-2 border-b-2 ${
                step >= 2 ? 'border-[#0D9488] text-[#0D9488] font-semibold' : 'border-transparent text-slate-400'
              }`}
            >
              2. Artists
            </div>
            <div
              className={`flex-1 py-2 border-b-2 ${
                step >= 3 ? 'border-[#0D9488] text-[#0D9488] font-semibold' : 'border-transparent text-slate-400'
              }`}
            >
              3. Request
            </div>
          </div>
        )}

        {/* STEP 1: Tell us what you need */}
        {step === 1 && (
          <form onSubmit={handleNextToStep2} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Event Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  placeholder="e.g., Tomorrow, Oct 12"
                  required
                  className="w-full text-xs pl-9 pr-3 py-2.5 border border-[#E2E8F0] rounded-xl focus:border-[#0D9488] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                City / Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g., San Francisco, CA"
                  required
                  className="w-full text-xs pl-9 pr-3 py-2.5 border border-[#E2E8F0] rounded-xl focus:border-[#0D9488] outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Artist Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 border border-[#E2E8F0] rounded-xl focus:border-[#0D9488] outline-none bg-white"
                >
                  <option>Live Band & Acoustic</option>
                  <option>Solo Singer / Songwriter</option>
                  <option>DJ & Electronic</option>
                  <option>Jazz Trio / Quartet</option>
                  <option>Classical / String Ensemble</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                  Budget
                </label>
                <div className="relative">
                  <DollarSign className="w-4 h-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g., $1,200"
                    required
                    className="w-full text-xs pl-8 pr-3 py-2.5 border border-[#E2E8F0] rounded-xl focus:border-[#0D9488] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* More Options Accordion */}
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
                  <div>
                    <label className="block text-xs font-medium text-[#475569] mb-1">
                      Time Slot
                    </label>
                    <input
                      type="text"
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      placeholder="e.g., 8:00 PM – 11:00 PM"
                      className="w-full text-xs px-3 py-2 border border-[#E2E8F0] rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#475569] mb-1">
                      Audio / Production
                    </label>
                    <input
                      type="text"
                      value={soundProvided}
                      onChange={(e) => setSoundProvided(e.target.value)}
                      placeholder="e.g., PA system provided"
                      className="w-full text-xs px-3 py-2 border border-[#E2E8F0] rounded-lg bg-white"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-[#F1F5F9]">
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
                Find Matching Artists
              </Button>
            </div>
          </form>
        )}

        {/* STEP 2: Review matching artists */}
        {step === 2 && (
          <div className="p-6 space-y-4">
            <p className="text-xs text-[#64748B]">
              Found {mockMatchedArtists.length} artists matching your date, city, and budget:
            </p>

            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {mockMatchedArtists.map((artist) => {
                const isSelected = selectedArtistId === artist.id;
                return (
                  <div
                    key={artist.id}
                    onClick={() => setSelectedArtistId(artist.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#0D9488] bg-[#CCFBF1]/20 ring-1 ring-[#0D9488]'
                        : 'border-[#E2E8F0] hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-[#0F172A]">{artist.name}</h4>
                          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                            {artist.rate}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#64748B] mt-0.5">{artist.category} · {artist.location}</p>
                      </div>

                      <div className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors border-[#0D9488] bg-[#0D9488] text-white">
                        {isSelected ? <Check className="w-3 h-3" /> : <span className="w-2 h-2 rounded-full bg-white opacity-0" />}
                      </div>
                    </div>

                    {/* Match Reason Labels (Required by prompt) */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                      {artist.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200"
                        >
                          ✓ {tag}
                        </span>
                      ))}
                      <span className="text-[10px] text-[#64748B] ml-auto">
                        {artist.availabilityNote}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 flex items-center justify-between border-t border-[#F1F5F9]">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep(1)}
                icon={<ArrowLeft className="w-3.5 h-3.5" />}
              >
                Back
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleNextToStep3}
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Continue with {selectedArtist.name}
              </Button>
            </div>
          </div>
        )}

        {/* STEP 3: Send a booking request */}
        {step === 3 && (
          <form onSubmit={handleSendRequest} className="p-6 space-y-4">
            <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#64748B]">Selected Artist:</span>
                <strong className="text-[#0F172A]">{selectedArtist.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Date & Location:</span>
                <span className="text-[#0F172A] font-medium">{eventDate} · {city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748B]">Offered Budget:</span>
                <span className="text-[#0D9488] font-bold">{budget}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0F172A] mb-1">
                Short Note to Artist
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Add any event details or venue notes..."
                className="w-full text-xs p-3 border border-[#E2E8F0] rounded-xl focus:border-[#0D9488] outline-none resize-none"
              />
            </div>

            <p className="text-[11px] text-[#64748B]">
              Submitting sends an inquiry directly to the artist. Booking is confirmed once the artist accepts your terms.
            </p>

            <div className="pt-3 flex items-center justify-between border-t border-[#F1F5F9]">
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => setStep(2)}
                icon={<ArrowLeft className="w-3.5 h-3.5" />}
              >
                Back
              </Button>
              <Button
                variant="primary"
                size="md"
                type="submit"
                icon={<Check className="w-4 h-4" />}
              >
                Send Booking Request
              </Button>
            </div>
          </form>
        )}

        {/* STEP 4: Success confirmation */}
        {step === 4 && (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-[#0D9488] mx-auto" />
            <h4 className="text-base font-bold text-[#0F2747]">
              Booking Request Sent
            </h4>
            <p className="text-xs text-[#64748B] max-w-xs mx-auto">
              Your request was delivered to <strong>{selectedArtist.name}</strong>. Most artists respond within 2 hours.
            </p>
            <div className="pt-4">
              <Button variant="primary" size="sm" onClick={handleResetAndClose}>
                Done
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
