import React, { useState } from 'react';
import {
  Bell,
  Trophy,
  Calendar,
  BarChart3,
  ShoppingBag,
  User,
  Sparkles,
  Crown,
  Settings,
} from 'lucide-react';
import { ProfileDropdown } from '@/components/ProfileDropdown';
import { BrandLogo } from '@/components/BrandLogo';
import { useSettings } from '@/context/SettingsContext';

import { PATHS } from '@/routes/paths';
import type { AppUser } from '@/utils/auth-storage';

interface HomeHeaderNavProps {
  isLoggedIn: boolean;
  user?: AppUser | null;
  onLogout?: () => void;
  onNavigate: (view: string) => void;
  onOpenProfile?: () => void;
  onShowToast?: (message: string) => void;
}

export const HomeHeaderNav: React.FC<HomeHeaderNavProps> = ({
  isLoggedIn,
  user,
  onLogout,
  onNavigate,
  onOpenProfile,
  onShowToast,
}) => {
  const { openSettings } = useSettings();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleActionToast = (msg: string) => {
    if (onShowToast) {
      onShowToast(msg);
    }
  };

  return (
    <div className="home-classic-header max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 flex items-center justify-between z-10">
      {/* Brand & Room Badge */}
      <BrandLogo
        size="md"
        theme="dark"
        badge="Culture study room"
        onClick={() => onNavigate(PATHS.landing)}
        className="focus-ring rounded-xl"
      />

      {/* Header Icon Quick Links & Profile Dropdown */}
      <div className="home-classic-header-tools flex items-center gap-2 sm:gap-3 bg-heritage-dark/80 backdrop-blur-md p-1.5 rounded-2xl border border-white/15 shadow-xl">
        <button
          type="button"
          onClick={() => handleActionToast('You have 2 vocabulary reviews today.')}
          className="p-2 rounded-xl hover:bg-white/10 text-warm-ivory/90 hover:text-antique-gold transition-all relative cursor-pointer focus-ring"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-xl bg-antique-gold" />
        </button>

        <button
          type="button"
          onClick={() => onNavigate(PATHS.communityContest)}
          className="p-2 rounded-xl hover:bg-white/10 text-warm-ivory/90 hover:text-antique-gold transition-all cursor-pointer focus-ring"
          title="Challenges & leaderboard"
          aria-label="Challenges"
        >
          <Trophy className="w-4 h-4 text-antique-rich" />
        </button>

        <button
          type="button"
          onClick={() => handleActionToast('Study schedule: your 2-day streak is active.')}
          className="p-2 rounded-xl hover:bg-white/10 text-warm-ivory/90 hover:text-antique-gold transition-all cursor-pointer focus-ring"
          title="Study schedule"
          aria-label="Study schedule"
        >
          <Calendar className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onNavigate(PATHS.communityContest)}
          className="p-2 rounded-xl hover:bg-white/10 text-warm-ivory/90 hover:text-antique-gold transition-all cursor-pointer focus-ring"
          title="Study statistics"
          aria-label="Statistics"
        >
          <BarChart3 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => handleActionToast('Heritage Shop: Imperial City Explorer badge unlocked!')}
          className="p-2 rounded-xl hover:bg-white/10 text-warm-ivory/90 hover:text-antique-gold transition-all cursor-pointer focus-ring"
          title="Heritage Shop"
          aria-label="Shop"
        >
          <ShoppingBag className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={openSettings}
          className="p-2 rounded-xl hover:bg-white/10 text-warm-ivory/90 hover:text-antique-gold transition-all cursor-pointer focus-ring"
          title="Room settings (colours & background)"
          aria-label="Room settings"
        >
          <Settings className="w-4 h-4" />
        </button>

        {isLoggedIn ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-heritage-green border border-antique-gold/60 shadow-lg hover:scale-105 active:scale-95 transition-all group overflow-hidden cursor-pointer focus-ring"
              title="Account menu"
              aria-label="Account menu"
              aria-expanded={isProfileOpen}
              aria-haspopup="menu"
            >
              {user?.avatar && (user.avatar.startsWith('http') || user.avatar.startsWith('/')) ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <span className="text-xs font-bold text-antique-gold">
                  {user?.avatar || 'NL'}
                </span>
              )}
              <span className="absolute -top-0.5 -right-0.5 p-0.5 rounded-xl bg-antique-gold text-heritage-dark shadow-xs">
                <Crown className="w-2.5 h-2.5 fill-current" />
              </span>
            </button>

            <ProfileDropdown
              isOpen={isProfileOpen}
              onClose={() => setIsProfileOpen(false)}
              user={user}
              onLogout={onLogout}
              onNavigate={onNavigate}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onNavigate(PATHS.login)}
            className="flex items-center gap-1.5 pl-3 pr-3 py-1 bg-antique-gold text-heritage-dark rounded-xl text-xs font-bold hover:brightness-105 transition-all shadow-sm cursor-pointer"
            title="Sign in"
          >
            <User className="w-3.5 h-3.5" />
            <span>Sign in</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default HomeHeaderNav;
