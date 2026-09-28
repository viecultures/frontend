import React from 'react';
import { TOPIC_OPTIONS } from '@/data/discoveryData';

interface DiscoveryTopicTabsProps {
  selectedTopic: string;
  onSelectTopic: (topic: string) => void;
  topicCounts: Record<string, number>;
}

export const DiscoveryTopicTabs: React.FC<DiscoveryTopicTabsProps> = ({
  selectedTopic,
  onSelectTopic,
  topicCounts,
}) => {
  return (
    <section className="mb-6 overflow-x-auto pb-2 scrollbar-none">
      <div className="flex items-center gap-2 min-w-max">
        {TOPIC_OPTIONS.map((topic) => {
          const isActive = selectedTopic === topic.value;
          const count = topicCounts[topic.value] || 0;
          return (
            <button
              key={topic.value}
              onClick={() => onSelectTopic(topic.value)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-heritage-green text-warm-ivory shadow-md border border-antique-gold/50 scale-102'
                  : 'bg-rice-paper text-text-body hover:bg-mist-cloud border border-heritage-green/10'
              }`}
            >
              <span className="text-base">{topic.icon}</span>
              <span>{topic.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                  isActive
                    ? 'bg-antique-gold text-heritage-forest'
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
