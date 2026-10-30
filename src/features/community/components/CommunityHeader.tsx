import React from "react";
import { MessageSquare, Plus, Trophy, PenTool } from "lucide-react";
import { useTranslation } from "react-i18next";
import Link from "@/components/Link";
import '../community-ui.css';
import { PATHS } from "@/routes/paths";

interface CommunityHeaderProps {
  isEditorOpen: boolean;
  onToggleEditor: () => void;
  activeTab?: 'reflections' | 'contest';
}

export function CommunityHeader({
  isEditorOpen,
  onToggleEditor,
  activeTab = 'reflections',
}: CommunityHeaderProps) {
  const { t } = useTranslation('community');
  const isContest = activeTab === 'contest';

  return (
    <header className="community-header mb-5 pb-3.5 border-b border-[#E8E2D5]">
      {/* Top row: Heading, Subtitle, and Primary Write Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#1D5046] tracking-tight m-0">
            {isContest ? t('community.header.contest_title') : t('community.header.reflections_title')}
          </h1>
          <p className="text-xs sm:text-sm text-[#6E7B75] mt-1 max-w-xl leading-relaxed">
            {isContest
              ? t('community.header.contest_desc')
              : t('community.header.reflections_desc')}
          </p>
        </div>

        {/* Primary Action Button */}
        <div className="shrink-0 flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleEditor}
            aria-expanded={isEditorOpen}
            aria-controls={isContest ? "contest-editor" : "reflection-editor"}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#1D5046] hover:bg-[#153D35] shadow-xs border border-[#1D5046] transition-all focus-ring cursor-pointer"
          >
            {isContest ? (
              <PenTool className="w-3.5 h-3.5 text-[#E8D7AE]" />
            ) : (
              <Plus className="w-4 h-4 text-[#E8D7AE]" />
            )}
            <span>
              {isEditorOpen
                ? t('community.header.close_editor')
                : isContest
                ? t('community.header.submit_entry')
                : t('community.header.write_reflection')}
            </span>
          </button>
        </div>
      </div>

      {/* Clean Navigation Tabs */}
      <nav className="community-view-tabs flex items-center gap-2 mt-3.5" aria-label="Community navigation">
        <Link
          to={PATHS.community}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${
            !isContest
              ? 'bg-[#1D5046] text-white shadow-2xs'
              : 'text-[#6E7B75] hover:text-[#1D5046] hover:bg-white border border-transparent'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{t('community.header.tab_reflections')}</span>
        </Link>

        <Link
          to={PATHS.communityContest}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 transition-colors ${
            isContest
              ? 'bg-[#1D5046] text-white shadow-2xs'
              : 'text-[#6E7B75] hover:text-[#1D5046] hover:bg-white border border-transparent'
          }`}
        >
          <Trophy className="w-3.5 h-3.5 text-[#E8D7AE]" />
          <span>{t('community.header.tab_contest')}</span>
        </Link>
      </nav>
    </header>
  );
}

export default CommunityHeader;
