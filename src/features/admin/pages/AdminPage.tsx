import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, MotionConfig } from 'motion/react';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Trash2,
  Edit3,
  Eye,
  RefreshCw,
  MapPin,
  Layers,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  BookMarked,
  X,
  Volume2,
  Users,
  Activity,
  BarChart3,
  Database,
  Server,
  ShieldCheck,
  CheckCircle,
  Compass,
} from 'lucide-react';
import type { ReadingPostItem, CefrLevel } from '../types/adminTypes';
import { postAdminService, type PostFilterParams } from '../services/postAdminService';
import { adminUserService } from '../services/adminUserService';
import { PostFormModal } from '../components/PostFormModal';
import { UserManagementView } from '../components/UserManagementView';
import { JourneyManagementView } from '../components/JourneyManagementView';
import { AdminActivityLogView } from '../components/AdminActivityLogView';
import { PostPreviewModal } from '../components/PostPreviewModal';
import { AdminDialog } from '../components/AdminDialog';
import { AdminServiceConnections } from '../components/AdminServiceConnections';
import { adminTopicLabel, adminRegionLabel, adminReadTimeLabel } from '../admin-presentation';
import { getLocalizedPath, resolveLanguage } from '@/routes/paths';
import '../admin-ui.css';

export type AdminTab = 'journeys' | 'posts' | 'users' | 'logs' | 'system_stats';
const VALID_TABS: AdminTab[] = ['journeys', 'posts', 'users', 'logs', 'system_stats'];

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
    return 'journeys';
  }, [tab, location.pathname]);

  // When visiting /admin or /:lang/admin without subpath, redirect to /admin/journeys
  useEffect(() => {
    const stripped = location.pathname.replace(/^\/(vi|en)(\/|$)/, '/');
    if (stripped === '/admin' || stripped === '/admin/') {
      navigate(getLocalizedPath('/admin/journeys', currentLang), { replace: true });
    }
  }, [location.pathname, currentLang, navigate]);

  const handleTabChange = (newTab: AdminTab) => {
    if (newTab !== activeTab) {
      navigate(getLocalizedPath(`/admin/${newTab}`, currentLang));
    }
  };

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

  // Modals state for Posts
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<ReadingPostItem | null>(null);
  const [previewPost, setPreviewPost] = useState<ReadingPostItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // System Stats State
  const [totalUsersCount, setTotalUsersCount] = useState<number | null>(null);

  // Fetch posts from API
  const fetchPosts = async () => {
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
  };

  // Fetch system stats (total users)
  const fetchTotalUsers = async () => {
    try {
      const res = await adminUserService.getUsers({ size: 1 });
      setTotalUsersCount(res.totalElements || 0);
    } catch (e) {
      console.warn('Không thể lấy tổng số user cho thống kê:', e);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedLevel, selectedRegion, selectedTopic, standaloneFilter]);

  useEffect(() => {
    fetchTotalUsers();
  }, [activeTab]);

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
    } catch (err) {
      setEditingPost(post);
      setIsFormOpen(true);
    }
  };

  // Open Preview Modal
  const handleOpenPreview = async (post: ReadingPostItem) => {
    try {
      const full = await postAdminService.getPostById(post.id);
      setPreviewPost(full);
    } catch (err) {
      setPreviewPost(post);
    }
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

  // Calculate stats
  const stats = useMemo(() => {
    const totalPosts = posts.length;
    const totalReads = posts.reduce((acc, p) => acc + (p.totalReads || 0), 0);
    const totalWords = posts.reduce((acc, p) => acc + (p.wordCount || 0), 0);
    const avgReads = totalPosts > 0 ? Math.round(totalReads / totalPosts) : 0;

    const levelsCount: Record<string, number> = {};
    const regionsCount: Record<string, number> = {};

    posts.forEach((p) => {
      if (p.level) levelsCount[p.level] = (levelsCount[p.level] || 0) + 1;
      if (p.region) regionsCount[p.region] = (regionsCount[p.region] || 0) + 1;
    });

    return { totalPosts, totalReads, totalWords, avgReads, levelsCount, regionsCount };
  }, [posts]);

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

  return (
    <MotionConfig reducedMotion="user">
    <div className="admin-ui min-h-screen bg-warm-ivory dark:bg-heritage-forest text-text-body dark:text-warm-ivory py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 items-start">
        {/* ── Left Column: Admin Sidebar (~240px - 260px) ───────────────── */}
        <aside className="w-full lg:w-64 shrink-0 space-y-4 lg:sticky lg:top-24">
          <div className="rounded-3xl bg-rice-paper/90 dark:bg-heritage-dark/80 border border-antique-gold/30 p-5 shadow-md space-y-6">
            {/* Logo / Admin Title */}
            <div className="space-y-1.5 border-b border-antique-gold/25 pb-4">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-antique-gold/20 text-antique-bright border border-antique-gold/30 text-[10px] font-bold uppercase tracking-wider">
                VieCultures Admin
              </div>
              <h2 className="font-heading text-lg font-bold text-heritage-green dark:text-antique-bright">
                Ban Quản Trị
              </h2>
              <p className="text-xs text-text-muted leading-relaxed">
                Trung tâm điều hành và kiểm duyệt nội dung văn hóa
              </p>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-1.5" aria-label="Thanh điều hướng quản trị">
              <button
                type="button"
                aria-pressed={activeTab === 'journeys'}
                onClick={() => handleTabChange('journeys')}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer text-left ${
                  activeTab === 'journeys'
                    ? 'bg-heritage-green text-warm-ivory shadow-sm border border-antique-gold/40'
                    : 'text-text-secondary hover:text-text-body hover:bg-warm-ivory/80 dark:hover:bg-white/5'
                }`}
              >
                <span>Hành trình học</span>
              </button>

              <button
                type="button"
                aria-pressed={activeTab === 'posts'}
                onClick={() => handleTabChange('posts')}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer text-left ${
                  activeTab === 'posts'
                    ? 'bg-heritage-green text-warm-ivory shadow-sm border border-antique-gold/40'
                    : 'text-text-secondary hover:text-text-body hover:bg-warm-ivory/80 dark:hover:bg-white/5'
                }`}
              >
                <span>{t('tabs.posts')}</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    activeTab === 'posts'
                      ? 'bg-antique-gold text-heritage-dark'
                      : 'bg-heritage-green/10 dark:bg-white/10 text-heritage-dark dark:text-warm-ivory'
                  }`}
                >
                  {posts.length}
                </span>
              </button>

              <button
                type="button"
                aria-pressed={activeTab === 'users'}
                onClick={() => handleTabChange('users')}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer text-left ${
                  activeTab === 'users'
                    ? 'bg-heritage-green text-warm-ivory shadow-sm border border-antique-gold/40'
                    : 'text-text-secondary hover:text-text-body hover:bg-warm-ivory/80 dark:hover:bg-white/5'
                }`}
              >
                <span>{t('tabs.users')}</span>
                {totalUsersCount !== null && totalUsersCount > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      activeTab === 'users'
                        ? 'bg-antique-gold text-heritage-dark'
                        : 'bg-heritage-green/10 dark:bg-white/10 text-heritage-dark dark:text-warm-ivory'
                    }`}
                  >
                    {totalUsersCount?.toLocaleString('en-US') ?? '—'}
                  </span>
                )}
              </button>

              <button
                type="button"
                aria-pressed={activeTab === 'logs'}
                onClick={() => handleTabChange('logs')}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer text-left ${
                  activeTab === 'logs'
                    ? 'bg-heritage-green text-warm-ivory shadow-sm border border-antique-gold/40'
                    : 'text-text-secondary hover:text-text-body hover:bg-warm-ivory/80 dark:hover:bg-white/5'
                }`}
              >
                <span>Nhật ký hành vi</span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    activeTab === 'logs'
                      ? 'bg-antique-gold text-heritage-dark'
                      : 'bg-heritage-green/10 dark:bg-white/10 text-heritage-dark dark:text-warm-ivory'
                  }`}
                >
                  Kiểm toán
                </span>
              </button>

              <button
                type="button"
                aria-pressed={activeTab === 'system_stats'}
                onClick={() => handleTabChange('system_stats')}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer text-left ${
                  activeTab === 'system_stats'
                    ? 'bg-heritage-green text-warm-ivory shadow-sm border border-antique-gold/40'
                    : 'text-text-secondary hover:text-text-body hover:bg-warm-ivory/80 dark:hover:bg-white/5'
                }`}
              >
                <span>{t('tabs.overview')}</span>
              </button>
            </nav>

            {/* Trạng thái kết nối */}
            <div className="pt-4 border-t border-antique-gold/25 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-text-secondary">
                <span>Trạng thái kết nối</span>
                <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Sẵn sàng
                </span>
              </div>
              <p className="text-[10px] text-text-muted leading-tight">
                Backend API & CSDL kết nối ổn định
              </p>
            </div>
          </div>
        </aside>

        {/* ── Right Column: Main Content ──────────────────────────── */}
        <div className="flex-1 min-w-0 w-full space-y-6">
          {/* Sub-page Header Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-heritage-green text-warm-ivory p-6 sm:p-7 shadow-xl border border-antique-gold/40">
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <div className="text-[11px] font-bold text-antique-bright uppercase tracking-wider">
                  {activeTab === 'journeys' && 'Lộ trình di sản'}
                  {activeTab === 'posts' && 'Biên tập & Phân cấp'}
                  {activeTab === 'users' && 'Quản trị phân quyền'}
                  {activeTab === 'logs' && 'Nhật ký bảo mật'}
                  {activeTab === 'system_stats' && 'Giám sát hệ thống'}
                </div>
                <h1 className="font-heading text-xl sm:text-2xl font-bold tracking-tight">
                  {activeTab === 'journeys' && 'Quản lý hành trình học'}
                  {activeTab === 'posts' && t('header.title')}
                  {activeTab === 'users' && 'Quản lý người dùng'}
                  {activeTab === 'logs' && 'Nhật ký hành vi'}
                  {activeTab === 'system_stats' && 'Thống kê và trạng thái hệ thống'}
                </h1>
                <p className="text-xs sm:text-sm text-warm-ivory/80 max-w-xl font-light">
                  {activeTab === 'journeys' && 'Thiết lập lộ trình học tập văn hóa từng bước và quản lý trạm di sản'}
                  {activeTab === 'posts' && t('header.subtitle')}
                  {activeTab === 'users' && 'Phân quyền vai trò và giám sát học viên trên toàn nền tảng'}
                  {activeTab === 'logs' && 'Theo dõi thao tác quản trị, truy cập và kiểm toán thay đổi dữ liệu'}
                  {activeTab === 'system_stats' && 'Giám sát hiệu năng và kết nối dịch vụ backend'}
                </p>
              </div>

              {/* Quick Actions (Contextual based on active tab) */}
              <div className="flex flex-wrap items-center gap-2.5">
                {activeTab === 'posts' && (
                  <>
                    <button
                      type="button"
                      onClick={fetchPosts}
                      disabled={isLoading}
                      className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-antique-gold/30 text-xs font-bold text-warm-ivory flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                      title={t('header.refresh_articles')}
                      aria-label={t('header.refresh_articles')}
                    >
                      <RefreshCw aria-hidden="true" className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                      <span>{t('header.refresh_articles')}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleOpenCreate}
                      className="px-5 py-2.5 rounded-xl bg-antique-gold text-heritage-dark hover:bg-antique-bright text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                    >
                      <Plus aria-hidden="true" className="w-4 h-4" />
                      <span>{t('header.new_article')}</span>
                    </button>
                  </>
                )}

                {activeTab === 'users' && (
                  <div className="px-4 py-2.5 rounded-xl bg-white/10 border border-antique-gold/30 text-xs font-semibold text-warm-ivory flex items-center gap-2">
                    <ShieldCheck aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                    <span>{t('header.admin_access')}</span>
                  </div>
                )}

                {activeTab === 'logs' && (
                  <div className="px-4 py-2.5 rounded-xl bg-white/10 border border-antique-gold/30 text-xs font-semibold text-warm-ivory flex items-center gap-2">
                    <ShieldCheck aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                    <span>Kiểm toán tự động</span>
                  </div>
                )}

                {activeTab === 'system_stats' && (
                  <button
                    type="button"
                    onClick={() => {
                      fetchPosts();
                      fetchTotalUsers();
                    }}
                    className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-antique-gold/30 text-xs font-bold text-warm-ivory flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <RefreshCw aria-hidden="true" className="w-4 h-4" />
                    <span>{t('header.refresh_overview')}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Decorative Pattern Background */}
            <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-antique-gold/10 to-transparent pointer-events-none" />
          </div>

          {/* Error Message Toast */}
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-100 dark:bg-rose-900/40 border border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-200 text-xs flex items-center justify-between">
              <span>{errorMsg}</span>
              <button
                type="button"
                onClick={() => setErrorMsg(null)}
                className="font-bold underline cursor-pointer"
              >
                Đóng
              </button>
            </div>
          )}

          {/* Success Toast */}
          {successToast && (
            <div className="p-4 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-between">
              <span>{successToast}</span>
              <button
                type="button"
                onClick={() => setSuccessToast(null)}
                className="font-bold underline cursor-pointer"
              >
                Đóng
              </button>
            </div>
          )}

        {/* ── TAB 0: HÀNH TRÌNH HỌC ─────────────────────────────────── */}
        {activeTab === 'journeys' && <JourneyManagementView />}

        {/* ── TAB 1: BÀI ĐỌC VĂN HÓA ────────────────────────────────────── */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            {/* Stats Summary Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-text-muted text-xs">
                  <span>{t('stats.articles_in_view')}</span>
                  <BookOpen aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                </div>
                <div className="text-2xl sm:text-3xl font-heading font-bold text-heritage-green dark:text-antique-bright">
                  {stats.totalPosts}
                </div>
                <p className="text-[11px] text-text-secondary">{t('stats.articles_desc')}</p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-text-muted text-xs">
                  <span>{t('stats.article_reads')}</span>
                  <TrendingUp aria-hidden="true" className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-heading font-bold text-emerald-700 dark:text-emerald-400">
                  {stats.totalReads.toLocaleString()}
                </div>
                <p className="text-[11px] text-text-secondary">{t('stats.reads_desc')}</p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-text-muted text-xs">
                  <span>{t('stats.regions_represented')}</span>
                  <MapPin aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                </div>
                <div className="text-2xl sm:text-3xl font-heading font-bold text-heritage-green dark:text-antique-bright">
                  {Object.keys(stats.regionsCount).length}
                </div>
                <p className="text-[11px] text-text-secondary">{t('stats.regions_desc')}</p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-text-muted text-xs">
                  <span>{t('stats.cefr_coverage')}</span>
                  <Layers aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                </div>
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => (
                    <span
                      key={lvl}
                      className="px-2 py-0.5 rounded text-[10px] font-bold bg-heritage-green/10 dark:bg-white/10 text-heritage-dark dark:text-warm-ivory"
                    >
                      {lvl}: {stats.levelsCount[lvl] || 0}
                    </span>
                  ))}
                </div>
                <p className="text-[11px] text-text-secondary">{t('stats.cefr_desc')}</p>
              </div>
            </div>

            {/* Filter & Search Section */}
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
                <button type="submit" className="rounded-xl bg-heritage-green px-3 text-warm-ivory">{t('filters.search_button')}</button>
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
                  {Object.keys(stats.regionsCount).map((r) => (
                    <option key={r} value={r}>
                      {adminRegionLabel(r)} ({stats.regionsCount[r]})
                    </option>
                  ))}
                </select>

                {/* Reset Filter Button */}
                {(selectedLevel || selectedRegion || searchQuery) && (
                  <button
                    onClick={() => {
                      setSelectedLevel('');
                      setSelectedRegion('');
                      setSelectedTopic('');
                      setSearchQuery('');
                    }}
                    className="px-3 py-2 rounded-xl bg-white/40 dark:bg-white/10 hover:bg-white/60 text-xs font-bold text-text-muted cursor-pointer transition-colors"
                  >
                    {t('filters.clear_filters')}
                  </button>
                )}
              </div>
            </div>

            {/* Alerts */}
            {errorMsg && (
              <div role="alert" className="p-4 rounded-2xl bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800 text-red-800 dark:text-red-200 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle aria-hidden="true" className="w-4 h-4 shrink-0 text-red-600 dark:text-red-400" />
                  <span>{errorMsg}</span>
                </div>
                <button aria-label="Dismiss error" onClick={() => setErrorMsg(null)} className="cursor-pointer">
                  <X aria-hidden="true" className="w-4 h-4" />
                </button>
              </div>
            )}
            {successToast && (
              <div role="status" className="p-4 rounded-2xl bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-800 text-green-800 dark:text-green-200 text-xs flex items-center gap-2">
                <CheckCircle2 aria-hidden="true" className="w-4 h-4 shrink-0 text-green-600 dark:text-green-400" />
                <span>{successToast}</span>
              </div>
            )}

            {/* Posts Table */}
            <div className="bg-rice-paper dark:bg-heritage-dark/60 rounded-3xl border border-antique-gold/30 shadow-md overflow-hidden">
              {isLoading ? (
                <div className="py-20 text-center space-y-3">
                  <div className="inline-block animate-spin w-8 h-8 border-3 border-antique-gold border-t-transparent rounded-full" />
                  <p className="text-xs text-text-muted">{t('posts_table.loading')}</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="py-20 text-center space-y-4">
                  <BookOpen aria-hidden="true" className="w-12 h-12 text-antique-gold/40 mx-auto" />
                  <div className="space-y-1">
                    <h3 className="font-heading text-lg font-bold">{!hasLoadedPosts ? t('posts_table.unavailable_title') : t('posts_table.empty_title')}</h3>
                    <p className="text-xs text-text-muted max-w-md mx-auto">
                      {!hasLoadedPosts ? t('posts_table.unavailable_desc') : t('posts_table.empty_desc')}
                    </p>
                  </div>
                  <button
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
                      {posts.map((post) => (
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

                          <td className="px-4 py-4 whitespace-nowrap text-[11px] space-y-0.5">
                            <div className="font-semibold text-text-body dark:text-warm-ivory">
                              {post.wordCount ? t('posts_table.words_count', { count: post.wordCount }) : adminReadTimeLabel(post.readTime) || '—'}
                            </div>
                            <div className="text-text-muted text-[10px]">
                              {post.paragraphs?.length ? t('posts_table.paragraph_pairs', { count: post.paragraphs.length }) : t('posts_table.no_paragraphs')}
                              {post.vocabularies?.length ? ` • ${t('posts_table.vocab_items', { count: post.vocabularies.length })}` : ''}
                            </div>
                          </td>

                          <td className="px-4 py-4 whitespace-nowrap text-center font-bold text-text-body dark:text-warm-ivory">
                            {post.totalReads || 0}
                          </td>

                          <td className="px-5 py-4 whitespace-nowrap text-right space-x-1">
                            <button
                              onClick={() => handleOpenPreview(post)}
                              className="p-1.5 rounded-lg text-heritage-green dark:text-antique-bright hover:bg-heritage-green/10 transition-colors cursor-pointer"
                              title={t('posts_table.preview_action')} aria-label={t('posts_table.preview_action')}
                            >
                              <Eye aria-hidden="true" className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(post)}
                              className="p-1.5 rounded-lg text-antique-gold hover:bg-antique-gold/15 transition-colors cursor-pointer"
                              title={t('posts_table.edit_action')} aria-label={t('posts_table.edit_action')}
                            >
                              <Edit3 aria-hidden="true" className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeletingId(post.id)}
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
                              title={t('posts_table.delete_action')} aria-label={t('posts_table.delete_action')}
                            >
                              <Trash2 aria-hidden="true" className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 2: QUẢN LÝ NGƯỜI DÙNG ─────────────────────────────────── */}
        {activeTab === 'users' && <UserManagementView />}

        {/* ── TAB 3: NHẬT KÝ HÀNH VI ───────────────────────────────────── */}
        {activeTab === 'logs' && <AdminActivityLogView />}

        {/* ── TAB 4: THỐNG KÊ HỆ THỐNG ──────────────────────────────────── */}
        {activeTab === 'system_stats' && (
          <div className="space-y-6">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-text-muted text-xs">
                  <span>{t('stats.registered_users')}</span>
                  <Users aria-hidden="true" className="w-5 h-5 text-antique-gold" />
                </div>
                <div className="text-3xl font-heading font-bold text-heritage-green dark:text-antique-bright">
                  {totalUsersCount?.toLocaleString('en-US') ?? '—'}
                </div>
                <p className="text-[11px] text-text-secondary">{t('stats.users_desc')}</p>
              </div>

              <div className="p-5 rounded-3xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-text-muted text-xs">
                  <span>{t('stats.articles_in_view')}</span>
                  <BookOpen aria-hidden="true" className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="text-3xl font-heading font-bold text-emerald-700 dark:text-emerald-400">
                  {stats.totalPosts}
                </div>
                <p className="text-[11px] text-text-secondary">{t('stats.articles_desc')}</p>
              </div>

              <div className="p-5 rounded-3xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-text-muted text-xs">
                  <span>{t('stats.article_reads')}</span>
                  <TrendingUp aria-hidden="true" className="w-5 h-5 text-amber-500" />
                </div>
                <div className="text-3xl font-heading font-bold text-amber-700 dark:text-antique-gold">
                  {stats.totalReads.toLocaleString()}
                </div>
                <p className="text-[11px] text-text-secondary">{t('stats.reads_desc')}</p>
              </div>

              <div className="p-5 rounded-3xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-text-muted text-xs">
                  <span>{t('stats.avg_reads')}</span>
                  <Activity aria-hidden="true" className="w-5 h-5 text-rose-500" />
                </div>
                <div className="text-3xl font-heading font-bold text-rose-700 dark:text-rose-400">
                  {stats.avgReads}
                </div>
                <p className="text-[11px] text-text-secondary">{t('stats.avg_reads_desc')}</p>
              </div>
            </div>

            {/* Level and Region Distributions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CEFR Level distribution */}
              <div className="p-6 rounded-3xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-4">
                <h3 className="font-heading font-bold text-base text-heritage-green dark:text-antique-bright flex items-center gap-2">
                  <Layers aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                  <span>{t('stats.by_cefr_level')}</span>
                </h3>
                <div className="space-y-3">
                  {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => {
                    const count = stats.levelsCount[lvl] || 0;
                    const pct = stats.totalPosts > 0 ? Math.round((count / stats.totalPosts) * 100) : 0;

                    return (
                      <div key={lvl} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-text-body dark:text-warm-ivory">{t('filters.level_option', { level: lvl })}</span>
                          <span className="text-text-secondary">
                            {t('stats.articles_count', { count, pct })}
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-warm-ivory dark:bg-heritage-dark/80 overflow-hidden border border-antique-gold/20">
                          <div
                            className="h-full bg-antique-gold rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Regional distribution */}
              <div className="p-6 rounded-3xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-4">
                <h3 className="font-heading font-bold text-base text-heritage-green dark:text-antique-bright flex items-center gap-2">
                  <MapPin aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                  <span>{t('stats.by_region')}</span>
                </h3>
                {Object.keys(stats.regionsCount).length === 0 ? (
                  <p className="text-xs text-text-muted">{t('stats.no_region_data')}</p>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(stats.regionsCount)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 6)
                      .map(([region, count]) => {
                        const pct =
                          stats.totalPosts > 0 ? Math.round((count / stats.totalPosts) * 100) : 0;
                        return (
                          <div key={region} className="space-y-1">
                            <div className="flex items-center justify-between text-xs font-semibold">
                              <span className="text-text-body dark:text-warm-ivory">{adminRegionLabel(region)}</span>
                              <span className="text-text-secondary">
                                {t('stats.articles_count', { count, pct })}
                              </span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-warm-ivory dark:bg-heritage-dark/80 overflow-hidden border border-antique-gold/20">
                              <div
                                className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>

            <AdminServiceConnections />
          </div>
        )}
        </div>
      </div>

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
                  onClick={() => setDeletingId(null)}
                  className="px-4 py-2.5 rounded-xl border border-antique-gold/30 text-xs font-bold hover:bg-white/10 transition-colors cursor-pointer"
                >
                  {t('delete_dialog.cancel')}
                </button>
                <button
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
