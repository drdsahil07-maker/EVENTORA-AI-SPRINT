import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { ProfilePhotoUploader } from '../common/ProfilePhotoUploader';
import { Button } from '../common/Button';

export interface OrganizerProfileData {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  organizationName: string;
  city: string;
  bio: string;
  avatarUrl: string;
  isPublicContact: boolean;
}

interface OrganizerProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: OrganizerProfileData;
  onSave: (updated: OrganizerProfileData) => void;
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

export const OrganizerProfileEditModal: React.FC<OrganizerProfileEditModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSave,
  showToast,
}) => {
  const [fullName, setFullName] = useState(profile.fullName);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [orgName, setOrgName] = useState(profile.organizationName);
  const [city, setCity] = useState(profile.city);
  const [bio, setBio] = useState(profile.bio);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [isPublicContact, setIsPublicContact] = useState(profile.isPublicContact);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setFullName(profile.fullName);
    setEmail(profile.email);
    setPhone(profile.phone);
    setOrgName(profile.organizationName);
    setCity(profile.city);
    setBio(profile.bio);
    setAvatarUrl(profile.avatarUrl);
    setIsPublicContact(profile.isPublicContact);
    setErrorMessage(null);
  }, [profile, isOpen]);

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

    if (!fullName.trim()) {
      const err = 'Full name cannot be empty.';
      setErrorMessage(err);
      showToast(err, 'error');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      const err = 'Please enter a valid email address.';
      setErrorMessage(err);
      showToast(err, 'error');
      return;
    }

    const updated: OrganizerProfileData = {
      ...profile,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      organizationName: orgName.trim(),
      city: city.trim(),
      bio: bio.trim(),
      avatarUrl,
      isPublicContact,
    };

    onSave(updated);
    showToast('Organizer profile updated successfully.');
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
        <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#CCFBF1] text-[#0F766E] flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 text-[#0D9488]" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#0F172A]">Edit Organizer Profile — Rahul Raj</h3>
              <p className="text-xs text-slate-500">Update your account details, organization name, and contact settings</p>
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

        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-2xl text-xs font-semibold flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
            <label className="block font-bold text-slate-900">Organizer Profile Photograph</label>
            <ProfilePhotoUploader
              profileKey={`organizer:${profile.id}`}
              currentPhotoUrl={avatarUrl}
              fallbackInitials={fullName.slice(0, 2).toUpperCase()}
              userName={fullName}
              onPhotoUpdated={(newUrl) => {
                setAvatarUrl(newUrl || '');
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-900 mb-1">Full Name *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 font-medium focus:outline-none focus:border-[#0D9488]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-900 mb-1">Organization Name</label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 font-medium focus:outline-none focus:border-[#0D9488]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-900 mb-1">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 font-medium focus:outline-none focus:border-[#0D9488]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-900 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 font-medium focus:outline-none focus:border-[#0D9488]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-900 mb-1">City / Location</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 font-medium focus:outline-none focus:border-[#0D9488]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-900 mb-1">Short Bio</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl bg-white text-slate-900 font-medium focus:outline-none focus:border-[#0D9488] resize-none"
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-3 pt-1 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
              <input
                type="checkbox"
                id="orgPublicContact"
                checked={isPublicContact}
                onChange={(e) => setIsPublicContact(e.target.checked)}
                className="w-4 h-4 text-[#0D9488] rounded border-slate-300 focus:ring-[#0D9488]"
              />
              <label htmlFor="orgPublicContact" className="text-slate-700 font-medium cursor-pointer">
                Show organizer contact details to confirmed artists and venues (Privacy Control)
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200/80">
            <Button variant="outline" size="sm" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" type="submit">
              Save Organizer Profile
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
