import React, { useState, useEffect } from 'react';
import {
  Save,
  Upload,
  CheckCircle2,
  AlertCircle,
  Edit3,
  X,
  FileText,
  MapPin,
  Mail,
  Phone,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { profileService } from '../../services/profileService';
import { socialService } from '../../services/socialService';
import { storageService } from '../../services/storageService';
import { Profile } from '../../types';
import { AppBrandIcon } from '../../components/Social/AppBrandIcon';
import { formatSocialUrl } from '../../utils/urlHelper';

export const AdminProfile: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [instagram, setInstagram] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    profileService.getProfile().then(setProfile);
    socialService.getSocialLinks().then((links) => {
      setInstagram(links.find((s) => s.platform === 'instagram')?.url || '');
      setWhatsapp(links.find((s) => s.platform === 'whatsapp')?.url || '');
    });
  }, []);

  if (!profile) {
    return <div className="text-slate-400 font-mono text-xs">Loading profile data...</div>;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);

    try {
      const updated = await profileService.updateProfile(profile);
      setProfile(updated);

      // Persist Instagram and WhatsApp directly to socialService
      const currentLinks = await socialService.getSocialLinks();
      if (instagram.trim() !== '') {
        const formatted = formatSocialUrl('instagram', instagram);
        const existing = currentLinks.find((s) => s.platform === 'instagram');
        if (existing) {
          await socialService.updateSocialLink(existing.id, { url: formatted });
        } else {
          await socialService.createSocialLink({
            platform: 'instagram',
            label: 'Instagram',
            url: formatted,
            is_active: true,
            display_order: currentLinks.length + 1,
          });
        }
      }
      if (whatsapp.trim() !== '') {
        const formatted = formatSocialUrl('whatsapp', whatsapp);
        const existing = currentLinks.find((s) => s.platform === 'whatsapp');
        if (existing) {
          await socialService.updateSocialLink(existing.id, { url: formatted });
        } else {
          await socialService.createSocialLink({
            platform: 'whatsapp',
            label: 'WhatsApp',
            url: formatted,
            is_active: true,
            display_order: currentLinks.length + 2,
          });
        }
      }

      setStatusMsg({ type: 'success', text: 'Profile changes and social channels saved & synchronized!' });
      // Collapse back into summarized mode
      setIsEditing(false);
    } catch (err: any) {
      setStatusMsg({ type: 'error', text: err.message || 'Failed to save profile.' });
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const res = await storageService.uploadFile(file, 'portfolio-media');
    setUploadingImage(false);

    if (res.url) {
      setProfile((prev) => (prev ? { ...prev, profile_image: res.url } : null));
    } else {
      alert(res.error || 'Failed to upload photo.');
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingResume(true);
    const res = await storageService.uploadFile(file, 'resumes');
    setUploadingResume(false);

    if (res.url) {
      setProfile((prev) => (prev ? { ...prev, resume_url: res.url } : null));
      alert('Resume file uploaded successfully! Click "Save Profile Changes" to persist.');
    } else {
      alert(res.error || 'Failed to upload resume file.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar with dynamic Edit / Close toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Profile &amp; Identity</span>
            {!isEditing && (
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800/80">
                ACTIVE
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isEditing
              ? 'Modify your identity, bio, contact coordinates, portrait image and resume file.'
              : 'Current public portfolio profile summary. Click "Edit Profile" to modify any details.'}
          </p>
        </div>

        <div>
          {isEditing ? (
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setStatusMsg(null);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Close &amp; View Summary</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsEditing(true);
                setStatusMsg(null);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer hover:shadow-indigo-500/20"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 text-xs ${
            statusMsg.type === 'success'
              ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
              : 'bg-red-950/60 border-red-800 text-red-300'
          }`}
        >
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. SUMMARIZED READ-ONLY VIEW (Shown when NOT editing)                     */}
      {/* ========================================================================= */}
      {!isEditing ? (
        <div className="space-y-6">
          {/* Main Profile Summary Card */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 border-b border-slate-700 pb-6">
              <div className="relative">
                <img
                  src={profile.profile_image}
                  alt={profile.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-indigo-500/40 shadow-lg"
                />
                <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-800" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    {profile.name}
                  </h3>
                  {profile.availability_status && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800">
                      {profile.availability_status}
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-indigo-400 mb-3">
                  {profile.headline}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{profile.email}</span>
                  </div>
                  {profile.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                  {profile.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{profile.location}</span>
                    </div>
                  )}
                  {instagram && (
                    <a
                      href={formatSocialUrl('instagram', instagram)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-pink-400 hover:underline"
                    >
                      <AppBrandIcon platform="instagram" size="xs" variant="app-tile" />
                      <span>{instagram}</span>
                    </a>
                  )}
                  {whatsapp && (
                    <a
                      href={formatSocialUrl('whatsapp', whatsapp)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-emerald-400 hover:underline"
                    >
                      <AppBrandIcon platform="whatsapp" size="xs" variant="app-tile" />
                      <span>{whatsapp}</span>
                    </a>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                <span>Edit</span>
              </button>
            </div>

            {/* Bios Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Hero Short Bio
                </h4>
                <div className="p-3.5 bg-slate-900/70 border border-slate-700/60 rounded-lg text-xs text-slate-300 leading-relaxed min-h-[60px]">
                  {profile.short_bio || <span className="text-slate-500 italic">No short bio specified</span>}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Detailed About Bio
                </h4>
                <div className="p-3.5 bg-slate-900/70 border border-slate-700/60 rounded-lg text-xs text-slate-300 leading-relaxed min-h-[60px] line-clamp-4">
                  {profile.bio || <span className="text-slate-500 italic">No detailed bio specified</span>}
                </div>
              </div>
            </div>

            {/* Storage & Media Preview */}
            <div className="mt-6 pt-6 border-t border-slate-700">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Media &amp; Resume Assets
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 bg-slate-900/70 border border-slate-700/60 rounded-lg flex items-center justify-between text-xs">
                  <div className="truncate mr-3">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Profile Photo URL</span>
                    <span className="text-slate-300 font-mono text-[11px] truncate block">{profile.profile_image}</span>
                  </div>
                  <a
                    href={profile.profile_image}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-slate-400 hover:text-indigo-400 shrink-0"
                    title="View Image"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                <div className="p-3 bg-slate-900/70 border border-slate-700/60 rounded-lg flex items-center justify-between text-xs">
                  <div className="truncate mr-3">
                    <span className="text-[10px] text-slate-400 block uppercase font-bold">Resume Document</span>
                    <span className="text-slate-300 font-mono text-[11px] truncate block">{profile.resume_url || '/resume.pdf'}</span>
                  </div>
                  <a
                    href={profile.resume_url || '/resume.pdf'}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-slate-400 hover:text-indigo-400 shrink-0"
                    title="View Document"
                  >
                    <FileText className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Edit Bar */}
            <div className="mt-6 pt-5 border-t border-slate-700/70 flex justify-end">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center gap-2 cursor-pointer hover:shadow-indigo-500/20"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile Information</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* 2. FULL EDITABLE FORM (Shown when editing)                                */
        /* ========================================================================= */
        <form onSubmit={handleSave} className="space-y-6">
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-6 shadow-lg space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-700 pb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Core Bio &amp; Headline</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Headline</label>
                <input
                  type="text"
                  value={profile.headline}
                  onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Short Hero Bio (Displayed in Hero)
              </label>
              <textarea
                rows={2}
                value={profile.short_bio}
                onChange={(e) => setProfile({ ...profile, short_bio: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Detailed Biography (Displayed in About)
              </label>
              <textarea
                rows={4}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Availability Status Tag (Hero kicker)
              </label>
              <input
                type="text"
                value={profile.availability_status}
                onChange={(e) => setProfile({ ...profile, availability_status: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Contact Coordinates */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-6 shadow-lg space-y-5">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Contact &amp; Public Social Coordinates
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                SYNCHRONIZED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="+91 7983873223"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <AppBrandIcon platform="instagram" size="xs" variant="app-tile" />
                  <span>Instagram Profile / Handle</span>
                </label>
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="@yourusername or https://instagram.com/..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
                {instagram && (
                  <p className="text-[10px] text-emerald-400 font-mono mt-1 truncate">
                    Target: {formatSocialUrl('instagram', instagram)}
                  </p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <AppBrandIcon platform="whatsapp" size="xs" variant="app-tile" />
                  <span>WhatsApp Number / Link</span>
                </label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+91 7983873223 or https://wa.me/..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                />
                {whatsapp && (
                  <p className="text-[10px] text-emerald-400 font-mono mt-1 truncate">
                    Target: {formatSocialUrl('whatsapp', whatsapp)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Portrait & Resume Media */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-6 shadow-lg space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-slate-700 pb-3">
              Media &amp; Storage Assets
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
              {/* Profile Photo */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Profile Image</label>
                <div className="flex items-center gap-4">
                  <img
                    src={profile.profile_image}
                    alt="Profile Preview"
                    className="w-16 h-16 rounded-lg object-cover border border-slate-700 shrink-0"
                  />
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={profile.profile_image}
                      onChange={(e) => setProfile({ ...profile, profile_image: e.target.value })}
                      className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs font-medium cursor-pointer text-slate-200">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload New Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Resume File */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">Resume PDF Document</label>
                <div className="space-y-2">
                  <input
                    type="text"
                    value={profile.resume_url}
                    onChange={(e) => setProfile({ ...profile, resume_url: e.target.value })}
                    placeholder="/resume.pdf or https://..."
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs font-medium cursor-pointer text-slate-200">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingResume ? 'Uploading...' : 'Upload New Resume (PDF)'}</span>
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleResumeUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50 hover:shadow-indigo-500/20"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Synchronizing...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
