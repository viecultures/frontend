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
} from '@/data/lessonAgentCatalog';

const AVAILABLE_MODELS = ['gemini-3.1-flash-live-preview'];

export default function Sidebar() {
  const {
    isSidebarOpen,
    toggleSidebar,
    showSystemMessages,
    toggleShowSystemMessages,
  } = useUI();

  const {
    systemPrompt,
    model,
    voice,
    activeLessonId,
    conversationMode,
    customGeminiApiKey,
    theme,
    setSystemPrompt,
    setVoice,
    setActiveLessonId,
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

  const getModeInstruction = (mode: ConversationMode): string => {
    switch (mode) {
      case 'discussion':
        return `
MODE: ĐÀM THOẠI & THẢO LUẬN VĂN HÓA (Casual Cultural Conversation)
- Act as a warm, inspiring cultural guide.
- Focus on open-ended discussions about cultural traditions, personal feelings, and regional heritage.
- Encourage the learner to express their thoughts freely in English.`;
      case 'comprehension':
        return `
MODE: HỎI ĐÁP ĐỌC HIỂU & PHẢN XẠ (Reading Comprehension & Quick Reflex Q&A)
- Act as an interactive quiz master and listening tutor.
- Ask target comprehension questions based on the lesson details (facts, history, cultural significance).
- Test key vocabulary definitions and reward accurate answers.`;
      case 'shadowing':
        return `
MODE: LUYỆN PHÁT ÂM & SHADOWING (Pronunciation & Shadowing Coach)
- Act as a supportive pronunciation coach.
- Read 1 clear, well-articulated cultural sentence at a time, then ask the learner to repeat (shadow) it after you.
- Introduce key vocabulary with IPA breakdown via displayCulturalVocab and offer pronunciation tips via evaluateSpeechOrGrammar.`;
      case 'interview':
        return `
MODE: THỬ THÁCH PHỎNG VẤN SỨ GIẢ VĂN HÓA (Cultural Ambassador Interview Simulation)
- Act as a Senior Cultural Journalist / Panel Judge conducting a formal interview for the "VieCultures Ambassador" title.
- Ask structured, thought-provoking interview questions about heritage preservation, regional identity, and international promotion.
- Evaluate the clarity, depth, and confidence of the candidate's answers.`;
      default:
        return '';
    }
  };

  const scaffoldSystemPrompt = (lessonId: string, mode: ConversationMode): string => {
    const targetLesson = findLessonById(lessonId) || LESSON_AGENT_CATALOG[0];
    const modeInstruction = getModeInstruction(mode);

    return `
You are "Sứ Giả Văn Hóa AI" (VieCultures Cultural AI Companion & English Speaking/Listening Tutor).
Currently practicing English Speaking & Listening on topic: "${targetLesson.title}" (${targetLesson.vietnameseTitle}).
Province: ${targetLesson.provinceName}. Category: ${targetLesson.category}. Level: ${targetLesson.cefrLevel}.
Summary: "${targetLesson.summaryEn}".

${modeInstruction}

CORE PEDAGOGICAL WORKFLOW:
- Help the user talk about ${targetLesson.vietnameseTitle} in English according to the active MODE above.
- Call highlightMapProvince({ provinceName: "${targetLesson.provinceName}" }) when focusing on this location.
- Call displayCulturalVocab({ word, ipa, vietnameseMeaning, exampleSentence }) when introducing key cultural words.
- Encourage active English speaking, keeping voice turns concise (1-3 sentences) and ending with an engaging question.
`.trim();
  };

  // When lesson changes, auto-scaffold dynamic prompt
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
      setSystemPrompt(scaffoldSystemPrompt(newLessonId, conversationMode));
    }
  };

  // When conversation mode changes, auto-scaffold dynamic prompt
  const handleModeChange = (newMode: ConversationMode) => {
    setConversationMode(newMode);
    setSystemPrompt(scaffoldSystemPrompt(activeLessonId, newMode));
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

          {/* System Prompt */}
          <div className="space-y-1.5 mb-4">
            <label className="text-xs font-bold text-gray-300">
              Chỉ Dẫn Hệ Thống (System Prompt)
            </label>
            <textarea
              value={systemPrompt}
              disabled={connected}
              onChange={e => setSystemPrompt(e.target.value)}
              rows={8}
              placeholder="Mô tả vai trò và phong cách hướng dẫn của Gia sư AI..."
              className="w-full text-xs leading-relaxed font-mono"
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
