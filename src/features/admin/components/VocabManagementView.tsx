import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'motion/react';
import {
  BookOpen,
  Search,
  Plus,
  RefreshCw,
  Edit3,
  Trash2,
  Volume2,
  VolumeX,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  X,
  HelpCircle,
} from 'lucide-react';
import type { AdminVocabItem, PageResponse } from '../types/adminVocabTypes';
import { vocabAdminService } from '../services/vocabAdminService';
import { VocabFormModal } from './VocabFormModal';
import { AdminDialog } from './AdminDialog';

const CEFR_LEVELS = ['ALL', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;

export const VocabManagementView: React.FC = () => {
  // Data state
  const [vocabPage, setVocabPage] = useState<PageResponse<AdminVocabItem>>({
    content: [],
    totalElements: 0,
    totalPages: 0,
    page: 0,
    size: 10,
  });

  // 5-State Indicators
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Filters & Pagination State
  const [searchInput, setSearchInput] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState<number>(0);
  const pageSize = 10;

  // Modal & Action State
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<AdminVocabItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<AdminVocabItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Inline Audio Playing State
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioInstanceRef = useRef<HTMLAudioElement | null>(null);

  // Debounce search input by 350ms
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
      setCurrentPage(0);
    }, 350);

    return () => clearTimeout(handler);
  }, [searchInput]);

  // Cleanup audio instance
  useEffect(() => {
    return () => {
      if (audioInstanceRef.current) {
        audioInstanceRef.current.pause();
        audioInstanceRef.current = null;
      }
    };
  }, []);

  // Fetch vocabulary records
  const loadVocabularies = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await vocabAdminService.fetchVocabularies({
        search: debouncedSearch || undefined,
        level: selectedLevel !== 'ALL' ? selectedLevel : undefined,
        page: currentPage,
        size: pageSize,
      });

      setVocabPage(res);
    } catch (err: unknown) {
      console.error('Lỗi khi tải danh sách từ vựng:', err);
      setErrorMessage(
        (err instanceof Error ? err.message : '') ||
          'Không thể kết nối đến máy chủ quản lý từ vựng. Vui lòng kiểm tra đường truyền.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, selectedLevel, currentPage]);

  useEffect(() => {
    loadVocabularies();
  }, [loadVocabularies]);

  // Audio Playback Handler
  const handlePlayAudio = (item: AdminVocabItem) => {
    if (!item.audioUrl) return;

    if (playingId === item.id && audioInstanceRef.current) {
      audioInstanceRef.current.pause();
      audioInstanceRef.current = null;
      setPlayingId(null);
      return;
    }

    if (audioInstanceRef.current) {
      audioInstanceRef.current.pause();
    }

    try {
      const audio = new Audio(item.audioUrl);
      audioInstanceRef.current = audio;
      setPlayingId(item.id);

      audio.onended = () => {
        setPlayingId(null);
      };
      audio.onerror = () => {
        setPlayingId(null);
        setErrorMessage(`Không thể phát âm thanh của từ "${item.word}".`);
      };

      audio.play().catch(() => {
        setPlayingId(null);
      });
    } catch {
      setPlayingId(null);
    }
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingItem(null);
    setIsFormOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (item: AdminVocabItem) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  // Handle Save Success
  const handleSaveSuccess = (saved: AdminVocabItem) => {
    setSuccessToast(`Đã lưu thành công từ vựng: ${saved.word}`);
    setTimeout(() => setSuccessToast(null), 3000);
    loadVocabularies();
  };

  // Handle Delete Confirmation
  const handleConfirmDelete = async () => {
    if (!deletingItem) return;

    setIsDeleting(true);
    try {
      await vocabAdminService.deleteVocabulary(deletingItem.id);
      setSuccessToast(`Đã xóa từ vựng "${deletingItem.word}" khỏi hệ thống.`);
      setTimeout(() => setSuccessToast(null), 3000);
      setDeletingItem(null);
      loadVocabularies();
    } catch (err: unknown) {
      console.error('Lỗi khi xóa từ vựng:', err);
      setErrorMessage(
        (err instanceof Error ? err.message : '') ||
          `Không thể xóa từ vựng "${deletingItem.word}".`
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper Badge Color for CEFR
  const getLevelBadgeClass = (lvl?: string) => {
    switch ((lvl || '').toUpperCase()) {
      case 'A1':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800';
      case 'A2':
        return 'bg-teal-100 text-teal-800 border-teal-300 dark:bg-teal-950/40 dark:text-teal-300 dark:border-teal-800';
      case 'B1':
        return 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800';
      case 'B2':
        return 'bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800';
      case 'C1':
        return 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800';
      case 'C2':
        return 'bg-rose-100 text-rose-800 border-rose-300 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-300 dark:bg-stone-800 dark:text-stone-300 dark:border-stone-700';
    }
  };

  const hasFilterActive = Boolean(searchInput.trim() || selectedLevel !== 'ALL');

  return (
    <div className="space-y-6">
      {/* ── Success Toast Notification ─────────────────────────────────── */}
      {successToast && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-200 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 aria-hidden="true" className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessToast(null)}
            className="p-1 text-emerald-600 hover:text-emerald-800 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/40"
            aria-label="Đóng thông báo"
          >
            <X aria-hidden="true" className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ── 5-State: Error Banner with Retry ───────────────────────────── */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-300 dark:border-red-900 text-xs font-semibold text-red-800 dark:text-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle aria-hidden="true" className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={loadVocabularies}
            className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* ── Control Toolbar ────────────────────────────────────────────── */}
      <div className="p-5 rounded-3xl bg-rice-paper dark:bg-heritage-dark border border-antique-gold/30 shadow-xs flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search
            aria-hidden="true"
            className="w-4 h-4 text-antique-gold absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Tìm kiếm từ vựng, phiên âm IPA hoặc nghĩa tiếng Việt..."
            className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-antique-gold/30 bg-warm-ivory/60 dark:bg-white/5 text-xs text-text-body dark:text-warm-ivory placeholder:text-text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-antique-gold transition-colors"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => setSearchInput('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-body p-1"
              aria-label="Xóa từ khóa tìm kiếm"
            >
              <X aria-hidden="true" className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters and CTA Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* CEFR Level Select */}
          <div className="flex items-center gap-1.5">
            <label htmlFor="vocab-filter-level" className="sr-only">
              Lọc theo cấp độ CEFR
            </label>
            <select
              id="vocab-filter-level"
              value={selectedLevel}
              onChange={(e) => {
                setSelectedLevel(e.target.value);
                setCurrentPage(0);
              }}
              className="px-3 py-2.5 rounded-xl border border-antique-gold/30 bg-warm-ivory/60 dark:bg-white/5 text-xs font-bold text-text-body dark:text-warm-ivory focus:outline-none focus-visible:ring-2 focus-visible:ring-antique-gold cursor-pointer"
            >
              <option value="ALL">Tất cả cấp độ (CEFR)</option>
              {CEFR_LEVELS.filter((l) => l !== 'ALL').map((lvl) => (
                <option key={lvl} value={lvl}>
                  Cấp độ {lvl}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filter Button */}
          {hasFilterActive && (
            <button
              type="button"
              onClick={() => {
                setSearchInput('');
                setSelectedLevel('ALL');
                setCurrentPage(0);
              }}
              className="px-3 py-2.5 rounded-xl bg-black/5 dark:bg-white/10 hover:bg-black/10 text-xs font-bold text-text-muted hover:text-text-body transition-colors cursor-pointer"
            >
              Xóa bộ lọc
            </button>
          )}

          {/* Refresh Button */}
          <button
            type="button"
            onClick={loadVocabularies}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-antique-gold/30 bg-warm-ivory/60 dark:bg-white/5 hover:bg-antique-gold/20 text-text-muted hover:text-heritage-green dark:hover:text-antique-bright transition-colors cursor-pointer disabled:opacity-50"
            title="Làm mới danh sách từ vựng"
            aria-label="Làm mới danh sách từ vựng"
          >
            <RefreshCw
              aria-hidden="true"
              className={`w-4 h-4 ${isLoading ? 'animate-spin text-antique-gold' : ''}`}
            />
          </button>

          {/* Create Button */}
          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-heritage-green text-warm-ivory font-bold text-xs hover:bg-heritage-forest shadow-md transition-all flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-antique-gold"
          >
            <Plus aria-hidden="true" className="w-4 h-4 text-antique-gold" />
            <span>Thêm từ vựng mới</span>
          </button>
        </div>
      </div>

      {/* ── Table Container ────────────────────────────────────────────── */}
      <div className="rounded-3xl bg-rice-paper dark:bg-heritage-dark border border-antique-gold/30 shadow-xs overflow-hidden">
        {/* ── 5-State: Loading Skeleton ──────────────────────────────────── */}
        {isLoading ? (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-antique-gold/20">
              <div className="h-4 w-48 bg-antique-gold/20 rounded-md animate-pulse" />
              <div className="h-4 w-24 bg-antique-gold/20 rounded-md animate-pulse" />
            </div>
            <div className="space-y-3">
              {[...Array(6)].map((_, idx) => (
                <div
                  key={`skeleton-row-${idx}`}
                  className="p-4 rounded-2xl bg-warm-ivory/60 dark:bg-white/5 border border-antique-gold/15 flex items-center justify-between gap-4 animate-pulse"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-32 bg-antique-gold/30 rounded-md" />
                      <div className="h-4 w-12 bg-antique-gold/20 rounded-full" />
                      <div className="h-4 w-20 bg-antique-gold/15 rounded-md" />
                    </div>
                    <div className="h-3 w-3/4 bg-antique-gold/15 rounded-md" />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-12 bg-antique-gold/20 rounded-full" />
                    <div className="h-7 w-7 bg-antique-gold/20 rounded-lg" />
                    <div className="h-7 w-7 bg-antique-gold/20 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : vocabPage.content.length === 0 ? (
          /* ── 5-State: Empty View ───────────────────────────────────────── */
          <div className="py-16 px-6 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-antique-gold/15 text-antique-gold border border-antique-gold/30 flex items-center justify-center mx-auto shadow-xs">
              <BookOpen aria-hidden="true" className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-base text-heritage-green dark:text-antique-bright">
                {hasFilterActive
                  ? 'Không tìm thấy từ vựng nào khớp với bộ lọc'
                  : 'Kho từ vựng văn hóa hiện đang trống'}
              </h3>
              <p className="text-xs text-text-muted max-w-md mx-auto">
                {hasFilterActive
                  ? 'Hãy thử thay đổi từ khóa tìm kiếm hoặc đặt lại bộ lọc cấp độ CEFR.'
                  : 'Bắt đầu làm phong phú kho tàng ngôn ngữ bằng cách thêm các từ vựng di sản đầu tiên.'}
              </p>
            </div>
            <div className="pt-2">
              {hasFilterActive ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput('');
                    setSelectedLevel('ALL');
                    setCurrentPage(0);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-antique-gold/25 hover:bg-antique-gold/40 text-heritage-green dark:text-antique-bright text-xs font-bold transition-colors cursor-pointer"
                >
                  Xóa bộ lọc tìm kiếm
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleOpenCreate}
                  className="px-5 py-2.5 rounded-xl bg-heritage-green text-warm-ivory text-xs font-bold hover:bg-heritage-forest shadow-md transition-colors cursor-pointer"
                >
                  Thêm từ vựng đầu tiên
                </button>
              )}
            </div>
          </div>
        ) : (
          /* ── 5-State: Default Table ────────────────────────────────────── */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[760px]">
              <thead className="bg-warm-ivory/80 dark:bg-heritage-forest/60 border-b border-antique-gold/25 text-heritage-green dark:text-antique-bright uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="px-5 py-4">Từ vựng & Loại từ</th>
                  <th className="px-4 py-4">Phiên âm IPA</th>
                  <th className="px-4 py-4">Nghĩa tiếng Việt & Ngữ cảnh</th>
                  <th className="px-3 py-4 text-center">Cấp độ</th>
                  <th className="px-3 py-4 text-center">Lượt tra</th>
                  <th className="px-3 py-4 text-center">Âm thanh</th>
                  <th className="px-5 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-antique-gold/15">
                {vocabPage.content.map((item) => {
                  const isAudioActive = playingId === item.id;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-warm-ivory/60 dark:hover:bg-white/5 transition-colors duration-150 group"
                    >
                      {/* Cột 1: Word + POS */}
                      <td className="px-5 py-4 align-top">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-heading font-bold text-sm text-heritage-green dark:text-antique-bright group-hover:text-antique-gold transition-colors">
                              {item.word}
                            </span>
                            {item.pos && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-antique-gold/15 text-heritage-green dark:text-antique-bright border border-antique-gold/30 uppercase tracking-wider">
                                {item.pos}
                              </span>
                            )}
                          </div>
                          {item.enDefinition && (
                            <p className="text-[11px] text-text-muted line-clamp-1 italic max-w-xs">
                              {item.enDefinition}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Cột 2: IPA */}
                      <td className="px-4 py-4 align-top whitespace-nowrap">
                        <span className="font-mono text-xs text-text-body dark:text-antique-bright font-medium">
                          {item.ipa ? item.ipa : '—'}
                        </span>
                      </td>

                      {/* Cột 3: Nghĩa tiếng Việt & Câu ngữ cảnh */}
                      <td className="px-4 py-4 align-top max-w-sm">
                        <div className="space-y-1">
                          <p className="font-semibold text-text-body dark:text-warm-ivory text-xs line-clamp-2">
                            {item.viMeaning}
                          </p>
                          {item.contextSentence && (
                            <p className="text-[11px] text-text-muted italic line-clamp-2 border-l-2 border-antique-gold/40 pl-2">
                              "{item.contextSentence}"
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Cột 4: Level Badge */}
                      <td className="px-3 py-4 align-top text-center whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-xs ${getLevelBadgeClass(
                            item.level
                          )}`}
                        >
                          {item.level ? item.level.toUpperCase() : 'B1'}
                        </span>
                      </td>

                      {/* Cột 5: Lượt tra cứu */}
                      <td className="px-3 py-4 align-top text-center whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-text-secondary">
                          <TrendingUp aria-hidden="true" className="w-3 h-3 text-antique-gold" />
                          <span>{item.searchCount ?? 0}</span>
                        </span>
                      </td>

                      {/* Cột 6: Nút Audio */}
                      <td className="px-3 py-4 align-top text-center whitespace-nowrap">
                        {item.audioUrl ? (
                          <button
                            type="button"
                            onClick={() => handlePlayAudio(item)}
                            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                              isAudioActive
                                ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 border-amber-400'
                                : 'bg-warm-ivory dark:bg-white/5 hover:bg-antique-gold/20 text-heritage-green dark:text-antique-bright border-antique-gold/30'
                            }`}
                            title={isAudioActive ? 'Dừng phát âm' : 'Nghe phát âm chuẩn'}
                            aria-label={`Nghe phát âm từ ${item.word}`}
                          >
                            {isAudioActive ? (
                              <VolumeX aria-hidden="true" className="w-4 h-4 animate-pulse text-amber-600" />
                            ) : (
                              <Volume2 aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                            )}
                          </button>
                        ) : (
                          <span className="text-[11px] text-text-muted italic">—</span>
                        )}
                      </td>

                      {/* Cột 7: Thao tác Edit / Delete */}
                      <td className="px-5 py-4 align-top text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(item)}
                            className="p-1.5 rounded-lg text-antique-gold hover:bg-antique-gold/15 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-antique-gold"
                            title={`Chỉnh sửa từ vựng "${item.word}"`}
                            aria-label={`Chỉnh sửa từ vựng "${item.word}"`}
                          >
                            <Edit3 aria-hidden="true" className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeletingItem(item)}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-red-500"
                            title={`Xóa từ vựng "${item.word}"`}
                            aria-label={`Xóa từ vựng "${item.word}"`}
                          >
                            <Trash2 aria-hidden="true" className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Pagination Controls ────────────────────────────────────────── */}
        {!isLoading && vocabPage.totalElements > 0 && (
          <div className="px-6 py-4 border-t border-antique-gold/20 bg-warm-ivory/50 dark:bg-heritage-forest/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="text-text-muted">
              Hiển thị <span className="font-bold text-text-body dark:text-warm-ivory">{vocabPage.content.length}</span> trên tổng số{' '}
              <span className="font-bold text-text-body dark:text-warm-ivory">{vocabPage.totalElements}</span> từ vựng
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="px-3 py-1.5 rounded-xl border border-antique-gold/30 bg-warm-ivory/60 dark:bg-white/5 hover:bg-antique-gold/20 text-text-body dark:text-warm-ivory font-bold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-antique-gold"
                aria-label="Trang trước"
              >
                <ChevronLeft aria-hidden="true" className="w-4 h-4" />
                <span>Trước</span>
              </button>

              <div className="px-3 py-1.5 rounded-xl font-bold text-heritage-green dark:text-antique-bright">
                Trang {currentPage + 1} / {Math.max(1, vocabPage.totalPages)}
              </div>

              <button
                type="button"
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage + 1 >= vocabPage.totalPages}
                className="px-3 py-1.5 rounded-xl border border-antique-gold/30 bg-warm-ivory/60 dark:bg-white/5 hover:bg-antique-gold/20 text-text-body dark:text-warm-ivory font-bold transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-antique-gold"
                aria-label="Trang sau"
              >
                <span>Sau</span>
                <ChevronRight aria-hidden="true" className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Vocab Form Modal (Create / Edit) ────────────────────────────── */}
      <VocabFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingItem(null);
        }}
        onSuccess={handleSaveSuccess}
        initialData={editingItem}
      />

      {/* ── Delete Confirmation Dialog ─────────────────────────────────── */}
      {deletingItem && (
        <AdminDialog
          title="Xác nhận xóa từ vựng"
          onClose={() => {
            if (!isDeleting) setDeletingItem(null);
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md bg-rice-paper dark:bg-heritage-forest border border-red-300 dark:border-red-800 rounded-3xl p-6 shadow-2xl space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 flex items-center justify-center text-red-600 dark:text-red-400 mx-auto shadow-xs">
              <Trash2 aria-hidden="true" className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="font-heading font-bold text-base text-text-body dark:text-warm-ivory">
                Xóa từ vựng khỏi hệ thống?
              </h3>
              <p className="text-xs text-text-muted">
                Bạn có chắc chắn muốn xóa từ vựng{' '}
                <span className="font-bold text-red-600 dark:text-red-400">"{deletingItem.word}"</span>{' '}
                ({deletingItem.viMeaning})? Thao tác này không thể hoàn tác.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2.5 rounded-xl border border-antique-gold/30 text-xs font-bold text-text-body dark:text-warm-ivory hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-md flex items-center gap-1.5 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <RefreshCw aria-hidden="true" className="w-3.5 h-3.5 animate-spin" />
                    <span>Đang xóa...</span>
                  </>
                ) : (
                  <span>Xác nhận xóa</span>
                )}
              </button>
            </div>
          </motion.div>
        </AdminDialog>
      )}
    </div>
  );
};
