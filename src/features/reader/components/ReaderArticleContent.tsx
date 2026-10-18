import './ReaderArticleContent.css';
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
  children: ReactNode;
}

/** Shared article presentation; parent views retain layout, scrolling and learning state. */
export function ReaderArticleContent({
  language, themeMode, fontSize, articleData, wordCount = 370,
  scrollable = false, scrollRef, vocabClassName, onVocabClick,
  children, className = '', ...events
}: ReaderArticleContentProps) {
  const translated = language === 'vi';
  const isDark = themeMode === 'dark';
  const title = translated
    ? articleData?.titleVi || 'Tết: Sự đổi mới, lòng tưởng nhớ và hương vị các vùng miền'
    : articleData?.titleEn || 'Tết: Renewal, Remembrance and Regional Flavours';
  const summary = articleData?.summary || (translated
    ? 'Khám phá văn hóa về sự đổi mới, lòng tri ân tổ tiên và phong vị ẩm thực ba miền'
    : 'A cultural exploration of renewal, ancestral gratitude, and rich regional culinary traditions');
  const image = articleData?.imageUrl || (translated
    ? 'https://images.unsplash.com/photo-1582233479366-6d38bc390a08?auto=format&fit=crop&w=1200&q=80'
    : 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&w=1200&q=80');
  const vocabulary = [...(articleData?.vocabularies || [])].sort((a, b) => b.word.length - a.word.length);
  const escapedWords = vocabulary.map(v => v.word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).filter(Boolean);
  const vocabularyPattern = escapedWords.length ? new RegExp(`\\b(${escapedWords.join('|')})\\b`, 'gi') : null;
  const renderEnglish = (text: string) => {
    if (!vocabularyPattern) return text;
    return text.split(vocabularyPattern).map((part, index) => {
      const match = vocabulary.find(v => v.word.toLowerCase() === part.toLowerCase());
      return match ? <button key={index} type="button" onClick={event => onVocabClick(match.word, event)} className={vocabClassName} title={`Look up “${part}”`}>{part}</button> : part;
    });
  };

  return (
    <div
      {...events}
      ref={scrollRef}
      data-reader-theme={themeMode}
      data-article-language={language}
      className={`reader-language-sheet p-6 sm:p-10 rounded-2xl transition-colors duration-300 ${scrollable ? 'flex flex-col justify-between overflow-y-auto max-h-[750px]' : ''} ${isDark ? 'bg-[#1E2925] text-[#FBF7EE]' : 'bg-[#FBF7EE] text-[#2C3B37]'} ${className}`}
    >
      <div>
        <div className="reader-sheet-heading flex items-center justify-between mb-6 pb-4 border-b">
          <span className="px-3 py-1">{translated ? 'Vietnamese translation' : 'English original'}</span>
          <span className="px-2.5 py-0.5">{translated ? 'VI' : 'EN'}</span>
        </div>
        <h1 className={`font-sans text-2xl sm:text-3xl leading-snug mb-3 ${isDark ? 'text-[#FBF7EE]' : 'text-[#1E4B43]'} ${translated ? 'italic' : ''}`}>
          {title}
        </h1>
        <p className={`font-sans italic text-sm sm:text-base mb-6 ${isDark ? 'text-[#BFE3EA]' : 'text-[#4B5563]'}`}>{summary}</p>
        <div className="reader-sheet-banner relative h-60 sm:h-72 w-full rounded-2xl overflow-hidden mb-8 border group">
          <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />
          <div className="absolute inset-2 border rounded-xl pointer-events-none" />
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs uppercase">
            <span className="backdrop-blur-xs px-2.5 py-1 rounded-md border">{articleData?.topic || (translated ? 'Tản Văn Văn Hóa' : 'Cultural Essay')}</span>
            {!translated && <span className="px-2.5 py-1 rounded-md">~{wordCount} words</span>}
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-2 text-white">
            <div>
              <span className="text-xs uppercase block mb-0.5">{articleData?.topic || (translated ? 'Phong Tục & Ẩm Thực' : 'Vietnamese Lunar New Year')}</span>
              <h3 className="font-sans text-lg sm:text-xl font-bold text-[#FBF7EE]">{(translated ? articleData?.titleVi : articleData?.titleEn) || (translated ? 'Phong Vị Tết Cổ Truyền' : 'Tết Nguyên Đán Heritage')}</h3>
            </div>
            <div className="text-[11px] text-[#BFE3EA] font-sans opacity-90 text-left sm:text-right">{articleData?.region || (translated ? 'Bản Dịch Tiếng Việt Chuẩn Ngữ Cảnh' : 'Truyền Thống & Phong Vị Ba Miền')}</div>
          </div>
        </div>
        <div className={`reader-article-body space-y-5 leading-relaxed font-sans ${isDark ? 'text-[#F6EEDC]/95' : 'text-[#2C3B37]'}`} style={{ fontSize: `${fontSize}px` } as CSSProperties}>
          {articleData?.paragraphs && articleData.paragraphs.length > 0
            ? articleData.paragraphs.map((paragraph, index) => <p key={paragraph.id || index} lang={language}>{translated ? paragraph.viText : renderEnglish(paragraph.enText)}</p>)
            : children}
        </div>
      </div>
    </div>
  );
}
