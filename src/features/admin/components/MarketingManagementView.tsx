import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MarketingOverviewTab } from './marketing/MarketingOverviewTab';
import { HeritageNewsletterTab } from './marketing/HeritageNewsletterTab';
import { MarketingAutomationTab } from './marketing/MarketingAutomationTab';
import { MarketingNotificationHub } from './MarketingNotificationHub';
import { UtmCampaignBuilderTab } from './marketing/UtmCampaignBuilderTab';

export type MarketingSubTabKey =
  | 'overview'
  | 'newsletter'
  | 'automation'
  | 'notifications'
  | 'utm';

export const MarketingManagementView: React.FC = () => {
  const [searchParams] = useSearchParams();

  // Active sub-tab synchronized with query string ?tab=... (điều hướng trực tiếp từ Sidebar)
  const activeTab: MarketingSubTabKey = useMemo(() => {
    const raw = searchParams.get('tab');
    // Backward compatibility: map legacy 'broadcast' to 'newsletter'
    if (raw === 'broadcast' || raw === 'newsletter') {
      return 'newsletter';
    }
    if (raw === 'automation') {
      return 'automation';
    }
    if (raw === 'notifications') {
      return 'notifications';
    }
    if (raw === 'utm') {
      return 'utm';
    }
    if (raw === 'overview') {
      return 'overview';
    }
    // Default to 'overview'
    return 'overview';
  }, [searchParams]);

  return (
    <div className="space-y-6">
      {/* ── Sub-Tab Content View (Điều hướng phân hệ quản trị trực tiếp từ Sidebar) ── */}
      <main className="transition-opacity duration-150">
        {activeTab === 'overview' && <MarketingOverviewTab />}
        {activeTab === 'newsletter' && <HeritageNewsletterTab />}
        {activeTab === 'automation' && <MarketingAutomationTab />}
        {activeTab === 'notifications' && <MarketingNotificationHub />}
        {activeTab === 'utm' && <UtmCampaignBuilderTab />}
      </main>
    </div>
  );
};

export default MarketingManagementView;
