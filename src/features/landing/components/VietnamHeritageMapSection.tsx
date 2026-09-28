import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  MapPin,
  BarChart3,
  Compass,
  Sparkles,
  Volume2,
  VolumeX,
  BookOpen,
  Award
} from 'lucide-react';
import { VietnamMap } from '@/components/VietnamMap';
import type { ProvinceMapItem } from '@/data/vietnamMapData';
import { HERITAGE_SITES, REGIONS_DATA } from '@/data/vietnamCultureData';
import type { CulturalHeritageSite } from '@/types/sampleTypes';
import { speakEnglish } from '@/utils/sampleSpeech';

export const VietnamHeritageMapSection: React.FC = () => {
  const [selectedSite, setSelectedSite] = useState<CulturalHeritageSite | null>(
    HERITAGE_SITES[0] || null
  );
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [activeRegionIndex, setActiveRegionIndex] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const activeRegionInList = REGIONS_DATA[activeRegionIndex] || REGIONS_DATA[0];

  const handlePlayAudio = (phrase: string) => {
    if (isPlayingAudio) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      speakEnglish(phrase, () => setIsPlayingAudio(false));
    }
  };

  const handleSelectRegionFromList = (idx: number) => {
    setActiveRegionIndex(idx);
    const reg = REGIONS_DATA[idx];
    if (reg) {
      const regionFilter = reg.id === 'bac-bo' ? 'Bắc Bộ' : reg.id === 'trung-bo' ? 'Trung Bộ' : 'Nam Bộ';
      setSelectedRegion(regionFilter);
    }
  };

  const handleViewRegionOnMap = (regionName: string) => {
    setSelectedRegion(regionName);
    setViewMode('map');
  };

  return (
    <section
      id="ban-do-di-san"
      className="relative py-16 px-4 sm:px-8 lg:px-12 flex flex-col justify-center border-t border-line bg-surface text-heritage-green transition-colors duration-300 vn-pattern-bg"
    >
      <div className="max-w-7xl mx-auto w-full space-y-8">
        {/* Section Headline */}
        <div className="space-y-2 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rice-paper text-heritage-green border border-antique-gold/40 text-xs font-bold shadow-xs">
            <Compass className="w-3.5 h-3.5 text-antique-gold" />
            <span className="uppercase tracking-wider text-[11px] font-extrabold">
              BẢN ĐỒ DI SẢN CHỮ S &amp; KHO NGỮ LIỆU TIẾNG ANH
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-heritage-green font-bold leading-tight tracking-tight">
            Khám phá 3 miền văn hoá qua lăng kính từ vựng bản xứ.
          </h2>
          <p className="text-sm sm:text-base text-text-body font-normal leading-relaxed">
            Nhấp vào từng toạ độ trên dải đất hình chữ S để nghe phát âm, khám phá từ vựng chuyên sâu và bài thuyết trình mẫu.
          </p>
        </div>

        {/* Integrated Card Container */}
        <div className="w-full bg-rice-paper rounded-3xl border-2 border-antique-gold/30 shadow-xl overflow-hidden flex flex-col transition-colors duration-300">
          {/* Top Control Bar */}
          <div className="px-4 pt-3.5 pb-2.5 sm:px-6 sm:pt-4 sm:pb-3 flex flex-wrap items-center justify-between gap-3 bg-surface/90 border-b border-line">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-rice-paper rounded-xl border border-line p-1 gap-1 shadow-xs">
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer focus-ring ${
                  viewMode === 'map'
                    ? 'bg-heritage-green text-warm-ivory shadow-xs'
                    : 'text-text-secondary hover:text-heritage-green hover:bg-mist-cloud/40'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Bản đồ Chữ S Tương tác</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer focus-ring ${
                  viewMode === 'list'
                    ? 'bg-heritage-green text-warm-ivory shadow-xs'
                    : 'text-text-secondary hover:text-heritage-green hover:bg-mist-cloud/40'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Hành lang 3 Miền</span>
              </button>
            </div>

            {/* Region Filter Buttons in Map View */}
            {viewMode === 'map' && (
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {[
                  { label: 'Tất cả (Toàn quốc)', val: null },
                  { label: 'Bắc Bộ', val: 'Bắc Bộ' },
                  { label: 'Trung Bộ', val: 'Trung Bộ' },
                  { label: 'Nam Bộ', val: 'Nam Bộ' },
                ].map((btn) => (
                  <button
                    key={btn.label}
                    type="button"
                    onClick={() => setSelectedRegion(btn.val)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition-colors focus-ring ${
                      selectedRegion === btn.val
                        ? 'bg-heritage-green text-warm-ivory shadow-xs'
                        : 'bg-surface text-heritage-green border border-line hover:bg-mist-cloud/40'
                    }`}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Card Body: Interactive Split View */}
          <div className="relative w-full bg-surface transition-colors duration-300">
            <AnimatePresence mode="wait">
              {viewMode === 'map' ? (
                <motion.div
                  key="map-split-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 lg:grid-cols-12 items-stretch"
                >
                  {/* Left Column: Vector Map SVG (5/12) */}
                  <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-line p-3 sm:p-4 flex flex-col justify-center items-center h-[460px] sm:h-[500px] relative bg-heritage-forest/5">
                    <div className="w-full h-full relative">
                      <VietnamMap
                        selectedProvinceId={selectedSite?.id || null}
                        onSelectProvince={(prov: ProvinceMapItem | null) => {
                          if (!prov) return;
                          const site = HERITAGE_SITES.find(
                            (s) =>
                              s.province.toLowerCase().includes(prov.name.toLowerCase()) ||
                              prov.name.toLowerCase().includes(s.province.toLowerCase()) ||
                              s.name.toLowerCase().includes(prov.name.toLowerCase()) ||
                              s.id.toLowerCase() === prov.id.toLowerCase()
                          );
                          if (site) {
                            setSelectedSite(site);
                          } else {
                            setSelectedSite({
                              id: prov.id,
                              name: prov.name,
                              englishTitle: `Cultural Landscape of ${prov.name}`,
                              region: prov.region === 'north' ? 'Bắc Bộ' : prov.region === 'central' ? 'Trung Bộ' : 'Nam Bộ',
                              category: 'Di sản UNESCO',
                              province: prov.name,
                              x: prov.cx,
                              y: prov.cy,
                              established: 'Di sản Quốc gia',
                              unescoStatus: 'Địa danh Văn hóa tiêu biểu',
                              cefrLevel: 'B2',
                              culturalInsight: `Khám phá các giá trị văn hóa, di tích lịch sử và cảnh quan di sản tiêu biểu tại ${prov.name}.`,
                              presentationSnippet: `Welcome to ${prov.name}, a region renowned for its rich cultural traditions and historic heritage.`,
                              vocabularyList: [
                                {
                                  word: `${prov.name} Cultural Heritage`,
                                  ipa: '/ˈkʌl.tʃər.əl ˈher.ɪ.tɪdʒ/',
                                  pos: 'noun phrase',
                                  meaning: `Di sản văn hóa ${prov.name}`,
                                  collocation: `preserve ${prov.name} cultural heritage`,
                                },
                              ],
                            });
                          }
                        }}
                        showControls={true}
                        showRegionTabs={false}
                        showPoiPins={true}
                      />
                    </div>
                  </div>

                  {/* Right Column: Heritage Detail Panel (7/12) */}
                  <div className="lg:col-span-7 p-6 sm:p-7 flex flex-col justify-center space-y-4 bg-surface">
                    <AnimatePresence mode="wait">
                      {selectedSite ? (
                        <motion.div
                          key={selectedSite.id}
                          initial={shouldReduceMotion ? {} : { opacity: 0, x: 8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -8 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-4"
                        >
                          {/* Site Header */}
                          <div className="space-y-1.5 border-b border-line pb-3">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-bold uppercase tracking-wider text-antique-gold flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-antique-gold" />
                                <span>{selectedSite.region} • {selectedSite.province}</span>
                              </span>
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-heritage-green text-warm-ivory shadow-xs">
                                Chuẩn {selectedSite.cefrLevel}
                              </span>
                            </div>

                            <h3 className="font-serif text-2xl sm:text-3xl text-heritage-green font-bold leading-snug">
                              {selectedSite.name}
                            </h3>

                            <p className="text-xs sm:text-sm font-serif italic text-mountain-teal">
                              &ldquo;{selectedSite.englishTitle}&rdquo;
                            </p>
                          </div>

                          {/* Hero Bilingual Phrase with Pronunciation Button */}
                          <div className="p-3.5 sm:p-4 rounded-2xl bg-rice-paper border border-antique-gold/40 space-y-2 shadow-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-heritage-green uppercase tracking-wide flex items-center gap-1.5">
                                <Award className="w-4 h-4 text-antique-gold" />
                                <span>Diễn đạt học thuật quốc tế (Bilingual Phrase):</span>
                              </span>

                              <button
                                type="button"
                                onClick={() => handlePlayAudio(selectedSite.presentationSnippet)}
                                className="p-1 rounded-lg bg-heritage-green text-warm-ivory hover:bg-heritage-dark transition-colors cursor-pointer flex items-center gap-1.5 text-xs px-2.5 shadow-xs focus-ring"
                              >
                                {isPlayingAudio ? (
                                  <>
                                    <VolumeX className="w-3.5 h-3.5" />
                                    <span>Dừng</span>
                                  </>
                                ) : (
                                  <>
                                    <Volume2 className="w-3.5 h-3.5 text-antique-bright" />
                                    <span>Nghe bài phát âm</span>
                                  </>
                                )}
                              </button>
                            </div>

                            <p className="text-xs sm:text-sm font-serif text-heritage-dark leading-relaxed">
                              &ldquo;{selectedSite.presentationSnippet}&rdquo;
                            </p>
                          </div>

                          {/* Vocabulary Collocations List */}
                          {selectedSite.vocabularyList && selectedSite.vocabularyList.length > 0 && (
                            <div className="space-y-2">
                              <span className="text-xs font-bold uppercase tracking-wider text-heritage-green flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5 text-antique-gold" />
                                <span>Từ vựng bản sắc cốt lõi ({selectedSite.vocabularyList.length} Collocations):</span>
                              </span>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {selectedSite.vocabularyList.map((vocab, vIdx) => (
                                  <div
                                    key={vIdx}
                                    className="p-2.5 rounded-xl bg-rice-paper border border-line space-y-0.5 text-xs"
                                  >
                                    <div className="flex items-center justify-between font-bold text-heritage-green">
                                      <span>{vocab.word}</span>
                                      <span className="text-[10px] font-mono text-mountain-teal">{vocab.ipa}</span>
                                    </div>
                                    <p className="text-[11px] text-text-secondary leading-tight">
                                      {vocab.meaning}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Cultural Depth Insight */}
                          <div className="text-xs text-text-body pt-2 border-t border-line leading-relaxed">
                            <strong className="text-antique-gold font-bold">Chiều sâu di sản:</strong> {selectedSite.culturalInsight}
                          </div>

                          {/* Primary Call to Action Button */}
                          <div className="pt-1">
                            <button
                              type="button"
                              onClick={() => {
                                const event = new CustomEvent('app:navigate', { detail: 'bilingual-reader' });
                                window.dispatchEvent(event);
                              }}
                              className="w-full py-3 px-4 rounded-xl bg-heritage-green hover:bg-heritage-dark text-warm-ivory font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer group focus-ring"
                            >
                              <Compass className="w-4 h-4 text-antique-gold group-hover:rotate-45 transition-transform" />
                              <span>Khám phá Bài đọc Song ngữ &amp; AI Shadowing {selectedSite.name}</span>
                            </button>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                          <MapPin className="w-10 h-10 text-antique-gold animate-bounce" />
                          <p className="text-sm font-medium text-heritage-green">
                            Nhấp vào bất kỳ tọa độ di sản trên bản đồ để khám phá ngữ liệu song ngữ bản xứ.
                          </p>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ) : (
                /* ════ LIST VIEW: 3-Region List ══════════════════════════════ */
                <motion.div
                  key="list-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-surface"
                >
                  {/* Region Selectors List */}
                  <div className="lg:col-span-6 space-y-3">
                    {REGIONS_DATA.map((item, idx) => {
                      const isSelected = activeRegionIndex === idx;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectRegionFromList(idx)}
                          className={`w-full text-left p-4 sm:p-5 rounded-2xl transition-all duration-200 flex flex-col space-y-2 cursor-pointer focus-ring ${
                            isSelected
                              ? 'bg-rice-paper shadow-md border-2 border-heritage-green'
                              : 'hover:bg-rice-paper/70 border border-line bg-surface'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-serif text-xl sm:text-2xl font-bold text-heritage-green">
                              {item.name}
                            </span>
                            <span className="text-xs font-bold text-antique-gold uppercase tracking-wider">
                              {item.sitesCount} Điểm Di sản
                            </span>
                          </div>

                          <p className="text-xs sm:text-sm font-serif italic text-mountain-teal">
                            &ldquo;{item.englishName}&rdquo;
                          </p>

                          <p className="text-xs text-text-body font-normal">
                            {item.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Region Focus Detail Box */}
                  <div className="lg:col-span-6 space-y-6">
                    <motion.div
                      key={activeRegionInList.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                      className="p-7 rounded-3xl bg-rice-paper border border-antique-gold/40 shadow-md space-y-6"
                    >
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-mountain-teal">
                          Tâm Điểm Văn Hoá
                        </span>
                        <h3 className="font-serif text-2xl sm:text-3xl text-heritage-green font-bold">
                          {activeRegionInList.name}
                        </h3>
                        <p className="text-xs font-bold text-antique-gold">
                          {activeRegionInList.highlightCategory}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 py-4 border-y border-line">
                        <div>
                          <div className="font-serif text-3xl text-heritage-green font-bold">
                            {activeRegionInList.sitesCount}
                          </div>
                          <p className="text-xs text-mountain-teal">Di tích đặc biệt</p>
                        </div>
                        <div>
                          <div className="font-serif text-3xl text-heritage-green font-bold">
                            {activeRegionInList.vocabTerms}+
                          </div>
                          <p className="text-xs text-mountain-teal">Từ vựng bản sắc</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs font-bold text-heritage-green uppercase">
                          Sắc thái văn hoá:
                        </span>
                        <p className="text-xs sm:text-sm text-text-body font-normal leading-relaxed">
                          {activeRegionInList.culturalTheme}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleViewRegionOnMap(
                            activeRegionInList.id === 'bac-bo'
                              ? 'Bắc Bộ'
                              : activeRegionInList.id === 'trung-bo'
                                ? 'Trung Bộ'
                                : 'Nam Bộ'
                          )
                        }
                        className="w-full py-3 px-4 rounded-xl bg-heritage-green hover:bg-heritage-dark text-warm-ivory font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer focus-ring"
                      >
                        <Compass className="w-3.5 h-3.5 text-antique-gold" />
                        <span>Xem {activeRegionInList.name} trên Bản đồ S</span>
                      </button>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VietnamHeritageMapSection;
