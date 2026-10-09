/**
 * VietnamMapAiScreen
 *
 * Full-fidelity integration of the Map AI Agent
 * English Speaking & Listening Cultural Tutor with project-native VietnamMap.
 */

import React, { useState } from 'react';
import './map-ai.css';
import ControlTray from './components/ControlTray';
import ErrorScreen from './components/ErrorScreen';
import StreamingConsole from './components/streaming-console/StreamingConsole';
import PopUp from './components/popup/PopUp';
import Sidebar from './components/Sidebar';
import { LiveAPIProvider } from './contexts/LiveAPIContext';
import VietnamMap from '@/components/map/VietnamMap';
import type { ProvinceMapItem } from '@/data/vietnamMapData';
import { useUI, useSettings, useMapStore } from './lib/state';

const GEMINI_API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '') || '';

function MapAiComponent() {
  const { isSidebarOpen } = useUI();
  const [showPopUp, setShowPopUp] = useState(false);

  const { customGeminiApiKey } = useSettings();
  const activeGeminiApiKey = customGeminiApiKey || GEMINI_API_KEY;

  const cameraTarget = useMapStore(s => s.cameraTarget);
  const highlightedPlaceId = useMapStore(s => s.highlightedPlaceId);
  const setCameraTarget = useMapStore(s => s.setCameraTarget);
  const setHighlightedPlaceId = useMapStore(s => s.setHighlightedPlaceId);

  const selectedProvinceId = highlightedPlaceId || cameraTarget?.provinceId || undefined;

  const handleClosePopUp = () => {
    setShowPopUp(false);
  };

  const handleSelectProvince = (province: ProvinceMapItem | null) => {
    if (province) {
      setHighlightedPlaceId(province.id);
      setCameraTarget({ provinceId: province.id, region: province.region });
    } else {
      setHighlightedPlaceId(null);
      setCameraTarget(null);
    }
  };

  return (
    <LiveAPIProvider apiKey={activeGeminiApiKey}>
      <ErrorScreen />
      <Sidebar />
      {showPopUp && <PopUp onClose={handleClosePopUp} />}
      <div className={`streaming-console ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="console-panel">
          <StreamingConsole />
          <ControlTray />
        </div>
        <div className="map-panel flex flex-col items-center justify-center p-2 relative overflow-hidden bg-[#090e1a]">
          <VietnamMap
            selectedProvinceId={selectedProvinceId}
            onSelectProvince={handleSelectProvince}
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
    </LiveAPIProvider>
  );
}

export const VietnamMapAiScreen: React.FC = () => {
  const { theme } = useSettings();

  return (
    <div className={`map-ai-app ${theme === 'light' ? 'light-theme' : ''} w-full h-full relative overflow-hidden`}>
      <MapAiComponent />
    </div>
  );
};

export default VietnamMapAiScreen;
