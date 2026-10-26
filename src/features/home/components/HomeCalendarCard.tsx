import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Heart, ZoomIn, X, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { CALENDAR_CARDS, createTodayCalendarCard, type CalendarCardItem } from '../data/calendarData';

const FAVORITES_STORAGE_KEY = 'viecultures_calendar_favorites';

function readFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveFavorites(favorites: Set<string>): void {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(Array.from(favorites)));
  } catch {
    // Ignore storage errors in private mode
  }
}

export function HomeCalendarCard() {
  const [cards] = useState<CalendarCardItem[]>(() => {
    const todayCard = createTodayCalendarCard();
    return [todayCard, ...CALENDAR_CARDS];
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState<Set<string>>(readFavorites);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const [mascotBubble, setMascotBubble] = useState<string | null>(null);

  const currentCard = cards[currentIndex] || cards[0];
  const isLiked = favorites.has(currentCard.id);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : cards.length - 1));
  }, [cards.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev < cards.length - 1 ? prev + 1 : 0));
  }, [cards.length]);

  const toggleFavorite = useCallback(() => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(currentCard.id)) {
        next.delete(currentCard.id);
      } else {
        next.add(currentCard.id);
      }
      saveFavorites(next);
      return next;
    });
  }, [currentCard.id]);

  // Mascot playful interaction
  const handleMascotClick = () => {
    const greetings = [
      'Have a delightful study day!',
      'Mỗi ngày một trang lịch, một câu nói hay!',
      'Hôm nay bạn đã ôn từ vựng chưa?',
      'Keep learning & stay inspired!',
    ];
    const picked = greetings[Math.floor(Math.random() * greetings.length)];
    setMascotBubble(picked);
    setTimeout(() => setMascotBubble(null), 3000);
  };

  // Keyboard navigation when user is focused within the card
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isZoomOpen) {
        if (e.key === 'Escape') setIsZoomOpen(false);
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'ArrowRight') handleNext();
        return;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext, isZoomOpen]);

  return (
    <section
      className="home-room-calendar home-room-panel"
      aria-label="Daily Quote & Calendar"
    >
      {/* 3 Spiral Notebook Rings on the top edge */}
      <div className="home-calendar-rings" aria-hidden="true">
        <span className="home-calendar-ring home-calendar-ring-1" />
        <span className="home-calendar-ring home-calendar-ring-2" />
        <span className="home-calendar-ring home-calendar-ring-3" />
      </div>

      {/* Header matching format from Image 3 */}
      <div className="home-calendar-header">
        <div className="home-calendar-header-titles">
          <h2>Daily Quote</h2>
          <p className="home-calendar-creator">
            Created by{' '}
            <span className="home-calendar-creator-highlight">
              {currentCard.creator}
            </span>
          </p>
        </div>

        {/* Circular Pagination Controls < > */}
        <div className="home-calendar-nav-controls">
          <button
            type="button"
            className="home-calendar-nav-btn"
            onClick={handlePrev}
            aria-label="Previous calendar day"
            title="Trang trước (Previous card)"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="home-calendar-nav-btn"
            onClick={handleNext}
            aria-label="Next calendar day"
            title="Trang sau (Next card)"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Central Visual Artwork Frame */}
      <div className="home-calendar-artwork-frame">
        <div
          className="home-calendar-image-wrap group"
          onClick={() => setIsZoomOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsZoomOpen(true);
            }
          }}
          aria-label={`View full size: ${currentCard.title}`}
          title="Bấm để xem phóng to chi tiết / Click to expand"
        >
          <img
            src={currentCard.imageUrl}
            alt={currentCard.title}
            className="home-calendar-image"
            loading="lazy"
          />

          {/* Zoom hint overlay on hover */}
          <span className="home-calendar-zoom-hint" aria-hidden="true">
            <ZoomIn size={16} />
          </span>

          {/* Quick Date Badge for context */}
          <div className="home-calendar-badge">
            <CalendarIcon size={12} aria-hidden="true" />
            <span>{currentCard.dateSolar.day}/{currentCard.dateSolar.monthYear.replace('Tháng ', '')}</span>
          </div>
        </div>

        {/* Mascot Character on bottom-left corner */}
        <div
          className="home-calendar-mascot"
          onClick={(e) => {
            e.stopPropagation();
            handleMascotClick();
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleMascotClick();
            }
          }}
          aria-label="Mascot companion"
          title="Chào bạn! Bấm vào để nghe lời chúc từ linh vật"
        >
          <img
            src={'/brand/viecultures-mascot-logo.png'}
            alt=""
            aria-hidden="true"
          />

          {/* Speech bubble on click */}
          {mascotBubble && (
            <div className="home-calendar-bubble" role="status">
              <Sparkles size={12} className="inline mr-1" aria-hidden="true" />
              {mascotBubble}
            </div>
          )}
        </div>
      </div>

      {/* Page indicator dots */}
      <div className="home-calendar-dots" aria-label="Danh sách trang lịch">
        {cards.map((card, idx) => (
          <button
            key={card.id}
            type="button"
            className={`home-calendar-dot ${idx === currentIndex ? 'is-active' : ''}`}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Chuyển đến trang ${idx + 1}: ${card.title}`}
          />
        ))}
      </div>

      {/* Full-view Lightbox Modal */}
      {isZoomOpen && (
        <div
          className="home-calendar-modal-backdrop"
          onClick={() => setIsZoomOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Calendar Card Detail"
        >
          <div
            className="home-calendar-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="home-calendar-modal-close"
              onClick={() => setIsZoomOpen(false)}
              aria-label="Đóng xem chi tiết"
            >
              <X size={20} aria-hidden="true" />
            </button>

            <div className="home-calendar-modal-body">
              <div className="home-calendar-modal-image-col">
                <img
                  src={currentCard.imageUrl}
                  alt={currentCard.title}
                  className="home-calendar-modal-img"
                />
              </div>

              <div className="home-calendar-modal-info-col">
                <div className="home-calendar-modal-header">
                  <span className="home-calendar-modal-creator">
                    Created by {currentCard.creator}
                  </span>
                  <h3>{currentCard.title}</h3>
                </div>

                <div className="home-calendar-modal-dates">
                  <div className="home-calendar-modal-solar">
                    <span className="solar-day">{currentCard.dateSolar.day}</span>
                    <div>
                      <strong>{currentCard.dateSolar.weekday}</strong>
                      <p>{currentCard.dateSolar.monthYear}</p>
                    </div>
                  </div>
                  <div className="home-calendar-modal-lunar">
                    <span className="lunar-tag">Âm lịch</span>
                    <p>{currentCard.dateLunar}</p>
                  </div>
                </div>

                <div className="home-calendar-modal-quote">
                  <p className="quote-text">{currentCard.quote}</p>
                  {currentCard.authorQuote && (
                    <p className="quote-author">— {currentCard.authorQuote}</p>
                  )}
                </div>

                <div className="home-calendar-modal-actions">
                  <button
                    type="button"
                    className={`home-room-primary ${isLiked ? 'opacity-90' : ''}`}
                    onClick={toggleFavorite}
                  >
                    <Heart
                      size={16}
                      className={isLiked ? 'fill-current' : ''}
                      aria-hidden="true"
                    />
                    <span>{isLiked ? 'Đã lưu vào yêu thích' : 'Lưu câu nói này'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
