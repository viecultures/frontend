import React from 'react';
import { Crown, Edit3, ShieldCheck, Sparkles, MapPin, Target, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PATHS } from '@/routes/paths';
import type { UserProfileData } from '../types';

interface ProfileHeaderCardProps {
  profile: UserProfileData;
  onOpenEdit: () => void;
}

export const ProfileHeaderCard: React.FC<ProfileHeaderCardProps> = ({
  profile,
  onOpenEdit,
}) => {
  return (
    <div className="relative w-full rounded-3xl bg-[#F6EEDC] dark:bg-[#122A22] border-2 border-[#D9B76A]/40 p-6 sm:p-8 shadow-md overflow-hidden transition-all">
      {/* Decorative Traditional Watermark Corner Pattern */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-[#D9B76A]/10 to-transparent pointer-events-none rounded-bl-full" />
      <div className="absolute top-3 left-4 text-[#D9B76A]/30 text-xs font-serif select-none pointer-events-none">
        ❖ DI SẢN BẢO CHỨNG ❖
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
        {/* Avatar with Imperial Gold Ring */}
        <div className="relative shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#1E4B43] border-4 border-[#D9B76A] shadow-xl flex items-center justify-center overflow-hidden p-1">
            {profile.avatar && (profile.avatar.startsWith('http') || profile.avatar.startsWith('/')) ? (
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="font-serif font-bold text-3xl sm:text-4xl text-[#D9B76A]">
                {profile.avatar || 'NL'}
              </span>
            )}
          </div>

          {/* Pro / Level Badge Pill */}
          {profile.isPro ? (
            <span
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#D9B76A] text-[#122A22] text-[10px] sm:text-xs font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-md whitespace-nowrap"
              title="Hội viên Pro đang hoạt động"
            >
              <Crown className="w-3 h-3 fill-current" />
              <span>PRO MEMBER</span>
            </span>
          ) : (
            <span
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-stone-300 dark:bg-stone-700 text-stone-700 dark:text-stone-300 text-[10px] font-bold uppercase tracking-wider shadow-sm whitespace-nowrap"
            >
              FREE TIER
            </span>
          )}
        </div>

        {/* User Information */}
        <div className="flex-1 text-center md:text-left space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1E4B43] dark:text-[#FBF7EE] tracking-tight">
                  {profile.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#1E4B43]/10 dark:bg-[#D9B76A]/15 text-[#1E4B43] dark:text-[#D9B76A] border border-[#D9B76A]/40">
                  {profile.currentLevel}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 font-mono mt-0.5">
                {profile.email}
              </p>
            </div>

            {/* Edit Profile Action */}
            <button
              type="button"
              onClick={onOpenEdit}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-white/70 dark:bg-[#1A3D34] hover:bg-white dark:hover:bg-[#1E4B43] border border-[#D9B76A]/60 text-xs font-bold text-[#1E4B43] dark:text-[#D9B76A] shadow-sm hover:shadow transition-all cursor-pointer focus-ring"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Chỉnh sửa hồ sơ</span>
            </button>
          </div>

          {/* Bio / Motivation */}
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed font-sans max-w-2xl">
            {profile.bio}
          </p>

          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-1 text-xs">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/60 dark:bg-black/20 border border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-300">
              <Target className="w-3.5 h-3.5 text-[#D9B76A]" />
              <span>Mục tiêu: {profile.targetCefr}</span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/60 dark:bg-black/20 border border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-300">
              <Calendar className="w-3.5 h-3.5 text-[#D9B76A]" />
              <span>Gia nhập: {profile.joinedAt}</span>
            </div>

            {!profile.isPro && (
              <Link
                to={PATHS.pricing}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#D9B76A]/20 hover:bg-[#D9B76A]/30 border border-[#D9B76A] text-[#1E4B43] dark:text-[#D9B76A] font-bold transition-all cursor-pointer"
              >
                <Crown className="w-3.5 h-3.5 text-[#D9B76A]" />
                <span>Nâng cấp Pro (39k/tháng)</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
