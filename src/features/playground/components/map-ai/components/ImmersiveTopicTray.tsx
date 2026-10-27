/**
 * ImmersiveTopicTray
 *
 * One-click cultural conversation starter drawer for Playground Screen #03.
 * Provides curated discussion topics for Vietnamese cultural heritage, cuisine, geography, and legends.
 * - Topic controls use Lucide icons for geography, reading, food, and nature.
 */

import React, { useState } from 'react';
import {
  Compass,
  BookOpen,
  Utensils,
  Globe,
  Mountain,
  ChevronDown,
  X,
} from 'lucide-react';

export interface CulturalTopicItem {
  id: string;
  title: string;
  description: string;
  prompt: string;
  category: 'heritage' | 'cuisine' | 'nature' | 'history';
  provinceId?: string;
  landmarkId?: string;
}

export interface ImmersiveTopicTrayProps {
  onSelectTopic: (topic: CulturalTopicItem) => void;
  disabled?: boolean;
  selectedProvinceName?: string;
  className?: string;
}

const CURATED_TOPICS: CulturalTopicItem[] = [
  {
    id: 'ha-long-bay',
    title: 'Vịnh Hạ Long & Truyền thuyết Rồng',
    description: 'Khám phá kỳ quan thiên nhiên thế giới tại Quảng Ninh.',
    prompt: 'Kể cho tôi nghe về truyền thuyết Rồng hạ xuống Vịnh Hạ Long và cảnh quan hang động độc đáo nơi đây bằng tiếng Anh nhé.',
    category: 'nature',
    provinceId: 'quang-ninh',
    landmarkId: 'ha-long-bay',
  },
  {
    id: 'son-doong-cave',
    title: 'Sơn Đoòng: Kỳ Quan Hang Động',
    description: 'Hành trình thám hiểm hang động tự nhiên lớn nhất thế giới tại Quảng Bình.',
    prompt: 'Hãy giới thiệu về vẻ đẹp hùng vĩ và hệ sinh thái độc đáo bên trong hang Sơn Đoòng bằng tiếng Anh.',
    category: 'nature',
    provinceId: 'quang-binh',
    landmarkId: 'son-doong',
  },
  {
    id: 'hue-citadel',
    title: 'Đại Nội Huế & Nhã Nhạc Cung Đình',
    description: 'Di sản văn hóa triều Nguyễn và ẩm thực cung đình Huế.',
    prompt: 'Hãy kể về lịch sử Kinh thành Huế và nghệ thuật Nhã nhạc cung đình Huế bằng tiếng Anh.',
    category: 'history',
    provinceId: 'thua-thien-hue',
    landmarkId: 'hue-citadel',
  },
  {
    id: 'hoi-an-ancient-town',
    title: 'Phố Cổ Hội An & Đèn Lồng',
    description: 'Thương cảng quốc tế thế kỷ 16 và di sản đèn lồng.',
    prompt: 'Hãy giới thiệu nét quyến rũ của phố cổ Hội An và các món ăn như cao lầu, mì Quảng bằng tiếng Anh.',
    category: 'heritage',
    provinceId: 'quang-nam',
    landmarkId: 'hoi-an-ancient-town',
  },
  {
    id: 'pho-hanoi',
    title: 'Ẩm Thực Phở Hà Nội',
    description: 'Nét tinh tế ẩm thực nghìn năm văn hiến Thủ đô.',
    prompt: 'Kể cho tôi về nét tinh hoa ẩm thực Phở Hà Nội và văn hóa ẩm thực phố cổ bằng tiếng Anh.',
    category: 'cuisine',
    provinceId: 'ha-noi',
    landmarkId: 'ha-noi-old-quarter',
  },
  {
    id: 'fansipan-peak',
    title: 'Đỉnh Fansipan - Nóc Nhà Đông Dương',
    description: 'Hành trình chinh phục đỉnh cao 3.143m tại Sa Pa.',
    prompt: 'Chia sẻ về hành trình chạm đỉnh Fansipan và văn hóa các dân tộc vùng cao Sa Pa bằng tiếng Anh.',
    category: 'nature',
    provinceId: 'lao-cai',
    landmarkId: 'fansipan',
  },
];

export const ImmersiveTopicTray: React.FC<ImmersiveTopicTrayProps> = ({
  onSelectTopic,
  disabled = false,
  selectedProvinceName,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredTopics = activeCategory === 'all'
    ? CURATED_TOPICS
    : CURATED_TOPICS.filter((t) => t.category === activeCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'cuisine':
        return <Utensils className="w-3.5 h-3.5" />;
      case 'nature':
        return <Mountain className="w-3.5 h-3.5" />;
      case 'history':
        return <BookOpen className="w-3.5 h-3.5" />;
      default:
        return <Globe className="w-3.5 h-3.5" />;
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-heritage-green text-gray-200 hover:text-antique-gold border border-white/10 text-xs font-medium transition-all cursor-pointer shadow-sm disabled:opacity-50"
        title="Gợi ý chủ đề khám phá văn hóa"
        aria-expanded={isOpen}
      >
        <Compass className="w-3.5 h-3.5 text-antique-gold" />
        <span>Gợi ý chủ đề</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Modal Tray */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content */}
          <div className="absolute left-0 top-full mt-2 w-80 sm:w-96 rounded-2xl bg-[#0c1815]/95 border border-antique-gold/30 shadow-2xl z-50 p-4 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-white/10 mb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-antique-gold" />
                <h3 className="text-xs font-serif font-bold text-white">
                  Chủ Đề Khám Phá Văn Hóa
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Context Notice if Province Selected */}
            {selectedProvinceName && (
              <div className="mb-2.5 px-2.5 py-1.5 rounded-lg bg-heritage-green/40 border border-antique-gold/30 text-[11px] text-antique-bright flex items-center justify-between">
                <span>Đang khám phá: <strong>{selectedProvinceName}</strong></span>
              </div>
            )}

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 mb-3 overflow-x-auto pb-1">
              {[
                { id: 'all', label: 'Tất cả' },
                { id: 'nature', label: 'Thiên nhiên' },
                { id: 'heritage', label: 'Di sản' },
                { id: 'cuisine', label: 'Ẩm thực' },
                { id: 'history', label: 'Lịch sử' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-colors cursor-pointer shrink-0 ${
                    activeCategory === cat.id
                      ? 'bg-antique-gold text-[#0A1612] font-semibold'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Topic Cards List */}
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {filteredTopics.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => {
                    onSelectTopic(topic);
                    setIsOpen(false);
                  }}
                  className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-heritage-green/50 border border-white/5 hover:border-antique-gold/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="p-1 rounded-md bg-antique-gold/20 text-antique-gold">
                      {getCategoryIcon(topic.category)}
                    </span>
                    <span className="text-xs font-semibold text-white group-hover:text-antique-bright transition-colors">
                      {topic.title}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 line-clamp-1 pl-7">
                    {topic.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ImmersiveTopicTray;
