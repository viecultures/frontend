/**
 * StreamingConsole for Cultural Speaking & Listening AI Tutor
 */

import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { useLiveAPIContext } from '../../contexts/LiveAPIContext';
import {
  useSettings,
  useLogStore,
  useUI,
} from '../../lib/state';
import { User, Sparkles, RefreshCw, BookOpen, MessageSquareText, Compass, MapPin } from 'lucide-react';
import { findLessonById, LESSON_AGENT_CATALOG, type LessonAgentMetadata } from '@/data/lessonAgentCatalog';
import { PROFICIENCY_LEVELS, type ProficiencyLevel } from '../../lib/prompt-scaffolder';
import AiMapLessonProgressBar from '../AiMapLessonProgressBar';
import { InPlaceDictionaryPopup } from '@/features/reader/components/InPlaceDictionaryPopup';
import { useTimelineSelection } from './useTimelineSelection';

const MessageMarkdown = memo(function MessageMarkdown({ text }: { text: string }) {
  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>;
});

const formatTimestamp = (date: Date) => {
  const pad = (num: number, size = 2) => num.toString().padStart(size, '0');
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  return `${hours}:${minutes}:${seconds}`;
};

// Lesson Prompt Recommendations Map (Strictly SVG icons / Clean text)
const LESSON_QUICK_ACTIONS: Record<string, Array<{ text: string; label: string }>> = {
  'pho-hanoi-history': [
    { text: 'Can you summarize the main story of Hanoi Pho in English?', label: 'Nước dùng Phở Hà Nội' },
    { text: 'How does Hanoi-style Pho differ from Southern Vietnamese Pho?', label: 'So sánh Phở Bắc & Nam' },
    { text: 'Let’s practice using the phrase "culinary heritage" in a natural sentence.', label: 'Luyện từ "Culinary Heritage"' },
    { text: 'Could you ask me a comprehension question about Hanoi Pho?', label: 'Đố vui nghe hiểu' },
  ],
  'ha-long-bay': [
    { text: 'Why is Ha Long Bay recognized as a UNESCO World Natural Heritage site?', label: 'Kỳ quan Vịnh Hạ Long' },
    { text: 'Tell me the legend of the descending dragons in English.', label: 'Truyền thuyết Rồng Giáng' },
    { text: 'Let’s practice discussing sustainable tourism in Ha Long Bay.', label: 'Thảo luận du lịch xanh' },
  ],
  'gong-culture-tay-nguyen': [
    { text: 'Tell me about the UNESCO Gong Culture in Central Highlands.', label: 'Không Gian Cồng Chiêng' },
    { text: 'What spiritual role do bronze gongs play in ethnic minority communities?', label: 'Nghi lễ tâm linh' },
    { text: 'Let’s practice using the phrase "intangible heritage" in a sentence.', label: 'Luyện từ "Intangible Heritage"' },
  ],
  'non-la-culture': [
    { text: 'What makes the Hue poem-hat (nón bài thơ) so special in Vietnamese culture?', label: 'Nón bài thơ xứ Huế' },
    { text: 'Let’s practice describing traditional craft materials in English.', label: 'Làng nghề nón lá' },
  ],
  'my-son-sanctuary': [
    { text: 'Tell me about the ancient Champa brick towers at My Son Sanctuary.', label: 'Thánh địa Mỹ Sơn' },
    { text: 'What architectural mystery makes Champa mortarless brickwork unique?', label: 'Bí ẩn gạch không vữa' },
  ],
  'floating-markets-mekong': [
    { text: 'How does Cai Rang Floating Market operate early in the morning?', label: 'Chợ nổi Cái Răng' },
    { text: 'What is a "cay beo" bamboo sample pole used for?', label: 'Ý nghĩa Cây Bẹo' },
  ],
  'nem-ran-spring-rolls': [
    { text: 'What ingredients make traditional northern Nem Ran so crispy?', label: 'Bí quyết Nem Rán' },
    { text: 'Let’s roleplay explaining how to wrap Vietnamese spring rolls in English.', label: 'Hướng dẫn gói nem' },
  ],
  'dong-ho-paintings': [
    { text: 'How do Dong Ho village artisans make natural colors from plants and shells?', label: 'Màu sắc tranh Đông Hồ' },
    { text: 'What cultural blessings do traditional woodblock prints represent?', label: 'Ý nghĩa lời chúc dân gian' },
  ],
};

export default function StreamingConsole() {
  const {
    activeView, connected, sendMessage, changeLevel, connecting, ending,
    isSending, isRestoringContext, isAwaitingResponse,
  } = useLiveAPIContext();
  const active = activeView === 'chat';
  const busy = !active || connecting || ending || isSending || isRestoringContext;
  const { activeLessonId, proficiencyLevel, tutorMode } = useSettings();
  const turns = useLogStore(state => state.turns);
  const sessionId = useLogStore(state => state.sessionMetadata?.sessionId);
  const { showSystemMessages } = useUI();
  const isAwaitingFunctionResponse = useLogStore(state => state.isAwaitingFunctionResponse);
  const {
    scrollRef, selectedWord, wordPosition, closeSelection, handlePointerDown,
    handleTextSelection, handleScroll, hasNewMessages, scrollToLatest, renderedTurn,
  } = useTimelineSelection(turns, active, sessionId);
  const activeLesson: LessonAgentMetadata =
    findLessonById(activeLessonId) || LESSON_AGENT_CATALOG[0];
  const displayedTurns = showSystemMessages ? turns : turns.filter(turn => turn.role !== 'system');

  const guidedActions =
    LESSON_QUICK_ACTIONS[activeLesson.id] || [
      { text: `Tell me about the history and importance of ${activeLesson.vietnameseTitle}.`, label: `Tìm hiểu về ${activeLesson.vietnameseTitle}` },
      { text: `What key English vocabulary should I know about this cultural topic?`, label: `Học từ vựng chủ đề` },
      { text: `Let's practice discussing ${activeLesson.vietnameseTitle} together.`, label: `Bắt đầu đàm thoại` },
    ];
  const conversationActions = [
    { text: 'Let’s have a natural conversation about Vietnamese food and regional flavors.', label: 'Ẩm thực Việt Nam' },
    { text: 'Let’s talk about a Vietnamese festival and what it means to local people.', label: 'Lễ hội Việt Nam' },
    { text: 'Let’s discuss Vietnamese family traditions in everyday life.', label: 'Đời sống & gia đình' },
    { text: 'Let’s compare cultural life in Northern, Central, and Southern Vietnam.', label: 'So sánh ba miền' },
  ];
  const quickActions = tutorMode === 'free-conversation' ? conversationActions : guidedActions;

  const handleSendPrompt = async (text: string) => {
    if (!busy) await sendMessage({ text, source: 'suggestion' });
  };
  const handleLevelSwitch = async (level: ProficiencyLevel) => {
    if (busy || proficiencyLevel === level) return;
    await changeLevel(level);
  };

  return (
    <div className="transcription-container flex flex-col h-full bg-[#121619] text-[#f1f3f4]">
      <AiMapLessonProgressBar />
      {/* Target Lesson Header Banner */}
      <div className="flex-shrink-0 p-3 bg-[#181d20] border-b border-white/10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-[#1E4B43] text-[#D4AF37] flex items-center justify-center font-bold flex-shrink-0 shadow border border-[#D4AF37]/30">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase tracking-wider bg-[#D4AF37]/20 text-[#FCE5B5] font-semibold border border-[#D4AF37]/30">
                {tutorMode === 'free-conversation' ? 'Đàm Thoại Tự Do' : `Bài Đọc · ${activeLesson.category}`}
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase font-bold bg-[#1E4B43] text-[#D4AF37] border border-[#D4AF37]/40">
                {proficiencyLevel}
              </span>
              {tutorMode !== 'free-conversation' && activeLesson.provinceName && (
                <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
                  <MapPin className="w-3 h-3 text-[#D4AF37]" />
                  {activeLesson.provinceName}
                </span>
              )}
            </div>
            <h2 className="text-xs font-serif font-bold text-white truncate max-w-[260px] sm:max-w-[320px]">
              {tutorMode === 'free-conversation' ? 'Trò chuyện về Việt Nam · Khám phá map tự do' : activeLesson.vietnameseTitle}
            </h2>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 ml-auto">
            {/* 2-Mode Quick Switcher */}
            <div className="flex items-center bg-black/40 p-0.5 rounded-lg border border-white/10 text-[10px]">
              <button
                type="button"
                disabled={connected || busy}
                aria-pressed={tutorMode === 'free-conversation'}
                onClick={() => useSettings.getState().setTutorMode('free-conversation')}
                className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
                  tutorMode === 'free-conversation'
                    ? 'bg-[#1E4B43] text-[#D4AF37] font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Đàm thoại tự do về văn hóa Việt Nam"
              >
                Đàm thoại
              </button>
              <button
                type="button"
                disabled={connected || busy}
                aria-pressed={tutorMode === 'guided-lesson'}
                onClick={() => useSettings.getState().setTutorMode('guided-lesson')}
                className={`px-2 py-0.5 rounded transition-colors whitespace-nowrap ${
                  tutorMode === 'guided-lesson'
                    ? 'bg-[#1E4B43] text-[#D4AF37] font-bold shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
                title="Luyện tập bài đọc & bài học di sản"
              >
                Bài đọc
              </button>
            </div>

            <div className="level-quick-switch" aria-label="Quick level switch">
              {(['Level 1', 'Level 2', 'Level 3'] as const).map(level => (
                <button
                  key={level}
                  type="button"
                  disabled={busy}
                  aria-pressed={proficiencyLevel === level}
                  onClick={() => void handleLevelSwitch(level)}
                  title={`Chuyển sang ${level}: ${PROFICIENCY_LEVELS[level].description}`}
                >{level.replace('Level ', 'L')}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Message Timeline */}
      <div
        className="transcription-view flex-1 overflow-y-auto p-4 space-y-3.5 select-text"
        ref={scrollRef}
        onPointerDownCapture={handlePointerDown}
        onScroll={handleScroll}
        style={{ overflowAnchor: 'none' }}
        onMouseUp={handleTextSelection}
        onDoubleClick={handleTextSelection}
      >
        {displayedTurns.length === 0 && !isAwaitingFunctionResponse ? (
          <div className="empty-state text-center py-10 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1E4B43]/60 text-[#D4AF37] flex items-center justify-center mx-auto shadow-lg border border-[#D4AF37]/30">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-serif font-bold text-white">
                Sứ Giả Văn Hóa AI — Luyện Nói &amp; Luyện Nghe
              </h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                Đàm thoại tiếng Anh thời gian thực cùng trợ lý AI về chủ đề <strong>{tutorMode === 'free-conversation' ? 'văn hóa Việt Nam' : activeLesson.vietnameseTitle}</strong>. Bấm nút <strong>Play</strong> bên dưới hoặc chọn gợi ý để bắt đầu.
              </p>
            </div>

            {/* Quick Action Suggestion Chips */}
            <div className="pt-2 flex flex-wrap gap-2 justify-center max-w-md mx-auto">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
                  disabled={busy}
                  onClick={() => handleSendPrompt(action.text)}
                  className="px-3 py-1.5 rounded-full bg-[#1E4B43]/30 hover:bg-[#1E4B43] border border-[#D4AF37]/30 text-[#FCE5B5] text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer text-left"
                >
                  <MessageSquareText className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0" />
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {displayedTurns.map(turn => {
              const t = renderedTurn(turn);
              const isSystem = t.role === 'system';

              if (isSystem) {
                return (
                  <div
                    key={t.id}
                  data-turn-id={t.id}
                    className="p-3 rounded-xl bg-[#1E4B43]/20 border border-[#D4AF37]/30 text-xs text-[#E8ECE9] shadow-sm space-y-1 animate-fadeIn"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#D4AF37]">
                      <span className="font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Trợ Lý Văn Hóa &amp; Ngôn Ngữ
                      </span>
                      <span>{formatTimestamp(t.timestamp)}</span>
                    </div>
                    <div className="prose prose-invert prose-xs leading-relaxed max-w-none select-text cursor-text">
                      <MessageMarkdown text={t.text} />
                    </div>
                  </div>
                );
              }

              const isUser = t.role === 'user';
              return (
                <div
                  key={t.id}
                    data-turn-id={t.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-fadeIn`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs shadow ${
                      isUser
                        ? 'bg-[#2563EB] text-white'
                        : 'bg-[#1E4B43] text-[#D4AF37] border border-[#D4AF37]/30'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                      isUser
                        ? 'bg-[#2563EB] text-white rounded-tr-sm shadow-md'
                        : 'bg-[#232729] text-[#f1f3f4] border border-white/10 rounded-tl-sm shadow-md'
                    }`}
                  >
                    <div className="prose prose-invert prose-xs max-w-none select-text cursor-text">
                      <MessageMarkdown text={t.text} />
                    </div>
                  </div>
                </div>
              );
            })}

            {active && (isAwaitingFunctionResponse || isAwaitingResponse) && (
              <div className="flex items-center gap-2 text-xs text-[#D4AF37] p-2 bg-[#1E4B43]/20 rounded-lg border border-[#D4AF37]/20">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Gia sư AI đang đồng bộ bản đồ &amp; chuẩn bị bài luyện tập...</span>
              </div>
            )}

            {/* In-chat Suggested Follow-ups */}
            <div className="pt-2 flex flex-wrap gap-1.5">
              {quickActions.slice(0, 3).map((action, idx) => (
                <button
                  key={idx}
                  disabled={busy}
                  onClick={() => handleSendPrompt(action.text)}
                  className="px-2.5 py-1 rounded-full bg-[#232729] hover:bg-[#1E4B43] border border-white/10 text-xs text-[#D4AF37] transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Compass className="w-3 h-3" />
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      {active && hasNewMessages && <button type="button" onClick={scrollToLatest} className="mx-auto my-2 rounded-full bg-[#1E4B43] px-4 py-2 text-xs text-[#D4AF37]">Tin nhắn mới ↓</button>}
      <InPlaceDictionaryPopup
        isOpen={active && Boolean(selectedWord && wordPosition)}
        vocab={selectedWord}
        position={wordPosition}
        onClose={closeSelection}
        themeMode="dark"
      />
    </div>
  );
}
