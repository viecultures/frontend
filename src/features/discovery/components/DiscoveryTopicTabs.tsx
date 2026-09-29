import React from 'react';
import {
  Layers,
  Landmark,
  UtensilsCrossed,
  Palette,
  Mountain,
  Flame,
} from 'lucide-react';
import { TOPIC_OPTIONS } from '@/data/discoveryData';

interface DiscoveryTopicTabsProps {
  selectedTopic: string;
  onSelectTopic: (topic: string) => void;
  topicCounts: Record<string, number>;
}

// Map each topic category to a dedicated crisp SVG icon
const getTopicIcon = (value: string, isActive: boolean) => {
  const iconClass = `w-4 h-4 shrink-0 transition-colors ${
    isActive ? 'text-antique-gold' : 'text-heritage-green'
  }`;

  switch (value) {
    case 'All':
      return <Layers className={iconClass} />;
    case 'Heritage':
      return <Landmark className={iconClass} />;
    case 'Cuisine':
      return <UtensilsCrossed className={iconClass} />;
    case 'Crafts':
      return <Palette className={iconClass} />;
    case 'Nature':
      return <Mountain className={iconClass} />;
    case 'Folklore':
      return <Flame className={iconClass} />;
    default:
      return <Layers className={iconClass} />;
  }
};

export const DiscoveryTopicTabs: React.FC<DiscoveryTopicTabsProps> = ({
  selectedTopic,
  onSelectTopic,
  topicCounts,
}) => {
  return (
    <section className="mb-6 overflow-x-auto pb-2 scrollbar-none" aria-label="Bộ lọc chủ đề bài học">
      <div className="flex items-center gap-2.5 min-w-max">
        {TOPIC_OPTIONS.map((topic) => {
          const isActive = selectedTopic === topic.value;
          const count = topicCounts[topic.value] || 0;
          return (
            <button
              key={topic.value}
              type="button"
              onClick={() => onSelectTopic(topic.value)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer focus-ring ${
                isActive
                  ? 'bg-heritage-green text-warm-ivory shadow-md border border-antique-gold/50 scale-102'
                  : 'bg-rice-paper text-text-body hover:bg-mist-cloud border border-heritage-green/12 hover:border-antique-gold/40'
              }`}
            >
              {getTopicIcon(topic.value, isActive)}
              <span>{topic.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold transition-colors ${
                  isActive
                    ? 'bg-antique-gold text-heritage-dark shadow-xs'
                    : 'bg-mist-cloud text-heritage-green'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default DiscoveryTopicTabs;
