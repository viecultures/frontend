import React from 'react';
import {
  VIETNAM_ISLANDS,
  VIETNAM_34_PROVINCES,
  type ProvinceMapItem,
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

export const VietnamMap: React.FC<VietnamMapProps> = ({
  selectedProvinceId,
  onSelectProvince,
  className = '',
  showControls = true,
  showRegionTabs = true,
  showPoiPins = true,
  showSeaLayer = true,
  showLabels = true,
  children,
}) => {
  const {
    containerRef,
    activeRegion,
    setActiveRegion,
    currentViewBox,
    selectedProvinceId: activeId,
    hoveredProvince,
    setHoveredId,
    selectProvince,
    resetToAll,
    zoomScale,
    zoomIn,
    zoomOut,
    resetZoom,
    isDragging,
    transformStyle,
    containerProps,
  } = useVietnamMap({
    defaultSelectedId: selectedProvinceId,
    onSelectProvince,
  });

  const effectiveSelectedId =
    selectedProvinceId !== undefined ? selectedProvinceId : activeId;

  const hoveredSpecialty = hoveredProvince
    ? getProvinceSpecialty(hoveredProvince.id)
    : undefined;

  return (
    <div
      ref={containerRef}
      {...containerProps}
      onClick={() => resetToAll()}
      className={`relative flex flex-col items-center justify-between overflow-hidden select-none w-full h-full ${
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

      {/* 2. Floating Tooltip with Cultural Specialty on Hover */}
      <MapTooltip
        province={hoveredProvince || null}
        specialty={hoveredSpecialty}
      />

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
        className="w-full flex-1 min-h-0 flex items-center justify-center relative p-2"
      >
        <svg
          viewBox={currentViewBox}
          className="w-full h-full max-h-full filter drop-shadow-[0_14px_40px_rgba(0,0,0,0.7)] overflow-visible transition-all duration-500 ease-out"
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
              resetToAll();
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

          {/* Layer 3: Province Name Text Labels */}
          {showLabels && (
            <MapLabelsLayer
              provinces={VIETNAM_34_PROVINCES}
              selectedProvinceId={effectiveSelectedId}
              hoveredProvinceId={hoveredProvince?.id || null}
              activeRegion={activeRegion}
            />
          )}

          {/* Layer 4: POI Landmark Pins with Radar Pulsing Ring */}
          {showPoiPins && (
            <MapPoiLayer
              landmarks={VIETNAM_LANDMARKS}
              provinces={VIETNAM_34_PROVINCES}
              selectedProvinceId={effectiveSelectedId}
              activeRegion={activeRegion}
              onSelectLandmarkProvince={selectProvince}
            />
          )}
        </svg>
      </div>

      {/* 5. Custom Overlay Children (if provided) */}
      {children}
    </div>
  );
};

export default VietnamMap;
