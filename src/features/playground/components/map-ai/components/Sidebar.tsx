/**
 * Settings Sidebar for Cultural Speaking & Listening AI Tutor
 */

import React, { useEffect, useMemo } from 'react';
import {
  useSettings,
  useUI,
  useLogStore,
  useTools,
  useMapStore,
  type ConversationMode,
} from '../lib/state';
import c from 'classnames';
import {
  AVAILABLE_VOICES_FULL,
  AVAILABLE_VOICES_LIMITED,
  MODELS_WITH_LIMITED_VOICES,
  DEFAULT_VOICE,
} from '../lib/constants';
import { useLiveAPIContext } from '../contexts/LiveAPIContext';
import {
  X,
  AlertTriangle,
  Download,
  RefreshCw,
  BookOpen,
  Mic,
  Volume2,
  Key,
  Sparkles,
} from 'lucide-react';
import {
  LESSON_AGENT_CATALOG,
  findLessonById,
  type LessonAgentMetadata,
  type ProficiencyLevel,
} from '@/data/lessonAgentCatalog';

const AVAILABLE_MODELS = ['gemini-3.1-flash-live-preview', 'gemini-2.0-flash-realtime-exp'];

export default function Sidebar() {
  const {
    isSidebarOpen,
    toggleSidebar,
    showSystemMessages,
    toggleShowSystemMessages,
  } = useUI();

  const {
    model,
    voice,
    activeLessonId,
    conversationMode,
    proficiencyLevel,
    customGeminiApiKey,
    theme,
    setVoice,
    setActiveLessonId,
    setProficiencyLevel,
    setConversationMode,
    setCustomGeminiApiKey,
    setTheme,
  } = useSettings();

  const { connected, connect, disconnect } = useLiveAPIContext();

  const availableVoices = useMemo(() => {
    const isLimited =
      MODELS_WITH_LIMITED_VOICES.includes(model) ||
      !AVAILABLE_MODELS.includes(model) ||
      model.includes('flash') ||
      model.includes('live');
    return isLimited ? AVAILABLE_VOICES_LIMITED : AVAILABLE_VOICES_FULL;
  }, [model]);

  useEffect(() => {
    if (!availableVoices.some(v => v.name === voice)) {
      setVoice(DEFAULT_VOICE);
    }
  }, [availableVoices, voice, setVoice]);

  // When lesson changes
  const handleLessonChange = (newLessonId: string) => {
    setActiveLessonId(newLessonId);
    const targetLesson = findLessonById(newLessonId);
    if (targetLesson) {
      if (targetLesson.provinceId) {
        useMapStore.getState().setCameraTarget({
          provinceId: targetLesson.provinceId,
          region: targetLesson.region,
        });
        useMapStore.getState().setHighlightedPlaceId(targetLesson.provinceId);
      }
    }
  };

  // When proficiency level changes
  const handleLevelChange = (newLevel: ProficiencyLevel) => {
    setProficiencyLevel(newLevel);
  };

  // When conversation mode changes
  const handleModeChange = (newMode: ConversationMode) => {
    setConversationMode(newMode);
  };

  const handleExportLogs = () => {
    const { turns, sessionMetadata } = useLogStore.getState();
    const config = useSettings.getState();
    const { tools } = useTools.getState();

    const logData = {
      metadata: sessionMetadata,
      configuration: {
        model: config.model,
        activeLessonId: config.activeLessonId,
        proficiencyLevel: config.proficiencyLevel,
        conversationMode: config.conversationMode,
        systemPrompt: config.systemPrompt,
      },
      tools,
      conversation: turns.map(turn => ({
        ...turn,
        timestamp: turn.timestamp.toISOString(),
      })),
    };

    const jsonString = JSON.stringify(logData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    a.href = url;
    a.download = `cultural-speaking-session-${timestamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <aside className={c('sidebar', { open: isSidebarOpen })}>
      <div className="sidebar-header">
        <div className="flex items-center gap-2 text-[#D4AF37]">
          <Sparkles className="w-5 h-5 text-[#D4AF37]" />
          <h3 className="font-serif font-bold text-base text-white">Cài Đặt Gia Sư AI</h3>
        </div>
        <button onClick={toggleSidebar} className="close-button" aria-label="Đóng cài đặt">
          <X className="w-5 h-5 text-gray-400 hover:text-white" />
        </button>
      </div>

      <div className="sidebar-content">
        {connected && (
          <div
            className="sidebar-warning-banner"
            style={{
              background: '#f59e0b',
              color: '#ffffff',
              padding: '10px 14px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              animation: 'fadeIn 0.2s ease-out',
            }}
          >
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Tạm dừng buổi học để áp dụng các thay đổi cấu hình.</span>
          </div>
        )}

        <div className="sidebar-section">
          {/* Target Reading Lesson Selector */}
          <div className="space-y-1.5 mb-4">
            <label className="flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Bài Đọc Văn Hóa Mục Tiêu</span>
            </label>
            <select
              value={activeLessonId}
              disabled={connected}
              onChange={e => handleLessonChange(e.target.value)}
              className="w-full text-xs font-serif"
            >
              {LESSON_AGENT_CATALOG.map((lesson: LessonAgentMetadata) => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.vietnameseTitle} ({lesson.provinceName})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-gray-400">
              Gia sư AI sẽ tự động đồng bộ bản đồ, từ vựng và câu hỏi theo bài học này.
            </p>
          </div>

          {/* Proficiency Level Selector (Level 1, Level 2, Level 3) */}
          <div className="space-y-1.5 mb-4">
            <label className="flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Trình Độ Luyện Nói &amp; Nội Dung</span>
            </label>
            <select
              value={proficiencyLevel}
              disabled={connected}
              onChange={e => handleLevelChange(e.target.value as ProficiencyLevel)}
              className="w-full text-xs font-semibold"
            >
              <option value="Level 1">Level 1 (A1–A2) — Sơ cấp · Câu ngắn &amp; Gợi ý mẫu câu</option>
              <option value="Level 2">Level 2 (B1–B2) — Trung cấp · Đàm thoại tự nhiên &amp; So sánh</option>
              <option value="Level 3">Level 3 (B2–C1) — Cao cấp · Di sản chuyên sâu &amp; Phản biện</option>
            </select>
            <p className="text-[11px] text-gray-400">
              {proficiencyLevel === 'Level 1' && 'Level 1: Từ vựng đơn giản, câu 5-10 từ, kèm mẫu câu gợi ý (Sentence Starters).'}
              {proficiencyLevel === 'Level 2' && 'Level 2: Đàm thoại tự nhiên, câu ghép nối ý, từ vựng văn hóa tiêu chuẩn.'}
              {proficiencyLevel === 'Level 3' && 'Level 3: Thuật ngữ học thuật, tư duy phản biện, đối thoại vai trò Sứ giả Văn hóa.'}
            </p>
          </div>

          {/* Conversation Mode */}
          <div className="space-y-1.5 mb-4">
            <label className="flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
              <Mic className="w-3.5 h-3.5" />
              <span>Chế Độ Luyện Tập</span>
            </label>
            <select
              value={conversationMode}
              disabled={connected}
              onChange={e => handleModeChange(e.target.value as ConversationMode)}
              className="w-full text-xs"
            >
              <option value="discussion">Đàm Thoại &amp; Thảo Luận Văn Hóa</option>
              <option value="comprehension">Hỏi Đáp Đọc Hiểu &amp; Phản Xạ</option>
              <option value="shadowing">Luyện Phát Âm &amp; Shadowing</option>
              <option value="interview">Thử Thách Phỏng Vấn Sứ Giả</option>
            </select>
          </div>

          {/* Voice Selection */}
          <div className="space-y-1.5 mb-4">
            <label className="flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Giọng Nói &amp; Ngữ Điệu Gia Sư AI</span>
            </label>
            <select
              value={voice}
              disabled={connected}
              onChange={e => setVoice(e.target.value)}
              className="w-full text-xs"
            >
              {availableVoices.map(v => (
                <option key={v.name} value={v.name}>
                  {v.name} — {v.description}
                </option>
              ))}
            </select>
          </div>

          {/* Gemini API Key */}
          <div className="space-y-1.5 mb-4">
            <label className="flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
              <Key className="w-3.5 h-3.5" />
              <span>Gemini API Key (Tùy Chọn)</span>
            </label>
            <input
              type="password"
              value={customGeminiApiKey}
              disabled={connected}
              onChange={e => setCustomGeminiApiKey(e.target.value)}
              placeholder="Nhập API Key để ghi đè .env (nếu có)..."
              className="w-full text-xs font-mono"
            />
          </div>

          {/* System Messages Toggle */}
          <div className="settings-toggle-item">
            <label className="tool-checkbox-wrapper">
              <input
                type="checkbox"
                id="system-message-toggle"
                checked={showSystemMessages}
                onChange={toggleShowSystemMessages}
              />
              <span className="checkbox-visual"></span>
            </label>
            <label
              htmlFor="system-message-toggle"
              className="settings-toggle-label text-xs"
            >
              Hiển thị thẻ từ vựng &amp; góp ý luyện nói
            </label>
          </div>

          {/* Color Theme */}
          <div className="settings-toggle-item" style={{ marginTop: '16px', borderTop: '1px solid var(--gray-850)', paddingTop: '16px' }}>
            <label htmlFor="theme-select" className="settings-toggle-label text-xs" style={{ flex: 1 }}>
              Giao Diện
            </label>
            <select
              id="theme-select"
              value={theme}
              onChange={e => setTheme(e.target.value as 'dark' | 'light')}
              style={{ width: '110px', padding: '6px', borderRadius: '6px', background: 'var(--gray-1000)', border: '1px solid var(--gray-800)', color: 'var(--text)' }}
            >
              <option value="dark">Tối (Dark)</option>
              <option value="light">Sáng (Light)</option>
            </select>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sidebar-actions">
          <button onClick={handleExportLogs} title="Xuất lịch sử buổi luyện nói">
            <Download className="w-4 h-4 mr-1.5" />
            Xuất Nhật Ký
          </button>
          <button
            onClick={() => {
              useLogStore.getState().clearTurns();
              const mapStore = useMapStore.getState();
              mapStore.clearMarkers();
              mapStore.setCameraTarget(null);

              if (connected) {
                disconnect();
                setTimeout(connect, 500);
              }
            }}
            title="Làm mới phiên luyện tập"
          >
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Làm Mới Phiên
          </button>
        </div>
      </div>
    </aside>
  );
}
