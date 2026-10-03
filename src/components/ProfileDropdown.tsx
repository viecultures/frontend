import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Settings, LogOut, ChevronRight, ExternalLink } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

interface ProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  user?: { name: string; email: string; avatar: string } | null;
  onLogout?: () => void;
  onNavigate?: (view: string) => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  isOpen,
  onClose,
  user,
  onLogout,
  onNavigate,
}) => {
  const { openSettings } = useSettings();
  const handleItemClick = (action?: () => void, view?: string) => {
    onClose();
    if (action) {
      action();
    } else if (view && onNavigate) {
      onNavigate(view);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Invisible backdrop to dismiss dropdown when clicking outside */}
          <div className="fixed inset-0 z-40 bg-transparent" onClick={onClose} />

          {/* Inline Dropdown Card attached directly underneath the avatar button */}
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full mt-2.5 w-64 bg-rice-paper dark:bg-heritage-forest border-2 border-antique-gold rounded-2xl p-3.5 shadow-[0_10px_35px_heritage-green/30] z-50 text-text-body dark:text-warm-ivory space-y-3"
          >
            {/* Header: User Info & Master Badges */}
            <div className="pb-3 border-b border-heritage-green/15 dark:border-white/10 space-y-2">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-heritage-green border border-antique-gold flex items-center justify-center shadow-sm shrink-0 overflow-hidden p-1">
                  {user?.avatar && (user.avatar.startsWith('http') || user.avatar.startsWith('/')) ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <img
                      src="/favicon/android-chrome-192x192.png"
                      alt="VieCulture Turtle Mascot Avatar"
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>

                <div className="overflow-hidden">
                  <h3 className="font-heading font-bold text-sm text-heritage-dark dark:text-warm-ivory tracking-tight truncate">
                    {user?.name || 'luanninh2005'}
                  </h3>
                  <p className="text-[11px] text-text-secondary dark:text-[#9FCED8] font-medium truncate">
                    {user?.email || 'student@viecultures.com'}
                  </p>
                </div>
              </div>

              {/* Badges adhering to Master Color System */}
              <div className="flex items-center gap-2 pt-0.5">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-mist text-heritage-dark border border-[#9FCED8]">
                  Starter
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-antique-bright text-heritage-dark border border-antique-gold">
                  👑 2 ngày Premium
                </span>
              </div>
            </div>

            {/* 3 Main Menu Items */}
            <div className="space-y-2">
              {/* 1. Hồ sơ cá nhân */}
              <motion.button
                whileHover={{ x: 2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleItemClick(undefined, 'home')}
                className="w-full px-3 py-2.5 rounded-xl bg-warm-ivory dark:bg-heritage-green/70 hover:bg-mist-cloud dark:hover:bg-heritage-green border border-heritage-green/15 dark:border-white/10 hover:border-antique-gold text-xs font-bold text-heritage-green dark:text-warm-ivory flex items-center justify-between transition-colors shadow-sm group cursor-pointer focus-ring"
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-antique-gold" />
                  <span>Hồ sơ cá nhân</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-heritage-green/40 dark:text-white/40 group-hover:translate-x-0.5 group-hover:text-antique-gold transition-all" />
              </motion.button>

              {/* 2. Cài đặt Trang chủ */}
              <motion.button
                whileHover={{ x: 2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleItemClick(openSettings)}
                className="w-full px-3 py-2.5 rounded-xl bg-warm-ivory dark:bg-heritage-green/70 hover:bg-mist-cloud dark:hover:bg-heritage-green border border-heritage-green/15 dark:border-white/10 hover:border-antique-gold text-xs font-bold text-heritage-green dark:text-warm-ivory flex items-center justify-between transition-colors shadow-sm group cursor-pointer focus-ring"
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-antique-gold" />
                  <span>Cài đặt Trang chủ</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-heritage-green/40 dark:text-white/40 group-hover:translate-x-0.5 group-hover:text-antique-gold transition-all" />
              </motion.button>
            </div>

            {/* 3. Đăng xuất */}
            <div className="pt-1.5 border-t border-heritage-green/15 dark:border-white/10">
              <motion.button
                whileHover={{ x: 2, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleItemClick(onLogout)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#E8B7B2]/30 hover:bg-[#E8B7B2]/50 dark:bg-rose-500/20 dark:hover:bg-rose-500/30 border border-[#E8B7B2] dark:border-rose-500/40 text-xs font-bold text-[#991B1B] dark:text-rose-200 flex items-center justify-between transition-colors group cursor-pointer focus-ring"
              >
                <div className="flex items-center gap-2">
                  <LogOut className="w-4 h-4 text-[#B91C1C] dark:text-rose-400" />
                  <span>Đăng xuất</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-[#B91C1C]/60 dark:text-rose-400/60 group-hover:translate-x-0.5 transition-all" />
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProfileDropdown;