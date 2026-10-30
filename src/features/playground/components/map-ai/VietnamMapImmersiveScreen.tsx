/**
 * VietnamMapImmersiveScreen
 *
 * Screen #03 in Playground:
 * An ambient, voice-first cultural immersion experience with comic-style mascot interaction.
 *
 * Features:
 * - Unified dark map background (#030706) without splitting into 2 separate panels or borders.
 * - Mascot character anchored at the bottom-left, standing still on the dark ground.
 * - Comic speech bubble floats directly above the mascot and automatically updates in real-time with AI speech/chat.
 * - Interactive retrieved article cards: when AI calls `getVieCultureArticles`, matching reading articles are presented cleanly with 1-click links to Bilingual Reader.
 * - Quick toolbar button "Bài đọc văn hóa" to trigger article retrieval on demand.
 * - Full-screen Vietnam Map canvas with region tabs and top-right ProvinceHoverCard.
 * - 100% Lucide React SVG icons (RULE[user_global]: Zero raw emojis).
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import './map-ai.css';
import Sidebar from './components/Sidebar';
import { useLiveAPIContext } from './contexts/LiveAPIContext';
import VietnamMap from '@/components/map/VietnamMap';
import type { VietnamMapMarker } from '@/components/map/types';
import type { ProvinceMapItem } from '@/data/vietnamMapData';
import { VIETNAM_LANDMARKS, type LandmarkArticle } from '@/data/landmarksData';
import { useUI, useSettings, useMapStore, useLogStore } from './lib/state';
import ProvinceHoverCard from './components/ProvinceHoverCard';
import { getProvinceCultureData } from './data/vietnamProvincesDetail';
import MapAiDebugDrawer from './components/MapAiDebugDrawer';
import { useMapAiDebugStore } from './lib/debug-logger';
import MascotCharacter from './components/MascotCharacter';
import MascotChatBubble from './components/MascotChatBubble';
import ImmersiveTopicTray, { type CulturalTopicItem } from './components/ImmersiveTopicTray';
import { useImmersiveMascot } from './hooks/useImmersiveMascot';
import {
  Play,
  Pause,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  SlidersHorizontal,
  Compass,
  MapPin,
  RefreshCw,
  X,
  BookOpen,
  ExternalLink,
} from 'lucide-react';
import { paths } from '@/routes/paths';

function VietnamMapImmersiveContent() {
  const { t } = useTranslation('playground');
  const { toggleSidebar, speakerMuted } = useUI();
  const {
    activeView,
    connected,
    connecting,
    ending,
    isSending,
    isRestoringContext,
    isAwaitingResponse,
    isPlaying,
    recording,
    inputVolume,
    startConversation,
    resumeConversation,
    stopConversation,
    sendMessage,
    setMicrophoneEnabled,
    setSpeakerMuted,
  } = useLiveAPIContext();
  const active = activeView === 'immersive';
  const busy = !active || connecting || ending || isSending || isRestoringContext;
  const muted = !recording;
  const { isDrawerOpen } = useMapAiDebugStore();
  const { proficiencyLevel } = useSettings();

  const cameraTarget = useMapStore((s) => s.cameraTarget);
  const {
    selectProvince,
    selectLandmark,
    selectRegion,
    clearSelection,
    selectedLandmarkId,
    selectedProvinceId,
    markers,
  } = useMapStore();
  const selectedLandmark = VIETNAM_LANDMARKS.find((item) => item.id === selectedLandmarkId) ?? null;

  const turns = useLogStore((s) => s.turns);
  const hasHistory = turns.some((turn) => turn.role !== 'system');
  const isAwaitingFunctionResponse = useLogStore((s) => s.isAwaitingFunctionResponse);
  const [ttsPlaying, setTtsPlaying] = useState(false);
  const ttsRequest = useRef(0);
  const ttsUtterance = useRef<SpeechSynthesisUtterance | null>(null);
  const mascot = useImmersiveMascot({
    active,
    speaking: (isPlaying && !speakerMuted) || ttsPlaying,
    busy: connecting || ending || isSending || isRestoringContext || isAwaitingResponse || isAwaitingFunctionResponse || recording,
  });

  const [manualFocus, setManualFocus] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [showArticlesCard, setShowArticlesCard] = useState(true);

  const selectedProvinceDetail = useMemo(() => {
    if (!selectedProvinceId) return null;
    return getProvinceCultureData(selectedProvinceId);
  }, [selectedProvinceId]);

  // Focus condition: province selected, landmark selected, connected, interacting, or manual focus
  const isFocused = Boolean(
    selectedProvinceId ||
      selectedLandmark ||
      (active && connected) ||
      isInteracting ||
      manualFocus
  );

  const handleSelectProvince = (province: ProvinceMapItem | null) => {
    if (!active) return;
    if (province && province.id !== selectedProvinceId) mascot.celebrate();
    if (province) selectProvince(province.id, 'user');
    else clearSelection();
    setManualFocus(Boolean(province));
  };

  const handleSelectRegion = (region: 'north' | 'central' | 'south' | 'all') => {
    if (!active) return;
    selectRegion(region, 'user');
    setManualFocus(region !== 'all');
  };

  const handleSelectLandmark = (landmark: LandmarkArticle) => {
    if (!active) return;
    if (landmark.id !== selectedLandmarkId) mascot.celebrate();
    selectLandmark(landmark.id, 'user');
    setManualFocus(true);
  };

  const handleSelectMarker = (marker: VietnamMapMarker) => {
    if (!active || !marker.placeId) return;
    if (VIETNAM_LANDMARKS.some((item) => item.id === marker.placeId))
      selectLandmark(marker.placeId, 'user');
    else selectProvince(marker.placeId, 'user');
  };

  const handleAskAiAboutProvince = async (provinceName: string) => {
    if (busy) return;
    const query = `Tell me about the cultural heritage, famous landmarks, and speaking practice points for ${provinceName} in English suited for ${proficiencyLevel}. Please also use getVieCultureArticles to introduce authentic reading articles.`;
    await sendMessage({ text: query, source: 'map' });
  };

  const handleSelectTopic = async (topic: CulturalTopicItem) => {
    if (busy) return;
    if (topic.landmarkId) {
      selectLandmark(topic.landmarkId, 'user');
    } else if (topic.provinceId) {
      selectProvince(topic.provinceId, 'user');
    }
    setManualFocus(true);

    const query = topic.prompt;
    if (connected) {
      await sendMessage({ text: query, source: 'suggestion' });
    } else {
      if (hasHistory) {
        await resumeConversation({ input: 'voice' });
      } else {
        await startConversation({ input: 'voice' });
      }
      setTimeout(() => {
        void sendMessage({ text: query, source: 'suggestion' });
      }, 700);
    }
  };

  const handleRequestArticles = async () => {
    if (busy) return;
    const targetProvince = selectedProvinceDetail?.name || 'Hà Nội';
    const query = `Please call getVieCultureArticles to search and recommend curated bilingual reading articles for ${targetProvince} from the VieCultures platform library.`;
    setShowArticlesCard(true);
    if (connected) {
      await sendMessage({ text: query, source: 'suggestion' });
    } else {
      if (hasHistory) {
        await resumeConversation({ input: 'voice' });
      } else {
        await startConversation({ input: 'voice' });
      }
      setTimeout(() => {
        void sendMessage({ text: query, source: 'suggestion' });
      }, 700);
    }
  };

  const handleSpeakText = (text: string) => {
    if (!active) return;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const request = ++ttsRequest.current;
      window.speechSynthesis.cancel();
      setTtsPlaying(false);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.95;
      ttsUtterance.current = utterance;
      utterance.onstart = () => { if (request === ttsRequest.current) setTtsPlaying(true); };
      const finish = () => {
        if (request === ttsRequest.current) {
          ttsUtterance.current = null;
          setTtsPlaying(false);
        }
      };
      utterance.onend = finish;
      utterance.onerror = finish;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    const stopOwnedSpeech = () => {
      ttsRequest.current++;
      if (ttsUtterance.current) {
        window.speechSynthesis?.cancel();
        ttsUtterance.current = null;
      }
    };
    if (!active) {
      stopOwnedSpeech();
      setTtsPlaying(false);
    }
    return stopOwnedSpeech;
  }, [active]);

  const handleToggleConversation = () => {
    if (!active) return;
    if (connected || connecting || ending) stopConversation();
    else if (hasHistory) void resumeConversation({ input: 'voice' });
    else void startConversation({ input: 'voice' });
  };

  // Keyboard shortcut for resetting focus (ESC)
  useEffect(() => {
    if (!active) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLElement &&
        e.target.closest('input, textarea, select, [contenteditable="true"]')
      )
        return;
      if (e.key === 'Escape') {
        clearSelection();
        setManualFocus(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [active, clearSelection]);

  // Extract the latest AI dialogue turn in real-time
  const latestAgentText = useMemo(() => {
    for (let i = turns.length - 1; i >= 0; i--) {
      const turn = turns[i];
      if (turn.role === 'agent' && turn.text?.trim()) {
        return turn.text.trim();
      }
    }
    return '';
  }, [turns]);

  // Extract reading articles retrieved by AI via getVieCultureArticles tool
  const retrievedArticles = useMemo(() => {
    for (let i = turns.length - 1; i >= 0; i--) {
      const turn = turns[i];
      if (
        turn.role === 'system' &&
        (turn.toolResponse as any)?.type === 'vieculture_articles' &&
        Array.isArray((turn.toolResponse as any)?.articles) &&
        (turn.toolResponse as any).articles.length > 0
      ) {
        return (turn.toolResponse as any).articles as Array<{
          id: string;
          title: string;
          titleVi: string;
          location?: string;
          category: string;
          level: string;
          readTime: string;
          excerptEn?: string;
          vocabHighlights?: string[];
        }>;
      }
    }
    return null;
  }, [turns]);

  // Auto-show articles card when new articles arrive from the tool
  useEffect(() => {
    if (retrievedArticles && retrievedArticles.length > 0) {
      setShowArticlesCard(true);
    }
  }, [retrievedArticles]);

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-[#030706] select-none text-warm-ivory"
      onPointerMoveCapture={mascot.wake}
      onPointerDownCapture={mascot.wake}
      onKeyDownCapture={mascot.wake}
      onWheelCapture={mascot.wake}
    >
      {active && <Sidebar />}

      {/* Far-Left Diagnostic Drawer Trigger */}
      {active && !isDrawerOpen && <MapAiDebugDrawer mode="button" />}
      {active && isDrawerOpen && (
        <div className="absolute left-0 top-0 bottom-0 z-40 h-full">
          <MapAiDebugDrawer mode="panel" />
        </div>
      )}

      {/* Ambient Radial Spotlight behind Map */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-1000 ease-out ${
          isFocused ? 'opacity-100' : 'opacity-30'
        }`}
        style={{
          background: isPlaying
            ? 'radial-gradient(ellipse 75% 65% at 55% 50%, rgba(212, 175, 55, 0.35) 0%, color-mix(in srgb, var(--color-heritage-green) 45%, transparent) 36%, transparent 75%)'
            : recording && inputVolume > 0.05
              ? 'radial-gradient(ellipse 70% 60% at 55% 50%, rgba(16, 185, 129, 0.28) 0%, color-mix(in srgb, var(--color-heritage-green) 40%, transparent) 36%, transparent 72%)'
              : 'radial-gradient(ellipse 65% 55% at 55% 50%, color-mix(in srgb, var(--color-heritage-green) 40%, transparent) 0%, rgba(212, 175, 55, 0.15) 38%, transparent 72%)',
        }}
      />

      {/* Ambient Vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.65)_100%)] z-10" />

      {/* ============================================================ */}
      {/* 1. TOP-LEFT FLOATING CONTROLS (Clean, no subtitle banner) */}
      {/* ============================================================ */}
      <div className="absolute top-4 left-6 z-30 flex items-center gap-2">
        <ImmersiveTopicTray
          onSelectTopic={handleSelectTopic}
          disabled={busy}
          selectedProvinceName={selectedProvinceDetail?.name}
        />

        {/* 1-Click Button: Call Tool to get Reading Articles */}
        <button
          type="button"
          disabled={busy}
          onClick={handleRequestArticles}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-heritage-green text-gray-200 hover:text-antique-gold border border-white/10 text-xs font-medium transition-all cursor-pointer shadow-sm disabled:opacity-50"
          title={t('playground.immersive.cultural_reading_button_title')}
        >
          <BookOpen className="w-3.5 h-3.5 text-antique-gold" />
          <span>{t('playground.immersive.cultural_reading_button')}</span>
        </button>

        {/* Play / Pause Toggle Button */}
        <button
          type="button"
          onClick={handleToggleConversation}
          className={`p-2 rounded-xl transition-all cursor-pointer shadow-md border ${
            connected
              ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-400/50'
              : 'bg-heritage-green hover:bg-[#153a33] text-antique-gold border-antique-gold/50'
          }`}
          title={
            connected || connecting || ending
              ? t('playground.immersive.stop_convo')
              : hasHistory
                ? t('playground.immersive.resume_convo')
                : t('playground.immersive.start_convo')
          }
          aria-label={t('playground.immersive.convo_aria')}
        >
          {connecting ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : connected ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4 ml-0.5" />
          )}
        </button>

        {/* Microphone Toggle Button */}
        <button
          type="button"
          disabled={busy || !connected}
          onClick={() => void setMicrophoneEnabled(!recording)}
          className={`p-2 rounded-xl transition-all cursor-pointer border ${
            !muted
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
              : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
          }`}
          title={muted ? t('playground.immersive.mic_on_title') : t('playground.immersive.mic_off_title')}
          aria-label={t('playground.immersive.mic_aria')}
        >
          {!muted ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
        </button>

        {/* Speaker Toggle Button */}
        <button
          type="button"
          onClick={() => void setSpeakerMuted(!speakerMuted)}
          className={`p-2 rounded-xl transition-all cursor-pointer border ${
            !speakerMuted
              ? 'bg-white/5 text-gray-200 border-white/10 hover:bg-white/10'
              : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
          }`}
          title={speakerMuted ? t('playground.immersive.speaker_on_title') : t('playground.immersive.speaker_off_title')}
          aria-label={t('playground.immersive.speaker_aria')}
        >
          {!speakerMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Ambient / Focus Reset Button */}
        <button
          type="button"
          onClick={() => {
            if (manualFocus || selectedProvinceId) {
              handleSelectProvince(null);
              setManualFocus(false);
            } else {
              setManualFocus(true);
            }
          }}
          className={`p-2 rounded-xl transition-all cursor-pointer border ${
            isFocused
              ? 'bg-antique-gold/20 text-antique-gold border-antique-gold/50'
              : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
          }`}
          title={t('playground.immersive.reset_focus_title')}
          aria-label={t('playground.immersive.reset_focus_aria')}
        >
          <Compass className="w-4 h-4" />
        </button>

        {/* Voice Settings Drawer Toggle */}
        <button
          type="button"
          onClick={toggleSidebar}
          className="p-2 rounded-xl bg-white/5 hover:bg-heritage-green text-gray-300 hover:text-antique-gold border border-white/10 transition-colors cursor-pointer"
          title={t('playground.immersive.settings_title')}
          aria-label={t('playground.immersive.settings_aria')}
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* ============================================================ */}
      {/* 2. FLOATING COMIC CHAT BUBBLES & RETRIEVED ARTICLES */}
      {/* ============================================================ */}
      <div className="immersive-mascot-dialogue absolute left-6 sm:left-10 z-20 w-fit max-w-[calc(92vw-40px)] lg:max-w-[42vw] xl:max-w-[600px] pointer-events-auto flex flex-col items-start gap-3">
        {/* Main Comic Dialogue Bubble */}
        <MascotChatBubble
          latestText={latestAgentText}
          role="agent"
          isAwaitingResponse={isAwaitingFunctionResponse}
          isThinking={isSending || isAwaitingResponse}
          onSpeak={handleSpeakText}
        />

        {/* Interactive Articles Card Retrieved via AI getVieCultureArticles Tool */}
        {showArticlesCard && retrievedArticles && retrievedArticles.length > 0 && (
          <div className="w-[calc(100vw-48px)] sm:w-[480px] lg:w-[540px] xl:w-[580px] max-w-[calc(92vw-40px)] lg:max-w-[42vw] p-3.5 rounded-2xl bg-[#0d1d19]/95 border border-antique-gold/40 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10 text-xs">
              <span className="font-serif font-bold text-antique-bright flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-antique-gold" />
                {t('playground.immersive.recommended_articles_title', { count: retrievedArticles.length })}
              </span>
              <button
                type="button"
                onClick={() => setShowArticlesCard(false)}
                className="text-gray-400 hover:text-white p-0.5 rounded hover:bg-white/10 transition-colors cursor-pointer"
                title={t('playground.immersive.hide_articles_title')}
                aria-label={t('playground.immersive.close_aria')}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {retrievedArticles.map((art) => (
                <div
                  key={art.id}
                  className="p-2.5 rounded-xl bg-black/40 border border-white/10 hover:border-antique-gold/50 transition-all flex flex-col gap-1.5 group"
                >
                  <div className="flex items-center justify-between gap-1 text-[11px]">
                    <span className="font-semibold text-white group-hover:text-antique-bright transition-colors line-clamp-1">
                      {art.titleVi}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-heritage-green text-antique-gold border border-antique-gold/30 shrink-0">
                      {art.level} · {art.readTime}
                    </span>
                  </div>

                  <p className="text-[10px] text-gray-400 italic line-clamp-1">
                    {art.title}
                  </p>

                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/5">
                    {art.vocabHighlights && (
                      <div className="flex items-center gap-1 overflow-hidden text-[9px] text-antique-gold">
                        <span className="truncate">{art.vocabHighlights.slice(0, 2).join(', ')}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 ml-auto shrink-0">
                      <button
                        type="button"
                        onClick={() => selectLandmark(art.id, 'user')}
                        className="px-2 py-0.5 rounded text-[10px] bg-white/5 hover:bg-heritage-green text-antique-bright border border-white/10 flex items-center gap-1 cursor-pointer transition-colors"
                        title={t('playground.immersive.view_on_map_title')}
                      >
                        <Compass className="w-2.5 h-2.5" />
                        <span>{t('playground.immersive.view_on_map')}</span>
                      </button>
                      <a
                        href={paths.reader({ article: art.id, level: art.level })}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-0.5 rounded text-[10px] bg-antique-gold/20 hover:bg-antique-gold/35 text-antique-bright border border-antique-gold/40 flex items-center gap-1 cursor-pointer transition-colors"
                        title={t('playground.immersive.read_article_title')}
                      >
                        <ExternalLink className="w-2.5 h-2.5" />
                        <span>{t('playground.immersive.read_article')}</span>
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* 3. MASCOT CHARACTER (Anchored at bottom-left, standing still) */}
      {/* ============================================================ */}
      <div className="absolute bottom-2 left-6 sm:left-10 z-20 pointer-events-none">
        <MascotCharacter
          isPlaying={isPlaying}
          state={mascot.state}
          active={mascot.enabled}
          onWake={mascot.wake}
          className="flex items-end justify-start"
        />
      </div>

      {/* ============================================================ */}
      {/* 4. ACTIVE PROVINCE TAG (Top Center) */}
      {/* ============================================================ */}
      {active && selectedProvinceDetail && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12231F]/90 backdrop-blur-md border border-antique-gold/50 shadow-2xl text-xs animate-in fade-in zoom-in-95 duration-200">
          <span className="w-2 h-2 rounded-full bg-antique-gold animate-ping" />
          <span className="font-serif font-bold text-white flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-antique-gold" />
            {selectedProvinceDetail.name}
          </span>
          <span className="text-[10px] text-[#A2B5AD] font-medium">
            ({selectedProvinceDetail.regionName})
          </span>
          <button
            type="button"
            onClick={() => handleSelectProvince(null)}
            className="ml-1 p-0.5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
            title={t('playground.immersive.restore_panorama_title')}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. FLOATING PROVINCE CULTURE CARD (Top Right) */}
      {/* ============================================================ */}
      {active && selectedProvinceDetail && (
        <div className="absolute top-4 right-4 z-30 animate-in fade-in slide-in-from-right-4 duration-300">
          <ProvinceHoverCard
            key={selectedProvinceDetail.id}
            provinceDetail={selectedProvinceDetail}
            onClose={() => handleSelectProvince(null)}
            onSpeak={handleSpeakText}
            onAskAi={handleAskAiAboutProvince}
            disabled={busy}
          />
        </div>
      )}

      {/* ============================================================ */}
      {/* 6. FULL-SCREEN VIETNAM MAP CANVAS (Unified Background) */}
      {/* ============================================================ */}
      <main
        className="w-full h-full relative z-10 flex items-center justify-center select-none"
        onMouseEnter={() => active && setIsInteracting(true)}
        onMouseLeave={() => setIsInteracting(false)}
        onClick={() => {
          if (active && !isFocused) setManualFocus(true);
        }}
      >
        <div
          className={`w-full h-full flex items-center justify-center pl-0 lg:pl-36 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isFocused
              ? isPlaying
                ? 'scale-[1.01] opacity-100 brightness-110 contrast-105 drop-shadow-[0_0_80px_rgba(212,175,55,0.45)]'
                : recording && inputVolume > 0.05
                  ? 'scale-[1.005] opacity-100 brightness-105 contrast-100 drop-shadow-[0_0_65px_rgba(16,185,129,0.38)]'
                  : 'scale-100 opacity-100 brightness-100 contrast-100 drop-shadow-[0_0_50px_rgba(212,175,55,0.22)]'
              : 'scale-[0.94] opacity-70 brightness-90 contrast-95 filter blur-[0.2px] hover:opacity-90 hover:scale-[0.97] hover:blur-0 cursor-pointer'
          }`}
        >
          <VietnamMap
            selectedProvinceId={selectedProvinceId}
            selectedLandmarkId={selectedLandmarkId}
            markers={markers}
            onSelectMarker={handleSelectMarker}
            onSelectProvince={handleSelectProvince}
            activeRegion={cameraTarget?.region || 'all'}
            onSelectRegion={handleSelectRegion}
            onSelectLandmark={handleSelectLandmark}
            showControls={true}
            showRegionTabs={true}
            showPoiPins={true}
            showSeaLayer={true}
            showLabels={true}
            showTooltip={true}
            className="w-full h-full"
          />
        </div>
      </main>
    </div>
  );
}

export const VietnamMapImmersiveScreen: React.FC = () => {
  const { theme } = useSettings();

  return (
    <div
      className={`map-ai-app ${
        theme === 'light' ? 'light-theme' : ''
      } w-full h-full relative overflow-hidden`}
    >
      <VietnamMapImmersiveContent />
    </div>
  );
};

export default VietnamMapImmersiveScreen;
