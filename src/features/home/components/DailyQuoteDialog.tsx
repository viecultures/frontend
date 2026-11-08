import { useState, useEffect, useRef } from 'react';
import { X, Heart, ChevronDown, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { DailyQuoteItem, DailyQuoteVocabItem } from '../data/dailyQuotesNovember';

interface DailyQuoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  quote?: DailyQuoteItem;
  onPrevDay?: () => void;
  onNextDay?: () => void;
  isToday?: boolean;
  onToday?: () => void;
  imageUrl?: string;
  quoteVi?: string;
  author?: string;
  authorIntro?: string;
  creator?: string;
}

const FAVORITES_STORAGE_KEY = 'viecultures_calendar_favorites';

function readIsSaved(quoteId: string): boolean {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    const set = raw ? new Set(JSON.parse(raw)) : new Set();
    return set.has(quoteId);
  } catch {
    return false;
  }
}

function saveQuoteFavorite(quoteId: string, shouldSave: boolean): void {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    const set = raw ? new Set(JSON.parse(raw)) : new Set();
    if (shouldSave) {
      set.add(quoteId);
    } else {
      set.delete(quoteId);
    }
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch {
    // Ignore private browsing storage limitations
  }
}

export function DailyQuoteDialog({
  isOpen,
  onClose,
  quote,
  onPrevDay,
  onNextDay,
  isToday = true,
  onToday,
  imageUrl = '/images/map-thumb/ha-giang.jpg',
  quoteVi = 'Không có gì quý hơn độc lập, tự do.',
  author = 'Hồ Chí Minh',
  authorIntro = 'Vietnamese revolutionary leader',
  creator = 'VieCultures Daily',
}: DailyQuoteDialogProps) {
  const { t, i18n } = useTranslation('home');
  const isVi = i18n.language === 'vi';
  const quoteId = quote?.id ?? 'heritage-saigon';

  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(() => readIsSaved(quoteId));
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Fallback / mapped content fields
  const finalImageUrl = quote?.artworkUrl || imageUrl;
  const finalQuoteVi = quote?.quoteVi || quoteVi;
  const finalQuoteEn = quote?.quoteEn || 'Nothing is more precious than independence and freedom.';
  const finalAuthor = quote?.author || author;
  const finalAuthorIntro = quote?.authorIntro || authorIntro;
  const finalCreator = quote?.creator || creator;
  const finalTopic = isVi
    ? (quote?.topicVi || 'Độc lập & tự do')
    : (quote?.topicEn || 'Independence & freedom');
  const finalSummary = isVi
    ? (quote?.summary20sVi || 'Lời của Chủ tịch Hồ Chí Minh thể hiện khát vọng độc lập, tự do của toàn dân tộc Việt Nam. Thông điệp giản dị mà sâu sắc: quyền tự quyết vận mệnh của một đất nước là điều thiêng liêng nhất.')
    : (quote?.summary20sEn || 'Hồ Chí Minh’s words express Vietnam’s desire for independence and freedom. The message is simple: a country’s right to shape its own future is deeply precious.');

  // The extended section is purely English learning context (no i18n needed)
  const extendedWhoSaidIt = quote?.whoSaidItEn || authorIntro || 'A distinguished cultural voice in Vietnamese history.';
  const extendedHistoricalContext = quote?.historicalContextEn || 'Historical and cultural background of this traditional Vietnamese expression.';
  const extendedMeaning = quote?.meaningEn || 'In-depth linguistic insight into the values and spirit reflected in these words.';

  const vocabItems: DailyQuoteVocabItem[] = quote?.vocabulary && quote.vocabulary.length > 0
    ? quote.vocabulary
    : [
        { word: 'independence', ipa: '/ˌɪndɪˈpendəns/', pos: 'noun', meaningVi: 'sự độc lập, tự chủ' },
        { word: 'freedom', ipa: '/ˈfriːdəm/', pos: 'noun', meaningVi: 'sự tự do, quyền tự do' },
        { word: 'precious', ipa: '/ˈpreʃəs/', pos: 'adjective', meaningVi: 'quý giá, trân quý' },
      ];

  const selectedVocab = vocabItems.find(
    (item) => item.word.toLowerCase() === selectedWord?.toLowerCase()
  );

  // Reset expansion state to collapsed summary every time dialog is opened or quote changes
  useEffect(() => {
    if (isOpen) {
      setIsExpanded(false);
      setSelectedWord(null);
      setIsSaved(readIsSaved(quoteId));
      closeButtonRef.current?.focus();
    }
  }, [isOpen, quoteId]);

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleToggleSave = () => {
    const nextSaved = !isSaved;
    setIsSaved(nextSaved);
    saveQuoteFavorite(quoteId, nextSaved);
    const msg = nextSaved
      ? t('daily_quote.saved_toast', 'Quote saved on this device.')
      : t('daily_quote.removed_toast', 'Quote removed from saved items.');
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  if (!isOpen) return null;

  return (
    <div
      className="home-dialog-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="home-dialog home-heritage-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="heritage-dialog-title"
      >
        {/* Top Header Bar: Clean 3-part layout (Left: Eyebrow + Location, Center: Prev/Today/Next, Right: Close) */}
        <div className="home-dialog-header">
          <div className="home-dialog-header-left">
            <span className="home-eyebrow">
              {t('daily_quote.eyebrow_heritage', 'VIECULTURES HERITAGE')}
            </span>
            {quote?.locationName && (
              <span className="home-dialog-location-badge">
                {quote.locationName}
              </span>
            )}
          </div>

          {(onPrevDay || onNextDay) && (
            <div className="home-dialog-nav-bar" role="group" aria-label="Navigate date">
              <button
                type="button"
                className="home-dialog-nav-btn"
                onClick={onPrevDay}
                aria-label="Previous day"
                title="Previous day"
              >
                <ChevronLeft size={16} aria-hidden="true" />
              </button>
              {onToday && !isToday && (
                <button
                  type="button"
                  className="home-dialog-today-btn"
                  onClick={onToday}
                  title="Back to today"
                >
                  {t('daily_quote.today', 'Today')}
                </button>
              )}
              <button
                type="button"
                className="home-dialog-nav-btn"
                onClick={onNextDay}
                aria-label="Next day"
                title="Next day"
              >
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            </div>
          )}

          <button
            ref={closeButtonRef}
            type="button"
            className="home-dialog-close"
            onClick={onClose}
            aria-label={t('common:close', 'Close')}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div className="home-heritage-popup">
          {/* Left column: Art, Author, Save CTA */}
          <div className="home-quote-art-column">
            <div className="home-heritage-art-frame">
              <img
                src={finalImageUrl}
                alt={t('daily_quote.caption_artwork', 'Calendar illustration')}
                className="home-heritage-art-img"
              />
            </div>

            <div className="home-quote-author">
              <b>{finalAuthor}</b>
              <span>{finalAuthorIntro}</span>
            </div>

            {finalCreator && (
              <p className="home-dialog-curator">
                {t('daily_quote.created_by', 'Created by')}{' '}
                <b>{finalCreator}</b>
              </p>
            )}

            <button
              type="button"
              className={`home-save-quote-btn ${isSaved ? 'is-saved' : ''}`}
              onClick={handleToggleSave}
              aria-pressed={isSaved}
            >
              <Heart
                size={15}
                className={isSaved ? 'fill-current text-lotus-pink' : ''}
                aria-hidden="true"
              />
              <span>
                {isSaved
                  ? t('daily_quote.saved_quote', 'Quote saved')
                  : t('daily_quote.save_quote', 'Save this quote')}
              </span>
            </button>

            <p className="home-art-caption">
              {t('daily_quote.art_caption', 'Vietnamese cultural heritage and scenic landscape.')}
            </p>
          </div>

          {/* Right column: Quote context & breakdown */}
          <article className="home-quote-context">
            <h2 id="heritage-dialog-title" className="home-quote-context-title">
              {finalTopic}
            </h2>

            <blockquote className="home-quote-blockquote">
              “{finalQuoteVi}”
              <cite>{finalAuthor}</cite>
            </blockquote>

            <div className="home-english-quote">
              <p>“{finalQuoteEn}”</p>
              <small>English translation for this learning preview</small>
            </div>

            {/* Collapsed 20-second summary */}
            <div className="home-quote-brief">
              <span className="home-brief-label">
                {t('daily_quote.brief_label', 'IN A FEW WORDS · 20-SECOND READ')}
              </span>
              <p>{finalSummary}</p>
            </div>

            {/* Expandable detailed section - Pure English Learning Context (No i18n needed) */}
            <div className="home-quote-expandable">
              <button
                type="button"
                className="home-quote-more-summary"
                onClick={() => setIsExpanded((prev) => !prev)}
                aria-expanded={isExpanded}
              >
                <span>
                  {isExpanded
                    ? 'Show less'
                    : 'Read more: context & meaning'}
                </span>
                <ChevronDown
                  size={16}
                  className={`home-chevron-toggle ${isExpanded ? 'is-rotated' : ''}`}
                  aria-hidden="true"
                />
              </button>

              {isExpanded && (
                <div className="home-quote-expanded-body">
                  <section>
                    <h3>Who said it?</h3>
                    <p>{extendedWhoSaidIt}</p>
                  </section>

                  <section>
                    <h3>The historical context</h3>
                    <p>{extendedHistoricalContext}</p>
                  </section>

                  <section>
                    <h3>What do the words mean?</h3>
                    <p>{extendedMeaning}</p>
                  </section>

                  {/* Interactive Words To Know */}
                  <div className="home-quote-vocab-box">
                    <span className="home-vocab-box-label">
                      WORDS TO KNOW
                    </span>
                    <div className="home-vocab-chip-group">
                      {vocabItems.map((item) => (
                        <button
                          key={item.word}
                          type="button"
                          className={`home-vocab-word-chip ${selectedWord === item.word ? 'is-active' : ''}`}
                          onClick={() => setSelectedWord(item.word)}
                        >
                          <span>{item.word}</span>
                          <ArrowUpRight size={11} aria-hidden="true" />
                        </button>
                      ))}
                    </div>

                    <p className="home-vocab-meaning-text" role="status">
                      {selectedVocab ? (
                        <span>
                          <strong>{selectedVocab.word}</strong>{' '}
                          <span className="home-ipa-text">{selectedVocab.ipa}</span> ·{' '}
                          <em>{selectedVocab.pos}</em> ·{' '}
                          {selectedVocab.meaningVi}
                        </span>
                      ) : (
                        <span className="home-meaning-hint">
                          Tap a word to see its pronunciation & meaning.
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </article>
        </div>

        {/* Transient save toast */}
        {toastMessage && (
          <div className="home-dialog-toast" role="status">
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
}
