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
  showControls = false,
  showRegionTabs = true,
  showPoiPins = true,
  showSeaLayer = true,
  showLabels = true,
  overviewByRegion = false,
  selectableRegions,
  labelLanguage = 'vi',
  showTooltip = false,
  markers = [],
  onSelectMarker,
  customViewBox,
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
      className={`vc-map relative flex flex-col items-center justify-between overflow-hidden select-none w-full h-full touch-none ${
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
          viewBox={customViewBox || currentViewBox}
          preserveAspectRatio="xMidYMid meet"
          className="vc-map-svg w-full h-full max-h-full max-w-full object-contain transition-all duration-500 ease-out"
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
            overviewByRegion={overviewByRegion}
            selectableRegions={selectableRegions}
            onSelectRegion={setActiveRegion}
          />

          {/* Layer 2: Maritime Sovereignty (Hoàng Sa & Trường Sa, Biển Đông) */}
          {showSeaLayer && <MapSeaLayer islands={VIETNAM_ISLANDS} labelLanguage={labelLanguage} />}

          {/* Layer 3: Province Name Text Labels with LOD */}
          {showLabels && (
            <MapLabelsLayer
              provinces={VIETNAM_34_PROVINCES}
              selectedProvinceId={effectiveSelectedId}
              hoveredProvinceId={hoveredProvince?.id || null}
              activeRegion={activeRegion}
              zoomScale={zoomScale}
              labelLanguage={labelLanguage}
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

          {/* 5. Custom Overlay SVG Children (Pill markers, lock nodes, etc.) */}
          {children}
        </svg>
      </div>
    </div>
  );
};

export default VietnamMap;
