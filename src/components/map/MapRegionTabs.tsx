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
      className={`w-full z-30 flex items-center justify-center p-2 bg-heritage-forest/90 border-b border-antique-gold/30 backdrop-blur-md shrink-0 ${className}`}
    >
      <div
        role="tablist"
        aria-label="Chọn vùng miền trên bản đồ"
        className="flex items-center gap-1.5 bg-heritage-forest border border-antique-gold/40 p-1 rounded-2xl shadow-lg"
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
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 focus-ring-dark ${
                isActive
                  ? tab.activeClass
                  : 'text-warm-ivory/70 hover:text-warm-ivory hover:bg-white/10'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[9.5px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-black/25 text-white' : tab.badgeClass
                }`}
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
