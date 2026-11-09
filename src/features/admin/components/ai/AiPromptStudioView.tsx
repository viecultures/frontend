import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  Search,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertCircle,
  Copy,
  Sliders,
  Play,
  Split,
  FileCode,
  Sparkles,
  ArrowRight,
  Clock,
  Zap,
} from 'lucide-react';
import type {
  AiPromptConfigDto,
  AiPromptCategory,
  UpdateAiPromptPayload,
} from '../../types/adminAiTypes';
import { adminAiConfigService } from '../../services/adminAiConfigService';
import { AdminDialog } from '../AdminDialog';

interface AiPromptStudioViewProps {
  onNotify?: (message: string, type: 'success' | 'error') => void;
}

const CATEGORIES: { id: 'ALL' | AiPromptCategory; label: string }[] = [
  { id: 'ALL', label: 'Tất cả' },
  { id: 'COMPANION_CHAT', label: 'Trợ lý đàm thoại' },
  { id: 'TRANSLATION', label: 'Dịch thuật' },
  { id: 'STT', label: 'Nhận diện STT' },
  { id: 'MAP_AI', label: 'Bản đồ văn hóa' },
];

const MOCK_SCENARIOS = [
  {
    id: 'pho_hanoi',
    name: 'Phở Bò Hà Nội',
    context: 'Phở Hà Nội là di sản văn hóa ẩm thực đặc trưng với nước dùng ninh từ xương bò, quế, hồi, thảo quả và hành nướng thơm lừng.',
    sampleQuery: 'Điều gì làm nên hương vị thanh tao của Phở truyền thống Hà Nội?',
  },
  {
    id: 'banh_mi',
    name: 'Bánh Mì Sài Gòn',
    context: 'Bánh mì Sài Gòn đại diện cho sự giao thoa văn hóa, vỏ giòn ruột mềm ăn kèm pate gan, chả lụa, đồ chua và ngò rí cay nồng.',
    sampleQuery: 'Tell me about the street food culture surrounding Vietnamese Banh Mi.',
  },
  {
    id: 'ao_dai',
    name: 'Áo Dài Truyền Thống',
    context: 'Áo dài là trang phục truyền thống tôn vinh nét duyên dáng thanh lịch của phụ nữ Việt Nam qua nhiều thời kỳ lịch sử.',
    sampleQuery: 'Ý nghĩa văn hóa của tà Áo dài trong dịp Tết cổ truyền là gì?',
  },
];

export const AiPromptStudioView: React.FC<AiPromptStudioViewProps> = ({ onNotify }) => {
  const [prompts, setPrompts] = useState<AiPromptConfigDto[]>([]);
  const [selectedKey, setSelectedKey] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | AiPromptCategory>('ALL');

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Editor states
  const [editedValues, setEditedValues] = useState<Record<string, string>>({});
  const [activeTabMode, setActiveTabMode] = useState<'editor' | 'diff' | 'playground'>('editor');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [confirmResetKey, setConfirmResetKey] = useState<string | null>(null);
  const [copiedVariable, setCopiedVariable] = useState<string | null>(null);

  // Playground simulation states
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('pho_hanoi');
  const [playgroundQuery, setPlaygroundQuery] = useState<string>(MOCK_SCENARIOS[0].sampleQuery);
  const [playgroundRunning, setPlaygroundRunning] = useState<boolean>(false);
  const [playgroundOutput, setPlaygroundOutput] = useState<{
    reply: string;
    prompts: string[];
    latencyMs: number;
  } | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Fetch prompts
  const loadPrompts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminAiConfigService.getPrompts();
      setPrompts(data);
      if (data.length > 0 && !selectedKey) {
        setSelectedKey(data[0].key);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể tải danh sách System Prompts';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [selectedKey]);

  useEffect(() => {
    loadPrompts();
  }, [loadPrompts]);

  const activePrompt = useMemo(() => {
    return prompts.find((p) => p.key === selectedKey) || prompts[0] || null;
  }, [prompts, selectedKey]);

  // Current text being edited for active prompt
  const currentText = useMemo(() => {
    if (!activePrompt) return '';
    if (editedValues[activePrompt.key] !== undefined) {
      return editedValues[activePrompt.key];
    }
    return activePrompt.currentPrompt;
  }, [activePrompt, editedValues]);

  const isDirty = useMemo(() => {
    if (!activePrompt) return false;
    return (
      editedValues[activePrompt.key] !== undefined &&
      editedValues[activePrompt.key] !== activePrompt.currentPrompt
    );
  }, [activePrompt, editedValues]);

  const tokenEstimate = useMemo(() => {
    return Math.ceil(currentText.length / 4);
  }, [currentText]);

  // Filtered prompts
  const filteredPrompts = useMemo(() => {
    return prompts.filter((p) => {
      const matchCat = selectedCategory === 'ALL' || p.category === selectedCategory;
      const matchQuery =
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [prompts, selectedCategory, searchQuery]);

  // Text change handler
  const handleTextChange = (val: string) => {
    if (!activePrompt) return;
    setEditedValues((prev) => ({
      ...prev,
      [activePrompt.key]: val,
    }));
  };

  // Variable insertion
  const handleInsertVariable = (varName: string) => {
    const textarea = textareaRef.current;
    const placeholder = `{{${varName}}}`;
    if (!textarea) {
      handleTextChange(currentText + placeholder);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const updated = currentText.substring(0, start) + placeholder + currentText.substring(end);
    handleTextChange(updated);

    navigator.clipboard?.writeText(placeholder).catch(() => {});
    setCopiedVariable(placeholder);
    setTimeout(() => setCopiedVariable(null), 2000);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + placeholder.length, start + placeholder.length);
    }, 50);
  };

  // Save prompt
  const handleSave = async () => {
    if (!activePrompt || !isDirty || isSaving) return;
    setIsSaving(true);
    try {
      const payload: UpdateAiPromptPayload = { promptText: currentText };
      const updated = await adminAiConfigService.updatePrompt(activePrompt.key, payload);
      setPrompts((prev) => prev.map((p) => (p.key === updated.key ? updated : p)));
      setEditedValues((prev) => {
        const next = { ...prev };
        delete next[activePrompt.key];
        return next;
      });
      if (onNotify) onNotify(`Đã lưu câu lệnh [${activePrompt.name}] thành công`, 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi lưu câu lệnh';
      if (onNotify) onNotify(msg, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset prompt
  const handleConfirmReset = async () => {
    if (!confirmResetKey || isResetting) return;
    setIsResetting(true);
    try {
      const reset = await adminAiConfigService.resetPrompt(confirmResetKey);
      setPrompts((prev) => prev.map((p) => (p.key === reset.key ? reset : p)));
      setEditedValues((prev) => {
        const next = { ...prev };
        delete next[confirmResetKey];
        return next;
      });
      setConfirmResetKey(null);
      if (onNotify) onNotify(`Đã khôi phục [${reset.name}] về giá trị mặc định gốc`, 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi khôi phục câu lệnh';
      if (onNotify) onNotify(msg, 'error');
    } finally {
      setIsResetting(false);
    }
  };

  // Run Playground simulation
  const handleRunPlayground = async () => {
    if (playgroundRunning) return;
    setPlaygroundRunning(true);
    setPlaygroundOutput(null);
    const start = Date.now();

    const scenario = MOCK_SCENARIOS.find((s) => s.id === selectedScenarioId) || MOCK_SCENARIOS[0];

    // Simulate prompt execution with current active prompt
    setTimeout(() => {
      const latency = Date.now() - start + Math.floor(Math.random() * 200 + 400);
      setPlaygroundOutput({
        reply: `Dạ chào bạn! Nhắc đến ${scenario.name}, tôi lại nhớ ngay đến nét văn hóa vô cùng độc đáo của người Việt. ${scenario.context} Trong từng công đoạn, người thợ luôn gửi gắm sự chăm chút và tình yêu với ẩm thực truyền thống. Bạn có muốn cùng tôi khám phá thêm các câu chuyện dân gian gắn liền với nét đẹp này không?`,
        prompts: [
          `Nguồn gốc lịch sử hình thành nên ${scenario.name} là gì?`,
          `Có những biến thể hương vị nào giữa các vùng miền Bắc - Trung - Nam?`,
        ],
        latencyMs: latency,
      });
      setPlaygroundRunning(false);
    }, 800);
  };

  // Keyboard shortcut Ctrl+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (isDirty) {
          handleSave();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDirty, handleSave]);

  // Loading state
  if (loading) {
    return (
      <div className="w-full bg-rice-paper dark:bg-stone-900/60 border border-antique-gold/20 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-antique-gold/20">
          <div className="h-6 w-48 bg-stone-300 dark:bg-stone-800 rounded-lg animate-pulse" />
          <div className="h-9 w-32 bg-stone-300 dark:bg-stone-800 rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
          <div className="lg:col-span-4 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 bg-stone-200 dark:bg-stone-800 rounded-2xl animate-pulse" />
            ))}
          </div>
          <div className="lg:col-span-8 bg-stone-200 dark:bg-stone-800 rounded-2xl animate-pulse min-h-[400px]" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full p-8 rounded-3xl bg-red-50/80 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-red-600 dark:text-red-400 mx-auto" />
        <h3 className="font-heading text-lg font-bold text-red-900 dark:text-red-200">
          Không thể tải dữ liệu System Prompts
        </h3>
        <p className="text-xs text-red-700 dark:text-red-300 max-w-md mx-auto">{error}</p>
        <button
          type="button"
          onClick={loadPrompts}
          className="px-5 py-2.5 rounded-xl bg-red-700 text-white font-medium text-xs hover:bg-red-800 transition-colors shadow-sm cursor-pointer"
        >
          Thử tải lại dữ liệu
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* ── Compact Workspace Toolbar ────────────────────────────────────────── */}
      <div className="bg-rice-paper dark:bg-stone-900/70 border border-antique-gold/30 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-heritage-green/10 dark:bg-antique-gold/10 flex items-center justify-center text-heritage-green dark:text-antique-bright">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading text-base font-bold text-text-primary dark:text-warm-ivory">
              System Prompts Studio
            </h2>
            <p className="text-xs text-text-muted">
              Biên tập câu lệnh hệ thống, so sánh sai khác (Diff) và kiểm thử trực tiếp trên cùng một màn hình.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end md:self-auto">
          {activePrompt && (
            <button
              type="button"
              disabled={!activePrompt.isModified && !isDirty}
              onClick={() => setConfirmResetKey(activePrompt.key)}
              className="min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-semibold border border-antique-gold/40 text-text-secondary hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50/50 dark:hover:bg-red-950/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Khôi phục gốc</span>
            </button>
          )}

          <button
            type="button"
            disabled={!isDirty || isSaving}
            onClick={handleSave}
            className="min-h-[38px] px-4 py-1.5 rounded-xl text-xs font-bold bg-heritage-green hover:bg-heritage-green/90 text-warm-ivory border border-antique-gold/40 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {isSaving ? (
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>{isSaving ? 'Đang lưu...' : 'Lưu thay đổi (Ctrl+S)'}</span>
          </button>
        </div>
      </div>

      {/* ── 2-Column Master-Detail Layout ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ── Left Column: Master List (320px / 4 cols) ────────────────────── */}
        <div className="lg:col-span-4 bg-rice-paper dark:bg-stone-900/70 border border-antique-gold/30 rounded-2xl p-4 shadow-sm space-y-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm câu lệnh, key hoặc mô tả..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-warm-ivory/60 dark:bg-stone-800/80 border border-antique-gold/30 text-xs text-text-primary dark:text-warm-ivory placeholder-text-muted/60 focus:outline-none focus:ring-2 focus:ring-antique-gold transition-all"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 pb-2 border-b border-antique-gold/20">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-heritage-green text-warm-ivory font-bold shadow-xs'
                    : 'text-text-secondary hover:bg-antique-gold/15 dark:hover:bg-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Prompts Navigation List */}
          <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
            {filteredPrompts.length === 0 ? (
              <div className="p-6 text-center text-xs text-text-muted space-y-2">
                <AlertCircle className="w-6 h-6 mx-auto opacity-40" />
                <p>Không tìm thấy câu lệnh phù hợp bộ lọc.</p>
              </div>
            ) : (
              filteredPrompts.map((prompt) => {
                const isSelected = prompt.key === selectedKey;
                const promptIsDirty =
                  editedValues[prompt.key] !== undefined &&
                  editedValues[prompt.key] !== prompt.currentPrompt;

                return (
                  <button
                    key={prompt.key}
                    type="button"
                    onClick={() => setSelectedKey(prompt.key)}
                    className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer space-y-1.5 ${
                      isSelected
                        ? 'bg-antique-gold/20 dark:bg-antique-gold/10 border-antique-gold shadow-sm ring-1 ring-antique-gold'
                        : 'bg-warm-ivory/50 dark:bg-stone-800/50 border-antique-gold/20 hover:border-antique-gold/60 hover:bg-warm-ivory dark:hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-heading text-xs font-bold text-text-primary dark:text-warm-ivory truncate">
                        {prompt.name}
                      </span>
                      {promptIsDirty ? (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500 text-white shrink-0">
                          Chưa lưu
                        </span>
                      ) : prompt.isModified ? (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-heritage-green/20 text-heritage-green dark:text-antique-bright border border-heritage-green/30 shrink-0">
                          Tùy biến
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold text-text-muted shrink-0">
                          Gốc
                        </span>
                      )}
                    </div>

                    <div className="font-mono text-[10px] text-text-muted truncate">
                      {prompt.key}
                    </div>

                    <p className="text-[11px] text-text-secondary line-clamp-1">
                      {prompt.description}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* ── Right Column: Detail Workspace & Playground (8 cols) ─────────── */}
        <div className="lg:col-span-8 bg-rice-paper dark:bg-stone-900/70 border border-antique-gold/30 rounded-2xl p-5 shadow-sm space-y-4">
          {activePrompt ? (
            <>
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-antique-gold/20">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-base font-bold text-text-primary dark:text-warm-ivory">
                      {activePrompt.name}
                    </h3>
                    <span className="px-2 py-0.5 rounded-md font-mono text-[10px] bg-stone-200 dark:bg-stone-800 text-text-muted">
                      {activePrompt.key}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5">{activePrompt.description}</p>
                </div>

                {/* Mode Selector Tabs */}
                <div className="flex items-center gap-1 p-1 bg-stone-200/80 dark:bg-stone-800 rounded-xl self-start sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveTabMode('editor')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTabMode === 'editor'
                        ? 'bg-warm-ivory dark:bg-stone-900 text-heritage-green dark:text-antique-bright shadow-xs'
                        : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>Soạn thảo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTabMode('diff')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTabMode === 'diff'
                        ? 'bg-warm-ivory dark:bg-stone-900 text-heritage-green dark:text-antique-bright shadow-xs'
                        : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    <Split className="w-3.5 h-3.5" />
                    <span>So sánh Diff</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTabMode('playground')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeTabMode === 'playground'
                        ? 'bg-warm-ivory dark:bg-stone-900 text-heritage-green dark:text-antique-bright shadow-xs'
                        : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Chạy thử Sandbox</span>
                  </button>
                </div>
              </div>

              {/* Supported Variables Pills */}
              {activePrompt.supportedVariables && activePrompt.supportedVariables.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 p-2.5 rounded-xl bg-warm-ivory/60 dark:bg-stone-800/60 border border-antique-gold/20 text-xs">
                  <span className="font-semibold text-text-muted text-[11px] mr-1">
                    Biến số khả dụng (Nhấp để chèn):
                  </span>
                  {activePrompt.supportedVariables.map((v) => (
                    <button
                      key={v.name}
                      type="button"
                      onClick={() => handleInsertVariable(v.name)}
                      title={v.description}
                      className="px-2 py-0.5 rounded-md font-mono text-[11px] font-semibold bg-antique-gold/20 hover:bg-antique-gold/30 text-heritage-green dark:text-antique-bright border border-antique-gold/30 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <span>{`{{${v.name}}}`}</span>
                      <Copy className="w-2.5 h-2.5 opacity-60" />
                    </button>
                  ))}
                  {copiedVariable && (
                    <span className="text-[10px] text-heritage-green dark:text-antique-bright font-bold flex items-center gap-1 animate-fade-in ml-auto">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Đã chèn và copy {copiedVariable}</span>
                    </span>
                  )}
                </div>
              )}

              {/* ── Mode 1: Editor Mode ───────────────────────────────────────── */}
              {activeTabMode === 'editor' && (
                <div className="space-y-2">
                  <div className="relative">
                    <textarea
                      ref={textareaRef}
                      value={currentText}
                      onChange={(e) => handleTextChange(e.target.value)}
                      rows={14}
                      className="w-full p-4 rounded-xl font-mono text-xs leading-relaxed bg-warm-ivory/80 dark:bg-stone-950 border border-antique-gold/30 text-text-primary dark:text-warm-ivory focus:outline-none focus:ring-2 focus:ring-antique-gold focus:border-antique-gold transition-all resize-y shadow-inner"
                      placeholder="Nhập nội dung câu lệnh hệ thống..."
                    />
                  </div>

                  {/* Character and Token Statistics Bar */}
                  <div className="flex items-center justify-between text-[11px] text-text-muted px-1">
                    <div className="flex items-center gap-3">
                      <span>Độ dài: <strong className="text-text-primary dark:text-warm-ivory">{currentText.length.toLocaleString('en-US')}</strong> ký tự</span>
                      <span>Ước lượng: <strong className="text-text-primary dark:text-warm-ivory">~{tokenEstimate.toLocaleString('en-US')}</strong> tokens</span>
                    </div>
                    {isDirty && (
                      <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Có thay đổi chưa lưu
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* ── Mode 2: Diff Mode ─────────────────────────────────────────── */}
              {activeTabMode === 'diff' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-text-muted px-1">
                        <span>Bản gốc mặc định (Factory Default)</span>
                        <span className="font-mono text-[10px]">{activePrompt.defaultPrompt.length} ký tự</span>
                      </div>
                      <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-950/80 border border-stone-200 dark:border-stone-800 font-mono text-xs leading-relaxed max-h-[360px] overflow-y-auto whitespace-pre-wrap select-all text-text-muted">
                        {activePrompt.defaultPrompt}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-bold text-heritage-green dark:text-antique-bright px-1">
                        <span>Bản đang chỉnh sửa (Active Working Version)</span>
                        <span className="font-mono text-[10px]">{currentText.length} ký tự</span>
                      </div>
                      <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-300 dark:border-emerald-800 font-mono text-xs leading-relaxed max-h-[360px] overflow-y-auto whitespace-pre-wrap select-all text-text-primary dark:text-warm-ivory">
                        {currentText}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── Mode 3: Playground Sandbox Mode ───────────────────────────── */}
              {activeTabMode === 'playground' && (
                <div className="p-4 rounded-xl bg-warm-ivory/60 dark:bg-stone-800/40 border border-antique-gold/30 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-text-muted mb-1">
                        Chọn kịch bản bối cảnh mẫu:
                      </label>
                      <select
                        value={selectedScenarioId}
                        onChange={(e) => {
                          const scId = e.target.value;
                          setSelectedScenarioId(scId);
                          const found = MOCK_SCENARIOS.find((s) => s.id === scId);
                          if (found) setPlaygroundQuery(found.sampleQuery);
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-warm-ivory dark:bg-stone-800 border border-antique-gold/30 text-xs text-text-primary dark:text-warm-ivory focus:outline-none focus:ring-2 focus:ring-antique-gold"
                      >
                        {MOCK_SCENARIOS.map((sc) => (
                          <option key={sc.id} value={sc.id}>
                            {sc.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-text-muted mb-1">
                        Câu hỏi thử nghiệm của học viên:
                      </label>
                      <input
                        type="text"
                        value={playgroundQuery}
                        onChange={(e) => setPlaygroundQuery(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-warm-ivory dark:bg-stone-800 border border-antique-gold/30 text-xs text-text-primary dark:text-warm-ivory focus:outline-none focus:ring-2 focus:ring-antique-gold"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={playgroundRunning}
                    onClick={handleRunPlayground}
                    className="px-4 py-2 rounded-xl font-heading text-xs font-bold bg-heritage-green hover:bg-heritage-green/90 text-warm-ivory border border-antique-gold/40 shadow-sm transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {playgroundRunning ? (
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Zap className="w-3.5 h-3.5 text-antique-gold" />
                    )}
                    <span>{playgroundRunning ? 'Đang gửi prompt đến AI...' : 'Chạy thử nghiệm câu lệnh'}</span>
                  </button>

                  {playgroundOutput && (
                    <div className="p-4 rounded-xl bg-warm-ivory dark:bg-stone-900 border border-antique-gold/30 space-y-3 animate-fade-in">
                      <div className="flex items-center justify-between text-xs pb-2 border-b border-antique-gold/20">
                        <span className="font-bold text-heritage-green dark:text-antique-bright flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Kết quả phản hồi từ mô hình
                        </span>
                        <span className="font-mono text-[11px] text-text-muted flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {playgroundOutput.latencyMs} ms | HTTP 200 OK
                        </span>
                      </div>

                      <p className="text-xs text-text-body dark:text-warm-ivory leading-relaxed whitespace-pre-wrap">
                        {playgroundOutput.reply}
                      </p>

                      {playgroundOutput.prompts.length > 0 && (
                        <div className="pt-2 border-t border-antique-gold/20 space-y-1">
                          <span className="text-[11px] font-bold text-text-muted">
                            Các câu hỏi gợi ý kế tiếp (PROMPTS):
                          </span>
                          <div className="space-y-1">
                            {playgroundOutput.prompts.map((p, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2 text-xs text-text-primary dark:text-warm-ivory"
                              >
                                <ArrowRight className="w-3 h-3 text-antique-gold shrink-0" />
                                <span>{p}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="p-12 text-center text-text-muted space-y-2">
              <AlertCircle className="w-8 h-8 mx-auto opacity-40" />
              <p>Chọn một câu lệnh bên trái để bắt đầu chỉnh sửa.</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Confirmation Dialog for Reset ──────────────────────────────────── */}
      {confirmResetKey && (
        <AdminDialog
          title="Khôi phục câu lệnh về mặc định"
          onClose={() => setConfirmResetKey(null)}
        >
          <div className="p-6 space-y-4 max-w-md">
            <p className="text-xs text-text-secondary leading-relaxed">
              Bạn có chắc chắn muốn khôi phục câu lệnh <strong>{confirmResetKey}</strong> về nguyên bản mặc định của mã nguồn hệ thống? Mọi tùy chỉnh hiện tại trên cơ sở dữ liệu sẽ bị xóa bỏ.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-antique-gold/20">
              <button
                type="button"
                onClick={() => setConfirmResetKey(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                disabled={isResetting}
                onClick={handleConfirmReset}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-700 hover:bg-red-800 text-white shadow-sm transition-all"
              >
                {isResetting ? 'Đang khôi phục...' : 'Xác nhận khôi phục'}
              </button>
            </div>
          </div>
        </AdminDialog>
      )}
    </div>
  );
};

export default AiPromptStudioView;
