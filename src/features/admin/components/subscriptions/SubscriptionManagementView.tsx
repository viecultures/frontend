import React, { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BarChart3, Sliders, CreditCard } from 'lucide-react';
import { SubscriptionOverviewTab } from './SubscriptionOverviewTab';
import { SubscriptionConfigTab } from './SubscriptionConfigTab';
import type { SubscriptionSubTab } from '../../types/adminSubscriptionTypes';

export const SubscriptionManagementView: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeSubTab: SubscriptionSubTab = useMemo(() => {
    const tab = searchParams.get('tab');
    if (tab === 'config') {
      return 'config';
    }
    return 'overview';
  }, [searchParams]);

  const handleTabChange = (tab: SubscriptionSubTab) => {
    try {
      setSearchParams({ tab });
    } catch (err: unknown) {
      console.error('[SubscriptionManagementView] Error changing subscription subtab:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-tab Navigation Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-antique-gold/20">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-heritage-green/10 dark:bg-antique-gold/15 text-heritage-green dark:text-antique-gold border border-antique-gold/30 shadow-sm">
            <CreditCard className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-xl text-heritage-green dark:text-antique-bright">
              Quản lý Gói cước & Đơn đăng ký hội viên
            </h1>
            <p className="text-xs text-text-muted">
              Quản trị toàn diện chu kỳ doanh thu, đối soát phê duyệt đơn chuyển khoản và cấu hình quyền lợi hội viên.
            </p>
          </div>
        </div>

        {/* Tab Switcher Buttons */}
        <div className="inline-flex p-1.5 rounded-2xl bg-rice-paper dark:bg-heritage-dark/60 border border-antique-gold/30 shadow-sm self-start sm:self-auto">
          <button
            type="button"
            onClick={() => handleTabChange('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'overview'
                ? 'bg-heritage-green text-warm-ivory shadow-sm'
                : 'text-text-muted hover:text-heritage-green dark:hover:text-warm-ivory hover:bg-black/5 dark:hover:bg-white/5'
            }`}
            aria-selected={activeSubTab === 'overview'}
            role="tab"
          >
            <BarChart3 className="w-4 h-4 text-antique-gold" aria-hidden="true" />
            <span>Tổng quan & Duyệt đơn</span>
          </button>

          <button
            type="button"
            onClick={() => handleTabChange('config')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              activeSubTab === 'config'
                ? 'bg-heritage-green text-warm-ivory shadow-sm'
                : 'text-text-muted hover:text-heritage-green dark:hover:text-warm-ivory hover:bg-black/5 dark:hover:bg-white/5'
            }`}
            aria-selected={activeSubTab === 'config'}
            role="tab"
          >
            <Sliders className="w-4 h-4 text-antique-gold" aria-hidden="true" />
            <span>Cấu hình gói cước</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      <div role="tabpanel">
        {activeSubTab === 'overview' ? (
          <SubscriptionOverviewTab />
        ) : (
          <SubscriptionConfigTab />
        )}
      </div>
    </div>
  );
};
