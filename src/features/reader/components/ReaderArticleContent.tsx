import './ReaderArticleContent.css';
import { useTranslation } from 'react-i18next';
import type { CSSProperties, HTMLAttributes, MouseEvent, ReactNode, Ref } from 'react';
import type { ReaderArticleData } from '../services/readerApiService';

interface ReaderArticleContentProps extends HTMLAttributes<HTMLDivElement> {
  language: 'en' | 'vi';
  themeMode: 'paper' | 'dark';
  fontSize: number;
  articleData?: ReaderArticleData | null;
  wordCount?: number;
  scrollable?: boolean;
  scrollRef?: Ref<HTMLDivElement>;
  vocabClassName: string;
  onVocabClick: (word: string, event: MouseEvent<HTMLButtonElement>) => void;
  children?: ReactNode;
}

/** Shared article presentation; parent views retain layout, scrolling and learning state. */
export function ReaderArticleContent({
  language, themeMode, fontSize, articleData, wordCount = 370,
  scrollable = false, scrollRef, vocabClassName, onVocabClick,
  children, className = '', ...events
}: ReaderArticleContentProps) {
  const { t } = useTranslation('reader');
  const translated = language === 'vi';
  const isDark = themeMode === 'dark';
  const title = translated
    ? articleData?.titleVi || 'Tết: Sự đổi mới, lòng tưởng nhớ và hương vị các vùng miền'
    : articleData?.titleEn || 'Tết: Renewal, Remembrance and Regional Flavours';
  const summary = (translated ? articleData?.summaryVi || articleData?.summary : articleData?.summary) || (translated
    ? 'Khám phá văn hóa về sự đổi mới, lòng triân tổ tiên và phong vị ẩm thực ba miền'
    : 'A cultural exploration of renewal, ancestral gratitude, and rich regional culinary traditions');
  const image = articleData?.imageUrl || '/images/landing/hoi-an-lanterns.webp';
  const vocabulary = [...(articleData?.vocabularies || [])].sort((a, b) => b.word.length - a.word.length);
  const escapedWords = vocabulary.map(v => v.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).filter(Boolean);
  const vocabularyPattern = escapedWords.length ? new RegExp(`\\b(${escapedWords.join('|')})\\b`, 'gi') : null;
  const renderEnglish = (text: string) => {
    if (!vocabularyPattern) return text;
    return text.split(vocabularyPattern).map((part, index) => {
      const match = vocabulary.find(v => v.word.toLowerCase() === part.toLowerCase());
      return match ? <button key={index} type="button" onClick={event => onVocabClick(match.word, event)} className={vocabClassName} title={t('content.lookup_title', { word: part, defaultValue: `Look up “${part}”` })}>{part}</button> : part;
    });
  };

  return (
    <div
      {...events}
      ref={scrollRef}
      data-reader-theme={themeMode}
      data-article-language={language}
      lang={language}
      className={`reader-language-sheet p-6 sm:p-10 rounded-2xl transition-colors duration-300 ${scrollable ? 'flex flex-col justify-between overflow-y-auto max-h-[750px]' : ''} ${isDark ? 'bg-[#1E2925] text-warm-ivory' : 'bg-warm-ivory text-[#2C3B37]'} ${className}`}
    >
      <div>
        <div className="reader-sheet-heading sr-only">
          <span className="px-3 py-1">{translated ? t('content.vietnamese_translation', 'Vietnamese translation') : t('content.english_original', 'English original')}</span>
          <span className="px-2.5 py-0.5">{translated ? t('content.vi_badge', 'VI') : t('content.en_badge', 'EN')}</span>
        </div>
        <div className="reader-article-intro"><div className="reader-article-intro-content">
        <h1 className="reader-article-title">
          {title}
        </h1>
        <p className="reader-article-summary">{summary}</p>
        </div></div>
        <div className="reader-sheet-banner">
          <img src={image} alt={title} loading="eager" decoding="async" />
        </div>
        <div className={`reader-article-body space-y-5 leading-relaxed font-sans ${isDark ? 'text-rice-paper/95' : 'text-[#2C3B37]'}`} style={{ fontSize: `${fontSize}px` } as CSSProperties}>
          {articleData?.paragraphs && articleData.paragraphs.length > 0
            ? articleData.paragraphs.map((paragraph, index) => <p key={paragraph.id || index} lang={language}>{translated ? paragraph.viText : renderEnglish(paragraph.enText)}</p>)
            : children}
        </div>
      </div>
    </div>
  );
}
