import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Volume2, VolumeX, Sparkles, MapPin, Award, BookOpen } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import {
  HERITAGE_SITES,
  VIETNAM_MAP_DIMENSIONS,
  VIETNAM_SVG_PATHS,
} from '@/data/vietnamCultureData';
import type { CulturalHeritageSite } from '@/types/sampleTypes';
import { speakEnglish } from '@/utils/sampleSpeech';

interface VietnamHeritageMapProps {
  selectedSiteId?: string | null;
  onSelectSite?: (site: CulturalHeritageSite | null) => void;
  selectedRegion?: string | null;
  onSelectRegion?: (region: string | null) => void;
  zoomLevel: number;
}

export const VietnamHeritageMap: React.FC<VietnamHeritageMapProps> = ({
  selectedSiteId,
  onSelectSite,
  selectedRegion,
  onSelectRegion,
  zoomLevel,
}) => {
  const { isDark } = useTheme();
  const [internalSelectedSite, setInternalSelectedSite] = useState<CulturalHeritageSite | null>(
    selectedSiteId ? HERITAGE_SITES.find((s) => s.id === selectedSiteId) || null : null
  );
  const [hoveredSite, setHoveredSite] = useState<CulturalHeritageSite | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [playingWord, setPlayingWord] = useState<string | null>(null);

  const activeSite = useMemo(() => {
    if (selectedSiteId) {
      return HERITAGE_SITES.find((s) => s.id === selectedSiteId) || null;
    }
    return internalSelectedSite;
  }, [selectedSiteId, internalSelectedSite]);

  // Filtered sites based on region
  const filteredSites = useMemo(() => {
    if (!selectedRegion) return HERITAGE_SITES;
    return HERITAGE_SITES.filter((site) => site.region === selectedRegion);
  }, [selectedRegion]);

  const handleSiteClick = (site: CulturalHeritageSite) => {
    if (activeSite?.id === site.id) {
      setInternalSelectedSite(null);
      if (onSelectSite) onSelectSite(null);
    } else {
      setInternalSelectedSite(site);
      if (onSelectSite) onSelectSite(site);
    }
  };

  const handlePlaySpeech = (text: string, wordId: string) => {
    if (playingWord === wordId) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setPlayingWord(null);
    } else {
      setPlayingWord(wordId);
      speakEnglish(text, () => setPlayingWord(null));
    }
  };

  return (
    <div className="relative w-full h-[580px] sm:h-[660px] lg:h-[720px] bg-warm-ivory dark:bg-[#102B26] overflow-hidden select-none px-2 sm:px-4 transition-colors duration-300">
      {/* S-shaped Map SVG Viewport */}
      <div
        className="w-full h-full flex items-center justify-center transition-transform duration-300 ease-out origin-center"
        style={{
          transform: `scale(${zoomLevel})`,
        }}
      >
        <svg
          viewBox={VIETNAM_MAP_DIMENSIONS.viewBox}
          className="w-full h-full max-h-[96%]"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#1E4B43" floodOpacity={isDark ? 0.4 : 0.12} />
            </filter>
            <filter id="activePinGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="1" stdDeviation="3" floodColor="#D9B76A" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* 1. Regional S-shape Landmass Polygons */}
          <g id="vietnam-landmass">
            {/* Bac Bo (Northern Region) */}
            <path
              d={VIETNAM_SVG_PATHS.bacBo}
              fill={
                selectedRegion === 'Bắc Bộ' || hoveredRegion === 'Bắc Bộ'
                  ? isDark ? '#1C4B43' : '#9FCED8'
                  : isDark ? '#153A33' : '#BFE3EA'
              }
              stroke={isDark ? '#D9B76A' : '#1E4B43'}
              strokeWidth={selectedRegion === 'Bắc Bộ' ? 2 : 1.2}
              strokeLinejoin="round"
              className="cursor-pointer transition-colors duration-200"
              filter="url(#softGlow)"
              onClick={() => onSelectRegion && onSelectRegion(selectedRegion === 'Bắc Bộ' ? null : 'Bắc Bộ')}
              onMouseEnter={() => setHoveredRegion('Bắc Bộ')}
              onMouseLeave={() => setHoveredRegion(null)}
            />

            {/* Trung Bo (Central Region) */}
            <path
              d={VIETNAM_SVG_PATHS.trungBo}
              fill={
                selectedRegion === 'Trung Bộ' || hoveredRegion === 'Trung Bộ'
                  ? isDark ? '#1C4B43' : '#9FCED8'
                  : isDark ? '#153A33' : '#BFE3EA'
              }
              stroke={isDark ? '#D9B76A' : '#1E4B43'}
              strokeWidth={selectedRegion === 'Trung Bộ' ? 2 : 1.2}
              strokeLinejoin="round"
              className="cursor-pointer transition-colors duration-200"
              filter="url(#softGlow)"
              onClick={() => onSelectRegion && onSelectRegion(selectedRegion === 'Trung Bộ' ? null : 'Trung Bộ')}
              onMouseEnter={() => setHoveredRegion('Trung Bộ')}
              onMouseLeave={() => setHoveredRegion(null)}
            />

            {/* Nam Bo (Southern Region) */}
            <path
              d={VIETNAM_SVG_PATHS.namBo}
              fill={
                selectedRegion === 'Nam Bộ' || hoveredRegion === 'Nam Bộ'
                  ? isDark ? '#1C4B43' : '#9FCED8'
                  : isDark ? '#153A33' : '#BFE3EA'
              }
              stroke={isDark ? '#D9B76A' : '#1E4B43'}
              strokeWidth={selectedRegion === 'Nam Bộ' ? 2 : 1.2}
              strokeLinejoin="round"
              className="cursor-pointer transition-colors duration-200"
              filter="url(#softGlow)"
              onClick={() => onSelectRegion && onSelectRegion(selectedRegion === 'Nam Bộ' ? null : 'Nam Bộ')}
              onMouseEnter={() => setHoveredRegion('Nam Bộ')}
              onMouseLeave={() => setHoveredRegion(null)}
            />
          </g>

          {/* 2. Red River & Mekong Estuary Ribbons */}
          <g id="river-systems" className="pointer-events-none select-none">
            <path
              d={VIETNAM_SVG_PATHS.songHong}
              fill="none"
              stroke={isDark ? '#9FCED8' : '#6E9FA1'}
              strokeWidth="2.5"
              strokeLinecap="round"
              className="opacity-70"
            />
            <path
              d={VIETNAM_SVG_PATHS.songMeKong}
              fill="none"
              stroke={isDark ? '#9FCED8' : '#6E9FA1'}
              strokeWidth="2.5"
              strokeLinecap="round"
              className="opacity-70"
            />
          </g>

          {/* 3. Sacred Island Territories */}
          <g id="islands" className="select-none">
            {/* Hoang Sa (Paracels) */}
            <g className="cursor-pointer group">
              <path
                d={VIETNAM_SVG_PATHS.hoangSa}
                fill="#D9B76A"
                stroke="#1E4B43"
                strokeWidth="0.8"
              />
              <text
                x="355"
                y="306"
                textAnchor="middle"
                className="text-[7.5px] font-semibold fill-heritage-green dark:fill-antique-gold tracking-wider select-none"
              >
                Q.Đ HOÀNG SA
              </text>
            </g>

            {/* Truong Sa (Spratlys) */}
            <g className="cursor-pointer group">
              <path
                d={VIETNAM_SVG_PATHS.truongSa}
                fill="#D9B76A"
                stroke="#1E4B43"
                strokeWidth="0.8"
              />
              <text
                x="350"
                y="570"
                textAnchor="middle"
                className="text-[7.5px] font-semibold fill-heritage-green dark:fill-antique-gold tracking-wider select-none"
              >
                Q.Đ TRƯỜNG SA
              </text>
            </g>

            {/* Phu Quoc */}
            <path
              d={VIETNAM_SVG_PATHS.phuQuoc}
              fill="#D9B76A"
              stroke="#1E4B43"
              strokeWidth="0.8"
            />
            <text
              x="138"
              y="635"
              textAnchor="middle"
              className="text-[6.5px] font-medium fill-heritage-green dark:fill-antique-gold"
            >
              Phú Quốc
            </text>

            {/* Con Dao */}
            <path
              d={VIETNAM_SVG_PATHS.conDao}
              fill="#D9B76A"
              stroke="#1E4B43"
              strokeWidth="0.8"
            />
          </g>

          {/* 4. Region Watermark Labels (Pointer events none) */}
          <g id="region-labels" className="pointer-events-none select-none">
            <text
              x="195"
              y="95"
              textAnchor="middle"
              className="text-[8px] font-semibold tracking-widest uppercase fill-heritage-green/70 dark:fill-warm-ivory/60"
            >
              BẮC BỘ
            </text>
            <text
              x="235"
              y="340"
              textAnchor="middle"
              className="text-[8px] font-semibold tracking-widest uppercase fill-heritage-green/70 dark:fill-warm-ivory/60"
            >
              TRUNG BỘ
            </text>
            <text
              x="235"
              y="595"
              textAnchor="middle"
              className="text-[8px] font-semibold tracking-widest uppercase fill-heritage-green/70 dark:fill-warm-ivory/60"
            >
              NAM BỘ
            </text>
          </g>

          {/* 5. Cultural Heritage Site Pins */}
          <g id="heritage-pins">
            {filteredSites.map((site) => {
              const isSelected = activeSite?.id === site.id;
              const isHovered = hoveredSite?.id === site.id;

              return (
                <g
                  key={site.id}
                  transform={`translate(${site.x}, ${site.y})`}
                  className="cursor-pointer group"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSiteClick(site);
                  }}
                  onMouseEnter={() => setHoveredSite(site)}
                  onMouseLeave={() => setHoveredSite(null)}
                >
                  {/* Outer Pulsing Selection Ring */}
                  {isSelected && (
                    <circle
                      r={11}
                      fill="none"
                      stroke="#D9B76A"
                      strokeWidth="1.8"
                      strokeDasharray="2 2"
                      className="animate-spin"
                      style={{ animationDuration: '6s' }}
                    />
                  )}

                  {/* Main Pin Outer Marker */}
                  <circle
                    r={isSelected ? 6.5 : isHovered ? 5.8 : 4.5}
                    fill={isSelected ? '#1E4B43' : isHovered ? '#1E4B43' : '#D9B76A'}
                    stroke={isSelected ? '#D9B76A' : '#FBF7EE'}
                    strokeWidth="1.5"
                    filter={isSelected ? 'url(#activePinGlow)' : undefined}
                    className="transition-all duration-200"
                  />

                  {/* Center Dot */}
                  <circle
                    r={isSelected ? 2.2 : 1.6}
                    fill={isSelected ? '#D9B76A' : '#1E4B43'}
                    className="pointer-events-none"
                  />

                  {/* Inline Short Label beside pin */}
                  <text
                    x={site.x > 240 ? -8 : 8}
                    y={3}
                    textAnchor={site.x > 240 ? 'end' : 'start'}
                    className={`text-[8.5px] font-semibold tracking-tight transition-colors select-none ${
                      isSelected
                        ? 'fill-heritage-green dark:fill-antique-gold font-bold'
                        : isHovered
                        ? 'fill-heritage-green dark:fill-warm-ivory'
                        : 'fill-heritage-green/85 dark:fill-warm-ivory/80'
                    }`}
                  >
                    {site.name.split('–')[0].trim()}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Hover Tooltip (Percentage positioning) */}
      <AnimatePresence>
        {hoveredSite && !activeSite && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute pointer-events-none z-30 bg-heritage-green text-warm-ivory px-3.5 py-2.5 rounded-2xl text-xs shadow-xl space-y-1 border border-antique-gold/40 max-w-[220px]"
            style={{
              left: `${(hoveredSite.x / VIETNAM_MAP_DIMENSIONS.width) * 100}%`,
              top: `${(hoveredSite.y / VIETNAM_MAP_DIMENSIONS.height) * 100}%`,
              transform: 'translate(-50%, -125%)',
            }}
          >
            <div className="font-semibold text-sm text-warm-ivory">
              {hoveredSite.name}
            </div>
            <p className="text-[11px] text-sky-mist line-clamp-1 italic">
              {hoveredSite.englishTitle}
            </p>
            <div className="flex items-center justify-between text-[10px] text-antique-gold pt-0.5">
              <span>{hoveredSite.category}</span>
              <span className="font-mono font-semibold">{hoveredSite.cefrLevel} Level</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Detailed Heritage Card (Slides from Right) */}
      <AnimatePresence>
        {activeSite && (
          <motion.div
            initial={{ opacity: 0, x: 25, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 25, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="absolute top-4 right-4 max-h-[92%] w-[92%] sm:w-[380px] z-30 bg-warm-ivory/95 dark:bg-[#143731]/95 backdrop-blur-md rounded-3xl border border-antique-gold/50 shadow-2xl p-5 sm:p-6 overflow-y-auto flex flex-col space-y-5 text-heritage-green dark:text-warm-ivory"
          >
            {/* Header & Close Button */}
            <div className="flex items-start justify-between gap-3 border-b border-mist-cloud dark:border-heritage-green pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-mountain-teal dark:text-[#9FCED8]">
                  <span>{activeSite.region}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-antique-gold font-bold">{activeSite.category}</span>
                </div>
                <h3 className="font-display text-2xl text-heritage-green dark:text-warm-ivory font-normal leading-tight">
                  {activeSite.name}
                </h3>
                <p className="text-xs font-medium text-heritage-green/70 dark:text-[#9FCED8] italic">
                  {activeSite.englishTitle}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setInternalSelectedSite(null);
                  if (onSelectSite) onSelectSite(null);
                }}
                className="p-1.5 rounded-full hover:bg-mist-cloud dark:hover:bg-heritage-green text-heritage-green dark:text-warm-ivory transition-colors cursor-pointer focus-ring"
                aria-label="Đóng bảng chi tiết"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cultural Insight Paragraph */}
            <div className="space-y-1.5 text-xs sm:text-sm text-heritage-green/85 dark:text-warm-ivory/85 font-light leading-relaxed">
              <p>{activeSite.culturalInsight}</p>
            </div>

            {/* Model Presentation Snippet with Audio Button */}
            <div className="p-4 rounded-2xl bg-sky-mist/40 dark:bg-[#102B26]/80 border border-[#9FCED8]/60 dark:border-heritage-green space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-heritage-green dark:text-antique-gold uppercase tracking-wide flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-antique-gold" />
                  <span>Mẫu Thuyết Trình Quốc Tế</span>
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-antique-gold/20 text-heritage-green dark:text-antique-gold font-semibold">
                  {activeSite.cefrLevel}
                </span>
              </div>

              <p className="text-xs font-serif italic text-heritage-green dark:text-warm-ivory leading-relaxed">
                &ldquo;{activeSite.presentationSnippet}&rdquo;
              </p>

              <button
                type="button"
                onClick={() => handlePlaySpeech(activeSite.presentationSnippet, activeSite.id)}
                className="w-full py-2.5 px-3 rounded-xl bg-heritage-green hover:bg-[#163832] text-warm-ivory dark:bg-antique-gold dark:hover:bg-[#c6a355] dark:text-[#102B26] text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer focus-ring"
              >
                {playingWord === activeSite.id ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5" />
                    <span>Đang phát âm mẫu... (Dừng)</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Luyện nghe phát âm chuẩn câu này</span>
                  </>
                )}
              </button>
            </div>

            {/* Core Cultural Collocations List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-heritage-green dark:text-antique-gold">
                <span>TỪ VỰNG & COLLOCATION BẢN SẮC</span>
                <span className="text-[11px] font-normal text-mountain-teal">Chạm vào để nghe</span>
              </div>

              <div className="space-y-2">
                {activeSite.vocabularyList.map((vocab, vIdx) => {
                  const itemKey = `${activeSite.id}-${vIdx}`;
                  const isItemPlaying = playingWord === itemKey;

                  return (
                    <div
                      key={vocab.word}
                      className="p-3 rounded-xl bg-white/70 dark:bg-[#102B26]/60 border border-mist-cloud dark:border-heritage-green/50 flex flex-col space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <span className="text-sm font-semibold text-heritage-green dark:text-antique-gold">
                            {vocab.word}
                          </span>
                          <span className="text-xs text-mountain-teal block font-mono">
                            {vocab.ipa}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handlePlaySpeech(vocab.word, itemKey)}
                          className="p-1.5 rounded-lg bg-sky-mist/50 dark:bg-heritage-green hover:bg-sky-mist text-heritage-green dark:text-antique-gold transition-colors cursor-pointer focus-ring"
                          title="Nghe phát âm từ này"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-xs text-heritage-green/85 dark:text-warm-ivory/80">
                        {vocab.meaning}
                      </p>

                      <div className="text-[11px] text-mountain-teal dark:text-[#9FCED8] italic font-serif">
                        &bull; Collocation: {vocab.collocation}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
