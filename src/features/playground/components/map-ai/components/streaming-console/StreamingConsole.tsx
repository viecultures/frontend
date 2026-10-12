/**
 * StreamingConsole for Cultural Speaking & Listening AI Tutor
 */

import React, { useEffect, useRef } from 'react';
import { Modality } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { useLiveAPIContext } from '../../contexts/LiveAPIContext';
import {
  useSettings,
  useLogStore,
  useTools,
  type ConversationTurn,
  useUI,
} from '../../lib/state';
import { User, Sparkles, RefreshCw, BookOpen, MessageSquareText, Compass, MapPin } from 'lucide-react';
import { findLessonById, LESSON_AGENT_CATALOG, type LessonAgentMetadata } from '@/data/lessonAgentCatalog';
import QuickModeSwitcher from '../QuickModeSwitcher';
import { debugLog } from '../../lib/debug-logger';
import { buildCulturalTutorPrompt } from '../../lib/constants';

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
    client,
    connected,
    connect,
    setConfig,
  } = useLiveAPIContext();

  const { systemPrompt, voice, model, activeLessonId, proficiencyLevel, tutorMode, correctionMode, mapContextMode } = useSettings();
  const { tools } = useTools();
  const turns = useLogStore(state => state.turns);
  const { showSystemMessages } = useUI();
  const { isAwaitingFunctionResponse } = useLogStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastInterruptionTime = useRef(0);

  const activeLesson: LessonAgentMetadata =
    findLessonById(activeLessonId) || LESSON_AGENT_CATALOG[0];

  const effectiveSystemPrompt = buildCulturalTutorPrompt(systemPrompt, { mode: tutorMode, correctionMode, mapContextMode, level: proficiencyLevel });

  const displayedTurns = showSystemMessages
    ? turns
    : turns.filter(turn => turn.role !== 'system');

  useEffect(() => {
    const enabledTools = [
      {
        functionDeclarations: tools
          .filter(tool => tool.isEnabled)
          .map(tool => ({
            name: tool.name,
            description: tool.description,
            parameters: tool.parameters,
          })),
      },
    ];

    const config: any = {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: {
            voiceName: voice,
          },
        },
      },
      inputAudioTranscription: {},
      outputAudioTranscription: {},
      systemInstruction: effectiveSystemPrompt,
      tools: enabledTools,
    };

    const { initSession } = useLogStore.getState();
    initSession({ systemPrompt: effectiveSystemPrompt, model });

    setConfig(config);
  }, [setConfig, effectiveSystemPrompt, tools, voice, model]);

  useEffect(() => {
    const handleInputTranscription = (text: string, isFinal: boolean) => {
      const { turns, updateLastTurn, addTurn } = useLogStore.getState();
      const last = turns[turns.length - 1];

      const trimmedText = text.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      if (['googleawesome', 'tomute'].includes(trimmedText)) return;
      if (text.trim() && !trimmedText) return;

      if (last && last.role === 'user' && !last.isFinal) {
        const needsSpace = last.text && text && !last.text.endsWith(' ') && !text.startsWith(' ');
        const nextText = last.text + (needsSpace ? ' ' : '') + text;
        updateLastTurn({
          text: nextText,
          isFinal,
        });
        debugLog.info(`UI User Turn cập nhật: "${nextText}"`, { delta: text, isFinal });
      } else {
        addTurn({ role: 'user', text, isFinal });
        debugLog.info(`UI User Turn tạo mới: "${text}"`, { isFinal });
      }
    };

    const handleOutputTranscription = (text: string, isFinal: boolean) => {
      const { turns, updateLastTurn, mergeIntoLastAgentTurn } = useLogStore.getState();
      const last = turns[turns.length - 1];

      // Finalize pending user turn when agent starts generating response
      if (last?.role === 'user' && !last.isFinal) {
        updateLastTurn({ isFinal: true });
        debugLog.info(`Chốt lượt nói của người dùng (Finalized User Turn): "${last.text}"`);
      }

      const trimmedText = text.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      if (['googleawesome', 'tomute'].includes(trimmedText)) return;
      if (text.trim() && !trimmedText) return;

      const timeSinceInterruption = Date.now() - lastInterruptionTime.current;
      if (timeSinceInterruption < 1500) {
        if (last?.role === 'user') {
          const match = text.match(/^([a-z\s]{1,10})([A-Z].*)/);
          if (match) {
            text = match[2];
          }
        }
      }

      const turnData: Omit<ConversationTurn, 'timestamp' | 'role'> = {
        text,
        isFinal,
      };

      mergeIntoLastAgentTurn(turnData);
    };

    const handleTurnComplete = () => {
      const { mergeIntoLastAgentTurn, updateLastTurn, turns } = useLogStore.getState();
      mergeIntoLastAgentTurn({ text: '', isFinal: true });
      const last = turns[turns.length - 1];
      if (last && !last.isFinal) {
        updateLastTurn({ isFinal: true });
      }
      debugLog.ws('Agent hoàn tất lượt sinh nội dung (turnComplete)');
    };


    const handleInterrupted = () => {
      const { turns, updateLastTurn, setIsAwaitingFunctionResponse } = useLogStore.getState();
      const last = turns[turns.length - 1];
      if (last && last.role === 'agent' && !last.isFinal) {
        updateLastTurn({ isFinal: true });
      }
      lastInterruptionTime.current = Date.now();
      setIsAwaitingFunctionResponse(false);
    };

    client.on('inputTranscription', handleInputTranscription);
    client.on('outputTranscription', handleOutputTranscription);
    client.on('turncomplete', handleTurnComplete);
    client.on('generationcomplete', handleTurnComplete);
    client.on('interrupted', handleInterrupted);

    return () => {
      client.off('inputTranscription', handleInputTranscription);
      client.off('outputTranscription', handleOutputTranscription);
      client.off('turncomplete', handleTurnComplete);
      client.off('generationcomplete', handleTurnComplete);
      client.off('interrupted', handleInterrupted);
    };
  }, [client]);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayedTurns]);

  const quickActions =
    LESSON_QUICK_ACTIONS[activeLesson.id] || [
      { text: `Tell me about the history and importance of ${activeLesson.vietnameseTitle}.`, label: `Tìm hiểu về ${activeLesson.vietnameseTitle}` },
      { text: `What key English vocabulary should I know about this cultural topic?`, label: `Học từ vựng chủ đề` },
      { text: `Let's practice discussing ${activeLesson.vietnameseTitle} together.`, label: `Bắt đầu đàm thoại` },
    ];

  const handleSendPrompt = async (text: string) => {
    if (!connected) await connect();
    client.sendRealtimeText(text);
    useLogStore.getState().addTurn({
      role: 'user',
      text: text,
      isFinal: true,
    });
  };

  return (
    <div className="transcription-container flex flex-col h-full bg-[#121619] text-[#f1f3f4]">
      {/* Target Lesson Header Banner */}
      <div className="flex-shrink-0 p-3 bg-[#181d20] border-b border-white/10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-[#1E4B43] text-[#D4AF37] flex items-center justify-center font-bold flex-shrink-0 shadow border border-[#D4AF37]/30">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase tracking-wider bg-[#D4AF37]/20 text-[#FCE5B5] font-semibold border border-[#D4AF37]/30">
                {activeLesson.category}
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase font-bold bg-[#1E4B43] text-[#D4AF37] border border-[#D4AF37]/40">
                {proficiencyLevel}
              </span>
              {activeLesson.provinceName && (
                <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
                  <MapPin className="w-3 h-3 text-[#D4AF37]" />
                  {activeLesson.provinceName}
                </span>
              )}
            </div>
            <h2 className="text-xs font-serif font-bold text-white truncate max-w-[340px]">
              {activeLesson.vietnameseTitle}
            </h2>
          </div>
        </div>
      </div>

      {/* Quick Mode Switcher */}
      <QuickModeSwitcher />

      {/* Message Timeline */}
      <div className="transcription-view flex-1 overflow-y-auto p-4 space-y-3.5" ref={scrollRef}>
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
                Đàm thoại tiếng Anh thời gian thực cùng trợ lý AI về chủ đề <strong>{activeLesson.vietnameseTitle}</strong>. Bấm nút <strong>Play</strong> bên dưới hoặc chọn gợi ý để bắt đầu.
              </p>
            </div>

            {/* Quick Action Suggestion Chips */}
            <div className="pt-2 flex flex-wrap gap-2 justify-center max-w-md mx-auto">
              {quickActions.map((action, idx) => (
                <button
                  key={idx}
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
            {displayedTurns.map((t, index) => {
              const isSystem = t.role === 'system';

              if (isSystem) {
                return (
                  <div
                    key={index}
                    className="p-3 rounded-xl bg-[#1E4B43]/20 border border-[#D4AF37]/30 text-xs text-[#E8ECE9] shadow-sm space-y-1 animate-fadeIn"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#D4AF37]">
                      <span className="font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Trợ Lý Văn Hóa &amp; Ngôn Ngữ
                      </span>
                      <span>{formatTimestamp(t.timestamp)}</span>
                    </div>
                    <div className="prose prose-invert prose-xs leading-relaxed max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{t.text}</ReactMarkdown>
                    </div>
                  </div>
                );
              }

              const isUser = t.role === 'user';
              return (
                <div
                  key={index}
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
                    <div className="prose prose-invert prose-xs max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{t.text}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              );
            })}

            {isAwaitingFunctionResponse && (
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
    </div>
  );
}
