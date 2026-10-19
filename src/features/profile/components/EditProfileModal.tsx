import React, { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/modal';
import type { UserProfileData } from '../types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfileData;
  onSave: (updates: Partial<UserProfileData>) => void;
}

const PRESET_AVATARS = [
  { label: 'NL', bg: 'bg-heritage-green' },
  { label: 'VC', bg: 'bg-[#9E2A2B]' },
  { label: 'HN', bg: 'bg-[#B45309]' },
  { label: 'SG', bg: 'bg-[#0D9488]' },
  { label: 'HUE', bg: 'bg-[#6D28D9]' },
];
const CEFR_OPTIONS = [
  { value: 'A2 - Nền tảng văn hóa cơ bản', label: 'A2 · Elementary' },
  { value: 'B1 - Giao tiếp & Thuyết trình Văn hóa', label: 'B1 · Intermediate' },
  { value: 'B2 - Phân tích & Tranh biện Di sản', label: 'B2 · Upper intermediate' },
];
const inputClass = 'w-full px-3.5 py-2.5 bg-rice-paper dark:bg-[#1A3D34] border border-antique-gold/40 text-heritage-green dark:text-warm-ivory placeholder:text-stone-400';
const labelClass = 'block text-heritage-green dark:text-antique-gold mb-1.5';

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose, profile, onSave }) => {
  const [name, setName] = useState(profile.name);
  const [avatar, setAvatar] = useState(profile.avatar || 'NL');
  const [bio, setBio] = useState(profile.bio || '');
  const [dailyMinutes, setDailyMinutes] = useState(profile.dailyTargetMinutes || 15);
  const [targetCefr, setTargetCefr] = useState(profile.targetCefr);

  useEffect(() => {
    if (!isOpen) return;
    setName(profile.name);
    setAvatar(profile.avatar || 'NL');
    setBio(profile.bio || '');
    setDailyMinutes(profile.dailyTargetMinutes || 15);
    setTargetCefr(profile.targetCefr || CEFR_OPTIONS[1].value);
  }, [isOpen, profile]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSave({ name: name.trim() || profile.name, avatar, bio: bio.trim(), dailyTargetMinutes: dailyMinutes, targetCefr });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit profile" className="profile-dialog border-antique-gold bg-warm-ivory dark:bg-heritage-forest sm:p-8">
      <p className="mb-6 text-sm text-stone-500">Make this space yours and set a daily learning goal.</p>
      <form onSubmit={handleSubmit} className="space-y-5 text-sm">
        <fieldset>
          <legend className={labelClass}>Profile badge</legend>
          <div className="profile-avatar-options flex items-center gap-2.5">
            {PRESET_AVATARS.map((preset) => (
              <button key={preset.label} type="button" aria-label={`Use ${preset.label} badge`} aria-pressed={avatar === preset.label} onClick={() => setAvatar(preset.label)} className={`size-11 rounded-full ${preset.bg} text-warm-ivory flex items-center justify-center border-2 ${avatar === preset.label ? 'border-antique-gold ring-2 ring-antique-gold/50' : 'border-transparent opacity-75 hover:opacity-100'}`}>
                {preset.label}
              </button>
            ))}
          </div>
        </fieldset>
        <div>
          <label htmlFor="profile-name" className={labelClass}>Full name</label>
          <input id="profile-name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" className={inputClass} required />
        </div>
        <div>
          <label htmlFor="profile-bio" className={labelClass}>About you</label>
          <textarea id="profile-bio" value={bio} onChange={(event) => setBio(event.target.value)} rows={3} placeholder="What inspires you to learn through Vietnamese culture?" className={inputClass} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="profile-daily-goal" className={labelClass}>Daily goal</label>
            <select id="profile-daily-goal" value={dailyMinutes} onChange={(event) => setDailyMinutes(Number(event.target.value))} className={inputClass}>
              {[10, 15, 30, 45].map((minutes) => <option key={minutes} value={minutes}>{minutes} min / day</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="profile-cefr" className={labelClass}>CEFR target</label>
            <select id="profile-cefr" value={targetCefr} onChange={(event) => setTargetCefr(event.target.value)} className={inputClass}>
              {!CEFR_OPTIONS.some((option) => option.value === targetCefr) && <option value={targetCefr}>{targetCefr}</option>}
              {CEFR_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </div>
        </div>
        <div className="profile-editor-actions pt-4 flex items-center justify-end gap-3 border-t border-antique-gold/30">
          <button type="button" onClick={onClose} className="px-4 py-2.5 border border-line text-ink-faint hover:bg-surface-muted">Cancel</button>
          <button type="submit" className="px-6 py-2.5 bg-heritage-green hover:bg-[#163731] text-warm-ivory shadow-md">Save changes</button>
        </div>
      </form>
    </Modal>
  );
};
