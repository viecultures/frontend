import type { KeyboardEvent } from 'react';
import { VIETNAM_34_PROVINCES } from '@/data/vietnamMapData';
import { JOURNEY_SERIES } from '../data/learningJourney';

const HANOI = VIETNAM_34_PROVINCES.find(province => province.id === 'ha-noi');
const STORY_IDS = ['pho', 'cha-ca-la-vong', 'bun-cha'] as const;
const STORY_TILES = STORY_IDS.map(id => JOURNEY_SERIES.find(series => series.id === id)).filter(
  (series): series is NonNullable<typeof series> => Boolean(series),
);

const TILES = [
  { x: 220, y: 178, width: 58, height: 27, cx: 249, cy: 195, number: '01', label: 'Phở Hà Nội' },
  { x: 220, y: 202, width: 29, height: 37, cx: 237, cy: 219, number: '02', label: 'Chả cá' },
  { x: 249, y: 202, width: 29, height: 37, cx: 260, cy: 218, number: '03', label: 'Bún chả' },
] as const;

interface HanoiStoryMapProps {
  onSelectSeries: (seriesId: string) => void;
}

export function HanoiStoryMap({ onSelectSeries }: HanoiStoryMapProps) {
  if (!HANOI) return null;

  function onTileKeyDown(event: KeyboardEvent<SVGGElement>, seriesId: string) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelectSeries(seriesId);
    }
  }

  return (
    <div className="hanoi-story-map" aria-label="Hanoi stories map">
      <div className="hanoi-story-map-caption">
        <span>HÀ NỘI · STORY MAP</span>
        <small>Choose a picture to explore a story</small>
      </div>
      <svg viewBox="225 179 48 57" role="group" aria-label="Hanoi silhouette with three story pictures">
        <defs>
          <clipPath id="hanoi-story-outline"><path d={HANOI.d} /></clipPath>
          {TILES.map((tile, index) => (
            <clipPath id={`hanoi-story-tile-${index}`} key={tile.number}>
              <rect x={tile.x} y={tile.y} width={tile.width} height={tile.height} />
            </clipPath>
          ))}
          <linearGradient id="hanoi-story-shade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#08131b" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#08131b" stopOpacity="0.78" />
          </linearGradient>
        </defs>
        <path d={HANOI.d} className="hanoi-story-map-glow" />
        <g clipPath="url(#hanoi-story-outline)">
          {STORY_TILES.map((series, index) => {
            const tile = TILES[index];
            return (
              <g
                key={series.id}
                className="hanoi-story-tile"
                role="button"
                tabIndex={0}
                aria-label={`Explore ${series.title}`}
                onClick={() => onSelectSeries(series.id)}
                onKeyDown={event => onTileKeyDown(event, series.id)}
                clipPath={`url(#hanoi-story-tile-${index})`}
              >
                <image href={series.imageUrl} x={tile.x} y={tile.y} width={tile.width} height={tile.height} preserveAspectRatio="xMidYMid slice" />
                <rect x={tile.x} y={tile.y} width={tile.width} height={tile.height} fill="url(#hanoi-story-shade)" />
                <rect className="hanoi-story-tile-hit" x={tile.x} y={tile.y} width={tile.width} height={tile.height} fill="transparent" />
                <text x={tile.cx} y={tile.cy - 2} textAnchor="middle" className="hanoi-story-number">{tile.number}</text>
                <text x={tile.cx} y={tile.cy + 2.2} textAnchor="middle" className="hanoi-story-name">{tile.label}</text>
              </g>
            );
          })}
          <path d="M220 202 H278 M249 202 V239" className="hanoi-story-seams" />
        </g>
        <path d={HANOI.d} className="hanoi-story-map-border" />
      </svg>
      <p className="hanoi-story-map-note">The picture sections illustrate stories, not district boundaries.</p>
    </div>
  );
}
