import React from 'react';
import {
  MessageSquareText,
  HelpCircle,
  Mic,
  Award,
  Layers,
} from 'lucide-react';
import { useSettings, useLogStore, type ConversationMode } from '../lib/state';
import { useLiveAPIContext } from '../contexts/LiveAPIContext';
import {
  CONVERSATION_MODES,
  PROFICIENCY_LEVELS,
  scaffoldSystemPrompt,
  type ProficiencyLevel,
} from '../lib/prompt-scaffolder';

const MODE_ICONS: Record<ConversationMode, React.ReactNode> = {
  discussion: <MessageSquareText className="w-3.5 h-3.5 shrink-0" />,
  comprehension: <HelpCircle className="w-3.5 h-3.5 shrink-0" />,
  shadowing: <Mic className="w-3.5 h-3.5 shrink-0" />,
  interview: <Award className="w-3.5 h-3.5 shrink-0" />,
};

export const QuickModeSwitcher: React.FC = () => {
  const {
    conversationMode,
    proficiencyLevel,
    activeLessonId,
    setConversationMode,
    setProficiencyLevel,
    setSystemPrompt,
  } = useSettings();
  const { connected, client } = useLiveAPIContext();

  const handleSwitchLevel = (targetLevel: ProficiencyLevel) => {
    if (targetLevel === proficiencyLevel) return;

    setProficiencyLevel(targetLevel);
    setSystemPrompt(scaffoldSystemPrompt(activeLessonId, conversationMode, targetLevel));

    const levelMeta = PROFICIENCY_LEVELS[targetLevel];

    if (connected && client) {
      client.interrupt();
      client.sendRealtimeText(levelMeta.switchPrompt);
      useLogStore.getState().addTurn({
        role: 'system',
        text: `**Đã đổi trình độ:** **${levelMeta.label} (${levelMeta.cefrRange})** - ${levelMeta.subTitle}\n- *Đặc điểm nội dung:* ${levelMeta.description}`,
        isFinal: true,
      });
    } else {
      useLogStore.getState().addTurn({
        role: 'system',
        text: `**Trình độ:** **${levelMeta.label} (${levelMeta.cefrRange})** - ${levelMeta.subTitle}\n- *Đặc điểm nội dung:* ${levelMeta.description}`,
        isFinal: true,
      });
    }
  };

  const handleSwitchMode = (targetMode: ConversationMode) => {
    if (targetMode === conversationMode) return;

    setConversationMode(targetMode);
    setSystemPrompt(scaffoldSystemPrompt(activeLessonId, targetMode, proficiencyLevel));

    const modeMeta = CONVERSATION_MODES[targetMode];

    if (connected && client) {
      client.interrupt();
      client.sendRealtimeText(modeMeta.switchPrompt);
      useLogStore.getState().addTurn({
        role: 'system',
        text: `**Đã chuyển chế độ:** **${modeMeta.label}** (${modeMeta.subLabel})\n- *Đặc điểm:* ${modeMeta.description}`,
        isFinal: true,
      });
    } else {
      useLogStore.getState().addTurn({
        role: 'system',
        text: `**Chế độ sẵn sàng:** **${modeMeta.label}** (${modeMeta.subLabel})\n- *Đặc điểm:* ${modeMeta.description}\n- *Bấm nút Play để bắt đầu luyện tập.*`,
        isFinal: true,
      });
    }
  };

  const levelKeys: ProficiencyLevel[] = ['Level 1', 'Level 2', 'Level 3'];
  const modeKeys: ConversationMode[] = ['discussion', 'comprehension', 'shadowing', 'interview'];

  return (
    <div className="flex-shrink-0 px-3 py-2 bg-[#14181a] border-b border-white/5 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2 overflow-x-auto no-scrollbar select-none">
      {/* 1. Level Selector Pills */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider px-1 font-semibold flex items-center gap-1">
          <Layers className="w-3 h-3 text-[#D4AF37]" />
          <span>Level:</span>
        </span>
        <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-lg border border-white/5">
          {levelKeys.map(lvlKey => {
            const meta = PROFICIENCY_LEVELS[lvlKey];
            const isActive = proficiencyLevel === lvlKey;

            return (
              <button
                key={lvlKey}
                onClick={() => handleSwitchLevel(lvlKey)}
                title={`${meta.label} (${meta.cefrRange}): ${meta.description}`}
                className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
                  isActive
                    ? 'bg-[#1E4B43] text-[#D4AF37] border border-[#D4AF37]/50 shadow-xs font-bold'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <span>{meta.label}</span>
                <span className="text-[9.5px] opacity-75 font-normal">({meta.cefrRange})</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="hidden sm:block w-px h-4 bg-white/10 shrink-0" />

      {/* 2. Practice Mode Selector */}
      <div className="flex items-center gap-1.5 flex-1 min-w-max">
        <span className="text-[10px] font-mono text-gray-400 uppercase tracking-wider px-1 font-semibold">
          Chế độ:
        </span>
        <div className="flex items-center gap-1">
          {modeKeys.map(modeKey => {
            const meta = CONVERSATION_MODES[modeKey];
            const isActive = conversationMode === modeKey;

            return (
              <button
                key={modeKey}
                onClick={() => handleSwitchMode(modeKey)}
                title={meta.description}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#1E4B43] text-[#D4AF37] border border-[#D4AF37]/50 shadow-sm font-semibold'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-transparent'
                }`}
              >
                <span className={isActive ? 'text-[#D4AF37]' : 'text-gray-400'}>
                  {MODE_ICONS[modeKey]}
                </span>
                <span>{meta.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuickModeSwitcher;
