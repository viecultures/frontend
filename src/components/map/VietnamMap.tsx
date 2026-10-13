import React from 'react';
import {
  VIETNAM_ISLANDS,
  VIETNAM_34_PROVINCES,
} from '@/data/vietnamMapData';
import { VIETNAM_LANDMARKS } from '@/data/landmarksData';
import { useVietnamMap } from '@/utils/useVietnamMap';
import { getProvinceSpecialty } from '@/utils/vietnamMapUtils';

import type { VietnamMapProps } from './types';
import { MapRegionTabs } from './MapRegionTabs';
import { MapTooltip } from './MapTooltip';
import { MapControls } from './MapControls';
import { MapProvincesLayer } from './MapProvincesLayer';
import { MapSeaLayer } from './MapSeaLayer';
import { MapLabelsLayer } from './MapLabelsLayer';
import { MapPoiLayer } from './MapPoiLayer';
import { MapAiMarkersLayer } from './MapAiMarkersLayer';

export const VietnamMap: React.FC<VietnamMapProps> = ({
  selectedProvinceId,
  defaultSelectedProvinceId,
  selectedLandmarkId,
  defaultSelectedLandmarkId,
  defaultRegion,
  onSelectProvince,
  activeRegion: controlledRegion,
  onSelectRegion,
  onSelectLandmark,
  className = '',
  showControls = true,
  showRegionTabs = true,
  showPoiPins = true,
  showSeaLayer = true,
  showLabels = true,
  showTooltip = false,
  markers = [],
  onSelectMarker,
  children,
}) => {
  const {
    containerRef,
    activeRegion,
    setActiveRegion,
    currentViewBox,
    selectedProvinceId: activeId,
    selectedLandmarkId: activeLandmarkId,
    selectLandmark,
    hoveredProvince,
    setHoveredId,
    selectProvince,
    focusProvince,
    handleBackdropClick,
    zoomScale,
    zoomIn,
    zoomOut,
    resetZoom,
    isDragging,
    transformStyle,
    containerProps,
  } = useVietnamMap({
    selectedProvinceId,
    selectedLandmarkId,
    defaultSelectedId: defaultSelectedProvinceId,
    defaultSelectedLandmarkId,
    defaultRegion,
    activeRegion: controlledRegion,
    onSelectProvince,
    onSelectRegion,
    onSelectLandmark,
  });

  const effectiveSelectedId = activeId;

  const hoveredSpecialty = hoveredProvince
    ? getProvinceSpecialty(hoveredProvince.id)
    : undefined;

  return (
    <div
      ref={containerRef}
      {...containerProps}
      onClick={() => handleBackdropClick()}
      className={`relative flex flex-col items-center justify-between overflow-hidden select-none w-full h-full touch-none ${
        zoomScale > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : ''
      } ${className}`}
    >
      {/* 1. Header: Region Tabs Bar */}
      {showRegionTabs && (
        <MapRegionTabs
          activeRegion={activeRegion}
          onSelectRegion={setActiveRegion}
        />
      )}

      {/* 2. Floating Tooltip with Cultural Specialty (Optional, disabled by default) */}
      {showTooltip && (
        <MapTooltip
          province={hoveredProvince || null}
          specialty={hoveredSpecialty}
        />
      )}

      {/* 3. Floating Zoom & Control Toolbar */}
      {showControls && (
        <MapControls
          zoomScale={zoomScale}
          activeRegion={activeRegion}
          selectedProvinceId={effectiveSelectedId}
          onZoomIn={zoomIn}
          onZoomOut={zoomOut}
          onResetZoom={resetZoom}
        />
      )}

      {/* 4. Vector Map SVG Viewport */}
      <div
        id="vietnam-map-viewport"
        style={transformStyle}
        className="w-full h-full flex-1 min-h-0 flex items-center justify-center relative p-1 overflow-hidden"
      >
        <svg
          viewBox={currentViewBox}
          preserveAspectRatio="xMidYMid meet"
          className="w-full h-full max-h-full max-w-full object-contain filter drop-shadow-[0_14px_40px_rgba(0,0,0,0.7)] transition-all duration-500 ease-out"
        >
          {/* Backdrop Rect to catch clicks outside provinces */}
          <rect
            x="-500"
            y="-500"
            width="2000"
            height="2500"
            fill="transparent"
            onClick={(e) => {
              e.stopPropagation();
              handleBackdropClick();
            }}
          />

          {/* Layer 1: 34 Vector Provinces */}
          <MapProvincesLayer
            provinces={VIETNAM_34_PROVINCES}
            selectedProvinceId={effectiveSelectedId}
            hoveredProvinceId={hoveredProvince?.id || null}
            activeRegion={activeRegion}
            onSelectProvince={selectProvince}
            onHoverProvince={setHoveredId}
          />

          {/* Layer 2: Maritime Sovereignty (Hoàng Sa & Trường Sa, Biển Đông) */}
          {showSeaLayer && <MapSeaLayer islands={VIETNAM_ISLANDS} />}

          {/* Layer 3: Province Name Text Labels with LOD */}
          {showLabels && (
            <MapLabelsLayer
              provinces={VIETNAM_34_PROVINCES}
              selectedProvinceId={effectiveSelectedId}
              hoveredProvinceId={hoveredProvince?.id || null}
              activeRegion={activeRegion}
              zoomScale={zoomScale}
            />
          )}

          {/* Layer 4: POI Landmark Pins with Radar Pulsing Ring */}
          {showPoiPins && (
            <MapPoiLayer
              landmarks={VIETNAM_LANDMARKS}
              provinces={VIETNAM_34_PROVINCES}
              selectedProvinceId={effectiveSelectedId}
              selectedLandmarkId={activeLandmarkId}
              hoveredProvinceId={hoveredProvince?.id || null}
              activeRegion={activeRegion}
              onSelectLandmarkProvince={focusProvince}
              onHoverLandmarkProvince={setHoveredId}
              onSelectLandmark={selectLandmark}
            />
          )}
          <MapAiMarkersLayer markers={markers} onSelectMarker={onSelectMarker} />
        </svg>
      </div>

      {/* 5. Custom Overlay Children (if provided) */}
      {children}
    </div>
  );
};

export default VietnamMap;
