import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Award, BookOpen, BookMarked, Clock3, Flame, MapPin, Pencil, Target, TrendingUp } from 'lucide-react';
import type { CulturalSeal, RegionType, UserProfileData } from '../types';

interface ProfileOverviewProps {
  profile: UserProfileData;
  seals: CulturalSeal[];
  onSelectTab: (tab: 'passport' | 'badges' | 'vocab' | 'subscription') => void;
  onSelectRegion: (region: RegionType) => void;
}

const regions: { id: RegionType; image: string }[] = [
  { id: 'north', image: '/images/landing/mu-cang-chai.webp' },
  { id: 'central', image: '/images/landing/hoi-an-lanterns.webp' },
  { id: 'south', image: '/images/calendar/heritage-saigon.webp' },
];

export const ProfileOverview: React.FC<ProfileOverviewProps> = ({ profile, seals, onSelectTab, onSelectRegion }) => {
  const { t } = useTranslation('profile');
  const stats = [
    { icon: Flame, value: profile.streakDays, label: t('profile.dashboard.streak_days'), tone: 'peach' },
    { icon: BookOpen, value: profile.totalPostsCompleted, label: t('profile.dashboard.posts_done'), tone: 'sage' },
    { icon: BookMarked, value: profile.totalVocabMastered, label: t('profile.dashboard.words_mastered'), tone: 'sand' },
    { icon: Clock3, value: (profile.totalReadTimeMinutes / 60).toLocaleString(undefined, { maximumFractionDigits: 1 }), label: t('profile.dashboard.read_hours'), tone: 'lavender' },
  ];

  return (
    <div className="profile-overview">
      <section className="profile-panel profile-progress" aria-labelledby="profile-progress-title">
        <div className="profile-section-heading"><TrendingUp aria-hidden="true" /><div><h2 id="profile-progress-title">{t('profile.dashboard.progress')}</h2><p>{t('profile.dashboard.progress_desc')}</p></div></div>
        <div className="profile-stat-list">
          {stats.map(({ icon: Icon, value, label, tone }) => <div className={`profile-stat profile-stat-${tone}`} key={label}><span className="profile-stat-icon"><Icon aria-hidden="true" /></span><div><strong>{value}</strong><span>{label}</span></div></div>)}
        </div>
        <p className="profile-progress-note">{t('profile.dashboard.words_learning', { count: profile.totalVocabLearning })}{profile.dailyTargetMinutes > 0 ? ` · ${t('profile.dashboard.daily_target', { count: profile.dailyTargetMinutes })}` : ''}</p>
      </section>

      <section className="profile-journey" aria-labelledby="profile-journey-title">
        <div className="profile-section-row"><div className="profile-section-heading"><MapPin aria-hidden="true" /><div><h2 id="profile-journey-title">{t('profile.dashboard.journey')}</h2><p>{t('profile.dashboard.journey_desc')}</p></div></div><button type="button" onClick={() => onSelectTab('passport')}>{t('profile.dashboard.view_all')} <ArrowRight aria-hidden="true" /></button></div>
        <div className="profile-regions">{regions.map(region => {
          const regionSeals = seals.filter(seal => seal.region === region.id);
          const regionName = t(`profile.dashboard.${region.id}`);
          return <button type="button" className="profile-region" key={region.id} onClick={() => onSelectRegion(region.id)} aria-label={t('profile.dashboard.region_aria', { region: regionName })} style={{ backgroundImage: `linear-gradient(180deg, transparent 35%, rgba(9, 38, 27, .78)), url('${region.image}')` }}><span className="profile-region-name"><MapPin aria-hidden="true" />{regionName}</span><span className="profile-region-count">{t('profile.dashboard.seal_count', { unlocked: regionSeals.filter(seal => seal.isUnlocked).length, total: regionSeals.length })} <ArrowRight aria-hidden="true" /></span></button>;
        })}</div>
      </section>
    </div>
  );
};

export const ProfileSidebar: React.FC<{ profile: UserProfileData; onSelectTab: ProfileOverviewProps['onSelectTab']; onOpenEdit: () => void }> = ({ profile, onSelectTab, onOpenEdit }) => {
  const { t, i18n } = useTranslation('profile');
  const today = new Date();
  const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  weekStart.setDate(weekStart.getDate() - ((weekStart.getDay() + 6) % 7));
  const week = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + index);
    return { date, future: date > today };
  });
  return <aside className="profile-sidebar" aria-label={t('profile.dashboard.overview')}>
    <section className="profile-panel profile-streak"><div className="profile-side-title"><Flame aria-hidden="true" /><h2>{t('profile.dashboard.streak')}</h2></div><p className="profile-streak-value"><strong>{profile.streakDays}</strong> {t('profile.dashboard.streak_value')}</p><div className="profile-week">{week.map(({ date, future }) => <div className="profile-day" key={date.toDateString()} aria-label={`${date.toLocaleDateString(i18n.language)}: ${t(future ? 'profile.dashboard.future_day' : 'profile.dashboard.unknown_day')}`}><span>{new Intl.DateTimeFormat(i18n.language, { weekday: 'short' }).format(date)}</span><span className={`profile-day-dot ${future ? 'future' : ''}`}>{future ? '–' : '·'}</span></div>)}</div><p className="profile-side-note">{t('profile.dashboard.unknown_history')}</p></section>
    <section className="profile-panel profile-goal"><div className="profile-side-title"><Target aria-hidden="true" /><h2>{t('profile.dashboard.goals')}</h2><button type="button" onClick={onOpenEdit} aria-label={t('profile.dashboard.edit_goal')}><Pencil aria-hidden="true" /></button></div><div className="profile-goal-line"><span>{t('profile.dashboard.study_daily')}</span><strong>{profile.dailyTargetMinutes > 0 ? t('profile.dashboard.minutes', { count: profile.dailyTargetMinutes }) : t('profile.dashboard.not_set')}</strong></div><p className="profile-side-note">{t('profile.dashboard.edit_goal_hint')}</p></section>
    <section className="profile-panel profile-achievements"><div className="profile-side-title"><Award aria-hidden="true" /><h2>{t('profile.dashboard.recent_achievements')}</h2><button type="button" onClick={() => onSelectTab('badges')} aria-label={t('profile.dashboard.all_achievements')}><ArrowRight aria-hidden="true" /></button></div><p className="profile-achievement-empty">{t('profile.dashboard.achievements_empty')}</p><button type="button" className="profile-text-link" onClick={() => onSelectTab('badges')}>{t('profile.dashboard.view_collection')} <ArrowRight aria-hidden="true" /></button></section>
  </aside>;
};
