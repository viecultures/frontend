/**
 * VietnamMapAiScreen
 *
 * Full-fidelity integration of the Map AI Agent
 * English Speaking & Listening Cultural Tutor with project-native VietnamMap.
 */

import React, { useState, useMemo } from 'react';
import './map-ai.css';
import ControlTray from './components/ControlTray';
import ErrorScreen from './components/ErrorScreen';
import StreamingConsole from './components/streaming-console/StreamingConsole';
import PopUp from './components/popup/PopUp';
import Sidebar from './components/Sidebar';
import { LiveAPIProvider, useLiveAPIContext } from './contexts/LiveAPIContext';
import VietnamMap from '@/components/map/VietnamMap';
import type { ProvinceMapItem } from '@/data/vietnamMapData';
import { useUI, useSettings, useMapStore, useLogStore } from './lib/state';
import ProvinceHoverCard from './components/ProvinceHoverCard';
import { getProvinceCultureData } from './data/vietnamProvincesDetail';
import MapAiDebugDrawer from './components/MapAiDebugDrawer';
import { debugLog } from './lib/debug-logger';

const GEMINI_API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '') || '';

function MapAiContent() {
  const { isSidebarOpen } = useUI();
  const [showPopUp, setShowPopUp] = useState(false);
  const { connected, connect, client } = useLiveAPIContext();

  const cameraTarget = useMapStore(s => s.cameraTarget);
  const highlightedPlaceId = useMapStore(s => s.highlightedPlaceId);
  const setCameraTarget = useMapStore(s => s.setCameraTarget);
  const setHighlightedPlaceId = useMapStore(s => s.setHighlightedPlaceId);

  const selectedProvinceId = highlightedPlaceId || cameraTarget?.provinceId || undefined;

  const selectedProvinceDetail = useMemo(() => {
    if (!selectedProvinceId) return null;
    return getProvinceCultureData(selectedProvinceId);
  }, [selectedProvinceId]);

  const handleClosePopUp = () => {
    setShowPopUp(false);
  };

  const handleSelectProvince = (province: ProvinceMapItem | null) => {
    if (province) {
      debugLog.map(`Người dùng chọn tỉnh: ${province.name} (${province.id})`, {
        region: province.region,
      });
      setHighlightedPlaceId(province.id);
      setCameraTarget({ provinceId: province.id, region: province.region });
    } else {
      debugLog.map('Người dùng bỏ chọn tỉnh (Clear selection)');
      setHighlightedPlaceId(null);
      setCameraTarget(null);
    }
  };

  const handleSelectRegion = (region: 'north' | 'central' | 'south' | 'all') => {
    debugLog.map(`Người dùng bấm chuyển tab vùng: ${region}`);
    setCameraTarget({
      provinceId: undefined,
      region,
    });
  };

  const handleSelectLandmark = (landmark: any, province: ProvinceMapItem) => {
    debugLog.map(`Người dùng bấm di tích: ${landmark.name} (${province.name})`, {
      landmarkId: landmark.id,
      provinceId: province.id,
    });
    handleSelectProvince(province);
  };

  const { proficiencyLevel } = useSettings();

  const handleAskAiAboutProvince = async (provinceName: string) => {
    if (!connected) {
      await connect();
    }
    const query = `Tell me about the cultural heritage, famous landmarks, and speaking practice points for ${provinceName} in English suited for ${proficiencyLevel}.`;
    client.sendRealtimeText(query);
    useLogStore.getState().addTurn({
      role: 'user',
      text: `Tell me about ${provinceName} cultural heritage and local specialties (${proficiencyLevel}).`,
      isFinal: true,
    });
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

  return (
    <>
      <ErrorScreen />
      <Sidebar />
      <MapAiDebugDrawer />
      {showPopUp && <PopUp onClose={handleClosePopUp} />}
      <div className={`streaming-console ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="console-panel">
          <StreamingConsole />
          <ControlTray />
        </div>
        <div className="map-panel flex flex-col items-center justify-center p-2 relative overflow-hidden bg-[#090e1a]">
          {selectedProvinceDetail && (
            <ProvinceHoverCard
              provinceDetail={selectedProvinceDetail}
              onClose={() => handleSelectProvince(null)}
              onSpeak={handleSpeakText}
              onAskAi={handleAskAiAboutProvince}
            />
          )}
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
      </div>
    </>
  );
}

export const VietnamMapAiScreen: React.FC = () => {
  const { theme, customGeminiApiKey } = useSettings();
  const activeGeminiApiKey = customGeminiApiKey || GEMINI_API_KEY;

  return (
    <div className={`map-ai-app ${theme === 'light' ? 'light-theme' : ''} w-full h-full relative overflow-hidden`}>
      <LiveAPIProvider apiKey={activeGeminiApiKey}>
        <MapAiContent />
      </LiveAPIProvider>
    </div>
  );
};

export default VietnamMapAiScreen;
