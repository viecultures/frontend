/**
 * Settings Sidebar for Cultural Speaking & Listening AI Tutor
 */

import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useSettings,
  useUI,
  useLogStore,
  useTools,
  useMapStore,
  type CulturalTutorMode,
  type CorrectionMode,
  type MapContextMode,
  type VoiceInteractionMode,
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
  Compass,
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
  const { t } = useTranslation('playground');
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
    voiceInteractionMode,
    proficiencyLevel,
    customGeminiApiKey,
    theme,
    setVoice,
    setTutorMode,
    setActiveLessonId,
    setCorrectionMode,
    setMapContextMode,
    setVoiceInteractionMode,
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

  const handleTutorModeChange = (mode: CulturalTutorMode) => {
    if (!activeView || connected || busy || tutorMode === mode) return;
    resetConversation();
    setTutorMode(mode);
  };

  const handleLessonChange = (newLessonId: string) => {
    if (!activeView || connected) return;
    setActiveLessonId(newLessonId);
    const targetLesson = findLessonById(newLessonId);
    if (targetLesson?.provinceId && mapContextMode !== 'off') {
      useMapStore.getState().selectProvince(targetLesson.provinceId, 'user');
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
          <Compass className="w-5 h-5 text-antique-gold" />
          <DialogTitle as="h3" className="font-serif font-bold text-base text-white">{t('playground.sidebar.title')}</DialogTitle>
        </div>
        <button onClick={toggleSidebar} className="close-button" aria-label={t('playground.sidebar.close_aria')}>
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
            <span>{t('playground.sidebar.pause_warning')}</span>
          </div>
        )}

        <div className="sidebar-section">
          {activeView === 'immersive' && tutorMode === 'guided-lesson' && <div className="space-y-1.5 mb-4">
            <label className="flex items-center gap-1.5 text-xs font-bold text-antique-gold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{t('playground.sidebar.story_to_practice')}</span>
            </label>
            <select aria-label={t('playground.sidebar.story_to_practice')} value={activeLessonId}
              disabled={connected} onChange={e => handleLessonChange(e.target.value)} className="w-full text-xs font-serif">
              {LESSON_AGENT_CATALOG.map((lesson: LessonAgentMetadata) => (
                <option key={lesson.id} value={lesson.id}>{lesson.title} ({lesson.provinceName})</option>
              ))}
            </select>
            <p className="text-[11px] text-gray-400">{t('playground.sidebar.story_hint')}</p>
          </div>}
          {/* Proficiency Level Selector (Level 1, Level 2, Level 3) */}
          <div className="space-y-1.5 mb-4">
            <label className="flex items-center gap-1.5 text-xs font-bold text-antique-gold uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              <span>{t('playground.sidebar.speaking_level')}</span>
            </label>
            <select
              aria-label={t('playground.sidebar.speaking_level')} value={proficiencyLevel}
              disabled={busy}
              onChange={e => void handleLevelChange(e.target.value as ProficiencyLevel)}
              className="w-full text-xs font-semibold"
            >
              <option value="Level 1">{t('playground.sidebar.level_1_option')}</option>
              <option value="Level 2">{t('playground.sidebar.level_2_option')}</option>
              <option value="Level 3">{t('playground.sidebar.level_3_option')}</option>
            </select>
            <p className="text-[11px] text-gray-400">
              {proficiencyLevel === 'Level 1' && t('playground.sidebar.level_1_desc')}
              {proficiencyLevel === 'Level 2' && t('playground.sidebar.level_2_desc')}
              {proficiencyLevel === 'Level 3' && t('playground.sidebar.level_3_desc')}
            </p>
          </div>

          {/* Cultural Tutor Mode */}
          <div className="space-y-1.5 mb-4">
            <label htmlFor="voice-interaction-mode" className="text-xs font-bold text-antique-gold uppercase tracking-wider">
              {t('playground.sidebar.voice_interaction_label')}
            </label>
            <select id="voice-interaction-mode" value={voiceInteractionMode} disabled={connected}
              onChange={e => setVoiceInteractionMode(e.target.value as VoiceInteractionMode)} className="w-full text-xs">
              <option value="natural">{t('playground.sidebar.voice_natural')}</option>
              <option value="push-to-talk">{t('playground.sidebar.voice_push_to_talk')}</option>
            </select>
            <p className="text-[11px] text-gray-400">{t(voiceInteractionMode === 'push-to-talk'
              ? 'playground.sidebar.voice_push_to_talk_hint' : 'playground.sidebar.voice_natural_hint')}</p>
          </div>

          {/* Cultural Tutor Mode */}
          <div className="space-y-1.5 mb-4">
            <label className="flex items-center gap-1.5 text-xs font-bold text-antique-gold uppercase tracking-wider">
              <Mic className="w-3.5 h-3.5" />
              <span>{t('playground.sidebar.practice_mode')}</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={connected || busy}
                onClick={() => activeView === 'chat' ? handleTutorModeChange('free-conversation') : setTutorMode('free-conversation')}
                className={`py-2 px-2 rounded-lg text-xs font-semibold text-center border transition-all ${
                  (activeView === 'immersive' ? tutorMode !== 'guided-lesson' : tutorMode === 'free-conversation')
                    ? 'bg-heritage-green text-antique-gold border-antique-gold/60 shadow-md font-bold'
                    : 'bg-[#141b22] text-gray-400 border-white/10 hover:text-white'
                }`}
              >
                {t(activeView === 'chat' ? 'playground.sidebar.story_practice' : 'playground.sidebar.free_talk')}
              </button>
              <button
                type="button"
                disabled={connected || busy}
                onClick={() => activeView === 'chat' ? handleTutorModeChange('open-conversation') : setTutorMode('guided-lesson')}
                className={`py-2 px-2 rounded-lg text-xs font-semibold text-center border transition-all ${
                  tutorMode === (activeView === 'chat' ? 'open-conversation' : 'guided-lesson')
                    ? 'bg-heritage-green text-antique-gold border-antique-gold/60 shadow-md font-bold'
                    : 'bg-[#141b22] text-gray-400 border-white/10 hover:text-white'
                }`}
              >
                {t(activeView === 'chat' ? 'playground.sidebar.free_talk' : 'playground.sidebar.story_practice')}
              </button>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              {activeView === 'chat'
                ? t(tutorMode === 'open-conversation' ? 'playground.sidebar.free_convo_desc' : 'playground.sidebar.guided_lesson_desc')
                : t(tutorMode === 'guided-lesson' ? 'playground.sidebar.guided_lesson_desc_immersive' : 'playground.sidebar.free_convo_desc_immersive')}
            </p>
          </div>

          <details className="mb-4 text-xs text-gray-400">
            <summary className="cursor-pointer font-bold text-antique-gold">{t('playground.sidebar.advanced_settings')}</summary>
            <div className="mt-4">
          {(activeView === 'chat' || tutorMode !== 'guided-lesson') && (
            <>
              <div className="space-y-1.5 mb-4">
                <label className="text-xs font-bold text-antique-gold uppercase tracking-wider">{t('playground.sidebar.corrections_label')}</label>
                <select aria-label={t('playground.sidebar.corrections_label')} value={correctionMode} disabled={connected} onChange={e => setCorrectionMode(e.target.value as CorrectionMode)} className="w-full text-xs">
                  <option value="off">{t('playground.sidebar.corr_off')}</option>
                  <option value="after-turn">{t('playground.sidebar.corr_after_turn')}</option>
                  <option value="end-of-session">{t('playground.sidebar.corr_end')}</option>
                </select>
              </div>
              <div className="space-y-1.5 mb-4">
                <label className="text-xs font-bold text-antique-gold uppercase tracking-wider">{t('playground.sidebar.map_controls_label')}</label>
                <select aria-label={t('playground.sidebar.map_controls_label')} value={mapContextMode} disabled={connected} onChange={e => setMapContextMode(e.target.value as MapContextMode)} className="w-full text-xs">
                  <option value="off">{t('playground.sidebar.map_off')}</option>
                  <option value="on-demand">{t('playground.sidebar.map_on_demand')}</option>
                </select>
                <p className="text-[11px] text-gray-400">{t('playground.sidebar.map_controls_desc')}</p>
              </div>
            </>
          )}

          {/* Voice Selection */}
          <div className="space-y-1.5 mb-4">
            <label className="flex items-center gap-1.5 text-xs font-bold text-antique-gold uppercase tracking-wider">
              <Volume2 className="w-3.5 h-3.5" />
              <span>{t('playground.sidebar.voice_label')}</span>
            </label>
            <select
              aria-label={t('playground.sidebar.voice_label')} value={voice}
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
              <span>{t('playground.sidebar.api_key_label')}</span>
            </label>
            <input
              type="password"
              aria-label={t('playground.sidebar.api_key_label')}
              value={customGeminiApiKey}
              disabled={connected}
              onChange={e => setCustomGeminiApiKey(e.target.value)}
              placeholder={t('playground.sidebar.api_key_placeholder')}
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
              {t('playground.sidebar.system_messages_toggle')}
            </label>
          </div>

          {/* Color Theme */}
          <div className="settings-toggle-item" style={{ marginTop: '16px', borderTop: '1px solid var(--gray-850)', paddingTop: '16px' }}>
            <label htmlFor="theme-select" className="settings-toggle-label text-xs" style={{ flex: 1 }}>
              {t('playground.sidebar.appearance_label')}
            </label>
            <select
              id="theme-select"
              value={theme}
              onChange={e => setTheme(e.target.value as 'dark' | 'light')}
              style={{ width: '110px', padding: '6px', background: 'var(--gray-1000)', border: '1px solid var(--gray-800)', color: 'var(--text)' }}
            >
              <option value="dark">{t('playground.sidebar.theme_dark')}</option>
              <option value="light">{t('playground.sidebar.theme_light')}</option>
            </select>
          </div>
          </div>
          </details>
        </div>

        {/* Footer Actions */}
        <div className="sidebar-actions">
          {import.meta.env.DEV && <button onClick={handleExportLogs} title={t('playground.sidebar.export_history_title')}>
            <Download className="w-4 h-4 mr-1.5" />
            {t('playground.sidebar.export_history')}
          </button>}
          {activeView !== 'chat' && <button
            onClick={() => {
              if (activeView) resetConversation();
            }}
            title={t('playground.sidebar.new_conversation_title')}
          >
            <RefreshCw className="w-4 h-4 mr-1.5" />
            {t('playground.sidebar.new_conversation')}
          </button>}
        </div>
        {import.meta.env.DEV && <button type="button" className="ai-workspace-developer-link" onClick={() => { useMapAiDebugStore.getState().setDrawerOpen(true); toggleSidebar(); }}>{t('playground.sidebar.developer_tools')}</button>}
      </div>
      </DialogPanel>
    </Dialog>
  );
}
