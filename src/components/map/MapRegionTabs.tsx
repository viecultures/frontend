import React from 'react';
import type { MapRegionTabsProps } from './types';
import { DEFAULT_REGION_TABS } from './constants';

export const MapRegionTabs: React.FC<MapRegionTabsProps> = ({
  activeRegion,
  onSelectRegion,
  tabs = DEFAULT_REGION_TABS,
  className = '',
}) => {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`vc-map-region-bar w-full z-30 flex items-center justify-center p-2 border-b shrink-0 ${className}`}
    >
      <div
        role="tablist"
        aria-label="Choose a map region"
        className="vc-map-region-tabs flex items-center gap-1.5 border p-1 rounded-2xl"
      >
        {tabs.map((tab) => {
          const isActive = activeRegion === tab.key;
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={isActive}
              aria-controls="vietnam-map-viewport"
              onClick={(e) => {
                e.stopPropagation();
                onSelectRegion(tab.key);
              }}
              className={`vc-map-region-tab px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${isActive ? (tab.activeClass ?? '') : ''}`}
            >
              <span>{tab.label}</span>
              <span
                className={`vc-map-region-count text-[9.5px] px-1.5 py-0.2 rounded-full ${isActive ? '' : (tab.badgeClass ?? '')}`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MapRegionTabs;
