import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, MotionConfig } from 'motion/react';
import {
  BookOpen,
  Plus,
  Search,
  Trash2,
  Edit3,
  Eye,
  RefreshCw,
  MapPin,
  Layers,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  X,
  Users,
  BarChart3,
  ShieldCheck,
  Compass,
  LayoutDashboard,
  Megaphone,
  FileText,
  Type,
  Volume2,
  HelpCircle,
  Send,
  Filter,
  AlertTriangle,
  ArrowRight,
  CreditCard,
  Bookmark,
  Globe,
  Cpu,
  History,
} from 'lucide-react';
import type { ReadingPostItem, CefrLevel } from '../types/adminTypes';
import { postAdminService, type PostFilterParams } from '../services/postAdminService';
import { adminUserService } from '../services/adminUserService';
import { adminOverviewService, type AdminOverviewStats } from '../services/adminOverviewService';
import { PostFormModal } from '../components/PostFormModal';
import { UserManagementView } from '../components/UserManagementView';
import { JourneyManagementView } from '../components/JourneyManagementView';
import { VocabManagementView } from '../components/VocabManagementView';
import { PostVocabDrawer } from '../components/PostVocabDrawer';
import { AdminActivityLogView } from '../components/AdminActivityLogView';
import { MarketingManagementView } from '../components/MarketingManagementView';
import { SubscriptionManagementView } from '../components/subscriptions/SubscriptionManagementView';
import { GoogleAnalyticsView } from '../components/google/GoogleAnalyticsView';
import { GoogleSearchConsoleView } from '../components/google/GoogleSearchConsoleView';
import { PostPreviewModal } from '../components/PostPreviewModal';
import { AdminDialog } from '../components/AdminDialog';
import { AdminServiceConnections } from '../components/AdminServiceConnections';
import { AiConfigManagementView } from '../components/ai/AiConfigManagementView';
import { adminTopicLabel, adminRegionLabel, adminReadTimeLabel } from '../admin-presentation';
import { getLocalizedPath, resolveLanguage } from '@/routes/paths';
import '../admin-ui.css';

export type AdminTab =
  | 'dashboard'
  | 'content'
  | 'journeys'
  | 'posts'
  | 'vocabularies'
  | 'marketing'
  | 'subscriptions'
  | 'users'
  | 'history'
  | 'system'
  | 'logs'
  | 'system_stats'
  | 'analytics'
  | 'search_console'
  | 'ai_configs'
  | 'ai';

const VALID_TABS: (AdminTab | 'search-console')[] = [
  'dashboard',
  'content',
  'journeys',
  'posts',
  'vocabularies',
  'marketing',
  'subscriptions',
  'users',
  'history',
  'system',
  'logs',
  'system_stats',
  'analytics',
  'search_console',
  'search-console',
  'ai_configs',
  'ai',
];

export const AdminPage: React.FC = () => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, tab } = useParams<{ lang?: string; tab?: string }>();
  const currentLang = resolveLanguage(lang);

  const activeTab: AdminTab = useMemo(() => {
    let rawTab = tab;
    if (!rawTab) {
      const match = location.pathname.match(/\/admin\/([a-zA-Z0-9_-]+)/);
      if (match) rawTab = match[1];
    }
    if (rawTab === 'search-console' || rawTab === 'search_console') {
      return 'search_console';
    }
    // Tạm thời ẩn /admin/analytics -> chuyển hướng logic sang dashboard
    if (rawTab === 'analytics') {
      return 'dashboard';
    }
    if (rawTab === 'history' || rawTab === 'logs' || rawTab === 'system') {
      return 'history';
    }
    if (rawTab && (VALID_TABS as string[]).includes(rawTab)) {
      return rawTab as AdminTab;
    }
    return 'dashboard';
  }, [tab, location.pathname]);

  const activeContentSubTab = useMemo(() => {
    const params = new URLSearchParams(location.search);
    const subTab = params.get('tab');
    if (subTab === 'journeys' || subTab === 'vocabularies') {
      return subTab;
    }
    return 'posts';
  }, [location.search]);

  // When visiting /admin or /:lang/admin without subpath, redirect to /admin/dashboard
  useEffect(() => {
    const stripped = location.pathname.replace(/^\/(vi|en)(\/|$)/, '/');
    if (stripped === '/admin' || stripped === '/admin/' || stripped === '/admin/analytics' || stripped === '/admin/analytics/') {
      navigate(getLocalizedPath('/admin/dashboard', currentLang), { replace: true });
    }
  }, [location.pathname, currentLang, navigate]);

  // Redirect invalid content subtabs (such as ?tab=config) to ?tab=posts
  useEffect(() => {
    if (activeTab === 'content') {
      const params = new URLSearchParams(location.search);
      const rawSub = params.get('tab');
      if (rawSub && !['posts', 'journeys', 'vocabularies'].includes(rawSub)) {
        params.set('tab', 'posts');
        navigate(`${location.pathname}?${params.toString()}`, { replace: true });
      }
    }
  }, [activeTab, location.pathname, location.search, navigate]);

  // Posts State
  const [posts, setPosts] = useState<ReadingPostItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasLoadedPosts, setHasLoadedPosts] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Filters for Posts
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [standaloneFilter, setStandaloneFilter] = useState<'all' | 'standalone' | 'journey'>('all');
  const [postStatusFilter, setPostStatusFilter] = useState<'all' | 'published' | 'draft' | 'missing_materials'>('all');

  // Modals state for Posts
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<ReadingPostItem | null>(null);
  const [previewPost, setPreviewPost] = useState<ReadingPostItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Active Journey filter from URL parameter (?journeyId=...)
  const activeJourneyFilter = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('journeyId') || '';
  }, [location.search]);

  // Quick Vocab Drawer state
  const [vocabDrawerPost, setVocabDrawerPost] = useState<ReadingPostItem | null>(null);

  // System Overview State
  const [overviewStats, setOverviewStats] = useState<AdminOverviewStats | null>(null);
  const [isOverviewLoading, setIsOverviewLoading] = useState(false);
  const [totalUsersCount, setTotalUsersCount] = useState<number | null>(null);

  // Fetch overview stats from backend
  const fetchOverview = useCallback(async () => {
    setIsOverviewLoading(true);
    try {
      const data = await adminOverviewService.getOverview();
      setOverviewStats(data);
      if (data.totalUsers !== undefined) {
        setTotalUsersCount(data.totalUsers);
      }
    } catch (err: unknown) {
      console.warn('Lỗi khi tải thống kê tổng quan:', err);
    } finally {
      setIsOverviewLoading(false);
    }
  }, []);

  // Fetch posts from API
  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const params: PostFilterParams = {};
      if (searchQuery.trim()) params.query = searchQuery.trim();
      if (selectedLevel) params.level = selectedLevel;
      if (selectedRegion) params.region = selectedRegion;
      if (selectedTopic) params.topic = selectedTopic;
      if (standaloneFilter === 'standalone') params.standalone = true;
      if (standaloneFilter === 'journey') params.standalone = false;
      if (activeJourneyFilter) params.journeyId = activeJourneyFilter;

      const data = await postAdminService.getPosts(params);
      setPosts(data);
      setHasLoadedPosts(true);
    } catch (err: unknown) {
      setHasLoadedPosts(false);
      console.error('Lỗi tải bài viết:', err);
      setErrorMsg((err instanceof Error ? err.message : '') || t('messages.load_error'));
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedLevel, selectedRegion, selectedTopic, standaloneFilter, activeJourneyFilter, t]);

  // Fetch total users fallback if overview not called
  const fetchTotalUsers = useCallback(async () => {
    try {
      const res = await adminUserService.getUsers({ size: 1 });
      setTotalUsersCount(res.totalElements || 0);
    } catch (e) {
      console.warn('Không thể lấy tổng số user cho thống kê:', e);
    }
  }, []);

  useEffect(() => {
    if (
      activeTab === 'posts' ||
      (activeTab === 'content' && activeContentSubTab === 'posts') ||
      activeTab === 'dashboard' ||
      activeTab === 'system_stats'
    ) {
      fetchPosts();
    }
  }, [activeTab, activeContentSubTab, fetchPosts]);

  useEffect(() => {
    if (activeTab === 'dashboard' || activeTab === 'system_stats') {
      fetchOverview();
    }
    fetchTotalUsers();
  }, [activeTab, fetchOverview, fetchTotalUsers]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPosts();
  };

  // Open Create Page
  const handleOpenCreate = () => {
    navigate(getLocalizedPath('/admin/posts/new', currentLang));
  };

  // Open Edit Page
  const handleOpenEdit = (post: ReadingPostItem) => {
    navigate(getLocalizedPath(`/admin/posts/${post.id}/edit`, currentLang));
  };

  // Open Preview Modal
  const handleOpenPreview = async (post: ReadingPostItem) => {
    try {
      const full = await postAdminService.getPostById(post.id);
      setPreviewPost(full);
    } catch {
      setPreviewPost(post);
    }
  };

  // Quick filter to posts tab by CEFR Level
  const handleQuickFilterCefr = (lvl: string) => {
    setSelectedLevel(lvl);
    navigate(getLocalizedPath('/admin/posts', currentLang));
  };

  // Quick filter to posts tab by Region
  const handleQuickFilterRegion = (regionKey: string) => {
    setSelectedRegion(regionKey);
    navigate(getLocalizedPath('/admin/posts', currentLang));
  };

  // Confirm and Delete Post
  const handleConfirmDelete = async () => {
    if (!deletingId) return;
    try {
      await postAdminService.deletePost(deletingId);
      setPosts((prev) => prev.filter((p) => p.id !== deletingId));
      setSuccessToast(t('messages.post_deleted'));
      setTimeout(() => setSuccessToast(null), 3000);
    } catch (err: unknown) {
      setErrorMsg((err instanceof Error ? err.message : '') || t('messages.delete_error'));
    } finally {
      setDeletingId(null);
    }
  };

  // Callback on post saved
  const handlePostSaved = () => {
    fetchPosts();
    setSuccessToast(t('messages.post_saved'));
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Calculate local stats from loaded posts
  const postStats = useMemo(() => {
    const totalPosts = posts.length;
    const totalReads = posts.reduce((acc, p) => acc + (p.totalReads || 0), 0);
    const totalWords = posts.reduce((acc, p) => acc + (p.wordCount || 0), 0);
    const avgReads = totalPosts > 0 ? totalReads / totalPosts : 0;
    const publishedCount = posts.filter((p) =>
      Boolean((p.paragraphs && p.paragraphs.length > 0) || (p.wordCount && p.wordCount > 0))
    ).length;

    const levelsCount: Record<string, number> = {};
    const regionsCount: Record<string, number> = {};

    posts.forEach((p) => {
      if (p.level) levelsCount[p.level] = (levelsCount[p.level] || 0) + 1;
      if (p.region) regionsCount[p.region] = (regionsCount[p.region] || 0) + 1;
    });

    return { totalPosts, totalReads, totalWords, avgReads, publishedCount, levelsCount, regionsCount };
  }, [posts]);

  // Articles needing attention (published or registered but missing paragraphs, audio, or quiz)
  const attentionPosts = useMemo(() => {
    return posts.filter((post) => {
      const hasParagraphs = Boolean(
        (post.paragraphs && post.paragraphs.length > 0) ||
        (post.wordCount && post.wordCount > 0)
      );
      const hasAudio = Boolean(post.audioTracks || post.shadowingAudioUrl);
      const quizCount = post.questionCount ?? (Array.isArray(post.questions) ? post.questions.length : 0);
      const hasQuiz = quizCount > 0;
      return !hasParagraphs || !hasAudio || !hasQuiz;
    });
  }, [posts]);

  // Filtered posts based on material readiness / publication status
  const displayedPosts = useMemo(() => {
    return posts.filter((post) => {
      if (activeJourneyFilter && post.journeyId !== activeJourneyFilter) {
        return false;
      }
      const hasParagraphs = Boolean(
        (post.paragraphs && post.paragraphs.length > 0) ||
        (post.wordCount && post.wordCount > 0)
      );
      const hasAudio = Boolean(post.audioTracks || post.shadowingAudioUrl);
      const hasVocab = Boolean((post.vocabCount && post.vocabCount > 0) || (post.vocabularies && post.vocabularies.length > 0));
      const quizQuestions = post.questions || [];
      const hasQuiz = Array.isArray(quizQuestions) && quizQuestions.length > 0;

      if (postStatusFilter === 'published') {
        return hasParagraphs;
      }
      if (postStatusFilter === 'draft') {
        return !hasParagraphs;
      }
      if (postStatusFilter === 'missing_materials') {
        return !hasAudio || !hasVocab || !hasQuiz || !hasParagraphs;
      }
      return true;
    });
  }, [posts, postStatusFilter, activeJourneyFilter]);

  // Level Badge Color Helper
  const getLevelBadgeClass = (lvl?: CefrLevel) => {
    switch (lvl) {
      case 'A1':
      case 'A2':
        return 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border-emerald-300';
      case 'B1':
        return 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border-amber-300';
      case 'B2':
      case 'C1':
      case 'C2':
        return 'bg-rose-100 dark:bg-rose-900/40 text-rose-800 dark:text-rose-300 border-rose-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-300';
    }
  };

  // Header Title and Action configuration
  const headerConfig = useMemo(() => {
    switch (activeTab) {
      case 'dashboard':
      case 'system_stats':
        return {
          icon: LayoutDashboard,
          title: 'Tổng quan & Tăng trưởng hệ thống',
          subtitle: 'Giám sát chỉ số vận hành CMS, độ phủ văn hóa và tăng trưởng học viên',
          badge: 'Vận hành trực tiếp',
        };
      case 'content':
        if (activeContentSubTab === 'journeys') {
          return {
            icon: Compass,
            title: 'Quản lý lộ trình học di sản',
            subtitle: 'Thiết lập lộ trình học tập văn hóa từng bước và quản lý trạm di sản',
            badge: 'Lộ trình di sản',
          };
        }
        if (activeContentSubTab === 'vocabularies') {
          return {
            icon: Bookmark,
            title: 'Từ vựng & Thuật ngữ hệ thống',
            subtitle: 'Quản lý từ vựng văn hóa, định nghĩa song ngữ, phát âm và mức độ đọc hiểu CEFR',
            badge: 'Từ vựng hệ thống',
          };
        }
        return {
          icon: BookOpen,
          title: t('header.title', 'Kho Bài viết & Biên soạn học liệu'),
          subtitle: t('header.subtitle', 'Biên tập bài đọc song ngữ, phân cấp CEFR và trích xuất từ vựng'),
          badge: `${posts.length} bài viết`,
        };
      case 'journeys':
        return {
          icon: Compass,
          title: 'Quản lý lộ trình học di sản',
          subtitle: 'Thiết lập lộ trình học tập văn hóa từng bước và quản lý trạm di sản',
          badge: 'Lộ trình di sản',
        };
      case 'posts':
        return {
          icon: BookOpen,
          title: t('header.title', 'Kho Bài viết & Biên soạn học liệu'),
          subtitle: t('header.subtitle', 'Biên tập bài đọc song ngữ, phân cấp CEFR và trích xuất từ vựng'),
          badge: `${posts.length} bài viết`,
        };
      case 'vocabularies':
        return {
          icon: Bookmark,
          title: 'Từ vựng & Thuật ngữ hệ thống',
          subtitle: 'Quản lý từ vựng văn hóa, định nghĩa song ngữ, phát âm và mức độ đọc hiểu CEFR',
          badge: 'Từ vựng hệ thống',
        };
      case 'marketing':
        return {
          icon: Megaphone,
          title: 'Marketing & Đa kênh phân phối',
          subtitle: 'Chiến dịch truyền thông, email định kỳ và kích hoạt học viên đa nền tảng',
          badge: 'Đa kênh',
        };
      case 'subscriptions':
        return {
          icon: CreditCard,
          title: 'Gói đăng ký & Doanh thu',
          subtitle: 'Quản trị gói cước hội viên, phê duyệt đơn nạp chuyển khoản và giám sát doanh thu',
          badge: 'Gói đăng ký',
        };
      case 'users':
        return {
          icon: Users,
          title: 'Quản trị học viên & Phân quyền',
          subtitle: 'Quản lý phân quyền tài khoản và theo dõi tiến độ học tập trên toàn nền tảng',
          badge: totalUsersCount ? `${totalUsersCount.toLocaleString('en-US')} học viên` : 'Học viên CRM',
        };
      case 'analytics':
        return {
          icon: BarChart3,
          title: 'Google Analytics 4 (GA4)',
          subtitle: 'Giám sát tương tác học liệu di sản, phiên truy cập và độc giả thời gian thực',
          badge: 'Property: 561849201',
        };
      case 'search_console':
        return {
          icon: Globe,
          title: 'Google Search Console',
          subtitle: 'Giám sát thứ hạng từ khóa văn hóa, lượt hiển thị và nhấp chuột trên Google Search',
          badge: '',
        };
      case 'history':
      case 'system':
      case 'logs':
        return {
          icon: History,
          title: 'Nhật ký kiểm toán & Giám sát hệ thống',
          subtitle: 'Theo dõi thao tác quản trị, truy cập và kiểm toán thay đổi dữ liệu an ninh',
          badge: 'Kiểm toán',
        };
      case 'ai_configs':
      case 'ai':
        return {
          icon: Cpu,
          title: 'Cấu hình AI & Giám sát Chi phí',
          subtitle: 'Quản lý API Key đa kênh (Gemini, Azure Speech), điều phối xoay vòng và theo dõi ngân sách thời gian thực',
          badge: 'AI Metering',
        };
      default:
        return {
          icon: LayoutDashboard,
          title: 'Bảng điều khiển quản trị',
          subtitle: 'Trung tâm điều hành VieCultures',
          badge: 'Quản trị viên',
        };
    }
  }, [activeTab, activeContentSubTab, posts.length, totalUsersCount, t]);

  const HeaderIcon = headerConfig.icon;

  return (
    <MotionConfig reducedMotion="user">
      <div className="admin-ui w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* ── Compact Page Header (Height <= 68px) ────────────────────────── */}
        <div className="admin-compact-header min-h-[56px] max-h-[68px] h-[64px] rounded-2xl bg-heritage-green text-warm-ivory px-4 sm:px-6 shadow-md border border-antique-gold/40 flex items-center justify-between gap-3 transition-all">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-antique-gold/20 border border-antique-gold/40 flex items-center justify-center shrink-0 text-antique-bright">
              <HeaderIcon aria-hidden="true" className="w-4 h-4" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="font-heading text-sm sm:text-base font-bold tracking-tight truncate">
                  {headerConfig.title}
                </h1>
                {headerConfig.badge ? (
                  <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-antique-gold/20 text-antique-bright text-[10px] font-bold border border-antique-gold/30 shrink-0">
                    {headerConfig.badge}
                  </span>
                ) : null}
              </div>
              <p className="text-[11px] text-warm-ivory/80 truncate hidden md:block">
                {headerConfig.subtitle}
              </p>
            </div>
          </div>

          {/* Contextual Actions in Header */}
          <div className="flex items-center gap-2 shrink-0">
            {(activeTab === 'dashboard' || activeTab === 'system_stats') && (
              <button
                type="button"
                onClick={fetchOverview}
                disabled={isOverviewLoading}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-antique-gold/30 text-xs font-semibold text-warm-ivory flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                title="Tải lại thống kê tổng quan"
              >
                <RefreshCw aria-hidden="true" className={`w-3.5 h-3.5 ${isOverviewLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Tải lại chỉ số</span>
              </button>
            )}

            {(activeTab === 'posts' || (activeTab === 'content' && activeContentSubTab === 'posts')) && (
              <>
                <button
                  type="button"
                  onClick={fetchPosts}
                  disabled={isLoading}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-antique-gold/30 text-xs font-semibold text-warm-ivory flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  title={t('header.refresh_articles')}
                >
                  <RefreshCw aria-hidden="true" className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">{t('header.refresh_articles')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenCreate}
                  className="px-3.5 py-1.5 rounded-xl bg-antique-gold text-heritage-dark hover:bg-antique-bright text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <Plus aria-hidden="true" className="w-4 h-4" />
                  <span>{t('header.new_article')}</span>
                </button>
              </>
            )}

            {activeTab === 'subscriptions' && (
              <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-antique-gold/30 text-xs font-semibold text-warm-ivory flex items-center gap-1.5">
                <CreditCard aria-hidden="true" className="w-3.5 h-3.5 text-antique-gold" />
                <span className="hidden sm:inline">Phân hệ Doanh thu</span>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-antique-gold/30 text-xs font-semibold text-warm-ivory flex items-center gap-1.5">
                <ShieldCheck aria-hidden="true" className="w-3.5 h-3.5 text-antique-gold" />
                <span className="hidden sm:inline">{t('header.admin_access')}</span>
              </div>
            )}

            {(activeTab === 'history' || activeTab === 'system' || activeTab === 'logs') && (
              <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-antique-gold/30 text-xs font-semibold text-warm-ivory flex items-center gap-1.5">
                <History aria-hidden="true" className="w-3.5 h-3.5 text-antique-gold" />
                <span className="hidden sm:inline">Nhật ký & Lịch sử</span>
              </div>
            )}
          </div>
        </div>

        {/* Alerts & Toasts */}
        {errorMsg && (
          <div role="alert" className="p-4 rounded-2xl bg-rose-100 dark:bg-rose-900/30 border border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle aria-hidden="true" className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
              <span>{errorMsg}</span>
            </div>
            <button
              type="button"
              onClick={() => setErrorMsg(null)}
              className="font-bold underline cursor-pointer"
            >
              Đóng
            </button>
          </div>
        )}

        {successToast && (
          <div role="status" className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 aria-hidden="true" className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{successToast}</span>
            </div>
            <button
              type="button"
              onClick={() => setSuccessToast(null)}
              className="font-bold underline cursor-pointer"
            >
              Đóng
            </button>
          </div>
        )}

        {/* ── TAB 1: TỔNG QUAN & TĂNG TRƯỞNG (DASHBOARD / SYSTEM_STATS) ────── */}
        {(activeTab === 'dashboard' || activeTab === 'system_stats') && (
          <div className="space-y-6">
            {/* Top KPI Metric Cards (Row 1) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-text-muted text-xs">
                  <span>{t('stats.registered_users', 'Tổng số tài khoản')}</span>
                  <Users aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                </div>
                <div className="text-3xl font-heading font-bold text-heritage-green dark:text-antique-bright">
                  {(overviewStats?.totalUsers ?? totalUsersCount)?.toLocaleString('en-US') ?? '—'}
                </div>
                <p className="text-[11px] text-text-secondary">{t('stats.users_desc', 'Tổng học viên đăng ký trên hệ thống')}</p>
              </div>

              <div className="p-5 rounded-3xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-text-muted text-xs">
                  <span>Học viên hoạt động tuần</span>
                  <TrendingUp aria-hidden="true" className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-3xl font-heading font-bold text-emerald-700 dark:text-emerald-400">
                  {overviewStats ? overviewStats.activeLearnersWeek.toLocaleString('en-US') : '—'}
                </div>
                <p className="text-[11px] text-text-secondary">Tương tác và làm bài trong 7 ngày qua</p>
              </div>

              <div className="p-5 rounded-3xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-text-muted text-xs">
                  <span>Lượt đọc tích lũy & Tỷ lệ</span>
                  <BarChart3 aria-hidden="true" className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-3xl font-heading font-bold text-amber-700 dark:text-antique-gold">
                  {(overviewStats?.totalReads ?? postStats.totalReads).toLocaleString('en-US')}
                </div>
                <p className="text-[11px] text-text-secondary">
                  Bình quân{' '}
                  <span className="font-mono font-bold text-heritage-green dark:text-antique-bright">
                    {(overviewStats?.avgReadsPerPost !== undefined
                      ? overviewStats.avgReadsPerPost
                      : postStats.totalPosts > 0
                      ? postStats.totalReads / postStats.totalPosts
                      : 0
                    ).toFixed(2)}
                  </span>{' '}
                  lượt/bài
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-text-muted text-xs">
                  <span>Độ phủ học liệu đã xuất bản</span>
                  <BookOpen aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                </div>
                <div className="text-3xl font-heading font-bold text-heritage-green dark:text-antique-bright">
                  {overviewStats?.publishedPosts ?? postStats.publishedCount} / {overviewStats?.totalPosts ?? postStats.totalPosts}
                </div>
                <p className="text-[11px] text-text-secondary">
                  {Math.round(
                    ((overviewStats?.publishedPosts ?? postStats.publishedCount) /
                      Math.max(1, overviewStats?.totalPosts ?? postStats.totalPosts)) *
                      100
                  )}
                  % bài viết sẵn sàng phục vụ học tập
                </p>
              </div>
            </div>

            {/* Row 2: Funnel (Left) and Distributions (Right) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Funnel: Col 1-6 */}
              <div className="lg:col-span-6 p-6 rounded-3xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-5 h-full flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-antique-gold/20 pb-3 mb-4">
                    <div>
                      <h3 className="font-heading font-bold text-base text-heritage-green dark:text-antique-bright flex items-center gap-2">
                        <Filter aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                        <span>Phễu chuyển đổi học viên 4 chặng</span>
                      </h3>
                      <p className="text-xs text-text-muted mt-0.5">
                        Theo dõi hiệu suất từng bước trong hành trình khám phá và gắn kết di sản
                      </p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-antique-gold/20 text-heritage-green dark:text-antique-bright border border-antique-gold/30">
                      Toàn nền tảng
                    </span>
                  </div>

                  {/* 4 Funnel Stages */}
                  {(() => {
                    const realTotalPosts = overviewStats?.totalPosts ?? postStats.totalPosts ?? 0;
                    const realPublishedPosts = overviewStats?.publishedPosts ?? postStats.publishedCount ?? 0;
                    const realTotalReads = overviewStats?.totalReads ?? postStats.totalReads ?? 0;
                    const realTotalUsers = overviewStats?.totalUsers ?? totalUsersCount ?? 0;
                    const realActiveLearnersWeek = overviewStats?.activeLearnersWeek ?? 0;

                    const publishedPct = realTotalPosts > 0 ? Math.round((realPublishedPosts / realTotalPosts) * 100) : 0;
                    const userConvPct = realTotalReads > 0 ? Math.min(100, Math.round((realTotalUsers / realTotalReads) * 100)) : (realTotalUsers > 0 ? 100 : 0);
                    const retentionPct = realTotalUsers > 0 ? Math.min(100, Math.round((realActiveLearnersWeek / realTotalUsers) * 100)) : 0;
                    const overallActiveRate = realTotalUsers > 0 ? ((realActiveLearnersWeek / realTotalUsers) * 100).toFixed(1) : '0.0';

                    return (
                      <>
                        <div className="space-y-4">
                          {/* Chặng 1: Học liệu xuất bản */}
                          <div className="space-y-1.5 p-2 rounded-2xl bg-warm-ivory/60 dark:bg-heritage-forest/40 border border-antique-gold/20">
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-heritage-green/10 dark:bg-antique-gold/15 text-heritage-green dark:text-antique-bright font-bold text-xs flex items-center justify-center border border-antique-gold/30 shrink-0">
                                  1
                                </span>
                                <div>
                                  <span className="font-bold text-text-body dark:text-warm-ivory">
                                    Học liệu đã xuất bản
                                  </span>
                                  <span className="hidden sm:inline text-[11px] text-text-muted ml-1.5">
                                    (Kho bài đọc sẵn sàng phục vụ học tập)
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 font-mono text-[11px]">
                                <span className="font-bold text-heritage-green dark:text-antique-bright">
                                  {realPublishedPosts.toLocaleString('en-US')} / {realTotalPosts.toLocaleString('en-US')}
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-heritage-green/15 text-[10px] font-bold text-heritage-green dark:text-antique-bright border border-heritage-green/30">
                                  {publishedPct}%
                                </span>
                              </div>
                            </div>
                            <div className="w-full h-2.5 rounded-full bg-warm-ivory dark:bg-heritage-dark/90 overflow-hidden border border-antique-gold/30 p-0.5 shadow-inner">
                              <div
                                className="h-full bg-gradient-to-r from-heritage-green to-emerald-600 rounded-full transition-all duration-700 ease-out shadow-xs"
                                style={{ width: `${publishedPct}%` }}
                              />
                            </div>
                          </div>

                          {/* Chặng 2: Lượt đọc tích lũy */}
                          <div className="space-y-1.5 p-2 rounded-2xl bg-warm-ivory/60 dark:bg-heritage-forest/40 border border-antique-gold/20">
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-heritage-green/10 dark:bg-antique-gold/15 text-heritage-green dark:text-antique-bright font-bold text-xs flex items-center justify-center border border-antique-gold/30 shrink-0">
                                  2
                                </span>
                                <div>
                                  <span className="font-bold text-text-body dark:text-warm-ivory">
                                    Lượt đọc tích lũy
                                  </span>
                                  <span className="hidden sm:inline text-[11px] text-text-muted ml-1.5">
                                    (Tổng lượt tương tác đọc bài di sản)
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 font-mono text-[11px]">
                                <span className="font-bold text-heritage-green dark:text-antique-bright">
                                  {realTotalReads.toLocaleString('en-US')}
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-[10px] font-bold text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                                  {realTotalReads > 0 ? '100%' : '0%'}
                                </span>
                              </div>
                            </div>
                            <div className="w-full h-2.5 rounded-full bg-warm-ivory dark:bg-heritage-dark/90 overflow-hidden border border-antique-gold/30 p-0.5 shadow-inner">
                              <div
                                className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full transition-all duration-700 ease-out shadow-xs"
                                style={{ width: realTotalReads > 0 ? '100%' : '0%' }}
                              />
                            </div>
                          </div>

                          {/* Chặng 3: Đăng ký tài khoản */}
                          <div className="space-y-1.5 p-2 rounded-2xl bg-warm-ivory/60 dark:bg-heritage-forest/40 border border-antique-gold/20">
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-heritage-green/10 dark:bg-antique-gold/15 text-heritage-green dark:text-antique-bright font-bold text-xs flex items-center justify-center border border-antique-gold/30 shrink-0">
                                  3
                                </span>
                                <div>
                                  <span className="font-bold text-text-body dark:text-warm-ivory">
                                    Đăng ký tài khoản học viên
                                  </span>
                                  <span className="hidden sm:inline text-[11px] text-text-muted ml-1.5">
                                    (Tổng hồ sơ xác thực trên hệ thống)
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 font-mono text-[11px]">
                                <span className="font-bold text-heritage-green dark:text-antique-bright">
                                  {realTotalUsers.toLocaleString('en-US')}
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-antique-gold/20 text-[10px] font-bold text-heritage-green dark:text-antique-bright border border-antique-gold/30">
                                  {userConvPct}%
                                </span>
                              </div>
                            </div>
                            <div className="w-full h-2.5 rounded-full bg-warm-ivory dark:bg-heritage-dark/90 overflow-hidden border border-antique-gold/30 p-0.5 shadow-inner">
                              <div
                                className="h-full bg-gradient-to-r from-antique-gold to-amber-500 rounded-full transition-all duration-700 ease-out shadow-xs"
                                style={{ width: `${userConvPct}%` }}
                              />
                            </div>
                          </div>

                          {/* Chặng 4: Học viên hoạt động tuần */}
                          <div className="space-y-1.5 p-2 rounded-2xl bg-warm-ivory/60 dark:bg-heritage-forest/40 border border-antique-gold/20">
                            <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-lg bg-heritage-green/10 dark:bg-antique-gold/15 text-heritage-green dark:text-antique-bright font-bold text-xs flex items-center justify-center border border-antique-gold/30 shrink-0">
                                  4
                                </span>
                                <div>
                                  <span className="font-bold text-text-body dark:text-warm-ivory">
                                    Học viên hoạt động tuần
                                  </span>
                                  <span className="hidden sm:inline text-[11px] text-text-muted ml-1.5">
                                    (Tương tác làm bài trong 7 ngày qua)
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 font-mono text-[11px]">
                                <span className="font-bold text-heritage-green dark:text-antique-bright">
                                  {realActiveLearnersWeek.toLocaleString('en-US')}
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-[10px] font-bold text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                                  {retentionPct}%
                                </span>
                              </div>
                            </div>
                            <div className="w-full h-2.5 rounded-full bg-warm-ivory dark:bg-heritage-dark/90 overflow-hidden border border-antique-gold/30 p-0.5 shadow-inner">
                              <div
                                className="h-full bg-gradient-to-r from-amber-500 to-antique-gold rounded-full transition-all duration-700 ease-out shadow-xs"
                                style={{ width: `${retentionPct}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-warm-ivory/90 dark:bg-heritage-forest/60 border border-antique-gold/30 text-xs text-text-secondary flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-4 shadow-2xs">
                          <span className="font-medium">Tỷ lệ học viên hoạt động trong tuần trên tổng số tài khoản:</span>
                          <span className="font-bold font-mono text-sm text-heritage-green dark:text-antique-bright px-2.5 py-0.5 rounded-lg bg-antique-gold/20 border border-antique-gold/30 self-start sm:self-auto">
                            {overallActiveRate}%
                          </span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Distributions: Col 7-12 */}
              <div className="lg:col-span-6 space-y-6">
                {/* CEFR Level distribution */}
                <div className="p-6 rounded-3xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-antique-gold/20 pb-3">
                    <h3 className="font-heading font-bold text-base text-heritage-green dark:text-antique-bright flex items-center gap-2">
                      <Layers aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                      <span>{t('stats.by_cefr_level', 'Phân bổ theo cấp độ CEFR')}</span>
                    </h3>
                    <span className="text-[11px] text-text-muted flex items-center gap-1 font-medium">
                      Nhấp vào thanh để lọc bài
                      <ArrowRight aria-hidden="true" className="w-3 h-3 text-antique-gold" />
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => {
                      const count = overviewStats?.cefrCoverage
                        ? overviewStats.cefrCoverage[lvl] || 0
                        : postStats.levelsCount[lvl] || 0;
                      const total = overviewStats?.totalPosts || postStats.totalPosts || 1;
                      const pct = Math.round((count / total) * 100);

                      return (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() => handleQuickFilterCefr(lvl)}
                          className="w-full text-left p-2 -mx-2 rounded-2xl border border-transparent hover:border-antique-gold/40 hover:bg-antique-gold/10 hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-antique-gold/40"
                          title={`Nhấp để lọc bài viết cấp độ ${lvl} trong kho bài viết`}
                        >
                          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                            <span className="text-text-body dark:text-warm-ivory group-hover:text-heritage-green dark:group-hover:text-antique-bright flex items-center gap-1.5">
                              <span className="w-6 font-bold">{lvl}</span>
                              <span className="text-[11px] text-text-muted">({t('filters.level_option', { level: lvl })})</span>
                            </span>
                            <span className="inline-flex items-center gap-1 text-[11px] text-text-secondary group-hover:text-heritage-green dark:group-hover:text-antique-bright font-medium">
                              <span>{count} bài ({pct}%)</span>
                              <ArrowRight aria-hidden="true" className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform text-antique-gold" />
                            </span>
                          </div>
                          <div className="w-full h-2.5 rounded-full bg-warm-ivory dark:bg-heritage-dark/80 overflow-hidden border border-antique-gold/20 p-0.5 shadow-inner">
                            <div
                              className="h-full bg-gradient-to-r from-antique-gold to-amber-500 rounded-full transition-all duration-700 ease-out group-hover:brightness-110 shadow-xs"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Regional distribution */}
                <div className="p-6 rounded-3xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-antique-gold/20 pb-3">
                    <h3 className="font-heading font-bold text-base text-heritage-green dark:text-antique-bright flex items-center gap-2">
                      <MapPin aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                      <span>{t('stats.by_region', 'Phân bổ theo vùng miền')}</span>
                    </h3>
                    <span className="text-[11px] text-text-muted flex items-center gap-1 font-medium">
                      Nhấp vào thanh để lọc bài
                      <ArrowRight aria-hidden="true" className="w-3 h-3 text-antique-gold" />
                    </span>
                  </div>
                  {(() => {
                    const coverageMap = overviewStats?.regionCoverage || postStats.regionsCount;
                    const entries = Object.entries(coverageMap).sort((a, b) => b[1] - a[1]);
                    const total = overviewStats?.totalPosts || postStats.totalPosts || 1;

                    if (entries.length === 0) {
                      return <p className="text-xs text-text-muted">{t('stats.no_region_data', 'Chưa có dữ liệu vùng miền')}</p>;
                    }

                    return (
                      <div className="space-y-2.5">
                        {entries.slice(0, 5).map(([region, count]) => {
                          const pct = Math.round((count / total) * 100);
                          return (
                            <button
                              key={region}
                              type="button"
                              onClick={() => handleQuickFilterRegion(region)}
                              className="w-full text-left p-2 -mx-2 rounded-2xl border border-transparent hover:border-antique-gold/40 hover:bg-antique-gold/10 hover:shadow-xs hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-antique-gold/40"
                              title={`Nhấp để lọc bài viết vùng ${adminRegionLabel(region)} trong kho bài viết`}
                            >
                              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                                <span className="text-text-body dark:text-warm-ivory group-hover:text-heritage-green dark:group-hover:text-antique-bright">
                                  {adminRegionLabel(region)}
                                </span>
                                <span className="inline-flex items-center gap-1 text-[11px] text-text-secondary group-hover:text-heritage-green dark:group-hover:text-antique-bright font-medium">
                                  <span>{count} bài ({pct}%)</span>
                                  <ArrowRight aria-hidden="true" className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform text-antique-gold" />
                                </span>
                              </div>
                              <div className="w-full h-2.5 rounded-full bg-warm-ivory dark:bg-heritage-dark/80 overflow-hidden border border-antique-gold/20 p-0.5 shadow-inner">
                                <div
                                  className="h-full bg-gradient-to-r from-heritage-green to-emerald-600 dark:from-emerald-600 dark:to-teal-500 rounded-full transition-all duration-700 ease-out group-hover:brightness-110 shadow-xs"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Row 3: Bảng Bài viết & Hành trình cần chú ý */}
            <div className="p-6 rounded-3xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-antique-gold/20 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle aria-hidden="true" className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    <h3 className="font-heading font-bold text-base text-heritage-green dark:text-antique-bright">
                      Bài viết & Hành trình cần chú ý
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
                      {attentionPosts.length} nội dung cần hoàn thiện
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">
                    Danh sách bài viết đã có trên hệ thống nhưng còn thiếu đoạn văn song ngữ, file âm thanh AI giọng đọc hoặc bộ câu hỏi trắc nghiệm.
                  </p>
                </div>
              </div>

              {attentionPosts.length === 0 ? (
                <div className="p-8 sm:p-10 text-center rounded-3xl bg-gradient-to-b from-warm-ivory to-rice-paper/60 dark:from-heritage-dark/80 dark:to-heritage-forest/60 border border-antique-gold/30 space-y-3 shadow-xs">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 aria-hidden="true" className="w-7 h-7" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-heading font-bold text-heritage-green dark:text-antique-bright">
                      Tuyệt vời! 100% Học liệu đã hoàn thiện và đạt chuẩn
                    </p>
                    <p className="text-xs text-text-muted max-w-lg mx-auto leading-relaxed">
                      Tất cả bài viết trong kho đều đã sẵn sàng phục vụ học tập với đầy đủ đoạn văn song ngữ, file âm thanh AI chuẩn bản xứ và câu hỏi phản tư.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[650px]">
                    <thead className="bg-heritage-green/10 dark:bg-white/5 border-b border-antique-gold/20 text-text-secondary uppercase text-[10px] font-bold tracking-wider">
                      <tr>
                        <th className="px-4 py-3">Bài viết & Cấp độ</th>
                        <th className="px-4 py-3">Vùng miền & Chủ đề</th>
                        <th className="px-4 py-3">Vấn đề cần xử lý</th>
                        <th className="px-4 py-3 text-center">Lượt đọc</th>
                        <th className="px-4 py-3 text-right">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-antique-gold/15">
                      {attentionPosts.slice(0, 6).map((post) => {
                        const hasParagraphs = Boolean(
                          (post.paragraphs && post.paragraphs.length > 0) ||
                          (post.wordCount && post.wordCount > 0)
                        );
                        const hasAudio = Boolean(post.audioTracks || post.shadowingAudioUrl);
                        const quizCount = post.questionCount ?? (Array.isArray(post.questions) ? post.questions.length : 0);
                        const hasQuiz = quizCount > 0;

                        return (
                          <tr key={post.id} className="hover:bg-warm-ivory/60 dark:hover:bg-white/5 transition-colors">
                            <td className="px-4 py-3 min-w-[200px]">
                              <div className="flex items-center gap-2">
                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${getLevelBadgeClass(post.level)}`}>
                                  {post.level || 'B1'}
                                </span>
                                <div className="min-w-0">
                                  <div className="font-bold text-text-body dark:text-warm-ivory truncate max-w-[220px]" title={post.titleEn}>
                                    {post.titleEn}
                                  </div>
                                  <div className="text-[11px] text-text-muted truncate max-w-[220px]">
                                    {post.titleVi}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-text-body dark:text-warm-ivory font-medium">
                                {adminRegionLabel(post.region)}
                              </div>
                              <div className="text-[10px] text-text-muted">
                                {adminTopicLabel(post.topic)}
                              </div>
                            </td>

                            <td className="px-4 py-3">
                              <div className="flex flex-wrap gap-1.5">
                                {!hasParagraphs && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 shadow-2xs">
                                    Thiếu đoạn văn
                                  </span>
                                )}
                                {!hasAudio && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 shadow-2xs">
                                    Thiếu Audio
                                  </span>
                                )}
                                {!hasQuiz && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-sky-100 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 border border-sky-300 dark:border-sky-800 shadow-2xs">
                                    Thiếu Quiz
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="px-4 py-3 text-center font-mono font-bold text-text-secondary whitespace-nowrap">
                              {post.totalReads || 0}
                            </td>

                            <td className="px-4 py-3 text-right whitespace-nowrap space-x-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(post)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-antique-gold via-amber-400 to-antique-gold hover:from-antique-bright hover:to-antique-gold text-heritage-dark text-xs font-bold transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md hover:scale-[1.03] active:scale-[0.97] border border-antique-gold/40"
                              >
                                <Edit3 className="w-3.5 h-3.5" aria-hidden="true" />
                                <span>Bổ sung ngay</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenPreview(post)}
                                className="inline-flex items-center gap-1 px-2 py-1.5 rounded-xl border border-antique-gold/30 hover:bg-antique-gold/15 text-[11px] font-semibold text-text-secondary transition-colors cursor-pointer"
                                title="Xem bài"
                              >
                                <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Row 4: System Service Connections */}
            <AdminServiceConnections />
          </div>
        )}

        {/* ── TAB 2: HÀNH TRÌNH HỌC (JOURNEYS) ─────────────────────────── */}
        {(activeTab === 'journeys' || (activeTab === 'content' && activeContentSubTab === 'journeys')) && (
          <JourneyManagementView />
        )}

        {/* ── TAB: TỪ VỰNG HỆ THỐNG (VOCABULARIES) ──────────────────────── */}
        {(activeTab === 'vocabularies' || (activeTab === 'content' && activeContentSubTab === 'vocabularies')) && (
          <VocabManagementView />
        )}

        {/* ── TAB 3: KHO BÀI VIẾT & HỌC LIỆU (POSTS) ─────────────────────── */}
        {(activeTab === 'posts' || (activeTab === 'content' && activeContentSubTab === 'posts')) && (
          <div className="space-y-6">
            {/* Filter & Search Bar */}
            <div className="p-4 rounded-2xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
              <form onSubmit={handleSearchSubmit} className="admin-search relative w-full md:w-96" role="search">
                <Search aria-hidden="true" className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  aria-label={t('filters.search_placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('filters.search_placeholder')}
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                />
                <button type="submit" className="rounded-xl bg-heritage-green px-3 text-warm-ivory">
                  {t('filters.search_button')}
                </button>
              </form>

              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                {/* Standalone / Journey Filter */}
                <select
                  aria-label="Hình thức bài đọc"
                  value={standaloneFilter}
                  onChange={(e) => setStandaloneFilter(e.target.value as 'all' | 'standalone' | 'journey')}
                  className="px-3 py-2 rounded-xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold cursor-pointer"
                >
                  <option value="all">Tất cả hình thức</option>
                  <option value="standalone">Chỉ bài độc lập</option>
                  <option value="journey">Thuộc hành trình học</option>
                </select>

                {/* Level Filter */}
                <select
                  aria-label={t('filters.all_levels')}
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold cursor-pointer"
                >
                  <option value="">{t('filters.all_levels')}</option>
                  {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {t('filters.level_option', { level: lvl })}
                    </option>
                  ))}
                </select>

                {/* Region Filter */}
                <select
                  aria-label={t('filters.all_regions')}
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold cursor-pointer"
                >
                  <option value="">{t('filters.all_regions')}</option>
                  {Object.keys(postStats.regionsCount).map((r) => (
                    <option key={r} value={r}>
                      {adminRegionLabel(r)} ({postStats.regionsCount[r]})
                    </option>
                  ))}
                </select>

                {/* Material Readiness / Post Status Filter */}
                <select
                  aria-label={t('posts_table.status_filter.label')}
                  value={postStatusFilter}
                  onChange={(e) => setPostStatusFilter(e.target.value as 'all' | 'published' | 'draft' | 'missing_materials')}
                  className="px-3 py-2 rounded-xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold cursor-pointer"
                >
                  <option value="all">{t('posts_table.status_filter.all')}</option>
                  <option value="published">{t('posts_table.status_filter.published')}</option>
                  <option value="draft">{t('posts_table.status_filter.draft')}</option>
                  <option value="missing_materials">{t('posts_table.status_filter.missing_materials')}</option>
                </select>

                {/* Reset Filter Button */}
                {(selectedLevel || selectedRegion || searchQuery || postStatusFilter !== 'all') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLevel('');
                      setSelectedRegion('');
                      setSelectedTopic('');
                      setSearchQuery('');
                      setPostStatusFilter('all');
                    }}
                    className="px-3 py-2 rounded-xl bg-white/40 dark:bg-white/10 hover:bg-white/60 text-xs font-bold text-text-muted cursor-pointer transition-colors"
                  >
                    {t('filters.clear_filters')}
                  </button>
                )}
              </div>
            </div>

            {/* Active Journey Filter Banner */}
            {activeJourneyFilter && (
              <div className="p-3.5 rounded-2xl bg-antique-gold/15 border border-antique-gold/40 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-heritage-green dark:text-antique-bright font-medium">
                  <Compass aria-hidden="true" className="w-4 h-4 text-antique-gold shrink-0" />
                  <span>
                    Đang lọc các bài viết thuộc lộ trình: <strong className="font-mono font-bold text-antique-gold">#{activeJourneyFilter}</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const p = new URLSearchParams(location.search);
                    p.delete('journeyId');
                    navigate(`${location.pathname}?${p.toString()}`);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rice-paper dark:bg-heritage-dark border border-antique-gold/30 hover:bg-white dark:hover:bg-white/10 text-xs font-bold transition-colors cursor-pointer"
                >
                  Xóa bộ lọc lộ trình
                </button>
              </div>
            )}

            {/* Posts Table */}
            <div className="bg-rice-paper dark:bg-heritage-dark/60 rounded-3xl border border-antique-gold/30 shadow-md overflow-hidden">
              {isLoading ? (
                <div className="py-20 text-center space-y-3">
                  <div className="inline-block animate-spin w-8 h-8 border-3 border-antique-gold border-t-transparent rounded-full" />
                  <p className="text-xs text-text-muted">{t('posts_table.loading')}</p>
                </div>
              ) : displayedPosts.length === 0 ? (
                <div className="py-20 text-center space-y-4">
                  <BookOpen aria-hidden="true" className="w-12 h-12 text-antique-gold/40 mx-auto" />
                  <div className="space-y-1">
                    <h3 className="font-heading text-lg font-bold">
                      {!hasLoadedPosts ? t('posts_table.unavailable_title') : t('posts_table.empty_title')}
                    </h3>
                    <p className="text-xs text-text-muted max-w-md mx-auto">
                      {!hasLoadedPosts ? t('posts_table.unavailable_desc') : t('posts_table.empty_desc')}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={!hasLoadedPosts ? fetchPosts : handleOpenCreate}
                    className="px-5 py-2.5 rounded-xl bg-heritage-green text-warm-ivory text-xs font-bold hover:bg-heritage-dark transition-colors cursor-pointer"
                  >
                    {!hasLoadedPosts ? t('posts_table.try_again') : t('posts_table.create_article')}
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-warm-ivory/80 dark:bg-heritage-dark/80 border-b border-antique-gold/20 text-text-secondary uppercase text-[10px] font-bold tracking-wider">
                      <tr>
                        <th className="px-5 py-3.5">{t('posts_table.col_title')}</th>
                        <th className="px-4 py-3.5">{t('posts_table.col_region')}</th>
                        <th className="px-4 py-3.5">{t('posts_table.col_level')}</th>
                        <th className="px-4 py-3.5">{t('posts_table.col_category')}</th>
                        <th className="px-4 py-3.5">{t('posts_table.col_content')}</th>
                        <th className="px-4 py-3.5 text-center">{t('posts_table.col_reads')}</th>
                        <th className="px-5 py-3.5 text-right">{t('posts_table.col_actions')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-antique-gold/15">
                      {displayedPosts.map((post) => {
                        const hasParagraphs = Boolean(
                          (post.paragraphs && post.paragraphs.length > 0) ||
                          (post.wordCount && post.wordCount > 0)
                        );
                        const paragraphCount = post.paragraphs?.length || (post.wordCount ? Math.ceil(post.wordCount / 50) : 0);
                        const vocabCount = post.vocabCount ?? post.vocabularies?.length ?? 0;
                        const hasAudio = Boolean(post.audioTracks || post.shadowingAudioUrl);
                        const quizCount = post.questionCount ?? (Array.isArray(post.questions) ? post.questions.length : 0);

                        return (
                          <tr
                            key={post.id}
                            className="hover:bg-warm-ivory/50 dark:hover:bg-white/5 transition-colors group"
                          >
                            <td className="px-5 py-4 max-w-sm">
                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  {post.journeyTitleEn ? (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const p = new URLSearchParams(location.search);
                                        p.set('tab', 'posts');
                                        if (post.journeyId) p.set('journeyId', post.journeyId);
                                        navigate(`${location.pathname}?${p.toString()}`);
                                      }}
                                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-antique-gold/20 hover:bg-antique-gold/35 text-heritage-green dark:text-antique-bright border border-antique-gold/35 transition-colors cursor-pointer"
                                      title="Lọc các bài thuộc hành trình này"
                                    >
                                      <Compass aria-hidden="true" className="w-3 h-3 text-antique-gold" />
                                      <span>Chặng {post.chapterOrder || 1}: {post.journeyTitleEn}</span>
                                    </button>
                                  ) : (
                                    <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-medium bg-stone-100 dark:bg-white/10 text-text-muted">
                                      Độc lập
                                    </span>
                                  )}
                                  {post.topicGroup && (
                                    <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-bold bg-antique-gold/20 text-heritage-dark dark:text-antique-bright border border-antique-gold/30">
                                      {post.topicGroup}
                                    </span>
                                  )}
                                </div>
                                <h4 className="font-heading font-bold text-sm text-heritage-green dark:text-warm-ivory line-clamp-1 group-hover:text-antique-gold transition-colors">
                                  {post.titleEn}
                                </h4>
                                <p className="text-[11px] text-text-muted line-clamp-1 italic">
                                  {post.titleVi}
                                </p>
                              </div>
                            </td>

                            <td className="px-4 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/60 dark:bg-white/10 border border-antique-gold/20">
                                <MapPin aria-hidden="true" className="w-3 h-3 text-antique-gold" />
                                <span>{adminRegionLabel(post.region)}</span>
                              </span>
                            </td>

                            <td className="px-4 py-4 whitespace-nowrap">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getLevelBadgeClass(
                                  post.level
                                )}`}
                              >
                                {post.level}
                              </span>
                            </td>

                            <td className="px-4 py-4 whitespace-nowrap text-text-secondary text-[11px]">
                              {adminTopicLabel(post.topic)}
                            </td>

                            {/* Readiness Pills (Bài đọc, Từ vựng, Audio TTS, Quiz) */}
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex flex-wrap items-center gap-1.5">
                                {/* Reading Pill */}
                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (!post.vocabularies || post.vocabularies.length === 0) {
                                      try {
                                        const fullPost = await postAdminService.getPostById(post.id);
                                        setVocabDrawerPost(fullPost || post);
                                      } catch {
                                        setVocabDrawerPost(post);
                                      }
                                    } else {
                                      setVocabDrawerPost(post);
                                    }
                                  }}
                                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all shadow-xs cursor-pointer ${
                                    vocabCount > 0
                                      ? 'bg-blue-100 hover:bg-blue-200 dark:bg-blue-950/40 dark:hover:bg-blue-900/60 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700/60 ring-1 ring-blue-500/10'
                                      : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800/80 dark:hover:bg-stone-700 text-stone-500 border-stone-200 dark:border-stone-700'
                                  }`}
                                  title="Xem nhanh từ vựng của bài đọc"
                                >
                                  <Type aria-hidden="true" className="w-3 h-3 shrink-0" />
                                  <span>{t('posts_table.readiness.vocab_count', { count: vocabCount })}</span>
                                </button>

                                {/* Audio TTS Pill */}
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all shadow-xs ${
                                    hasAudio
                                      ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700/60 ring-1 ring-amber-500/10'
                                      : 'bg-stone-100 dark:bg-stone-800/80 text-stone-400 border-stone-200 dark:border-stone-700'
                                  }`}
                                  title={hasAudio ? t('posts_table.readiness.audio_ready') : t('posts_table.readiness.audio_empty')}
                                >
                                  <Volume2 aria-hidden="true" className="w-3 h-3 shrink-0" />
                                  <span>{hasAudio ? t('posts_table.readiness.audio_ready') : t('posts_table.readiness.audio_empty')}</span>
                                </span>

                                {/* Quiz Pill */}
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all shadow-xs ${
                                    quizCount > 0
                                      ? 'bg-purple-100 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700/60 ring-1 ring-purple-500/10'
                                      : 'bg-stone-100 dark:bg-stone-800/80 text-stone-400 border-stone-200 dark:border-stone-700'
                                  }`}
                                  title={t('posts_table.readiness.quiz_count', { count: quizCount })}
                                >
                                  <HelpCircle aria-hidden="true" className="w-3 h-3 shrink-0" />
                                  <span>{t('posts_table.readiness.quiz_count', { count: quizCount })}</span>
                                </span>
                              </div>
                            </td>

                            <td className="px-4 py-4 whitespace-nowrap text-center font-bold text-text-body dark:text-warm-ivory">
                              {post.totalReads || 0}
                            </td>

                            {/* Actions with Guardrail on Publish */}
                            <td className="px-5 py-4 whitespace-nowrap text-right space-x-1.5">
                              <button
                                type="button"
                                disabled={!hasParagraphs}
                                onClick={() => {
                                  setSuccessToast(`${t('posts_table.guardrails.published_badge')}: ${post.titleEn}`);
                                  setTimeout(() => setSuccessToast(null), 3000);
                                }}
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                                  !hasParagraphs
                                    ? 'opacity-40 cursor-not-allowed bg-stone-100 dark:bg-stone-800 text-stone-500 border-stone-300'
                                    : 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 hover:bg-emerald-200 cursor-pointer'
                                }`}
                                title={
                                  !hasParagraphs
                                    ? t('posts_table.guardrails.publish_locked')
                                    : t('posts_table.guardrails.publish_action')
                                }
                              >
                                <Send aria-hidden="true" className="w-3 h-3" />
                                <span>{hasParagraphs ? t('posts_table.guardrails.published_badge') : t('posts_table.guardrails.draft_badge')}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenPreview(post)}
                                className="p-1.5 rounded-lg text-heritage-green dark:text-antique-bright hover:bg-heritage-green/10 transition-colors cursor-pointer"
                                title={t('posts_table.preview_action')}
                                aria-label={t('posts_table.preview_action')}
                              >
                                <Eye aria-hidden="true" className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenEdit(post)}
                                className="p-1.5 rounded-lg text-antique-gold hover:bg-antique-gold/15 transition-colors cursor-pointer"
                                title={t('posts_table.edit_action')}
                                aria-label={t('posts_table.edit_action')}
                              >
                                <Edit3 aria-hidden="true" className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeletingId(post.id)}
                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
                                title={t('posts_table.delete_action')}
                                aria-label={t('posts_table.delete_action')}
                              >
                                <Trash2 aria-hidden="true" className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB: QUẢN LÝ TỪ VỰNG (VOCABULARIES) ─────────────────────────── */}
        {activeTab === 'vocabularies' && <VocabManagementView />}

        {/* ── TAB 4: MARKETING & ĐA KÊNH (MARKETING) ─────────────────────── */}
        {activeTab === 'marketing' && <MarketingManagementView />}

        {/* ── TAB: GOOGLE ANALYTICS 4 (GA4) ───────────────────────────────── */}
        {activeTab === 'analytics' && <GoogleAnalyticsView />}

        {/* ── TAB: GOOGLE SEARCH CONSOLE ─────────────────────────────────── */}
        {activeTab === 'search_console' && <GoogleSearchConsoleView />}

        {/* ── TAB: GÓI ĐĂNG KÝ & DUYỆT ĐƠN (SUBSCRIPTIONS) ──────────────── */}
        {activeTab === 'subscriptions' && <SubscriptionManagementView />}

        {/* ── TAB 5: HỌC VIÊN CRM (USERS) ─────────────────────────────────── */}
        {activeTab === 'users' && <UserManagementView />}

        {/* ── TAB 6: NHẬT KÝ KIỂM TOÁN & LỊCH SỬ (HISTORY / LOGS / SYSTEM) ──────── */}
        {(activeTab === 'history' || activeTab === 'system' || activeTab === 'logs') && (
          <AdminActivityLogView />
        )}

        {/* ── TAB 7: CẤU HÌNH AI & CHI PHÍ ─────────────────────────────────── */}
        {(activeTab === 'ai_configs' || activeTab === 'ai') && (
          <AiConfigManagementView />
        )}

        {/* ── Preview Modal ─────────────────────────────────────────────── */}
        <PostPreviewModal post={previewPost} onClose={() => setPreviewPost(null)} />

        {/* Post Vocab Drawer */}
        <PostVocabDrawer
          isOpen={Boolean(vocabDrawerPost)}
          post={vocabDrawerPost}
          onClose={() => setVocabDrawerPost(null)}
          onNavigateToVocabTab={(word, postId) => {
            setVocabDrawerPost(null);
            const searchParam = word ? '&search=' + encodeURIComponent(word) : '';
            const postParam = postId ? '&postId=' + encodeURIComponent(postId) : '';
            navigate('/admin/content?tab=vocabularies' + searchParam + postParam);
          }}
          onEditPost={(p) => {
            setVocabDrawerPost(null);
            handleOpenEdit(p);
          }}
        />

        {/* ── Delete Confirmation Dialog ─────────────────────────────────── */}
        {deletingId && (
          <AdminDialog title={t('delete_dialog.title')} onClose={() => setDeletingId(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-rice-paper dark:bg-heritage-forest border border-red-300 dark:border-red-800 rounded-3xl p-6 shadow-2xl space-y-4"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 flex items-center justify-center text-red-600 dark:text-red-400 mx-auto">
                <Trash2 aria-hidden="true" className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1">
                <h3 className="font-heading font-bold text-lg text-text-body dark:text-warm-ivory">
                  {t('delete_dialog.heading')}
                </h3>
                <p className="text-xs text-text-muted">
                  {t('delete_dialog.warning')}
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeletingId(null)}
                  className="px-4 py-2.5 rounded-xl border border-antique-gold/30 text-xs font-bold hover:bg-white/10 transition-colors cursor-pointer"
                >
                  {t('delete_dialog.cancel')}
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-md"
                >
                  {t('delete_dialog.confirm')}
                </button>
              </div>
            </motion.div>
          </AdminDialog>
        )}
      </div>
    </MotionConfig>
  );
};

export default AdminPage;
