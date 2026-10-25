import type { KeyboardEvent } from 'react';
import { VIETNAM_34_PROVINCES } from '@/data/vietnamMapData';
import { JOURNEY_SERIES } from '../data/learningJourney';

const HANOI = VIETNAM_34_PROVINCES.find(province => province.id === 'ha-noi');
const STORY_IDS = ['pho', 'cha-ca-la-vong', 'bun-cha'] as const;
const STORY_TILES = STORY_IDS.map(id => JOURNEY_SERIES.find(series => series.id === id)).filter(
  (series): series is NonNullable<typeof series> => Boolean(series),
);

const TILES = [
  { x: 220, y: 178, width: 58, height: 27, number: '01' },
  { x: 220, y: 202, width: 29, height: 37, number: '02' },
  { x: 249, y: 202, width: 29, height: 37, number: '03' },
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
        <small>Three tastes, three stories to explore</small>
      </div>
      <svg viewBox="225 179 48 57" role="group" aria-label="Hanoi silhouette with three story pictures">
        <defs>
          <clipPath id="hanoi-story-outline"><path d={HANOI.d} /></clipPath>
          {TILES.map((tile, index) => (
            <clipPath id={`hanoi-story-tile-${index}`} key={tile.number}>
              <rect x={tile.x} y={tile.y} width={tile.width} height={tile.height} />
            </clipPath>
          ))}
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
                <image href={series.imageUrl} x={tile.x} y={tile.y} width={tile.width} height={tile.height} preserveAspectRatio="xMidYMax slice" />
                <rect className="hanoi-story-tile-hit" x={tile.x} y={tile.y} width={tile.width} height={tile.height} fill="transparent" />
              </g>
            );
          })}
          <path d="M220 202 H278 M249 202 V239" className="hanoi-story-seams" />
        </g>
        <path d={HANOI.d} className="hanoi-story-map-border" />
      </svg>
      <div className="hanoi-story-list" aria-label="Hanoi stories">
        {STORY_TILES.map((series, index) => (
          <button key={series.id} type="button" className="hanoi-story-card" onClick={() => onSelectSeries(series.id)}>
            <img src={series.imageUrl} alt="" loading="lazy" />
            <span className="hanoi-story-card-copy">
              <span className="hanoi-story-card-number">{TILES[index].number} / HÀ NỘI</span>
              <strong>{series.titleVi}</strong>
              <small>Explore story →</small>
            </span>
          </button>
        ))}
      </div>
      <p className="hanoi-story-map-note">The picture sections illustrate stories, not district boundaries.</p>
    </div>
  );
}
