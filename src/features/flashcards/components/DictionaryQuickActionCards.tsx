import { ArrowRight, BookOpen, Compass, Plus, Sparkles } from "lucide-react";
import { LESSONS_DATA } from "@/data/discoveryData";
import { resolveDeckCards } from "@/data/flashcardsData";
import { DeckCoverIllustration } from "./DeckCoverIllustration";

interface DictionaryQuickActionCardsProps {
  onGoToRecent: () => void;
  onExploreMore: () => void;
  onOpenCreateDeck: () => void;
}

export function DictionaryQuickActionCards({ onGoToRecent, onExploreMore, onOpenCreateDeck }: DictionaryQuickActionCardsProps) {
  return (
    <section className="vocab-actions" aria-label="Bắt đầu học từ vựng">
      <article className="vocab-featured">
        <DeckCoverIllustration category="Heritage" className="vocab-featured-image" />
        <div className="vocab-featured-content">
          <span className="vocab-featured-label"><Sparkles size={14} /> GỢI Ý CHO HÔM NAY</span>
          <h2>Một chút tiếng Anh,<br />một thoáng <em>Cố đô.</em></h2>
          <p>Khám phá kiến trúc hoàng gia Huế qua từng thẻ từ.</p>
          <div className="vocab-featured-footer">
            <button className="vocab-button vocab-button-gold" onClick={onGoToRecent}>Bắt đầu học <ArrowRight size={16} /></button>
            <span><BookOpen size={15} /> {resolveDeckCards("imperial-hue").length} thẻ từ vựng</span>
          </div>
        </div>
      </article>
      <div className="vocab-secondary-actions">
        <button className="vocab-action-tile" onClick={onExploreMore}>
          <span className="vocab-tile-icon"><Compass size={22} /></span>
          <span className="vocab-tile-copy"><strong>Khám phá bộ từ</strong><span>{LESSONS_DATA.length} bộ thẻ · 5 chủ đề văn hóa</span></span>
          <ArrowRight size={18} />
        </button>
        <button className="vocab-action-tile vocab-action-create" onClick={onOpenCreateDeck}>
          <span className="vocab-tile-icon"><Plus size={23} /></span>
          <span className="vocab-tile-copy"><strong>Tạo bộ từ của riêng bạn</strong><span>Lưu những từ bạn muốn ghi nhớ</span></span>
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}
