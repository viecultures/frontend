/**
 * VietnamMapImmersiveScreen
 *
 * Screen #03 in Playground:
 * An ambient, voice-first cultural immersion experience.
 * - Map is centered in the viewport.
 * - Recesses/dims ("chìm xuống dưới") when idle without focus.
 * - Elevates and glows ("sáng lên") when a province/landmark is focused or during conversation.
 * - Chat box is hidden; uses floating audio HUD and live spoken subtitles.
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import './map-ai.css';
import Sidebar from './components/Sidebar';
import { LiveAPIProvider, useLiveAPIContext } from './contexts/LiveAPIContext';
import VietnamMap from '@/components/map/VietnamMap';
import type { ProvinceMapItem } from '@/data/vietnamMapData';
import type { LandmarkArticle } from '@/data/landmarksData';
import { useUI, useSettings, useMapStore, useLogStore } from './lib/state';
import ProvinceHoverCard from './components/ProvinceHoverCard';
import { getProvinceCultureData } from './data/vietnamProvincesDetail';
import MapAiDebugDrawer from './components/MapAiDebugDrawer';
import { debugLog, useMapAiDebugStore } from './lib/debug-logger';
import { AudioRecorder } from './lib/audio-recorder';
import {
  Play,
  Pause,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  SlidersHorizontal,
  Compass,
  Sparkles,
  MapPin,
  RefreshCw,
  X,
  Radio,
} from 'lucide-react';

const GEMINI_API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '') || '';

function VietnamMapImmersiveContent() {
  const { toggleSidebar, muted, setMuted, speakerMuted, setSpeakerMuted } = useUI();
  const { connected, connect, disconnect, client, sendPrompt, connecting, ending, volume, audioStreamer } = useLiveAPIContext();
  const { isDrawerOpen } = useMapAiDebugStore();
  const { proficiencyLevel } = useSettings();

  const cameraTarget = useMapStore(s => s.cameraTarget);
  const highlightedPlaceId = useMapStore(s => s.highlightedPlaceId);
  const setCameraTarget = useMapStore(s => s.setCameraTarget);
  const setHighlightedPlaceId = useMapStore(s => s.setHighlightedPlaceId);

  const turns = useLogStore(s => s.turns);
  const isAwaitingFunctionResponse = useLogStore(s => s.isAwaitingFunctionResponse);

  const [selectedLandmark, setSelectedLandmark] = useState<LandmarkArticle | null>(null);
  const [manualFocus, setManualFocus] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [audioRecorder] = useState(() => new AudioRecorder());

  const selectedProvinceId = highlightedPlaceId || cameraTarget?.provinceId || undefined;

  const selectedProvinceDetail = useMemo(() => {
    if (!selectedProvinceId) return null;
    return getProvinceCultureData(selectedProvinceId);
  }, [selectedProvinceId]);

  // Focus condition: province selected, landmark selected, connected, interacting, or manual focus
  const isFocused = Boolean(
    selectedProvinceId ||
    selectedLandmark ||
    connected ||
    isInteracting ||
    manualFocus
  );

  // Sync audio gain with mute state
  useEffect(() => {
    if (audioStreamer.current) {
      audioStreamer.current.setGain(speakerMuted ? 0 : 1);
    }
  }, [speakerMuted, audioStreamer]);

  // Client ref for mic listener
  const clientRef = useRef(client);
  useEffect(() => {
    clientRef.current = client;
  }, [client]);

  // Audio Recorder integration for microphone streaming
  useEffect(() => {
    const onData = (base64: string) => {
      if (clientRef.current && connected) {
        clientRef.current.sendRealtimeInput([
          {
            mimeType: 'audio/pcm;rate=16000',
            data: base64,
          },
        ]);
      }
    };

    const onError = (error: any) => {
      console.error('Audio recorder error:', error);
      debugLog.error('AudioRecorder Immersive', error);
      setMuted(true);
    };

    if (connected && !muted && audioRecorder) {
      audioRecorder.on('data', onData);
      audioRecorder.on('error', onError);
      audioRecorder.start().catch(onError);
    } else {
      audioRecorder.stop();
    }

    return () => {
      audioRecorder.off('data', onData);
      audioRecorder.off('error', onError);
    };
  }, [connected, muted, audioRecorder, setMuted]);

  // Province selection handler
  const handleSelectProvince = (province: ProvinceMapItem | null) => {
    setSelectedLandmark(null);
    if (province) {
      debugLog.map(`[Immersive] Chọn tỉnh: ${province.name} (${province.id})`, {
        region: province.region,
      });
      setHighlightedPlaceId(province.id);
      setCameraTarget({ provinceId: province.id, region: province.region });
      setManualFocus(true);
    } else {
      debugLog.map('[Immersive] Bỏ chọn tỉnh');
      setHighlightedPlaceId(null);
      setCameraTarget(null);
      setManualFocus(false);
    }
  };

  const handleSelectRegion = (region: 'north' | 'central' | 'south' | 'all') => {
    setSelectedLandmark(null);
    setHighlightedPlaceId(null);
    debugLog.map(`[Immersive] Chọn vùng: ${region}`);
    setCameraTarget({
      provinceId: undefined,
      region,
    });
    setManualFocus(region !== 'all');
  };

  const handleSelectLandmark = (landmark: LandmarkArticle, province: ProvinceMapItem) => {
    debugLog.map(`[Immersive] Chọn di tích: ${landmark.name} (${province.name})`, {
      landmarkId: landmark.id,
      provinceId: province.id,
    });
    handleSelectProvince(province);
    setSelectedLandmark(landmark);
  };

  const handleAskAiAboutProvince = async (provinceName: string) => {
    const query = `Tell me about the cultural heritage, famous landmarks, and speaking practice points for ${provinceName} in English suited for ${proficiencyLevel}.`;
    await sendPrompt(query);
  };

  const handleSpeakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'vi-VN';
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Keyboard shortcut for resetting focus (ESC)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleSelectProvince(null);
        setManualFocus(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Latest conversation turn for live subtitle display
  const latestSpokenTurn = useMemo(() => {
    for (let i = turns.length - 1; i >= 0; i--) {
      const turn = turns[i];
      if (turn.role === 'agent' || turn.role === 'user') {
        return turn;
      }
    }
    return null;
  }, [turns]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-b from-[#030706] via-[#071310] to-[#020504] select-none text-[#FBF7EE]">
      <Sidebar />

      {/* Far-Left Diagnostic Drawer Trigger */}
      {!isDrawerOpen && <MapAiDebugDrawer mode="button" />}
      {isDrawerOpen && (
        <div className="absolute left-0 top-0 bottom-0 z-40 h-full">
          <MapAiDebugDrawer mode="panel" />
        </div>
      )}

      {/* Ambient Radial Spotlight (Backdrop Light) */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ease-out ${
          isFocused ? 'opacity-100' : 'opacity-20'
        }`}
        style={{
          background:
            'radial-gradient(ellipse 65% 55% at 50% 48%, rgba(30, 75, 67, 0.45) 0%, rgba(212, 175, 55, 0.16) 38%, transparent 72%)',
        }}
      />

      {/* Ambient Vignette & Grain */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.65)_100%)] z-10" />

      {/* Top Floating Focus Status Bar */}
      <header className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {selectedProvinceDetail ? (
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#12231F]/90 backdrop-blur-md border border-[#D4AF37]/40 shadow-2xl text-xs animate-in fade-in zoom-in-95 duration-200">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping" />
            <span className="font-serif font-bold text-white flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
              {selectedProvinceDetail.name}
            </span>
            <span className="text-[10px] text-[#A2B5AD] font-medium">({selectedProvinceDetail.regionName})</span>
            <button
              onClick={() => handleSelectProvince(null)}
              className="ml-1 p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
              title="Khôi phục toàn cảnh (ESC)"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[11px] text-gray-400 transition-opacity duration-500 ${
              isFocused ? 'opacity-0 pointer-events-none' : 'opacity-90'
            }`}
          >
            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
            <span>Bản đồ ở chế độ tĩnh · Chạm vào tỉnh thành hoặc bật mic để kích hoạt tiêu điểm</span>
          </div>
        )}
      </header>

      {/* Floating Province Culture Card (Top Right) */}
      {selectedProvinceDetail && (
        <div className="absolute top-4 right-4 z-30 animate-in fade-in slide-in-from-right-4 duration-300">
          <ProvinceHoverCard
            provinceDetail={selectedProvinceDetail}
            onClose={() => handleSelectProvince(null)}
            onSpeak={handleSpeakText}
            onAskAi={handleAskAiAboutProvince}
          />
        </div>
      )}

      {/* CENTER HERO: Vietnam Map Container (Sinks when idle, Elevates & Glows when focused) */}
      <main
        className="w-full h-full flex items-center justify-center relative z-20"
        onMouseEnter={() => setIsInteracting(true)}
        onMouseLeave={() => setIsInteracting(false)}
        onClick={() => {
          if (!isFocused) setManualFocus(true);
        }}
      >
        <div
          className={`w-full h-full max-w-5xl flex items-center justify-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isFocused
              ? 'scale-100 translate-y-0 opacity-100 brightness-100 contrast-100 drop-shadow-[0_0_50px_rgba(212,175,55,0.22)]'
              : 'scale-[0.88] translate-y-9 opacity-40 brightness-75 contrast-90 filter blur-[0.3px] hover:opacity-75 hover:scale-[0.93] hover:translate-y-4 hover:blur-0 cursor-pointer'
          }`}
        >
          <VietnamMap
            selectedProvinceId={selectedProvinceId}
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

      {/* LIVE SPOKEN SUBTITLES (Floating above the bottom controls) */}
      {(latestSpokenTurn || isAwaitingFunctionResponse) && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 w-full max-w-2xl px-4 pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="p-3.5 rounded-2xl bg-[#0c1915]/90 backdrop-blur-xl border border-[#D4AF37]/35 shadow-2xl text-xs text-[#E8ECE9] pointer-events-auto">
            <div className="flex items-center justify-between text-[10px] font-mono mb-1 text-[#D4AF37]">
              <span className="font-bold flex items-center gap-1.5">
                {latestSpokenTurn?.role === 'user' ? (
                  <>
                    <Radio className="w-3 h-3 text-blue-400" /> Bạn
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 text-[#D4AF37]" /> Sứ Giả Văn Hóa AI
                  </>
                )}
              </span>
              {isAwaitingFunctionResponse && (
                <span className="inline-flex items-center gap-1 text-[#D4AF37]">
                  <RefreshCw className="w-3 h-3 animate-spin" /> Đang định vị bản đồ...
                </span>
              )}
            </div>
            <p className="line-clamp-3 leading-relaxed text-slate-200">
              {latestSpokenTurn?.text || 'Đang chuẩn bị nội dung...'}
            </p>
          </div>
        </div>
      )}

      {/* FLOATING AUDIO & NAVIGATION HUD (Bottom Center) */}
      <footer className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
        <nav
          className="flex items-center gap-2 p-2 px-3.5 rounded-full bg-[#10201B]/90 backdrop-blur-xl border border-[#D4AF37]/40 shadow-[0_12px_45px_rgba(0,0,0,0.7)]"
          aria-label="Floating Cultural AI Audio Controls"
        >
          {/* Settings Drawer Button */}
          <button
            onClick={toggleSidebar}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#1E4B43] text-gray-300 hover:text-[#D4AF37] border border-white/10 flex items-center justify-center transition-all cursor-pointer"
            title="Cài đặt chủ đề &amp; giọng nói"
            aria-label="Cài đặt"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>

          {/* Connect / Disconnect Toggle Button */}
          <button
            onClick={() => {
              if (connected) {
                disconnect();
              } else {
                setMuted(false);
                connect();
              }
            }}
            disabled={connecting || ending}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg border ${
              connected
                ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-400/50 animate-pulse'
                : 'bg-[#1E4B43] hover:bg-[#153a33] text-[#D4AF37] border-[#D4AF37]/60'
            }`}
            title={connected ? 'Dừng đàm thoại' : 'Bắt đầu đàm thoại cùng Sứ Giả AI'}
            aria-label={connected ? 'Dừng đàm thoại' : 'Bắt đầu đàm thoại'}
          >
            {connecting ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : connected ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </button>

          {/* Microphone Mute / Unmute Button */}
          <div className="relative">
            <button
              onClick={() => setMuted(!muted)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
                !muted
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
              }`}
              title={muted ? 'Bật microphone' : 'Tắt microphone'}
              aria-label={muted ? 'Bật microphone' : 'Tắt microphone'}
            >
              {!muted ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>
            {/* Animated Audio Volume Pulse Ring */}
            {connected && !muted && volume > 0.05 && (
              <span className="absolute -inset-1 rounded-full border border-emerald-400/60 animate-ping pointer-events-none" />
            )}
          </div>

          {/* Speaker Mute / Unmute Button */}
          <button
            onClick={() => setSpeakerMuted(!speakerMuted)}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
              !speakerMuted
                ? 'bg-white/5 text-gray-200 border-white/10 hover:bg-white/10'
                : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
            }`}
            title={speakerMuted ? 'Bật âm thanh loa' : 'Tắt âm thanh loa'}
            aria-label={speakerMuted ? 'Bật loa' : 'Tắt loa'}
          >
            {!speakerMuted ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Ambient / Focus Toggle */}
          <button
            onClick={() => {
              if (manualFocus || selectedProvinceId) {
                handleSelectProvince(null);
                setManualFocus(false);
              } else {
                setManualFocus(true);
              }
            }}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer border ${
              isFocused
                ? 'bg-[#D4AF37]/20 text-[#D4AF37] border-[#D4AF37]/50'
                : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
            }`}
            title={isFocused ? 'Chuyển về chế độ tĩnh (Ambient)' : 'Kích hoạt tiêu điểm bản đồ (Focus)'}
            aria-label="Chuyển chế độ tiêu điểm"
          >
            <Compass className="w-4 h-4" />
          </button>
        </nav>
      </footer>
    </div>
  );
}

export const VietnamMapImmersiveScreen: React.FC = () => {
  const { theme, customGeminiApiKey } = useSettings();
  const activeGeminiApiKey = customGeminiApiKey || GEMINI_API_KEY;

  return (
    <div className={`map-ai-app ${theme === 'light' ? 'light-theme' : ''} w-full h-full relative overflow-hidden`}>
      <LiveAPIProvider apiKey={activeGeminiApiKey}>
        <VietnamMapImmersiveContent />
      </LiveAPIProvider>
    </div>
  );
};

export default VietnamMapImmersiveScreen;
