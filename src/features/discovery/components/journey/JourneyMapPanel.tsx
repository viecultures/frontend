import type { RefObject } from "react";
import { ArrowLeft, MapPin } from "lucide-react";
import { VietnamMap } from "@/components/map/VietnamMap";
import { Button } from "@/components/ui/button";
import { VIETNAM_34_PROVINCES } from "@/data/vietnamMapData";
import type { RegionKey } from "@/utils/useVietnamMap";

interface JourneyMapPanelProps {
  panelRef: RefObject<HTMLElement | null>;
  title: string;
  selectedRegion: RegionKey;
  regionName?: string;
  regionNumber?: string;
  selectedProvince?: (typeof VIETNAM_34_PROVINCES)[number];
  isEn: boolean;
  getLocalizedProvinceName: (name: string) => string;
  labels: {
    allRegions: string;
    exploreThreeRegions: string;
    choosePlace: string;
    chooseRegion: string;
    clearPlace: string;
  };
  onSelectRegion: (region: RegionKey) => void;
  onSelectPlace: (id: string) => void;
}

export function JourneyMapPanel({
  panelRef,
  title,
  selectedRegion,
  regionName,
  regionNumber,
  selectedProvince,
  isEn,
  getLocalizedProvinceName,
  labels,
  onSelectRegion,
  onSelectPlace,
}: JourneyMapPanelProps) {
  const hasSelectedRegion = Boolean(regionName);

  return (
    <section ref={panelRef} className="journey-map-panel" aria-label={title}>
      <div className="journey-map-heading">
        <div>
          {hasSelectedRegion && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onSelectRegion("all")}
            >
              <ArrowLeft size={17} /> {labels.allRegions}
            </Button>
          )}
          <span>
            {hasSelectedRegion
              ? `${regionNumber} / ${regionName?.toUpperCase()}`
              : labels.exploreThreeRegions}
          </span>
        </div>
        <strong>{hasSelectedRegion ? labels.choosePlace : labels.chooseRegion}</strong>
      </div>
      <div className="journey-map" data-map-level={hasSelectedRegion ? "provinces" : "regions"}>
        <VietnamMap
          activeRegion={selectedRegion}
          customViewBox={selectedRegion === "all" ? "100 30 790 920" : undefined}
          fillSeaBackground={selectedRegion === "all"}
          overviewByRegion={!hasSelectedRegion}
          selectableRegions={["north"]}
          labelLanguage={isEn ? "en" : "vi"}
          selectedProvinceId={selectedProvince?.id || null}
          onSelectRegion={onSelectRegion}
          onSelectProvince={(province) => {
            if (province) onSelectPlace(province.id);
          }}
          showRegionTabs={false}
          showPoiPins={false}
          showTooltip={false}
          showLabels={hasSelectedRegion}
          showControls={hasSelectedRegion}
        />
      </div>
      {selectedProvince && (
        <div className="journey-selected-place">
          <MapPin size={18} />
          <span>{getLocalizedProvinceName(selectedProvince.name)}</span>
          <button type="button" onClick={() => onSelectPlace("")}>
            {labels.clearPlace}
          </button>
        </div>
      )}
    </section>
  );
}
