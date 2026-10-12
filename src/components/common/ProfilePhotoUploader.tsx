import React, { useRef, useState } from 'react';
import { Camera, Upload, Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { validateImageFile, saveProfilePhoto, deleteProfilePhoto } from '../../utils/imageStorage';
import { Button } from './Button';

interface ProfilePhotoUploaderProps {
  profileKey: string; // e.g. "artist:demo-art-102" or "organizer:sahil"
  currentPhotoUrl?: string;
  fallbackInitials: string;
  userName: string;
  onPhotoUpdated: (newPhotoUrl: string | undefined) => void;
  className?: string;
  size?: 'md' | 'lg';
}

export const ProfilePhotoUploader: React.FC<ProfilePhotoUploaderProps> = ({
  profileKey,
  currentPhotoUrl,
  fallbackInitials,
  userName,
  onPhotoUpdated,
  className = '',
  size = 'lg',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);

    // Validate
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setErrorMessage(validation.error || 'Invalid image file.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // Show temporary local object URL preview while saving
    const tempUrl = URL.createObjectURL(file);
    setPreviewUrl(tempUrl);
    setIsUploading(true);

    try {
      const savedDataUrl = await saveProfilePhoto(profileKey, file);
      onPhotoUpdated(savedDataUrl);
      setPreviewUrl(null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to upload image. Please try again.');
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemovePhoto = async () => {
    setIsUploading(true);
    setErrorMessage(null);
    try {
      await deleteProfilePhoto(profileKey);
      onPhotoUpdated(undefined);
      setPreviewUrl(null);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to remove photo.');
    } finally {
      setIsUploading(false);
    }
  };

  const activePhoto = previewUrl || currentPhotoUrl;

  const dimensionClasses =
    size === 'lg' ? 'w-24 h-24 text-2xl' : 'w-16 h-16 text-lg';

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Photo Avatar / Fallback */}
        <div className="relative group shrink-0">
          <div
            className={`${dimensionClasses} rounded-2xl overflow-hidden ring-2 ring-slate-200/80 bg-gradient-to-br from-teal-50 to-slate-100 flex items-center justify-center font-bold text-teal-800 shadow-xs relative`}
          >
            {activePhoto ? (
              <img
                src={activePhoto}
                alt={userName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if URL fails
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <span>{fallbackInitials}</span>
            )}

            {isUploading && (
              <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-2xs flex items-center justify-center text-white">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            aria-label="Upload photo"
            className="absolute -bottom-1.5 -right-1.5 p-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-md cursor-pointer transition-transform active:scale-95"
            title="Upload or Change Photo"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Upload Controls & Description */}
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            <Button
              variant="outline"
              size="sm"
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              icon={<Upload className="w-3.5 h-3.5" />}
            >
              {activePhoto ? 'Change Photo' : 'Upload Profile Photo'}
            </Button>

            {activePhoto && (
              <Button
                variant="ghost"
                size="sm"
                type="button"
                disabled={isUploading}
                onClick={handleRemovePhoto}
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                icon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Remove
              </Button>
            )}
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed">
            Supported formats: JPG, PNG, WebP (Max 5MB). Photo updates immediately and persists across sessions.
          </p>

          {errorMessage && (
            <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium pt-1 animate-in fade-in">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
