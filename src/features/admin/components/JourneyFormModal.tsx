import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Compass,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Layers,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import type {
  LearningJourneyPayload,
  LearningJourneyItem,
  ReadingPostItem,
} from '../types/adminTypes';
import { journeyAdminService } from '../services/journeyAdminService';
import { postAdminService } from '../services/postAdminService';
import { AdminDialog } from './AdminDialog';
import { VIETNAM_34_PROVINCES } from '@/data/vietnamMapData';

interface JourneyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (savedJourney: LearningJourneyItem) => void;
  initialData?: LearningJourneyItem | null;
}

const THEME_OPTIONS = [
  { value: 'cuisine', labelEn: 'Cuisine', labelVi: 'Ẩm thực & Phong vị' },
  { value: 'places', labelEn: 'Heritage Places', labelVi: 'Danh lam & Di sản' },
  { value: 'crafts', labelEn: 'Traditional Crafts', labelVi: 'Làng nghề truyền thống' },
  { value: 'festivals', labelEn: 'Festivals & Folklore', labelVi: 'Lễ hội & Dân gian' },
  { value: 'history', labelEn: 'History', labelVi: 'Lịch sử văn hóa' },
];

const REGION_OPTIONS = [
  { value: 'north', label: 'Miền Bắc (Northern)' },
  { value: 'central', label: 'Miền Trung (Central)' },
  { value: 'south', label: 'Miền Nam (Southern)' },
];

const STATUS_OPTIONS = [
  { value: 'published', label: 'Đã xuất bản (Published)' },
  { value: 'draft', label: 'Bản nháp (Draft)' },
  { value: 'upcoming', label: 'Sắp ra mắt (Upcoming)' },
];

export const JourneyFormModal: React.FC<JourneyFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}) => {
  const isEdit = Boolean(initialData?.id);

  const [id, setId] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [titleVi, setTitleVi] = useState('');
  const [theme, setTheme] = useState('cuisine');
  const [region, setRegion] = useState('north');
  const [provinceId, setProvinceId] = useState('ha-noi');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState('published');

  // Chapter posts selection
  const [allAvailablePosts, setAllAvailablePosts] = useState<ReadingPostItem[]>([]);
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);
  const [selectedPostToAdd, setSelectedPostToAdd] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load available posts
  useEffect(() => {
    if (!isOpen) return;

    postAdminService
      .getPosts()
      .then((data) => setAllAvailablePosts(data))
      .catch((err) => console.error('Lỗi nạp bài đọc:', err));
  }, [isOpen]);

  // Sync initialData
  useEffect(() => {
    if (initialData) {
      setId(initialData.id || '');
      setTitleEn(initialData.titleEn || '');
      setTitleVi(initialData.titleVi || '');
      setTheme(initialData.theme || 'cuisine');
      setRegion(initialData.region || 'north');
      setProvinceId(initialData.provinceId || 'ha-noi');
      setDescription(initialData.description || '');
      setImageUrl(initialData.imageUrl || '');
      setStatus(initialData.status || 'published');

      if (initialData.chapters && initialData.chapters.length > 0) {
        setSelectedPostIds(initialData.chapters.map((c) => c.id));
      } else {
        setSelectedPostIds(initialData.chapterPostIds || []);
      }
    } else {
      setId('');
      setTitleEn('');
      setTitleVi('');
      setTheme('cuisine');
      setRegion('north');
      setProvinceId('ha-noi');
      setDescription('');
      setImageUrl('');
      setStatus('published');
      setSelectedPostIds([]);
    }
    setErrorMsg(null);
  }, [initialData, isOpen]);

  // Auto slug generator
  const handleTitleEnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitleEn(val);
    if (!isEdit && !id) {
      const slug = val
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setId(slug);
    }
  };

  const filteredProvinces = VIETNAM_34_PROVINCES.filter(
    (p) => !region || p.region === region
  );

  const handleAddChapter = () => {
    if (!selectedPostToAdd) return;
    if (selectedPostIds.includes(selectedPostToAdd)) return;
    setSelectedPostIds([...selectedPostIds, selectedPostToAdd]);
    setSelectedPostToAdd('');
  };

  const handleRemoveChapter = (postId: string) => {
    setSelectedPostIds(selectedPostIds.filter((p) => p !== postId));
  };

  const handleMoveChapter = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= selectedPostIds.length) return;
    const nextList = [...selectedPostIds];
    const temp = nextList[index];
    nextList[index] = nextList[targetIdx];
    nextList[targetIdx] = temp;
    setSelectedPostIds(nextList);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEn.trim() || !titleVi.trim()) {
      setErrorMsg('Vui lòng nhập đầy đủ tiêu đề tiếng Anh và tiếng Việt.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const payload: LearningJourneyPayload = {
      id: id.trim() || undefined,
      titleEn: titleEn.trim(),
      titleVi: titleVi.trim(),
      theme,
      provinceId,
      region,
      description: description.trim(),
      imageUrl: imageUrl.trim() || undefined,
      status,
      chapterPostIds: selectedPostIds,
    };

    try {
      let saved: LearningJourneyItem;
      if (isEdit && initialData?.id) {
        saved = await journeyAdminService.updateJourney(initialData.id, payload);
      } else {
        saved = await journeyAdminService.createJourney(payload);
      }
      onSuccess(saved);
      onClose();
    } catch (err: unknown) {
      console.error('Lỗi lưu hành trình học:', err);
      setErrorMsg((err instanceof Error ? err.message : '') || 'Đã có lỗi xảy ra khi lưu hành trình.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AdminDialog
      title={isEdit ? 'Chỉnh sửa Hành trình học' : 'Tạo mới Hành trình học'}
      onClose={onClose}
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-4xl max-h-[85vh] overflow-y-auto bg-rice-paper dark:bg-heritage-dark border border-antique-gold/40 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6"
      >
        <div className="flex items-center justify-between border-b border-antique-gold/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-antique-gold/15 text-antique-gold flex items-center justify-center font-bold">
              <Compass aria-hidden="true" className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-heading font-bold text-heritage-green dark:text-warm-ivory">
                {isEdit ? 'Chỉnh sửa Hành trình học' : 'Khởi tạo Hành trình học mới'}
              </h2>
              <p className="text-xs text-text-muted">
                Chuỗi trải nghiệm văn hóa đa chặng gắn liền với bản đồ và địa phương
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-text-muted hover:bg-antique-gold/10 hover:text-heritage-green transition-colors cursor-pointer"
          >
            <X aria-hidden="true" className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-center gap-2.5 text-xs text-red-700 dark:text-red-300">
            <AlertCircle aria-hidden="true" className="w-4 h-4 shrink-0 text-red-500" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-body dark:text-warm-ivory">
              Tiêu đề Tiếng Anh (Title EN) *
            </label>
            <input
              type="text"
              required
              value={titleEn}
              onChange={handleTitleEnChange}
              placeholder="VD: Pho in Hanoi"
              className="w-full px-3.5 py-2.5 rounded-xl border border-antique-gold/30 bg-warm-ivory/50 dark:bg-white/5 text-sm focus:outline-none focus:ring-2 focus:ring-antique-gold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-body dark:text-warm-ivory">
              Tiêu đề Tiếng Việt (Title VI) *
            </label>
            <input
              type="text"
              required
              value={titleVi}
              onChange={(e) => setTitleVi(e.target.value)}
              placeholder="VD: Phở Hà Nội"
              className="w-full px-3.5 py-2.5 rounded-xl border border-antique-gold/30 bg-warm-ivory/50 dark:bg-white/5 text-sm focus:outline-none focus:ring-2 focus:ring-antique-gold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-body dark:text-warm-ivory">
              Định danh Slug / ID (Khuyến nghị dạng slug)
            </label>
            <input
              type="text"
              value={id}
              disabled={isEdit}
              onChange={(e) => setId(e.target.value)}
              placeholder="VD: pho-in-hanoi"
              className="w-full px-3.5 py-2.5 rounded-xl border border-antique-gold/30 bg-warm-ivory/50 dark:bg-white/5 text-sm font-mono text-xs focus:outline-none focus:ring-2 focus:ring-antique-gold disabled:opacity-60"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-body dark:text-warm-ivory">
              Chủ đề trải nghiệm (Theme)
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-antique-gold/30 bg-warm-ivory/50 dark:bg-white/5 text-sm focus:outline-none focus:ring-2 focus:ring-antique-gold"
            >
              {THEME_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.labelVi} ({opt.labelEn})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-body dark:text-warm-ivory">
              Vùng miền (Region)
            </label>
            <select
              value={region}
              onChange={(e) => {
                const nextRegion = e.target.value;
                setRegion(nextRegion);
                const available = VIETNAM_34_PROVINCES.filter((p) => p.region === nextRegion);
                if (available.length > 0 && !available.some((p) => p.id === provinceId)) {
                  setProvinceId(available[0].id);
                }
              }}
              className="w-full px-3.5 py-2.5 rounded-xl border border-antique-gold/30 bg-warm-ivory/50 dark:bg-white/5 text-sm focus:outline-none focus:ring-2 focus:ring-antique-gold"
            >
              {REGION_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-body dark:text-warm-ivory">
              Tỉnh thành trực thuộc (Province)
            </label>
            <select
              value={provinceId}
              onChange={(e) => setProvinceId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-antique-gold/30 bg-warm-ivory/50 dark:bg-white/5 text-sm focus:outline-none focus:ring-2 focus:ring-antique-gold"
            >
              {filteredProvinces.map((prov) => (
                <option key={prov.id} value={prov.id}>
                  {prov.name} ({prov.id})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-text-body dark:text-warm-ivory">
              Ảnh bìa Hành trình (Image URL)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://... hoặc /images/series/..."
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-antique-gold/30 bg-warm-ivory/50 dark:bg-white/5 text-sm focus:outline-none focus:ring-2 focus:ring-antique-gold"
              />
              {imageUrl && (
                <div className="w-11 h-10 rounded-xl overflow-hidden border border-antique-gold/30 shrink-0 bg-stone-200">
                  <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-bold text-text-body dark:text-warm-ivory">
              Mô tả tóm tắt hành trình (Description)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tóm tắt nội dung các chặng và giá trị văn hóa học viên sẽ trải nghiệm..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-antique-gold/30 bg-warm-ivory/50 dark:bg-white/5 text-sm focus:outline-none focus:ring-2 focus:ring-antique-gold"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-body dark:text-warm-ivory">
              Trạng thái (Status)
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-antique-gold/30 bg-warm-ivory/50 dark:bg-white/5 text-sm focus:outline-none focus:ring-2 focus:ring-antique-gold"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Quản lý các Chặng bài đọc (Chapters Management) ─────────────── */}
        <div className="p-4 sm:p-5 rounded-2xl bg-warm-ivory/40 dark:bg-white/5 border border-antique-gold/30 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h3 className="font-heading font-bold text-sm text-heritage-green dark:text-warm-ivory flex items-center gap-1.5">
                <Layers aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                <span>Danh sách các chặng bài đọc ({selectedPostIds.length} chặng)</span>
              </h3>
              <p className="text-[11px] text-text-muted">
                Khuyến khích cấu trúc chuẩn 3 chặng để hiển thị hoàn hảo trên giao diện bản đồ
              </p>
            </div>
          </div>

          {/* Add post dropdown */}
          <div className="flex gap-2">
            <select
              value={selectedPostToAdd}
              onChange={(e) => setSelectedPostToAdd(e.target.value)}
              className="flex-1 px-3 py-2 rounded-xl border border-antique-gold/30 bg-rice-paper dark:bg-heritage-dark text-xs focus:outline-none focus:ring-2 focus:ring-antique-gold"
            >
              <option value="">-- Chọn bài đọc để thêm vào chặng tiếp theo --</option>
              {allAvailablePosts
                .filter((p) => !selectedPostIds.includes(p.id))
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.titleEn} ({p.titleVi}) · {p.level}
                  </option>
                ))}
            </select>
            <button
              type="button"
              onClick={handleAddChapter}
              disabled={!selectedPostToAdd}
              className="px-3.5 py-2 rounded-xl bg-antique-gold text-rice-paper font-bold text-xs hover:bg-antique-gold/90 disabled:opacity-50 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Plus aria-hidden="true" className="w-3.5 h-3.5" />
              <span>Thêm chặng</span>
            </button>
          </div>

          {/* List of assigned chapters */}
          {selectedPostIds.length === 0 ? (
            <div className="text-center py-5 text-xs text-text-muted italic">
              Chưa có chặng nào được gán. Hãy chọn bài đọc ở trên để thêm vào hành trình.
            </div>
          ) : (
            <div className="space-y-2">
              {selectedPostIds.map((postId, idx) => {
                const post = allAvailablePosts.find((p) => p.id === postId);
                return (
                  <div
                    key={postId}
                    className="flex items-center justify-between p-3 rounded-xl bg-rice-paper dark:bg-heritage-dark border border-antique-gold/25 text-xs gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-antique-gold/20 text-antique-gold font-bold flex items-center justify-center shrink-0 text-[11px]">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="font-bold text-heritage-green dark:text-warm-ivory truncate">
                          Chặng {idx + 1}: {post ? post.titleEn : postId}
                        </div>
                        {post?.titleVi && (
                          <div className="text-[10px] text-text-muted truncate italic">
                            {post.titleVi} · {post.level}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMoveChapter(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 rounded text-text-muted hover:text-heritage-green hover:bg-antique-gold/10 disabled:opacity-30 cursor-pointer"
                        title="Đẩy lên"
                      >
                        <ArrowUp aria-hidden="true" className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveChapter(idx, 'down')}
                        disabled={idx === selectedPostIds.length - 1}
                        className="p-1 rounded text-text-muted hover:text-heritage-green hover:bg-antique-gold/10 disabled:opacity-30 cursor-pointer"
                        title="Đẩy xuống"
                      >
                        <ArrowDown aria-hidden="true" className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveChapter(postId)}
                        className="p-1 rounded text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 cursor-pointer"
                        title="Xóa khỏi hành trình"
                      >
                        <Trash2 aria-hidden="true" className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-antique-gold/25">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-antique-gold/30 text-xs font-semibold hover:bg-antique-gold/10 transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-heritage-green text-warm-ivory font-bold text-xs hover:bg-heritage-forest shadow-md disabled:opacity-60 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {isSubmitting ? (
              <span>Đang lưu...</span>
            ) : (
              <>
                <CheckCircle2 aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                <span>{isEdit ? 'Lưu thay đổi' : 'Tạo hành trình'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </AdminDialog>
  );
};
