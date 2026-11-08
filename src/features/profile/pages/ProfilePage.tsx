import '../profile-ui.css';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft, Award, BookMarked, Check, LayoutGrid, Map, Settings } from 'lucide-react';
import { useAppNavigate } from '@/routes/useAppNavigate';
import { PATHS } from '@/routes/paths';
import { ProfileHeaderCard, CulturalPassportView, BadgesCollectionGrid, SavedVocabQuickView, SubscriptionSettingsCard, EditProfileModal } from '../components';
import { ProfileOverview, ProfileSidebar } from '../components/ProfileOverview';
import { profileService } from '../services/profileService';
import { profileApiService } from '../services/profileApiService';
import type { UserProfileData, CulturalSeal, UserBadge, RegionType } from '../types';

type TabKey = 'overview' | 'passport' | 'badges' | 'vocab' | 'subscription';
const tabKeys: TabKey[] = ['overview', 'passport', 'badges', 'vocab', 'subscription'];

export const ProfilePage: React.FC = () => {
  const { t } = useTranslation('profile');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useAppNavigate();
  const requestedTab = searchParams.get('tab');
  const activeTab: TabKey = tabKeys.includes(requestedTab as TabKey) ? requestedTab as TabKey : 'overview';
  const [selectedRegion, setSelectedRegion] = useState<RegionType | 'all'>('all');
  const [profile, setProfile] = useState<UserProfileData>(() => profileService.getProfileData());
  const [seals, setSeals] = useState<CulturalSeal[]>(() => profileService.getCulturalSeals());
  const [badges] = useState<UserBadge[]>(() => profileService.getUserBadges());
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isServerConnected, setIsServerConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const handleSealsChange = () => setSeals(profileService.getCulturalSeals());
    const handleProfileChange = () => setProfile(profileService.getProfileData());
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

  useEffect(() => {
    let mounted = true;
    profileApiService.fetchCurrentUser().then(backendUser => {
      if (!mounted) return;
      if (!backendUser) { setIsServerConnected(false); return; }
      setIsServerConnected(true);
      const mapped = profileApiService.mapBackendUserToProfile(backendUser, profileService.getProfileData());
      profileService.updateProfileData(mapped);
      setProfile(mapped);
    }).catch(() => { if (mounted) setIsServerConnected(false); });
    return () => { mounted = false; };
  }, []);

  const selectTab = (tab: TabKey) => {
    if (tab !== 'passport') setSelectedRegion('all');
    setSearchParams(tab === 'overview' ? {} : { tab });
  };
  const selectRegion = (region: RegionType) => {
    setSelectedRegion(region);
    setSearchParams({ tab: 'passport' });
  };
  const handleSaveProfile = (updates: Partial<UserProfileData>) => {
    setProfile(profileService.updateProfileData(updates));
    setToastMessage(t('profile.header.profile_saved_toast'));
    window.setTimeout(() => setToastMessage(null), 3000);
  };
  const tabs = [
    { key: 'overview', label: t('profile.dashboard.overview'), icon: LayoutGrid },
    { key: 'passport', label: t('profile.dashboard.journey_tab'), icon: Map },
    { key: 'badges', label: t('profile.dashboard.achievements_tab'), icon: Award },
    { key: 'vocab', label: t('profile.dashboard.vocab_tab'), icon: BookMarked },
    { key: 'subscription', label: t('profile.dashboard.settings_tab'), icon: Settings },
  ] as const;

  return <div className="profile-ui profile-dashboard">
    <div className="profile-shell">
      <header className="profile-page-header">
        <button type="button" className="profile-back" onClick={() => navigate(PATHS.home)} aria-label={t('profile.header.back_to_study')}><ArrowLeft aria-hidden="true" /></button>
        <div className="profile-page-heading"><h1>{t('profile.dashboard.title')}</h1><p>{t('profile.dashboard.subtitle')}</p></div>
        <img className="profile-mountains" src="/assets/profile/mountain-decoration.svg" alt="" aria-hidden="true" />
      </header>
      {isServerConnected === false && <p className="profile-storage-status">{t('profile.header.saved_locally')}</p>}
      {toastMessage && <div role="status" className="profile-toast"><Check aria-hidden="true" />{toastMessage}</div>}
      <div className="profile-dashboard-grid">
        <main className="profile-main">
          <ProfileHeaderCard profile={profile} onOpenEdit={() => setIsEditModalOpen(true)} />
          <nav className="profile-tabs" aria-label={t('profile.dashboard.tabs_label')}>{tabs.map(({ key, label, icon: Icon }) => <button key={key} type="button" aria-current={activeTab === key ? 'page' : undefined} onClick={() => selectTab(key)} className={activeTab === key ? 'active' : ''}><Icon aria-hidden="true" />{label}</button>)}</nav>
          {activeTab === 'overview' && <ProfileOverview profile={profile} seals={seals} onSelectTab={selectTab} onSelectRegion={selectRegion} />}
          {activeTab === 'passport' && <CulturalPassportView key={selectedRegion} seals={seals} profile={profile} initialRegion={selectedRegion} />}
          {activeTab === 'badges' && <BadgesCollectionGrid badges={badges} />}
          {activeTab === 'vocab' && <SavedVocabQuickView />}
          {activeTab === 'subscription' && <SubscriptionSettingsCard profile={profile} onRefreshPro={() => setProfile(profileService.getProfileData())} />}
        </main>
        <ProfileSidebar profile={profile} onSelectTab={selectTab} onOpenEdit={() => setIsEditModalOpen(true)} />
      </div>
    </div>
    <EditProfileModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} profile={profile} onSave={handleSaveProfile} />
  </div>;
};

export default ProfilePage;
