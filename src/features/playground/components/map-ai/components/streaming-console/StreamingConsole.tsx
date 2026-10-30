/**
 * StreamingConsole for Cultural Speaking & Listening AI Tutor
 */

import React, { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import { useTranslation } from 'react-i18next';
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
import { User, MessageSquareText, RefreshCw, BookOpen, Compass, MapPin, Clock, ExternalLink } from 'lucide-react';
import type { ProficiencyLevel } from '../../lib/prompt-scaffolder';
import { InPlaceDictionaryPopup } from '@/features/reader/components/InPlaceDictionaryPopup';
import { useTimelineSelection } from './useTimelineSelection';
import { maskProfanity } from '@/utils/dictionary-service';
import { paths } from '@/routes/paths';
import { ReaderWorkspaceReference } from '../ReaderWorkspaceReference';
import { AiWorkspaceWelcome } from '../AiWorkspaceWelcome';
import { AiWorkspaceChatHeader } from '../AiWorkspaceChatHeader';
import { useReaderHandoff } from '@/features/playground/lib/reader-handoff';
import { useSearchParams } from 'react-router-dom';
import { companionService } from '@/services/companionService';
import type { CompanionChatMessage } from '@/types/companion';


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

export default function StreamingConsole() {
  const { t } = useTranslation('playground');
  const {
    activeView, connected, sendMessage, changeLevel, connecting, ending,
    isSending, isRestoringContext, isAwaitingResponse, resetConversation,
  } = useLiveAPIContext();
  const active = activeView === 'chat';
  const busy = !active || connecting || ending || isSending || isRestoringContext;
  const { proficiencyLevel, tutorMode } = useSettings();
  React.useEffect(() => {
    if (active && tutorMode === 'guided-lesson' && !connected && !busy) {
      resetConversation();
      useSettings.getState().setTutorMode('free-conversation');
    }
  }, [active, tutorMode, connected, busy, resetConversation]);
  const readerContext = useReaderHandoff(state => state.context);
  const turns = useLogStore(state => state.turns);
  const sessionId = useLogStore(state => state.sessionMetadata?.sessionId);
  const { showSystemMessages } = useUI();
  const isAwaitingFunctionResponse = useLogStore(state => state.isAwaitingFunctionResponse);
  const {
    scrollRef, selectedWord, wordPosition, closeSelection, handlePointerDown,
    handleTextSelection, handleScroll, hasNewMessages, scrollToLatest, renderedTurn,
  } = useTimelineSelection(turns, active, sessionId);

  const [searchParams] = useSearchParams();
  const storyParam = searchParams.get('story');
  const selectedArticleId = useMapStore(state => state.selectedLandmarkId);
  const selectedArticle = VIETNAM_LANDMARKS.find(item => item.id === selectedArticleId);
  const selectedStoryId = readerContext?.articleId || selectedArticleId || storyParam || undefined;
  const sessionStoryIdRef = React.useRef(selectedStoryId);
  if (turns.length === 0 && !connected) sessionStoryIdRef.current = selectedStoryId;
  const targetLessonId = tutorMode === 'free-conversation' ? sessionStoryIdRef.current : undefined;
  React.useEffect(() => {
    if (tutorMode === 'free-conversation' && !connected && !busy && sessionStoryIdRef.current !== selectedStoryId) {
      resetConversation();
      sessionStoryIdRef.current = selectedStoryId;
    }
  }, [selectedStoryId, tutorMode, connected, busy, resetConversation]);

  // Hydrate chat history from backend companionService on entering AI Workspace
  const isHydratedRef = React.useRef(false);
  React.useEffect(() => {
    isHydratedRef.current = false;
    lastSavedTurnCountRef.current = 0;
    if (!targetLessonId) return;
    let isCancelled = false;
    const hydrateHistory = async () => {
      try {
        const history = await companionService.getChatHistory(targetLessonId);
        if (isCancelled || !history || history.length === 0) return;
        const currentTurns = useLogStore.getState().turns;
        if (currentTurns.length === 0) {
          history.forEach((msg) => {
            useLogStore.getState().addTurn({
              id: msg.id || (msg.timestamp ? `hist-${msg.timestamp}` : `hist-${Date.now()}`),
              role: msg.role === 'assistant' ? 'agent' : 'user',
              text: msg.content,
              isFinal: true,
              source: 'text',
              timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
            });
          });
        }
      } catch (err) {
        console.error('[StreamingConsole] Failed to hydrate companion history:', err);
      } finally {
        if (!isCancelled) {
          isHydratedRef.current = true;
        }
      }
    };

    hydrateHistory();
    return () => {
      isCancelled = true;
    };
  }, [targetLessonId]);

  // Synchronize new user or agent turns in AI Workspace back to companionService backend
  const lastSavedTurnCountRef = React.useRef(0);
  React.useEffect(() => {
    if (!targetLessonId || !isHydratedRef.current) return;
    const completedDialogue = turns.filter(
      (t) => (t.role === 'user' || t.role === 'agent') && t.text.trim() && t.isFinal
    );

    if (completedDialogue.length === 0 || completedDialogue.length === lastSavedTurnCountRef.current) {
      return;
    }
    lastSavedTurnCountRef.current = completedDialogue.length;

    const companionHistory: CompanionChatMessage[] = completedDialogue.map((t) => ({
      id: t.id,
      role: t.role === 'agent' ? 'assistant' : 'user',
      content: t.text,
      timestamp: t.timestamp ? new Date(t.timestamp).getTime() : Date.now(),
    }));

    companionService
      .saveChatHistory(companionHistory, targetLessonId)
      .then(() => {
        window.dispatchEvent(
          new CustomEvent('companion:history-updated', { detail: { lessonId: targetLessonId } })
        );
      })
      .catch((err) => {
        console.error('[StreamingConsole] Failed to sync turn history to backend:', err);
      });
  }, [turns, targetLessonId]);

  const displayedTurns = showSystemMessages ? turns : turns.filter(turn => turn.role !== 'system');
  const storyTitle = readerContext?.title || selectedArticle?.title;
  const conversationActions = storyTitle ? [
    { text: `Let's practise speaking about “${storyTitle}”. Keep your turns brief so I can speak.`, label: 'Talk about this story' },
    { text: `Help me express my opinion about “${storyTitle}” in English.`, label: 'Express an opinion' },
    { text: `What useful English words help me discuss “${storyTitle}”?`, label: 'Practise vocabulary' },
  ] : [
    { text: 'Help me choose a story from the VieCultures library to practise speaking.', label: 'Choose a story' },
    { text: 'Show me a cultural article about Vietnamese food to discuss.', label: 'Explore food stories' },
    { text: 'Show me a story about a Vietnamese place or tradition.', label: 'Explore places and traditions' },
  ];
  const freeTalkActions = [
    { text: 'Let’s have a natural conversation. Ask me about something I enjoy.', label: 'Start chatting' },
    { text: 'Tell me a vivid short story, then let me choose what happens next.', label: 'Create a story' },
    { text: 'Let’s roleplay a real situation in English. Help me find natural words.', label: 'Roleplay' },
    { text: 'I have an idea to write. Help me express it clearly in English.', label: 'Write together' },
  ];
  const quickActions = tutorMode === 'open-conversation' ? freeTalkActions : conversationActions;

  const handleModeChange = (mode: typeof tutorMode) => {
    if (connected || busy || tutorMode === mode) return;
    resetConversation();
    useSettings.getState().setTutorMode(mode);
  };

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
    <div className="transcription-container flex flex-col h-full">
      <AiWorkspaceChatHeader title={tutorMode === 'open-conversation' ? t('playground.chat_header.free_talk') : storyTitle || t('playground.chat_header.choose_story')}
        mode={tutorMode} level={proficiencyLevel} busy={busy} connected={connected}
        onModeChange={handleModeChange} onLevelChange={level => void handleLevelSwitch(level)} />
      {connected && tutorMode === 'free-conversation' && selectedStoryId !== sessionStoryIdRef.current && (
        <p className="px-4 py-2 text-xs text-amber-300">{t('playground.chat_header.story_changed')}</p>
      )}

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
        <ReaderWorkspaceReference active={active && tutorMode === 'free-conversation'} />
        {displayedTurns.length === 0 && !isAwaitingFunctionResponse ? (
          <AiWorkspaceWelcome hasReading={tutorMode === 'free-conversation' && !!(readerContext || selectedArticle)} openTopic={tutorMode === 'open-conversation'} actions={quickActions} busy={busy} onChoose={text => void handleSendPrompt(text)} />
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
                      className="chat-tool-message p-3.5 border text-xs shadow-sm space-y-3 animate-fadeIn"
                    >
                      <div className="chat-tool-header flex items-center justify-between text-[11px] font-mono border-b pb-2">
                        <span className="font-bold flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" />
                          VieCultures stories ({articlePayload.length})
                        </span>
                        <span className="chat-tool-timestamp text-[10px]">{formatTimestamp(t.timestamp)}</span>
                      </div>

                      <div className="space-y-2.5">
                        {articlePayload.map((art, idx) => (
                          <div
                            key={`${art.id}-${idx}`}
                            data-article-card
                            className="chat-story-card rounded-xl border p-3 space-y-2 transition-all shadow-sm group"
                          >
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <div className="chat-story-meta flex items-center gap-1.5 text-[10.5px]">
                                <MapPin className="w-3.5 h-3.5 shrink-0" />
                                <span className="font-medium">{art.location || art.titleVi}</span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="chat-story-level px-1.5 py-0.5 rounded text-[9px] font-mono border">
                                  {art.level}
                                </span>
                                <span className="chat-story-time px-1.5 py-0.5 rounded text-[9px] font-mono border flex items-center gap-1">
                                  <Clock className="w-2.5 h-2.5" />
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
                                <h4 className="chat-story-title text-xs group-hover/title:underline transition-colors leading-snug">
                                  {art.titleVi}
                                </h4>
                              </button>
                              <p className="chat-story-subtitle text-[11px] italic">
                                {art.title}
                              </p>
                            </div>

                            {art.vocabHighlights && art.vocabHighlights.length > 0 && (
                              <div className="flex items-center gap-1 flex-wrap pt-0.5">
                                <span className="chat-story-vocab-label text-[10px] mr-0.5">Vocabulary:</span>
                                {art.vocabHighlights.map((vocab, vIdx) => (
                                  <span
                                    key={vIdx}
                                    className="chat-story-vocab px-1.5 py-0.5 rounded text-[9.5px] border font-mono"
                                  >
                                    {vocab}
                                  </span>
                                ))}
                              </div>
                            )}

                            {art.excerptEn && (
                              <p data-article-excerpt className="chat-story-excerpt text-[10.5px] leading-relaxed p-2 rounded-lg border-l-2 italic">
                                "{art.excerptEn.length > 150 ? art.excerptEn.slice(0, 150) + '…' : art.excerptEn}"
                              </p>
                            )}

                            <div className="chat-story-actions flex items-center justify-end gap-1.5 pt-1 border-t flex-wrap">
                              <button
                                type="button"
                                onClick={() => active && useChatWorkspace.getState().openArticle(art.id)}
                                className="chat-story-action px-2.5 py-1 rounded-md text-[10px] border flex items-center gap-1 cursor-pointer"
                              >
                                <BookOpen className="w-3 h-3" /> Story details
                              </button>
                              <button
                                type="button"
                                onClick={() => handleFocusLandmarkOnMap(art.id)}
                                className="chat-story-action px-2.5 py-1 rounded-md text-[10px] border flex items-center gap-1 transition-all cursor-pointer shadow-sm active:scale-95"
                                title="Locate this place on the map"
                              >
                                <Compass className="w-3 h-3" />
                                <span>Show on map</span>
                              </button>
                              <button
                                type="button"
                                disabled={busy}
                                onClick={() => handleDiscussArticle(art)}
                                className="chat-story-action px-2.5 py-1 rounded-md text-[10px] border flex items-center gap-1 transition-all cursor-pointer shadow-sm active:scale-95"
                                title="Discuss this story with AI"
                              >
                                <MessageSquareText className="w-3 h-3" />
                                <span>Discuss this story</span>
                              </button>
                              <a
                                href={paths.reader({ article: art.id, level: art.level || 'Level 2' })}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="chat-story-action px-2.5 py-1 rounded-md text-[10px] border flex items-center gap-1 transition-all cursor-pointer shadow-sm active:scale-95"
                                title="Open the full story in a new tab"
                              >
                                <BookOpen className="w-3 h-3" />
                                <span>Read story</span>
                                <ExternalLink className="w-2.5 h-2.5" />
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
                    className="chat-tool-message p-3 border text-xs shadow-sm space-y-1 animate-fadeIn"
                  >
                    <div className="chat-tool-header flex items-center justify-between text-[10px] font-mono">
                      <span className="font-bold flex items-center gap-1">
                        <MessageSquareText className="w-3 h-3" /> Cultural companion
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
                    className={`chat-message-avatar ${isUser ? 'chat-message-avatar--user' : 'chat-message-avatar--assistant'} w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs shadow`}
                  >
                    {isUser ? <User className="w-4 h-4" /> : <MessageSquareText className="w-4 h-4" />}
                  </div>

                  <div
                    data-message-role={isUser ? 'user' : 'assistant'}
                    className={`chat-message-bubble max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed border shadow-md ${isUser ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}
                  >
                    <div className="prose prose-invert prose-xs max-w-none select-text cursor-text">
                      <MessageMarkdown text={t.text} />
                    </div>
                  </div>
                </div>
              );
            })}

            {active && (isAwaitingFunctionResponse || isAwaitingResponse) && (
              <div className="chat-tool-status flex items-center gap-2 text-xs p-2 rounded-lg border">
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
                  className="ai-chat-suggestion px-2.5 py-1 rounded-full border text-xs transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Compass className="w-3 h-3" />
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      {active && hasNewMessages && <button type="button" onClick={scrollToLatest} className="chat-new-messages mx-auto my-2 rounded-full px-4 py-2 text-xs">New messages ↓</button>}
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
