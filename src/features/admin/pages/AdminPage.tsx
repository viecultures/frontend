import React, { useState, useEffect, useMemo } from 'react';
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
} from 'lucide-react';
import type { ReadingPostItem, CefrLevel } from '../types/adminTypes';
import { postAdminService, type PostFilterParams } from '../services/postAdminService';
import { adminUserService } from '../services/adminUserService';
import { PostFormModal } from '../components/PostFormModal';
import { UserManagementView } from '../components/UserManagementView';
import { AdminDialog } from '../components/AdminDialog';
import { AdminServiceConnections } from '../components/AdminServiceConnections';
import { adminTopicLabel, adminRegionLabel, adminReadTimeLabel } from '../admin-presentation';
import '../admin-ui.css';

type AdminTab = 'posts' | 'users' | 'system_stats';

export const AdminPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('posts');

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

      const data = await postAdminService.getPosts(params);
      setPosts(data);
      setHasLoadedPosts(true);
    } catch (err: unknown) {
      setHasLoadedPosts(false);
      console.error('Lỗi tải bài viết:', err);
      setErrorMsg((err instanceof Error ? err.message : '') || 'Unable to load articles. Please try again.');
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
  }, [selectedLevel, selectedRegion, selectedTopic]);

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
      setSuccessToast('Article deleted.');
      setTimeout(() => setSuccessToast(null), 3000);
    } catch (err: unknown) {
      setErrorMsg((err instanceof Error ? err.message : '') || 'Unable to delete the article.');
    } finally {
      setDeletingId(null);
    }
  };

  // Callback on post saved
  const handlePostSaved = () => {
    fetchPosts();
    setSuccessToast('Article saved.');
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
    <div className="admin-ui min-h-screen bg-warm-ivory dark:bg-heritage-forest text-text-body dark:text-warm-ivory py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* ── Top Header Banner ─────────────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-3xl bg-heritage-green text-warm-ivory p-6 sm:p-8 shadow-xl border border-antique-gold/40">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-antique-gold/20 text-antique-bright border border-antique-gold/30 text-xs font-bold">
                <BookOpen aria-hidden="true" className="w-3.5 h-3.5 text-antique-gold" />
                <span>VieCultures · Administration</span>
              </div>
              <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
                Content & administration
              </h1>
              <p className="text-xs sm:text-sm text-warm-ivory/80 max-w-2xl font-light">
                Manage cultural articles, account access and learning content in one place.
              </p>
            </div>

            {/* Quick Actions (Contextual based on active tab) */}
            <div className="flex flex-wrap items-center gap-3">
              {activeTab === 'posts' && (
                <>
                  <button
                    onClick={fetchPosts}
                    disabled={isLoading}
                    className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-antique-gold/30 text-xs font-bold text-warm-ivory flex items-center gap-2 transition-all cursor-pointer"
                    title="Refresh articles" aria-label="Refresh articles"
                  >
                    <RefreshCw aria-hidden="true" className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>

                  <button
                    onClick={handleOpenCreate}
                    className="px-5 py-2.5 rounded-xl bg-antique-gold text-heritage-dark hover:bg-antique-bright text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-lg hover:shadow-xl"
                  >
                    <Plus aria-hidden="true" className="w-4 h-4" />
                    <span>New article</span>
                  </button>
                </>
              )}

              {activeTab === 'users' && (
                <div className="px-4 py-2.5 rounded-xl bg-white/10 border border-antique-gold/30 text-xs font-semibold text-warm-ivory flex items-center gap-2">
                  <ShieldCheck aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                  <span>Administrator access</span>
                </div>
              )}

              {activeTab === 'system_stats' && (
                <button
                  onClick={() => {
                    fetchPosts();
                    fetchTotalUsers();
                  }}
                  className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-antique-gold/30 text-xs font-bold text-warm-ivory flex items-center gap-2 transition-all cursor-pointer"
                >
                  <RefreshCw aria-hidden="true" className="w-4 h-4" />
                  <span>Refresh overview</span>
                </button>
              )}
            </div>
          </div>

          {/* Decorative Pattern Background */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-antique-gold/10 to-transparent pointer-events-none" />
        </div>

        {/* ── Navigation Tabs ───────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2.5 p-1.5 rounded-2xl bg-rice-paper/80 dark:bg-heritage-dark/60 border border-antique-gold/25 shadow-sm">
          <button
            aria-pressed={activeTab === 'posts'}
            onClick={() => setActiveTab('posts')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'posts'
                ? 'bg-heritage-green text-warm-ivory shadow-md border border-antique-gold/40'
                : 'text-text-secondary hover:text-text-body hover:bg-warm-ivory/60 dark:hover:bg-white/5'
            }`}
          >
            <BookOpen aria-hidden="true" className="w-4 h-4 text-antique-gold" />
            <span>Articles</span>
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
            aria-pressed={activeTab === 'users'}
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'users'
                ? 'bg-heritage-green text-warm-ivory shadow-md border border-antique-gold/40'
                : 'text-text-secondary hover:text-text-body hover:bg-warm-ivory/60 dark:hover:bg-white/5'
            }`}
          >
            <Users aria-hidden="true" className="w-4 h-4 text-antique-gold" />
            <span>Users</span>
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
            aria-pressed={activeTab === 'system_stats'}
            onClick={() => setActiveTab('system_stats')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'system_stats'
                ? 'bg-heritage-green text-warm-ivory shadow-md border border-antique-gold/40'
                : 'text-text-secondary hover:text-text-body hover:bg-warm-ivory/60 dark:hover:bg-white/5'
            }`}
          >
            <BarChart3 aria-hidden="true" className="w-4 h-4 text-antique-gold" />
            <span>Overview</span>
          </button>
        </div>

        {/* ── TAB 1: BÀI ĐỌC VĂN HÓA ────────────────────────────────────── */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            {/* Stats Summary Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 sm:p-5 rounded-2xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-text-muted text-xs">
                  <span>Articles in view</span>
                  <BookOpen aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                </div>
                <div className="text-2xl sm:text-3xl font-heading font-bold text-heritage-green dark:text-antique-bright">
                  {stats.totalPosts}
                </div>
                <p className="text-[11px] text-text-secondary">Articles in the current selection</p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-text-muted text-xs">
                  <span>Article reads</span>
                  <TrendingUp aria-hidden="true" className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-2xl sm:text-3xl font-heading font-bold text-emerald-700 dark:text-emerald-400">
                  {stats.totalReads.toLocaleString()}
                </div>
                <p className="text-[11px] text-text-secondary">Reads for the current selection</p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-text-muted text-xs">
                  <span>Regions represented</span>
                  <MapPin aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                </div>
                <div className="text-2xl sm:text-3xl font-heading font-bold text-heritage-green dark:text-antique-bright">
                  {Object.keys(stats.regionsCount).length}
                </div>
                <p className="text-[11px] text-text-secondary">Locations in this selection</p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-text-muted text-xs">
                  <span>CEFR coverage</span>
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
                <p className="text-[11px] text-text-secondary">Reading levels represented</p>
              </div>
            </div>

            {/* Filter & Search Section */}
            <div className="p-4 rounded-2xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
              <form onSubmit={handleSearchSubmit} className="admin-search relative w-full md:w-96" role="search">
                <Search aria-hidden="true" className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  aria-label="Search articles"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search titles, story groups or keywords…"
                  className="w-full pl-10 pr-4 py-2 rounded-xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold"
                />
                <button type="submit" className="rounded-xl bg-heritage-green px-3 text-warm-ivory">Search</button>
              </form>

              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                {/* Level Filter */}
                <select
                  aria-label="Filter articles by CEFR level"
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold cursor-pointer"
                >
                  <option value="">All CEFR levels</option>
                  {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => (
                    <option key={lvl} value={lvl}>
                      Level {lvl}
                    </option>
                  ))}
                </select>

                {/* Region Filter */}
                <select
                  aria-label="Filter articles by region"
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-warm-ivory dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:border-antique-gold cursor-pointer"
                >
                  <option value="">All regions</option>
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
                    Clear filters
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
                  <p className="text-xs text-text-muted">Loading articles…</p>
                </div>
              ) : posts.length === 0 ? (
                <div className="py-20 text-center space-y-4">
                  <BookOpen aria-hidden="true" className="w-12 h-12 text-antique-gold/40 mx-auto" />
                  <div className="space-y-1">
                    <h3 className="font-heading text-lg font-bold">{!hasLoadedPosts ? 'Articles unavailable' : 'No articles found'}</h3>
                    <p className="text-xs text-text-muted max-w-md mx-auto">
                      {!hasLoadedPosts ? 'We could not load the article list. Please try again.' : 'Create your first article, import a TSV row or adjust your filters.'}
                    </p>
                  </div>
                  <button
                    onClick={!hasLoadedPosts ? fetchPosts : handleOpenCreate}
                    className="px-5 py-2.5 rounded-xl bg-heritage-green text-warm-ivory text-xs font-bold hover:bg-heritage-dark transition-colors cursor-pointer"
                  >
                    {!hasLoadedPosts ? 'Try again' : 'Create an article'}
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-warm-ivory/80 dark:bg-heritage-dark/80 border-b border-antique-gold/20 text-text-secondary uppercase text-[10px] font-bold tracking-wider">
                      <tr>
                        <th className="px-5 py-3.5">Article / story group</th>
                        <th className="px-4 py-3.5">Region</th>
                        <th className="px-4 py-3.5">Level</th>
                        <th className="px-4 py-3.5">Category</th>
                        <th className="px-4 py-3.5">Content</th>
                        <th className="px-4 py-3.5 text-center">Reads</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
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
                              {post.topicGroup && (
                                <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-bold bg-antique-gold/20 text-heritage-dark dark:text-antique-bright border border-antique-gold/30">
                                  {post.topicGroup}
                                </span>
                              )}
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
                              {post.wordCount ? `${post.wordCount} words` : adminReadTimeLabel(post.readTime) || '—'}
                            </div>
                            <div className="text-text-muted text-[10px]">
                              {post.paragraphs?.length ? `${post.paragraphs.length} paragraph pairs` : 'No paragraph pairs'}
                              {post.vocabularies?.length ? ` • ${post.vocabularies.length} vocabulary items` : ''}
                            </div>
                          </td>

                          <td className="px-4 py-4 whitespace-nowrap text-center font-bold text-text-body dark:text-warm-ivory">
                            {post.totalReads || 0}
                          </td>

                          <td className="px-5 py-4 whitespace-nowrap text-right space-x-1">
                            <button
                              onClick={() => handleOpenPreview(post)}
                              className="p-1.5 rounded-lg text-heritage-green dark:text-antique-bright hover:bg-heritage-green/10 transition-colors cursor-pointer"
                              title="Preview article" aria-label="Preview article"
                            >
                              <Eye aria-hidden="true" className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(post)}
                              className="p-1.5 rounded-lg text-antique-gold hover:bg-antique-gold/15 transition-colors cursor-pointer"
                              title="Edit article" aria-label="Edit article"
                            >
                              <Edit3 aria-hidden="true" className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeletingId(post.id)}
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
                              title="Delete article" aria-label="Delete article"
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

        {/* ── TAB 3: THỐNG KÊ HỆ THỐNG ──────────────────────────────────── */}
        {activeTab === 'system_stats' && (
          <div className="space-y-6">
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-text-muted text-xs">
                  <span>Registered users</span>
                  <Users aria-hidden="true" className="w-5 h-5 text-antique-gold" />
                </div>
                <div className="text-3xl font-heading font-bold text-heritage-green dark:text-antique-bright">
                  {totalUsersCount?.toLocaleString('en-US') ?? '—'}
                </div>
                <p className="text-[11px] text-text-secondary">Learner and administrator accounts</p>
              </div>

              <div className="p-5 rounded-3xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-text-muted text-xs">
                  <span>Articles in view</span>
                  <BookOpen aria-hidden="true" className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="text-3xl font-heading font-bold text-emerald-700 dark:text-emerald-400">
                  {stats.totalPosts}
                </div>
                <p className="text-[11px] text-text-secondary">Articles in the current selection</p>
              </div>

              <div className="p-5 rounded-3xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-text-muted text-xs">
                  <span>Article reads</span>
                  <TrendingUp aria-hidden="true" className="w-5 h-5 text-amber-500" />
                </div>
                <div className="text-3xl font-heading font-bold text-amber-700 dark:text-antique-gold">
                  {stats.totalReads.toLocaleString()}
                </div>
                <p className="text-[11px] text-text-secondary">Reads for this article selection</p>
              </div>

              <div className="p-5 rounded-3xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-text-muted text-xs">
                  <span>Average reads per article</span>
                  <Activity aria-hidden="true" className="w-5 h-5 text-rose-500" />
                </div>
                <div className="text-3xl font-heading font-bold text-rose-700 dark:text-rose-400">
                  {stats.avgReads}
                </div>
                <p className="text-[11px] text-text-secondary">Reads across the current selection</p>
              </div>
            </div>

            {/* Level and Region Distributions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* CEFR Level distribution */}
              <div className="p-6 rounded-3xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm space-y-4">
                <h3 className="font-heading font-bold text-base text-heritage-green dark:text-antique-bright flex items-center gap-2">
                  <Layers aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                  <span>Articles by CEFR level</span>
                </h3>
                <div className="space-y-3">
                  {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((lvl) => {
                    const count = stats.levelsCount[lvl] || 0;
                    const pct = stats.totalPosts > 0 ? Math.round((count / stats.totalPosts) * 100) : 0;

                    return (
                      <div key={lvl} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-text-body dark:text-warm-ivory">Level {lvl}</span>
                          <span className="text-text-secondary">
                            {count} articles ({pct}%)
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
                  <span>Articles by region</span>
                </h3>
                {Object.keys(stats.regionsCount).length === 0 ? (
                  <p className="text-xs text-text-muted">No regional data yet.</p>
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
                                {count} articles ({pct}%)
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
        {previewPost && (
          <AdminDialog title="Article preview" onClose={() => setPreviewPost(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl bg-rice-paper dark:bg-heritage-forest border border-antique-gold/40 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="p-5 bg-heritage-green text-warm-ivory flex items-center justify-between border-b border-antique-gold/30">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-antique-gold uppercase tracking-wider">
                    {adminRegionLabel(previewPost.region)} · Level {previewPost.level}
                  </span>
                  <h3 className="font-heading font-bold text-base sm:text-lg">
                    {previewPost.titleEn}
                  </h3>
                  <p className="text-xs text-warm-ivory/80 italic">{previewPost.titleVi}</p>
                </div>
                <button aria-label="Close preview"
                  onClick={() => setPreviewPost(null)}
                  className="p-1.5 rounded-xl hover:bg-white/10 text-warm-ivory cursor-pointer"
                >
                  <X aria-hidden="true" className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto flex-1">
                {/* Paragraphs preview */}
                <div className="space-y-4">
                  <h4 className="font-heading font-bold text-sm text-heritage-green dark:text-antique-bright border-b border-antique-gold/20 pb-2 flex items-center gap-2">
                    <BookOpen aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                    <span>Bilingual content ({previewPost.paragraphs?.length || 0} paragraph pairs)</span>
                  </h4>
                  {previewPost.paragraphs && previewPost.paragraphs.length > 0 ? (
                    previewPost.paragraphs.map((p, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-warm-ivory dark:bg-heritage-dark/60 border border-antique-gold/20 space-y-2"
                      >
                        <div className="text-xs font-serif leading-relaxed text-text-body dark:text-warm-ivory">
                          {p.enText}
                        </div>
                        <div className="text-xs italic text-text-secondary leading-relaxed border-t border-antique-gold/15 pt-2">
                          {p.viText}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-text-muted">
                      {previewPost.contentEn || 'No article content yet.'}
                    </div>
                  )}
                </div>

                {/* Vocabulary preview */}
                {previewPost.vocabularies && previewPost.vocabularies.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-heading font-bold text-sm text-heritage-green dark:text-antique-bright border-b border-antique-gold/20 pb-2 flex items-center gap-2">
                      <BookOpen aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                      <span>Vocabulary ({previewPost.vocabularies.length} items)</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {previewPost.vocabularies.map((v, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-warm-ivory dark:bg-heritage-dark/60 border border-antique-gold/20 text-xs space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-heritage-green dark:text-antique-bright">
                              {v.word}
                            </span>
                            {v.pos && (
                              <span className="text-[10px] text-text-muted italic">{v.pos}</span>
                            )}
                          </div>
                          <p className="text-[11px] text-text-secondary">{v.viMeaning}</p>
                          {v.contextSentence && (
                            <p className="text-[10px] text-text-muted italic border-t border-antique-gold/10 pt-1">
                              "{v.contextSentence}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </AdminDialog>
        )}

        {/* ── Delete Confirmation Dialog ─────────────────────────────────── */}
        {deletingId && (
          <AdminDialog title="Delete article" onClose={() => setDeletingId(null)}>
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
                  Delete this article?
                </h3>
                <p className="text-xs text-text-muted">
                  This permanently deletes the article, its paragraph pairs and linked vocabulary. This cannot be undone.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setDeletingId(null)}
                  className="px-4 py-2.5 rounded-xl border border-antique-gold/30 text-xs font-bold hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-md"
                >
                  Delete article
                </button>
              </div>
            </motion.div>
          </AdminDialog>
        )}
      </div>
    </div>
    </MotionConfig>
  );
};

export default AdminPage;
