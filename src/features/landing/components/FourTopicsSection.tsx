import React from 'react';
import { ArrowRight, Landmark, UtensilsCrossed, Palette, Sparkles, BookOpen } from 'lucide-react';

interface TopicPillar {
  pillarNumber: string;
  title: string;
  vietnameseTitle: string;
  categoryKey: string;
  description: string;
  imageUrl: string;
  articleCount: number;
  vocabTerms: number;
  icon: React.ReactNode;
}

const TOPIC_PILLARS: TopicPillar[] = [
  {
    pillarNumber: 'Trụ Cột 01',
    title: 'History & Heritage',
    vietnameseTitle: 'Lịch Sử & Di Sản Triều Đại',
    categoryKey: 'Heritage',
    description: 'Khám phá thành quách triều Nguyễn, di sản thế giới UNESCO, phong thủy hoàng gia và các dấu mốc lịch sử hào hùng của dân tộc.',
    imageUrl: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=600&q=80',
    articleCount: 45,
    vocabTerms: 320,
    icon: <Landmark className="w-4 h-4 text-antique-gold" />,
  },
  {
    pillarNumber: 'Trụ Cột 02',
    title: 'Cuisine & Coffee',
    vietnameseTitle: 'Ẩm Thực & Phong Vị Cà Phê',
    categoryKey: 'Cuisine',
    description: 'Hành trình các món ăn 3 miền, nghệ thuật nước dùng phở, cà phê trứng, văn hóa ẩm thực đường phố và phong vị cà phê Việt.',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80',
    articleCount: 38,
    vocabTerms: 280,
    icon: <UtensilsCrossed className="w-4 h-4 text-antique-gold" />,
  },
  {
    pillarNumber: 'Trụ Cột 03',
    title: 'Arts & Craft Villages',
    vietnameseTitle: 'Làng Nghề & Nghệ Thuật Dân Gian',
    categoryKey: 'Crafts',
    description: 'Tinh hoa làng gốm Bát Tràng, lụa Vạn Phúc, tranh khắc gỗ Đông Hồ, múa rối nước, sơn mài mỹ nghệ và ca trù truyền thống.',
    imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80',
    articleCount: 32,
    vocabTerms: 240,
    icon: <Palette className="w-4 h-4 text-antique-gold" />,
  },
  {
    pillarNumber: 'Trụ Cột 04',
    title: 'Festivals & Beliefs',
    vietnameseTitle: 'Lễ Hội & Tín Ngưỡng Dân Gian',
    categoryKey: 'Folklore',
    description: 'Phong tục Tết Nguyên Đán, Giỗ tổ Hùng Vương, Đêm rằm Trung Thu, các lễ hội dân gian và tín ngưỡng thờ Mẫu tam phủ.',
    imageUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=600&q=80',
    articleCount: 29,
    vocabTerms: 210,
    icon: <Sparkles className="w-4 h-4 text-antique-gold" />,
  },
];

interface FourTopicsSectionProps {
  onNavigate?: (view: string) => void;
}

export const FourTopicsSection: React.FC<FourTopicsSectionProps> = ({ onNavigate }) => {
  const handleTopicClick = (_categoryKey: string) => {
    if (onNavigate) {
      onNavigate('discovery');
    } else {
      window.dispatchEvent(new CustomEvent('app:navigate', { detail: 'discovery' }));
    }
  };

  return (
    <section id="topics" className="py-24 sm:py-28 px-4 sm:px-6 lg:px-8 bg-surface">
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-14">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3.5">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rice-paper text-heritage-green border border-antique-gold/40 text-xs font-bold shadow-xs">
            <BookOpen className="w-3.5 h-3.5 text-antique-gold" />
            <span className="uppercase tracking-widest text-[11px] font-extrabold">
              CHỦ ĐỀ BÀI ĐỌC DI SẢN
            </span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-text-main tracking-tight">
            4 Trụ Cột Văn Hóa Cốt Lõi
          </h2>

          <p className="text-sm sm:text-base text-text-muted max-w-2xl mx-auto font-normal leading-relaxed">
            Hệ thống bài đọc được cấu trúc bài bản theo 4 lĩnh vực di sản đặc trưng, kết hợp từ vựng chuyên sâu giúp bạn tự tin chia sẻ văn hóa Việt ra thế giới.
          </p>
        </div>

        {/* 4 Cards Grid with Generous Padding & Margin */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 lg:gap-8">
          {TOPIC_PILLARS.map((pillar) => (
            <div
              key={pillar.pillarNumber}
              onClick={() => handleTopicClick(pillar.categoryKey)}
              className="group bg-white rounded-3xl border border-line hover:border-antique-gold/50 overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-400 flex flex-col justify-between cursor-pointer relative"
            >
              <div>
                {/* Image Placeholder / Artwork Header */}
                <div className="relative h-52 sm:h-56 w-full bg-heritage-dark overflow-hidden">
                  <img
                    src={pillar.imageUrl}
                    alt={pillar.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                  {/* Top Pillar Badge */}
                  <div className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider text-heritage-forest shadow-md border border-line">
                    {pillar.pillarNumber}
                  </div>

                  {/* Bottom Stats Overlay */}
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-[11px] text-warm-ivory font-medium">
                    <span>{pillar.articleCount} bài đọc</span>
                    <span className="text-antique-bright font-mono font-bold">{pillar.vocabTerms}+ từ vựng</span>
                  </div>
                </div>

                {/* Card Body with Corner Watercolor SVG Watermark */}
                <div className="p-6 sm:p-7 space-y-2.5 relative overflow-hidden">
                  {/* Subtle Corner Motif SVG */}
                  <div className="absolute top-0 right-0 w-20 h-20 overflow-hidden pointer-events-none opacity-15 group-hover:opacity-30 transition-opacity">
                    <svg viewBox="0 0 100 100" className="w-full h-full fill-none stroke-antique-gold" strokeWidth="1.2">
                      <path d="M100 0 C70 10 40 40 30 70 C20 100 0 100 0 100" />
                      <circle cx="80" cy="20" r="10" fill="#E8B7B2" fillOpacity="0.4" />
                    </svg>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-mountain-teal relative z-10">
                    {pillar.icon}
                    <span>{pillar.title}</span>
                  </div>

                  <h3 className="font-serif text-lg sm:text-xl font-bold text-text-main group-hover:text-heritage-green transition-colors leading-snug relative z-10">
                    {pillar.vietnameseTitle}
                  </h3>

                  <p className="text-xs sm:text-sm text-text-muted leading-relaxed font-normal relative z-10">
                    {pillar.description}
                  </p>
                </div>
              </div>

              {/* Card Footer Action */}
              <div className="p-6 sm:p-7 pt-0">
                <div className="pt-4 border-t border-line flex items-center justify-between text-xs font-bold text-heritage-green group-hover:text-mountain-teal transition-colors">
                  <span>Khám phá lộ trình</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FourTopicsSection;
