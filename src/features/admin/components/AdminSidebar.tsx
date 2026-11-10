import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Map,
  BookOpen,
  Bookmark,
  Megaphone,
  Users,
  ShieldCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Link,
  BarChart3,
  Mail,
  CreditCard,
  Sliders,
  Globe,
  Cpu,
  History,
  Volume2,
  FileText,
  Bell,
  Zap,
} from 'lucide-react';
import { getLocalizedPath, resolveLanguage } from '@/routes/paths';

export interface AdminSidebarProps {
  postCount?: number;
  userCount?: number;
  onNavigate?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

interface ContentSubItem {
  key: 'posts' | 'journeys' | 'vocabularies';
  label: string;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
  badge?: string | number;
}

interface MarketingSubItem {
  key: 'overview' | 'newsletter' | 'automation' | 'notifications' | 'utm' | 'broadcast';
  label: string;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
  badge?: string;
}

interface SubscriptionSubItem {
  key: 'overview' | 'config';
  label: string;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;
}

interface AiSubItem {
  key: 'overview' | 'prompts' | 'providers' | 'tts' | 'logs';
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
  isCollapsed = false,
  onToggleCollapse,
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

  // Current sub-tab for content
  const activeContentSubTab = React.useMemo(() => {
    if (activeTab === 'posts') return 'posts';
    if (activeTab === 'journeys') return 'journeys';
    if (activeTab === 'vocabularies') return 'vocabularies';
    if (activeTab === 'content') {
      const params = new URLSearchParams(location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'journeys' || tabParam === 'vocabularies' || tabParam === 'posts') {
        return tabParam;
      }
    }
    return 'posts';
  }, [activeTab, location.search]);

  // Current sub-tab for marketing
  const activeMarketingSubTab = React.useMemo(() => {
    if (activeTab === 'marketing') {
      const params = new URLSearchParams(location.search);
      const tab = params.get('tab');
      if (tab === 'broadcast' || tab === 'newsletter') return 'newsletter';
      if (tab === 'automation') return 'automation';
      if (tab === 'notifications') return 'notifications';
      if (tab === 'utm') return 'utm';
      if (tab === 'overview') return 'overview';
      return 'overview';
    }
    return 'overview';
  }, [activeTab, location.search]);

  // Current sub-tab for subscriptions
  const activeSubscriptionSubTab = React.useMemo(() => {
    if (activeTab === 'subscriptions') {
      const params = new URLSearchParams(location.search);
      const tab = params.get('tab');
      if (tab === 'config' || tab === 'overview') {
        return tab;
      }
    }
    return 'overview';
  }, [activeTab, location.search]);

  // Current sub-tab for AI Studio
  const activeAiSubTab = React.useMemo(() => {
    if (activeTab === 'ai' || activeTab === 'ai_configs') {
      const match = location.pathname.match(/\/admin\/(?:ai|ai_configs)\/([a-zA-Z0-9_-]+)/);
      if (match && ['overview', 'prompts', 'providers', 'tts', 'logs'].includes(match[1])) {
        return match[1];
      }
      const params = new URLSearchParams(location.search);
      const sub = params.get('sub');
      if (sub && ['overview', 'prompts', 'providers', 'tts', 'logs'].includes(sub)) {
        return sub;
      }
    }
    return 'overview';
  }, [activeTab, location.pathname, location.search]);

  // Exclusive Accordion state: only one parent menu section can be expanded at a time
  const [expandedMenu, setExpandedMenu] = useState<string | null>(() => {
    if (
      activeTab === 'content' ||
      activeTab === 'posts' ||
      activeTab === 'journeys' ||
      activeTab === 'vocabularies'
    ) {
      return 'content';
    }
    if (activeTab === 'marketing') return 'marketing';
    if (activeTab === 'subscriptions') return 'subscriptions';
    if (activeTab === 'ai' || activeTab === 'ai_configs') return 'ai';
    return null;
  });

  const isContentOpen = expandedMenu === 'content';
  const isMarketingOpen = expandedMenu === 'marketing';
  const isSubscriptionsOpen = expandedMenu === 'subscriptions';
  const isAiOpen = expandedMenu === 'ai';

  // Automatically sync exclusive expanded menu when navigating between tabs
  useEffect(() => {
    if (
      activeTab === 'content' ||
      activeTab === 'posts' ||
      activeTab === 'journeys' ||
      activeTab === 'vocabularies'
    ) {
      setExpandedMenu('content');
    } else if (activeTab === 'marketing') {
      setExpandedMenu('marketing');
    } else if (activeTab === 'subscriptions') {
      setExpandedMenu('subscriptions');
    } else if (activeTab === 'ai' || activeTab === 'ai_configs') {
      setExpandedMenu('ai');
    } else {
      setExpandedMenu(null);
    }
  }, [activeTab]);

  const contentSubItems: ContentSubItem[] = [
    {
      key: 'posts',
      label: 'Kho Bài viết',
      icon: BookOpen,
      badge: postCount !== undefined && postCount > 0 ? postCount : undefined,
    },
    {
      key: 'journeys',
      label: 'Lộ trình học',
      icon: Map,
    },
    {
      key: 'vocabularies',
      label: 'Từ vựng & Thuật ngữ',
      icon: Bookmark,
    },
  ];

  const subscriptionSubItems: SubscriptionSubItem[] = [
    {
      key: 'overview',
      label: 'Tổng quan & Duyệt đơn',
      icon: BarChart3,
    },
    {
      key: 'config',
      label: 'Cấu hình gói cước',
      icon: Sliders,
    },
  ];

  const marketingSubItems: MarketingSubItem[] = [
    {
      key: 'overview',
      label: 'Tổng quan & Phễu',
      icon: BarChart3,
    },
    {
      key: 'newsletter',
      label: 'Bản tin Di sản & Email',
      icon: Mail,
    },
    {
      key: 'automation',
      label: 'Tự động hóa hành vi',
      icon: Zap,
    },
    {
      key: 'notifications',
      label: 'Quản lý thông báo',
      icon: Bell,
    },
    {
      key: 'utm',
      label: 'Link UTM & Mã QR',
      icon: Link,
    },
  ];

  const aiSubItems: AiSubItem[] = [
    {
      key: 'overview',
      label: 'Tổng quan & Chi phí',
      icon: BarChart3,
    },
    {
      key: 'prompts',
      label: 'Kho System Prompts',
      icon: FileText,
      badge: 'Studio',
    },
    {
      key: 'providers',
      label: 'Mô hình & Khóa API',
      icon: Cpu,
    },
    {
      key: 'tts',
      label: 'Giọng đọc & Phát âm TTS',
      icon: Volume2,
    },
    {
      key: 'logs',
      label: 'Nhật ký & Giám sát',
      icon: History,
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
      id: 'content',
      aliases: ['posts', 'journeys', 'vocabularies'],
      labelKey: 'tabs.content',
      fallbackLabel: 'Quản lý nội dung',
      icon: BookOpen,
      hasSubItems: true,
    },
    {
      id: 'marketing',
      fallbackLabel: 'Marketing & Đa kênh',
      icon: Megaphone,
      hasSubItems: true,
    },
    /* Tạm thời ẩn tab Google Analytics 4 theo yêu cầu
    {
      id: 'analytics',
      fallbackLabel: 'Google Analytics 4',
      icon: BarChart3,
      badge: 'GA4',
    },
    */
    {
      id: 'search_console',
      aliases: ['search-console'],
      fallbackLabel: 'Google Search Console',
      icon: Globe,
    },
    {
      id: 'subscriptions',
      fallbackLabel: 'Gói đăng ký & Doanh thu',
      icon: CreditCard,
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
      id: 'history',
      aliases: ['logs', 'system'],
      fallbackLabel: 'Nhật ký & Lịch sử',
      icon: History,
    },
    {
      id: 'ai_configs',
      aliases: ['ai', 'ai-configs'],
      fallbackLabel: 'AI Studio & Hạ tầng',
      icon: Cpu,
      hasSubItems: true,
    },
  ];

  const handleTabClick = (item: NavItem) => {
    if (item.id === 'content') {
      if (isCollapsed) {
        navigate(`${getLocalizedPath('/admin/content', currentLang)}?tab=${activeContentSubTab}`);
        if (onNavigate) onNavigate();
        return;
      }
      if (
        activeTab === 'content' ||
        activeTab === 'posts' ||
        activeTab === 'journeys' ||
        activeTab === 'vocabularies'
      ) {
        setExpandedMenu((prev) => (prev === 'content' ? null : 'content'));
      } else {
        setExpandedMenu('content');
        navigate(`${getLocalizedPath('/admin/content', currentLang)}?tab=${activeContentSubTab}`);
        if (onNavigate) onNavigate();
      }
      return;
    }

    if (item.id === 'marketing') {
      if (isCollapsed) {
        navigate(`${getLocalizedPath('/admin/marketing', currentLang)}?tab=${activeMarketingSubTab}`);
        if (onNavigate) onNavigate();
        return;
      }
      if (activeTab === 'marketing') {
        setExpandedMenu((prev) => (prev === 'marketing' ? null : 'marketing'));
      } else {
        setExpandedMenu('marketing');
        navigate(`${getLocalizedPath('/admin/marketing', currentLang)}?tab=${activeMarketingSubTab}`);
        if (onNavigate) onNavigate();
      }
      return;
    }

    if (item.id === 'subscriptions') {
      if (isCollapsed) {
        navigate(`${getLocalizedPath('/admin/subscriptions', currentLang)}?tab=${activeSubscriptionSubTab}`);
        if (onNavigate) onNavigate();
        return;
      }
      if (activeTab === 'subscriptions') {
        setExpandedMenu((prev) => (prev === 'subscriptions' ? null : 'subscriptions'));
      } else {
        setExpandedMenu('subscriptions');
        navigate(`${getLocalizedPath('/admin/subscriptions', currentLang)}?tab=${activeSubscriptionSubTab}`);
        if (onNavigate) onNavigate();
      }
      return;
    }

    if (item.id === 'ai_configs' || item.id === 'ai') {
      if (isCollapsed) {
        navigate(getLocalizedPath(`/admin/ai/${activeAiSubTab}`, currentLang));
        if (onNavigate) onNavigate();
        return;
      }
      if (activeTab === 'ai_configs' || activeTab === 'ai') {
        setExpandedMenu((prev) => (prev === 'ai' ? null : 'ai'));
      } else {
        setExpandedMenu('ai');
        navigate(getLocalizedPath(`/admin/ai/${activeAiSubTab}`, currentLang));
        if (onNavigate) onNavigate();
      }
      return;
    }

    // Khi chọn các mục khác không có menu con: tự động thu gọn các mục lớn
    setExpandedMenu(null);

    if (item.id === 'search_console') {
      navigate(getLocalizedPath('/admin/search-console', currentLang));
      if (onNavigate) {
        onNavigate();
      }
      return;
    }

    navigate(getLocalizedPath(`/admin/${item.id}`, currentLang));
    if (onNavigate) {
      onNavigate();
    }
  };

  const handleContentSubClick = (subKey: string) => {
    navigate(`${getLocalizedPath('/admin/content', currentLang)}?tab=${subKey}`);
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

  const handleAiSubClick = (subKey: string) => {
    navigate(getLocalizedPath(`/admin/ai/${subKey}`, currentLang));
    if (onNavigate) {
      onNavigate();
    }
  };

  const handleSubscriptionSubClick = (subKey: string) => {
    navigate(`${getLocalizedPath('/admin/subscriptions', currentLang)}?tab=${subKey}`);
    if (onNavigate) {
      onNavigate();
    }
  };

  const isItemActive = (item: NavItem): boolean => {
    if (activeTab === item.id) return true;
    if (item.aliases && item.aliases.includes(activeTab)) return true;
    if (item.id === 'search_console' && (activeTab === 'search_console' || activeTab === 'search-console')) return true;
    return false;
  };

  return (
    <div
      className={`w-full shrink-0 bg-warm-ivory dark:bg-[#0f2420] flex flex-col justify-between min-h-full select-none transition-colors ${
        isCollapsed ? 'p-2 items-center' : 'p-3.5 sm:p-4'
      }`}
      role="navigation"
      aria-label="Thanh điều hướng quản trị phân hệ"
    >
      <div className={`w-full ${isCollapsed ? 'space-y-3' : 'space-y-4'}`}>
        {/* ── Navigation Tabs ───────────────────────────────────────────── */}
        <div className="space-y-1 w-full">
          {!isCollapsed && (
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-text-muted">
              Phân hệ điều hành
            </div>
          )}
          <div className={`flex flex-col gap-1 w-full ${isCollapsed ? 'items-center' : ''}`}>
            {navItems.map((item) => {
              const active = isItemActive(item);
              const Icon = item.icon;
              const label = item.labelKey ? t(item.labelKey, item.fallbackLabel) : item.fallbackLabel;

              return (
                <div key={item.id} className={isCollapsed ? 'w-auto' : 'space-y-1 w-full'}>
                  <button
                    type="button"
                    aria-current={active ? 'page' : undefined}
                    onClick={() => handleTabClick(item)}
                    title={label}
                    aria-label={label}
                    className={`rounded-xl text-xs font-semibold transition-all flex items-center cursor-pointer relative group ${
                      isCollapsed
                        ? 'w-11 h-11 justify-center'
                        : 'w-full px-3 py-2.5 justify-between text-left'
                    } ${
                      active
                        ? 'bg-heritage-green text-warm-ivory shadow-sm border border-antique-gold/40'
                        : 'text-text-secondary hover:text-heritage-green dark:hover:text-antique-bright hover:bg-antique-gold/10 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className={`flex items-center min-w-0 ${isCollapsed ? 'justify-center' : 'gap-2.5'}`}>
                      {/* Active highlight dot */}
                      {!isCollapsed && (
                        active ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-antique-gold shrink-0 animate-pulse" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-transparent shrink-0" />
                        )
                      )}

                      <Icon
                        aria-hidden="true"
                        className={`shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                          isCollapsed ? 'w-5 h-5' : 'w-4 h-4'
                        } ${
                          active
                            ? 'text-antique-gold'
                            : 'text-text-muted group-hover:text-heritage-green dark:group-hover:text-antique-bright'
                        }`}
                      />
                      {!isCollapsed && (
                        <span className="truncate group-hover:translate-x-0.5 transition-transform duration-200">
                          {label}
                        </span>
                      )}
                    </div>

                    {!isCollapsed && (
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
                              (item.id === 'content' && isContentOpen) ||
                              (item.id === 'marketing' && isMarketingOpen) ||
                              (item.id === 'subscriptions' && isSubscriptionsOpen) ||
                              ((item.id === 'ai_configs' || item.id === 'ai') && isAiOpen)
                                ? 'rotate-180 text-antique-gold'
                                : 'text-text-muted'
                            }`}
                          />
                        )}
                      </div>
                    )}

                    {/* Indicator badge for icon-only mode */}
                    {isCollapsed && item.badge !== undefined && (
                      <span
                        className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-antique-gold border border-white dark:border-[#0f2420]"
                        aria-hidden="true"
                      />
                    )}
                  </button>

                  {/* Expandable Sub-items for Content */}
                  {!isCollapsed && item.id === 'content' && item.hasSubItems && isContentOpen && (
                    <div className="pl-6 pr-1 py-1 space-y-1 border-l-2 border-antique-gold/30 ml-4 my-1">
                      {contentSubItems.map((sub) => {
                        const SubIcon = sub.icon;
                        const isSubActive =
                          activeTab === 'content'
                            ? activeContentSubTab === sub.key
                            : activeTab === sub.key;

                        return (
                          <button
                            key={sub.key}
                            type="button"
                            onClick={() => handleContentSubClick(sub.key)}
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
                                  isSubActive
                                    ? 'text-heritage-green dark:text-antique-bright'
                                    : 'text-text-muted group-hover:text-heritage-green'
                                }`}
                              />
                              <span className="truncate">{sub.label}</span>
                            </div>
                            {sub.badge !== undefined && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-antique-gold/20 text-heritage-green dark:text-antique-bright border border-antique-gold/30">
                                {sub.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Expandable Sub-items for Marketing */}
                  {!isCollapsed && item.id === 'marketing' && item.hasSubItems && isMarketingOpen && (
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

                  {/* Expandable Sub-items for Subscriptions */}
                  {!isCollapsed && item.id === 'subscriptions' && item.hasSubItems && isSubscriptionsOpen && (
                    <div className="pl-6 pr-1 py-1 space-y-1 border-l-2 border-antique-gold/30 ml-4 my-1">
                      {subscriptionSubItems.map((sub) => {
                        const SubIcon = sub.icon;
                        const isSubActive = active && activeSubscriptionSubTab === sub.key;

                        return (
                          <button
                            key={sub.key}
                            type="button"
                            onClick={() => handleSubscriptionSubClick(sub.key)}
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
                                  isSubActive
                                    ? 'text-heritage-green dark:text-antique-bright'
                                    : 'text-text-muted group-hover:text-heritage-green'
                                }`}
                              />
                              <span className="truncate">{sub.label}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Expandable Sub-items for AI Studio */}
                  {!isCollapsed && (item.id === 'ai_configs' || item.id === 'ai') && item.hasSubItems && isAiOpen && (
                    <div className="pl-6 pr-1 py-1 space-y-1 border-l-2 border-antique-gold/30 ml-4 my-1">
                      {aiSubItems.map((sub) => {
                        const SubIcon = sub.icon;
                        const isSubActive = (activeTab === 'ai' || activeTab === 'ai_configs') && activeAiSubTab === sub.key;

                        return (
                          <button
                            key={sub.key}
                            type="button"
                            onClick={() => handleAiSubClick(sub.key)}
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
                                  isSubActive
                                    ? 'text-heritage-green dark:text-antique-bright'
                                    : 'text-text-muted group-hover:text-heritage-green'
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

      {/* ── Toggle Collapse/Expand Button (Desktop) ─────────────────────────── */}
      {onToggleCollapse && (
        <div className={`pt-3 mt-4 border-t border-[#E5DEC9] dark:border-antique-gold/20 flex ${isCollapsed ? 'justify-center' : 'justify-end'}`}>
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Mở rộng menu' : 'Thu gọn menu còn mỗi icon'}
            title={isCollapsed ? 'Mở rộng menu' : 'Thu gọn menu còn mỗi icon'}
            className="p-2 rounded-xl text-text-muted hover:text-heritage-green dark:hover:text-warm-ivory hover:bg-antique-gold/15 transition-colors cursor-pointer flex items-center gap-2"
          >
            {isCollapsed ? (
              <ChevronRight aria-hidden="true" className="w-4 h-4 text-antique-gold" />
            ) : (
              <>
                <span className="text-[11px] font-medium">Thu gọn</span>
                <ChevronLeft aria-hidden="true" className="w-4 h-4 text-antique-gold" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminSidebar;
