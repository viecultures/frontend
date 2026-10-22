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
import { useMapStore } from '../../lib/map-state';
import { useChatWorkspace } from '../../lib/chat-workspace';
import { VIETNAM_LANDMARKS } from '@/data/landmarksData';
import { User, Sparkles, RefreshCw, BookOpen, MessageSquareText, Compass, MapPin, Clock, ExternalLink } from 'lucide-react';
import { findLessonById, LESSON_AGENT_CATALOG, type LessonAgentMetadata } from '@/data/lessonAgentCatalog';
import type { ProficiencyLevel } from '../../lib/prompt-scaffolder';
import AiMapLessonProgressBar from '../AiMapLessonProgressBar';
import { InPlaceDictionaryPopup } from '@/features/reader/components/InPlaceDictionaryPopup';
import { useTimelineSelection } from './useTimelineSelection';
import { maskProfanity } from '@/utils/dictionary-service';
import { paths } from '@/routes/paths';
import { ReaderWorkspaceReference } from '../ReaderWorkspaceReference';
import { AiWorkspaceWelcome } from '../AiWorkspaceWelcome';
import { AiWorkspaceChatHeader } from '../AiWorkspaceChatHeader';
import { useReaderHandoff } from '@/features/playground/lib/reader-handoff';

export interface VieCultureArticleItem {
  id: string;
  title: string;
  titleVi: string;
  location?: string;
  category?: string;
  level?: string;
  readTime?: string;
  excerptEn?: string;
  excerptVi?: string;
  vocabHighlights?: string[];
  speakingSentenceEn?: string;
}

function extractArticlesFromText(text: string): VieCultureArticleItem[] {
  const matches: { index: number; article: VieCultureArticleItem }[] = [];
  for (const landmark of VIETNAM_LANDMARKS) {
    let idx = text.indexOf(landmark.titleVi);
    if (idx === -1) idx = text.indexOf(landmark.title);
    if (idx !== -1) {
      matches.push({
        index: idx,
        article: {
          id: landmark.id,
          title: landmark.title,
          titleVi: landmark.titleVi,
          location: landmark.locationNameVi,
          category: landmark.category,
          level: landmark.level,
          readTime: landmark.readTime,
          excerptEn: landmark.excerptEn,
          excerptVi: landmark.excerptVi,
          vocabHighlights: landmark.vocabHighlights,
          speakingSentenceEn: landmark.speakingSentenceEn,
        },
      });
    }
  }
  matches.sort((a, b) => a.index - b.index);
  return matches.map(m => m.article);
}

const MessageMarkdown = memo(function MessageMarkdown({ text }: { text: string }) {
  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{maskProfanity(text)}</ReactMarkdown>;
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
    { text: 'Can you summarize the main story of Hanoi Pho in English?', label: 'Hanoi phở broth' },
    { text: 'How does Hanoi-style Pho differ from Southern Vietnamese Pho?', label: 'Northern & Southern phở' },
    { text: 'Let’s practice using the phrase "culinary heritage" in a natural sentence.', label: 'Practise “culinary heritage”' },
    { text: 'Could you ask me a comprehension question about Hanoi Pho?', label: 'Listening quiz' },
  ],
  'ha-long-bay': [
    { text: 'Why is Ha Long Bay recognized as a UNESCO World Natural Heritage site?', label: 'Ha Long Bay' },
    { text: 'Tell me the legend of the descending dragons in English.', label: 'The dragon legend' },
    { text: 'Let’s practice discussing sustainable tourism in Ha Long Bay.', label: 'Sustainable tourism' },
  ],
  'gong-culture-tay-nguyen': [
    { text: 'Tell me about the UNESCO Gong Culture in Central Highlands.', label: 'Gong culture' },
    { text: 'What spiritual role do bronze gongs play in ethnic minority communities?', label: 'Spiritual traditions' },
    { text: 'Let’s practice using the phrase "intangible heritage" in a sentence.', label: 'Practise “intangible heritage”' },
  ],
  'non-la-culture': [
    { text: 'What makes the Hue poem-hat (nón bài thơ) so special in Vietnamese culture?', label: 'Hue poem hats' },
    { text: 'Let’s practice describing traditional craft materials in English.', label: 'Traditional hat making' },
  ],
  'my-son-sanctuary': [
    { text: 'Tell me about the ancient Champa brick towers at My Son Sanctuary.', label: 'My Son Sanctuary' },
    { text: 'What architectural mystery makes Champa mortarless brickwork unique?', label: 'Champa brickwork' },
  ],
  'floating-markets-mekong': [
    { text: 'How does Cai Rang Floating Market operate early in the morning?', label: 'Cai Rang floating market' },
    { text: 'What is a "cay beo" bamboo sample pole used for?', label: 'Floating market signs' },
  ],
  'nem-ran-spring-rolls': [
    { text: 'What ingredients make traditional northern Nem Ran so crispy?', label: 'Crispy spring rolls' },
    { text: 'Let’s roleplay explaining how to wrap Vietnamese spring rolls in English.', label: 'Describe wrapping spring rolls' },
  ],
  'dong-ho-paintings': [
    { text: 'How do Dong Ho village artisans make natural colors from plants and shells?', label: 'Natural colours in Dong Ho prints' },
    { text: 'What cultural blessings do traditional woodblock prints represent?', label: 'Traditional blessings' },
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
  const readerContext = useReaderHandoff(state => state.context);
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
      { text: `Tell me about the history and importance of ${activeLesson.vietnameseTitle}.`, label: `Explore the story` },
      { text: `What key English vocabulary should I know about this cultural topic?`, label: `Practise vocabulary` },
      { text: `Let's practice discussing ${activeLesson.vietnameseTitle} together.`, label: `Start a conversation` },
    ];
  const conversationActions = readerContext ? [
    { text: `Let's practise speaking about “${readerContext.title}”. Keep your turns brief so I can speak.`, label: 'Talk about this story' },
    { text: `Help me express my opinion about “${readerContext.title}” in English.`, label: 'Express an opinion' },
  ] : [
    { text: 'Let’s have a natural conversation about Vietnamese food and regional flavors.', label: 'Food & flavours' },
    { text: 'Let’s talk about a Vietnamese festival and what it means to local people.', label: 'Festivals' },
    { text: 'Let’s discuss Vietnamese family traditions in everyday life.', label: 'Family & everyday life' },
    { text: 'Let’s compare cultural life in Northern, Central, and Southern Vietnam.', label: 'Compare the regions' },
  ];
  const quickActions = tutorMode === 'free-conversation' ? conversationActions : guidedActions;

  const handleSendPrompt = async (text: string) => {
    if (!busy) await sendMessage({ text, source: 'suggestion' });
  };
  const handleLevelSwitch = async (level: ProficiencyLevel) => {
    if (busy || proficiencyLevel === level) return;
    await changeLevel(level);
  };
  const handleFocusLandmarkOnMap = (landmarkId: string) => {
    if (!active) return;
    useMapStore.getState().selectLandmark(landmarkId, { source: 'user' });
    useChatWorkspace.getState().openMap();
  };
  const handleDiscussArticle = async (article: VieCultureArticleItem) => {
    if (busy) return;
    useMapStore.getState().selectLandmark(article.id, { source: 'user' });
    await sendMessage({
      text: `Tell me more about the cultural reading "${article.title}" in ${article.location || 'Vietnam'}. What are its historical highlights and key vocabulary?`,
      source: 'suggestion',
    });
  };

  return (
    <div className="transcription-container flex flex-col h-full bg-[#121619] text-[#f1f3f4]">
      <AiMapLessonProgressBar />
      <AiWorkspaceChatHeader title={tutorMode === 'free-conversation' ? readerContext?.title || 'English through Vietnamese culture' : activeLesson.title}
        mode={tutorMode} level={proficiencyLevel} busy={busy} connected={connected}
        onModeChange={mode => useSettings.getState().setTutorMode(mode)} onLevelChange={level => void handleLevelSwitch(level)} />

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
        <ReaderWorkspaceReference active={active} />
        {displayedTurns.length === 0 && !isAwaitingFunctionResponse ? (
          <AiWorkspaceWelcome hasReading={!!readerContext || tutorMode === 'guided-lesson'} actions={quickActions} busy={busy} onChoose={text => void handleSendPrompt(text)} />
        ) : (
          <>
            {displayedTurns.map(turn => {
              const t = renderedTurn(turn);
              const isSystem = t.role === 'system';

              if (isSystem) {
                const articlePayload: VieCultureArticleItem[] | null =
                  t.toolResponse && (t.toolResponse as any).type === 'vieculture_articles'
                    ? (t.toolResponse as any).articles
                    : t.text.includes('Thư viện bài đọc VieCultures')
                      ? extractArticlesFromText(t.text)
                      : null;

                if (articlePayload && articlePayload.length > 0) {
                  return (
                    <div
                      key={t.id}
                      data-turn-id={t.id}
                      className="chat-tool-message p-3.5 rounded-xl bg-heritage-green/20 border border-antique-gold/30 text-xs text-[#E8ECE9] shadow-sm space-y-3 animate-fadeIn"
                    >
                      <div className="flex items-center justify-between text-[11px] font-mono text-antique-gold border-b border-antique-gold/20 pb-2">
                        <span className="font-bold flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-antique-gold" />
                          VieCultures stories ({articlePayload.length})
                        </span>
                        <span className="text-gray-400 text-[10px]">{formatTimestamp(t.timestamp)}</span>
                      </div>

                      <div className="space-y-2.5">
                        {articlePayload.map((art, idx) => (
                          <div
                            key={`${art.id}-${idx}`}
                            className="rounded-xl bg-[#14181a] border border-antique-gold/25 hover:border-antique-gold/60 p-3 space-y-2 transition-all shadow-sm group"
                          >
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <div className="flex items-center gap-1.5 text-[10.5px] text-gray-300">
                                <MapPin className="w-3.5 h-3.5 text-antique-gold shrink-0" />
                                <span className="font-medium text-gray-200">{art.location || art.titleVi}</span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-semibold bg-heritage-green text-antique-gold border border-antique-gold/30">
                                  {art.level}
                                </span>
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono text-gray-400 bg-white/5 border border-white/10 flex items-center gap-1">
                                  <Clock className="w-2.5 h-2.5 text-antique-gold" />
                                  {art.readTime}
                                </span>
                              </div>
                            </div>

                            <div>
                              <button
                                type="button"
                                onClick={() => active && useChatWorkspace.getState().openArticle(art.id)}
                                className="group/title inline-block text-left cursor-pointer"
                                title="Open story details"
                              >
                                <h4 className="text-xs font-serif font-bold text-white group-hover/title:text-antique-bright group-hover/title:underline transition-colors leading-snug">
                                  {art.titleVi}
                                </h4>
                              </button>
                              <p className="text-[11px] text-gray-400 italic">
                                {art.title}
                              </p>
                            </div>

                            {art.vocabHighlights && art.vocabHighlights.length > 0 && (
                              <div className="flex items-center gap-1 flex-wrap pt-0.5">
                                <span className="text-[10px] text-antique-gold font-medium mr-0.5">Vocabulary:</span>
                                {art.vocabHighlights.map((vocab, vIdx) => (
                                  <span
                                    key={vIdx}
                                    className="px-1.5 py-0.5 rounded text-[9.5px] bg-heritage-green/50 text-[#E8ECE9] border border-antique-gold/20 font-mono"
                                  >
                                    {vocab}
                                  </span>
                                ))}
                              </div>
                            )}

                            {art.excerptEn && (
                              <p className="text-[10.5px] text-gray-300/90 leading-relaxed bg-black/30 p-2 rounded-lg border-l-2 border-antique-gold/60 italic">
                                "{art.excerptEn.length > 150 ? art.excerptEn.slice(0, 150) + '…' : art.excerptEn}"
                              </p>
                            )}

                            <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-white/5 flex-wrap">
                              <button
                                type="button"
                                onClick={() => active && useChatWorkspace.getState().openArticle(art.id)}
                                className="px-2.5 py-1 rounded-md text-[10px] font-medium bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 flex items-center gap-1 cursor-pointer"
                              >
                                <BookOpen className="w-3 h-3 text-antique-gold" /> Story details
                              </button>
                              <button
                                type="button"
                                onClick={() => handleFocusLandmarkOnMap(art.id)}
                                className="px-2.5 py-1 rounded-md text-[10px] font-medium bg-heritage-green/40 hover:bg-heritage-green text-antique-bright border border-antique-gold/30 flex items-center gap-1 transition-all cursor-pointer shadow-sm active:scale-95"
                                title="Locate this place on the map"
                              >
                                <Compass className="w-3 h-3 text-antique-gold" />
                                <span>Show on map</span>
                              </button>
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => handleDiscussArticle(art)}
                                className="px-2.5 py-1 rounded-md text-[10px] font-medium bg-white/5 hover:bg-white/10 text-gray-200 border border-white/10 hover:border-white/20 flex items-center gap-1 transition-all cursor-pointer shadow-sm active:scale-95"
                                title="Discuss this story with AI"
                              >
                                <MessageSquareText className="w-3 h-3 text-antique-gold" />
                                <span>Discuss this story</span>
                              </button>
                              <a
                                href={paths.reader({ article: art.id, level: art.level || 'Level 2' })}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 rounded-md text-[10px] font-medium bg-antique-gold/15 hover:bg-antique-gold/25 text-antique-bright border border-antique-gold/35 flex items-center gap-1 transition-all cursor-pointer shadow-sm active:scale-95"
                                title="Open the full story in a new tab"
                              >
                                <BookOpen className="w-3 h-3 text-antique-gold" />
                                <span>Read story</span>
                                <ExternalLink className="w-2.5 h-2.5 text-antique-gold/70" />
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={t.id}
                  data-turn-id={t.id}
                    className="chat-tool-message p-3 rounded-xl bg-heritage-green/20 border border-antique-gold/30 text-xs text-[#E8ECE9] shadow-sm space-y-1 animate-fadeIn"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-antique-gold">
                      <span className="font-bold flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Cultural companion
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
                        : 'bg-heritage-green text-antique-gold border border-antique-gold/30'
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                  </div>

                  <div
                    className={`chat-message-bubble max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
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
              <div className="flex items-center gap-2 text-xs text-antique-gold p-2 bg-heritage-green/20 rounded-lg border border-antique-gold/20">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Opening your learning tools…</span>
              </div>
            )}

            {/* In-chat Suggested Follow-ups */}
            <div className="pt-2 flex flex-wrap gap-1.5">
              {quickActions.slice(0, 3).map((action, idx) => (
                <button
                  key={idx}
                  disabled={busy}
                  onClick={() => handleSendPrompt(action.text)}
                  className="px-2.5 py-1 rounded-full bg-[#232729] hover:bg-heritage-green border border-white/10 text-xs text-antique-gold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Compass className="w-3 h-3" />
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      {active && hasNewMessages && <button type="button" onClick={scrollToLatest} className="mx-auto my-2 rounded-full bg-heritage-green px-4 py-2 text-xs text-antique-gold">New messages ↓</button>}
      <InPlaceDictionaryPopup
        isOpen={active && Boolean(selectedWord && wordPosition)}
        vocab={selectedWord}
        position={wordPosition}
        onClose={closeSelection}
        themeMode={useSettings.getState().theme === 'light' ? 'paper' : 'dark'}
      />
    </div>
  );
}
