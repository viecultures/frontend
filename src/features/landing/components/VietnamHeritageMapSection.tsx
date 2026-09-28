import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, BarChart3, Compass, Sparkles, Volume2, VolumeX, BookOpen, Award } from 'lucide-react';
import { VietnamMap } from '@/components/VietnamMap';
import type { ProvinceMapItem } from '@/data/vietnamMapData';
import { HERITAGE_SITES, REGIONS_DATA } from '@/data/vietnamCultureData';
import type { CulturalHeritageSite } from '@/types/sampleTypes';
import { speakEnglish, stopSpeaking } from '@/utils/sampleSpeech';

export const VietnamHeritageMapSection: React.FC = () => {
  const [selectedSite, setSelectedSite] = useState<CulturalHeritageSite | null>(
    HERITAGE_SITES[0] || null
  );
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [activeRegionIndex, setActiveRegionIndex] = useState<number>(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const activeRegionInList = REGIONS_DATA[activeRegionIndex] || REGIONS_DATA[0];

  const handlePlayAudio = (phrase: string) => {
    if (isPlayingAudio) {
      stopSpeaking();
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
      className="relative py-12 sm:py-16 px-4 sm:px-8 lg:px-12 flex flex-col justify-center border-t border-[#E8DFCB] dark:border-[#1E4B43]/50 bg-[#FBF7EE] dark:bg-[#102B26] text-[#1E4B43] dark:text-[#FBF7EE] transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto w-full space-y-6">
        {/* Section Headline */}
        <div className="space-y-2 max-w-3xl">
          <p className="text-xs font-semibold tracking-wider uppercase text-[#6E9FA1] dark:text-[#9FCED8]">
            Bản Đồ Di Sản Chữ S & Kho Ngữ Liệu Tiếng Anh
          </p>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl text-[#1E4B43] dark:text-[#FBF7EE] font-normal leading-[1.12] tracking-tight">
            Khám phá 3 miền văn hoá qua lăng kính từ vựng bản xứ.
          </h2>
          <p className="text-sm sm:text-base text-[#1E4B43]/80 dark:text-[#FBF7EE]/80 font-light leading-relaxed">
            Nhấp vào từng toạ độ trên dải đất hình chữ S để nghe phát âm, khám phá từ vựng chuyên sâu và bài thuyết trình mẫu.
          </p>
        </div>

        {/* Integrated Card Container Outlined with Dark Heritage Teal (#1E4B43) */}
        <div className="w-full bg-[#FAF6ED] dark:bg-[#143731] rounded-2xl sm:rounded-3xl border-2 border-[#1E4B43] dark:border-[#D9B76A]/60 shadow-lg overflow-hidden flex flex-col transition-colors duration-300">
          {/* Top Control Bar */}
          <div className="px-4 pt-3.5 pb-2.5 sm:px-6 sm:pt-4 sm:pb-3 flex flex-wrap items-center justify-between gap-3 bg-[#F6EEDC]/80 dark:bg-[#102B26]/80 border-b border-[#E8DFCB] dark:border-[#1E4B43]">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-[#FAF6ED] dark:bg-[#1C4B43] rounded-xl border border-[#E8DFCB] dark:border-[#1E4B43] p-1 gap-1">
              <button
                type="button"
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${viewMode === 'map'
                  ? 'bg-[#1E4B43] text-[#FBF7EE] dark:bg-[#D9B76A] dark:text-[#102B26] shadow-xs'
                  : 'text-[#1E4B43] dark:text-[#FBF7EE] hover:bg-[#F6EEDC] dark:hover:bg-[#143731]'
                  }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Bản đồ Chữ S Tương tác</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${viewMode === 'list'
                  ? 'bg-[#1E4B43] text-[#FBF7EE] dark:bg-[#D9B76A] dark:text-[#102B26] shadow-xs'
                  : 'text-[#1E4B43] dark:text-[#FBF7EE] hover:bg-[#F6EEDC] dark:hover:bg-[#143731]'
                  }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Hành lang 3 Miền</span>
              </button>
            </div>

            {/* Region Filter Buttons in Map View */}
            {viewMode === 'map' && (
              <div className="flex items-center gap-1.5 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setSelectedRegion(null)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${selectedRegion === null
                    ? 'bg-[#1E4B43] text-[#FBF7EE] dark:bg-[#D9B76A] dark:text-[#102B26]'
                    : 'bg-[#FAF6ED] dark:bg-[#143731] text-[#1E4B43] dark:text-[#FBF7EE] border border-[#E8DFCB] dark:border-[#1E4B43]'
                    }`}
                >
                  Tất cả (Toàn quốc)
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRegion('Bắc Bộ')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${selectedRegion === 'Bắc Bộ'
                    ? 'bg-[#1E4B43] text-[#FBF7EE] dark:bg-[#D9B76A] dark:text-[#102B26]'
                    : 'bg-[#FAF6ED] dark:bg-[#143731] text-[#1E4B43] dark:text-[#FBF7EE] border border-[#E8DFCB] dark:border-[#1E4B43]'
                    }`}
                >
                  Bắc Bộ
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRegion('Trung Bộ')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${selectedRegion === 'Trung Bộ'
                    ? 'bg-[#1E4B43] text-[#FBF7EE] dark:bg-[#D9B76A] dark:text-[#102B26]'
                    : 'bg-[#FAF6ED] dark:bg-[#143731] text-[#1E4B43] dark:text-[#FBF7EE] border border-[#E8DFCB] dark:border-[#1E4B43]'
                    }`}
                >
                  Trung Bộ
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRegion('Nam Bộ')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer transition-colors ${selectedRegion === 'Nam Bộ'
                    ? 'bg-[#1E4B43] text-[#FBF7EE] dark:bg-[#D9B76A] dark:text-[#102B26]'
                    : 'bg-[#FAF6ED] dark:bg-[#143731] text-[#1E4B43] dark:text-[#FBF7EE] border border-[#E8DFCB] dark:border-[#1E4B43]'
                    }`}
                >
                  Nam Bộ
                </button>
              </div>
            )}
          </div>

          {/* Card Body: Interactive Split View (Map on Left, Detail Panel on Right) */}
          <div className="relative w-full flex-1 bg-[#FBF7EE] dark:bg-[#102B26] transition-colors duration-300">
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
                  {/* Left Column: S-Shaped Vector Map SVG */}
                  <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-[#E8DFCB] dark:border-[#1E4B43]/50 p-4 flex flex-col justify-center items-center h-[480px] sm:h-[520px] relative bg-[#FAF6ED]/50 dark:bg-[#143731]/30">
                    <div className="w-full h-full relative">
                      <VietnamMap
                        selectedProvinceId={selectedSite?.id || null}
                        onSelectProvince={(prov: ProvinceMapItem | null) => {
                          if (!prov) {
                            return;
                          }
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

                  {/* Right Column: Heritage Detail & Bilingual Vocabulary Panel */}
                  <div className="lg:col-span-7 p-5 sm:p-7 flex flex-col justify-between space-y-5 bg-[#FBF7EE] dark:bg-[#102B26]">
                    <AnimatePresence mode="wait">
                      {selectedSite ? (
                        <motion.div
                          key={selectedSite.id}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.25 }}
                          className="space-y-4 flex-1 flex flex-col justify-between"
                        >
                          {/* Site Header */}
                          <div className="space-y-2 border-b border-[#E8DFCB] dark:border-[#1E4B43] pb-4">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-semibold uppercase tracking-wider text-[#D9B76A] flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-[#D9B76A]" />
                                <span>{selectedSite.region} • {selectedSite.province}</span>
                              </span>
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-[#1E4B43] text-[#FBF7EE] dark:bg-[#D9B76A] dark:text-[#102B26]">
                                Chuẩn {selectedSite.cefrLevel}
                              </span>
                            </div>

                            <h3 className="font-display text-2xl sm:text-3xl text-[#1E4B43] dark:text-[#FBF7EE] font-normal leading-snug">
                              {selectedSite.name}
                            </h3>

                            <p className="text-sm font-serif italic text-[#6E9FA1] dark:text-[#9FCED8]">
                              &ldquo;{selectedSite.englishTitle}&rdquo;
                            </p>
                          </div>

                          {/* Hero Bilingual Phrase with Pronunciation Button */}
                          <div className="p-4 rounded-2xl bg-[#EAF5F2] dark:bg-[#1C4B43]/50 border border-[#B8E0D7] dark:border-[#D9B76A]/50 space-y-2.5 shadow-xs">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-[#1E4B43] dark:text-[#D9B76A] uppercase tracking-wide flex items-center gap-1.5">
                                <Award className="w-4 h-4 text-[#D9B76A]" />
                                <span>Diễn đạt học thuật quốc tế (Bilingual Phrase):</span>
                              </span>

                              <button
                                type="button"
                                onClick={() => handlePlayAudio(selectedSite.presentationSnippet)}
                                className="p-1.5 rounded-lg bg-[#1E4B43] text-[#FBF7EE] dark:bg-[#D9B76A] dark:text-[#102B26] hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-1.5 text-xs px-2.5 shadow-xs"
                              >
                                {isPlayingAudio ? (
                                  <>
                                    <VolumeX className="w-3.5 h-3.5" />
                                    <span>Dừng</span>
                                  </>
                                ) : (
                                  <>
                                    <Volume2 className="w-3.5 h-3.5 text-[#D9B76A] dark:text-[#102B26]" />
                                    <span>Nghe bài phát âm</span>
                                  </>
                                )}
                              </button>
                            </div>

                            <p className="text-xs sm:text-sm font-serif text-[#1E4B43] dark:text-[#FBF7EE] leading-relaxed">
                              &ldquo;{selectedSite.presentationSnippet}&rdquo;
                            </p>
                          </div>

                          {/* Vocabulary Collocations List */}
                          <div className="space-y-2">
                            <span className="text-xs font-semibold uppercase tracking-wider text-[#1E4B43] dark:text-[#D9B76A] flex items-center gap-1.5">
                              <BookOpen className="w-3.5 h-3.5 text-[#D9B76A]" />
                              <span>Từ vựng bản sắc cốt lõi ({selectedSite.vocabularyList.length} Collocations):</span>
                            </span>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {selectedSite.vocabularyList.map((vocab, vIdx) => (
                                <div
                                  key={vIdx}
                                  className="p-2.5 rounded-xl bg-[#FAF6ED] dark:bg-[#143731] border border-[#E8DFCB] dark:border-[#1E4B43] space-y-1 text-xs"
                                >
                                  <div className="flex items-center justify-between font-semibold text-[#1E4B43] dark:text-[#FBF7EE]">
                                    <span>{vocab.word}</span>
                                    <span className="text-[10px] font-mono text-[#6E9FA1]">{vocab.ipa}</span>
                                  </div>
                                  <p className="text-[11px] text-[#1E4B43]/80 dark:text-[#FBF7EE]/75 leading-tight">
                                    {vocab.meaning}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Cultural Depth Insight */}
                          <div className="text-xs text-[#1E4B43]/85 dark:text-[#FBF7EE]/80 pt-3 border-t border-[#E8DFCB] dark:border-[#1E4B43] leading-relaxed">
                            <strong className="text-[#D9B76A]">Chiều sâu di sản:</strong> {selectedSite.culturalInsight}
                          </div>

                          {/* Primary Call to Action Button */}
                          <div className="pt-2">
                            <button
                              type="button"
                              onClick={() => {
                                const event = new CustomEvent('app-navigate', { detail: '/bilingual-reader' });
                                window.dispatchEvent(event);
                              }}
                              className="w-full py-3 px-4 rounded-xl bg-[#1E4B43] hover:bg-[#163D37] text-[#FBF7EE] dark:bg-[#D9B76A] dark:text-[#102B26] font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer group"
                            >
                              <Compass className="w-4 h-4 text-[#D9B76A] dark:text-[#102B26] group-hover:rotate-45 transition-transform" />
                              <span>Khám phá Bài đọc Song ngữ &amp; AI Shadowing {selectedSite.name}</span>
                            </button>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-3">
                          <MapPin className="w-10 h-10 text-[#D9B76A] animate-bounce" />
                          <p className="text-sm font-medium text-[#1E4B43] dark:text-[#FBF7EE]">
                            Nhấp vào bất kỳ tọa độ di sản trên bản đồ để khám phá ngữ liệu song ngữ bản xứ.
                          </p>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="list-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start bg-[#FBF7EE] dark:bg-[#102B26]"
                >
                  {/* Region Selectors List */}
                  <div className="lg:col-span-6 space-y-4">
                    {REGIONS_DATA.map((item, idx) => {
                      const isSelected = activeRegionIndex === idx;

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectRegionFromList(idx)}
                          className={`w-full text-left p-5 rounded-2xl transition-all duration-200 flex flex-col space-y-2 cursor-pointer ${isSelected
                            ? 'bg-[#FAF6ED] dark:bg-[#1C4B43] shadow-md border-2 border-[#1E4B43] dark:border-[#D9B76A]'
                            : 'hover:bg-[#FAF6ED] dark:hover:bg-[#143731] border border-[#E8DFCB] dark:border-[#1E4B43]/50 bg-[#FAF6ED]/50 dark:bg-[#143731]/50'
                            }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-display text-xl sm:text-2xl font-normal text-[#1E4B43] dark:text-[#FBF7EE]">
                              {item.name}
                            </span>
                            <span className="text-xs font-semibold text-[#D9B76A] uppercase tracking-wider">
                              {item.sitesCount} Điểm Di sản
                            </span>
                          </div>

                          <p className="text-xs sm:text-sm font-serif italic text-[#6E9FA1] dark:text-[#9FCED8]">
                            &ldquo;{item.englishName}&rdquo;
                          </p>

                          <p className="text-xs text-[#1E4B43]/80 dark:text-[#FBF7EE]/75 font-light">
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
                      className="p-7 rounded-3xl bg-[#EAF5F2] dark:bg-[#143731] border border-[#B8E0D7] dark:border-[#1E4B43] shadow-md space-y-6"
                    >
                      <div className="space-y-1.5">
                        <span className="text-xs font-semibold uppercase tracking-wider text-[#6E9FA1] dark:text-[#9FCED8]">
                          Tâm Điểm Văn Hoá
                        </span>
                        <h3 className="font-display text-2xl sm:text-3xl text-[#1E4B43] dark:text-[#FBF7EE]">
                          {activeRegionInList.name}
                        </h3>
                        <p className="text-xs font-semibold text-[#D9B76A]">
                          {activeRegionInList.highlightCategory}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#1E4B43]/15 dark:border-[#FBF7EE]/15">
                        <div>
                          <div className="font-display text-3xl text-[#1E4B43] dark:text-[#FBF7EE]">
                            {activeRegionInList.sitesCount}
                          </div>
                          <p className="text-xs text-[#6E9FA1] dark:text-[#9FCED8]">Di tích đặc biệt</p>
                        </div>
                        <div>
                          <div className="font-display text-3xl text-[#1E4B43] dark:text-[#FBF7EE]">
                            {activeRegionInList.vocabTerms}+
                          </div>
                          <p className="text-xs text-[#6E9FA1] dark:text-[#9FCED8]">Từ vựng bản sắc</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs font-semibold text-[#1E4B43] dark:text-[#D9B76A] uppercase">
                          Sắc thái văn hoá:
                        </span>
                        <p className="text-xs sm:text-sm text-[#1E4B43]/85 dark:text-[#FBF7EE]/85 font-light leading-relaxed">
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
                        className="w-full py-3 px-4 rounded-xl bg-[#1E4B43] hover:bg-[#163832] text-[#FBF7EE] dark:bg-[#D9B76A] dark:text-[#102B26] font-medium text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <Compass className="w-3.5 h-3.5" />
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
