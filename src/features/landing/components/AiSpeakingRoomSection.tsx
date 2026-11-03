import React from 'react';
import { ArrowUpRight, BookOpen, MapPinned, Mic2, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LocalizedLink as Link } from '@/components/common/LocalizedLink';
import { PATHS } from '@/routes/paths';

export const AiSpeakingRoomSection: React.FC = () => {
  const { t } = useTranslation('landing');

  return (
    <section id="ai-speaking-room" className="landing-ai-room" aria-labelledby="landing-ai-title">
      <div className="landing-container landing-ai-grid">
        <div className="landing-ai-copy">
          <p className="landing-ai-eyebrow">{ }</p>
          <h2 id="landing-ai-title">{t('ai_room.title')}</h2>
          <p className="landing-ai-lead">{t('ai_room.lead')}</p>

          <div className="landing-ai-modes">
            <div>
              <BookOpen size={19} aria-hidden="true" />
              <div><h3>{t('ai_room.story_title')}</h3><p>{t('ai_room.story_description')}</p></div>
            </div>
            <div>
              <Mic2 size={19} aria-hidden="true" />
              <div><h3>{t('ai_room.free_title')}</h3><p>{t('ai_room.free_description')}</p></div>
            </div>
          </div>

          <Link to={PATHS.aiWorkspace} className="landing-button landing-button-primary focus-ring">
            {t('ai_room.cta')} <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
          <p className="landing-ai-free-note">{t('ai_room.free_note')}</p>
        </div>

        <div className="landing-ai-preview" aria-label={t('ai_room.preview_label')}>
          <div className="landing-ai-preview-top"><span className="landing-ai-preview-dot" />{t('ai_room.preview_title')}<span>{t('ai_room.preview_sample')}</span></div>
          <div className="landing-ai-preview-body">
            <div className="landing-ai-preview-question">{t('ai_room.example_question')}</div>
            <div className="landing-ai-preview-answer">
              <span className="landing-ai-avatar"><Mic2 size={18} aria-hidden="true" /></span>
              <p>{t('ai_room.example_answer')}</p>
            </div>
            <div className="landing-ai-tool-list" aria-label={t('ai_room.tools_label')}>
              <div><MapPinned size={18} aria-hidden="true" /><span>{t('ai_room.map_tool')}</span></div>
              <div><BookOpen size={18} aria-hidden="true" /><span>{t('ai_room.article_tool')}</span></div>
              <div><Search size={18} aria-hidden="true" /><span>{t('ai_room.source_tool')}</span></div>
            </div>
            <p className="landing-ai-tool-note">{t('ai_room.tool_note')}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiSpeakingRoomSection;
