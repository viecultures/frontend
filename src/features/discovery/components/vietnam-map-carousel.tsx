import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react';
import { VietnamMap } from '@/components/map/VietnamMap';
import { type ProvinceMapItem } from '@/data/vietnamMapData';
import { VIETNAM_LANDMARKS } from '@/data/landmarksData';

interface VietnamMapCarouselProps {
  activeIndex?: number;
  onSelectLandmark?: (index: number) => void;
  onSelectProvince?: (province: ProvinceMapItem | null) => void;
  showRegionTabs?: boolean;
  showPoiInfoBox?: boolean;
}

export const VietnamMapCarousel: React.FC<VietnamMapCarouselProps> = ({
  activeIndex = 0,
  onSelectLandmark,
  onSelectProvince,
  showRegionTabs = false,
  showPoiInfoBox = false,
}) => {
  const { i18n } = useTranslation('discovery');
  const isEn = i18n.language === 'en';
  const safeIndex = Math.max(0, Math.min(activeIndex, VIETNAM_LANDMARKS.length - 1));
  const currentLandmark = VIETNAM_LANDMARKS[safeIndex] || VIETNAM_LANDMARKS[0];

  // Start at national overview (null) to allow 2-stage user interaction
  const [selectedProvinceId, setSelectedProvinceId] = useState<string | null>(null);

  // Sync province selection only when activeIndex is changed explicitly from outside
  const prevIndexRef = React.useRef(activeIndex);
  useEffect(() => {
    if (prevIndexRef.current !== activeIndex) {
      prevIndexRef.current = activeIndex;
      if (currentLandmark?.provinceId) {
        setSelectedProvinceId(currentLandmark.provinceId);
      }
    }
  }, [activeIndex, currentLandmark?.provinceId]);

  const handleSelectProvince = (prov: ProvinceMapItem | null) => {
    onSelectProvince?.(prov);
    if (!prov) {
      setSelectedProvinceId(null);
      return;
    }

    // Set focused province
    setSelectedProvinceId(prov.id);

    if (onSelectLandmark) {
      const foundIdx = VIETNAM_LANDMARKS.findIndex(
        (lm) =>
          lm.provinceId === prov.id ||
          prov.id.includes(lm.provinceId) ||
          lm.provinceId.includes(prov.id) ||
          prov.name.toLowerCase().includes(lm.name.toLowerCase()) ||
          lm.name.toLowerCase().includes(prov.name.toLowerCase())
      );
      if (foundIdx !== -1) {
        prevIndexRef.current = foundIdx;
        onSelectLandmark(foundIdx);
      }
    }
  };

  const handleSelectLandmarkPoi = (lm: { id: string }, province: ProvinceMapItem) => {
    const foundIdx = VIETNAM_LANDMARKS.findIndex((l) => l.id === lm.id);
    if (foundIdx !== -1) {
      prevIndexRef.current = foundIdx;
      onSelectLandmark?.(foundIdx);
      const target = VIETNAM_LANDMARKS[foundIdx];
      setSelectedProvinceId(target.provinceId);
      onSelectProvince?.(province);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center min-h-0 select-none overflow-hidden">
      {/* 34-Province SVG Vector Vietnam Map */}
      <VietnamMap
        selectedProvinceId={selectedProvinceId}
        onSelectProvince={handleSelectProvince}
        onSelectLandmark={handleSelectLandmarkPoi}
        showRegionTabs={showRegionTabs}
        showTooltip={true}
        labelLanguage={isEn ? 'en' : 'vi'}
        className="w-full h-full flex-1 min-h-0"
      />

      {/* Quick Landmark Info Box (Optional) */}
      {showPoiInfoBox && (
        <div className="mt-2 w-full text-center p-2.5 px-4 bg-heritage-forest/90 border border-antique-gold/60 rounded-2xl shadow-xl backdrop-blur-md transition-all shrink-0">
          <div className="text-xs font-bold text-antique-bright tracking-wide uppercase flex items-center justify-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-antique-gold" />
            <span>{isEn ? (currentLandmark.title || currentLandmark.name) : currentLandmark.name}</span>
          </div>
          <div className="text-xs text-white/80 mt-0.5 font-medium">
            {isEn ? (currentLandmark.subtitle || currentLandmark.desc) : (currentLandmark.desc || currentLandmark.subtitle)}
          </div>
        </div>
      )}
    </div>
  );
};

export default VietnamMapCarousel;