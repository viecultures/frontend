import '../profile-ui.css';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useAppNavigate } from '@/routes/useAppNavigate';
import { Award, BookMarked, Crown, Check, ArrowLeft } from 'lucide-react';
import {
  ProfileHeaderCard,
  LearningStatsGrid,
  CulturalPassportView,
  BadgesCollectionGrid,
  SavedVocabQuickView,
  SubscriptionSettingsCard,
  EditProfileModal,
} from '../components';
import { profileService } from '../services/profileService';
import { profileApiService } from '../services/profileApiService';
import type { UserProfileData, CulturalSeal, UserBadge } from '../types';
import { PATHS } from '@/routes/paths';

type TabKey = 'passport' | 'badges' | 'vocab' | 'subscription';

export const ProfilePage: React.FC = () => {
  const { t } = useTranslation('profile');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useAppNavigate();

  const tabParam = (searchParams.get('tab') as TabKey) || 'passport';
  const [activeTab, setActiveTab] = useState<TabKey>(
    ['passport', 'badges', 'vocab', 'subscription'].includes(tabParam)
      ? tabParam
      : 'passport'
  );

  const [profile, setProfile] = useState<UserProfileData>(() =>
    profileService.getProfileData()
  );
  const [seals, setSeals] = useState<CulturalSeal[]>(() =>
    profileService.getCulturalSeals()
  );
  const [badges, setBadges] = useState<UserBadge[]>(() =>
    profileService.getUserBadges()
  );

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isServerConnected, setIsServerConnected] = useState<boolean | null>(null);


  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync activeTab with URL search params
  useEffect(() => {
    const currentParam = searchParams.get('tab') as TabKey;
    if (currentParam && ['passport', 'badges', 'vocab', 'subscription'].includes(currentParam) && currentParam !== activeTab) {
      setActiveTab(currentParam);
    }
  }, [searchParams]);

  // Reactive listeners for real-time stamp and profile updates
  useEffect(() => {
    const handleSealsChange = () => {
      setSeals(profileService.getCulturalSeals());
    };
    const handleProfileChange = () => {
      setProfile(profileService.getProfileData());
    };
    window.addEventListener('seals:change', handleSealsChange);
    window.addEventListener('profile:change', handleProfileChange);
    window.addEventListener('auth:change', handleProfileChange);
    window.addEventListener('subscription:change', handleProfileChange);
    return () => {
      window.removeEventListener('seals:change', handleSealsChange);
      window.removeEventListener('profile:change', handleProfileChange);
      window.removeEventListener('auth:change', handleProfileChange);
      window.removeEventListener('subscription:change', handleProfileChange);
    };
  }, []);

  // Sync profile from backend GET /api/v1/auth/me on mount (graceful fallback)
  useEffect(() => {
    let isMounted = true;
    const syncWithBackend = async () => {
      try {
        const backendUser = await profileApiService.fetchCurrentUser();
        if (!isMounted) return;
        if (backendUser) {
          setIsServerConnected(true);
          setProfile((prev) => {
            const mapped = profileApiService.mapBackendUserToProfile(backendUser, prev);
            profileService.updateProfileData(mapped);
            return mapped;
          });
        } else {
          setIsServerConnected(false);
        }
      } catch {
        if (isMounted) setIsServerConnected(false);
      }
    };
    syncWithBackend();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectTab = (tab: TabKey) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleSaveProfile = (updates: Partial<UserProfileData>) => {
    const updated = profileService.updateProfileData(updates);
    setProfile(updated);
    showToast(t('profile.header.profile_saved_toast'));
  };

  const unlockedSealsCount = seals.filter((s) => s.isUnlocked).length;

  return (
    <div className="profile-ui w-full min-h-[85vh] text-ink-soft dark:text-warm-ivory font-sans pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6 sm:space-y-8">
        {/* Back navigation & Page breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => navigate(PATHS.home)}
            className="inline-flex items-center gap-2 text-xs font-bold text-heritage-green dark:text-antique-gold hover:underline cursor-pointer"
          >
            <ArrowLeft aria-hidden="true" className="w-4 h-4" />
            <span>{t('profile.header.back_to_study')}</span>
          </button>

          <div className="flex items-center gap-3">
            {isServerConnected === true && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>{t('profile.header.profile_synced')}</span>
              </span>
            )}
            {isServerConnected === false && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-stone-200 dark:bg-white/10 text-stone-600 dark:text-stone-400">
                <span>{t('profile.header.saved_locally')}</span>
              </span>
            )}

            <span className="text-xs font-serif font-bold text-antique-gold tracking-wider uppercase hidden sm:inline">
              {t('profile.header.breadcrumb_title')}
            </span>
          </div>
        </div>


        {/* Toast notification */}
        {toastMessage && (
          <div role="status" className="fixed top-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-heritage-green text-warm-ivory shadow-2xl border border-antique-gold flex items-center gap-2 text-xs sm:text-sm font-medium animate-in fade-in slide-in-from-top-2">
            <Check aria-hidden="true" className="w-4 h-4 text-antique-gold" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* 1. Profile Header Card */}
        <ProfileHeaderCard
          profile={profile}
          onOpenEdit={() => setIsEditModalOpen(true)}
        />

        {/* 2. Key Learning Statistics Grid */}
        <LearningStatsGrid
          profile={profile}
          unlockedSealsCount={unlockedSealsCount}
          totalSealsCount={seals.length}
        />

        {/* 3. Main Navigation Tab Bar */}
        <div className="profile-tabs flex flex-wrap items-center gap-2 border-b border-antique-gold/30 pb-2">
          <button
            type="button"
            aria-pressed={activeTab === 'passport'}
            onClick={() => handleSelectTab('passport')}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'passport'
                ? 'bg-heritage-green text-warm-ivory shadow-md border border-antique-gold/40'
                : 'text-stone-600 dark:text-stone-300 hover:bg-rice-paper dark:hover:bg-white/5'
            }`}
          >
            <Award aria-hidden="true" className="w-4 h-4 text-antique-gold" />
            <span>{t('profile.tabs.passport', { unlocked: unlockedSealsCount, total: seals.length })}</span>
          </button>

          <button
            type="button"
            aria-pressed={activeTab === 'badges'}
            onClick={() => handleSelectTab('badges')}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'badges'
                ? 'bg-heritage-green text-warm-ivory shadow-md border border-antique-gold/40'
                : 'text-stone-600 dark:text-stone-300 hover:bg-rice-paper dark:hover:bg-white/5'
            }`}
          >
            <Award aria-hidden="true" className="w-4 h-4 text-antique-gold" />
            <span>{t('profile.tabs.badges', { unlocked: badges.filter((b) => b.isUnlocked).length, total: badges.length })}</span>
          </button>

          <button
            type="button"
            aria-pressed={activeTab === 'vocab'}
            onClick={() => handleSelectTab('vocab')}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'vocab'
                ? 'bg-heritage-green text-warm-ivory shadow-md border border-antique-gold/40'
                : 'text-stone-600 dark:text-stone-300 hover:bg-rice-paper dark:hover:bg-white/5'
            }`}
          >
            <BookMarked aria-hidden="true" className="w-4 h-4 text-antique-gold" />
            <span>{t('profile.tabs.vocab', { count: profile.totalVocabMastered + profile.totalVocabLearning })}</span>
          </button>

          <button
            type="button"
            aria-pressed={activeTab === 'subscription'}
            onClick={() => handleSelectTab('subscription')}
            className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'subscription'
                ? 'bg-heritage-green text-warm-ivory shadow-md border border-antique-gold/40'
                : 'text-stone-600 dark:text-stone-300 hover:bg-rice-paper dark:hover:bg-white/5'
            }`}
          >
            <Crown aria-hidden="true" className="w-4 h-4 text-antique-gold" />
            <span>{t('profile.tabs.subscription')}</span>
          </button>
        </div>

        {/* 4. Tab Content Area */}
        <div className="pt-2">
          {activeTab === 'passport' && (
            <CulturalPassportView seals={seals} profile={profile} />
          )}

          {activeTab === 'badges' && <BadgesCollectionGrid badges={badges} />}

          {activeTab === 'vocab' && <SavedVocabQuickView />}

          {activeTab === 'subscription' && (
            <SubscriptionSettingsCard
              profile={profile}
              onRefreshPro={() => {
                const refreshed = profileService.getProfileData();
                setProfile(refreshed);
              }}
            />
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default ProfilePage;
