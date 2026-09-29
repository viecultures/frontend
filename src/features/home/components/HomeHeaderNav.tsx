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
} from 'lucide-react';
import { ProfileDropdown } from '@/components/ProfileDropdown';
import { BrandLogo } from '@/components/BrandLogo';

interface HomeHeaderNavProps {
  isLoggedIn: boolean;
  user?: { name: string; email: string; avatar: string } | null;
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
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleActionToast = (msg: string) => {
    if (onShowToast) {
      onShowToast(msg);
    }
  };

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 flex items-center justify-between z-10">
      {/* Brand & Room Badge */}
      <BrandLogo
        size="md"
        theme="dark"
        badge="Phòng Học Văn Hóa"
        onClick={() => onNavigate('landing')}
        className="focus-ring rounded-xl"
      />

      {/* Header Icon Quick Links & Profile Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3 bg-heritage-dark/80 backdrop-blur-md p-1.5 rounded-full border border-white/15 shadow-xl">
        <button
          type="button"
          onClick={() => handleActionToast('Bạn có 2 bài ôn tập từ vựng mới hôm nay!')}
          className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-antique-gold transition-all relative cursor-pointer focus-ring"
          title="Thông báo"
          aria-label="Thông báo"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400" />
        </button>

        <button
          type="button"
          onClick={() => onNavigate('community-2')}
          className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-antique-gold transition-all cursor-pointer focus-ring"
          title="Thử thách & Bảng xếp hạng"
          aria-label="Thử thách"
        >
          <Trophy className="w-4 h-4 text-antique-rich" />
        </button>

        <button
          type="button"
          onClick={() => handleActionToast('Lịch học: Chuỗi 2 ngày đang được duy trì liên tục!')}
          className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-antique-gold transition-all cursor-pointer focus-ring"
          title="Lịch học"
          aria-label="Lịch học"
        >
          <Calendar className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onNavigate('community-2')}
          className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-antique-gold transition-all cursor-pointer focus-ring"
          title="Thống kê học tập"
          aria-label="Thống kê"
        >
          <BarChart3 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => handleActionToast('Heritage Shop: Đã mở khóa Huy hiệu Sứ Giả Cố Đô!')}
          className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-antique-gold transition-all cursor-pointer focus-ring"
          title="Heritage Shop"
          aria-label="Cửa hàng"
        >
          <ShoppingBag className="w-4 h-4" />
        </button>

        {isLoggedIn ? (
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                if (onOpenProfile) onOpenProfile();
              }}
              className="relative flex items-center justify-center w-8 h-8 rounded-full bg-heritage-green border border-antique-gold/60 shadow-lg hover:scale-105 active:scale-95 transition-all group overflow-hidden cursor-pointer focus-ring"
              title="Mở Profile Menu"
              aria-label="Menu cá nhân"
            >
              {user?.avatar && (user.avatar.startsWith('http') || user.avatar.startsWith('/')) ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
              ) : (
                <span className="text-xs font-bold text-antique-gold">
                  {user?.avatar || 'NL'}
                </span>
              )}
              <span className="absolute -top-0.5 -right-0.5 p-0.5 rounded-full bg-antique-gold text-heritage-dark shadow-xs">
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
            onClick={() => onNavigate('login')}
            className="flex items-center gap-1.5 pl-3 pr-3 py-1 bg-antique-gold text-heritage-dark rounded-full text-xs font-bold hover:brightness-105 transition-all shadow-sm cursor-pointer"
            title="Đăng nhập"
          >
            <User className="w-3.5 h-3.5" />
            <span>Đăng Nhập</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default HomeHeaderNav;
