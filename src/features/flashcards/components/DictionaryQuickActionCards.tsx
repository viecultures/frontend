import { ArrowRight, BookOpen, Compass, Plus } from "lucide-react";
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
    <section className="vocab-actions" aria-label="Start learning vocabulary">
      <article className="vocab-featured">
        <DeckCoverIllustration category="Heritage" className="vocab-featured-image" />
        <div className="vocab-featured-content">
          <span className="vocab-featured-label"><BookOpen size={14} /> TODAY’S PICK</span>
          <h2>A little English,<br />a glimpse of <em>imperial Hue.</em></h2>
          <p>Explore Hue’s royal architecture, one flashcard at a time.</p>
          <div className="vocab-featured-footer">
            <button className="vocab-button vocab-button-gold" onClick={onGoToRecent}>Start learning <ArrowRight size={16} /></button>
            <span><BookOpen size={15} /> {resolveDeckCards("imperial-hue").length} vocabulary cards</span>
          </div>
        </div>
      </article>
      <div className="vocab-secondary-actions">
        <button className="vocab-action-tile" onClick={onExploreMore}>
          <span className="vocab-tile-icon"><Compass size={22} /></span>
          <span className="vocab-tile-copy"><strong>Explore the decks</strong><span>{LESSONS_DATA.length} decks · 5 cultural topics</span></span>
          <ArrowRight size={18} />
        </button>
        <button className="vocab-action-tile vocab-action-create" onClick={onOpenCreateDeck}>
          <span className="vocab-tile-icon"><Plus size={23} /></span>
          <span className="vocab-tile-copy"><strong>Create your own deck</strong><span>Keep the words you want to remember</span></span>
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}
