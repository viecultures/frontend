import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Compass,
  Plus,
  Search,
  RefreshCw,
  Edit3,
  Trash2,
  MapPin,
  Layers,
  LayoutTemplate,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Calendar,
  Clock,
} from 'lucide-react';
import type { LearningJourneyItem, ReadingPostItem } from '../types/adminTypes';
import { journeyAdminService, type JourneyFilterParams } from '../services/journeyAdminService';
import { postAdminService } from '../services/postAdminService';
import { JourneyFormModal } from './JourneyFormModal';
import { JourneyCanvasModal } from './JourneyCanvasModal';
import { VIETNAM_34_PROVINCES } from '@/data/vietnamMapData';

export const JourneyManagementView: React.FC = () => {
  const navigate = useNavigate();
  const [journeys, setJourneys] = useState<LearningJourneyItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJourney, setEditingJourney] = useState<LearningJourneyItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Whiteboard Canvas State
  const [canvasJourney, setCanvasJourney] = useState<LearningJourneyItem | null>(null);
  const [canvasPosts, setCanvasPosts] = useState<ReadingPostItem[]>([]);
  const [isLoadingCanvasPosts, setIsLoadingCanvasPosts] = useState(false);

  const handleOpenCanvas = async (journey: LearningJourneyItem) => {
    setCanvasJourney(journey);
    setIsLoadingCanvasPosts(true);
    try {
      const posts = await postAdminService.getPosts({ journeyId: journey.id });
      setCanvasPosts(posts);
    } catch (err: unknown) {
      console.error('Lỗi tải bài viết cho Whiteboard Canvas:', err);
      setCanvasPosts([]);
    } finally {
      setIsLoadingCanvasPosts(false);
    }
  };

  const handleViewJourneyPosts = (journeyId: string) => {
    navigate(`/admin/content?tab=posts&journeyId=${encodeURIComponent(journeyId)}`);
  };

  const fetchJourneys = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const params: JourneyFilterParams = {};
      if (searchQuery.trim()) params.query = searchQuery.trim();
      if (selectedRegion) params.region = selectedRegion;
      if (selectedTheme) params.theme = selectedTheme;
      if (selectedStatus) params.status = selectedStatus;

      const data = await journeyAdminService.getJourneys(params);
      setJourneys(data);
    } catch (err: unknown) {
      console.error('Lỗi tải hành trình học:', err);
      setErrorMsg((err instanceof Error ? err.message : '') || 'Không thể tải danh sách hành trình học.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJourneys();
  }, [selectedRegion, selectedTheme, selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchJourneys();
  };

  const handleOpenCreate = () => {
    setEditingJourney(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (item: LearningJourneyItem) => {
    setEditingJourney(item);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await journeyAdminService.deleteJourney(id);
      setJourneys((prev) => prev.filter((j) => j.id !== id));
      setSuccessToast('Đã xóa hành trình học thành công.');
      setTimeout(() => setSuccessToast(null), 3000);
    } catch (err: unknown) {
      console.error('Lỗi xóa hành trình học:', err);
      setErrorMsg((err instanceof Error ? err.message : '') || 'Lỗi khi xóa hành trình.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaved = (saved: LearningJourneyItem) => {
    setSuccessToast(`Đã lưu hành trình: ${saved.titleEn}`);
    setTimeout(() => setSuccessToast(null), 3000);
    fetchJourneys();
  };

  const getProvinceName = (provId: string) => {
    const prov = VIETNAM_34_PROVINCES.find((p) => p.id === provId);
    return prov ? prov.name : provId;
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  const getStatusBadge = (status?: string, scheduledAt?: string) => {
    switch (status) {
      case 'published':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-300/40">
            Xuất bản
          </span>
        );
      case 'scheduled':
        return (
          <span
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border border-purple-300/40"
            title={scheduledAt ? `Lên lịch xuất bản lúc: ${formatDate(scheduledAt)}` : 'Lên lịch xuất bản tự động'}
          >
            <Clock aria-hidden="true" className="w-3 h-3 text-purple-600 dark:text-purple-300" />
            <span>Lên lịch{scheduledAt ? `: ${formatDate(scheduledAt)}` : ''}</span>
          </span>
        );
      case 'upcoming':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-300/40">
            Sắp ra mắt
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300 border border-stone-300/40">
            Bản nháp
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast notification */}
      {successToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
          <CheckCircle2 aria-hidden="true" className="w-4 h-4 text-emerald-600" />
          <span>{successToast}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs font-semibold text-red-800 dark:text-red-200 flex items-center gap-2">
          <AlertCircle aria-hidden="true" className="w-4 h-4 text-red-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Control Toolbar */}
      <div className="p-5 rounded-3xl bg-rice-paper dark:bg-heritage-dark border border-antique-gold/30 shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search
              aria-hidden="true"
              className="w-4 h-4 text-antique-gold absolute left-3.5 top-1/2 -translate-y-1/2"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm hành trình theo tên, mã slug, mô tả..."
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-antique-gold/30 bg-warm-ivory/50 dark:bg-white/5 text-xs focus:outline-none focus:ring-2 focus:ring-antique-gold"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-antique-gold/20 text-heritage-green dark:text-antique-bright font-bold text-xs hover:bg-antique-gold/30 transition-colors cursor-pointer"
          >
            Tìm
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="px-3 py-2 rounded-xl border border-antique-gold/30 bg-warm-ivory/50 dark:bg-white/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-antique-gold"
          >
            <option value="">Tất cả miền</option>
            <option value="north">Miền Bắc</option>
            <option value="central">Miền Trung</option>
            <option value="south">Miền Nam</option>
          </select>

          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            className="px-3 py-2 rounded-xl border border-antique-gold/30 bg-warm-ivory/50 dark:bg-white/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-antique-gold"
          >
            <option value="">Tất cả chủ đề</option>
            <option value="cuisine">Ẩm thực</option>
            <option value="places">Danh lam & Di sản</option>
            <option value="crafts">Làng nghề</option>
            <option value="festivals">Lễ hội</option>
            <option value="history">Lịch sử</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-antique-gold/30 bg-warm-ivory/50 dark:bg-white/5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-antique-gold"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="published">Xuất bản</option>
            <option value="scheduled">Lên lịch</option>
            <option value="upcoming">Sắp ra mắt</option>
            <option value="draft">Bản nháp</option>
          </select>

          <button
            onClick={fetchJourneys}
            className="p-2.5 rounded-xl border border-antique-gold/30 hover:bg-antique-gold/15 transition-colors cursor-pointer text-text-muted hover:text-heritage-green"
            title="Tải lại danh sách"
          >
            <RefreshCw aria-hidden="true" className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 rounded-xl bg-heritage-green text-warm-ivory font-bold text-xs hover:bg-heritage-forest shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus aria-hidden="true" className="w-4 h-4 text-antique-gold" />
            <span>Tạo hành trình mới</span>
          </button>
        </div>
      </div>

      {/* Journeys List */}
      <div className="rounded-3xl bg-rice-paper dark:bg-heritage-dark border border-antique-gold/30 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-xs text-text-muted flex flex-col items-center gap-3">
            <RefreshCw aria-hidden="true" className="w-6 h-6 animate-spin text-antique-gold" />
            <span>Đang tải danh sách hành trình học...</span>
          </div>
        ) : journeys.length === 0 ? (
          <div className="p-12 text-center text-xs text-text-muted space-y-3">
            <Compass aria-hidden="true" className="w-10 h-10 text-antique-gold/50 mx-auto" />
            <p className="font-semibold text-sm text-heritage-green dark:text-warm-ivory">
              Chưa có hành trình học nào phù hợp.
            </p>
            <p>Nhấp vào nút "Tạo hành trình mới" để khởi tạo chuỗi bài đọc theo bản đồ.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-warm-ivory/60 dark:bg-white/5 border-b border-antique-gold/25 font-bold text-heritage-green dark:text-antique-bright uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3.5">Hành trình học</th>
                  <th className="px-4 py-3.5">Vùng & Tỉnh thành</th>
                  <th className="px-4 py-3.5">Chủ đề</th>
                  <th className="px-4 py-3.5 text-center">Số chặng</th>
                  <th className="px-4 py-3.5">Ngày tạo</th>
                  <th className="px-4 py-3.5">Trạng thái</th>
                  <th className="px-5 py-3.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-antique-gold/15">
                {journeys.map((j) => (
                  <tr
                    key={j.id}
                    className="hover:bg-warm-ivory/50 dark:hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-5 py-4 max-w-md">
                      <div className="flex items-center gap-3">
                        {j.imageUrl ? (
                          <div className="w-14 h-12 rounded-xl overflow-hidden border border-antique-gold/30 shrink-0 bg-stone-200">
                            <img src={j.imageUrl} alt="" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-14 h-12 rounded-xl bg-antique-gold/15 text-antique-gold flex items-center justify-center shrink-0 font-bold">
                            <Compass aria-hidden="true" className="w-5 h-5" />
                          </div>
                        )}
                        <div className="space-y-0.5 min-w-0">
                          <span className="font-mono text-[10px] text-antique-gold font-bold">
                            #{j.id}
                          </span>
                          <h4 className="font-heading font-bold text-sm text-heritage-green dark:text-warm-ivory line-clamp-1 group-hover:text-antique-gold transition-colors">
                            {j.titleEn}
                          </h4>
                          <p className="text-[11px] text-text-muted line-clamp-1 italic">
                            {j.titleVi}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-white/60 dark:bg-white/10 border border-antique-gold/20">
                          <MapPin aria-hidden="true" className="w-3 h-3 text-antique-gold" />
                          <span>{getProvinceName(j.provinceId)}</span>
                        </span>
                        <div className="text-[10px] text-text-muted capitalize">
                          {j.region === 'north'
                            ? 'Miền Bắc'
                            : j.region === 'central'
                            ? 'Miền Trung'
                            : 'Miền Nam'}
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap capitalize text-text-secondary font-medium">
                      {j.theme}
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap text-center">
                      <button
                        type="button"
                        onClick={() => handleViewJourneyPosts(j.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-antique-gold/15 hover:bg-antique-gold/30 text-heritage-green dark:text-antique-bright border border-antique-gold/30 transition-colors cursor-pointer"
                        title="Xem danh sách bài viết thuộc lộ trình này"
                      >
                        <Layers aria-hidden="true" className="w-3 h-3 text-antique-gold" />
                        <span>{j.chapters?.length || 0} chặng</span>
                      </button>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap text-text-muted text-[11px] font-mono">
                      <div className="flex items-center gap-1.5">
                        <Calendar aria-hidden="true" className="w-3.5 h-3.5 text-antique-gold/70 shrink-0" />
                        <span>{formatDate(j.createdAt)}</span>
                      </div>
                    </td>

                    <td className="px-4 py-4 whitespace-nowrap">{getStatusBadge(j.status, j.scheduledPublishAt)}</td>

                    <td className="px-5 py-4 whitespace-nowrap text-right space-x-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenCanvas(j)}
                        className="p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors cursor-pointer"
                        title="Mở Whiteboard / Toàn cảnh lộ trình"
                      >
                        <LayoutTemplate aria-hidden="true" className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(j)}
                        className="p-1.5 rounded-lg text-antique-gold hover:bg-antique-gold/15 transition-colors cursor-pointer"
                        title="Chỉnh sửa hành trình"
                      >
                        <Edit3 aria-hidden="true" className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingId(j.id)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
                        title="Xóa hành trình"
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

      {/* Form Modal */}
      <JourneyFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingJourney(null);
        }}
        onSuccess={handleSaved}
        initialData={editingJourney}
      />

      {/* Delete Confirmation Dialog */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-rice-paper dark:bg-heritage-dark border border-antique-gold/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <h3 className="font-heading font-bold text-base text-heritage-green dark:text-warm-ivory">
              Xác nhận xóa hành trình học
            </h3>
            <p className="text-xs text-text-muted leading-relaxed">
              Bạn có chắc chắn muốn xóa hành trình này không? Các bài đọc bên trong sẽ được giữ lại
              và chuyển thành bài đọc độc lập (standalone).
            </p>
            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl border border-antique-gold/30 text-xs font-semibold hover:bg-antique-gold/10"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deletingId)}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow-md"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Journey Whiteboard / Canvas Modal */}
      <JourneyCanvasModal
        isOpen={Boolean(canvasJourney)}
        journey={canvasJourney}
        posts={canvasPosts}
        isLoadingPosts={isLoadingCanvasPosts}
        onClose={() => setCanvasJourney(null)}
        onSelectPost={(post) => {
          setCanvasJourney(null);
          navigate(`/admin/content?tab=posts&journeyId=${encodeURIComponent(post.journeyId || canvasJourney?.id || '')}`);
        }}
        onViewVocab={(post) => {
          setCanvasJourney(null);
          navigate(`/admin/content?tab=posts&journeyId=${encodeURIComponent(post.journeyId || canvasJourney?.id || '')}`);
        }}
        onEditJourney={(j) => {
          setCanvasJourney(null);
          handleOpenEdit(j);
        }}
        onAddChapter={(j) => {
          setCanvasJourney(null);
          navigate(`/admin/content?tab=posts&journeyId=${encodeURIComponent(j.id)}`);
        }}
      />
    </div>
  );
};
