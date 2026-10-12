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
  type CulturalTutorMode,
  type CorrectionMode,
  type MapContextMode,
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
import { PROFICIENCY_LEVELS } from '../lib/prompt-scaffolder';

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
    tutorMode,
    correctionMode,
    mapContextMode,
    proficiencyLevel,
    customGeminiApiKey,
    theme,
    setVoice,
    setActiveLessonId,
    setProficiencyLevel,
    setTutorMode,
    setCorrectionMode,
    setMapContextMode,
    setCustomGeminiApiKey,
    setTheme,
  } = useSettings();

  const { connected: sessionConnected, connecting, disconnect, sendPrompt } = useLiveAPIContext();
  const connected = sessionConnected || connecting;

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
  const handleLevelChange = async (newLevel: ProficiencyLevel) => {
    setProficiencyLevel(newLevel);
    if (sessionConnected) {
      await sendPrompt(PROFICIENCY_LEVELS[newLevel].switchPrompt);
    }
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
        tutorMode: config.tutorMode,
        correctionMode: config.correctionMode,
        mapContextMode: config.mapContextMode,
        systemPrompt: sessionMetadata?.systemPrompt,
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
          {tutorMode !== 'free-conversation' && <div className="space-y-1.5 mb-4">
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
              Gia sư AI sẽ đồng bộ bản đồ, từ vựng và câu hỏi theo bài học này.
            </p>
          </div>}

          {/* Proficiency Level Selector (Level 1, Level 2, Level 3) */}
          <div className="space-y-1.5 mb-4">
            <label className="flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Trình Độ Luyện Nói &amp; Nội Dung</span>
            </label>
            <select
              value={proficiencyLevel}
              disabled={connecting}
              onChange={e => void handleLevelChange(e.target.value as ProficiencyLevel)}
              className="w-full text-xs font-semibold"
            >
              <option value="Level 1">Level 1 (A1) — Nói CHẬM · Câu 5-10 từ · Ngữ pháp A1 &amp; Starters/Movers</option>
              <option value="Level 2">Level 2 (B1–B2) — Trung cấp · Đàm thoại tự nhiên &amp; So sánh vùng miền</option>
              <option value="Level 3">Level 3 (B2–C1) — Cao cấp · Di sản chuyên sâu &amp; Phản biện</option>
            </select>
            <p className="text-[11px] text-gray-400">
              {proficiencyLevel === 'Level 1' && 'Level 1: AI nói chậm, chia 2-3 đoạn ngắn, mỗi câu 1 ý chính (5-10 từ), ngữ pháp A1 (There is, People make), kèm mẫu câu gợi ý.'}
              {proficiencyLevel === 'Level 2' && 'Level 2: Tốc độ tự nhiên, câu ghép 10-18 từ, từ vựng văn hóa tiêu chuẩn, câu hỏi so sánh vùng miền.'}
              {proficiencyLevel === 'Level 3' && 'Level 3: Tốc độ lưu loát bản ngữ, câu phức học thuật, thuật ngữ di sản chuyên sâu, tư duy phản biện & bảo tồn.'}
            </p>
          </div>

          {/* Cultural Tutor Mode */}
          <div className="space-y-1.5 mb-4">
            <label className="flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
              <Mic className="w-3.5 h-3.5" />
              <span>Chế Độ Học &amp; Đàm Thoại</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={connected}
                onClick={() => setTutorMode('free-conversation')}
                className={`py-2 px-2 rounded-lg text-xs font-semibold text-center border transition-all ${
                  tutorMode === 'free-conversation'
                    ? 'bg-[#1E4B43] text-[#D4AF37] border-[#D4AF37]/60 shadow-md font-bold'
                    : 'bg-[#141b22] text-gray-400 border-white/10 hover:text-white'
                }`}
              >
                Đàm thoại tự do
              </button>
              <button
                type="button"
                disabled={connected}
                onClick={() => setTutorMode('guided-lesson')}
                className={`py-2 px-2 rounded-lg text-xs font-semibold text-center border transition-all ${
                  tutorMode === 'guided-lesson'
                    ? 'bg-[#1E4B43] text-[#D4AF37] border-[#D4AF37]/60 shadow-md font-bold'
                    : 'bg-[#141b22] text-gray-400 border-white/10 hover:text-white'
                }`}
              >
                Luyện tập bài đọc
              </button>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              {tutorMode === 'guided-lesson'
                ? 'Luyện theo bài học di sản: AI dẫn dắt Nghe, Nói, Từ vựng và Đọc hiểu.'
                : 'Trò chuyện tự do: Đàm thoại tiếng Anh tự nhiên về văn hóa, địa danh Việt Nam.'}
            </p>
          </div>

          {tutorMode === 'free-conversation' && (
            <>
              <div className="space-y-1.5 mb-4">
                <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">Sửa lỗi trong hội thoại</label>
                <select value={correctionMode} disabled={connected} onChange={e => setCorrectionMode(e.target.value as CorrectionMode)} className="w-full text-xs">
                  <option value="off">Tắt sửa lỗi</option>
                  <option value="after-turn">Sửa sau mỗi lượt nói</option>
                  <option value="end-of-session">Tổng hợp cuối buổi</option>
                </select>
              </div>
              <div className="space-y-1.5 mb-4">
                <label className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">AI điều khiển bản đồ</label>
                <select value={mapContextMode} disabled={connected} onChange={e => setMapContextMode(e.target.value as MapContextMode)} className="w-full text-xs">
                  <option value="off">Tắt điều khiển bằng AI</option>
                  <option value="on-demand">Khi tôi yêu cầu chỉ địa điểm</option>
                </select>
                <p className="text-[11px] text-gray-400">Bạn luôn có thể khám phá map độc lập. Bấm Hỏi AI để đưa địa điểm vào cuộc trò chuyện.</p>
              </div>
            </>
          )}

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
              disconnect();
              useLogStore.getState().clearTurns();
            }}
            title="Làm mới phiên luyện tập"
          >
            <RefreshCw className="w-4 h-4 mr-1.5" />
            Cuộc trò chuyện mới
          </button>
        </div>
      </div>
    </aside>
  );
}
