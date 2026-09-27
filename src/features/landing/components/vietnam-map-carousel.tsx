import React from 'react';
import { VietnamMap } from '@/components/VietnamMap';
import { type ProvinceMapItem } from '@/data/vietnamMapData';
import { VIETNAM_LANDMARKS } from '@/data/landmarksData';

interface VietnamMapCarouselProps {
  activeIndex?: number;
  onSelectLandmark?: (index: number) => void;
  showRegionTabs?: boolean;
  showPoiInfoBox?: boolean;
}

export const VietnamMapCarousel: React.FC<VietnamMapCarouselProps> = ({
  activeIndex = 0,
  onSelectLandmark,
  showRegionTabs = false,
  showPoiInfoBox = false,
}) => {
  const safeIndex = Math.max(0, Math.min(activeIndex, VIETNAM_LANDMARKS.length - 1));
  const currentLandmark = VIETNAM_LANDMARKS[safeIndex] || VIETNAM_LANDMARKS[0];

  const handleSelectProvince = (prov: ProvinceMapItem | null) => {
    if (!prov || !onSelectLandmark) return;
    const foundIdx = VIETNAM_LANDMARKS.findIndex(
      (lm) =>
        lm.provinceId === prov.id ||
        prov.name.toLowerCase().includes(lm.name.toLowerCase()) ||
        lm.name.toLowerCase().includes(prov.name.toLowerCase())
    );
    if (foundIdx !== -1) {
      onSelectLandmark(foundIdx);
    }
  };

  return (
    <div className="relative w-full flex-1 flex flex-col items-center justify-center min-h-0 select-none">
      {/* 34-Province SVG Vector Vietnam Map */}
      <VietnamMap
        selectedProvinceId={currentLandmark.provinceId}
        onSelectProvince={handleSelectProvince}
        showRegionTabs={showRegionTabs}
        className="w-full h-full max-h-[540px] flex-1 min-h-0"
      />

      {/* Quick Landmark Info Box (Optional) */}
      {showPoiInfoBox && (
        <div className="mt-2 w-full text-center p-2.5 px-4 bg-[#122A22]/90 border border-[#D9B76A]/60 rounded-2xl shadow-xl backdrop-blur-md transition-all shrink-0">
          <div className="text-xs font-bold text-[#FCE5B5] tracking-wide uppercase flex items-center justify-center gap-1.5">
            <span>📍 {currentLandmark.name}</span>
          </div>
          <div className="text-xs text-white/80 mt-0.5 font-medium">
            {currentLandmark.desc || currentLandmark.subtitle}
          </div>
        </div>
      )}
    </div>
  );
};

export default VietnamMapCarousel;
