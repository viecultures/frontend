import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Compass,
  Layers,
  MapPin,
  Calendar,
  Clock,
  BookOpen,
  Volume2,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  Edit3,
  Trash2,
  Plus,
  RefreshCw,
  Eye,
  FileText,
  Type,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import type { LearningJourneyItem, ReadingPostItem, CefrLevel } from '../types/adminTypes';
import { journeyAdminService } from '../services/journeyAdminService';
import { postAdminService } from '../services/postAdminService';
import { PostVocabDrawer } from '../components/PostVocabDrawer';
import { PostPreviewModal } from '../components/PostPreviewModal';
import { JourneyFormModal } from '../components/JourneyFormModal';
import { AdminDialog } from '../components/AdminDialog';
import { VIETNAM_34_PROVINCES } from '@/data/vietnamMapData';
import { getLocalizedPath, resolveLanguage } from '@/routes/paths';
import { adminRegionLabel } from '../admin-presentation';

const THEME_LABELS: Record<string, { en: string; vi: string }> = {
  cuisine: { en: 'Cuisine', vi: 'Ẩm thực' },
  places: { en: 'Heritage & Places', vi: 'Danh lam & Di sản' },
  crafts: { en: 'Traditional Crafts', vi: 'Làng nghề' },
  festivals: { en: 'Festivals', vi: 'Lễ hội' },
  history: { en: 'History & Tales', vi: 'Lịch sử' },
};

function getLevelBadgeClass(level?: string): string {
  switch ((level || '').toUpperCase()) {
    case 'A1':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
    case 'A2':
      return 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800';
    case 'B1':
      return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800';
    case 'B2':
      return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
    case 'C1':
      return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800';
    case 'C2':
      return 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800';
    default:
      return 'bg-stone-100 text-stone-700 border-stone-300 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700';
  }
}

export const AdminJourneyDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation('admin');
  const currentLang = resolveLanguage(i18n.language);

  // Data state
  const [journey, setJourney] = useState<LearningJourneyItem | null>(null);
  const [posts, setPosts] = useState<ReadingPostItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Modals & Drawers state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [previewPost, setPreviewPost] = useState<ReadingPostItem | null>(null);
  const [vocabDrawerPost, setVocabDrawerPost] = useState<ReadingPostItem | null>(null);

  // Fetch Journey & Posts data
  const fetchData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const [journeyData, postsData] = await Promise.all([
        journeyAdminService.getJourneyById(id),
        postAdminService.getPosts({ journeyId: id }),
      ]);
      setJourney(journeyData);
      setPosts(postsData);
    } catch (err: unknown) {
      console.error('Lỗi khi tải chi tiết hành trình học:', err);
      setErrorMsg(err instanceof Error ? err.message : 'Không thể tải thông tin hành trình học.');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Sort posts by chapterOrder
  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      const orderA = a.chapterOrder ?? 0;
      const orderB = b.chapterOrder ?? 0;
      return orderA - orderB;
    });
  }, [posts]);

  // Calculate readiness & health metrics
  const metrics = useMemo(() => {
    const totalChapters = sortedPosts.length;
    let totalVocab = 0;
    let audioCount = 0;
    let quizCount = 0;

    sortedPosts.forEach((post) => {
      totalVocab += post.vocabularies?.length ?? post.vocabCount ?? 0;

      const hasAudio = Boolean(
        post.audioTracks ||
        post.shadowingAudioUrl ||
        post.paragraphs?.some((p) => p.audioTimestampStart !== undefined)
      );
      if (hasAudio) audioCount += 1;

      // Defensively check questions array or questionCount
      const postQuizCount = post.questions?.length ?? post.questionCount ?? 0;
      if (postQuizCount > 0) quizCount += 1;
    });

    const audioPercent = totalChapters > 0 ? Math.round((audioCount / totalChapters) * 100) : 0;
    const quizPercent = totalChapters > 0 ? Math.round((quizCount / totalChapters) * 100) : 0;

    return {
      totalChapters,
      totalVocab,
      audioCount,
      audioPercent,
      quizCount,
      quizPercent,
    };
  }, [sortedPosts]);

  // Handle Delete Journey
  const handleDeleteJourney = async () => {
    if (!journey) return;
    setIsDeleting(true);
    try {
      await journeyAdminService.deleteJourney(journey.id);
      setIsDeleteConfirmOpen(false);
      navigate(getLocalizedPath('/admin/content?tab=journeys', currentLang));
    } catch (err: unknown) {
      console.error('Lỗi khi xóa hành trình:', err);
      setErrorMsg(err instanceof Error ? err.message : 'Không thể xóa hành trình.');
      setIsDeleting(false);
    }
  };

  const provinceName = useMemo(() => {
    if (!journey?.provinceId) return '—';
    const p = VIETNAM_34_PROVINCES.find((item) => item.id === journey.provinceId);
    return p ? p.name : journey.provinceId;
  }, [journey?.provinceId]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-5xl mx-auto space-y-6">
        <div className="h-8 w-48 rounded-xl bg-antique-gold/15 animate-pulse" />
        <div className="h-44 rounded-3xl bg-antique-gold/10 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 rounded-2xl bg-antique-gold/10 animate-pulse" />
          ))}
        </div>
        <div className="space-y-4 pt-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-3xl bg-antique-gold/10 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (errorMsg || !journey) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-heritage-green dark:text-warm-ivory">
          Không tìm thấy hành trình học
        </h2>
        <p className="text-xs text-text-muted">{errorMsg || 'Hành trình này có thể đã bị xóa hoặc đường dẫn không đúng.'}</p>
        <button
          type="button"
          onClick={() => navigate(getLocalizedPath('/admin/content?tab=journeys', currentLang))}
          className="px-4 py-2 rounded-xl bg-heritage-green text-warm-ivory font-bold text-xs hover:bg-heritage-forest transition-colors cursor-pointer"
        >
          Quay lại danh sách hành trình
        </button>
      </div>
    );
  }

  return (
    <div className="p-5 md:p-8 max-w-5xl mx-auto space-y-6 pb-20">
      {/* Toast Notification */}
      {successToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-2 shadow-sm">
          <CheckCircle2 aria-hidden="true" className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* ── 1. Top Navigation & Action Bar ────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(getLocalizedPath('/admin/content?tab=journeys', currentLang))}
            className="p-2 rounded-xl border border-antique-gold/30 hover:bg-antique-gold/15 text-heritage-green dark:text-antique-bright transition-colors cursor-pointer"
            title="Quay lại danh sách hành trình"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <nav className="flex items-center gap-1.5 text-xs text-text-muted">
            <Link
              to={getLocalizedPath('/admin/content?tab=journeys', currentLang)}
              className="hover:text-heritage-green dark:hover:text-antique-bright transition-colors"
            >
              Hành trình học
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-antique-gold/60" />
            <span className="font-semibold text-heritage-green dark:text-warm-ivory line-clamp-1">
              {journey.titleVi || journey.titleEn}
            </span>
          </nav>
        </div>

        {/* Action Buttons: Sửa & Xóa (Chuyển từ bảng ngoài vào trong đây) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="px-3.5 py-2 rounded-xl border border-antique-gold/40 hover:bg-antique-gold/15 text-heritage-green dark:text-antique-bright text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Edit3 className="w-3.5 h-3.5 text-antique-gold" />
            <span>Sửa thông tin</span>
          </button>
          <button
            type="button"
            onClick={() => setIsDeleteConfirmOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 text-red-600 dark:text-red-300 border border-red-200 dark:border-red-800 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
            <span>Xóa hành trình</span>
          </button>
        </div>
      </div>

      {/* ── 2. Journey Hero Overview Card (Gọn gàng, tinh tế) ─────────── */}
      <div className="p-6 rounded-3xl bg-rice-paper dark:bg-heritage-dark border border-antique-gold/30 shadow-sm flex flex-col md:flex-row gap-6 items-start">
        {journey.imageUrl ? (
          <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden border border-antique-gold/30 shrink-0 bg-stone-200 shadow-xs">
            <img src={journey.imageUrl} alt="" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-full md:w-48 h-32 rounded-2xl bg-antique-gold/15 text-antique-gold flex items-center justify-center shrink-0 border border-antique-gold/30 shadow-xs">
            <Compass className="w-10 h-10" />
          </div>
        )}

        <div className="flex-1 space-y-2 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] px-2 py-0.5 rounded-md font-bold bg-antique-gold/20 text-antique-gold border border-antique-gold/35">
              #{journey.id}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/60 dark:bg-white/10 border border-antique-gold/20">
              <MapPin className="w-3 h-3 text-antique-gold" />
              <span>{provinceName}</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-antique-gold/15 text-heritage-green dark:text-antique-bright font-bold">
              {adminRegionLabel(journey.region)}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/60 dark:bg-white/10 border border-antique-gold/20 text-text-secondary font-medium">
              {THEME_LABELS[journey.theme]?.vi || journey.theme}
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
              journey.status === 'published'
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/50 dark:text-emerald-300'
                : 'bg-stone-100 text-stone-700 border-stone-300 dark:bg-stone-800 dark:text-stone-300'
            }`}>
              {journey.status === 'published' ? 'Xuất bản' : 'Bản nháp'}
            </span>
          </div>

          <h1 className="font-heading font-bold text-xl md:text-2xl text-heritage-green dark:text-warm-ivory leading-snug">
            {journey.titleEn}
          </h1>
          <p className="text-xs md:text-sm text-text-muted italic">
            {journey.titleVi}
          </p>

          {journey.description && (
            <p className="text-xs text-text-secondary leading-relaxed pt-1 line-clamp-3">
              {journey.description}
            </p>
          )}
        </div>
      </div>

      {/* ── 3. Syllabus Health & Readiness Summary (4 Thẻ ngắn gọn) ────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl bg-rice-paper dark:bg-heritage-dark border border-antique-gold/25 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-[11px] font-medium">Tổng chặng</span>
            <Layers className="w-4 h-4 text-antique-gold" />
          </div>
          <div className="font-heading font-bold text-xl text-heritage-green dark:text-warm-ivory">
            {metrics.totalChapters} <span className="text-xs font-normal text-text-muted">bài đọc</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-rice-paper dark:bg-heritage-dark border border-antique-gold/25 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-[11px] font-medium">Tổng từ vựng</span>
            <Type className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="font-heading font-bold text-xl text-heritage-green dark:text-warm-ivory">
            {metrics.totalVocab} <span className="text-xs font-normal text-text-muted">từ hạt nhân</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-rice-paper dark:bg-heritage-dark border border-antique-gold/25 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-[11px] font-medium">Âm thanh giọng đọc</span>
            <Volume2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="font-heading font-bold text-xl text-heritage-green dark:text-warm-ivory">
            {metrics.audioPercent}% <span className="text-xs font-normal text-text-muted">({metrics.audioCount}/{metrics.totalChapters})</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-rice-paper dark:bg-heritage-dark border border-antique-gold/25 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-[11px] font-medium">Bài tập trắc nghiệm</span>
            <HelpCircle className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="font-heading font-bold text-xl text-heritage-green dark:text-warm-ivory">
            {metrics.quizPercent}% <span className="text-xs font-normal text-text-muted">({metrics.quizCount}/{metrics.totalChapters})</span>
          </div>
        </div>
      </div>

      {/* ── 4. Vertical Curriculum Roadmap (Phân cấp theo chiều dọc) ──── */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="font-heading font-bold text-base text-heritage-green dark:text-warm-ivory">
              Tiến trình học tập theo chiều dọc
            </h2>
            <p className="text-xs text-text-muted">
              Chuỗi các bài đọc được liên kết tuần tự theo lộ trình
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate(getLocalizedPath(`/admin/posts/new?journeyId=${encodeURIComponent(journey.id)}`, currentLang))}
            className="px-3.5 py-1.5 rounded-xl bg-heritage-green text-warm-ivory font-bold text-xs hover:bg-heritage-forest transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5 text-antique-gold" />
            <span>Thêm bài vào lộ trình</span>
          </button>
        </div>

        {sortedPosts.length === 0 ? (
          <div className="p-10 rounded-3xl bg-rice-paper dark:bg-heritage-dark border border-antique-gold/30 text-center space-y-3">
            <Layers className="w-10 h-10 text-antique-gold/50 mx-auto" />
            <h3 className="font-heading font-bold text-sm text-heritage-green dark:text-warm-ivory">
              Chưa có bài đọc nào trong hành trình này
            </h3>
            <p className="text-xs text-text-muted max-w-sm mx-auto">
              Nhấp vào nút bên dưới để tạo bài đọc đầu tiên (Chương 01) cho lộ trình.
            </p>
            <button
              type="button"
              onClick={() => navigate(getLocalizedPath(`/admin/posts/new?journeyId=${encodeURIComponent(journey.id)}`, currentLang))}
              className="px-4 py-2 rounded-xl bg-heritage-green text-warm-ivory font-bold text-xs hover:bg-heritage-forest transition-colors cursor-pointer"
            >
              Tạo bài học đầu tiên
            </button>
          </div>
        ) : (
          <div className="relative pl-6 md:pl-8 space-y-6 before:content-[''] before:absolute before:left-3 md:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-antique-gold/30">
            {sortedPosts.map((post, idx) => {
              const chapterNum = post.chapterOrder ?? idx + 1;
              const hasParagraphs = Boolean(
                (post.paragraphs && post.paragraphs.length > 0) ||
                (post.wordCount && post.wordCount > 0)
              );
              const paragraphCount = post.paragraphs?.length || (post.wordCount ? Math.ceil(post.wordCount / 50) : 0);

              const hasAudio = Boolean(
                post.audioTracks ||
                post.shadowingAudioUrl ||
                post.paragraphs?.some((p) => p.audioTimestampStart !== undefined)
              );

              // Accurately check quiz count with both questions array and questionCount
              const postQuizCount = post.questions?.length ?? post.questionCount ?? 0;
              const hasQuiz = postQuizCount > 0;

              const postVocabCount = post.vocabularies?.length ?? post.vocabCount ?? 0;
              const previewVocabs = post.vocabularies?.slice(0, 5) || [];
              const remainingVocabs = postVocabCount > 5 ? postVocabCount - 5 : 0;

              return (
                <div key={post.id} className="relative group">
                  {/* Step Marker Circle on Vertical Line */}
                  <div className="absolute -left-6 md:-left-8 top-5 w-6 h-6 rounded-full bg-rice-paper dark:bg-heritage-dark border-2 border-antique-gold flex items-center justify-center text-[10px] font-mono font-bold text-heritage-green dark:text-antique-bright shadow-xs z-10">
                    {chapterNum < 10 ? `0${chapterNum}` : chapterNum}
                  </div>

                  {/* Chapter Card (Horizontal card in vertical flow) */}
                  <div className="p-4 md:p-5 rounded-2xl bg-rice-paper dark:bg-heritage-dark border border-antique-gold/30 shadow-xs hover:border-antique-gold/60 transition-all space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        {post.imageUrl ? (
                          <div className="w-16 h-14 rounded-xl overflow-hidden border border-antique-gold/25 shrink-0 bg-stone-200">
                            <img src={post.imageUrl} alt="" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-16 h-14 rounded-xl bg-antique-gold/15 text-antique-gold flex items-center justify-center shrink-0 border border-antique-gold/25">
                            <BookOpen className="w-5 h-5" />
                          </div>
                        )}

                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 rounded bg-antique-gold/20 text-antique-gold border border-antique-gold/30">
                              Chương {chapterNum}
                            </span>
                            <span className={`text-[10px] font-extrabold px-2 py-0.2 rounded-full border ${getLevelBadgeClass(post.level)}`}>
                              {post.level}
                            </span>
                            {post.readTime && (
                              <span className="inline-flex items-center gap-0.5 text-[10px] text-text-muted">
                                <Clock className="w-3 h-3 text-antique-gold/70" />
                                <span>{post.readTime}</span>
                              </span>
                            )}
                          </div>

                          <h3 className="font-heading font-bold text-sm text-heritage-green dark:text-warm-ivory line-clamp-1 group-hover:text-antique-gold transition-colors">
                            {post.titleEn}
                          </h3>
                          <p className="text-[11px] text-text-muted line-clamp-1 italic">
                            {post.titleVi}
                          </p>
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-start">
                        <button
                          type="button"
                          onClick={() => setPreviewPost(post)}
                          className="p-1.5 rounded-lg border border-antique-gold/30 hover:bg-antique-gold/15 text-heritage-green dark:text-antique-bright transition-colors cursor-pointer"
                          title="Xem trước bài đọc"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => navigate(getLocalizedPath(`/admin/posts/${post.id}/edit`, currentLang))}
                          className="px-2.5 py-1.5 rounded-lg bg-antique-gold/20 hover:bg-antique-gold/35 text-heritage-green dark:text-antique-bright text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                          title="Chỉnh sửa bài đọc"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-antique-gold" />
                          <span>Sửa</span>
                        </button>
                      </div>
                    </div>

                    {/* Readiness Status Row */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-antique-gold/15 text-[11px]">
                      {/* Reading status */}
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold border ${
                        hasParagraphs
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300/60'
                          : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-300/60'
                      }`}>
                        <FileText className="w-3 h-3" />
                        <span>{hasParagraphs ? `${paragraphCount} đoạn văn` : 'Chưa có bài đọc'}</span>
                      </span>

                      {/* Audio status */}
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold border ${
                        hasAudio
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300/60'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-500 border-stone-200 dark:border-stone-700'
                      }`}>
                        <Volume2 className="w-3 h-3" />
                        <span>{hasAudio ? 'Đã có audio' : 'Chưa có audio'}</span>
                      </span>

                      {/* Quiz status (Accurately computed) */}
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold border ${
                        hasQuiz
                          ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border-purple-300/60'
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-500 border-stone-200 dark:border-stone-700'
                      }`}>
                        <HelpCircle className="w-3 h-3" />
                        <span>{hasQuiz ? `${postQuizCount} câu trắc nghiệm` : 'Chưa có quiz'}</span>
                      </span>

                      {/* Vocab count pill */}
                      <button
                        type="button"
                        onClick={() => setVocabDrawerPost(post)}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/50 text-blue-800 dark:text-blue-300 border border-blue-300/60 transition-colors cursor-pointer"
                        title="Xem danh sách từ vựng chi tiết"
                      >
                        <Type className="w-3 h-3" />
                        <span>{postVocabCount} từ vựng</span>
                      </button>
                    </div>

                    {/* Preview Vocabs Chips (Gọn gàng, click để mở Drawer nghe phát âm) */}
                    {previewVocabs.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] text-text-muted font-medium mr-1">Từ vựng trọng tâm:</span>
                        {previewVocabs.map((vocab, vIdx) => (
                          <button
                            key={vIdx}
                            type="button"
                            onClick={() => setVocabDrawerPost(post)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] bg-warm-ivory dark:bg-white/5 hover:bg-antique-gold/20 text-heritage-green dark:text-warm-ivory border border-antique-gold/25 transition-colors cursor-pointer"
                            title={`Xem chi tiết từ: ${vocab.word}`}
                          >
                            <span className="font-semibold">{vocab.word}</span>
                            {vocab.pos && <span className="text-[9px] text-text-muted">({vocab.pos})</span>}
                          </button>
                        ))}
                        {remainingVocabs > 0 && (
                          <button
                            type="button"
                            onClick={() => setVocabDrawerPost(post)}
                            className="text-[10px] font-bold text-antique-gold hover:underline cursor-pointer pl-1"
                          >
                            +{remainingVocabs} từ nữa
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Bottom Add Chapter Node */}
            <div className="relative pt-2">
              <div className="absolute -left-6 md:-left-8 top-5 w-6 h-6 rounded-full border-2 border-dashed border-antique-gold/50 flex items-center justify-center text-[10px] font-mono font-bold text-text-muted z-10 bg-warm-ivory dark:bg-heritage-forest">
                +
              </div>
              <button
                type="button"
                onClick={() => navigate(getLocalizedPath(`/admin/posts/new?journeyId=${encodeURIComponent(journey.id)}`, currentLang))}
                className="w-full p-4 rounded-2xl border-2 border-dashed border-antique-gold/40 hover:border-antique-gold bg-rice-paper/50 hover:bg-rice-paper dark:bg-white/5 dark:hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-xs font-bold text-heritage-green dark:text-antique-bright cursor-pointer"
              >
                <Plus className="w-4 h-4 text-antique-gold" />
                <span>Thêm chặng tiếp theo vào hành trình này</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Drawers & Modals ─────────────────────────────────────────── */}

      {/* Post Vocab Drawer (Xem nhanh từ vựng bài đọc) */}
      <PostVocabDrawer
        isOpen={Boolean(vocabDrawerPost)}
        post={vocabDrawerPost}
        onClose={() => setVocabDrawerPost(null)}
        onNavigateToVocabTab={(word) => {
          setVocabDrawerPost(null);
          navigate(getLocalizedPath(`/admin/content?tab=vocabularies&search=${encodeURIComponent(word)}`, currentLang));
        }}
        onEditPost={(p) => {
          setVocabDrawerPost(null);
          navigate(getLocalizedPath(`/admin/posts/${p.id}/edit`, currentLang));
        }}
      />

      {/* Post Preview Modal */}
      <PostPreviewModal
        post={previewPost}
        onClose={() => setPreviewPost(null)}
      />

      {/* Journey Edit Form Modal */}
      <JourneyFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={(updated) => {
          setJourney(updated);
          setIsEditModalOpen(false);
          setSuccessToast(`Đã cập nhật hành trình: ${updated.titleEn}`);
          setTimeout(() => setSuccessToast(null), 3000);
        }}
        initialData={journey}
      />

      {/* Delete Confirmation Dialog */}
      {isDeleteConfirmOpen && (
        <AdminDialog
          title="Xác nhận xóa hành trình học"
          onClose={() => setIsDeleteConfirmOpen(false)}
        >
          <div className="space-y-4">
            <p className="text-xs text-text-muted leading-relaxed">
              Bạn có chắc chắn muốn xóa hành trình <strong className="text-heritage-green dark:text-warm-ivory">{journey.titleEn}</strong> không?
              Các bài đọc thuộc hành trình này sẽ được giữ lại an toàn và chuyển thành bài đọc độc lập (standalone).
            </p>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl border border-antique-gold/30 text-xs font-semibold hover:bg-antique-gold/10 cursor-pointer disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleDeleteJourney}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow-md transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeleting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{isDeleting ? 'Đang xóa...' : 'Xác nhận xóa'}</span>
              </button>
            </div>
          </div>
        </AdminDialog>
      )}
    </div>
  );
};

export default AdminJourneyDetailPage;
