import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  User as UserIcon,
  Menu,
  LogOut,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { getStoredUser, clearAuthStorage, type AppUser } from '@/utils/auth-storage';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { getLocalizedPath, resolveLanguage, PATHS } from '@/routes/paths';

export interface AdminTopbarProps {
  onSearch?: (query: string) => void;
  onToggleSidebar?: () => void;
}

export const AdminTopbar: React.FC<AdminTopbarProps> = ({ onSearch, onToggleSidebar }) => {
  const { t } = useTranslation('admin');
  const location = useLocation();
  const navigate = useNavigate();
  const { lang, tab } = useParams<{ lang?: string; tab?: string }>();
  const currentLang = resolveLanguage(lang);

  const [user, setUser] = useState<AppUser | null>(() => getStoredUser());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Sync auth state when session changes
  useEffect(() => {
    const handleAuthChange = () => {
      setUser(getStoredUser());
    };
    window.addEventListener('auth:change', handleAuthChange);
    return () => window.removeEventListener('auth:change', handleAuthChange);
  }, []);

  // Close dropdown menu on outside click or Escape
  useEffect(() => {
    if (!isDropdownOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isDropdownOpen]);

  // Determine current active sub-domain label for breadcrumbs
  const currentTab = useMemo(() => {
    if (tab) return tab;
    const match = location.pathname.match(/\/admin\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : 'dashboard';
  }, [tab, location.pathname]);

  const activeContentSubTab = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('tab') || 'posts';
  }, [location.search]);

  const isContentSection = currentTab === 'content';

  const getContentSubLabel = (subTabName: string): string => {
    switch (subTabName) {
      case 'journeys':
        return 'Lộ trình học di sản';
      case 'vocabularies':
        return 'Từ vựng & Thuật ngữ';
      default:
        return 'Kho Bài viết';
    }
  };

  const getSubsystemLabel = (tabName: string): string => {
    switch (tabName) {
      case 'dashboard':
      case 'system_stats':
        return t('tabs.overview', 'Tổng quan & Tăng trưởng');
      case 'journeys':
        return 'Lộ trình học di sản';
      case 'posts':
        return t('tabs.posts', 'Kho Bài viết');
      case 'vocabularies':
        return 'Từ vựng & Thuật ngữ';
      case 'marketing':
        return 'Marketing & Đa kênh';
      case 'subscriptions':
        return 'Gói đăng ký & Doanh thu';
      case 'users':
        return t('tabs.users', 'Học viên CRM');
      case 'analytics':
        return 'Google Analytics';
      case 'search_console':
      case 'search-console':
        return 'Google Search Console';
      case 'ai_configs':
      case 'ai':
        return 'Cấu hình AI & Chi phí';
      case 'history':
      case 'system':
      case 'logs':
        return 'Nhật ký & Lịch sử';
      default:
        return 'Bảng điều khiển';
    }
  };

  const handleLogout = () => {
    clearAuthStorage();
    setIsDropdownOpen(false);
    navigate(getLocalizedPath(PATHS.login, currentLang));
  };

  const adminName = user?.name || user?.email?.split('@')[0] || 'Quản trị viên';
  const adminEmail = user?.email || 'admin@viecultures.vn';
  const adminInitial = adminName.charAt(0).toUpperCase();

  return (
    <header className="admin-topbar sticky top-0 z-30 h-14 w-full bg-warm-ivory dark:bg-[#0f2420] border-b border-[#E5DEC9] dark:border-antique-gold/20 backdrop-blur-md px-3 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 transition-colors">
      {/* ── Left Area: Breadcrumbs ────────────────────────────────────── */}
      <nav aria-label="Đường dẫn điều hướng" className="flex items-center gap-1.5 sm:gap-2 min-w-0">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Mở menu quản trị"
            className="lg:hidden p-1.5 rounded-lg border border-[#E5DEC9] dark:border-antique-gold/30 hover:bg-antique-gold/15 text-heritage-green dark:text-warm-ivory cursor-pointer transition-colors"
          >
            <Menu aria-hidden="true" className="w-4 h-4" />
          </button>
        )}

        <Link
          to={getLocalizedPath(PATHS.admin, currentLang)}
          className="flex items-center gap-1.5 text-xs font-semibold text-heritage-green dark:text-antique-bright hover:underline shrink-0"
        >
          <ShieldCheck aria-hidden="true" className="w-4 h-4 text-antique-gold" />
          <span className="hidden sm:inline">Admin</span>
        </Link>

        <ChevronRight aria-hidden="true" className="w-3.5 h-3.5 text-text-muted shrink-0" />

        {isContentSection ? (
          <>
            <span className="text-xs font-medium text-text-muted hidden md:inline">
              Quản lý nội dung
            </span>
            <ChevronRight aria-hidden="true" className="w-3.5 h-3.5 text-text-muted shrink-0 hidden md:inline" />
            <span className="text-xs font-bold text-heritage-green dark:text-antique-bright truncate max-w-[140px] sm:max-w-none">
              {getContentSubLabel(activeContentSubTab)}
            </span>
          </>
        ) : (
          <span className="text-xs font-bold text-text-body dark:text-warm-ivory truncate max-w-[140px] sm:max-w-none">
            {getSubsystemLabel(currentTab)}
          </span>
        )}
      </nav>

      {/* ── Right Area: Learner Switch, i18n, Admin Profile Dropdown ──── */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Switch to Learner View Button */}
        <button
          type="button"
          onClick={() => navigate(getLocalizedPath(PATHS.discovery, currentLang))}
          aria-label="Xem trang Học viên"
          title="Xem trang Học viên (Chuyển sang giao diện người học)"
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#E5DEC9] dark:border-antique-gold/30 bg-rice-paper/60 dark:bg-white/5 hover:bg-antique-gold/15 text-xs font-semibold text-heritage-green dark:text-warm-ivory transition-all cursor-pointer shadow-2xs hover:border-antique-gold/50"
        >
          <span className="hidden sm:inline">Xem trang Học viên</span>
          <ExternalLink aria-hidden="true" className="w-3.5 h-3.5 text-antique-gold" />
        </button>

        {/* Compact i18n Language Switcher */}
        <div className="shrink-0">
          <LanguageSwitcher variant="compact" />
        </div>

        {/* Admin Identity with Click Dropdown */}
        <div className="relative pl-1 sm:pl-2 border-l border-[#E5DEC9] dark:border-antique-gold/20" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
            aria-label="Tài khoản quản trị viên và cài đặt"
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-antique-gold/15 transition-all cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-heritage-green text-warm-ivory flex items-center justify-center text-xs font-bold border border-antique-gold/40 shadow-2xs overflow-hidden shrink-0">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={adminName}
                  className="w-full h-full object-cover"
                />
              ) : adminInitial ? (
                <span>{adminInitial}</span>
              ) : (
                <UserIcon aria-hidden="true" className="w-3.5 h-3.5" />
              )}
            </div>

            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-bold text-text-body dark:text-warm-ivory leading-tight truncate max-w-[110px]">
                {adminName}
              </span>
              <span className="text-[10px] font-semibold text-antique-gold uppercase tracking-wider">
                Quản trị viên
              </span>
            </div>

            <ChevronDown
              aria-hidden="true"
              className={`w-3.5 h-3.5 text-text-muted transition-transform duration-200 hidden sm:block ${
                isDropdownOpen ? 'rotate-180 text-heritage-green dark:text-antique-gold' : ''
              }`}
            />
          </button>

          {/* User Dropdown Menu */}
          {isDropdownOpen && (
            <div
              role="menu"
              aria-orientation="vertical"
              className="absolute right-0 mt-2 w-64 rounded-2xl bg-warm-ivory dark:bg-[#122A22] border border-[#E5DEC9] dark:border-antique-gold/30 shadow-xl py-2 z-50 text-text-body dark:text-warm-ivory transition-all animate-fadeIn"
            >
              {/* User summary card header */}
              <div className="px-4 py-3 border-b border-[#E5DEC9] dark:border-antique-gold/20 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-heritage-green text-warm-ivory flex items-center justify-center text-sm font-bold border border-antique-gold/40 shrink-0">
                  {adminInitial}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold truncate text-text-body dark:text-warm-ivory">
                    {adminName}
                  </p>
                  <p className="text-[11px] text-text-muted truncate">
                    {adminEmail}
                  </p>
                  <div className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Quản trị viên</span>
                  </div>
                </div>
              </div>

              {/* Navigation items */}
              <div className="py-1">
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate(getLocalizedPath(PATHS.profile, currentLang));
                  }}
                  className="w-full px-4 py-2 text-xs font-medium flex items-center gap-2.5 hover:bg-antique-gold/15 text-text-body dark:text-warm-ivory cursor-pointer transition-colors"
                >
                  <UserIcon aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                  <span>Hồ sơ cá nhân</span>
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate(getLocalizedPath(PATHS.discovery, currentLang));
                  }}
                  className="w-full px-4 py-2 text-xs font-medium flex items-center gap-2.5 hover:bg-antique-gold/15 text-text-body dark:text-warm-ivory cursor-pointer transition-colors"
                >
                  <ExternalLink aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                  <span>Xem trang Học viên</span>
                </button>

                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate(getLocalizedPath('/admin/system', currentLang));
                  }}
                  className="w-full px-4 py-2 text-xs font-medium flex items-center gap-2.5 hover:bg-antique-gold/15 text-text-body dark:text-warm-ivory cursor-pointer transition-colors"
                >
                  <ShieldCheck aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                  <span>Hệ thống & Kiểm duyệt</span>
                </button>
              </div>

              {/* Logout button */}
              <div className="pt-1 mt-1 border-t border-[#E5DEC9] dark:border-antique-gold/20">
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-2.5 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-colors"
                >
                  <LogOut aria-hidden="true" className="w-4 h-4" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
