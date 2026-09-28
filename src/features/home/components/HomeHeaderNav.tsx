import React, { useState } from 'react';
import {
  Bell,
  Trophy,
  Calendar,
  BarChart3,
  ShoppingBag,
  User,
} from 'lucide-react';
import { ProfileDropdown } from '@/components/ProfileDropdown';

interface HomeHeaderNavProps {
  isLoggedIn: boolean;
  user?: { name: string; email: string; avatar: string } | null;
  onLogout?: () => void;
  onNavigate: (view: string) => void;
  onOpenProfile?: () => void;
}

export const HomeHeaderNav: React.FC<HomeHeaderNavProps> = ({
  isLoggedIn,
  user,
  onLogout,
  onNavigate,
  onOpenProfile,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-6 flex items-center justify-between z-10">
      {/* Brand & Room Badge */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2 text-white font-heading font-bold text-lg hover:opacity-80 transition-opacity cursor-pointer"
          title="Quay về Trang chủ Landing"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-antique-bright to-antique-gold flex items-center justify-center text-heritage-forest shadow-md font-black text-sm">
            🪷
          </div>
          <span className="tracking-tight font-serif text-warm-ivory">VieCultures</span>
        </button>
        <div className="hidden sm:flex items-center gap-2 text-xs text-white/70 font-medium pl-2 border-l border-white/20">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Phòng Học Văn Hóa</span>
        </div>
      </div>

      {/* Header Icon Quick Links & Profile Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3 bg-heritage-forest/80 backdrop-blur-md p-1.5 rounded-full border border-white/15 shadow-lg">
        <button
          type="button"
          onClick={() => alert('Thông báo: Bạn có 2 bài ôn tập từ vựng mới hôm nay!')}
          className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-antique-bright transition-all relative cursor-pointer"
          title="Thông báo"
          aria-label="Thông báo"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400" />
        </button>

        <button
          type="button"
          onClick={() => onNavigate('community-2')}
          className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-antique-bright transition-all cursor-pointer"
          title="Thử thách & Bảng xếp hạng"
          aria-label="Thử thách"
        >
          <Trophy className="w-4 h-4 text-antique-rich" />
        </button>

        <button
          type="button"
          onClick={() => alert('Lịch học: Chuỗi 2 ngày đang được duy trì!')}
          className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-antique-bright transition-all cursor-pointer"
          title="Lịch học"
          aria-label="Lịch học"
        >
          <Calendar className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => onNavigate('community-2')}
          className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-antique-bright transition-all cursor-pointer"
          title="Thống kê học tập"
          aria-label="Thống kê"
        >
          <BarChart3 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => alert('Heritage Shop: Đã mở khóa Huy hiệu Sứ Giả!')}
          className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-antique-bright transition-all cursor-pointer"
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
              className="relative flex items-center justify-center w-8 h-8 rounded-full bg-heritage-green border border-antique-gold/60 shadow-lg hover:scale-105 active:scale-95 transition-all group overflow-hidden p-0.5 cursor-pointer"
              title="Mở Profile Menu"
              aria-label="Menu cá nhân"
            >
              {user?.avatar && (user.avatar.startsWith('http') || user.avatar.startsWith('/')) ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
              ) : (
                <span className="text-sm">🐢</span>
              )}
              <span className="absolute -top-1 -right-1 text-[10px] select-none">👑</span>
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
            className="flex items-center gap-1.5 pl-3 pr-3 py-1 bg-antique-bright text-heritage-forest rounded-full text-xs font-bold hover:brightness-105 transition-all shadow-sm cursor-pointer"
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
