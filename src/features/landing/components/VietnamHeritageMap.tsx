import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Volume2, VolumeX, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@/context/ThemeContext';
import {
  HERITAGE_SITES,
  VIETNAM_MAP_DIMENSIONS,
  VIETNAM_SVG_PATHS,
} from '@/data/vietnamCultureData';
import type { CulturalHeritageSite } from '@/types/sampleTypes';
import { speakEnglish } from '@/utils/speechUtils';
import { getEnglishHeritageCopy } from '../lib/heritage-copy';

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
  onSelectRegion: _onSelectRegion,
  zoomLevel,
}) => {
  const { t } = useTranslation('landing');
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
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="var(--color-heritage-green)" floodOpacity={isDark ? 0.4 : 0.12} />
            </filter>
            <filter id="activePinGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="1" stdDeviation="3" floodColor="var(--color-antique-gold)" floodOpacity="0.8" />
            </filter>
          </defs>

          {/* 1. Regional S-shape Landmass Polygons */}
          <g id="vietnam-landmass">
            {/* Bac Bo (Northern Region) */}
            <path
              d={VIETNAM_SVG_PATHS.bacBo}
              fill={
                hoveredRegion === 'bacBo' || selectedRegion === 'Bắc Bộ'
                  ? isDark
                    ? '#1f4e43'
                    : '#e2efe9'
                  : isDark
                  ? '#163832'
                  : '#edf5f1'
              }
              stroke="var(--color-heritage-green)"
              strokeWidth="1.2"
              strokeLinejoin="round"
              className="transition-colors duration-300 cursor-pointer"
              onMouseEnter={() => setHoveredRegion('bacBo')}
              onMouseLeave={() => setHoveredRegion(null)}
            />

            {/* Trung Bo (Central Region) */}
            <path
              d={VIETNAM_SVG_PATHS.trungBo}
              fill={
                hoveredRegion === 'trungBo' || selectedRegion === 'Trung Bộ'
                  ? isDark
                    ? '#1f4e43'
                    : '#e2efe9'
                  : isDark
                  ? '#163832'
                  : '#edf5f1'
              }
              stroke="var(--color-heritage-green)"
              strokeWidth="1.2"
              strokeLinejoin="round"
              className="transition-colors duration-300 cursor-pointer"
              onMouseEnter={() => setHoveredRegion('trungBo')}
              onMouseLeave={() => setHoveredRegion(null)}
            />

            {/* Nam Bo (Southern Region) */}
            <path
              d={VIETNAM_SVG_PATHS.namBo}
              fill={
                hoveredRegion === 'namBo' || selectedRegion === 'Nam Bộ'
                  ? isDark
                    ? '#1f4e43'
                    : '#e2efe9'
                  : isDark
                  ? '#163832'
                  : '#edf5f1'
              }
              stroke="var(--color-heritage-green)"
              strokeWidth="1.2"
              strokeLinejoin="round"
              className="transition-colors duration-300 cursor-pointer"
              onMouseEnter={() => setHoveredRegion('namBo')}
              onMouseLeave={() => setHoveredRegion(null)}
            />
          </g>

          {/* 2. Maritime Islands */}
          <g id="maritime-islands">
            <path
              d={VIETNAM_SVG_PATHS.phuQuoc}
              fill={isDark ? '#163832' : '#edf5f1'}
              stroke="var(--color-heritage-green)"
              strokeWidth="1"
            />
            <path
              d={VIETNAM_SVG_PATHS.conDao}
              fill={isDark ? '#163832' : '#edf5f1'}
              stroke="var(--color-heritage-green)"
              strokeWidth="1"
            />
          </g>

          {/* 3. Cultural Heritage Site Interactive Markers */}
          <g id="heritage-markers">
            {filteredSites.map((site) => {
              const isSelected = activeSite?.id === site.id;
              const isHovered = hoveredSite?.id === site.id;

              return (
                <g
                  key={site.id}
                  transform={`translate(${site.x}, ${site.y})`}
                  className="cursor-pointer transition-transform duration-200"
                  onClick={() => handleSiteClick(site)}
                  onMouseEnter={() => setHoveredSite(site)}
                  onMouseLeave={() => setHoveredSite(null)}
                  role="button"
                  tabIndex={0}
                  aria-label={`${site.englishTitle} - ${site.province}`}
                >
                  {/* Pulsing ring for active or hovered pin */}
                  {(isSelected || isHovered) && (
                    <circle
                      r="14"
                      fill="none"
                      stroke="var(--color-antique-gold)"
                      strokeWidth="1.5"
                      opacity="0.8"
                      className="animate-ping"
                    />
                  )}

                  {/* Outer base glow pin */}
                  <circle
                    r={isSelected ? 9 : isHovered ? 7.5 : 5.5}
                    fill={
                      isSelected
                        ? 'var(--color-antique-gold)'
                        : isHovered
                        ? 'var(--color-terracotta)'
                        : 'var(--color-heritage-green)'
                    }
                    stroke="#FFFFFF"
                    strokeWidth={isSelected ? '2.5' : '1.5'}
                    filter={isSelected ? 'url(#activePinGlow)' : 'url(#softGlow)'}
                    className="transition-all duration-200"
                  />

                  {/* Inner center dot */}
                  <circle
                    r={isSelected ? 3.5 : 2}
                    fill={isSelected ? '#102B26' : '#FFFFFF'}
                  />
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Floating Tooltip when hovering over a site pin (Desktop only) */}
      <AnimatePresence>
        {hoveredSite && !activeSite && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="hidden sm:block absolute z-20 pointer-events-none bg-heritage-green/95 backdrop-blur-md text-warm-ivory px-4 py-2.5 rounded-2xl shadow-xl border border-antique-gold/40 max-w-[240px] space-y-1"
            style={{
              left: Math.min(Math.max(hoveredSite.x + 30, 20), 400),
              top: Math.min(Math.max(hoveredSite.y - 40, 20), 500),
            }}
          >
            <p className="text-xs font-serif font-bold text-warm-ivory line-clamp-1">
              {hoveredSite.englishTitle}
            </p>
            <p className="text-[11px] text-sky-mist line-clamp-1 italic">
              {t('vietnam_map.vietnamese_label', { name: hoveredSite.name })}
            </p>
            <div className="flex items-center justify-between text-[10px] text-antique-gold pt-0.5">
              <span>{getEnglishHeritageCopy(hoveredSite).category}</span>
              <span className="font-mono font-semibold">{hoveredSite.cefrLevel}</span>
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
                <div className="flex items-center gap-2 text-xs font-semibold text-mountain-teal dark:text-horizon-blue">
                  <span>{getEnglishHeritageCopy(activeSite).region}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-antique-gold font-bold">{getEnglishHeritageCopy(activeSite).category}</span>
                </div>
                <h3 className="font-display text-2xl text-heritage-green dark:text-warm-ivory font-normal leading-tight">
                  {activeSite.englishTitle}
                </h3>
                <p className="text-xs font-medium text-heritage-green/70 dark:text-horizon-blue italic">
                  {t('vietnam_map.vietnamese_label', { name: activeSite.name })}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setInternalSelectedSite(null);
                  if (onSelectSite) onSelectSite(null);
                }}
                className="p-1.5 rounded-full hover:bg-mist-cloud dark:hover:bg-heritage-green text-heritage-green dark:text-warm-ivory transition-colors cursor-pointer focus-ring"
                aria-label={t('vietnam_map.close_panel')}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cultural Insight Paragraph */}
            <div className="space-y-1.5 text-xs sm:text-sm text-heritage-green/85 dark:text-warm-ivory/85 font-light leading-relaxed">
              <p>{getEnglishHeritageCopy(activeSite).culturalInsight}</p>
            </div>

            {/* Model Presentation Snippet with Audio Button */}
            <div className="p-4 rounded-2xl bg-sky-mist/40 dark:bg-[#102B26]/80 border border-horizon-blue/60 dark:border-heritage-green space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-heritage-green dark:text-antique-gold uppercase tracking-wide flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-antique-gold" />
                  <span>{t('vietnam_map.sample_presentation')}</span>
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
                    <span>{t('vietnam_map.playing_sample')}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{t('vietnam_map.listen_sample')}</span>
                  </>
                )}
              </button>
            </div>

            {/* Core Cultural Collocations List */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-heritage-green dark:text-antique-gold">
                <span>{t('vietnam_map.featured_vocab')}</span>
                <span className="text-[11px] font-normal text-mountain-teal">{t('vietnam_map.tap_to_listen')}</span>
              </div>

              <div className="space-y-2">
                {getEnglishHeritageCopy(activeSite).vocabularyList.map((vocab, vIdx) => {
                  const itemKey = `${activeSite.id}-${vIdx}`;

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
                          title={t('vietnam_map.hear_word_title')}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-xs text-heritage-green/85 dark:text-warm-ivory/80">
                        {vocab.meaning}
                      </p>

                      <div className="text-[11px] text-mountain-teal dark:text-horizon-blue italic font-serif">
                        {t('vietnam_map.common_phrase', { phrase: vocab.collocation })}
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

export default VietnamHeritageMap;
