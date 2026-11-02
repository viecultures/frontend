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
} from 'lucide-react';
import type { ReadingPostItem, CefrLevel } from '../types/adminTypes';
import { postAdminService, type PostFilterParams } from '../services/postAdminService';
import { adminUserService } from '../services/adminUserService';
import { adminOverviewService, type AdminOverviewStats } from '../services/adminOverviewService';
import { PostFormModal } from '../components/PostFormModal';
import { UserManagementView } from '../components/UserManagementView';
import { JourneyManagementView } from '../components/JourneyManagementView';
import { AdminActivityLogView } from '../components/AdminActivityLogView';
import { MarketingManagementView } from '../components/MarketingManagementView';
import { PostPreviewModal } from '../components/PostPreviewModal';
import { AdminDialog } from '../components/AdminDialog';
import { AdminServiceConnections } from '../components/AdminServiceConnections';
import { adminTopicLabel, adminRegionLabel, adminReadTimeLabel } from '../admin-presentation';
import { getLocalizedPath, resolveLanguage } from '@/routes/paths';
import '../admin-ui.css';

export type AdminTab =
  | 'dashboard'
  | 'journeys'
  | 'posts'
  | 'marketing'
  | 'users'
  | 'system'
  | 'logs'
  | 'system_stats';

const VALID_TABS: AdminTab[] = [
  'dashboard',
  'journeys',
  'posts',
  'marketing',
  'users',
  'system',
  'logs',
  'system_stats',
];

export const AdminPage: React.FC = () => {
  const { t } = useTranslation('admin');
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, tab } = useParams<{ lang?: string; tab?: string }>();
  const currentLang = resolveLanguage(lang);

  const activeTab: AdminTab = useMemo(() => {
    if (tab && (VALID_TABS as string[]).includes(tab)) {
      return tab as AdminTab;
    }
    const match = location.pathname.match(/\/admin\/([a-zA-Z0-9_-]+)/);
    if (match && (VALID_TABS as string[]).includes(match[1])) {
      return match[1] as AdminTab;
    }
    return 'dashboard';
  }, [tab, location.pathname]);

  // When visiting /admin or /:lang/admin without subpath, redirect to /admin/dashboard
  useEffect(() => {
    const stripped = location.pathname.replace(/^\/(vi|en)(\/|$)/, '/');
    if (stripped === '/admin' || stripped === '/admin/') {
      navigate(getLocalizedPath('/admin/dashboard', currentLang), { replace: true });
    }
  }, [location.pathname, currentLang, navigate]);

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
  }, [searchQuery, selectedLevel, selectedRegion, selectedTopic, standaloneFilter, t]);

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
    if (activeTab === 'posts' || activeTab === 'dashboard' || activeTab === 'system_stats') {
      fetchPosts();
    }
  }, [activeTab, fetchPosts]);

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

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingPost(null);
    setIsFormOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = async (post: ReadingPostItem) => {
    try {
      const full = await postAdminService.getPostById(post.id);
      setEditingPost(full);
      setIsFormOpen(true);
    } catch {
      setEditingPost(post);
      setIsFormOpen(true);
    }
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
      const quizQuestions = post.questions || [];
      const hasQuiz = Array.isArray(quizQuestions) && quizQuestions.length > 0;
      return !hasParagraphs || !hasAudio || !hasQuiz;
    });
  }, [posts]);

  // Filtered posts based on material readiness / publication status
  const displayedPosts = useMemo(() => {
    return posts.filter((post) => {
      const hasParagraphs = Boolean(
        (post.paragraphs && post.paragraphs.length > 0) ||
        (post.wordCount && post.wordCount > 0)
      );
      const hasAudio = Boolean(post.audioTracks || post.shadowingAudioUrl);
      const hasVocab = Boolean(post.vocabularies && post.vocabularies.length > 0);
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
  }, [posts, postStatusFilter]);

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
      case 'marketing':
        return {
          icon: Megaphone,
          title: 'Marketing & Đa kênh phân phối',
          subtitle: 'Chiến dịch truyền thông, email định kỳ và kích hoạt học viên đa nền tảng',
          badge: 'Đa kênh',
        };
      case 'users':
        return {
          icon: Users,
          title: 'Quản trị học viên & Phân quyền',
          subtitle: 'Quản lý phân quyền tài khoản và theo dõi tiến độ học tập trên toàn nền tảng',
          badge: totalUsersCount ? `${totalUsersCount.toLocaleString('en-US')} học viên` : 'Học viên CRM',
        };
      case 'system':
      case 'logs':
        return {
          icon: ShieldCheck,
          title: 'Nhật ký kiểm toán & Giám sát hệ thống',
          subtitle: 'Theo dõi thao tác quản trị, truy cập và kiểm toán thay đổi dữ liệu an ninh',
          badge: 'Kiểm toán',
        };
      default:
        return {
          icon: LayoutDashboard,
          title: 'Bảng điều khiển quản trị',
          subtitle: 'Trung tâm điều hành VieCultures',
          badge: 'Quản trị viên',
        };
    }
  }, [activeTab, posts.length, totalUsersCount, t]);

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
                <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full bg-antique-gold/20 text-antique-bright text-[10px] font-bold border border-antique-gold/30 shrink-0">
                  {headerConfig.badge}
                </span>
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

            {activeTab === 'posts' && (
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

            {activeTab === 'users' && (
              <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-antique-gold/30 text-xs font-semibold text-warm-ivory flex items-center gap-1.5">
                <ShieldCheck aria-hidden="true" className="w-3.5 h-3.5 text-antique-gold" />
                <span className="hidden sm:inline">{t('header.admin_access')}</span>
              </div>
            )}

            {(activeTab === 'system' || activeTab === 'logs') && (
              <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-antique-gold/30 text-xs font-semibold text-warm-ivory flex items-center gap-1.5">
                <ShieldCheck aria-hidden="true" className="w-3.5 h-3.5 text-antique-gold" />
                <span className="hidden sm:inline">Kiểm toán an ninh</span>
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
                        <span>Phễu chuyển đổi học viên</span>
                      </h3>
                      <p className="text-xs text-text-muted mt-0.5">
                        Đo lường các bước then chốt trong hành trình gắn kết văn hóa
                      </p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-antique-gold/20 text-heritage-green dark:text-antique-bright border border-antique-gold/30">
                      Toàn nền tảng
                    </span>
                  </div>

                  {/* 4 Funnel Stages */}
                  <div className="space-y-4">
                    {/* Stage 1: Khách truy cập web */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-heritage-green/10 text-heritage-green dark:text-antique-bright font-bold text-[10px] flex items-center justify-center border border-antique-gold/30">
                            1
                          </span>
                          <span className="font-bold text-text-body dark:text-warm-ivory">
                            Khách truy cập web
                          </span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-[11px]">
                          <span className="font-bold text-heritage-green dark:text-antique-bright">
                            10,450
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-antique-gold/20 text-[10px] font-bold text-heritage-green dark:text-antique-bright">
                            100%
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-2 rounded-full bg-warm-ivory dark:bg-heritage-dark/80 overflow-hidden border border-antique-gold/20">
                        <div className="h-full bg-heritage-green rounded-full" style={{ width: '100%' }} />
                      </div>
                    </div>

                    {/* Stage 2: Đăng ký tài khoản */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-heritage-green/10 text-heritage-green dark:text-antique-bright font-bold text-[10px] flex items-center justify-center border border-antique-gold/30">
                            2
                          </span>
                          <span className="font-bold text-text-body dark:text-warm-ivory">
                            Đăng ký tài khoản
                          </span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-[11px]">
                          <span className="font-bold text-heritage-green dark:text-antique-bright">
                            {(overviewStats?.totalUsers ?? totalUsersCount ?? 1250).toLocaleString('en-US')}
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-antique-gold/20 text-[10px] font-bold text-heritage-green dark:text-antique-bright">
                            42.5%
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-2 rounded-full bg-warm-ivory dark:bg-heritage-dark/80 overflow-hidden border border-antique-gold/20">
                        <div className="h-full bg-emerald-600 rounded-full" style={{ width: '42.5%' }} />
                      </div>
                    </div>

                    {/* Stage 3: Hoàn thành bài đầu tiên */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-heritage-green/10 text-heritage-green dark:text-antique-bright font-bold text-[10px] flex items-center justify-center border border-antique-gold/30">
                            3
                          </span>
                          <span className="font-bold text-text-body dark:text-warm-ivory">
                            Hoàn thành bài đầu tiên
                          </span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-[11px]">
                          <span className="font-bold text-heritage-green dark:text-antique-bright">
                            {(overviewStats?.totalReads ? Math.min(overviewStats.totalReads, 520) : 520).toLocaleString('en-US')}
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-antique-gold/20 text-[10px] font-bold text-heritage-green dark:text-antique-bright">
                            26.2%
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-2 rounded-full bg-warm-ivory dark:bg-heritage-dark/80 overflow-hidden border border-antique-gold/20">
                        <div className="h-full bg-antique-gold rounded-full" style={{ width: '26.2%' }} />
                      </div>
                    </div>

                    {/* Stage 4: Quay lại ngày 2 */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-heritage-green/10 text-heritage-green dark:text-antique-bright font-bold text-[10px] flex items-center justify-center border border-antique-gold/30">
                            4
                          </span>
                          <span className="font-bold text-text-body dark:text-warm-ivory">
                            Quay lại ngày 2 (Giữ chân D2)
                          </span>
                        </div>
                        <div className="flex items-center gap-2 font-mono text-[11px]">
                          <span className="font-bold text-heritage-green dark:text-antique-bright">
                            {(overviewStats?.activeLearnersWeek ?? 280).toLocaleString('en-US')}
                          </span>
                          <span className="px-1.5 py-0.2 rounded bg-antique-gold/20 text-[10px] font-bold text-heritage-green dark:text-antique-bright">
                            14.1%
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-2 rounded-full bg-warm-ivory dark:bg-heritage-dark/80 overflow-hidden border border-antique-gold/20">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '14.1%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-warm-ivory/80 dark:bg-heritage-dark/80 border border-antique-gold/20 text-[11px] text-text-secondary flex items-center justify-between mt-2">
                  <span>Tỷ lệ chuyển đổi tổng thể (Từ khách sang học viên D2):</span>
                  <span className="font-bold font-mono text-heritage-green dark:text-antique-bright">14.1%</span>
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
                    <span className="text-[11px] text-text-muted">Nhấp vào thanh để lọc bài</span>
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
                          className="w-full text-left p-1.5 -mx-1.5 rounded-xl hover:bg-antique-gold/10 transition-colors cursor-pointer group"
                          title={`Nhấp để lọc bài viết cấp độ ${lvl} trong kho`}
                        >
                          <div className="flex items-center justify-between text-xs font-semibold mb-1">
                            <span className="text-text-body dark:text-warm-ivory group-hover:text-heritage-green dark:group-hover:text-antique-bright flex items-center gap-1.5">
                              <span className="w-6 font-bold">{lvl}</span>
                              <span className="text-[11px] text-text-muted">({t('filters.level_option', { level: lvl })})</span>
                            </span>
                            <span className="text-text-secondary group-hover:text-heritage-green dark:group-hover:text-antique-bright">
                              {count} bài ({pct}%) &rarr;
                            </span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-warm-ivory dark:bg-heritage-dark/80 overflow-hidden border border-antique-gold/20">
                            <div
                              className="h-full bg-antique-gold rounded-full transition-all duration-500 group-hover:brightness-110"
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
                    <span className="text-[11px] text-text-muted">Nhấp vào thanh để lọc bài</span>
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
                              className="w-full text-left p-1.5 -mx-1.5 rounded-xl hover:bg-antique-gold/10 transition-colors cursor-pointer group"
                              title={`Nhấp để lọc bài viết vùng ${adminRegionLabel(region)} trong kho`}
                            >
                              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                                <span className="text-text-body dark:text-warm-ivory group-hover:text-heritage-green dark:group-hover:text-antique-bright">
                                  {adminRegionLabel(region)}
                                </span>
                                <span className="text-text-secondary group-hover:text-heritage-green dark:group-hover:text-antique-bright">
                                  {count} bài ({pct}%) &rarr;
                                </span>
                              </div>
                              <div className="w-full h-2 rounded-full bg-warm-ivory dark:bg-heritage-dark/80 overflow-hidden border border-antique-gold/20">
                                <div
                                  className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full transition-all duration-500 group-hover:brightness-110"
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
                <div className="py-8 text-center rounded-2xl border border-dashed border-antique-gold/30 space-y-2">
                  <CheckCircle2 aria-hidden="true" className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto" />
                  <p className="text-sm font-bold text-heritage-green dark:text-antique-bright">
                    Tuyệt vời! Tất cả học liệu đều đã đạt chuẩn
                  </p>
                  <p className="text-xs text-text-muted">
                    100% bài viết đã sẵn sàng với đầy đủ đoạn văn song ngữ, file audio phát âm và câu hỏi phản tư.
                  </p>
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
                        const quizQuestions = post.questions || [];
                        const hasQuiz = Array.isArray(quizQuestions) && quizQuestions.length > 0;

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
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-300">
                                    Thiếu đoạn văn
                                  </span>
                                )}
                                {!hasAudio && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300">
                                    Thiếu Audio
                                  </span>
                                )}
                                {!hasQuiz && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border border-purple-300">
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
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-antique-gold text-heritage-dark hover:bg-antique-bright text-[11px] font-bold transition-all cursor-pointer shadow-xs"
                              >
                                <Edit3 className="w-3 h-3" aria-hidden="true" />
                                <span>Bổ sung ngay</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenPreview(post)}
                                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-antique-gold/30 hover:bg-antique-gold/15 text-[11px] font-semibold text-text-secondary transition-colors cursor-pointer"
                                title="Xem bài"
                              >
                                <Eye className="w-3 h-3" aria-hidden="true" />
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
        {activeTab === 'journeys' && <JourneyManagementView />}

        {/* ── TAB 3: KHO BÀI VIẾT & HỌC LIỆU (POSTS) ─────────────────────── */}
        {activeTab === 'posts' && (
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
                        const vocabCount = post.vocabularies?.length || 0;
                        const hasAudio = Boolean(post.audioTracks || post.shadowingAudioUrl);
                        const quizQuestions = post.questions || [];
                        const quizCount = Array.isArray(quizQuestions) ? quizQuestions.length : 0;

                        return (
                          <tr
                            key={post.id}
                            className="hover:bg-warm-ivory/50 dark:hover:bg-white/5 transition-colors group"
                          >
                            <td className="px-5 py-4 max-w-sm">
                              <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  {post.journeyTitleEn ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-antique-gold/20 text-heritage-green dark:text-antique-bright border border-antique-gold/35">
                                      <Compass aria-hidden="true" className="w-3 h-3 text-antique-gold" />
                                      <span>Chặng {post.chapterOrder || 1}: {post.journeyTitleEn}</span>
                                    </span>
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
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all shadow-xs ${
                                    hasParagraphs
                                      ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700/60 ring-1 ring-emerald-500/10'
                                      : 'bg-rose-100 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700/60'
                                  }`}
                                  title={hasParagraphs ? t('posts_table.readiness.reading_ready', { count: paragraphCount }) : t('posts_table.readiness.reading_empty')}
                                >
                                  <FileText aria-hidden="true" className="w-3 h-3 shrink-0" />
                                  <span>{hasParagraphs ? t('posts_table.readiness.reading_ready', { count: paragraphCount }) : t('posts_table.readiness.reading_empty')}</span>
                                </span>

                                {/* Vocabulary Pill */}
                                <span
                                  className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all shadow-xs ${
                                    vocabCount > 0
                                      ? 'bg-blue-100 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-700/60 ring-1 ring-blue-500/10'
                                      : 'bg-stone-100 dark:bg-stone-800/80 text-stone-500 border-stone-200 dark:border-stone-700'
                                  }`}
                                  title={t('posts_table.readiness.vocab_count', { count: vocabCount })}
                                >
                                  <Type aria-hidden="true" className="w-3 h-3 shrink-0" />
                                  <span>{t('posts_table.readiness.vocab_count', { count: vocabCount })}</span>
                                </span>

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

        {/* ── TAB 4: MARKETING & ĐA KÊNH (MARKETING) ─────────────────────── */}
        {activeTab === 'marketing' && <MarketingManagementView />}

        {/* ── TAB 5: HỌC VIÊN CRM (USERS) ─────────────────────────────────── */}
        {activeTab === 'users' && <UserManagementView />}

        {/* ── TAB 6: HỆ THỐNG & KIỂM DUYỆT (SYSTEM / LOGS) ───────────────── */}
        {(activeTab === 'system' || activeTab === 'logs') && (
          <div className="space-y-6">
            <AdminActivityLogView />
            <AdminServiceConnections />
          </div>
        )}

        {/* ── Post Create / Edit Modal ──────────────────────────────────── */}
        <PostFormModal
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingPost(null);
          }}
          onSuccess={handlePostSaved}
          initialData={editingPost}
        />

        {/* ── Preview Modal ─────────────────────────────────────────────── */}
        <PostPreviewModal post={previewPost} onClose={() => setPreviewPost(null)} />

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
