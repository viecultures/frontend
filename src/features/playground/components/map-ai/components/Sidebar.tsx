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
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react';
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
import { useMapAiDebugStore } from '../lib/debug-logger';

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
    setTutorMode,
    setCorrectionMode,
    setMapContextMode,
    setCustomGeminiApiKey,
    setTheme,
  } = useSettings();

  const { activeView, connected: sessionConnected, connecting, ending, isSending, isRestoringContext, resetConversation, changeLevel } = useLiveAPIContext();
  const connected = sessionConnected || connecting || ending;
  const busy = connecting || ending || isSending || isRestoringContext;

  const availableVoices = useMemo(() => {
    const isLimited =
      MODELS_WITH_LIMITED_VOICES.includes(model) ||
      !AVAILABLE_MODELS.includes(model) ||
      model.includes('flash') ||
      model.includes('live');
    return isLimited ? AVAILABLE_VOICES_LIMITED : AVAILABLE_VOICES_FULL;
  }, [model]);

  useEffect(() => {
    if (activeView && !availableVoices.some(v => v.name === voice)) {
      setVoice(DEFAULT_VOICE);
    }
  }, [activeView, availableVoices, voice, setVoice]);

  // When lesson changes
  const handleLessonChange = (newLessonId: string) => {
    if (!activeView || connected) return;
    setActiveLessonId(newLessonId);
    const targetLesson = findLessonById(newLessonId);
    if (targetLesson) {
      if (targetLesson.provinceId && mapContextMode !== 'off') {
        useMapStore.getState().selectProvince(targetLesson.provinceId, 'user');
      }
    }
  };

  // When proficiency level changes
  const handleLevelChange = async (newLevel: ProficiencyLevel) => {
    if (!activeView || busy) return;
    await changeLevel(newLevel);
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

  if (!activeView) return null;

  return (
    <Dialog open={isSidebarOpen} onClose={toggleSidebar} className={`map-ai-app ai-chat-ui ai-workspace-settings-dialog ${theme === 'light' ? 'light-theme' : 'dark'}`}>
      <DialogBackdrop className="ai-workspace-settings-backdrop" />
      <DialogPanel className="sidebar open">
      <div className="sidebar-header">
        <div className="flex items-center gap-2 text-antique-gold">
          <Sparkles className="w-5 h-5 text-antique-gold" />
          <DialogTitle as="h3" className="font-serif font-bold text-base text-white">Speaking settings</DialogTitle>
        </div>
        <button onClick={toggleSidebar} className="close-button" aria-label="Close settings">
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
            <span>Pause the conversation to change these settings.</span>
          </div>
        )}

        <div className="sidebar-section">
          {/* Target Reading Lesson Selector */}
          {tutorMode !== 'free-conversation' && <div className="space-y-1.5 mb-4">
            <label className="flex items-center gap-1.5 text-xs font-bold text-antique-gold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Story to practise</span>
            </label>
            <select
              aria-label="Story to practise" value={activeLessonId}
              disabled={connected}
              onChange={e => handleLessonChange(e.target.value)}
              className="w-full text-xs font-serif"
            >
              {LESSON_AGENT_CATALOG.map((lesson: LessonAgentMetadata) => (
                <option key={lesson.id} value={lesson.id}>
                  {lesson.title} ({lesson.provinceName})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-gray-400">
              Use this story for guided listening and speaking.
            </p>
          </div>}

          {/* Proficiency Level Selector (Level 1, Level 2, Level 3) */}
          <div className="space-y-1.5 mb-4">
            <label className="flex items-center gap-1.5 text-xs font-bold text-antique-gold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Speaking level</span>
            </label>
            <select
              aria-label="Speaking level" value={proficiencyLevel}
              disabled={busy}
              onChange={e => void handleLevelChange(e.target.value as ProficiencyLevel)}
              className="w-full text-xs font-semibold"
            >
              <option value="Level 1">Level 1 (A1) — Slow pace · Short, simple sentences</option>
              <option value="Level 2">Level 2 (B1–B2) — Intermediate · Natural conversation</option>
              <option value="Level 3">Level 3 (B2–C1) — Advanced · Detailed discussion</option>
            </select>
            <p className="text-[11px] text-gray-400">
              {proficiencyLevel === 'Level 1' && 'Short sentences, slower speech and sentence starters.'}
              {proficiencyLevel === 'Level 2' && 'Natural speech, cultural vocabulary and comparisons.'}
              {proficiencyLevel === 'Level 3' && 'Fluent speech, richer vocabulary and critical discussion.'}
            </p>
          </div>

          {/* Cultural Tutor Mode */}
          <div className="space-y-1.5 mb-4">
            <label className="flex items-center gap-1.5 text-xs font-bold text-antique-gold uppercase tracking-wider">
              <Mic className="w-3.5 h-3.5" />
              <span>Practice mode</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={connected}
                onClick={() => setTutorMode('free-conversation')}
                className={`py-2 px-2 rounded-lg text-xs font-semibold text-center border transition-all ${
                  tutorMode === 'free-conversation'
                    ? 'bg-heritage-green text-antique-gold border-antique-gold/60 shadow-md font-bold'
                    : 'bg-[#141b22] text-gray-400 border-white/10 hover:text-white'
                }`}
              >
                Free talk
              </button>
              <button
                type="button"
                disabled={connected}
                onClick={() => setTutorMode('guided-lesson')}
                className={`py-2 px-2 rounded-lg text-xs font-semibold text-center border transition-all ${
                  tutorMode === 'guided-lesson'
                    ? 'bg-heritage-green text-antique-gold border-antique-gold/60 shadow-md font-bold'
                    : 'bg-[#141b22] text-gray-400 border-white/10 hover:text-white'
                }`}
              >
                Story practice
              </button>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              {tutorMode === 'guided-lesson'
                ? 'Practise listening, speaking and comprehension with a story.'
                : 'Have a natural conversation about Vietnamese culture.'}
            </p>
          </div>

          {tutorMode === 'free-conversation' && (
            <>
              <div className="space-y-1.5 mb-4">
                <label className="text-xs font-bold text-antique-gold uppercase tracking-wider">Corrections</label>
                <select aria-label="Corrections" value={correctionMode} disabled={connected} onChange={e => setCorrectionMode(e.target.value as CorrectionMode)} className="w-full text-xs">
                  <option value="off">Off</option>
                  <option value="after-turn">After each turn</option>
                  <option value="end-of-session">At the end</option>
                </select>
              </div>
              <div className="space-y-1.5 mb-4">
                <label className="text-xs font-bold text-antique-gold uppercase tracking-wider">AI map controls</label>
                <select aria-label="AI map controls" value={mapContextMode} disabled={connected} onChange={e => setMapContextMode(e.target.value as MapContextMode)} className="w-full text-xs">
                  <option value="off">Off</option>
                  <option value="on-demand">When I ask for a place</option>
                </select>
                <p className="text-[11px] text-gray-400">Explore the map any time. Choose Ask AI to discuss a place.</p>
              </div>
            </>
          )}

          {/* Voice Selection */}
          <div className="space-y-1.5 mb-4">
            <label className="flex items-center gap-1.5 text-xs font-bold text-antique-gold uppercase tracking-wider">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Voice</span>
            </label>
            <select
              aria-label="Voice" value={voice}
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
            <label className="flex items-center gap-1.5 text-xs font-bold text-antique-gold uppercase tracking-wider">
              <Key className="w-3.5 h-3.5" />
              <span>Gemini API key (optional)</span>
            </label>
            <input
              type="password"
              aria-label="Gemini API key"
              value={customGeminiApiKey}
              disabled={connected}
              onChange={e => setCustomGeminiApiKey(e.target.value)}
              placeholder="Enter your API key…"
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
              Show vocabulary and speaking feedback
            </label>
          </div>

          {/* Color Theme */}
          <div className="settings-toggle-item" style={{ marginTop: '16px', borderTop: '1px solid var(--gray-850)', paddingTop: '16px' }}>
            <label htmlFor="theme-select" className="settings-toggle-label text-xs" style={{ flex: 1 }}>
              Appearance
            </label>
            <select
              id="theme-select"
              value={theme}
              onChange={e => setTheme(e.target.value as 'dark' | 'light')}
              style={{ width: '110px', padding: '6px', background: 'var(--gray-1000)', border: '1px solid var(--gray-800)', color: 'var(--text)' }}
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sidebar-actions">
          <button onClick={handleExportLogs} title="Export conversation history">
            <Download className="w-4 h-4 mr-1.5" />
            Export history
          </button>
          <button
            onClick={() => {
              if (activeView) resetConversation();
            }}
            title="Start a new conversation"
          >
            <RefreshCw className="w-4 h-4 mr-1.5" />
            New conversation
          </button>
        </div>
        <button type="button" className="ai-workspace-developer-link" onClick={() => { useMapAiDebugStore.getState().setDrawerOpen(true); toggleSidebar(); }}>Developer tools</button>
      </div>
      </DialogPanel>
    </Dialog>
  );
}
