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
    <div className="flex flex-wrap gap-2 py-2">
      {prompts.map((prompt, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => onSelectPrompt(prompt)}
          disabled={disabled}
          className="text-xs px-3 py-1.5 rounded-full border border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left font-serif"
        >
          {prompt}
        </button>
      ))}
    </div>
  );
};
