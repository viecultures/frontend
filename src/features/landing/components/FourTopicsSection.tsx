import React from 'react';
import { ArrowUpRight, Landmark, UtensilsCrossed, Palette, Sparkles } from 'lucide-react';
import { PATHS } from '@/routes/paths';

const TOPICS = [
  { title: 'Lịch sử & di sản', english: 'History & Heritage', description: 'Những dấu xưa, những câu chuyện còn sống mãi.', image: '/images/landing/hue-citadel.jpg', icon: Landmark },
  { title: 'Ẩm thực & cà phê', english: 'Cuisine & Coffee', description: 'Một hương vị quen. Nhiều điều để khám phá.', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80', icon: UtensilsCrossed },
  { title: 'Nghệ thuật & làng nghề', english: 'Arts & Craft Villages', description: 'Tinh hoa văn hóa từ đôi bàn tay người Việt.', image: '/images/landing/bat-trang.jpg', icon: Palette },
  { title: 'Lễ hội & đời sống', english: 'Festivals & Everyday Life', description: 'Tìm lại sợi dây kết nối những thế hệ.', image: '/images/landing/hoi-an-lanterns.jpg', icon: Sparkles },
];

interface FourTopicsSectionProps {
  onNavigate?: (view: string) => void;
}

export const FourTopicsSection: React.FC<FourTopicsSectionProps> = ({ onNavigate }) => {
  const explore = () => {
    onNavigate?.(PATHS.discovery);
  };

  return (
    <section className="landing-topics landing-section" aria-labelledby="landing-topics-title">
      <div className="landing-container">
        <div className="landing-section-heading">
          <div><span className="landing-eyebrow">02 / CHỌN LỐI KHÁM PHÁ RIÊNG</span><h2 id="landing-topics-title">Việt Nam, qua từng <em>chủ đề.</em></h2></div>
          <p className="landing-topics-intro">Từ những điều thân quen đến những nét văn hóa bạn chưa từng biết. Bạn muốn bắt đầu từ đâu?</p>
        </div>
        <div className="landing-topic-grid">
          {TOPICS.map(({ title, english, description, image, icon: Icon }, index) => (
            <button key={title} type="button" className="landing-topic-card" onClick={explore} aria-label={'Khám phá chủ đề ' + title}>
              <div className="landing-topic-image"><img src={image} alt="" loading="lazy" width={600} height={720} /><span className="landing-topic-number">0{index + 1}</span><span className="landing-topic-icon"><Icon size={20} aria-hidden="true" /></span></div>
              <div className="landing-topic-body"><span>{english}</span><h3>{title}</h3><p>{description}</p><ArrowUpRight size={19} aria-hidden="true" /></div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FourTopicsSection;
