import React from 'react';

interface CompanionQuickPromptsProps {
  prompts: string[];
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
}

export const CompanionQuickPrompts: React.FC<CompanionQuickPromptsProps> = ({
  prompts,
  onSelectPrompt,
  disabled = false,
}) => {
  if (!prompts || prompts.length === 0) {
    return null;
  }

  return (
    <div className="vc-scroll flex gap-2 overflow-x-auto pb-2">
      {prompts.map((prompt, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => onSelectPrompt(prompt)}
          disabled={disabled}
          className="shrink-0 max-w-[260px] truncate text-xs px-3 py-1.5 rounded-full border border-[#c9d6b0] bg-[#f1f5e6] text-[#3e5a3a] hover:bg-[#e4f2df] hover:border-[#8a9a6f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left font-sans"
          title={prompt}
        >
          {prompt}
        </button>
      ))}
    </div>
  );
};
