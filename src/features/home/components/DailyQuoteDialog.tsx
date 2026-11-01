import { useState, useEffect, useRef } from 'react';
import { X, Heart, ChevronDown, ArrowUpRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DailyQuoteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl?: string;
  quoteVi?: string;
  author?: string;
  authorIntro?: string;
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

const VOCAB_MEANINGS: Record<string, { ipa: string; pos: string; vi: string }> = {
  independence: {
    ipa: '/ˌɪndɪˈpendəns/',
    pos: 'noun',
    vi: 'sự độc lập, tự chủ',
  },
  freedom: {
    ipa: '/ˈfriːdəm/',
    pos: 'noun',
    vi: 'sự tự do, quyền tự do',
  },
  precious: {
    ipa: '/ˈpreʃəs/',
    pos: 'adjective',
    vi: 'quý giá, trân quý',
  },
};

export function DailyQuoteDialog({
  isOpen,
  onClose,
  imageUrl = '/images/calendar/heritage-saigon.webp',
  quoteVi = 'Không có gì quý hơn độc lập, tự do.',
  author = 'Hồ Chí Minh',
  authorIntro = 'Vietnamese revolutionary leader',
}: DailyQuoteDialogProps) {
  const { t, i18n } = useTranslation('home');
  const isVi = i18n.language === 'vi';
  const quoteId = 'heritage-saigon';

  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(() => readIsSaved(quoteId));
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Reset expansion state to collapsed summary every time dialog is opened
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
        <button
          ref={closeButtonRef}
          type="button"
          className="home-dialog-close"
          onClick={onClose}
          aria-label={t('common:close', 'Close')}
        >
          <X size={18} aria-hidden="true" />
        </button>

        <div className="home-heritage-popup">
          {/* Left column: Art, Author, Save CTA */}
          <div className="home-quote-art-column">
            <span className="home-eyebrow">
              {t('daily_quote.eyebrow_heritage', 'VIECULTURES HERITAGE')}
            </span>

            <div className="home-heritage-art-frame">
              <img
                src={imageUrl}
                alt={t('daily_quote.caption_artwork', 'Calendar illustration')}
                className="home-heritage-art-img"
              />
            </div>

            <div className="home-quote-author">
              <b>{author}</b>
              <span>{isVi ? 'Lãnh tụ cách mạng Việt Nam' : authorIntro}</span>
            </div>

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
              {t(
                'daily_quote.art_caption',
                'Calendar artwork from your reference.\nThe printed date belongs to the sample design.'
              )}
            </p>
          </div>

          {/* Right column: Quote context & breakdown */}
          <article className="home-quote-context">
            <span className="home-eyebrow">
              {t('daily_quote.eyebrow_story', 'THE STORY BEHIND THE WORDS')}
            </span>

            <h2 id="heritage-dialog-title" className="home-quote-context-title">
              {isVi ? 'Độc lập & tự do' : 'Independence & freedom'}
            </h2>

            <blockquote className="home-quote-blockquote">
              “{quoteVi}”
              <cite>— {author}</cite>
            </blockquote>

            <div className="home-english-quote">
              <p>“Nothing is more precious than independence and freedom.”</p>
              <small>English translation for this learning preview</small>
            </div>

            {/* Collapsed 20-second summary */}
            <div className="home-quote-brief">
              <span className="home-brief-label">
                {t('daily_quote.brief_label', 'IN A FEW WORDS · 20-SECOND READ')}
              </span>
              <p>
                {isVi
                  ? 'Lời của Chủ tịch Hồ Chí Minh thể hiện khát vọng độc lập, tự do của toàn dân tộc Việt Nam. Thông điệp giản dị mà sâu sắc: quyền tự quyết vận mệnh của một đất nước là điều thiêng liêng nhất.'
                  : 'Hồ Chí Minh’s words express Vietnam’s desire for independence and freedom. The message is simple: a country’s right to shape its own future is deeply precious.'}
              </p>
            </div>

            {/* Expandable detailed section */}
            <div className="home-quote-expandable">
              <button
                type="button"
                className="home-quote-more-summary"
                onClick={() => setIsExpanded((prev) => !prev)}
                aria-expanded={isExpanded}
              >
                <span>
                  {isExpanded
                    ? t('daily_quote.show_less', 'Show less')
                    : t('daily_quote.read_more', 'Read more: context & meaning')}
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
                    <h3>{t('daily_quote.who_said_it', 'Who said it?')}</h3>
                    <p>
                      {isVi
                        ? 'Chủ tịch Hồ Chí Minh là nhà lãnh đạo cách mạng Việt Nam. Cuộc đời và sự nghiệp của Người gắn liền với cuộc đấu tranh giành độc lập và hòa bình cho dân tộc.'
                        : 'Hồ Chí Minh was a Vietnamese revolutionary leader. His life and work are closely connected with Vietnam’s struggle for independence.'}
                    </p>
                  </section>

                  <section>
                    <h3>{t('daily_quote.historical_context', 'The historical context')}</h3>
                    <p>
                      This statement is associated with Hồ Chí Minh’s call for resistance during the Vietnam War. It expresses the importance of a country’s right to decide its own future. The words present{' '}
                      <button
                        type="button"
                        className="home-inline-word-btn"
                        onClick={() => setSelectedWord('independence')}
                      >
                        independence
                      </button>{' '}
                      and{' '}
                      <button
                        type="button"
                        className="home-inline-word-btn"
                        onClick={() => setSelectedWord('freedom')}
                      >
                        freedom
                      </button>{' '}
                      as values that are more important than material wealth.
                    </p>
                  </section>

                  <section>
                    <h3>{t('daily_quote.meaning', 'What do the words mean?')}</h3>
                    <p>
                      Something{' '}
                      <button
                        type="button"
                        className="home-inline-word-btn"
                        onClick={() => setSelectedWord('precious')}
                      >
                        precious
                      </button>{' '}
                      is deeply valued. Here, independence means that a country governs itself. Freedom refers to the ability to live without oppression. To understand the quotation fully, we should read it in its historical setting.
                    </p>
                  </section>

                  {/* Interactive Words To Know */}
                  <div className="home-quote-vocab-box">
                    <span className="home-vocab-box-label">
                      {t('daily_quote.words_to_know', 'WORDS TO KNOW')}
                    </span>
                    <div className="home-vocab-chip-group">
                      {['independence', 'freedom', 'precious'].map((word) => (
                        <button
                          key={word}
                          type="button"
                          className={`home-vocab-word-chip ${selectedWord === word ? 'is-active' : ''}`}
                          onClick={() => setSelectedWord(word)}
                        >
                          <span>{word}</span>
                          <ArrowUpRight size={11} aria-hidden="true" />
                        </button>
                      ))}
                    </div>

                    <p className="home-vocab-meaning-text" role="status">
                      {selectedWord && VOCAB_MEANINGS[selectedWord] ? (
                        <span>
                          <strong>{selectedWord}</strong>{' '}
                          <span className="home-ipa-text">{VOCAB_MEANINGS[selectedWord].ipa}</span> ·{' '}
                          <em>{VOCAB_MEANINGS[selectedWord].pos}</em> ·{' '}
                          {VOCAB_MEANINGS[selectedWord].vi}
                        </span>
                      ) : (
                        <span className="home-meaning-hint">
                          {t('daily_quote.tap_word_hint', 'Tap a word to see its Vietnamese meaning.')}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Editorial source draft disclaimer */}
                  <div className="home-source-draft-note">
                    <b>{t('daily_quote.draft_note_title', 'Editorial draft · source verification pending')}</b>
                    <p>
                      {t(
                        'daily_quote.draft_note_desc',
                        'This English context is sample learning content. The original historical source and exact wording still need verification before publication as a lesson.'
                      )}
                    </p>
                  </div>
                </div>
              )}

              {!isExpanded && (
                <p className="home-brief-draft-tag">
                  {t(
                    'daily_quote.brief_draft',
                    'Editorial preview · historical source verification pending.'
                  )}
                </p>
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
