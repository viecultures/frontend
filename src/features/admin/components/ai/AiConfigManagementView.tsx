import React, { useState, useEffect, useCallback, useId } from 'react';
import {
  Plus,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  Activity,
  DollarSign,
  Cpu,
  KeyRound,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Zap,
  Server,
  Layers,
  Sparkles,
  Volume2,
  Languages,
  MessageSquare,
  Globe,
  Sliders,
  Radio,
  Save,
  Check,
  Mic,
  FileText,
} from 'lucide-react';
import type {
  AiProvider,
  AiServiceType,
  AiServiceConfigDto,
  CreateAiKeyPayload,
  AiCostMetricsDto,
  AiUsageLogPageResponse,
  TestAiKeyResult,
  SystemAiSettingsDto,
  UpdateSystemAiSettingsPayload,
} from '../../types/adminAiTypes';
import { adminAiConfigService } from '../../services/adminAiConfigService';
import { AdminDialog } from '../AdminDialog';
import { AiPromptManagementView } from './AiPromptManagementView';

type AiSubTab = 'GEMINI' | 'AZURE' | 'COST' | 'PROMPTS';

const DEFAULT_GEMINI_MODELS = [
  { id: 'gemini-3.8-flash', name: 'Gemini 3.8 Flash (Khuyên dùng - Nhanh & Tối ưu chi phí)', desc: 'Thế hệ mới nhất, tốc độ phản hồi cực nhanh, đa phương thức tối ưu.' },
  { id: 'gemini-3.5-flash', name: 'Gemini 3.5 Flash (Tiêu chuẩn cân bằng)', desc: 'Mô hình đa phương thức cân bằng hoàn hảo giữa tốc độ và chi phí.' },
  { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro Preview (Lập luận sâu)', desc: 'Mô hình mạnh nhất cho ngữ cảnh văn hóa phức tạp.' },
  { id: 'gemini-3.5-transcribe', name: 'Gemini 3.5 Transcribe (Khuyên dùng cho Gemini STT - Tối ưu nhận diện tiếng Việt)', desc: 'Chuyên dụng cho xử lý âm thanh tiếng Việt, nhận diện giọng nói và lọc từ đệm hai bước.' },
  { id: 'gemini-flash-latest', name: 'Gemini Flash Latest (Bản mới nhất)', desc: 'Tự động cập nhật alias mới nhất từ Google AI Studio.' },
];

const DEFAULT_AZURE_REGIONS = [
  { id: 'southeastasia', name: 'Đông Nam Á (Singapore) - Khuyên dùng cho Việt Nam' },
  { id: 'eastasia', name: 'Đông Á (Hồng Kông)' },
  { id: 'japaneast', name: 'Nhật Bản (Tokyo)' },
  { id: 'centralus', name: 'Miền Trung Hoa Kỳ' },
  { id: 'eastus', name: 'Miền Đông Hoa Kỳ' },
  { id: 'westeurope', name: 'Tây Âu (Hà Lan)' },
];

export const AiConfigManagementView: React.FC = () => {
  // Navigation Sub-Tab
  const [activeSubTab, setActiveSubTab] = useState<AiSubTab>('GEMINI');

  // Main data states
  const [keys, setKeys] = useState<AiServiceConfigDto[]>([]);
  const [metrics, setMetrics] = useState<AiCostMetricsDto | null>(null);
  const [logsPage, setLogsPage] = useState<AiUsageLogPageResponse>({
    content: [],
    totalElements: 0,
    totalPages: 0,
    size: 8,
    number: 0,
  });

  // System AI Settings State
  const [aiSettings, setAiSettings] = useState<SystemAiSettingsDto>({
    geminiChatModel: 'gemini-3.8-flash',
    geminiTranslateModel: 'gemini-3.5-flash',
    geminiSttModel: 'gemini-3.5-transcribe',
    azureSpeechRegion: 'southeastasia',
    activeTtsProvider: 'azure',
    availableGeminiModels: ['gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-3.1-pro-preview', 'gemini-3.5-transcribe', 'gemini-flash-latest'],
    availableAzureRegions: DEFAULT_AZURE_REGIONS,
  });
  const [isSavingSettings, setIsSavingSettings] = useState<boolean>(false);

  // 5-State indicators
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Pagination & filter for logs
  const [logPageNumber, setLogPageNumber] = useState<number>(0);
  const [logProviderFilter, setLogProviderFilter] = useState<string>('ALL');
  const logPageSize = 8;

  // Toggle & Delete states
  const [togglingKeyId, setTogglingKeyId] = useState<string | null>(null);
  const [testingKeyId, setTestingKeyId] = useState<string | null>(null);
  const [deletingKey, setDeletingKey] = useState<AiServiceConfigDto | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Modal State for adding Key
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalProvider, setModalProvider] = useState<AiProvider>('GEMINI');
  const [modalServiceType, setModalServiceType] = useState<AiServiceType>('CHAT');
  const [modalKeyLabel, setModalKeyLabel] = useState<string>('');
  const [modalRawKey, setModalRawKey] = useState<string>('');
  const [modalModelName, setModalModelName] = useState<string>('gemini-3.8-flash');
  const [modalRegion, setModalRegion] = useState<string>('southeastasia');
  const [modalPriority, setModalPriority] = useState<number>(1);
  const [modalActive, setModalActive] = useState<boolean>(true);
  const [showRawKey, setShowRawKey] = useState<boolean>(false);

  // Testing Key State
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<TestAiKeyResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Accessible IDs
  const labelId = useId();
  const rawKeyId = useId();
  const priorityId = useId();
  const modelSelectId = useId();
  const regionSelectId = useId();

  // Toast Notification timer
  useEffect(() => {
    if (!successToast) return;
    const timer = setTimeout(() => {
      setSuccessToast(null);
    }, 3500);
    return () => clearTimeout(timer);
  }, [successToast]);

  // Fetch all data
  const fetchData = useCallback(async (isRefreshAction = false) => {
    if (isRefreshAction) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setErrorMessage(null);

    try {
      const [keysData, metricsData, logsData, settingsData] = await Promise.all([
        adminAiConfigService.getKeys().catch((err) => {
          console.warn('Lỗi tải danh sách keys:', err);
          return [];
        }),
        adminAiConfigService.getMetrics().catch((err) => {
          console.warn('Lỗi tải metrics:', err);
          return null;
        }),
        adminAiConfigService.getLogs(logPageNumber, logPageSize).catch((err) => {
          console.warn('Lỗi tải logs:', err);
          return { content: [], totalElements: 0, totalPages: 0, size: 8, number: 0 };
        }),
        adminAiConfigService.getSettings().catch((err) => {
          console.warn('Lỗi tải settings (sử dụng giá trị mặc định):', err);
          return null;
        }),
      ]);

      setKeys(keysData);
      setMetrics(metricsData);
      setLogsPage(logsData);
      if (settingsData) {
        setAiSettings(settingsData);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Lỗi kết nối máy chủ quản trị AI';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [logPageNumber, logPageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Save System AI Settings
  const handleSaveSettings = async (partial: UpdateSystemAiSettingsPayload) => {
    setIsSavingSettings(true);
    try {
      const updated = await adminAiConfigService.updateSettings(partial);
      setAiSettings(updated);
      setSuccessToast('Đã lưu cấu hình tham số hệ thống AI thành công');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể lưu cài đặt AI';
      setErrorMessage(msg);
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Toggle Key Status
  const handleToggleKey = async (config: AiServiceConfigDto) => {
    setTogglingKeyId(config.id);
    try {
      const updated = await adminAiConfigService.toggleKey(config.id);
      setKeys((prev) => prev.map((k) => (k.id === config.id ? { ...k, active: updated.active } : k)));
      setSuccessToast(`Đã ${updated.active ? 'kích hoạt' : 'tạm dừng'} khóa [${config.keyLabel}]`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể thay đổi trạng thái khóa';
      setErrorMessage(msg);
    } finally {
      setTogglingKeyId(null);
    }
  };

  // Delete Key
  const handleConfirmDelete = async () => {
    if (!deletingKey) return;
    setIsDeleting(true);
    try {
      await adminAiConfigService.deleteKey(deletingKey.id);
      setKeys((prev) => prev.filter((k) => k.id !== deletingKey.id));
      setSuccessToast(`Đã xóa khóa [${deletingKey.keyLabel}] vĩnh viễn`);
      setDeletingKey(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi xóa khóa';
      setErrorMessage(msg);
    } finally {
      setIsDeleting(false);
    }
  };

  // Open Modal for specific Provider
  // Test Existing Key from table
  const handleTestExistingKey = async (config: AiServiceConfigDto) => {
    setTestingKeyId(config.id);
    try {
      const result = await adminAiConfigService.testKey({
        configId: config.id,
        provider: config.provider,
        serviceType: config.serviceType,
        modelName: config.modelName || undefined,
        region: config.region || undefined,
      });
      if (result.success) {
        setSuccessToast(`Khóa [${config.keyLabel}] kết nối thành công (${result.latencyMs ?? 0}ms): ${result.message}`);
      } else {
        setErrorMessage(`Kiểm tra khóa [${config.keyLabel}] thất bại: ${result.message}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Kiểm tra kết nối khóa thất bại';
      setErrorMessage(msg);
    } finally {
      setTestingKeyId(null);
    }
  };

  const handleOpenAddModal = (provider: AiProvider) => {
    setModalProvider(provider);
    setModalServiceType(provider === 'GEMINI' ? 'CHAT' : 'TTS');
    setModalKeyLabel('');
    setModalRawKey('');
    setModalModelName(aiSettings.geminiChatModel || 'gemini-3.8-flash');
    setModalRegion(aiSettings.azureSpeechRegion || 'southeastasia');
    setModalPriority(1);
    setModalActive(true);
    setShowRawKey(false);
    setTestResult(null);
    setModalError(null);
    setIsModalOpen(true);
  };

  // Test Key in Modal
  const handleTestKey = async () => {
    if (!modalRawKey.trim()) {
      setModalError('Vui lòng nhập API Key / Subscription Key trước khi kiểm tra');
      return;
    }
    setModalError(null);
    setIsTesting(true);
    setTestResult(null);

    try {
      const result = await adminAiConfigService.testKey({
        provider: modalProvider,
        serviceType: modalServiceType,
        apiKey: modalRawKey.trim(),
        modelName: modalProvider === 'GEMINI' ? modalModelName : undefined,
        region: modalProvider === 'AZURE' ? modalRegion : undefined,
      });
      setTestResult(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Kiểm tra thất bại';
      setTestResult({
        success: false,
        message: msg,
      });
    } finally {
      setIsTesting(false);
    }
  };

  // Submit Modal
  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalKeyLabel.trim()) {
      setModalError('Vui lòng nhập tên nhận diện khóa');
      return;
    }
    if (!modalRawKey.trim()) {
      setModalError('Vui lòng nhập giá trị API Key');
      return;
    }

    setIsSubmitting(true);
    setModalError(null);

    try {
      const payload: CreateAiKeyPayload = {
        provider: modalProvider,
        serviceType: modalServiceType,
        keyLabel: modalKeyLabel.trim(),
        rawKey: modalRawKey.trim(),
        priority: modalPriority,
        active: modalActive,
        modelName: modalProvider === 'GEMINI' ? modalModelName : undefined,
        region: modalProvider === 'AZURE' ? modalRegion : undefined,
      };

      const newKey = await adminAiConfigService.createKey(payload);
      setKeys((prev) => [newKey, ...prev]);
      setSuccessToast(`Đã thêm mới khóa [${newKey.keyLabel}] thành công`);
      setIsModalOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi lưu khóa mới';
      setModalError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered keys
  const geminiKeys = keys.filter((k) => k.provider === 'GEMINI');
  const azureKeys = keys.filter((k) => k.provider === 'AZURE');

  // Filtered logs
  const filteredLogs = logsPage.content.filter((logItem) => {
    if (logProviderFilter === 'ALL') return true;
    return logItem.provider === logProviderFilter;
  });

  return (
    <section aria-labelledby="ai-config-heading" className="space-y-6">
      {/* ── HEADER & ACTIONS ─────────────────────────────────────────────── */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-3xl bg-rice-paper/80 dark:bg-heritage-forest/40 border border-antique-gold/20 shadow-sm backdrop-blur-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-heritage-green/15 text-heritage-green dark:bg-antique-gold/20 dark:text-antique-gold border border-heritage-green/30 dark:border-antique-gold/40">
              AI Multi-Provider Control
            </span>
          </div>
          <h2 id="ai-config-heading" className="font-heading text-xl sm:text-2xl font-bold text-text-body dark:text-warm-ivory flex items-center gap-2.5">
            <Cpu aria-hidden="true" className="w-6 h-6 text-antique-gold shrink-0" />
            Cấu hình AI & Giám sát Chi phí
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary dark:text-warm-ivory/70 max-w-2xl">
            Tách biệt hoàn toàn cơ chế vận hành của Google Gemini (Mô hình ngôn ngữ lớn) và Microsoft Azure Speech (Hệ thống giọng đọc Di sản).
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => fetchData(true)}
            disabled={isRefreshing || isLoading}
            className="min-h-[44px] min-w-[44px] px-4 py-2.5 rounded-xl border border-antique-gold/30 text-text-body dark:text-warm-ivory text-xs font-semibold hover:bg-white/10 dark:hover:bg-white/5 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            aria-label="Làm mới toàn bộ dữ liệu cấu hình AI"
          >
            <RefreshCw aria-hidden="true" className={`w-4 h-4 text-antique-gold ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Làm mới</span>
          </button>
        </div>
      </header>

      {/* ── TOAST NOTIFICATION ────────────────────────────────────────────── */}
      {successToast && (
        <div role="status" aria-live="polite" className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-3 shadow-md transition-all">
          <CheckCircle2 aria-hidden="true" className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* ── ERROR ALERT ──────────────────────────────────────────────────── */}
      {errorMessage && (
        <div role="alert" className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-500/30 text-red-800 dark:text-red-300 text-xs flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2">
            <AlertCircle aria-hidden="true" className="w-4 h-4 text-red-600 dark:text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => fetchData()}
            className="min-h-[36px] px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer shrink-0"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* ── SUB-NAVIGATION TABS (SEPARATION OF CONCERNS) ──────────────────── */}
      <nav aria-label="Phân hệ AI" className="flex border-b border-antique-gold/20 gap-2 pb-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSubTab('GEMINI')}
          className={`min-h-[44px] px-5 py-2.5 rounded-2xl font-heading text-sm font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
            activeSubTab === 'GEMINI'
              ? 'bg-heritage-green text-warm-ivory dark:bg-antique-gold/20 dark:text-antique-gold border border-antique-gold/30 shadow-md'
              : 'text-text-secondary dark:text-warm-ivory/60 hover:text-text-body dark:hover:text-warm-ivory hover:bg-white/5'
          }`}
          aria-current={activeSubTab === 'GEMINI' ? 'page' : undefined}
        >
          <Sparkles aria-hidden="true" className="w-4 h-4 text-antique-gold" />
          <span>Google Gemini (LLM & Dịch)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-warm-ivory">
            {geminiKeys.length} Keys
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('AZURE')}
          className={`min-h-[44px] px-5 py-2.5 rounded-2xl font-heading text-sm font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
            activeSubTab === 'AZURE'
              ? 'bg-heritage-green text-warm-ivory dark:bg-antique-gold/20 dark:text-antique-gold border border-antique-gold/30 shadow-md'
              : 'text-text-secondary dark:text-warm-ivory/60 hover:text-text-body dark:hover:text-warm-ivory hover:bg-white/5'
          }`}
          aria-current={activeSubTab === 'AZURE' ? 'page' : undefined}
        >
          <Volume2 aria-hidden="true" className="w-4 h-4 text-antique-gold" />
          <span>Azure AI Speech (Neural TTS)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-warm-ivory">
            {azureKeys.length} Keys
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('COST')}
          className={`min-h-[44px] px-5 py-2.5 rounded-2xl font-heading text-sm font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
            activeSubTab === 'COST'
              ? 'bg-heritage-green text-warm-ivory dark:bg-antique-gold/20 dark:text-antique-gold border border-antique-gold/30 shadow-md'
              : 'text-text-secondary dark:text-warm-ivory/60 hover:text-text-body dark:hover:text-warm-ivory hover:bg-white/5'
          }`}
          aria-current={activeSubTab === 'COST' ? 'page' : undefined}
        >
          <DollarSign aria-hidden="true" className="w-4 h-4 text-antique-gold" />
          <span>Tổng quan Chi phí & Nhật ký</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-warm-ivory">
            Telemetry
          </span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('PROMPTS')}
          className={`min-h-[44px] px-5 py-2.5 rounded-2xl font-heading text-sm font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
            activeSubTab === 'PROMPTS'
              ? 'bg-heritage-green text-warm-ivory dark:bg-antique-gold/20 dark:text-antique-gold border border-antique-gold/30 shadow-md'
              : 'text-text-secondary dark:text-warm-ivory/60 hover:text-text-body dark:hover:text-warm-ivory hover:bg-white/5'
          }`}
          aria-current={activeSubTab === 'PROMPTS' ? 'page' : undefined}
        >
          <FileText aria-hidden="true" className="w-4 h-4 text-antique-gold" />
          <span>System Prompts</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-warm-ivory">
            Tùy biến
          </span>
        </button>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 1: GOOGLE GEMINI MANAGEMENT ─────────────────────────────── */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'GEMINI' && (
        <div className="space-y-6">
          {/* Section 1: Active Model Control */}
          <article className="p-6 rounded-3xl bg-rice-paper/80 dark:bg-heritage-forest/40 border border-antique-gold/20 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-antique-gold/15 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-antique-gold">
                  <Sliders aria-hidden="true" className="w-4 h-4" />
                  <span>Điều khiển Mô hình Hoạt động (Active Models)</span>
                </div>
                <h3 className="font-heading text-lg font-bold text-text-body dark:text-warm-ivory">
                  Cấu hình Model cho Companion Chat & Dịch thuật song ngữ
                </h3>
                <p className="text-xs text-text-muted">
                  Thay đổi mô hình xử lý ngay lập tức tại thời gian thực mà không cần khởi động lại máy chủ hoặc sửa file cấu hình.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleSaveSettings({
                  geminiChatModel: aiSettings.geminiChatModel,
                  geminiTranslateModel: aiSettings.geminiTranslateModel,
                  geminiSttModel: aiSettings.geminiSttModel || 'gemini-3.5-transcribe',
                })}
                disabled={isSavingSettings}
                className="min-h-[44px] px-5 py-2 rounded-xl bg-heritage-green hover:bg-heritage-green/90 text-warm-ivory text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                <Save aria-hidden="true" className="w-4 h-4" />
                <span>{isSavingSettings ? 'Đang lưu...' : 'Lưu cấu hình Model'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
              {/* Field 1: Chat Model */}
              <div className="space-y-2">
                <label htmlFor="gemini-chat-model" className="block text-xs font-bold text-text-body dark:text-warm-ivory">
                  Mô hình cho Companion Chat (Văn hóa & Trò chuyện):
                </label>
                <select
                  id="gemini-chat-model"
                  value={aiSettings.geminiChatModel}
                  onChange={(e) => setAiSettings((prev) => ({ ...prev, geminiChatModel: e.target.value }))}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-white dark:bg-heritage-dark/80 border border-antique-gold/30 text-text-body dark:text-warm-ivory text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-antique-gold/50 cursor-pointer"
                >
                  {DEFAULT_GEMINI_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-text-muted">
                  Đang dùng: <span className="font-mono text-antique-gold font-bold">{aiSettings.geminiChatModel}</span>. Tối ưu cho hội thoại nhanh, kèm Follow-up questions.
                </p>
              </div>

              {/* Field 2: Translate Model */}
              <div className="space-y-2">
                <label htmlFor="gemini-translate-model" className="block text-xs font-bold text-text-body dark:text-warm-ivory">
                  Mô hình cho Dịch thuật song ngữ bài đọc (Bilingual Reader):
                </label>
                <select
                  id="gemini-translate-model"
                  value={aiSettings.geminiTranslateModel}
                  onChange={(e) => setAiSettings((prev) => ({ ...prev, geminiTranslateModel: e.target.value }))}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-white dark:bg-heritage-dark/80 border border-antique-gold/30 text-text-body dark:text-warm-ivory text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-antique-gold/50 cursor-pointer"
                >
                  {DEFAULT_GEMINI_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-text-muted">
                  Đang dùng: <span className="font-mono text-antique-gold font-bold">{aiSettings.geminiTranslateModel}</span>. Tối ưu độ trung thực ngữ cảnh và thành ngữ Việt.
                </p>
              </div>

              {/* Field 3: STT Model */}
              <div className="space-y-2">
                <label htmlFor="gemini-stt-model" className="block text-xs font-bold text-text-body dark:text-warm-ivory">
                  Mô hình cho Speech-to-Text (Ghi âm &amp; Nhận diện):
                </label>
                <select
                  id="gemini-stt-model"
                  value={aiSettings.geminiSttModel || 'gemini-3.5-transcribe'}
                  onChange={(e) => setAiSettings((prev) => ({ ...prev, geminiSttModel: e.target.value }))}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-white dark:bg-heritage-dark/80 border border-antique-gold/30 text-text-body dark:text-warm-ivory text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-antique-gold/50 cursor-pointer"
                >
                  {DEFAULT_GEMINI_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-text-muted">
                  Đang dùng: <span className="font-mono text-antique-gold font-bold">{aiSettings.geminiSttModel || 'gemini-3.5-transcribe'}</span>. Khuyên dùng <span className="font-mono font-bold">gemini-3.5-transcribe</span> cho STT tiếng Việt.
                </p>
              </div>
            </div>
          </article>

          {/* Section 2: Gemini API Key Pool */}
          <article className="p-6 rounded-3xl bg-rice-paper/80 dark:bg-heritage-forest/40 border border-antique-gold/20 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-antique-gold/15 pb-4">
              <div>
                <h3 className="font-heading text-lg font-bold text-text-body dark:text-warm-ivory flex items-center gap-2">
                  <KeyRound aria-hidden="true" className="w-5 h-5 text-antique-gold" />
                  Hồ bơi Khóa Google Gemini (API Key Pool)
                </h3>
                <p className="text-xs text-text-muted">
                  Quản lý danh sách các khóa Google AI Studio. Hệ thống tự động chuyển khóa dự phòng khi gặp lỗi 429 (Rate Limit).
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleOpenAddModal('GEMINI')}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-heritage-green hover:bg-heritage-green/90 text-warm-ivory text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Plus aria-hidden="true" className="w-4 h-4" />
                <span>Thêm Khóa Gemini mới</span>
              </button>
            </div>

            {/* Keys Table */}
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-text-muted">
                <RefreshCw aria-hidden="true" className="w-6 h-6 animate-spin text-antique-gold" />
                <p className="text-xs">Đang nạp danh sách khóa Gemini...</p>
              </div>
            ) : geminiKeys.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-center border-2 border-dashed border-antique-gold/20 rounded-2xl">
                <Sparkles aria-hidden="true" className="w-8 h-8 text-antique-gold/50" />
                <h4 className="font-heading text-sm font-bold text-text-body dark:text-warm-ivory">
                  Chưa có API Key Gemini nào trong hồ bơi
                </h4>
                <p className="text-xs text-text-muted max-w-md">
                  Vui lòng thêm ít nhất một khóa Google AI Studio để kích hoạt tính năng trò chuyện và dịch thuật văn hóa.
                </p>
                <button
                  type="button"
                  onClick={() => handleOpenAddModal('GEMINI')}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-heritage-green text-warm-ivory text-xs font-bold"
                >
                  Thêm Khóa Gemini ngay
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-antique-gold/20 text-text-secondary dark:text-warm-ivory/60 uppercase text-[10px] tracking-wider font-bold">
                      <th className="py-3 px-3">Tên Khóa Nhận Diện</th>
                      <th className="py-3 px-3">Nghiệp Vụ</th>
                      <th className="py-3 px-3">Giá Trị Khóa (Đã Che)</th>
                      <th className="py-3 px-3 text-center">Ưu Tiên</th>
                      <th className="py-3 px-3 text-center">Trạng Thái</th>
                      <th className="py-3 px-3 text-center">Kích Hoạt</th>
                      <th className="py-3 px-3 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-antique-gold/10">
                    {geminiKeys.map((k) => (
                      <tr key={k.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-3 font-semibold text-text-body dark:text-warm-ivory">
                          {k.keyLabel}
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-400/30">
                            {k.serviceType === 'CHAT' ? 'Companion Chat' : k.serviceType === 'TRANSLATE' ? 'Dịch thuật' : k.serviceType === 'STT' ? 'Speech-to-Text' : 'TTS Voice'}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-text-secondary dark:text-warm-ivory/80">
                          {k.maskedKey}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 border border-antique-gold/20 text-antique-gold">
                            P{k.priority}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              k.status === 'HEALTHY'
                                ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-400/40'
                                : k.status === 'RATE_LIMITED'
                                ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-400/40'
                                : 'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-400/40'
                            }`}
                          >
                            {k.status === 'HEALTHY' ? 'Khỏe mạnh' : k.status === 'RATE_LIMITED' ? 'Tạm khóa (429)' : 'Hết hạn'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleKey(k)}
                            disabled={togglingKeyId === k.id}
                            className={`min-h-[44px] min-w-[44px] inline-flex items-center justify-center p-2 rounded-xl transition-colors cursor-pointer ${
                              k.active ? 'text-emerald-600 dark:text-emerald-400' : 'text-text-muted'
                            }`}
                            aria-label={`Bật tắt khóa ${k.keyLabel}`}
                          >
                            <div className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${k.active ? 'bg-emerald-600' : 'bg-gray-400'}`}>
                              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${k.active ? 'translate-x-5' : 'translate-x-0'}`} />
                            </div>
                          </button>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleTestExistingKey(k)}
                            disabled={testingKeyId === k.id}
                            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center p-2 rounded-xl text-antique-gold hover:bg-antique-gold/15 transition-colors cursor-pointer disabled:opacity-40"
                            aria-label={`Kiểm tra kết nối khóa ${k.keyLabel}`}
                            title="Kiểm tra kết nối"
                          >
                            {testingKeyId === k.id ? (
                              <RefreshCw aria-hidden="true" className="w-4 h-4 animate-spin" />
                            ) : (
                              <Zap aria-hidden="true" className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingKey(k)}
                            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center p-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                            aria-label={`Xóa khóa ${k.keyLabel}`}
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
          </article>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 2: AZURE AI SPEECH MANAGEMENT ───────────────────────────── */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'AZURE' && (
        <div className="space-y-6">
          {/* Section 1: Azure Region & Provider Settings */}
          <article className="p-6 rounded-3xl bg-rice-paper/80 dark:bg-heritage-forest/40 border border-antique-gold/20 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-antique-gold/15 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-antique-gold">
                  <Globe aria-hidden="true" className="w-4 h-4" />
                  <span>Cấu hình Vùng Máy Chủ & Nhà Cung Cấp Giọng Đọc</span>
                </div>
                <h3 className="font-heading text-lg font-bold text-text-body dark:text-warm-ivory">
                  Thiết lập Azure Speech Region & Fallback Provider
                </h3>
                <p className="text-xs text-text-muted">
                  Azure Cognitive Services bắt buộc phải đi kèm Region tương ứng với Subscription Key để xác thực kết nối.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleSaveSettings({
                  azureSpeechRegion: aiSettings.azureSpeechRegion,
                  activeTtsProvider: aiSettings.activeTtsProvider,
                })}
                disabled={isSavingSettings}
                className="min-h-[44px] px-5 py-2 rounded-xl bg-heritage-green hover:bg-heritage-green/90 text-warm-ivory text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                <Save aria-hidden="true" className="w-4 h-4" />
                <span>{isSavingSettings ? 'Đang lưu...' : 'Lưu cấu hình Azure'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
              {/* Field 1: Azure Region */}
              <div className="space-y-2">
                <label htmlFor="azure-region-select" className="block text-xs font-bold text-text-body dark:text-warm-ivory">
                  Khu vực máy chủ Azure Speech (Service Region):
                </label>
                <select
                  id="azure-region-select"
                  value={aiSettings.azureSpeechRegion}
                  onChange={(e) => setAiSettings((prev) => ({ ...prev, azureSpeechRegion: e.target.value }))}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-white dark:bg-heritage-dark/80 border border-antique-gold/30 text-text-body dark:text-warm-ivory text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-antique-gold/50 cursor-pointer"
                >
                  {DEFAULT_AZURE_REGIONS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.id})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-text-muted">
                  Endpoint hiện tại: <span className="font-mono text-antique-gold font-bold">https://{aiSettings.azureSpeechRegion}.tts.speech.microsoft.com</span>
                </p>
              </div>

              {/* Field 2: Default TTS Provider */}
              <div className="space-y-2">
                <label htmlFor="tts-provider-select" className="block text-xs font-bold text-text-body dark:text-warm-ivory">
                  Nhà cung cấp Text-to-Speech chính thức:
                </label>
                <select
                  id="tts-provider-select"
                  value={aiSettings.activeTtsProvider}
                  onChange={(e) => setAiSettings((prev) => ({ ...prev, activeTtsProvider: e.target.value }))}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-white dark:bg-heritage-dark/80 border border-antique-gold/30 text-text-body dark:text-warm-ivory text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-antique-gold/50 cursor-pointer"
                >
                  <option value="azure">Azure AI Speech (Neural Voices - Giọng đọc di sản chuẩn)</option>
                  <option value="gemini">Google Gemini AI Voice (Thử nghiệm)</option>
                </select>
                <p className="text-[11px] text-text-muted">
                  Khi Azure Speech gặp lỗi quá tải quota, hệ thống sẽ tự động fallback sang giọng đọc Gemini dự phòng.
                </p>
              </div>
            </div>
          </article>

          {/* Section 2: Azure Subscription Keys */}
          <article className="p-6 rounded-3xl bg-rice-paper/80 dark:bg-heritage-forest/40 border border-antique-gold/20 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-antique-gold/15 pb-4">
              <div>
                <h3 className="font-heading text-lg font-bold text-text-body dark:text-warm-ivory flex items-center gap-2">
                  <Volume2 aria-hidden="true" className="w-5 h-5 text-antique-gold" />
                  Khóa Dịch Vụ Azure AI Speech (Subscription Keys)
                </h3>
                <p className="text-xs text-text-muted">
                  Mỗi khóa Azure bắt buộc phải gán kèm Region tương thích với tài nguyên Azure Portal của bạn.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleOpenAddModal('AZURE')}
                className="min-h-[44px] px-4 py-2.5 rounded-xl bg-heritage-green hover:bg-heritage-green/90 text-warm-ivory text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Plus aria-hidden="true" className="w-4 h-4" />
                <span>Thêm Khóa Azure Speech mới</span>
              </button>
            </div>

            {/* Azure Keys Table */}
            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-text-muted">
                <RefreshCw aria-hidden="true" className="w-6 h-6 animate-spin text-antique-gold" />
                <p className="text-xs">Đang nạp danh sách khóa Azure...</p>
              </div>
            ) : azureKeys.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-center border-2 border-dashed border-antique-gold/20 rounded-2xl">
                <Volume2 aria-hidden="true" className="w-8 h-8 text-antique-gold/50" />
                <h4 className="font-heading text-sm font-bold text-text-body dark:text-warm-ivory">
                  Chưa có Subscription Key Azure nào
                </h4>
                <p className="text-xs text-text-muted max-w-md">
                  Vui lòng thêm khóa Azure Cognitive Services kèm Region để tạo file âm thanh luyện đọc cho bài học di sản.
                </p>
                <button
                  type="button"
                  onClick={() => handleOpenAddModal('AZURE')}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-heritage-green text-warm-ivory text-xs font-bold"
                >
                  Thêm Khóa Azure ngay
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-antique-gold/20 text-text-secondary dark:text-warm-ivory/60 uppercase text-[10px] tracking-wider font-bold">
                      <th className="py-3 px-3">Tên Khóa Nhận Diện</th>
                      <th className="py-3 px-3">Khu Vực (Region)</th>
                      <th className="py-3 px-3">Subscription Key</th>
                      <th className="py-3 px-3 text-center">Ưu Tiên</th>
                      <th className="py-3 px-3 text-center">Trạng Thái</th>
                      <th className="py-3 px-3 text-center">Kích Hoạt</th>
                      <th className="py-3 px-3 text-right">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-antique-gold/10">
                    {azureKeys.map((k) => (
                      <tr key={k.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3 px-3 font-semibold text-text-body dark:text-warm-ivory">
                          {k.keyLabel}
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-400/30">
                            {k.region || aiSettings.azureSpeechRegion || 'southeastasia'}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-text-secondary dark:text-warm-ivory/80">
                          {k.maskedKey}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 border border-antique-gold/20 text-antique-gold">
                            P{k.priority}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              k.status === 'HEALTHY'
                                ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-400/40'
                                : 'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 border-red-400/40'
                            }`}
                          >
                            {k.status === 'HEALTHY' ? 'Khỏe mạnh' : 'Lỗi kết nối'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleToggleKey(k)}
                            disabled={togglingKeyId === k.id}
                            className={`min-h-[44px] min-w-[44px] inline-flex items-center justify-center p-2 rounded-xl transition-colors cursor-pointer ${
                              k.active ? 'text-emerald-600 dark:text-emerald-400' : 'text-text-muted'
                            }`}
                            aria-label={`Bật tắt khóa ${k.keyLabel}`}
                          >
                            <div className={`w-10 h-5 flex items-center rounded-full p-0.5 transition-colors ${k.active ? 'bg-emerald-600' : 'bg-gray-400'}`}>
                              <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${k.active ? 'translate-x-5' : 'translate-x-0'}`} />
                            </div>
                          </button>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleTestExistingKey(k)}
                            disabled={testingKeyId === k.id}
                            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center p-2 rounded-xl text-antique-gold hover:bg-antique-gold/15 transition-colors cursor-pointer disabled:opacity-40"
                            aria-label={`Kiểm tra kết nối khóa ${k.keyLabel}`}
                            title="Kiểm tra kết nối"
                          >
                            {testingKeyId === k.id ? (
                              <RefreshCw aria-hidden="true" className="w-4 h-4 animate-spin" />
                            ) : (
                              <Zap aria-hidden="true" className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingKey(k)}
                            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center p-2 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                            aria-label={`Xóa khóa ${k.keyLabel}`}
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
          </article>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 3: COST MONITORING & AUDIT LOGS ─────────────────────────── */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'COST' && (
        <div className="space-y-6">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-rice-paper/80 dark:bg-heritage-forest/40 border border-antique-gold/20 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-text-secondary dark:text-warm-ivory/60">
                <span>Tổng chi phí ước tính</span>
                <DollarSign aria-hidden="true" className="w-4 h-4 text-antique-gold" />
              </div>
              <div className="font-heading text-2xl font-bold text-text-body dark:text-warm-ivory">
                ${(metrics?.totalEstimatedCostUsd ?? 0).toFixed(4)}
              </div>
              <p className="text-[11px] text-text-muted">Toàn bộ vòng đời hệ thống</p>
            </div>

            <div className="p-5 rounded-2xl bg-rice-paper/80 dark:bg-heritage-forest/40 border border-antique-gold/20 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-text-secondary dark:text-warm-ivory/60">
                <span>Chi phí hôm nay</span>
                <Clock aria-hidden="true" className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="font-heading text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                ${(metrics?.todayCostUsd ?? 0).toFixed(4)}
              </div>
              <p className="text-[11px] text-text-muted">Ghi nhận từ 00:00 hôm nay</p>
            </div>

            <div className="p-5 rounded-2xl bg-rice-paper/80 dark:bg-heritage-forest/40 border border-antique-gold/20 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-text-secondary dark:text-warm-ivory/60">
                <span>Tổng lượt gọi AI</span>
                <Activity aria-hidden="true" className="w-4 h-4 text-blue-500" />
              </div>
              <div className="font-heading text-2xl font-bold text-text-body dark:text-warm-ivory">
                {(metrics?.totalCalls ?? 0).toLocaleString('en-US')}
              </div>
              <p className="text-[11px] text-text-muted">Chat, Dịch thuật và TTS</p>
            </div>

            <div className="p-5 rounded-2xl bg-rice-paper/80 dark:bg-heritage-forest/40 border border-antique-gold/20 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-text-secondary dark:text-warm-ivory/60">
                <span>Số khóa đang chạy</span>
                <Zap aria-hidden="true" className="w-4 h-4 text-amber-500" />
              </div>
              <div className="font-heading text-2xl font-bold text-text-body dark:text-warm-ivory">
                {keys.filter((k) => k.active).length} / {keys.length}
              </div>
              <p className="text-[11px] text-text-muted">Gemini & Azure kết hợp</p>
            </div>
          </div>

          {/* Breakdown by Service */}
          <article className="p-6 rounded-3xl bg-rice-paper/80 dark:bg-heritage-forest/40 border border-antique-gold/20 shadow-sm space-y-4">
            <h3 className="font-heading text-base font-bold text-text-body dark:text-warm-ivory flex items-center gap-2">
              <Layers aria-hidden="true" className="w-4 h-4 text-antique-gold" />
              Phân bổ Chi phí & Hạn ngạch theo Nghiệp vụ
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white/50 dark:bg-heritage-dark/50 border border-antique-gold/15 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-text-body dark:text-warm-ivory">
                  <MessageSquare aria-hidden="true" className="w-4 h-4 text-blue-500" />
                  <span>Companion Chat (Gemini)</span>
                </div>
                <div className="text-lg font-bold font-heading text-text-body dark:text-warm-ivory">
                  ${(metrics?.breakdownByService?.find((s) => s.serviceType === 'CHAT')?.costUsd ?? 0).toFixed(4)}
                </div>
                <p className="text-[11px] text-text-muted">
                  {(metrics?.breakdownByService?.find((s) => s.serviceType === 'CHAT')?.calls ?? 0).toLocaleString('en-US')} lượt trò chuyện
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/50 dark:bg-heritage-dark/50 border border-antique-gold/15 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-text-body dark:text-warm-ivory">
                  <Languages aria-hidden="true" className="w-4 h-4 text-emerald-500" />
                  <span>Dịch thuật bài đọc (Gemini)</span>
                </div>
                <div className="text-lg font-bold font-heading text-text-body dark:text-warm-ivory">
                  ${(metrics?.breakdownByService?.find((s) => s.serviceType === 'TRANSLATE')?.costUsd ?? 0).toFixed(4)}
                </div>
                <p className="text-[11px] text-text-muted">
                  {(metrics?.breakdownByService?.find((s) => s.serviceType === 'TRANSLATE')?.calls ?? 0).toLocaleString('en-US')} lượt dịch song ngữ
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/50 dark:bg-heritage-dark/50 border border-antique-gold/15 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-text-body dark:text-warm-ivory">
                  <Volume2 aria-hidden="true" className="w-4 h-4 text-amber-500" />
                  <span>Đọc bài di sản (Azure Speech)</span>
                </div>
                <div className="text-lg font-bold font-heading text-text-body dark:text-warm-ivory">
                  ${(metrics?.breakdownByService?.find((s) => s.serviceType === 'TTS')?.costUsd ?? 0).toFixed(4)}
                </div>
                <p className="text-[11px] text-text-muted">
                  {(metrics?.breakdownByService?.find((s) => s.serviceType === 'TTS')?.calls ?? 0).toLocaleString('en-US')} tệp audio tạo mới
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/50 dark:bg-heritage-dark/50 border border-antique-gold/15 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-text-body dark:text-warm-ivory">
                  <Mic aria-hidden="true" className="w-4 h-4 text-purple-500" />
                  <span>Speech-to-Text (Gemini STT)</span>
                </div>
                <div className="text-lg font-bold font-heading text-text-body dark:text-warm-ivory">
                  ${(metrics?.breakdownByService?.find((s) => s.serviceType === 'STT')?.costUsd ?? 0).toFixed(4)}
                </div>
                <p className="text-[11px] text-text-muted">
                  {(metrics?.breakdownByService?.find((s) => s.serviceType === 'STT')?.calls ?? 0).toLocaleString('en-US')} lượt ghi âm &amp; nhận diện
                </p>
              </div>
            </div>
          </article>

          {/* Audit Logs Table with Filter */}
          <article className="p-6 rounded-3xl bg-rice-paper/80 dark:bg-heritage-forest/40 border border-antique-gold/20 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="font-heading text-base font-bold text-text-body dark:text-warm-ivory flex items-center gap-2">
                  <Clock aria-hidden="true" className="w-4 h-4 text-antique-gold" />
                  Nhật ký Lượt gọi AI Thời gian thực (Usage Logs)
                </h3>
                <p className="text-xs text-text-muted">
                  Ghi nhận lưu lượng tiêu thụ tokens, ký tự và chi phí thực tế cho từng request.
                </p>
              </div>

              {/* Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-muted">Lọc nhà cung cấp:</span>
                <select
                  value={logProviderFilter}
                  onChange={(e) => setLogProviderFilter(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-heritage-dark/80 border border-antique-gold/30 text-xs font-semibold text-text-body dark:text-warm-ivory cursor-pointer"
                >
                  <option value="ALL">Tất cả nhà cung cấp</option>
                  <option value="GEMINI">Google Gemini</option>
                  <option value="AZURE">Microsoft Azure</option>
                </select>
              </div>
            </div>

            {filteredLogs.length === 0 ? (
              <div className="py-8 text-center text-xs text-text-muted">
                Chưa có nhật ký lượt gọi nào được ghi nhận.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-antique-gold/20 text-text-secondary dark:text-warm-ivory/60 uppercase text-[10px] tracking-wider font-bold">
                      <th className="py-2.5 px-3">Thời Gian</th>
                      <th className="py-2.5 px-3">Nhà Cung Cấp</th>
                      <th className="py-2.5 px-3">Nghiệp Vụ</th>
                      <th className="py-2.5 px-3">Mô Hình / Giọng</th>
                      <th className="py-2.5 px-3 text-right">Tiêu Thụ</th>
                      <th className="py-2.5 px-3 text-right">Chi Phí Ước Tính</th>
                      <th className="py-2.5 px-3 text-center">Độ Trễ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-antique-gold/10">
                    {filteredLogs.map((logItem) => (
                      <tr key={logItem.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-2.5 px-3 text-text-muted whitespace-nowrap">
                          {logItem.createdAt ? new Date(logItem.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '-'}
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-text-body dark:text-warm-ivory">
                          {logItem.provider}
                        </td>
                        <td className="py-2.5 px-3 text-text-secondary dark:text-warm-ivory/80">
                          {logItem.featureCode}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-antique-gold">
                          {logItem.modelName || '-'}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-[11px]">
                          {logItem.characterCount > 0
                            ? `${logItem.characterCount.toLocaleString('en-US')} ký tự`
                            : `${(logItem.promptTokens + logItem.completionTokens).toLocaleString('en-US')} tokens`}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          ${(logItem.estimatedCostUsd ?? 0).toFixed(6)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              logItem.latencyMs < 1000
                                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                                : logItem.latencyMs < 3000
                                ? 'text-amber-600 dark:text-amber-400 bg-amber-500/10'
                                : 'text-red-600 dark:text-red-400 bg-red-500/10'
                            }`}
                          >
                            {logItem.latencyMs}ms
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {logsPage.totalPages > 1 && (
              <div className="flex items-center justify-between pt-2 border-t border-antique-gold/15">
                <span className="text-xs text-text-muted">
                  Trang {logPageNumber + 1} / {logsPage.totalPages} ({logsPage.totalElements} lượt ghi)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setLogPageNumber((p) => Math.max(0, p - 1))}
                    disabled={logPageNumber === 0}
                    className="min-h-[36px] min-w-[36px] px-3 py-1 rounded-xl border border-antique-gold/30 text-xs font-bold disabled:opacity-30 cursor-pointer"
                  >
                    Trước
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogPageNumber((p) => Math.min(logsPage.totalPages - 1, p + 1))}
                    disabled={logPageNumber >= logsPage.totalPages - 1}
                    className="min-h-[36px] min-w-[36px] px-3 py-1 rounded-xl border border-antique-gold/30 text-xs font-bold disabled:opacity-30 cursor-pointer"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </article>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* ── TAB 4: SYSTEM PROMPTS MANAGEMENT ────────────────────────────── */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {activeSubTab === 'PROMPTS' && (
        <AiPromptManagementView />
      )}

      {/* ── MODAL: THÊM KHÓA RIÊNG CHO TỪNG NHÀ CUNG CẤP ────────────────── */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {isModalOpen && (
        <AdminDialog
          title={modalProvider === 'GEMINI' ? 'Thêm Khóa Google Gemini Mới' : 'Thêm Khóa Azure AI Speech Mới'}
          onClose={() => setIsModalOpen(false)}
        >
          <form onSubmit={handleSaveModal} className="space-y-4 max-w-lg mx-auto">
            {modalError && (
              <div role="alert" className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-500/30 text-red-700 dark:text-red-300 text-xs">
                {modalError}
              </div>
            )}

            {/* Field: Label */}
            <div className="space-y-1.5">
              <label htmlFor={labelId} className="block text-xs font-bold text-text-body dark:text-warm-ivory">
                Tên nhận diện khóa:
              </label>
              <input
                id={labelId}
                type="text"
                value={modalKeyLabel}
                onChange={(e) => setModalKeyLabel(e.target.value)}
                placeholder={modalProvider === 'GEMINI' ? 'Ví dụ: Gemini Studio Pro - Dự Phòng 01' : 'Ví dụ: Azure Speech Singapore S0'}
                className="w-full min-h-[44px] px-3.5 py-2 rounded-xl bg-white dark:bg-heritage-dark border border-antique-gold/30 text-xs font-medium text-text-body dark:text-warm-ivory focus:outline-none focus:ring-2 focus:ring-antique-gold/50"
                required
              />
            </div>

            {/* Field: Provider-Specific Options */}
            {modalProvider === 'GEMINI' ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label htmlFor="modal-gemini-service" className="block text-xs font-bold text-text-body dark:text-warm-ivory">
                    Mục đích sử dụng:
                  </label>
                  <select
                    id="modal-gemini-service"
                    value={modalServiceType}
                    onChange={(e) => {
                      const val = e.target.value as AiServiceType;
                      setModalServiceType(val);
                      if (val === 'STT') {
                        setModalModelName('gemini-3.5-transcribe');
                      }
                    }}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-white dark:bg-heritage-dark border border-antique-gold/30 text-xs font-semibold text-text-body dark:text-warm-ivory cursor-pointer"
                  >
                    <option value="CHAT">Companion Chat</option>
                    <option value="TRANSLATE">Dịch thuật song ngữ</option>
                    <option value="TTS">Giọng đọc Gemini TTS</option>
                    <option value="STT">Speech-to-Text (Ghi âm &amp; Nhận diện)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor={modelSelectId} className="block text-xs font-bold text-text-body dark:text-warm-ivory">
                    Model mặc định:
                  </label>
                  <select
                    id={modelSelectId}
                    value={modalModelName}
                    onChange={(e) => setModalModelName(e.target.value)}
                    className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-white dark:bg-heritage-dark border border-antique-gold/30 text-xs font-semibold text-text-body dark:text-warm-ivory cursor-pointer"
                  >
                    {DEFAULT_GEMINI_MODELS.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.id}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <label htmlFor={regionSelectId} className="block text-xs font-bold text-text-body dark:text-warm-ivory">
                  Khu vực máy chủ Azure (Region):
                </label>
                <select
                  id={regionSelectId}
                  value={modalRegion}
                  onChange={(e) => setModalRegion(e.target.value)}
                  className="w-full min-h-[44px] px-3 py-2 rounded-xl bg-white dark:bg-heritage-dark border border-antique-gold/30 text-xs font-semibold text-text-body dark:text-warm-ivory cursor-pointer"
                >
                  {DEFAULT_AZURE_REGIONS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.id})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-text-muted">
                  Bắt buộc phải khớp với Region bạn đã chọn khi tạo Azure Speech Resource trên Azure Portal.
                </p>
              </div>
            )}

            {/* Field: Raw Key Input */}
            <div className="space-y-1.5">
              <label htmlFor={rawKeyId} className="block text-xs font-bold text-text-body dark:text-warm-ivory">
                {modalProvider === 'GEMINI' ? 'Google AI Studio API Key (AIzaSy...):' : 'Azure Subscription Key (32 ký tự hex):'}
              </label>
              <div className="relative">
                <input
                  id={rawKeyId}
                  type={showRawKey ? 'text' : 'password'}
                  value={modalRawKey}
                  onChange={(e) => setModalRawKey(e.target.value)}
                  placeholder={modalProvider === 'GEMINI' ? 'Nhập API Key Google Gemini' : 'Nhập 32-char Azure Key'}
                  className="w-full min-h-[44px] pl-3.5 pr-11 py-2 rounded-xl bg-white dark:bg-heritage-dark border border-antique-gold/30 text-xs font-mono text-text-body dark:text-warm-ivory focus:outline-none focus:ring-2 focus:ring-antique-gold/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowRawKey((prev) => !prev)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 min-h-[36px] min-w-[36px] flex items-center justify-center text-text-muted hover:text-antique-gold cursor-pointer"
                  aria-label={showRawKey ? 'Ẩn khóa bí mật' : 'Hiển thị khóa bí mật'}
                >
                  {showRawKey ? <EyeOff aria-hidden="true" className="w-4 h-4" /> : <Eye aria-hidden="true" className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Test Connection Button */}
            <div className="p-3 rounded-xl bg-white/50 dark:bg-heritage-dark/50 border border-antique-gold/15 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-secondary dark:text-warm-ivory/80">
                  Kiểm tra kết nối trực tiếp:
                </span>
                <button
                  type="button"
                  onClick={handleTestKey}
                  disabled={isTesting || !modalRawKey.trim()}
                  className="min-h-[36px] px-3.5 py-1.5 rounded-lg bg-antique-gold/20 hover:bg-antique-gold/30 text-antique-gold font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-40"
                >
                  {isTesting ? <RefreshCw aria-hidden="true" className="w-3.5 h-3.5 animate-spin" /> : <Zap aria-hidden="true" className="w-3.5 h-3.5" />}
                  <span>{isTesting ? 'Đang kiểm tra...' : 'Test kết nối'}</span>
                </button>
              </div>

              {testResult && (
                <div
                  className={`p-2.5 rounded-lg text-xs font-medium flex items-center gap-2 ${
                    testResult.success
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-400/30'
                      : 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-400/30'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 aria-hidden="true" className="w-4 h-4 shrink-0 text-emerald-500" />
                  ) : (
                    <AlertCircle aria-hidden="true" className="w-4 h-4 shrink-0 text-red-500" />
                  )}
                  <span>
                    {testResult.message} {testResult.latencyMs ? `(${testResult.latencyMs}ms)` : ''}
                  </span>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-antique-gold/15">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="min-h-[44px] px-4 py-2 rounded-xl border border-antique-gold/30 text-xs font-bold text-text-secondary hover:bg-white/10 cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="min-h-[44px] px-5 py-2 rounded-xl bg-heritage-green hover:bg-heritage-green/90 text-warm-ivory text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Đang mã hóa & lưu...' : 'Lưu Khóa Vào Database'}
              </button>
            </div>
          </form>
        </AdminDialog>
      )}

      {/* ── MODAL: XÁC NHẬN XÓA KHÓA ──────────────────────────────────────── */}
      {deletingKey && (
        <AdminDialog title="Xác nhận xóa khóa API" onClose={() => setDeletingKey(null)}>
          <div className="space-y-4 max-w-md mx-auto text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <Trash2 aria-hidden="true" className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-heading text-base font-bold text-text-body dark:text-warm-ivory">
                Xóa vĩnh viễn khóa [{deletingKey.keyLabel}]?
              </h4>
              <p className="text-xs text-text-muted">
                Hành động này không thể hoàn tác. Các dịch vụ sử dụng khóa này sẽ tự động chuyển sang khóa có độ ưu tiên tiếp theo trong hồ bơi.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingKey(null)}
                className="min-h-[44px] px-4 py-2 rounded-xl border border-antique-gold/30 text-xs font-bold cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="min-h-[44px] px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all cursor-pointer shadow-md disabled:opacity-50"
              >
                {isDeleting ? 'Đang xóa...' : 'Xác nhận xóa'}
              </button>
            </div>
          </div>
        </AdminDialog>
      )}
    </section>
  );
};
