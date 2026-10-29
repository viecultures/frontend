import { useTranslation } from 'react-i18next';
import { VietnamMap } from '@/components/map/VietnamMap';
import { VIETNAM_34_PROVINCES } from '@/data/vietnamMapData';
import type { DiscoveryLesson } from '../lib/catalog';

export default function DiscoveryProvinceBrowser({ selected, onSelect, catalog }: {
  selected: string;
  onSelect: (id: string, name: string) => void;
  catalog: DiscoveryLesson[];
}) {
  const { t, i18n } = useTranslation('discovery');
  const isEn = i18n.language === 'en';

  return (
    <aside className="discovery-geography" aria-label={t('province_browser.aria_label')}>
      <label htmlFor="discovery-province">{t('province_browser.choose_place')}</label>
      <select id="discovery-province" value={selected} onChange={event => {
        const province = VIETNAM_34_PROVINCES.find(item => item.id === event.target.value);
        onSelect(province?.id || '', province?.name || '');
      }}>
        <option value="">{t('province_browser.all_places')}</option>
        {[...VIETNAM_34_PROVINCES].sort((a, b) => a.name.localeCompare(b.name, isEn ? 'en' : 'vi')).map(province => (
          <option key={province.id} value={province.id}>{province.name} ({catalog.filter(item => item.provinceId === province.id).length})</option>
        ))}
      </select>
      <div className="discovery-map">
        <VietnamMap selectedProvinceId={selected || null} onSelectProvince={province => onSelect(province?.id || '', province?.name || '')}
          showRegionTabs={false} showPoiPins={false} showTooltip showLabels showControls />
      </div>
      <p>{t('province_browser.instruction')}</p>
    </aside>
  );
}