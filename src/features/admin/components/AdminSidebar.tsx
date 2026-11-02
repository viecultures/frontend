import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Map,
  BookOpen,
  Megaphone,
  Users,
  ShieldCheck,
  Landmark,
  Server,
  Activity,
  ChevronDown,
  Link,
  BarChart3,
  Mail,
  Share2,
} from 'lucide-react';
import { getLocalizedPath, resolveLanguage } from '@/routes/paths';

export interface AdminSidebarProps {
  postCount?: number;
  userCount?: number;
  onNavigate?: () => void;
}

interface MarketingSubItem {
  key: 'utm' | 'analytics' | 'broadcast' | 'social';
  label: string;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
  badge?: string;
}

interface NavItem {
  id: string;
  aliases?: string[];
  labelKey?: string;
  fallbackLabel: string;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
  badge?: string | number;
  hasSubItems?: boolean;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  postCount,
  userCount,
  onNavigate,
}) => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, tab } = useParams<{ lang?: string; tab?: string }>();
  const currentLang = resolveLanguage(lang);

  // Match current active tab key
  const activeTab = React.useMemo(() => {
    if (tab) return tab;
    const match = location.pathname.match(/\/admin\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : 'dashboard';
  }, [tab, location.pathname]);

  // Current sub-tab for marketing
  const activeMarketingSubTab = React.useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('tab') || 'utm';
  }, [location.search]);

  // Accordion open state for Marketing
  const [isMarketingOpen, setIsMarketingOpen] = useState<boolean>(activeTab === 'marketing');

  // Auto-expand marketing accordion when navigated to marketing tab
  useEffect(() => {
    if (activeTab === 'marketing') {
      setIsMarketingOpen(true);
    }
  }, [activeTab]);

  const marketingSubItems: MarketingSubItem[] = [
    {
      key: 'utm',
      label: 'Tạo link UTM (Nội bộ)',
      icon: Link,
    },
    {
      key: 'analytics',
      label: 'Google Analytics & Search Console',
      icon: BarChart3,
    },
    {
      key: 'broadcast',
      label: 'Email & Bản tin di sản',
      icon: Mail,
    },
    {
      key: 'social',
      label: 'Mạng xã hội & Ads (Sắp ra mắt)',
      icon: Share2,
      badge: 'Sớm',
    },
  ];

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      aliases: ['system_stats'],
      labelKey: 'tabs.overview',
      fallbackLabel: 'Tổng quan & Tăng trưởng',
      icon: LayoutDashboard,
    },
    {
      id: 'journeys',
      fallbackLabel: 'Hành trình học',
      icon: Map,
    },
    {
      id: 'posts',
      labelKey: 'tabs.posts',
      fallbackLabel: 'Kho Bài viết',
      icon: BookOpen,
      badge: postCount !== undefined && postCount > 0 ? postCount : undefined,
    },
    {
      id: 'marketing',
      fallbackLabel: 'Marketing & Đa kênh',
      icon: Megaphone,
      hasSubItems: true,
    },
    {
      id: 'users',
      labelKey: 'tabs.users',
      fallbackLabel: 'Học viên CRM',
      icon: Users,
      badge: userCount !== undefined && userCount > 0 ? userCount.toLocaleString('en-US') : undefined,
    },
    {
      id: 'system',
      aliases: ['logs'],
      fallbackLabel: 'Hệ thống & Kiểm duyệt',
      icon: ShieldCheck,
      badge: 'Kiểm toán',
    },
  ];

  const handleTabClick = (item: NavItem) => {
    if (item.id === 'marketing') {
      if (activeTab === 'marketing') {
        setIsMarketingOpen((prev) => !prev);
      } else {
        setIsMarketingOpen(true);
        navigate(`${getLocalizedPath('/admin/marketing', currentLang)}?tab=${activeMarketingSubTab}`);
        if (onNavigate) onNavigate();
      }
      return;
    }

    navigate(getLocalizedPath(`/admin/${item.id}`, currentLang));
    if (onNavigate) {
      onNavigate();
    }
  };

  const handleMarketingSubClick = (subKey: string) => {
    navigate(`${getLocalizedPath('/admin/marketing', currentLang)}?tab=${subKey}`);
    if (onNavigate) {
      onNavigate();
    }
  };

  const isItemActive = (item: NavItem): boolean => {
    if (activeTab === item.id) return true;
    if (item.aliases && item.aliases.includes(activeTab)) return true;
    return false;
  };

  return (
    <div
      className="w-[260px] shrink-0 bg-warm-ivory dark:bg-[#0f2420] flex flex-col justify-between p-4 min-h-full select-none transition-colors"
      role="navigation"
      aria-label="Thanh điều hướng quản trị phân hệ"
    >
      <div className="space-y-5">
        {/* ── Brand Identity Logo ───────────────────────────────────────── */}
        <div className="px-2 pt-1 pb-2 border-b border-[#E5DEC9] dark:border-antique-gold/20 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-heritage-green text-antique-gold border border-antique-gold/40 flex items-center justify-center shrink-0 shadow-xs">
            <Landmark aria-hidden="true" className="w-5 h-5 text-antique-gold" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-heading text-sm font-bold text-heritage-green dark:text-antique-bright tracking-tight truncate">
                VieCultures
              </span>
              <span className="px-1.5 py-0.2 rounded bg-antique-gold/20 text-heritage-green dark:text-antique-bright text-[9px] font-bold uppercase tracking-wider border border-antique-gold/30">
                Admin
              </span>
            </div>
            <p className="text-[11px] text-text-muted leading-tight truncate">
              Quản trị & Vận hành CMS
            </p>
          </div>
        </div>

        {/* ── Navigation Tabs ───────────────────────────────────────────── */}
        <div className="space-y-1">
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-text-muted">
            Phân hệ điều hành
          </div>
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const active = isItemActive(item);
              const Icon = item.icon;
              const label = item.labelKey ? t(item.labelKey, item.fallbackLabel) : item.fallbackLabel;

              return (
                <div key={item.id} className="space-y-1">
                  <button
                    type="button"
                    aria-current={active ? 'page' : undefined}
                    onClick={() => handleTabClick(item)}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-between cursor-pointer text-left group relative ${
                      active
                        ? 'bg-heritage-green text-warm-ivory shadow-sm border border-antique-gold/40'
                        : 'text-text-secondary hover:text-heritage-green dark:hover:text-antique-bright hover:bg-antique-gold/10 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {/* Active highlight dot */}
                      {active ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-antique-gold shrink-0 animate-pulse" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-transparent shrink-0" />
                      )}

                      <Icon
                        aria-hidden="true"
                        className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                          active
                            ? 'text-antique-gold'
                            : 'text-text-muted group-hover:text-heritage-green dark:group-hover:text-antique-bright'
                        }`}
                      />
                      <span className="truncate group-hover:translate-x-0.5 transition-transform duration-200">
                        {label}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {item.badge !== undefined && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 transition-colors ${
                            active
                              ? 'bg-antique-gold text-heritage-green'
                              : 'bg-rice-paper dark:bg-white/10 text-text-muted border border-[#E5DEC9] dark:border-white/10'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}

                      {item.hasSubItems && (
                        <ChevronDown
                          aria-hidden="true"
                          className={`w-3.5 h-3.5 transition-transform duration-200 ${
                            isMarketingOpen ? 'rotate-180 text-antique-gold' : 'text-text-muted'
                          }`}
                        />
                      )}
                    </div>
                  </button>

                  {/* Expandable Sub-items for Marketing */}
                  {item.hasSubItems && isMarketingOpen && (
                    <div className="pl-6 pr-1 py-1 space-y-1 border-l-2 border-antique-gold/30 ml-4 my-1">
                      {marketingSubItems.map((sub) => {
                        const SubIcon = sub.icon;
                        const isSubActive = active && activeMarketingSubTab === sub.key;

                        return (
                          <button
                            key={sub.key}
                            type="button"
                            onClick={() => handleMarketingSubClick(sub.key)}
                            className={`w-full px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all flex items-center justify-between cursor-pointer text-left group ${
                              isSubActive
                                ? 'bg-antique-gold/25 font-bold text-heritage-green dark:text-antique-bright border border-antique-gold/40'
                                : 'text-text-muted hover:text-heritage-green dark:hover:text-antique-bright hover:bg-antique-gold/10'
                            }`}
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <SubIcon
                                aria-hidden="true"
                                className={`w-3.5 h-3.5 shrink-0 ${
                                  isSubActive ? 'text-heritage-green dark:text-antique-bright' : 'text-text-muted group-hover:text-heritage-green'
                                }`}
                              />
                              <span className="truncate">{sub.label}</span>
                            </div>
                            {sub.badge && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-antique-gold/20 text-heritage-green dark:text-antique-bright border border-antique-gold/30">
                                {sub.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Footer Telemetry & Server Status Card ──────────────────────── */}
      <div className="pt-4 border-t border-[#E5DEC9] dark:border-antique-gold/20">
        <div className="p-3 rounded-xl bg-rice-paper/60 dark:bg-white/5 border border-[#E5DEC9] dark:border-antique-gold/20 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-text-body dark:text-warm-ivory">
            <div className="flex items-center gap-1.5">
              <Server aria-hidden="true" className="w-3.5 h-3.5 text-antique-gold shrink-0" />
              <span>Máy chủ API</span>
            </div>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-300 dark:border-emerald-700">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Sẵn sàng
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-text-muted pt-1 border-t border-[#E5DEC9]/60 dark:border-white/10">
            <span className="flex items-center gap-1">
              <Activity aria-hidden="true" className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>CSDL: Bình thường</span>
            </span>
            <span className="font-mono text-[10px] font-bold text-text-muted">
              99.9%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
