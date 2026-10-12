import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertTriangle, Shield, Camera, DollarSign, MapPin, User, FileText, Sparkles } from 'lucide-react';
import { RescueArtistProfile, RescueArtistCategory } from '../../types';
import { ProfilePhotoUploader } from '../common/ProfilePhotoUploader';
import { Button } from '../common/Button';

interface ArtistProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  artist: RescueArtistProfile;
  onSave: (updated: RescueArtistProfile) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

const CATEGORIES: RescueArtistCategory[] = [
  'Singer',
  'DJ',
  'Musician',
  'Band',
  'Anchor',
  'Dancer',
  'Photographer',
  'Makeup Artist',
  'Other',
];

export const ArtistProfileEditModal: React.FC<ArtistProfileEditModalProps> = ({
  isOpen,
  onClose,
  artist,
  onSave,
  showToast,
}) => {
  const [name, setName] = useState(artist.name);
  const [category, setCategory] = useState<RescueArtistCategory>(artist.category);
  const [city, setCity] = useState(artist.city);
  const [serviceArea, setServiceArea] = useState(artist.serviceArea.join(', '));
  const [indicativePrice, setIndicativePrice] = useState(artist.indicativePriceINR.toString());
  const [bio, setBio] = useState(artist.bio || artist.shortDescription || '');
  const [skills, setSkills] = useState(artist.skills.join(', '));
  const [phone, setPhone] = useState(artist.contactPhone || '+91 98765 43210');
  const [email, setEmail] = useState(artist.contactEmail || 'artist@eventora.demo');
  const [isPublicContact, setIsPublicContact] = useState(artist.isPublicContact ?? true);
  const [avatarUrl, setAvatarUrl] = useState(artist.avatarUrl || '');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync state when artist prop changes
  useEffect(() => {
    setName(artist.name);
    setCategory(artist.category);
    setCity(artist.city);
    setServiceArea(artist.serviceArea.join(', '));
    setIndicativePrice(artist.indicativePriceINR.toString());
    setBio(artist.bio || artist.shortDescription || '');
    setSkills(artist.skills.join(', '));
    setPhone(artist.contactPhone || '+91 98765 43210');
    setEmail(artist.contactEmail || 'artist@eventora.demo');
    setIsPublicContact(artist.isPublicContact ?? true);
    setAvatarUrl(artist.avatarUrl || '');
    setErrorMessage(null);
  }, [artist, isOpen]);

  // Lock background scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!name.trim()) {
      const err = 'Artist name cannot be empty.';
      setErrorMessage(err);
      showToast(err, 'error');
      return;
    }

    const priceNum = Number(indicativePrice);
    if (isNaN(priceNum) || priceNum < 0) {
      const err = 'Please enter a valid indicative fee in INR.';
      setErrorMessage(err);
      showToast(err, 'error');
      return;
    }

    if (!city.trim()) {
      const err = 'Primary city is required.';
      setErrorMessage(err);
      showToast(err, 'error');
      return;
    }

    const updatedProfile: RescueArtistProfile = {
      ...artist,
      name: name.trim(),
      category,
      city: city.trim(),
      serviceArea: serviceArea.split(',').map((s) => s.trim()).filter(Boolean),
      indicativePriceINR: priceNum,
      bio: bio.trim(),
      shortDescription: bio.trim(),
      skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
      contactPhone: phone.trim(),
      contactEmail: email.trim(),
      isPublicContact,
      avatarUrl,
    };

    onSave(updatedProfile);
    showToast('Artist profile updated successfully.');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white/95 backdrop-blur-xl border border-white/80 rounded-3xl shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 relative max-h-[95vh] overflow-y-auto text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 text-[#0D9488]" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#0F172A]">Edit Artist Profile & Portfolio</h3>
              <p className="text-xs text-slate-500">Changes are synchronized instantly across organizer discovery & requests</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert if any */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* Profile Photo Upload */}
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
            <label className="block font-bold text-slate-900">Artist Profile Photograph</label>
            <ProfilePhotoUploader
              profileKey={`artist:${artist.id}`}
              currentPhotoUrl={avatarUrl}
              fallbackInitials={name.slice(0, 2).toUpperCase()}
              userName={name}
              onPhotoUpdated={(newUrl) => {
                setAvatarUrl(newUrl || '');
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block font-bold text-slate-900 mb-1">Artist / Act Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 font-medium focus:outline-none focus:border-[#0D9488]"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block font-bold text-slate-900 mb-1">Talent Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as RescueArtistCategory)}
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 font-medium focus:outline-none focus:border-[#0D9488]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Base City */}
            <div>
              <label className="block font-bold text-slate-900 mb-1">Primary City *</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 font-medium focus:outline-none focus:border-[#0D9488]"
              />
            </div>

            {/* Indicative Price */}
            <div>
              <label className="block font-bold text-slate-900 mb-1">Indicative Fee (INR) *</label>
              <input
                type="number"
                value={indicativePrice}
                onChange={(e) => setIndicativePrice(e.target.value)}
                required
                min={0}
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 font-medium focus:outline-none focus:border-[#0D9488]"
              />
            </div>

            {/* Service Area */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-900 mb-1">Service Cities (Comma separated)</label>
              <input
                type="text"
                value={serviceArea}
                onChange={(e) => setServiceArea(e.target.value)}
                placeholder="e.g. Mumbai, Pune, Thane, Indore"
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 font-medium focus:outline-none focus:border-[#0D9488]"
              />
            </div>

            {/* Skills & Event Types */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-900 mb-1">Skills & Genres (Comma separated)</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. EDM, Bollywood Remixes, Club Sound, Live Guitar"
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 font-medium focus:outline-none focus:border-[#0D9488]"
              />
            </div>

            {/* Bio */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-900 mb-1">Artist Biography / Experience</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Describe your performance background, equipment rider, or stage presence..."
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 font-medium focus:outline-none focus:border-[#0D9488] resize-none"
              />
            </div>

            {/* Contact Info & Privacy Controls */}
            <div>
              <label className="block font-bold text-slate-900 mb-1">Contact Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 font-medium focus:outline-none focus:border-[#0D9488]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-900 mb-1">Contact Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 font-medium focus:outline-none focus:border-[#0D9488]"
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-3 pt-1 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
              <input
                type="checkbox"
                id="isPublicContact"
                checked={isPublicContact}
                onChange={(e) => setIsPublicContact(e.target.checked)}
                className="w-4 h-4 text-[#0D9488] rounded border-slate-300 focus:ring-[#0D9488]"
              />
              <label htmlFor="isPublicContact" className="text-slate-700 font-medium cursor-pointer">
                Show direct phone & email to verified event organizers (Privacy Control)
              </label>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200/80">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Profile Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
