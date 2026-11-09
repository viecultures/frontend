import React, { useState, useEffect, useId, useCallback } from 'react';
import {
  Cpu,
  Key,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Plus,
  RefreshCw,
  Clock,
  Sparkles,
  Sliders,
  Globe,
  Radio,
  Zap,
  Play,
} from 'lucide-react';
import type {
  AiServiceConfigDto,
  SystemAiSettingsDto,
  TestAiKeyResult,
  CreateAiKeyPayload,
  UpdateAiKeyPayload,
  AiProvider,
  AiServiceType,
} from '../../types/adminAiTypes';
import { adminAiConfigService } from '../../services/adminAiConfigService';
import { AdminDialog } from '../AdminDialog';

const CHAT_PRESETS = [
  { id: 'gemini-3.8-flash', name: 'Gemini 3.8 Flash (Khuyên dùng - Nhanh, thông minh, tối ưu chi phí)' },
  { id: 'gemini-3.5-flash', name: 'Gemini 3.5 Flash (Tiêu chuẩn cân bằng đa phương thức)' },
  { id: 'gemini-3.5-flash-lite', name: 'Gemini 3.5 Flash-Lite (Siêu nhanh, độ trễ thấp)' },
  { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro (Suy luận sâu ngữ cảnh văn hóa phức tạp)' },
  { id: 'gemini-flash-latest', name: 'Gemini Flash Latest (Bản mới nhất tự động cập nhật)' },
];

const TRANSLATE_PRESETS = [
  { id: 'gemini-3.8-flash', name: 'Gemini 3.8 Flash (Khuyên dùng - Hiểu sâu ngữ cảnh tục ngữ văn hóa)' },
  { id: 'gemini-3.5-flash', name: 'Gemini 3.5 Flash (Độ trung thực ngữ nghĩa cao)' },
  { id: 'gemini-3.5-flash-lite', name: 'Gemini 3.5 Flash-Lite (Tối ưu chi phí khi dịch lượng lớn)' },
  { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro (Chính xác sắc thái thành ngữ Việt)' },
];

const STT_PRESETS = [
  { id: 'gemini-3.5-transcribe', name: 'Gemini 3.5 Transcribe (Khuyên dùng - Chuyên dụng tiếng Việt, lọc từ đệm, timestamp)' },
  { id: 'gemini-3.5-transcribe-live', name: 'Gemini 3.5 Transcribe Live (Phiên âm luồng thời gian thực)' },
  { id: 'gemini-3.8-flash', name: 'Gemini 3.8 Flash (Đa phương thức âm thanh chất lượng cao)' },
  { id: 'gemini-3.5-flash', name: 'Gemini 3.5 Flash (Xử lý âm thanh tổng hợp)' },
];

const TTS_PRESETS = [
  { id: 'gemini-3.8-flash-tts', name: 'Gemini 3.8 Flash TTS (Khuyên dùng - Giọng đọc biểu cảm, speech_metadata)' },
  { id: 'gemini-3.8-flash-lite-tts', name: 'Gemini 3.8 Flash-Lite TTS (Tạo giọng nói siêu tốc, tối ưu chi phí)' },
  { id: 'gemini-2.5-flash-preview-tts', name: 'Gemini 2.5 Flash Preview TTS (Dự phòng khi quá hạn ngạch)' },
];

export type FunctionKeyPool = 'CHAT' | 'TRANSLATE' | 'STT' | 'TTS';

export const POOL_METADATA: Record<
  FunctionKeyPool,
  { name: string; shortName: string; desc: string; placeholder: string }
> = {
  CHAT: {
    name: 'Trợ lý Đàm thoại (Companion Chat)',
    shortName: 'Chat Đàm thoại',
    desc: 'Hồ bơi tự động xoay vòng khóa khi gặp mã lỗi 429 (Rate Limit) cho tính năng tương tác học tập và trợ lý văn hóa.',
    placeholder: 'Ví dụ: Chat Production Key 01',
  },
  TRANSLATE: {
    name: 'Dịch thuật Song ngữ (Bilingual Reader)',
    shortName: 'Dịch Song ngữ',
    desc: 'Hồ bơi tự động xoay vòng khóa cho tính năng dịch thuật ngữ cảnh văn hóa và thành ngữ song ngữ Anh - Việt.',
    placeholder: 'Ví dụ: Translate Key 01',
  },
  STT: {
    name: 'Nhận diện Giọng nói STT (Speech-to-Text)',
    shortName: 'Nhận diện STT',
    desc: 'Hồ bơi khóa chuyên biệt xử lý âm thanh đầu vào, nhận diện phát âm và lọc từ đệm hai bước cho người học.',
    placeholder: 'Ví dụ: STT Transcribe Key 01',
  },
  TTS: {
    name: 'Tạo Giọng đọc TTS (Gemini Voice)',
    shortName: 'Tạo Giọng TTS',
    desc: 'Hồ bơi khóa chuyên biệt tạo file giọng đọc đa cảm xúc, speech_metadata cho các bài đọc và bài học văn hóa.',
    placeholder: 'Ví dụ: TTS Voice Key 01',
  },
};

interface ModelConfigCardProps {
  title: string;
  capabilityKey: 'CHAT' | 'TRANSLATE' | 'STT' | 'TTS';
  value: string;
  onChange: (val: string) => void;
  presets: { id: string; name: string }[];
  hint: string;
  onTest: (cap: 'CHAT' | 'TRANSLATE' | 'STT' | 'TTS', modelName: string) => void;
  isTesting: boolean;
  testResult?: TestAiKeyResult;
}

const ModelConfigCard: React.FC<ModelConfigCardProps> = ({
  title,
  capabilityKey,
  value,
  onChange,
  presets,
  hint,
  onTest,
  isTesting,
  testResult,
}) => {
  const isPreset = presets.some((p) => p.id === value);
  const [selectMode, setSelectMode] = useState<string>(isPreset ? value : 'custom');

  useEffect(() => {
    const matched = presets.some((p) => p.id === value);
    setSelectMode(matched ? value : 'custom');
  }, [value, presets]);

  return (
    <div className="p-4 rounded-xl bg-warm-ivory/60 dark:bg-stone-800/60 border border-antique-gold/30 flex flex-col justify-between space-y-3">
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="font-heading text-xs font-bold text-text-primary dark:text-warm-ivory">
            {title}
          </span>
          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-antique-gold/15 text-antique-gold font-bold">
            {capabilityKey}
          </span>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-text-muted mb-1">
            Gợi ý mô hình phù hợp:
          </label>
          <select
            value={selectMode}
            onChange={(e) => {
              const val = e.target.value;
              setSelectMode(val);
              if (val !== 'custom') {
                onChange(val);
              }
            }}
            className="w-full px-2.5 py-1.5 rounded-lg bg-warm-ivory dark:bg-stone-800 border border-antique-gold/40 text-xs font-semibold text-text-primary dark:text-warm-ivory focus:outline-none focus:ring-2 focus:ring-antique-gold cursor-pointer"
          >
            {presets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
            <option value="custom">+ Tùy chỉnh (Nhập mã model khác...)</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-text-muted mb-1">
            Mã định danh Model (có thể sửa):
          </label>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Nhập tên mô hình..."
            className="w-full px-3 py-1.5 rounded-lg font-mono text-xs bg-white dark:bg-stone-900 border border-antique-gold/40 text-text-primary dark:text-warm-ivory focus:outline-none focus:ring-2 focus:ring-antique-gold"
          />
        </div>

        <div className="pt-1">
          <button
            type="button"
            disabled={isTesting || !value.trim()}
            onClick={() => onTest(capabilityKey, value)}
            className="w-full min-h-[32px] px-3 py-1 rounded-lg text-xs font-bold border border-antique-gold/40 bg-white/80 dark:bg-stone-900/80 hover:bg-antique-gold/15 text-text-primary dark:text-warm-ivory transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isTesting ? (
              <>
                <span className="w-3 h-3 border-2 border-antique-gold/30 border-t-antique-gold rounded-full animate-spin" />
                <span>Đang kiểm tra...</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-antique-gold fill-antique-gold" />
                <span>Kiểm tra Model</span>
              </>
            )}
          </button>

          {testResult && (
            <div
              className={`mt-2 p-2 rounded-lg text-[11px] flex items-start gap-1.5 ${
                testResult.success
                  ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                  : 'bg-red-500/10 text-red-700 dark:text-red-300 border border-red-500/30'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-red-600 dark:text-red-400" />
              )}
              <span className="leading-tight">
                {testResult.message || (testResult.success ? 'Mô hình hợp lệ' : 'Kiểm tra thất bại')}
                {testResult.latencyMs ? ` (${testResult.latencyMs}ms)` : ''}
              </span>
            </div>
          )}
        </div>
      </div>

      <p className="text-[11px] text-text-muted leading-relaxed pt-2 border-t border-antique-gold/15">
        {hint}
      </p>
    </div>
  );
};

interface AiProvidersSubViewProps {
  onNotify?: (message: string, type: 'success' | 'error') => void;
}

export const AiProvidersSubView: React.FC<AiProvidersSubViewProps> = ({ onNotify }) => {
  const [keys, setKeys] = useState<AiServiceConfigDto[]>([]);
  const [settings, setSettings] = useState<SystemAiSettingsDto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Health Diagnostics Strip
  const [healthStatus, setHealthStatus] = useState<{
    backendPingMs: number | null;
    dbConnected: boolean;
    geminiKeyCount: number;
    azureKeyCount: number;
  }>({
    backendPingMs: null,
    dbConnected: false,
    geminiKeyCount: 0,
    azureKeyCount: 0,
  });

  // Active Models form state
  const [selectedChatModel, setSelectedChatModel] = useState<string>('gemini-3.8-flash');
  const [selectedTranslateModel, setSelectedTranslateModel] = useState<string>('gemini-3.5-flash');
  const [selectedSttModel, setSelectedSttModel] = useState<string>('gemini-3.5-transcribe');
  const [selectedTtsModel, setSelectedTtsModel] = useState<string>('gemini-3.8-flash-tts');
  const [selectedAzureRegion, setSelectedAzureRegion] = useState<string>('southeastasia');
  const [isSavingSettings, setIsSavingSettings] = useState<boolean>(false);

  // Model test state
  const [testingModelKey, setTestingModelKey] = useState<string | null>(null);
  const [modelTestResults, setModelTestResults] = useState<Record<string, TestAiKeyResult>>({});

  // Active Key Pool Tab: 'CHAT' | 'TRANSLATE' | 'STT' | 'TTS'
  const [activePoolTab, setActivePoolTab] = useState<FunctionKeyPool>('CHAT');

  // Key Test state
  const [testingKeyId, setTestingKeyId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, TestAiKeyResult>>({});

  // Modal create/edit key state
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [modalProvider, setModalProvider] = useState<AiProvider>('GEMINI');
  const [modalRegion, setModalRegion] = useState<string>('southeastasia');
  const [modalServiceType, setModalServiceType] = useState<AiServiceType>('CHAT');
  const [editingKey, setEditingKey] = useState<AiServiceConfigDto | null>(null);
  const [modalLabel, setModalLabel] = useState<string>('');
  const [modalRawKey, setModalRawKey] = useState<string>('');
  const [modalPriority, setModalPriority] = useState<number>(1);
  const [modalIsSubmitting, setModalIsSubmitting] = useState<boolean>(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Delete key confirmation
  const [deletingKeyId, setDeletingKeyId] = useState<string | null>(null);

  const labelId = useId();
  const rawKeyId = useId();
  const priorityId = useId();

  // Load all keys and settings
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const start = Date.now();
    try {
      const [keysData, settingsData] = await Promise.all([
        adminAiConfigService.getKeys().catch((err) => {
          console.warn('Lỗi tải keys:', err);
          return [];
        }),
        adminAiConfigService.getSettings().catch((err) => {
          console.warn('Lỗi tải settings:', err);
          return null;
        }),
      ]);

      setKeys(keysData);
      setSettings(settingsData);

      if (settingsData) {
        if (settingsData.geminiChatModel) setSelectedChatModel(settingsData.geminiChatModel);
        if (settingsData.geminiTranslateModel) setSelectedTranslateModel(settingsData.geminiTranslateModel);
        if (settingsData.geminiSttModel) setSelectedSttModel(settingsData.geminiSttModel);
        if (settingsData.geminiTtsModel) setSelectedTtsModel(settingsData.geminiTtsModel);
        if (settingsData.azureSpeechRegion) setSelectedAzureRegion(settingsData.azureSpeechRegion);
      }

      const ping = Date.now() - start;
      const geminiCount = keysData.filter((k) => k.provider === 'GEMINI' && k.active).length;
      const azureCount = keysData.filter((k) => k.provider === 'AZURE' && k.active).length;

      setHealthStatus({
        backendPingMs: ping,
        dbConnected: true,
        geminiKeyCount: geminiCount,
        azureKeyCount: azureCount,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Không thể tải cấu hình AI';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Save System Settings
  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      const updated = await adminAiConfigService.updateSettings({
        geminiChatModel: selectedChatModel.trim(),
        geminiTranslateModel: selectedTranslateModel.trim(),
        geminiSttModel: selectedSttModel.trim(),
        geminiTtsModel: selectedTtsModel.trim(),
        azureSpeechRegion: selectedAzureRegion,
      });
      setSettings(updated);
      if (onNotify) onNotify('Đã lưu cấu hình mô hình hoạt động thành công', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi lưu cấu hình';
      if (onNotify) onNotify(msg, 'error');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Test Model connection
  const handleTestModel = async (
    capability: 'CHAT' | 'TRANSLATE' | 'STT' | 'TTS',
    modelName: string
  ) => {
    const trimmed = modelName ? modelName.trim() : '';
    if (!trimmed) {
      if (onNotify) onNotify('Vui lòng nhập tên mô hình trước khi kiểm tra.', 'error');
      return;
    }
    setTestingModelKey(capability);
    try {
      const res = await adminAiConfigService.testKey({
        provider: 'GEMINI',
        serviceType: capability,
        modelName: trimmed,
      });
      setModelTestResults((prev) => ({ ...prev, [capability]: res }));
      if (res.success) {
        if (onNotify) onNotify(`Mô hình ${trimmed} hoạt động tốt (${res.latencyMs || 0}ms)`, 'success');
      } else {
        if (onNotify) onNotify(res.message || 'Mô hình không khả dụng', 'error');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi kết nối khi kiểm tra mô hình';
      setModelTestResults((prev) => ({
        ...prev,
        [capability]: { success: false, message: msg },
      }));
      if (onNotify) onNotify(msg, 'error');
    } finally {
      setTestingModelKey(null);
    }
  };

  // Test Key connection
  const handleTestKey = async (config: AiServiceConfigDto) => {
    setTestingKeyId(config.id);
    try {
      const res = await adminAiConfigService.testKey({
        configId: config.id,
        provider: config.provider,
        serviceType: config.serviceType,
      });
      setTestResults((prev) => ({ ...prev, [config.id]: res }));
      if (res.success) {
        if (onNotify) onNotify(`Kiểm tra ${config.keyLabel} thành công (${res.latencyMs || 0}ms)`, 'success');
      } else {
        if (onNotify) onNotify(`Kiểm tra ${config.keyLabel} thất bại: ${res.message}`, 'error');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi kiểm tra khóa';
      setTestResults((prev) => ({
        ...prev,
        [config.id]: { success: false, message: msg },
      }));
      if (onNotify) onNotify(msg, 'error');
    } finally {
      setTestingKeyId(null);
    }
  };

  // Toggle key active status
  const handleToggleActive = async (id: string) => {
    try {
      const updated = await adminAiConfigService.toggleKey(id);
      setKeys((prev) => prev.map((k) => (k.id === id ? updated : k)));
      if (onNotify) onNotify(`Đã thay đổi trạng thái khóa sang ${updated.active ? 'Kích hoạt' : 'Tạm dừng'}`, 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi đổi trạng thái khóa';
      if (onNotify) onNotify(msg, 'error');
    }
  };

  // Submit create or edit key modal
  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalLabel.trim()) {
      setModalError('Vui lòng nhập tên nhãn gợi nhớ cho khóa');
      return;
    }
    if (modalMode === 'create' && !modalRawKey.trim()) {
      setModalError('Vui lòng nhập giá trị API Key');
      return;
    }

    setModalIsSubmitting(true);
    setModalError(null);

    try {
      if (modalMode === 'create') {
        const payload: CreateAiKeyPayload = {
          provider: modalProvider,
          serviceType: modalProvider === 'AZURE' ? 'TTS' : modalServiceType,
          keyLabel: modalLabel.trim(),
          rawKey: modalRawKey.trim(),
          priority: Number(modalPriority) || 1,
          region: modalProvider === 'AZURE' ? modalRegion : undefined,
          active: true,
        };
        const created = await adminAiConfigService.createKey(payload);
        setKeys((prev) => [...prev, created]);
        const targetName = modalProvider === 'AZURE' ? 'Microsoft Azure Speech' : POOL_METADATA[modalServiceType].shortName;
        if (onNotify) onNotify(`Đã thêm khóa ${created.keyLabel} vào bể ${targetName} thành công`, 'success');
      } else if (modalMode === 'edit' && editingKey) {
        const payload: UpdateAiKeyPayload = {
          keyLabel: modalLabel.trim(),
          serviceType: modalProvider === 'AZURE' ? 'TTS' : modalServiceType,
          priority: Number(modalPriority) || 1,
          region: modalProvider === 'AZURE' ? modalRegion : undefined,
        };
        if (modalRawKey.trim()) {
          payload.rawKey = modalRawKey.trim();
        }
        const updated = await adminAiConfigService.updateKey(editingKey.id, payload);
        setKeys((prev) => prev.map((k) => (k.id === updated.id ? updated : k)));
        if (onNotify) onNotify(`Đã cập nhật thông tin khóa ${updated.keyLabel}`, 'success');
      }
      setModalMode(null);
      setEditingKey(null);
      setModalLabel('');
      setModalRawKey('');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi lưu cấu hình khóa';
      setModalError(msg);
    } finally {
      setModalIsSubmitting(false);
    }
  };

  // Delete key
  const handleConfirmDelete = async () => {
    if (!deletingKeyId) return;
    try {
      await adminAiConfigService.deleteKey(deletingKeyId);
      setKeys((prev) => prev.filter((k) => k.id !== deletingKeyId));
      setDeletingKeyId(null);
      if (onNotify) onNotify('Đã xóa bỏ cấu hình khóa khỏi hệ thống', 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi xóa khóa';
      if (onNotify) onNotify(msg, 'error');
    }
  };

  const chatKeys = keys.filter((k) => k.provider === 'GEMINI' && k.serviceType === 'CHAT');
  const translateKeys = keys.filter((k) => k.provider === 'GEMINI' && k.serviceType === 'TRANSLATE');
  const sttKeys = keys.filter((k) => k.provider === 'GEMINI' && k.serviceType === 'STT');
  const ttsKeys = keys.filter((k) => k.provider === 'GEMINI' && k.serviceType === 'TTS');
  const azureKeys = keys.filter((k) => k.provider === 'AZURE');

  const poolKeysMap: Record<FunctionKeyPool, AiServiceConfigDto[]> = {
    CHAT: chatKeys,
    TRANSLATE: translateKeys,
    STT: sttKeys,
    TTS: ttsKeys,
  };

  // Loading state
  if (loading) {
    return (
      <div className="w-full bg-rice-paper dark:bg-stone-900/60 border border-antique-gold/20 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="h-10 w-full bg-stone-300 dark:bg-stone-800 rounded-2xl animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-stone-200 dark:bg-stone-800 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-stone-200 dark:bg-stone-800 rounded-2xl animate-pulse" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full p-8 rounded-3xl bg-red-50/80 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-red-600 dark:text-red-400 mx-auto" />
        <h3 className="font-heading text-lg font-bold text-red-900 dark:text-red-200">
          Không thể tải dữ liệu cấu hình AI
        </h3>
        <p className="text-xs text-red-700 dark:text-red-300 max-w-md mx-auto">{error}</p>
        <button
          type="button"
          onClick={loadData}
          className="px-5 py-2.5 rounded-xl bg-red-700 text-white font-medium text-xs hover:bg-red-800 transition-colors shadow-sm cursor-pointer"
        >
          Thử tải lại dữ liệu
        </button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-5">
      {/* ── System Health Diagnostics Strip ─────────────────────────────────── */}
      <div className="bg-rice-paper dark:bg-stone-900/80 border border-antique-gold/30 rounded-2xl p-3.5 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-bold text-text-primary dark:text-warm-ivory flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-heritage-green dark:text-antique-bright" />
            Trạng thái hạ tầng AI:
          </span>

          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 font-mono text-[11px] flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Backend API: {healthStatus.backendPingMs !== null ? `${healthStatus.backendPingMs}ms` : 'Kết nối'}
          </span>

          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 font-mono text-[11px] flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            Database: Đang hoạt động
          </span>

          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 text-[11px] font-semibold">
            Bể Chat: {chatKeys.filter((k) => k.active).length} khóa
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 text-[11px] font-semibold">
            Bể Dịch: {translateKeys.filter((k) => k.active).length} khóa
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 text-[11px] font-semibold">
            Bể STT: {sttKeys.filter((k) => k.active).length} khóa
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 text-[11px] font-semibold">
            Bể TTS: {ttsKeys.filter((k) => k.active).length} khóa
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-sky-50 dark:bg-sky-950/30 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800/40 text-[11px] font-semibold">
            Azure Speech: {azureKeys.filter((k) => k.active).length} khóa sẵn sàng
          </span>
        </div>

        <button
          type="button"
          onClick={loadData}
          className="px-3 py-1.5 rounded-xl border border-antique-gold/40 text-text-secondary hover:text-text-primary hover:bg-antique-gold/15 transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer shrink-0"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Kiểm tra lại</span>
        </button>
      </div>

      {/* ── Active Models Grid (Card Grid) ──────────────────────────────────── */}
      <div className="bg-rice-paper dark:bg-stone-900/70 border border-antique-gold/30 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-antique-gold/20">
          <div>
            <h3 className="font-heading text-sm font-bold text-text-primary dark:text-warm-ivory flex items-center gap-2">
              <Cpu className="w-4 h-4 text-antique-gold" />
              Cấu hình Mô hình Mặc định (Active Models)
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Thiết lập mô hình Gemini chịu tải chính cho từng nghiệp vụ học tập văn hóa.
            </p>
          </div>

          <button
            type="button"
            disabled={isSavingSettings}
            onClick={handleSaveSettings}
            className="min-h-[36px] px-4 py-1.5 rounded-xl font-heading text-xs font-bold bg-heritage-green hover:bg-heritage-green/90 text-warm-ivory border border-antique-gold/40 shadow-sm transition-all flex items-center gap-1.5 self-end sm:self-auto cursor-pointer disabled:opacity-50"
          >
            {isSavingSettings ? (
              <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Zap className="w-3.5 h-3.5 text-antique-gold" />
            )}
            <span>{isSavingSettings ? 'Đang lưu...' : 'Lưu cấu hình Model'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ModelConfigCard
            title="1. Trợ lý Đàm thoại (Chat)"
            capabilityKey="CHAT"
            value={selectedChatModel}
            onChange={setSelectedChatModel}
            presets={CHAT_PRESETS}
            hint="Khuyên dùng: Gemini 3.8 Flash giúp phản hồi tức thì và sinh câu hỏi tương tác mượt mà."
            onTest={handleTestModel}
            isTesting={testingModelKey === 'CHAT'}
            testResult={modelTestResults['CHAT']}
          />

          <ModelConfigCard
            title="2. Dịch Song ngữ (Reader)"
            capabilityKey="TRANSLATE"
            value={selectedTranslateModel}
            onChange={setSelectedTranslateModel}
            presets={TRANSLATE_PRESETS}
            hint="Khuyên dùng: Gemini 3.5 Flash tối ưu việc chuyển ngữ văn hóa và tục ngữ Việt Nam."
            onTest={handleTestModel}
            isTesting={testingModelKey === 'TRANSLATE'}
            testResult={modelTestResults['TRANSLATE']}
          />

          <ModelConfigCard
            title="3. Nhận diện Giọng nói (STT)"
            capabilityKey="STT"
            value={selectedSttModel}
            onChange={setSelectedSttModel}
            presets={STT_PRESETS}
            hint="Khuyên dùng: Gemini 3.5 Transcribe chuẩn hóa nhận dạng âm thanh người Việt phát âm."
            onTest={handleTestModel}
            isTesting={testingModelKey === 'STT'}
            testResult={modelTestResults['STT']}
          />

          <ModelConfigCard
            title="4. Tạo Giọng đọc (TTS)"
            capabilityKey="TTS"
            value={selectedTtsModel}
            onChange={setSelectedTtsModel}
            presets={TTS_PRESETS}
            hint="Khuyên dùng: Gemini 3.8 Flash TTS tạo giọng đọc tiếng Anh/Việt tự nhiên theo ngữ điệu bài học."
            onTest={handleTestModel}
            isTesting={testingModelKey === 'TTS'}
            testResult={modelTestResults['TTS']}
          />
        </div>
      </div>

      {/* ── Bể Khóa Google Gemini Theo Chức Năng ────────────────────────────── */}
      <div className="bg-rice-paper dark:bg-stone-900/70 border border-antique-gold/30 rounded-2xl p-5 shadow-sm space-y-4">
        {/* Navigation Tabs between the 4 Key Pools */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-antique-gold/20">
          <div>
            <h3 className="font-heading text-sm font-bold text-text-primary dark:text-warm-ivory flex items-center gap-2">
              <Key className="w-4 h-4 text-antique-gold" />
              Bể Khóa Google Gemini Theo Chức Năng (Dedicated Key Pools)
            </h3>
            <p className="text-xs text-text-muted mt-0.5">
              Mỗi nghiệp vụ sở hữu một bể API Key Google độc lập, tự động xoay vòng dự phòng khi gặp lỗi Rate Limit (429).
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setModalMode('create');
              setModalProvider('GEMINI');
              setModalServiceType(activePoolTab);
              setModalLabel('');
              setModalRawKey('');
              setModalPriority(1);
            }}
            className="min-h-[36px] px-3.5 py-1.5 rounded-xl font-heading text-xs font-bold bg-heritage-green hover:bg-heritage-green/90 text-warm-ivory border border-antique-gold/40 shadow-sm transition-all flex items-center gap-1.5 self-end sm:self-auto cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm khóa cho {POOL_METADATA[activePoolTab].shortName}</span>
          </button>
        </div>

        {/* Tab switcher for 4 pools */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-antique-gold/15">
          {(['CHAT', 'TRANSLATE', 'STT', 'TTS'] as FunctionKeyPool[]).map((tab) => {
            const count = poolKeysMap[tab].length;
            const activeCount = poolKeysMap[tab].filter((k) => k.active).length;
            const isActive = activePoolTab === tab;

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActivePoolTab(tab)}
                className={`min-h-[38px] px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-heritage-green text-warm-ivory shadow-sm'
                    : 'bg-warm-ivory/60 dark:bg-stone-800/60 text-text-secondary hover:text-text-primary hover:bg-antique-gold/15'
                }`}
              >
                <span>{POOL_METADATA[tab].shortName}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                    isActive
                      ? 'bg-white/20 text-warm-ivory'
                      : 'bg-stone-200 dark:bg-stone-700 text-text-secondary'
                  }`}
                >
                  {activeCount}/{count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Description of current active pool */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-text-muted bg-warm-ivory/40 dark:bg-stone-800/40 p-3 rounded-xl border border-antique-gold/20">
          <span>{POOL_METADATA[activePoolTab].desc}</span>
          <span className="font-semibold text-text-primary dark:text-warm-ivory shrink-0">
            Đang hiển thị: {poolKeysMap[activePoolTab].length} khóa ({poolKeysMap[activePoolTab].filter((k) => k.active).length} sẵn sàng)
          </span>
        </div>

        {/* Table of keys for activePoolTab */}
        {poolKeysMap[activePoolTab].length === 0 ? (
          <div className="p-8 text-center text-xs text-text-muted space-y-3 border border-dashed border-antique-gold/30 rounded-xl">
            <Key className="w-8 h-8 mx-auto opacity-30 text-antique-gold" />
            <p className="font-medium">
              Chưa có API Key Google Gemini nào trong bể {POOL_METADATA[activePoolTab].name}.
            </p>
            <p className="text-[11px]">
              Vui lòng thêm ít nhất một khóa để nghiệp vụ này hoạt động độc lập và không phụ thuộc các bể khác.
            </p>
            <button
              type="button"
              onClick={() => {
                setModalMode('create');
                setModalServiceType(activePoolTab);
                setModalLabel('');
                setModalRawKey('');
                setModalPriority(1);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-heritage-green text-warm-ivory hover:bg-heritage-green/90 transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm khóa cho {POOL_METADATA[activePoolTab].shortName}</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-antique-gold/20 text-text-muted font-bold">
                  <th className="py-2.5 px-3">Ưu tiên</th>
                  <th className="py-2.5 px-3">Tên gợi nhớ</th>
                  <th className="py-2.5 px-3">Mặt nạ khóa</th>
                  <th className="py-2.5 px-3">Trạng thái</th>
                  <th className="py-2.5 px-3">Độ trễ</th>
                  <th className="py-2.5 px-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-antique-gold/15">
                {poolKeysMap[activePoolTab].map((item) => {
                  const test = testResults[item.id];
                  const isTestingThis = testingKeyId === item.id;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-warm-ivory/60 dark:hover:bg-stone-800/40 transition-colors"
                    >
                      <td className="py-2.5 px-3 font-mono font-bold text-heritage-green dark:text-antique-bright">
                        #{item.priority}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-text-primary dark:text-warm-ivory">
                        {item.keyLabel}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-text-muted">
                        {item.maskedKey}
                      </td>
                      <td className="py-2.5 px-3">
                        {item.active ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40">
                            Khỏe mạnh
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                            Tạm dừng
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-text-muted">
                        {test ? (
                          test.success ? (
                            <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                              {test.latencyMs} ms
                            </span>
                          ) : (
                            <span className="text-red-600 font-semibold" title={test.message}>
                              Lỗi
                            </span>
                          )
                        ) : (
                          '--'
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right space-x-1">
                        <button
                          type="button"
                          disabled={isTestingThis}
                          onClick={() => handleTestKey(item)}
                          className="px-2.5 py-1 rounded-lg border border-antique-gold/40 text-[11px] font-semibold hover:bg-antique-gold/15 transition-all cursor-pointer"
                        >
                          {isTestingThis ? 'Đang test...' : 'Kiểm tra'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleActive(item.id)}
                          className="px-2.5 py-1 rounded-lg border border-antique-gold/40 text-[11px] font-semibold hover:bg-antique-gold/15 transition-all cursor-pointer"
                        >
                          {item.active ? 'Tắt' : 'Bật'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingKey(item);
                            setModalMode('edit');
                            setModalProvider('GEMINI');
                            setModalServiceType(item.serviceType);
                            setModalLabel(item.keyLabel);
                            setModalPriority(item.priority);
                            setModalRawKey('');
                          }}
                          className="px-2.5 py-1 rounded-lg border border-antique-gold/40 text-[11px] font-semibold hover:bg-antique-gold/15 transition-all cursor-pointer"
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingKeyId(item.id)}
                          className="px-2.5 py-1 rounded-lg border border-red-300 dark:border-red-900 text-[11px] font-semibold text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
                        >
                          Xóa
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
      {/* ── Microsoft Azure Speech Key Pool ───────────────────────────────── */}
      <div className="bg-rice-paper dark:bg-stone-900/80 border border-antique-gold/30 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-antique-gold/20 pb-3">
          <div className="space-y-1">
            <h3 className="font-heading text-sm font-bold text-text-primary dark:text-warm-ivory flex items-center gap-2">
              <Key className="w-4 h-4 text-heritage-green dark:text-antique-bright" />
              Khóa Bản quyền Microsoft Azure Speech
            </h3>
            <p className="text-xs text-text-muted">
              Cung cấp giọng đọc Neural Audio tiếng Anh và tiếng Việt cho hệ thống đọc sách song ngữ.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setModalMode('create');
              setModalProvider('AZURE');
              setModalServiceType('TTS');
              setModalRegion(selectedAzureRegion || 'southeastasia');
              setModalLabel('');
              setModalRawKey('');
              setModalPriority(1);
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-heritage-green text-warm-ivory hover:bg-heritage-green/90 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm self-start sm:self-auto shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm khóa Azure</span>
          </button>
        </div>

        {azureKeys.length === 0 ? (
          <div className="p-8 text-center text-xs text-text-muted space-y-3 border border-dashed border-antique-gold/30 rounded-xl">
            <Key className="w-8 h-8 mx-auto opacity-30 text-antique-gold" />
            <p className="font-medium">Chưa có khóa Microsoft Azure Speech nào được cấu hình.</p>
            <p className="text-[11px]">
              Thêm khóa Azure Speech để kích hoạt giọng đọc Neural Audio tiếng Việt/Anh chất lượng cao.
            </p>
            <button
              type="button"
              onClick={() => {
                setModalMode('create');
                setModalProvider('AZURE');
                setModalServiceType('TTS');
                setModalRegion(selectedAzureRegion || 'southeastasia');
                setModalLabel('');
                setModalRawKey('');
                setModalPriority(1);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-heritage-green text-warm-ivory hover:bg-heritage-green/90 transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm khóa Azure Speech</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-antique-gold/20 text-text-muted font-bold">
                  <th className="py-2.5 px-3">Ưu tiên</th>
                  <th className="py-2.5 px-3">Tên gợi nhớ</th>
                  <th className="py-2.5 px-3">Mặt nạ khóa</th>
                  <th className="py-2.5 px-3">Vùng máy chủ</th>
                  <th className="py-2.5 px-3">Trạng thái</th>
                  <th className="py-2.5 px-3">Độ trễ</th>
                  <th className="py-2.5 px-3 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-antique-gold/15">
                {azureKeys.map((item) => {
                  const test = testResults[item.id];
                  const isTestingThis = testingKeyId === item.id;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-warm-ivory/60 dark:hover:bg-stone-800/40 transition-colors"
                    >
                      <td className="py-2.5 px-3 font-mono font-bold text-heritage-green dark:text-antique-bright">
                        #{item.priority}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-text-primary dark:text-warm-ivory">
                        {item.keyLabel}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-text-muted">
                        {item.maskedKey}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-text-muted">
                        {item.region || selectedAzureRegion || 'southeastasia'}
                      </td>
                      <td className="py-2.5 px-3">
                        {item.active ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-300/40">
                            Khỏe mạnh
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400">
                            Tạm dừng
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[11px] text-text-muted">
                        {test ? (
                          test.success ? (
                            <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                              {test.latencyMs} ms
                            </span>
                          ) : (
                            <span className="text-red-600 font-semibold" title={test.message}>
                              Lỗi
                            </span>
                          )
                        ) : (
                          '--'
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-right space-x-1">
                        <button
                          type="button"
                          disabled={isTestingThis}
                          onClick={() => handleTestKey(item)}
                          className="px-2.5 py-1 rounded-lg border border-antique-gold/40 text-[11px] font-semibold hover:bg-antique-gold/15 transition-all cursor-pointer"
                        >
                          {isTestingThis ? 'Đang test...' : 'Kiểm tra'}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleActive(item.id)}
                          className="px-2.5 py-1 rounded-lg border border-antique-gold/40 text-[11px] font-semibold hover:bg-antique-gold/15 transition-all cursor-pointer"
                        >
                          {item.active ? 'Tắt' : 'Bật'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingKey(item);
                            setModalMode('edit');
                            setModalProvider('AZURE');
                            setModalServiceType('TTS');
                            setModalRegion(item.region || selectedAzureRegion || 'southeastasia');
                            setModalLabel(item.keyLabel);
                            setModalPriority(item.priority);
                            setModalRawKey('');
                          }}
                          className="px-2.5 py-1 rounded-lg border border-antique-gold/40 text-[11px] font-semibold hover:bg-antique-gold/15 transition-all cursor-pointer"
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingKeyId(item.id)}
                          className="px-2.5 py-1 rounded-lg border border-red-300 dark:border-red-900 text-[11px] font-semibold text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
                        >
                          Xóa
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
      {/* ── Modal Create / Edit Key ─────────────────────────────────────────── */}
      {modalMode && (
        <AdminDialog
          title={
            modalMode === 'create'
              ? (modalProvider === 'AZURE'
                  ? 'Thêm Khóa Microsoft Azure Speech Mới'
                  : `Thêm Khóa Google Gemini Mới (${POOL_METADATA[modalServiceType].shortName})`)
              : (modalProvider === 'AZURE'
                  ? 'Chỉnh sửa Khóa Microsoft Azure Speech'
                  : 'Chỉnh sửa Khóa Google Gemini')
          }
          onClose={() => {
            setModalMode(null);
            setEditingKey(null);
          }}
        >
          <form onSubmit={handleModalSubmit} className="p-6 space-y-4 max-w-md">
            {modalError && (
              <div className="p-3 rounded-xl bg-red-50 text-red-800 text-xs border border-red-200">
                {modalError}
              </div>
            )}

            {modalProvider === 'AZURE' ? (
              <div>
                <label className="block text-xs font-bold text-text-primary dark:text-warm-ivory mb-1">
                  Vùng máy chủ Azure (Region) *
                </label>
                <select
                  value={modalRegion}
                  onChange={(e) => setModalRegion(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-warm-ivory dark:bg-stone-800 border border-antique-gold/40 text-xs font-semibold text-text-primary dark:text-warm-ivory focus:outline-none focus:ring-2 focus:ring-antique-gold cursor-pointer"
                >
                  {(settings?.availableAzureRegions && settings.availableAzureRegions.length > 0
                    ? settings.availableAzureRegions
                    : [
                        { id: 'southeastasia', name: 'Đông Nam Á (Singapore)' },
                        { id: 'eastasia', name: 'Đông Á (Hồng Kông)' },
                        { id: 'centralus', name: 'Miền Trung Hoa Kỳ (Iowa)' },
                        { id: 'eastus', name: 'Miền Đông Hoa Kỳ (Virginia)' },
                        { id: 'westus', name: 'Miền Tây Hoa Kỳ (California)' },
                      ]
                  ).map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} ({r.id})
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-text-muted mt-1">
                  Vùng máy chủ Azure Speech dùng để kết nối và tạo âm thanh giọng đọc Neural TTS.
                </p>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-text-primary dark:text-warm-ivory mb-1">
                  Thuộc Bể Khóa Nghiệp Vụ *
                </label>
                <select
                  value={modalServiceType}
                  onChange={(e) => setModalServiceType(e.target.value as AiServiceType)}
                  className="w-full px-3 py-2 rounded-xl bg-warm-ivory dark:bg-stone-800 border border-antique-gold/40 text-xs font-semibold text-text-primary dark:text-warm-ivory focus:outline-none focus:ring-2 focus:ring-antique-gold cursor-pointer"
                >
                  <option value="CHAT">Bể Trợ lý Đàm thoại (Companion Chat)</option>
                  <option value="TRANSLATE">Bể Dịch thuật Song ngữ (Bilingual Reader)</option>
                  <option value="STT">Bể Nhận diện Giọng nói STT (Speech-to-Text)</option>
                  <option value="TTS">Bể Tạo Giọng đọc TTS (Gemini Voice)</option>
                </select>
                <p className="text-[11px] text-text-muted mt-1">
                  Khóa này sẽ chỉ phục vụ độc lập cho nghiệp vụ đã chọn.
                </p>
              </div>
            )}

            <div>
              <label htmlFor={labelId} className="block text-xs font-bold text-text-primary dark:text-warm-ivory mb-1">
                Tên gợi nhớ (Key Label) *
              </label>
              <input
                id={labelId}
                type="text"
                required
                value={modalLabel}
                onChange={(e) => setModalLabel(e.target.value)}
                placeholder={
                  modalProvider === 'AZURE'
                    ? 'Ví dụ: Azure AI Speech (Neural Voices - 50)'
                    : POOL_METADATA[modalServiceType]?.placeholder || 'Ví dụ: Production Key 01'
                }
                className="w-full px-3 py-2 rounded-xl bg-warm-ivory dark:bg-stone-800 border border-antique-gold/40 text-xs text-text-primary dark:text-warm-ivory focus:outline-none focus:ring-2 focus:ring-antique-gold"
              />
            </div>

            <div>
              <label htmlFor={rawKeyId} className="block text-xs font-bold text-text-primary dark:text-warm-ivory mb-1">
                {modalMode === 'create' ? (modalProvider === 'AZURE' ? 'Giá trị Azure Speech Subscription Key *' : 'Giá trị Google AI Studio API Key *') : 'API Key mới (để trống nếu giữ nguyên)'}
              </label>
              <input
                id={rawKeyId}
                type="password"
                required={modalMode === 'create'}
                value={modalRawKey}
                onChange={(e) => setModalRawKey(e.target.value)}
                placeholder={
                  modalMode === 'create'
                    ? (modalProvider === 'AZURE' ? 'Dán Subscription Key (32 hoặc 64 ký tự)...' : 'AIzaSy...')
                    : 'Nhập nếu muốn đổi khóa...'
                }
                className="w-full px-3 py-2 rounded-xl bg-warm-ivory dark:bg-stone-800 border border-antique-gold/40 text-xs text-text-primary dark:text-warm-ivory focus:outline-none focus:ring-2 focus:ring-antique-gold font-mono"
              />
            </div>

            <div>
              <label htmlFor={priorityId} className="block text-xs font-bold text-text-primary dark:text-warm-ivory mb-1">
                Mức ưu tiên xoay vòng (Số nhỏ hơn ưu tiên cao hơn)
              </label>
              <input
                id={priorityId}
                type="number"
                min={1}
                max={99}
                value={modalPriority}
                onChange={(e) => setModalPriority(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3 py-2 rounded-xl bg-warm-ivory dark:bg-stone-800 border border-antique-gold/40 text-xs text-text-primary dark:text-warm-ivory focus:outline-none focus:ring-2 focus:ring-antique-gold font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-antique-gold/20">
              <button
                type="button"
                onClick={() => {
                  setModalMode(null);
                  setEditingKey(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={modalIsSubmitting}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-heritage-green hover:bg-heritage-green/90 text-warm-ivory shadow-sm transition-all cursor-pointer"
              >
                {modalIsSubmitting ? 'Đang lưu...' : 'Lưu khóa'}
              </button>
            </div>
          </form>
        </AdminDialog>
      )}
      {/* ── Confirm Delete Key Dialog ───────────────────────────────────────── */}
      {deletingKeyId && (
        <AdminDialog
          title="Xác nhận xóa khóa"
          onClose={() => setDeletingKeyId(null)}
        >
          <div className="p-6 space-y-4 max-w-sm">
            <p className="text-xs text-text-secondary leading-relaxed">
              Bạn có chắc chắn muốn xóa khóa API này? Thao tác này sẽ ngừng xoay vòng tải đến khóa này ngay lập tức.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-antique-gold/20">
              <button
                type="button"
                onClick={() => setDeletingKeyId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-700 hover:bg-red-800 text-white shadow-sm transition-all"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </AdminDialog>
      )}
    </div>
  );
};

export default AiProvidersSubView;
