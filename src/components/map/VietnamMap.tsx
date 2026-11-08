import React from 'react';
import { useTranslation } from 'react-i18next';
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
import { MapNeighborsLayer } from './MapNeighborsLayer';
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
  showNeighbors = true,
  showLabels = true,
  overviewByRegion = false,
  selectableRegions,
  labelLanguage,
  showTooltip = false,
  markers = [],
  onSelectMarker,
  customViewBox,
  fillSeaBackground = false,
  enableZoomPan = true,
  showRegionLabels = true,
  children,
}) => {
  const { i18n } = useTranslation('common');
  const effectiveLabelLanguage = labelLanguage ??
    ((i18n.resolvedLanguage ?? i18n.language).startsWith('en') ? 'en' : 'vi');
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
    viewBoxOverride: customViewBox,
    maxScale: enableZoomPan ? 2.5 : 1,
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
          viewBox={currentViewBox}
          preserveAspectRatio="xMidYMid meet"
          className="vc-map-svg w-full h-full max-h-full max-w-full object-contain transition-all duration-500 ease-out"
        >
          {/* Backdrop Rect to catch clicks outside provinces */}
          <rect
            x="-500"
            y="-500"
            width="2000"
            height="2500"
            fill={fillSeaBackground ? 'var(--journey-map-sea)' : 'transparent'}
            onClick={(e) => {
              e.stopPropagation();
              handleBackdropClick();
            }}
          />

          {fillSeaBackground && (
            <g id="journey-western-land-fill" fill="var(--journey-map-land)" pointerEvents="none" aria-hidden="true">
              <rect x="-500" y="30" width="600" height="260" />
              <path d="M-500 550 H-20 C15 580 30 620 20 670 C10 720 -5 750 -40 765 H-500 Z" />
            </g>
          )}

          {/* Layer 0: Neighboring Countries (China, Laos, Cambodia, Thailand) */}
          {showNeighbors && <MapNeighborsLayer />}

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
            labelLanguage={effectiveLabelLanguage}
            showRegionLabels={showRegionLabels}
          />

          {/* Layer 2: Maritime Sovereignty (Hoàng Sa & Trường Sa, Biển Đông) */}
          {showSeaLayer && <MapSeaLayer islands={VIETNAM_ISLANDS} labelLanguage={effectiveLabelLanguage} />}

          {/* Layer 3: Province Name Text Labels with LOD */}
          {showLabels && (
            <MapLabelsLayer
              provinces={VIETNAM_34_PROVINCES}
              selectedProvinceId={effectiveSelectedId}
              hoveredProvinceId={hoveredProvince?.id || null}
              activeRegion={activeRegion}
              zoomScale={zoomScale}
              labelLanguage={effectiveLabelLanguage}
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
