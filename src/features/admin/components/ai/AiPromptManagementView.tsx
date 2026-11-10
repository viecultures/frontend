import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  FileText,
  RotateCcw,
  Save,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Copy,
  Info,
  Layers,
  Check,
} from 'lucide-react';
import type {
  AiPromptConfigDto,
  AiPromptVariable,
  AiPromptCategory,
  UpdateAiPromptPayload,
} from '../../types/adminAiTypes';
import { adminAiConfigService } from '../../services/adminAiConfigService';
import { AdminDialog } from '../AdminDialog';

type CategoryFilter = 'ALL' | AiPromptCategory;

interface CategoryTabOption {
  key: CategoryFilter;
  label: string;
}

const CATEGORY_TABS: CategoryTabOption[] = [
  { key: 'ALL', label: 'Tất cả' },
  { key: 'COMPANION_CHAT', label: 'Trợ lý hội thoại' },
  { key: 'TRANSLATION', label: 'Dịch thuật' },
  { key: 'STT', label: 'Nhận diện giọng nói STT' },
  { key: 'MAP_AI', label: 'Bản đồ AI' },
];

const CATEGORY_LABELS: Record<AiPromptCategory, string> = {
  COMPANION_CHAT: 'Trợ lý hội thoại',
  TRANSLATION: 'Dịch thuật',
  STT: 'Nhận diện giọng nói STT',
  MAP_AI: 'Bản đồ AI',
};

export const AiPromptManagementView: React.FC = () => {
  // Main data states
  const [prompts, setPrompts] = useState<AiPromptConfigDto[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('ALL');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Per-prompt operation states
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [resettingKey, setResettingKey] = useState<string | null>(null);
  const [confirmResetPrompt, setConfirmResetPrompt] = useState<AiPromptConfigDto | null>(null);

  // Form values being edited per prompt key
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});

  // Feedback notifications (per prompt or global toast)
  const [feedback, setFeedback] = useState<{
    key: string;
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Copied variable feedback
  const [copiedVarName, setCopiedVarName] = useState<string | null>(null);

  // Textarea DOM refs for variable insertion
  const textareaRefs = useRef<Record<string, HTMLTextAreaElement | null>>({});

  // Clear feedback after 4 seconds
  useEffect(() => {
    if (!feedback) return;
    const timer = setTimeout(() => {
      setFeedback(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [feedback]);

  // Clear copied variable feedback after 2 seconds
  useEffect(() => {
    if (!copiedVarName) return;
    const timer = setTimeout(() => {
      setCopiedVarName(null);
    }, 2000);
    return () => clearTimeout(timer);
  }, [copiedVarName]);

  // Load Prompts from API
  const loadPrompts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminAiConfigService.getPrompts();
      setPrompts(data);

      // Initialize editedValues with current prompt contents
      const initialMap: Record<string, string> = {};
      data.forEach((p) => {
        initialMap[p.key] = p.currentPrompt;
      });
      setEditedValues(initialMap);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Không thể tải danh sách cấu hình Prompt';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPrompts();
  }, [loadPrompts]);

  // Text change handler
  const handleTextChange = (key: string, value: string) => {
    setEditedValues((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Variable insertion into active textarea
  const handleInsertVariable = (promptKey: string, variable: AiPromptVariable) => {
    const textarea = textareaRefs.current[promptKey];
    const insertion = `{{${variable.name}}}`;
    const currentValue = editedValues[promptKey] ?? '';

    if (textarea) {
      const start = textarea.selectionStart ?? currentValue.length;
      const end = textarea.selectionEnd ?? currentValue.length;
      const newValue = currentValue.substring(0, start) + insertion + currentValue.substring(end);
      handleTextChange(promptKey, newValue);

      // Restore focus and cursor position after insertion
      requestAnimationFrame(() => {
        textarea.focus();
        textarea.setSelectionRange(start + insertion.length, start + insertion.length);
      });
    } else {
      // Fallback: append to end
      handleTextChange(promptKey, currentValue + insertion);
    }

    // Optional copy to clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(insertion).catch(() => {});
    }
    setCopiedVarName(`${promptKey}-${variable.name}`);
  };

  // Save changes handler
  const handleSavePrompt = async (prompt: AiPromptConfigDto) => {
    const currentText = editedValues[prompt.key] ?? prompt.currentPrompt;
    if (!currentText.trim()) {
      setFeedback({
        key: prompt.key,
        type: 'error',
        message: 'Nội dung Prompt không được để trống hoàn toàn.',
      });
      return;
    }

    setSavingKey(prompt.key);
    try {
      const payload: UpdateAiPromptPayload = {
        promptText: currentText,
      };
      const updated = await adminAiConfigService.updatePrompt(prompt.key, payload);

      setPrompts((prev) => prev.map((p) => (p.key === updated.key ? updated : p)));
      setEditedValues((prev) => ({
        ...prev,
        [updated.key]: updated.currentPrompt,
      }));

      setFeedback({
        key: prompt.key,
        type: 'success',
        message: `Đã lưu thay đổi cho prompt [${updated.name}] thành công.`,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Lỗi khi lưu cấu hình Prompt';
      setFeedback({
        key: prompt.key,
        type: 'error',
        message,
      });
    } finally {
      setSavingKey(null);
    }
  };

  // Reset to default handler
  const handleConfirmReset = async () => {
    if (!confirmResetPrompt) return;
    const key = confirmResetPrompt.key;
    setResettingKey(key);
    setConfirmResetPrompt(null);

    try {
      const resetResult = await adminAiConfigService.resetPrompt(key);

      setPrompts((prev) => prev.map((p) => (p.key === resetResult.key ? resetResult : p)));
      setEditedValues((prev) => ({
        ...prev,
        [resetResult.key]: resetResult.currentPrompt,
      }));

      setFeedback({
        key,
        type: 'success',
        message: `Đã khôi phục prompt [${resetResult.name}] về nội dung mặc định của hệ thống.`,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Lỗi khi khôi phục prompt về mặc định';
      setFeedback({
        key,
        type: 'error',
        message,
      });
    } finally {
      setResettingKey(null);
    }
  };

  // Filtered prompt list
  const filteredPrompts = prompts.filter((p) => {
    if (selectedCategory === 'ALL') return true;
    return p.category === selectedCategory;
  });

  return (
    <section aria-labelledby="ai-prompts-heading" className="space-y-6">
      {/* ── HEADER ───────────────────────────────────────────────────────── */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-3xl bg-rice-paper/80 dark:bg-heritage-forest/40 border border-antique-gold/20 shadow-sm backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-heritage-green/15 text-heritage-green dark:bg-antique-gold/20 dark:text-antique-gold border border-heritage-green/30 dark:border-antique-gold/40">
              System Instruction Customizer
            </span>
          </div>
          <h2 id="ai-prompts-heading" className="font-heading text-xl sm:text-2xl font-bold text-text-body dark:text-warm-ivory flex items-center gap-2.5">
            <FileText aria-hidden="true" className="w-6 h-6 text-antique-gold shrink-0" />
            Quản lý System Prompts AI
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary dark:text-warm-ivory/70 max-w-3xl">
            Tùy biến câu lệnh gốc (System Instructions) cho từng phân hệ AI trong VieCultures: trợ lý đàm thoại di sản, dịch thuật song ngữ, và nhận diện phát âm STT.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={loadPrompts}
            disabled={loading}
            className="min-h-[44px] min-w-[44px] px-4 py-2.5 rounded-xl border border-antique-gold/30 text-text-body dark:text-warm-ivory text-xs font-semibold hover:bg-white/10 dark:hover:bg-white/5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            aria-label="Làm mới danh sách prompts"
          >
            <RefreshCw aria-hidden="true" className={`w-4 h-4 text-antique-gold ${loading ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
        </div>
      </header>

      {/* ── ERROR STATE (GLOBAL) ─────────────────────────────────────────── */}
      {error && (
        <div role="alert" className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-500/30 text-red-800 dark:text-red-300 text-xs flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2">
            <AlertCircle aria-hidden="true" className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={loadPrompts}
            className="min-h-[36px] px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer shrink-0 transition-colors"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* ── CATEGORY FILTER TABS ─────────────────────────────────────────── */}
      <div className="flex items-center gap-2 border-b border-antique-gold/20 pb-2 overflow-x-auto">
        <span className="text-xs font-bold text-text-secondary dark:text-warm-ivory/60 flex items-center gap-1.5 mr-1 shrink-0">
          <Layers aria-hidden="true" className="w-4 h-4 text-antique-gold" />
          Phân loại:
        </span>
        {CATEGORY_TABS.map((tab) => {
          const isSelected = selectedCategory === tab.key;
          const count = tab.key === 'ALL'
            ? prompts.length
            : prompts.filter((p) => p.category === tab.key).length;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setSelectedCategory(tab.key)}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-heritage-green text-warm-ivory dark:bg-antique-gold/20 dark:text-antique-gold border border-antique-gold/40 shadow-sm'
                  : 'text-text-secondary dark:text-warm-ivory/70 hover:bg-white/10 dark:hover:bg-white/5 border border-transparent'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                isSelected ? 'bg-white/20 text-warm-ivory' : 'bg-black/10 dark:bg-white/10 text-text-muted'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── LOADING SKELETON ─────────────────────────────────────────────── */}
      {loading && prompts.length === 0 && (
        <div className="space-y-6" aria-busy="true" aria-live="polite">
          {[1, 2].map((idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-rice-paper/60 dark:bg-heritage-forest/30 border border-antique-gold/15 space-y-4 animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-5 w-48 bg-black/10 dark:bg-white/10 rounded-md" />
                  <div className="h-3 w-72 bg-black/5 dark:bg-white/5 rounded-md" />
                </div>
                <div className="h-6 w-24 bg-black/10 dark:bg-white/10 rounded-full" />
              </div>
              <div className="h-44 w-full bg-black/5 dark:bg-white/5 rounded-2xl" />
              <div className="flex justify-end gap-3">
                <div className="h-10 w-28 bg-black/10 dark:bg-white/10 rounded-xl" />
                <div className="h-10 w-32 bg-black/10 dark:bg-white/10 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── EMPTY STATE ──────────────────────────────────────────────────── */}
      {!loading && filteredPrompts.length === 0 && (
        <div className="py-16 px-6 text-center rounded-3xl border-2 border-dashed border-antique-gold/25 bg-rice-paper/40 dark:bg-heritage-forest/20 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-antique-gold/15 text-antique-gold flex items-center justify-center mx-auto">
            <Sparkles aria-hidden="true" className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-heading text-base font-bold text-text-body dark:text-warm-ivory">
              Không có prompt nào trong danh mục đã chọn
            </h3>
            <p className="text-xs text-text-muted max-w-md mx-auto">
              Không tìm thấy cấu hình Prompt nào phù hợp với bộ lọc hiện tại. Hãy thử chuyển sang danh mục khác hoặc làm mới lại dữ liệu từ máy chủ.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory('ALL');
              loadPrompts();
            }}
            className="min-h-[44px] px-5 py-2 rounded-xl bg-heritage-green hover:bg-heritage-green/90 text-warm-ivory text-xs font-bold transition-all shadow-md cursor-pointer inline-flex items-center gap-2"
          >
            <RefreshCw aria-hidden="true" className="w-4 h-4" />
            <span>Xem tất cả Prompts</span>
          </button>
        </div>
      )}

      {/* ── PROMPTS LIST (CARDS) ─────────────────────────────────────────── */}
      <div className="space-y-6">
        {filteredPrompts.map((prompt) => {
          const currentText = editedValues[prompt.key] ?? prompt.currentPrompt;
          const isDirty = currentText !== prompt.currentPrompt;
          const isSaving = savingKey === prompt.key;
          const isResetting = resettingKey === prompt.key;
          const cardFeedback = feedback?.key === prompt.key ? feedback : null;

          // Character count and estimated token calculation (~4 chars/token)
          const charCount = currentText.length;
          const estimatedTokens = Math.round(charCount / 4);

          return (
            <article
              key={prompt.key}
              className="p-6 rounded-3xl bg-rice-paper/80 dark:bg-heritage-forest/40 border border-antique-gold/20 shadow-sm space-y-4 transition-all hover:border-antique-gold/40"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b border-antique-gold/15 pb-4">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-heading text-lg font-bold text-text-body dark:text-warm-ivory">
                      {prompt.name}
                    </h3>

                    {/* Key badge */}
                    <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-semibold bg-black/5 dark:bg-white/10 text-text-secondary dark:text-warm-ivory/80 border border-antique-gold/20">
                      {prompt.key}
                    </span>

                    {/* Category badge */}
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-400/30">
                      {CATEGORY_LABELS[prompt.category] || prompt.category}
                    </span>

                    {/* Status badge */}
                    {prompt.isModified ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-400/40">
                        Đã tùy chỉnh
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-400/40">
                        Mặc định
                      </span>
                    )}

                    {/* Dirty state tag */}
                    {isDirty && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-900 dark:text-amber-200 border border-amber-500/30 animate-pulse">
                        Chưa lưu thay đổi
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-text-secondary dark:text-warm-ivory/70 leading-relaxed max-w-3xl">
                    {prompt.description}
                  </p>
                </div>

                {/* Updated timestamp */}
                {prompt.updatedAt && (
                  <div className="text-[11px] text-text-muted shrink-0 text-left sm:text-right">
                    Cập nhật lần cuối: {new Date(prompt.updatedAt).toLocaleDateString('vi-VN')}
                  </div>
                )}
              </div>

              {/* Supported Variables Area */}
              {prompt.supportedVariables && prompt.supportedVariables.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-white/60 dark:bg-heritage-dark/60 border border-antique-gold/15 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-text-body dark:text-warm-ivory">
                    <Info aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                    <span>Biến số khả dụng (Nhấp vào thẻ để chèn biến vào vị trí con trỏ):</span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {prompt.supportedVariables.map((variable) => {
                      const isCopied = copiedVarName === `${prompt.key}-${variable.name}`;
                      return (
                        <button
                          key={variable.name}
                          type="button"
                          onClick={() => handleInsertVariable(prompt.key, variable)}
                          className="group min-h-[34px] px-2.5 py-1 rounded-lg bg-antique-gold/10 hover:bg-antique-gold/20 dark:bg-antique-gold/15 dark:hover:bg-antique-gold/25 border border-antique-gold/30 text-left transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                          title={`${variable.description} (Nhấp để chèn)`}
                          aria-label={`Chèn biến ${variable.name}: ${variable.description}`}
                        >
                          <span className="font-mono text-xs font-bold text-antique-gold">
                            {`{{${variable.name}}}`}
                          </span>
                          <span className="text-[10px] text-text-secondary dark:text-warm-ivory/60 max-w-[180px] truncate hidden md:inline">
                            - {variable.description}
                          </span>
                          {isCopied ? (
                            <Check aria-hidden="true" className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          ) : (
                            <Copy aria-hidden="true" className="w-3.5 h-3.5 text-antique-gold/60 group-hover:text-antique-gold shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Editor Area (Textarea with Monospace Font) */}
              <div className="space-y-1.5">
                <label
                  htmlFor={`prompt-textarea-${prompt.key}`}
                  className="block text-xs font-bold text-text-body dark:text-warm-ivory"
                >
                  Nội dung câu lệnh chỉ dẫn hệ thống (System Prompt):
                </label>

                <div className="relative">
                  <textarea
                    id={`prompt-textarea-${prompt.key}`}
                    ref={(el) => {
                      textareaRefs.current[prompt.key] = el;
                    }}
                    value={currentText}
                    onChange={(e) => handleTextChange(prompt.key, e.target.value)}
                    rows={8}
                    className="w-full p-3.5 rounded-2xl bg-white dark:bg-heritage-dark/90 border border-antique-gold/30 text-xs font-mono text-text-body dark:text-warm-ivory placeholder-text-muted focus:outline-none focus:ring-2 focus-visible:ring-amber-500 transition-colors leading-relaxed resize-y"
                    placeholder="Nhập nội dung System Prompt chỉ dẫn cho mô hình AI..."
                  />
                </div>

                {/* Character & Token telemetry */}
                <div className="flex items-center justify-between text-[11px] text-text-muted px-1">
                  <span>
                    Độ dài: <strong className="font-mono text-text-body dark:text-warm-ivory">{charCount.toLocaleString('en-US')}</strong> ký tự
                  </span>
                  <span>
                    Ước lượng: ~<strong className="font-mono text-antique-gold">{estimatedTokens.toLocaleString('en-US')}</strong> tokens (~4 ký tự/token)
                  </span>
                </div>
              </div>

              {/* Inline Feedback Banner */}
              {cardFeedback && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                    cardFeedback.type === 'success'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300'
                      : 'bg-red-50 dark:bg-red-950/40 border border-red-500/30 text-red-800 dark:text-red-300'
                  }`}
                >
                  {cardFeedback.type === 'success' ? (
                    <CheckCircle2 aria-hidden="true" className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle aria-hidden="true" className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
                  )}
                  <span>{cardFeedback.message}</span>
                </div>
              )}

              {/* Card Actions */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-antique-gold/10">
                {/* Reset to Default Button */}
                <button
                  type="button"
                  onClick={() => setConfirmResetPrompt(prompt)}
                  disabled={isSaving || isResetting || (!prompt.isModified && !isDirty)}
                  className="min-h-[44px] px-4 py-2 rounded-xl border border-antique-gold/30 text-text-body dark:text-warm-ivory text-xs font-semibold hover:bg-white/10 dark:hover:bg-white/5 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  title={!prompt.isModified && !isDirty ? 'Prompt đang ở giá trị mặc định của hệ thống' : 'Khôi phục về nội dung mặc định'}
                >
                  <RotateCcw aria-hidden="true" className={`w-4 h-4 text-antique-gold ${isResetting ? 'animate-spin' : ''}`} />
                  <span>{isResetting ? 'Đang khôi phục...' : 'Khôi phục mặc định'}</span>
                </button>

                {/* Save Changes Button */}
                <button
                  type="button"
                  onClick={() => handleSavePrompt(prompt)}
                  disabled={isSaving || isResetting || !isDirty}
                  className="min-h-[44px] px-5 py-2 rounded-xl bg-heritage-green hover:bg-heritage-green/90 text-warm-ivory text-xs font-bold transition-all flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98]"
                >
                  {isSaving ? (
                    <RefreshCw aria-hidden="true" className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save aria-hidden="true" className="w-4 h-4" />
                  )}
                  <span>{isSaving ? 'Đang lưu Prompt...' : 'Lưu thay đổi'}</span>
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* ── MODAL: CONFIRM RESET TO DEFAULT ──────────────────────────────── */}
      {confirmResetPrompt && (
        <AdminDialog
          title="Xác nhận khôi phục Prompt mặc định"
          onClose={() => setConfirmResetPrompt(null)}
        >
          <div className="space-y-4 max-w-md mx-auto text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 flex items-center justify-center mx-auto">
              <RotateCcw aria-hidden="true" className="w-6 h-6" />
            </div>

            <div className="space-y-1.5">
              <h4 className="font-heading text-base font-bold text-text-body dark:text-warm-ivory">
                Khôi phục prompt [{confirmResetPrompt.name}]?
              </h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Nội dung tùy chỉnh hiện tại sẽ bị ghi đè hoàn toàn bằng prompt mặc định do hệ thống thiết lập ban đầu. Hành động này không thể hoàn tác nếu bạn chưa sao lưu lại.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmResetPrompt(null)}
                className="min-h-[44px] px-4 py-2 rounded-xl border border-antique-gold/30 text-xs font-bold cursor-pointer"
              >
                Hủy bỏ
              </button>

              <button
                type="button"
                onClick={handleConfirmReset}
                className="min-h-[44px] px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all cursor-pointer shadow-md"
              >
                Xác nhận khôi phục
              </button>
            </div>
          </div>
        </AdminDialog>
      )}
    </section>
  );
};
