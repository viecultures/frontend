import React from 'react';
import Link from '@/components/Link';
import { MapPin, BookOpen, Sparkles, Clock } from 'lucide-react';
import VietnamMapCarousel from '@/features/discovery/components/vietnam-map-carousel';
import { VIETNAM_LANDMARKS, type LandmarkArticle } from '@/data/landmarksData';

interface DiscoverySpotlightProps {
  activePinIndex: number;
  onSelectPinIndex: (index: number) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const DiscoverySpotlight: React.FC<DiscoverySpotlightProps> = ({
  activePinIndex,
  onSelectPinIndex,
  onMouseEnter,
  onMouseLeave,
}) => {
  const safePinIndex = Math.max(0, Math.min(activePinIndex, VIETNAM_LANDMARKS.length - 1));
  const activeLandmark = VIETNAM_LANDMARKS[safePinIndex] || VIETNAM_LANDMARKS[0];

  return (
    <section className="mb-10 relative z-20">
      {/* Header Title (Simple & Left-Aligned) */}
      <div className="mb-4 text-left">
        <h2 className="font-serif text-xl sm:text-2xl font-bold text-heritage-green flex items-center gap-2">
          <MapPin className="w-5 h-5 text-antique-gold" />
          <span>Khám Phá Bản Đồ Di Sản</span>
        </h2>
        <p className="text-xs text-text-secondary mt-1">
          Nhấp vào các tỉnh thành trên bản đồ để xem bài đọc tiêu điểm và học từ vựng di sản song ngữ.
        </p>
      </div>

      {/* Seamless 4:6 Grid (40% Map : 60% Content) with fixed consistent height */}
      <div
        className="grid grid-cols-1 lg:grid-cols-10 gap-6 sm:gap-8 items-stretch"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* LEFT COLUMN: Map Container (40% Width) - Fixed height so it never stretches across regions */}
        <div className="lg:col-span-4 relative bg-heritage-forest border border-heritage-green/20 rounded-2xl p-2.5 shadow-md flex flex-col justify-center items-center h-[460px] sm:h-[500px] lg:h-[520px] max-h-[520px] overflow-hidden">
          <VietnamMapCarousel
            activeIndex={activePinIndex}
            onSelectLandmark={onSelectPinIndex}
            showRegionTabs={false}
            showPoiInfoBox={false}
          />
        </div>

        {/* RIGHT COLUMN: Landmark Article Content (60% Width) */}
        <div
          key={activeLandmark.id}
          className="lg:col-span-6 flex flex-col justify-between h-auto lg:h-[520px] animate-in fade-in duration-300"
        >
          {/* Location Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-heritage-green/10 border border-heritage-green/15 text-heritage-green text-xs font-bold mb-3 w-fit">
            <MapPin className="w-3.5 h-3.5 text-antique-gold" />
            <span>{activeLandmark.locationNameVi}</span>
          </div>

          {/* Feature Image Banner */}
          <div className="relative h-40 sm:h-44 rounded-2xl overflow-hidden mb-3.5 border border-heritage-green/15 shadow-xs group">
            <img
              src={activeLandmark.image}
              alt={activeLandmark.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-heritage-green/80 via-black/10 to-transparent" />

            <div className="absolute top-3 left-3 flex gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-heritage-green text-warm-ivory shadow-xs">
                {activeLandmark.category}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-antique-gold text-heritage-green shadow-xs">
                Band {activeLandmark.level}
              </span>
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-medium text-warm-ivory">
              <span className="bg-heritage-green/90 px-3 py-0.5 rounded-full border border-white/20 backdrop-blur-md text-[11px] flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-antique-gold" />
                <span>{activeLandmark.readTime} đọc song ngữ</span>
              </span>
              <span className="bg-antique-gold text-heritage-green px-3 py-0.5 rounded-full font-extrabold text-[11px] shadow-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-heritage-green fill-heritage-green" />
                <span>Di Sản Tiêu Điểm</span>
              </span>
            </div>
          </div>

          {/* Article Titles */}
          <div className="space-y-0.5 mb-2.5">
            <h3 className="font-serif font-bold text-xl sm:text-2xl text-heritage-green leading-snug">
              {activeLandmark.title}
            </h3>
            <p className="text-xs font-bold text-antique-gold">
              {activeLandmark.titleVi}
            </p>
          </div>

          {/* Bilingual Excerpt Box */}
          <div className="space-y-1.5 mb-3 bg-rice-paper p-3.5 rounded-2xl border border-heritage-green/12 shadow-xs">
            <p className="text-xs sm:text-sm text-heritage-green leading-relaxed font-serif">
              "{activeLandmark.excerptEn}"
            </p>
            <p className="text-xs text-text-secondary leading-relaxed italic border-t border-heritage-green/8 pt-1.5 font-sans">
              "{activeLandmark.excerptVi}"
            </p>
          </div>

          {/* Vocabulary Pills */}
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            <span className="text-xs font-extrabold text-heritage-green/70">Từ vựng di sản:</span>
            {activeLandmark.vocabHighlights.map((vocab, i) => (
              <span
                key={i}
                className="px-2.5 py-0.5 rounded-xl text-xs font-bold bg-heritage-green/10 text-heritage-green border border-heritage-green/12 inline-flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-antique-gold" />
                <span>{vocab}</span>
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-heritage-green/10">
            <Link
              href={`/reader?story=${activeLandmark.id}`}
              className="px-5 py-2.5 text-xs font-extrabold flex items-center gap-2 rounded-full bg-heritage-green text-warm-ivory hover:bg-heritage-dark shadow-md hover:scale-102 transition-all focus-ring"
            >
              <BookOpen className="w-4 h-4" />
              <span>Đọc Song Ngữ &amp; AI Shadowing</span>
            </Link>

            <Link
              href="/flashcards"
              className="px-4 py-2.5 text-xs font-bold flex items-center gap-2 rounded-full bg-rice-paper text-heritage-green border border-heritage-green/20 hover:bg-mist-cloud transition-all focus-ring"
            >
              <Sparkles className="w-4 h-4 text-antique-gold" />
              <span>Ôn Flashcard Địa Danh</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscoverySpotlight;
