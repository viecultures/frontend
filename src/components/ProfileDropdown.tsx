import React from 'react';
import { User, Settings, LogOut, ChevronRight, ExternalLink } from 'lucide-react';

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
  if (!isOpen) return null;

  const handleItemClick = (action?: () => void, view?: string) => {
    onClose();
    if (action) {
      action();
    } else if (view && onNavigate) {
      onNavigate(view);
    }
  };

  return (
    <>
      {/* Invisible backdrop to dismiss dropdown when clicking outside (no blur, no dimming) */}
      <div className="fixed inset-0 z-40 bg-transparent" onClick={onClose} />

      {/* Inline Dropdown Card attached directly underneath the avatar button */}
      <div className="absolute right-0 top-full mt-2.5 w-64 bg-[#F6EEDC] dark:bg-[#122A22] border-2 border-[#D9B76A] rounded-2xl p-3.5 shadow-[0_10px_35px_rgba(30,75,67,0.3)] z-50 text-[#3F5550] dark:text-[#FBF7EE] space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
        {/* Header: User Info & Master Badges */}
        <div className="pb-3 border-b border-[#1E4B43]/15 dark:border-white/10 space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#1E4B43] border border-[#D9B76A] flex items-center justify-center text-lg shadow-sm shrink-0 text-[#FBF7EE]">
              {user?.avatar || '🐢'}
            </div>
            <div className="overflow-hidden">
              <h3 className="font-heading font-bold text-sm text-[#163D37] dark:text-[#FBF7EE] tracking-tight truncate">
                {user?.name || 'luanninh2005'}
              </h3>
              <p className="text-[11px] text-[#6E7E79] dark:text-[#9FCED8] font-medium truncate">
                {user?.email || 'student@viecultures.com'}
              </p>
            </div>
          </div>

          {/* Badges adhering to Master Color System */}
          <div className="flex items-center gap-2 pt-0.5">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#BFE3EA] text-[#163D37] border border-[#9FCED8]">
              Starter
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FCE5B5] text-[#163D37] border border-[#D9B76A]">
              👑 2 ngày Premium
            </span>
          </div>
        </div>

        {/* 3 Main Menu Items */}
        <div className="space-y-2">
          {/* 1. Hồ sơ cá nhân */}
          <button
            onClick={() => handleItemClick(undefined, 'home')}
            className="w-full px-3 py-2.5 rounded-xl bg-[#FBF7EE] dark:bg-[#1E4B43]/70 hover:bg-[#E8DFCB] dark:hover:bg-[#1E4B43] border border-[#1E4B43]/15 dark:border-white/10 hover:border-[#D9B76A] text-xs font-bold text-[#1E4B43] dark:text-[#FBF7EE] flex items-center justify-between transition-all shadow-sm group"
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#D9B76A]" />
              <span>Hồ sơ cá nhân</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#1E4B43]/40 dark:text-white/40 group-hover:translate-x-0.5 group-hover:text-[#D9B76A] transition-all" />
          </button>

          {/* 2. Cài đặt */}
          <button
            onClick={() => handleItemClick(() => alert('Cài đặt tài khoản đang được hoàn thiện!'))}
            className="w-full px-3 py-2.5 rounded-xl bg-[#FBF7EE] dark:bg-[#1E4B43]/70 hover:bg-[#E8DFCB] dark:hover:bg-[#1E4B43] border border-[#1E4B43]/15 dark:border-white/10 hover:border-[#D9B76A] text-xs font-bold text-[#1E4B43] dark:text-[#FBF7EE] flex items-center justify-between transition-all shadow-sm group"
          >
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#D9B76A]" />
              <span>Cài đặt</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#1E4B43]/40 dark:text-white/40 group-hover:translate-x-0.5 group-hover:text-[#D9B76A] transition-all" />
          </button>
        </div>

        {/* 3. Đăng xuất */}
        <div className="pt-1.5 border-t border-[#1E4B43]/15 dark:border-white/10">
          <button
            onClick={() => handleItemClick(onLogout)}
            className="w-full px-3 py-2.5 rounded-xl bg-[#E8B7B2]/30 hover:bg-[#E8B7B2]/50 dark:bg-rose-500/20 dark:hover:bg-rose-500/30 border border-[#E8B7B2] dark:border-rose-500/40 text-xs font-bold text-[#991B1B] dark:text-rose-200 flex items-center justify-between transition-all group"
          >
            <div className="flex items-center gap-2">
              <LogOut className="w-4 h-4 text-[#B91C1C] dark:text-rose-400" />
              <span>Đăng xuất</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-[#B91C1C]/60 dark:text-rose-400/60 group-hover:translate-x-0.5 transition-all" />
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfileDropdown;
