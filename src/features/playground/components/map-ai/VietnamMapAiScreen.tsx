/**
 * VietnamMapAiScreen
 *
 * Full-fidelity integration of the Map AI Agent
 * English Speaking & Listening Cultural Tutor with project-native VietnamMap.
 */

import React, { useEffect, useMemo } from 'react';
import { X } from 'lucide-react';
import './map-ai.css';
import './ai-workspace-ui.css';
import ControlTray from './components/ControlTray';
import StreamingConsole from './components/streaming-console/StreamingConsole';
import Sidebar from './components/Sidebar';
import { useLiveAPIContext } from './contexts/LiveAPIContext';
import VietnamMap from '@/components/map/VietnamMap';
import type { VietnamMapMarker } from '@/components/map/types';
import type { ProvinceMapItem } from '@/data/vietnamMapData';
import { VIETNAM_LANDMARKS, type LandmarkArticle } from '@/data/landmarksData';
import { useUI, useSettings, useMapStore } from './lib/state';
import ProvinceHoverCard from './components/ProvinceHoverCard';
import { getProvinceCultureData } from './data/vietnamProvincesDetail';
import MapAiDebugDrawer from './components/MapAiDebugDrawer';
import { useMapAiDebugStore } from './lib/debug-logger';
import { useChatWorkspace } from './lib/chat-workspace';
import { ChatArticleDetail } from './components/ChatArticleDetail';
import { ReaderWorkspacePanel } from './components/ReaderWorkspacePanel';


function MapAiContent() {
  const { isSidebarOpen } = useUI();
  const { activeView, sendMessage, connecting, ending, isSending, isRestoringContext } = useLiveAPIContext();
  const active = activeView === 'chat';
  const busy = !active || connecting || ending || isSending || isRestoringContext;
  const { isDrawerOpen } = useMapAiDebugStore();
  const { panel, closePanel, openMap } = useChatWorkspace();

  useEffect(() => {
    if (!active || !panel) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !(event.target instanceof HTMLElement &&
        event.target.closest('input, textarea, select, [contenteditable="true"]'))) closePanel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [active, panel, closePanel]);

  const cameraTarget = useMapStore(s => s.cameraTarget);
  const { selectProvince, selectLandmark, selectRegion, clearSelection, selectedLandmarkId, selectedProvinceId, markers } = useMapStore();
  const selectedLandmark = VIETNAM_LANDMARKS.find(item => item.id === selectedLandmarkId) ?? null;


  const selectedProvinceDetail = useMemo(() => {
    if (!selectedProvinceId) return null;
    return getProvinceCultureData(selectedProvinceId);
  }, [selectedProvinceId]);

  const handleSelectProvince = (province: ProvinceMapItem | null) => {
    if (!active) return;
    if (province) selectProvince(province.id, 'user');
    else clearSelection();
  };
  const handleSelectRegion = (region: 'north' | 'central' | 'south' | 'all') => {
    if (active) selectRegion(region, 'user');
  };
  const handleSelectLandmark = (landmark: LandmarkArticle) => {
    if (active) selectLandmark(landmark.id, 'user');
  };

  const { proficiencyLevel } = useSettings();

  const handleShowArticleOnMap = (articleId: string) => {
    if (!active) return;
    selectLandmark(articleId, 'user');
    openMap();
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

  return (
    <>
      {active && <Sidebar />}

      <div
        className={`streaming-console ${
          active && isSidebarOpen ? 'sidebar-open' : ''
        } ${panel ? 'chat-panel-open' : 'chat-panel-closed'} ${panel?.type === 'reader' ? 'reader-panel-open' : ''} flex flex-row h-full w-full overflow-hidden`}
      >
        {/* FAR-LEFT IN-FLOW DEBUG HUB */}
        {active && isDrawerOpen && <MapAiDebugDrawer mode="panel" />}

        <div className="console-panel">
          <StreamingConsole />
          {active && <ControlTray />}
        </div>

        {panel && (
          <aside className={`map-panel chat-tool-panel flex flex-col relative overflow-hidden bg-[#090e1a] ${panel.type === 'reader' ? 'reader-reference-drawer' : ''}`} aria-label={panel.type === 'map' ? 'Vietnam map' : panel.type === 'reader' ? 'Reading reference' : 'Cultural story'}>
            <div className="chat-tool-panel-header">
              <h2>{panel.type === 'map' ? 'Vietnam map' : panel.type === 'reader' ? 'Ghi chú bài đọc' : 'Story details'}</h2>
              <button type="button" onClick={closePanel} aria-label="Close content" title="Close (Esc)"><X size={18} /></button>
            </div>
            {panel.type === 'reader' ? <ReaderWorkspacePanel /> : panel.type === 'article' ? (
              <ChatArticleDetail articleId={panel.articleId} onShowMap={handleShowArticleOnMap} />
            ) : (
              <div className="relative flex-1 min-h-0 w-full">
                {active && selectedLandmark && selectedLandmark.provinceId === selectedProvinceId && (
                  <button type="button" disabled={busy} className="ai-workspace-map-ask-button" onClick={() => !busy && void sendMessage({ text: `Tell me about ${selectedLandmark.name} in ${selectedProvinceDetail?.name || selectedLandmark.locationNameVi}. Use English suited for ${proficiencyLevel}.`, source: 'map' })}>
                    Ask AI about {selectedLandmark.name}
                  </button>
                )}
                {active && selectedProvinceDetail && (
                  <ProvinceHoverCard
                    key={selectedProvinceDetail.id}
                    provinceDetail={selectedProvinceDetail}
                    onClose={() => handleSelectProvince(null)}
                    onSpeak={handleSpeakText}
                    onAskAi={handleAskAiAboutProvince}
                    disabled={busy}
                  />
                )}
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
            )}
          </aside>
        )}
      </div>
    </>
  );
}

export const VietnamMapAiScreen: React.FC = () => {
  const { theme } = useSettings();

  return (
    <div className={`map-ai-app ai-chat-ui ${theme === 'light' ? 'light-theme' : 'dark'} w-full h-full relative overflow-hidden`}>
      <MapAiContent />
    </div>
  );
};

export default VietnamMapAiScreen;
