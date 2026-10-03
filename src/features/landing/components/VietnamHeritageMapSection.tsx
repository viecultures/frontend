import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  MapPin,
  Compass,
  Sparkles,
  Volume2,
  VolumeX,
  BookOpen,
  Award
} from 'lucide-react';
import { VietnamMap } from '@/components/VietnamMap';
import type { ProvinceMapItem } from '@/data/vietnamMapData';
import { HERITAGE_SITES } from '@/data/vietnamCultureData';
import type { CulturalHeritageSite } from '@/types/sampleTypes';
import { speakEnglish } from '@/utils/sampleSpeech';

export const VietnamHeritageMapSection: React.FC = () => {
  const [selectedSite, setSelectedSite] = useState<CulturalHeritageSite | null>(
    HERITAGE_SITES[0] || null
  );
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const shouldReduceMotion = useReducedMotion();

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

  return (
    <section
      id="ban-do-di-san"
      className="relative py-20 sm:py-24 px-4 sm:px-6 lg:px-8 flex flex-col justify-center border-t border-line bg-surface text-heritage-green transition-colors duration-300 vn-pattern-bg"
    >
      <div className="max-w-7xl mx-auto w-full space-y-10">
        {/* Section Headline */}
        <div className="space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rice-paper text-heritage-green border border-antique-gold/40 text-xs font-bold shadow-xs">
            <Compass className="w-3.5 h-3.5 text-antique-gold" />
            <span className="uppercase tracking-wider text-[11px] font-extrabold">
              BẢN ĐỒ DI SẢN CHỮ S &amp; KHO NGỮ LIỆU TIẾNG ANH
            </span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-heritage-green font-bold leading-tight tracking-tight">
            Khám phá 3 miền văn hoá qua lăng kính từ vựng bản xứ
          </h2>
          <p className="text-sm sm:text-base text-text-body font-normal leading-relaxed">
            Nhấp vào từng toạ độ trên dải đất hình chữ S để nghe phát âm, khám phá từ vựng chuyên sâu và bài thuyết trình mẫu.
          </p>
        </div>

        {/* Integrated Card Container */}
        <div className="w-full bg-surface rounded-3xl border-2 border-antique-gold/30 shadow-xl overflow-hidden flex flex-col transition-colors duration-300">
          {/* Interactive Split View */}
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left Column: Vector Map SVG (5/12) */}
            <div className="lg:col-span-5 border-b lg:border-b-0 lg:border-r border-line p-4 sm:p-6 flex flex-col justify-center items-center h-[460px] sm:h-[520px] relative bg-heritage-forest/5">
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
                        cefrLevel: 'Level 2',
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
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center space-y-4 bg-surface">
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
                          {selectedSite.cefrLevel}
                        </span>
                      </div>

                      <h3 className="font-serif text-2xl sm:text-3xl text-heritage-green font-bold leading-snug">
                        {selectedSite.name}
                      </h3>

                      <p className="text-xs sm:text-sm font-serif italic text-mountain-teal">
                        &ldquo;{selectedSite.englishTitle}&rdquo;
                      </p>
                    </div>

                    {/* Hero Bilingual Phrase with Audio Button */}
                    <div className="p-3.5 rounded-2xl bg-rice-paper border border-antique-gold/40 space-y-2 shadow-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-heritage-green uppercase tracking-wide flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-antique-gold" />
                          <span>Câu thuyết trình mẫu (Bilingual):</span>
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
                              <span>Phát âm AI</span>
                            </>
                          )}
                        </button>
                      </div>

                      <p className="text-xs sm:text-sm font-serif text-heritage-dark leading-relaxed">
                        &ldquo;{selectedSite.presentationSnippet}&rdquo;
                      </p>
                    </div>

                    {/* Compact Core Vocabulary Collocations */}
                    {selectedSite.vocabularyList && selectedSite.vocabularyList.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-heritage-green flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-antique-gold" />
                          <span>Từ vựng bản sắc nổi bật:</span>
                        </span>

                        <div className="flex flex-wrap gap-2">
                          {selectedSite.vocabularyList.map((vocab, vIdx) => (
                            <div
                              key={vIdx}
                              className="px-3 py-1.5 rounded-xl bg-rice-paper border border-line text-xs flex items-center gap-2"
                            >
                              <span className="font-bold text-heritage-green">{vocab.word}</span>
                              <span className="text-text-muted text-[11px]">({vocab.meaning})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Primary Call to Action Button */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          const event = new CustomEvent('app:navigate', { detail: 'bilingual-reader' });
                          window.dispatchEvent(event);
                        }}
                        className="w-full py-3 px-4 rounded-xl bg-heritage-green hover:bg-heritage-dark text-warm-ivory font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer group focus-ring"
                      >
                        <Compass className="w-4 h-4 text-antique-gold group-hover:rotate-45 transition-transform" />
                        <span>Khám phá Bài đọc Song ngữ &amp; AI Shadowing</span>
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
          </div>
        </div>
      </div>
    </section>
  );
};

export default VietnamHeritageMapSection;
