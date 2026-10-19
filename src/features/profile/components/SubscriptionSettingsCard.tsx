import React from 'react';
import { Crown, Check, Zap, ShieldCheck, ArrowRight, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import type { UserProfileData } from '../types';

interface SubscriptionSettingsCardProps {
  profile: UserProfileData;
  onRefreshPro?: () => void;
}

export const SubscriptionSettingsCard: React.FC<SubscriptionSettingsCardProps> = ({
  profile,
  onRefreshPro,
}) => {
  return (
    <div className="space-y-6">
      {/* Current Plan Overview Card */}
      <div className="rounded-3xl bg-rice-paper dark:bg-heritage-forest border-2 border-antique-gold p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-antique-gold/30">
          <div className="profile-membership-header flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-heritage-green text-antique-gold border border-antique-gold flex items-center justify-center shadow-sm">
              <Crown aria-hidden="true" className="w-7 h-7 fill-current" />
            </div>
            <div>
              <div className="profile-membership-header flex items-center gap-2">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-heritage-green dark:text-warm-ivory">
                  {profile.isPro ? 'VieCultures Pro' : 'Free membership'}
                </h3>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    profile.isPro
                      ? 'bg-antique-gold text-heritage-forest'
                      : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {profile.isPro ? 'ACTIVE' : 'FREE'}
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                {profile.isPro
                  ? `Membership until: ${profile.proExpiresAt || '15/11/2026'}`
                  : 'Bilingual stories and core flashcard practice.'}
              </p>
            </div>
          </div>

          <div>
            {profile.isPro ? (
              <Link
                to={PATHS.pricing}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-heritage-green hover:bg-[#163731] text-warm-ivory text-xs font-bold transition-all shadow-sm cursor-pointer"
              >
                <span>Manage membership</span>
                <ArrowRight aria-hidden="true" className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <Link
                to={PATHS.pricing}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-antique-gold hover:bg-[#c9a75a] text-heritage-forest text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                <Zap aria-hidden="true" className="w-4 h-4 fill-current" />
                <span>Explore Pro · 39k/month</span>
              </Link>
            )}
          </div>
        </div>

        {/* Pro Privileges Matrix */}
        <div className="pt-6">
          <h4 className="font-bold text-xs uppercase tracking-wider text-heritage-green dark:text-antique-gold mb-3">
            Your plan includes
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="flex items-center gap-2.5 text-stone-700 dark:text-stone-200">
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Check aria-hidden="true" className="w-2.5 h-2.5" />
              </div>
              <span>Bilingual reading and audio at three speeds (0.5x, 0.8x, 1x)</span>
            </div>

            <div className="flex items-center gap-2.5 text-stone-700 dark:text-stone-200">
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Check aria-hidden="true" className="w-2.5 h-2.5" />
              </div>
              <span>Dictation and spaced-repetition flashcards</span>
            </div>

            <div className="flex items-center gap-2.5 text-stone-700 dark:text-stone-200">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                  profile.isPro
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : 'bg-stone-300 text-stone-500'
                }`}
              >
                <Check aria-hidden="true" className="w-2.5 h-2.5" />
              </div>
              <span>
                Gemini AI Cultural Companion {profile.isPro ? '(Unlimited)' : '(Up to 3 sessions/day)'}
              </span>
            </div>

            <div className="flex items-center gap-2.5 text-stone-700 dark:text-stone-200">
              <div
                className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                  profile.isPro
                    ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                    : 'bg-stone-300 text-stone-500'
                }`}
              >
                <Check aria-hidden="true" className="w-2.5 h-2.5" />
              </div>
              <span>
                Save vocabulary {profile.isPro ? '(Unlimited)' : '(Up to 30 words)'}
              </span>
            </div>
          </div>
        </div>

        {/* VietQR Reference Info */}
        {profile.isPro && (
          <div className="mt-6 pt-4 border-t border-antique-gold/20 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500 dark:text-stone-400 font-mono">
            <div className="flex items-center gap-2">
              <QrCode aria-hidden="true" className="w-4 h-4 text-antique-gold" />
              <span>VietQR reference: <strong>{profile.vietQrRefCode || 'VIE-PRO-889213'}</strong></span>
            </div>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">
              Payment confirmed
            </span>
          </div>
        )}
      </div>

      {/* Account Security & Password Card */}
      <SecuritySettingsCard />
    </div>
  );
};

const SecuritySettingsCard: React.FC = () => {
  return (
    <div className="rounded-3xl bg-rice-paper dark:bg-heritage-forest border-2 border-antique-gold/40 p-6 sm:p-8 shadow-md">
      <div className="flex items-center gap-3 pb-4 border-b border-antique-gold/30">
        <div className="w-10 h-10 rounded-xl bg-heritage-green text-antique-gold flex items-center justify-center">
          <ShieldCheck aria-hidden="true" className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-serif text-lg font-bold text-heritage-green dark:text-warm-ivory">
            Account security
          </h4>
          <p className="text-xs text-stone-500 dark:text-stone-400">
            Password changes are not connected yet. Your current sign-in method stays active.
          </p>
        </div>
      </div>

      <fieldset disabled className="pt-5 space-y-4 max-w-md text-xs sm:text-sm opacity-70">
        <div>
          <label htmlFor="profile-oldPassword" className="block text-[11px] font-bold text-heritage-green dark:text-antique-gold uppercase mb-1">
            Current password
          </label>
          <input
            type="password"
            id="profile-oldPassword"
            autoComplete="current-password"
            placeholder="Enter current password..."
            className="w-full px-3.5 py-2 rounded-xl bg-white/70 dark:bg-[#1A3D34] border border-antique-gold/40 text-heritage-green dark:text-warm-ivory focus:outline-none focus:ring-1 focus:ring-antique-gold"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="profile-newPassword" className="block text-[11px] font-bold text-heritage-green dark:text-antique-gold uppercase mb-1">
              New password
            </label>
            <input
              type="password"
              id="profile-newPassword"
              autoComplete="new-password"
              placeholder="At least 6 characters..."
              className="w-full px-3.5 py-2 rounded-xl bg-white/70 dark:bg-[#1A3D34] border border-antique-gold/40 text-heritage-green dark:text-warm-ivory focus:outline-none focus:ring-1 focus:ring-antique-gold"
            />
          </div>

          <div>
            <label htmlFor="profile-confirmPassword" className="block text-[11px] font-bold text-heritage-green dark:text-antique-gold uppercase mb-1">
              Confirm new password
            </label>
            <input
              type="password"
              id="profile-confirmPassword"
              autoComplete="new-password"
              placeholder="Repeat new password..."
              className="w-full px-3.5 py-2 rounded-xl bg-white/70 dark:bg-[#1A3D34] border border-antique-gold/40 text-heritage-green dark:text-warm-ivory focus:outline-none focus:ring-1 focus:ring-antique-gold"
            />
          </div>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-heritage-green text-warm-ivory text-xs font-bold shadow-sm"
        >
          <span>Update password</span>
        </button>
      </fieldset>
    </div>
  );
};

