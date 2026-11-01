import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpen, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { localDateKey, readStudyCalendar, STUDY_CALENDAR_UPDATED } from '../lib/learningCalendarStorage';

interface HomeStudyCalendarProps { account: string; }

function intensity(seconds: number): number {
  if (seconds <= 0) return 0;
  if (seconds < 15 * 60) return 1;
  if (seconds < 45 * 60) return 2;
  return 3;
}

export function HomeStudyCalendar({ account }: HomeStudyCalendarProps) {
  const { t, i18n } = useTranslation('home');
  const [today, setToday] = useState(() => new Date());
  const [month, setMonth] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [selected, setSelected] = useState(() => localDateKey(new Date()));
  const [calendar, setCalendar] = useState(() => readStudyCalendar(account));

  useEffect(() => {
    const refresh = () => { setToday(new Date()); setCalendar(readStudyCalendar(account)); };
    const onUpdate = (event: Event) => {
      if ((event as CustomEvent<string>).detail === account) refresh();
    };
    window.addEventListener(STUDY_CALENDAR_UPDATED, onUpdate);
    window.addEventListener('storage', refresh);
    window.addEventListener('focus', refresh);
    return () => {
      window.removeEventListener(STUDY_CALENDAR_UPDATED, onUpdate);
      window.removeEventListener('storage', refresh);
      window.removeEventListener('focus', refresh);
    };
  }, [account]);

  const locale = i18n.language.startsWith('vi') ? 'vi-VN' : 'en-US';
  const todayKey = localDateKey(today);
  const firstWeekday = (month.getDay() + 6) % 7;
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cells = Array.from({ length: firstWeekday + daysInMonth }, (_, index) => {
    const day = index - firstWeekday + 1;
    return day > 0 ? new Date(month.getFullYear(), month.getMonth(), day) : null;
  });
  const selectedDay = calendar[selected] || { reading: 0, vocabulary: 0 };
  const total = selectedDay.reading + selectedDay.vocabulary;
  const canGoNext = month.getFullYear() < today.getFullYear() ||
    (month.getFullYear() === today.getFullYear() && month.getMonth() < today.getMonth());
  const changeMonth = (offset: number) => {
    const next = new Date(month.getFullYear(), month.getMonth() + offset, 1);
    setMonth(next);
    setSelected(localDateKey(offset > 0 && next.getFullYear() === today.getFullYear() && next.getMonth() === today.getMonth() ? today : next));
  };
  const formatDuration = (seconds: number) => seconds <= 0
    ? t('study_calendar.no_time', 'No study time')
    : seconds < 60
      ? t('study_calendar.under_minute', '<1 min')
      : t('study_calendar.minutes', { count: Math.floor(seconds / 60), defaultValue: `${Math.floor(seconds / 60)} min` });
  const dateLabel = (key: string) => new Date(`${key}T12:00:00`).toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' });

  return <section className="home-study-calendar home-room-panel" aria-labelledby="home-study-calendar-title">
    <div className="home-study-calendar-heading">
      <p className="home-room-eyebrow">{t('study_calendar.eyebrow', 'YOUR LEARNING JOURNEY')}</p>
      <h2 id="home-study-calendar-title">{t('study_calendar.title', 'Study calendar')}</h2>
      <p>{t('study_calendar.description', 'See the time you spent reading and practising words.')}</p>
    </div>

    <div className="home-study-calendar-month">
      <h3>{month.toLocaleDateString(locale, { month: 'long', year: 'numeric' })}</h3>
      <div>
        <button type="button" onClick={() => changeMonth(-1)} aria-label={t('study_calendar.previous', 'Previous month')}><ChevronLeft size={18} /></button>
        <button type="button" onClick={() => changeMonth(1)} disabled={!canGoNext} aria-label={t('study_calendar.next', 'Next month')}><ChevronRight size={18} /></button>
      </div>
    </div>

    <div className="home-study-calendar-grid" role="group" aria-label={month.toLocaleDateString(locale, { month: 'long', year: 'numeric' })}>
      {Array.from({ length: 7 }, (_, index) => <span className="home-study-calendar-weekday" key={index}>{new Date(2024, 0, 1 + index).toLocaleDateString(locale, { weekday: 'short' })}</span>)}
      {cells.map((date, index) => {
        if (!date) return <span key={`blank-${index}`} aria-hidden="true" />;
        const key = localDateKey(date);
        const record = calendar[key] || { reading: 0, vocabulary: 0 };
        const seconds = record.reading + record.vocabulary;
        return <button
          key={key}
          type="button"
          className={`home-study-calendar-day level-${intensity(seconds)}${key === todayKey ? ' is-today' : ''}${key === selected ? ' is-selected' : ''}`}
          onClick={() => setSelected(key)}
          aria-pressed={key === selected}
          aria-label={`${dateLabel(key)}: ${formatDuration(seconds)}${record.reading > 0 ? `, ${t('study_calendar.reading', 'Reading')}` : ''}${record.vocabulary > 0 ? `, ${t('study_calendar.vocabulary', 'Vocabulary')}` : ''}`}
        >
          <span>{date.getDate()}</span>
          <span className="home-study-calendar-icons" aria-hidden="true">
            {record.reading > 0 && <BookOpen size={11} />}
            {record.vocabulary > 0 && <Layers size={11} />}
          </span>
        </button>;
      })}
    </div>

    <div className="home-study-calendar-detail" aria-live="polite">
      <div><strong>{dateLabel(selected)}</strong><strong>{formatDuration(total)}</strong></div>
      {total > 0 ? <p>
        {selectedDay.reading > 0 && <span><BookOpen size={15} aria-hidden="true" /> {t('study_calendar.reading', 'Reading')} · {formatDuration(selectedDay.reading)}</span>}
        {selectedDay.vocabulary > 0 && <span><Layers size={15} aria-hidden="true" /> {t('study_calendar.vocabulary', 'Vocabulary')} · {formatDuration(selectedDay.vocabulary)}</span>}
      </p> : <p>{t('study_calendar.empty', 'No learning activity recorded for this day.')}</p>}
    </div>
    <div className="home-study-calendar-legend" aria-label={t('study_calendar.legend', 'Study time intensity')}>
      <span>{t('study_calendar.less', 'Less')}</span>
      {[0, 1, 2, 3].map(level => <span key={level} className={`home-study-calendar-swatch level-${level}`} aria-hidden="true" />)}
      <span>{t('study_calendar.more', 'More')}</span>
    </div>
  </section>;
}
