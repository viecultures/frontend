import type { MapTooltipProps } from './types';
import { MapPin } from 'lucide-react';

export function MapTooltip({ province, className = '' }: MapTooltipProps) {
  if (!province) return null;
  const region = { north: 'Northern Vietnam', central: 'Central Vietnam', south: 'Southern Vietnam' }[province.region];
  return <div className={`vc-map-tooltip pointer-events-none absolute left-1/2 top-4 z-20 max-w-[85%] -translate-x-1/2 rounded-2xl border px-4 py-3 text-center ${className}`}>
    <p className="flex items-center justify-center gap-2 text-sm font-semibold"><MapPin size={16} aria-hidden="true" />{province.name}</p>
    <p className="mt-1 text-sm">{region}</p>
  </div>;
}

export default MapTooltip;
