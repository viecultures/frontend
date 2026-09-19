import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { Category } from '../types';
import { EXPLORE_CARDS_ASSETS } from '../assets';

interface ExploreSectionProps {
  onSelectCategory: (category: Category) => void;
}

export const ExploreSection: React.FC<ExploreSectionProps> = ({ onSelectCategory }) => {
  const exploreTopics: {
    id: Category;
    title: string;
    englishTitle: string;
    description: string;
    image: string;
    badge: string;
    tagline: string;
    expectedAsset: string;
  }[] = [
    {
      id: 'van-hoa',
      title: EXPLORE_CARDS_ASSETS.vanHoa.titleVi,
      englishTitle: EXPLORE_CARDS_ASSETS.vanHoa.titleEn,
      description: 'Khám phá nếp nhà, tình làng nghĩa xóm, phong tục tập quán và phong cách sống đoan trang đậm chất Việt Nam.',
      image: EXPLORE_CARDS_ASSETS.vanHoa.image,
      badge: 'Phong Tục & Đời Sống',
      tagline: '12 bài đọc song ngữ',
      expectedAsset: EXPLORE_CARDS_ASSETS.vanHoa.expectedFile,
    },
    {
      id: 'truyen-thuyet',
      title: EXPLORE_CARDS_ASSETS.truyenThuyet.titleVi,
      englishTitle: EXPLORE_CARDS_ASSETS.truyenThuyet.titleEn,
      description: 'Hào khí dân gian qua truyền thuyết Rồng Tiên, Lạc Long Quân - Âu Cơ, Vịnh Hạ Long và cổ tích ngàn năm.',
      image: EXPLORE_CARDS_ASSETS.truyenThuyet.image,
      badge: 'Huyền Sử Dân Gian',
      tagline: '8 câu chuyện sử thi',
      expectedAsset: EXPLORE_CARDS_ASSETS.truyenThuyet.expectedFile,
    },
    {
      id: 'am-thuc',
      title: EXPLORE_CARDS_ASSETS.amThuc.titleVi,
      englishTitle: EXPLORE_CARDS_ASSETS.amThuc.titleEn,
      description: 'Hương thơm của bát phở Hà Nội, bánh mì giòn rụm Sài Gòn, tách trà sen thơm ngát và phong vị ẩm thực ba miền.',
      image: EXPLORE_CARDS_ASSETS.amThuc.image,
      badge: 'Tinh Hoa Mỹ Vị',
      tagline: '15 bài đọc ẩm thực',
      expectedAsset: EXPLORE_CARDS_ASSETS.amThuc.expectedFile,
    },
    {
      id: 'le-hoi',
      title: EXPLORE_CARDS_ASSETS.leHoi.titleVi,
      englishTitle: EXPLORE_CARDS_ASSETS.leHoi.titleEn,
      description: 'Hội Lim quan họ, Tết Nguyên Đán rực rỡ, đêm hội thả đèn hoa đăng và tranh khắc gỗ Đông Hồ tràn đầy sinh khí.',
      image: EXPLORE_CARDS_ASSETS.leHoi.image,
      badge: 'Lễ Hội Truyền Thống',
      tagline: '10 bài đọc lễ hội',
      expectedAsset: EXPLORE_CARDS_ASSETS.leHoi.expectedFile,
    },
  ];

  return (
    <section id="kham-pha" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header (from design.md) */}
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="glass-pill mb-3.5 shadow-xs">
          <span className="glass-pill-dot" />
          <span>CHUYÊN ĐỀ VĂN HÓA ĐẶC SẮC</span>
        </div>
        <h2 className="font-heading font-bold text-3xl sm:text-4xl lg:text-5xl text-[#1E4B43] mb-3.5 tracking-tight">
          Bốn miền khám phá
        </h2>
        <p className="text-sm sm:text-base text-[#6B635B] leading-relaxed font-normal">
          Mỗi vùng đất một câu chuyện, mỗi từ vựng một góc nhìn Việt Nam.
        </p>
      </div>

      {/* Cards Grid (4 Topic Cards from design.md) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
        {exploreTopics.map((topic, index) => (
          <article
            key={index}
            className="heritage-card p-4 flex flex-col justify-between group cursor-pointer transition-all duration-300"
            onClick={() => onSelectCategory(topic.id)}
          >
            <div>
              {/* Card Media with rounded corner */}
              <div className="relative aspect-[4/3] w-full rounded-[14px] overflow-hidden bg-[#F6EEDC] mb-4 border border-[#E8DFCB]">
                <img
                  src={topic.image}
                  alt={topic.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-2.5 left-2.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#FBF7EE]/90 text-[#1E4B43] border border-[#E8DFCB] shadow-xs backdrop-blur-xs">
                    {topic.badge}
                  </span>
                </div>
              </div>

              {/* Title & Description */}
              <div className="space-y-1 mb-4">
                <h3 className="font-heading font-bold text-xl text-[#1E4B43] group-hover:text-[#3D6E70] transition-colors leading-snug">
                  {topic.title}
                </h3>
                <span className="text-[11px] font-semibold text-[#D9B76A] uppercase tracking-wider block">
                  {topic.englishTitle}
                </span>
                <p className="text-xs text-[#6B635B] leading-relaxed pt-1 line-clamp-3">
                  {topic.description}
                </p>
              </div>
            </div>

            {/* Card Action Button */}
            <div className="pt-3 border-t border-[#E8DFCB] flex items-center justify-between">
              <span className="text-[11px] text-[#6B635B] font-medium">
                {topic.tagline}
              </span>
              <button
                className="btn-card group-hover:bg-[#1E4B43] group-hover:text-white transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectCategory(topic.id);
                }}
              >
                <span>Khám phá</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </article>
        ))}
      </div>

    </section>
  );
};
