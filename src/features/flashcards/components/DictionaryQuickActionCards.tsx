import { ArrowRight, BookOpen, Compass, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LESSONS_DATA } from "@/data/discoveryData";
import { resolveDeckCards } from "@/data/flashcardsData";
import { DeckCoverIllustration } from "./DeckCoverIllustration";

interface DictionaryQuickActionCardsProps {
  onGoToRecent: () => void;
  onExploreMore: () => void;
  onOpenCreateDeck: () => void;
}

export function DictionaryQuickActionCards({ onGoToRecent, onExploreMore, onOpenCreateDeck }: DictionaryQuickActionCardsProps) {
  const { t } = useTranslation('flashcards');

  return (
    <section className="vocab-actions" aria-label="Start learning vocabulary">
      <article className="vocab-featured">
        <DeckCoverIllustration category="Heritage" className="vocab-featured-image" />
        <div className="vocab-featured-content">
          <span className="vocab-featured-label">
            <BookOpen size={14} />
            {t('dictionary.todays_pick', 'TODAY’S PICK')}
          </span>
          <h2>
            {t('dictionary.featured_title_prefix', 'A little English,')}<br />
            {t('dictionary.featured_title_emphasis', 'a glimpse of imperial Hue.')}
          </h2>
          <p>{t('dictionary.featured_desc', 'Explore Hue’s royal architecture, one flashcard at a time.')}</p>
          <div className="vocab-featured-footer">
            <button className="vocab-button vocab-button-gold" onClick={onGoToRecent}>
              {t('dictionary.start_learning', 'Start learning')}
              <ArrowRight size={16} />
            </button>
            <span>
              <BookOpen size={15} />
              {t('deck_card.vocab_cards_count', { count: resolveDeckCards("imperial-hue").length, defaultValue: `${resolveDeckCards("imperial-hue").length} vocabulary cards` })}
            </span>
          </div>
        </div>
      </article>
      <div className="vocab-secondary-actions">
        <button className="vocab-action-tile" onClick={onExploreMore}>
          <span className="vocab-tile-icon"><Compass size={22} /></span>
          <span className="vocab-tile-copy">
            <strong>{t('dictionary.explore_decks', 'Explore the decks')}</strong>
            <span>{t('dictionary.explore_decks_subtitle', { count: LESSONS_DATA.length, defaultValue: `${LESSONS_DATA.length} decks · 5 cultural topics` })}</span>
          </span>
          <ArrowRight size={18} />
        </button>
        <button className="vocab-action-tile vocab-action-create" onClick={onOpenCreateDeck}>
          <span className="vocab-tile-icon"><Plus size={23} /></span>
          <span className="vocab-tile-copy">
            <strong>{t('dictionary.create_deck', 'Create your own deck')}</strong>
            <span>{t('dictionary.create_deck_subtitle', 'Keep the words you want to remember')}</span>
          </span>
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}
