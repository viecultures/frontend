import { VietnamMap } from '@/components/map/VietnamMap';
import { VIETNAM_34_PROVINCES } from '@/data/vietnamMapData';
import type { DiscoveryLesson } from '../lib/catalog';

export default function DiscoveryProvinceBrowser({ selected, onSelect, catalog }: {
  selected: string;
  onSelect: (id: string, name: string) => void;
  catalog: DiscoveryLesson[];
}) {
  return (
    <aside className="discovery-geography" aria-label="Cultural map of Vietnam">
      <label htmlFor="discovery-province">Choose a place</label>
      <select id="discovery-province" value={selected} onChange={event => {
        const province = VIETNAM_34_PROVINCES.find(item => item.id === event.target.value);
        onSelect(province?.id || '', province?.name || '');
      }}>
        <option value="">All places</option>
        {[...VIETNAM_34_PROVINCES].sort((a, b) => a.name.localeCompare(b.name, 'vi')).map(province => (
          <option key={province.id} value={province.id}>{province.name} ({catalog.filter(item => item.provinceId === province.id).length})</option>
        ))}
      </select>
      <div className="discovery-map">
        <VietnamMap selectedProvinceId={selected || null} onSelectProvince={province => onSelect(province?.id || '', province?.name || '')}
          showRegionTabs={false} showPoiPins={false} showTooltip showLabels showControls />
      </div>
      <p>Select a place on the map or choose its name to find stories.</p>
    </aside>
  );
}
