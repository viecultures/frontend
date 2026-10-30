import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LocalizedLink as Link } from '@/components/common/LocalizedLink';
import { Navbar } from '@/components/Navbar';
import { HomeGreetingHeader } from '../components/HomeGreetingHeader';
import { HomeContinueReadingCard } from '../components/HomeContinueReadingCard';
import { HomeVocabularySummary } from '../components/HomeVocabularySummary';
import { HomeDailyQuoteCard } from '../components/HomeDailyQuoteCard';
import { HomeWeeklyStrip } from '../components/HomeWeeklyStrip';
import { HomeSuggestedStories } from '../components/HomeSuggestedStories';
import { readReadingHistory } from '../lib/studyRoomStorage';
import {
  localDateKey,
  readStudyCalendar,
  STUDY_CALENDAR_UPDATED,
  type StudyCalendar,
} from '../lib/learningCalendarStorage';
import { useSettings } from '@/context/SettingsContext';
import { useAppNavigate } from '@/routes/useAppNavigate';
import { PATHS } from '@/routes/paths';
import type { AppUser } from '@/utils/auth-storage';
import '../home-classic.css';

interface HomePageProps {
  isLoggedIn?: boolean;
  user?: AppUser | null;
  onLogout?: () => void;
  onOpenProfile?: () => void;
}

function calculateCurrentStreak(calendar: StudyCalendar, today = new Date()): number {
  let streak = 0;
  const current = new Date(today);
  const todayKey = localDateKey(current);
  const todayEntry = calendar[todayKey];
  const todayStudied = Boolean(todayEntry && (todayEntry.reading + todayEntry.vocabulary) > 0);

  if (todayStudied) {
    streak = 1;
    current.setDate(current.getDate() - 1);
  } else {
    // Check if yesterday was studied
    current.setDate(current.getDate() - 1);
    const yesterdayKey = localDateKey(current);
    const yesterdayEntry = calendar[yesterdayKey];
    if (!yesterdayEntry || (yesterdayEntry.reading + yesterdayEntry.vocabulary) === 0) {
      return 0;
    }
  }

  // Count consecutive days going backwards
  while (true) {
    const key = localDateKey(current);
    const entry = calendar[key];
    if (entry && (entry.reading + entry.vocabulary) > 0) {
      streak += 1;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

export function HomePage({ isLoggedIn = false, user, onLogout }: HomePageProps) {
  const { t } = useTranslation('home');
  const { openSettings } = useSettings();
  const navigate = useAppNavigate();

  const account = user?.email || 'guest';
  const userName = user?.name ? user.name.split(' ')[0] : t('greeting.default_user', 'Learner');

  // Real persistent application state
  const [history, setHistory] = useState(() => readReadingHistory(account));
  const [calendar, setCalendar] = useState(() => readStudyCalendar(account));

  useEffect(() => {
    const refresh = () => {
      setHistory(readReadingHistory(account));
      setCalendar(readStudyCalendar(account));
    };

    const onUpdate = (event: Event) => {
      if ((event as CustomEvent<string>).detail === account) {
        refresh();
      }
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

  // Compute live activity streak and daily goal completion
  const streakDays = useMemo(() => calculateCurrentStreak(calendar), [calendar]);

  const { completedGoals, totalGoals } = useMemo(() => {
    const todayKey = localDateKey(new Date());
    const todayRecord = calendar[todayKey] || { reading: 0, vocabulary: 0 };
    const readingDone = todayRecord.reading > 0;
    const vocabDone = todayRecord.vocabulary > 0;
    return {
      completedGoals: (readingDone ? 1 : 0) + (vocabDone ? 1 : 0),
      totalGoals: 2,
    };
  }, [calendar]);

  const currentBookmark = history[0];

  return (
    <div className="home-page-container">
      {/* Accessible skip link */}
      <a className="home-skip-link" href="#main-study-content">
        {t('skip_content', 'Skip to study content')}
      </a>

      {/* Official Top Navbar (Preserves Mascot Logo & Controls) */}
      <Navbar
        activeView="home"
        isLoggedIn={isLoggedIn}
        user={user}
        onLogout={onLogout}
        onNavigateToSection={navigate}
        onOpenSettings={openSettings}
      />

      {/* Main Home Content Shell */}
      <main className="home-shell" id="main-study-content">
        {/* 1. Greeting Row with Streak & Today's Goal Chips */}
        <HomeGreetingHeader
          userName={userName}
          hasHistory={history.length > 0}
          streakDays={streakDays}
          completedGoals={completedGoals}
          totalGoals={totalGoals}
        />

        {/* 2. Core 2-Column Study Grid */}
        <div className="home-quick-start">
          {/* Left Col Row 1: Continue Reading Hero Card */}
          <HomeContinueReadingCard bookmark={currentBookmark} />

          {/* Left Col Row 2: Your Vocabulary Compact Summary */}
          <HomeVocabularySummary />

          {/* Right Col: Daily Quote Card (Spans Rows 1 & 2) */}
          <HomeDailyQuoteCard />
        </div>

        {/* 3. Full-width Weekly Study Progress Strip */}
        <HomeWeeklyStrip account={account} />

        {/* 4. Suggested Cultural Stories Section */}
        <HomeSuggestedStories currentId={currentBookmark?.id} />

        {/* 5. Clean Heritage Footer */}
        <footer className="home-footer-row">
          <span>{t('footer.copyright', '© 2026 VieCultures · Engrave words, Preserve cultures.')}</span>
          <Link to={PATHS.landing}>{t('footer.about', 'About VieCultures')}</Link>
        </footer>
      </main>
    </div>
  );
}

export default HomePage;
