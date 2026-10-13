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

import React, { useState, useMemo, useEffect } from 'react';
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


function VietnamMapImmersiveContent() {
  const { toggleSidebar, speakerMuted } = useUI();
  const {
    activeView, connected, connecting, ending, isSending, isRestoringContext,
    isAwaitingResponse, isPlaying, recording, inputVolume, connectionError,
    startConversation, resumeConversation, stopConversation, endConversation,
    sendMessage, setMicrophoneEnabled, setSpeakerMuted, retry,
  } = useLiveAPIContext();
  const active = activeView === 'immersive';
  const busy = !active || connecting || ending || isSending || isRestoringContext;
  const muted = !recording;
  const { isDrawerOpen } = useMapAiDebugStore();
  const { proficiencyLevel } = useSettings();

  const cameraTarget = useMapStore(s => s.cameraTarget);
  const { selectProvince, selectLandmark, selectRegion, clearSelection, selectedLandmarkId, selectedProvinceId, markers } = useMapStore();
  const selectedLandmark = VIETNAM_LANDMARKS.find(item => item.id === selectedLandmarkId) ?? null;

  const turns = useLogStore(s => s.turns);
  const hasHistory = turns.some(turn => turn.role !== 'system');
  const isAwaitingFunctionResponse = useLogStore(s => s.isAwaitingFunctionResponse);

  const [manualFocus, setManualFocus] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);


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
    selectLandmark(landmark.id, 'user');
    setManualFocus(true);
  };

  const handleSelectMarker = (marker: VietnamMapMarker) => {
    if (!active || !marker.placeId) return;
    if (VIETNAM_LANDMARKS.some(item => item.id === marker.placeId)) selectLandmark(marker.placeId, 'user');
    else selectProvince(marker.placeId, 'user');
  };

  const handleAskAiAboutProvince = async (provinceName: string) => {
    if (busy) return;
    const query = `Tell me about the cultural heritage, famous landmarks, and speaking practice points for ${provinceName} in English suited for ${proficiencyLevel}.`;
    await sendMessage({ text: query, source: 'map' });
  };

  const handleSpeakText = (text: string) => {
    if (!active) return;
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
    if (!active) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest('input, textarea, select, [contenteditable="true"]')) return;
      if (e.key === 'Escape') {
        clearSelection();
        setManualFocus(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [active, clearSelection]);

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
      {active && <Sidebar />}

      {/* Far-Left Diagnostic Drawer Trigger */}
      {active && !isDrawerOpen && <MapAiDebugDrawer mode="button" />}
      {active && isDrawerOpen && (
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
      {active && <header className="absolute top-4 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
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
      </header>}

      {/* Floating Province Culture Card (Top Right) */}
      {active && selectedProvinceDetail && (
        <div className="absolute top-4 right-4 z-30 animate-in fade-in slide-in-from-right-4 duration-300">
          <ProvinceHoverCard
            provinceDetail={selectedProvinceDetail}
            onClose={() => handleSelectProvince(null)}
            onSpeak={handleSpeakText}
            onAskAi={handleAskAiAboutProvince}
            disabled={busy}
          />
        </div>
      )}

      {/* CENTER HERO: Vietnam Map Container (Sinks when idle, Elevates & Glows when focused) */}
      <main
        className="w-full h-full flex items-center justify-center relative z-20"
        onMouseEnter={() => active && setIsInteracting(true)}
        onMouseLeave={() => setIsInteracting(false)}
        onClick={() => {
          if (active && !isFocused) setManualFocus(true);
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

      {/* LIVE SPOKEN SUBTITLES (Floating above the bottom controls) */}
      {active && (latestSpokenTurn || isAwaitingFunctionResponse) && (
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
      {active && <footer className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
        <div role="status" className="mb-2 rounded-xl bg-[#10201B]/95 px-3 py-2 text-center text-xs">
          {connecting ? 'Đang kết nối…' : ending ? 'Đang tổng kết…' : isRestoringContext ? 'Đang khôi phục ngữ cảnh…' : isPlaying ? 'AI đang nói' : isSending || isAwaitingResponse ? 'Đang chờ AI phản hồi…' : recording ? 'Đang nghe' : connected ? 'Mic đã tắt' : hasHistory ? 'Play để tiếp tục đàm thoại' : 'Sẵn sàng trò chuyện'}
          {connectionError && <div role="alert">{connectionError} <button disabled={busy} onClick={() => void retry()} className="underline">Thử lại</button></div>}
          {connected && !busy && <button onClick={() => void endConversation()} className="ml-2 underline">Kết thúc và tổng kết</button>}
          {!connected && !busy && hasHistory && <button onClick={() => void resumeConversation({ input: 'voice' })} className="ml-2 underline">Tiếp tục từ lịch sử</button>}
        </div>
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
              if (!active) return;
              if (connected || connecting || ending) stopConversation();
              else if (hasHistory) void resumeConversation({ input: 'voice' });
              else void startConversation({ input: 'voice' });
            }}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg border ${
              connected
                ? 'bg-rose-600 hover:bg-rose-700 text-white border-rose-400/50 animate-pulse'
                : 'bg-[#1E4B43] hover:bg-[#153a33] text-[#D4AF37] border-[#D4AF37]/60'
            }`}
            title={connected || connecting || ending ? 'Dừng đàm thoại' : hasHistory ? 'Tiếp tục đàm thoại cùng Sứ Giả AI' : 'Bắt đầu đàm thoại cùng Sứ Giả AI'}
            aria-label={connected || connecting || ending ? 'Dừng đàm thoại' : hasHistory ? 'Tiếp tục đàm thoại' : 'Bắt đầu đàm thoại'}
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
              disabled={busy || !connected}
              onClick={() => void setMicrophoneEnabled(!recording)}
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
            {connected && !muted && inputVolume > 0.05 && (
              <span className="absolute -inset-1 rounded-full border border-emerald-400/60 animate-ping pointer-events-none" />
            )}
          </div>

          {/* Speaker Mute / Unmute Button */}
          <button
            onClick={() => void setSpeakerMuted(!speakerMuted)}
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
      </footer>}
    </div>
  );
}

export const VietnamMapImmersiveScreen: React.FC = () => {
  const { theme } = useSettings();

  return (
    <div className={`map-ai-app ${theme === 'light' ? 'light-theme' : ''} w-full h-full relative overflow-hidden`}>
      <VietnamMapImmersiveContent />
    </div>
  );
};

export default VietnamMapImmersiveScreen;
