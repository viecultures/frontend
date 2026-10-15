import React from 'react';
import { ArrowUpRight, BookOpen, Compass, Layers, MessageCircle } from 'lucide-react';

const STEPS = [
  { title: 'Chọn chủ đề', description: 'Một món ăn, một miền di sản hay một câu chuyện quen thuộc.', action: 'Khám phá bài đọc', icon: Compass, view: 'discovery' },
  { title: 'Đọc & nghe', description: 'Đối chiếu song ngữ, nghe từng câu và lưu những từ muốn nhớ.', action: 'Đọc thử bài Huế', icon: BookOpen, view: '/bilingual-reader?story=imperial-hue' },
  { title: 'Ôn từ đã lưu', description: 'Lật thẻ, nhớ lại nghĩa và chọn những từ cần xem lại.', action: 'Thử một lượt ôn', icon: Layers, view: null },
  { title: 'Thử vận dụng', description: 'Diễn đạt suy nghĩ, hỏi thêm hoặc thử một tình huống với AI.', action: 'Mở AI Playground', icon: MessageCircle, view: 'playground' },
];

interface HeritageMethodologySectionProps {
  onNavigate?: (view: string) => void;
  onPreviewFlashcards?: () => void;
}

export const HeritageMethodologySection: React.FC<HeritageMethodologySectionProps> = ({ onNavigate, onPreviewFlashcards }) => {
  const chooseStep = (view: string | null) => {
    if (view === null) {
      if (onPreviewFlashcards) onPreviewFlashcards();
      else document.getElementById('flashcard-demo')?.scrollIntoView({
        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      });
      return;
    }
    if (onNavigate) onNavigate(view);
    else window.dispatchEvent(new CustomEvent('app:navigate', { detail: view }));
  };

  return (
    <section className="landing-journey landing-section" aria-labelledby="landing-journey-title">
      <div className="landing-container">
        <div className="landing-section-heading">
          <div>
            <span className="landing-eyebrow">03 / HỌC THEO NHỊP CỦA BẠN</span>
            <h2 id="landing-journey-title">Từ một câu chuyện, đến <em>một thói quen.</em></h2>
          </div>
        </div>
        <p className="landing-section-description">Bắt đầu từ điều bạn tò mò. Hiểu một câu chuyện, nhớ vài từ và thử dùng chúng.</p>
        <ol className="landing-journey-grid">
          {STEPS.map(({ title, description, action, icon: Icon, view }, index) => (
            <li key={title} className="landing-journey-step">
              <div className="landing-journey-step-top">
                <span className="landing-journey-number">0{index + 1}</span>
                <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
              </div>
              <div className="landing-journey-step-copy">
                <h3>{title}{index === 3 && <span className="landing-journey-optional">Tùy chọn</span>}</h3>
                <p>{description}</p>
                <button type="button" className="landing-text-link" onClick={() => chooseStep(view)}>{action}<ArrowUpRight size={16} aria-hidden="true" /></button>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default HeritageMethodologySection;
