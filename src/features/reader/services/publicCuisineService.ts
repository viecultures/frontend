import { extractSentenceContext, VOCAB_DATABASE } from '@/data/readerData';
import { CUISINE_IPA_MAP } from '@/data/series/cuisineIpaData';
import { CUISINE_QUESTIONS } from '@/data/series/cuisineQuestions';
import type importedDrafts from '@/data/series/drafts/exe101.json';
import publishedSnapshot from '@/data/series/published/exe101.json';
import { API_BASE_URL } from '@/config/apiConfig';
import type { JourneySeries } from '@/data/series';
import type { SeriesMetadata, SeriesStatus } from '@/data/series/types';
import { readerApiService, type ReaderArticleData } from './readerApiService';

type PublicSeries = (typeof importedDrafts)[number];
type Level = 'Level 1' | 'Level 2' | 'Level 3';

let pending: Promise<PublicSeries[]> | null = null;

export function getPublicCuisineSeries(): Promise<PublicSeries[]> {
  if (!pending) {
    pending = Promise.resolve(publishedSnapshot as PublicSeries[]);
  }
  return pending;
}

const PROVINCE_MAP_34: Record<string, string> = {
  'ha-nam': 'ninh-binh',
  'nam-dinh': 'ninh-binh',
  'thai-binh': 'hung-yen',
  'hoa-binh': 'phu-tho',
  'vinh-phuc': 'phu-tho',
  'yen-bai': 'lao-cai',
  'bac-kan': 'thai-nguyen',
  'bac-giang': 'bac-ninh',
};

export function toPublicJourney(series: PublicSeries): JourneySeries {
  const provinceId = PROVINCE_MAP_34[series.provinceId] || series.provinceId;
  const rawDesc = (series as { description?: string }).description || '';
  const rawDescVi = (series as { descriptionVi?: string }).descriptionVi || rawDesc || series.titleVi;
  return {
    id: series.id,
    title: (series as { title?: string; titleEn?: string }).title || (series as { titleEn?: string }).titleEn || series.titleVi,
    titleVi: series.titleVi,
    theme: 'cuisine',
    provinceId,
    region: series.region || 'north',
    description: rawDesc || series.titleVi,
    descriptionVi: rawDescVi,
    imageUrl: series.imageUrl || '',
    status: (series.status as SeriesStatus) || 'published',
    chapters: series.chapters.map(chapter => ({
      id: chapter.id,
      title: chapter.titleEn,
      titleVi: chapter.titleVi,
      summary: (chapter as { summary?: string }).summary || chapter.titleEn,
      summaryVi: (chapter as { summaryVi?: string }).summaryVi || chapter.titleVi,
      order: chapter.order,
      readTime: '3 min read',
      preferredLevel: (['Level 2', 'Level 1', 'Level 3'] as const).find(level => Boolean(chapter.variants[level])),
    })),
  };
}

export function toPublicSeriesMetadata(series: PublicSeries): SeriesMetadata {
  const provinceId = PROVINCE_MAP_34[series.provinceId] || series.provinceId;
  const rawDesc = (series as { description?: string }).description || '';
  const rawDescVi = (series as { descriptionVi?: string }).descriptionVi || rawDesc || series.titleVi;
  return {
    id: series.id,
    title: (series as { title?: string; titleEn?: string }).title || (series as { titleEn?: string }).titleEn || series.titleVi,
    titleVi: series.titleVi,
    theme: 'cuisine',
    provinceId,
    region: (series.region as SeriesMetadata['region']) || 'north',
    description: rawDesc || series.titleVi,
    descriptionVi: rawDescVi,
    imageUrl: series.imageUrl || '',
    status: (series.status as SeriesStatus) || 'published',
    chapters: series.chapters.map(chapter => ({
      id: chapter.id,
      order: chapter.order,
      titleEn: chapter.titleEn,
      titleVi: chapter.titleVi,
      summary: (chapter as { summary?: string }).summary || chapter.titleEn,
      summaryVi: (chapter as { summaryVi?: string }).summaryVi || chapter.titleVi,
      readTime: '3 min read',
      cefrLevel: (['Level 2', 'Level 1', 'Level 3'] as const).find(level => Boolean(chapter.variants[level])),
    })),
  };
}

function parseVocabulary(source: string, paragraphs: Array<{ enText: string }>, chapterId: string) {
  const entries: ReaderArticleData['vocabularies'] = [];
  for (const line of source.split(/\r?\n/)) {
    const clean = line.trim().replace(/^[-•]\s*|^\d+[.)]\s*/, '');
    const parts = clean.split(/\t+|\s{2,}|\s+[—–]\s+/);
    if (parts.length < 2) continue;
    const word = parts[0].trim();
    const meaning = parts[1].trim();
    if (!word || !meaning || /từ vựng|nghĩa tiếng việt|nổi bật/i.test(word) || word.length > 70) continue;
    
    // Find the paragraph containing the word or its keyword stems
    const matchedParagraph = paragraphs.find(item => {
      const pLower = item.enText.toLowerCase();
      if (pLower.includes(word.toLowerCase())) return true;
      const kws = word.toLowerCase().split(/\s+/).filter(w => !['be', 'to', 'a', 'an', 'the', 'of', 'in', 'on', 'with'].includes(w));
      return kws.length > 0 && kws.every(kw => pLower.includes(kw.length > 4 ? kw.slice(0, 4) : kw));
    })?.enText || '';

    const sentence = extractSentenceContext(matchedParagraph, word);
    const lowerWord = word.toLowerCase();
    const fallback = VOCAB_DATABASE[lowerWord];
    const ipaEntry = CUISINE_IPA_MAP[lowerWord];

    const pos = ipaEntry?.pos || fallback?.pos || '';
    const ipa = ipaEntry?.ipa || fallback?.ipa || '';
    const enDefinition = fallback?.enDefinition || '';

    entries.push({
      id: `${chapterId}-${entries.length + 1}`,
      word,
      pos,
      ipa,
      viMeaning: meaning,
      contextSentence: sentence,
      enDefinition,
    });
  }
  return entries;
}

export async function getPublicCuisineArticle(chapterId: string, level: Level): Promise<ReaderArticleData | null> {
  const normalizedChapterId = chapterId.replace(/-(?:a1|a2|b1|b2|c1|c2)$/i, '');
  const seriesList = await getPublicCuisineSeries();
  const series = seriesList.find(item => item.chapters.some(chapter => chapter.id === chapterId || chapter.id === normalizedChapterId));
  const chapter = series?.chapters.find(item => item.id === chapterId || item.id === normalizedChapterId);
  const effectiveChapterId = chapter?.id || normalizedChapterId;
  if (series && !['pho', 'bun-cha', 'cha-ca-la-vong', 'ca-kho-vu-dai'].includes(series.id)) {
    const cefr = { 'Level 1': 'A1', 'Level 2': 'B1', 'Level 3': 'C1' }[level];
    const post = await readerApiService.getPostByTopicGroupAndLevel(effectiveChapterId, cefr);
    if (post) {
      const article = readerApiService.mapPostToReaderData(post);
      const questions = CUISINE_QUESTIONS[effectiveChapterId] || article.questions || [];
      return { ...article, id: effectiveChapterId, topicGroup: undefined, cefrLevel: undefined, questions };
    }
  }
  const variant = chapter?.variants[level];
  if (!series || !chapter || !variant) return null;
  const paragraphs = variant.paragraphs.map((pair, index) => ({
    orderIndex: index,
    enText: pair.enText,
    viText: pair.viText,
  }));
  const vocabularies = parseVocabulary(variant.vocabularySource, paragraphs, effectiveChapterId);
  return {
    id: effectiveChapterId,
    titleEn: variant.titleEn || chapter.titleEn,
    titleVi: chapter.titleVi,
    summary: (chapter as { summary?: string }).summary,
    summaryVi: (chapter as { summaryVi?: string }).summaryVi,
    topic: 'Cuisine',
    region: series.region,
    level,
    imageUrl: series.imageUrl || undefined,
    paragraphs,
    vocabularies,
    vocabMap: Object.fromEntries(vocabularies.map(item => [item.word.toLowerCase(), item])),
    questions: CUISINE_QUESTIONS[effectiveChapterId] || [],
  };
}
