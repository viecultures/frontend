import type { ReadingPostItem } from '@/features/admin/types/adminTypes';
import type { VocabItem } from '@/data/readerData';
import { VOCAB_DATABASE } from '@/data/readerData';
import type { Lesson, LevelDetail } from '@/data/discoveryData';
import { API_BASE_URL } from '@/config/apiConfig';

export function readerLevelFor(level: string): 'Level 1' | 'Level 2' | 'Level 3' {
  if (level === 'A1' || level === 'A2' || level === 'Level 1') return 'Level 1';
  if (level === 'C1' || level === 'C2' || level === 'Level 3') return 'Level 3';
  return 'Level 2';
}

export interface CatalogLevelDetail {
  postId: string;
  cefrLevel?: string;
  readTime: string;
  vocabCount: number;
  wordCount?: number;
  summary?: string;
  summaryVi?: string;
}

export interface CatalogLesson {
  id: string;
  topicGroup?: string;
  journeyId?: string;
  isStandalone?: boolean;
  titleEn: string;
  titleVi: string;
  category: "Heritage" | "Cuisine" | "Crafts" | "Nature" | "Folklore";
  categoryVi: string;
  region: string;
  imageUrl: string;
  summary: string;
  summaryVi?: string;
  featured: boolean;
  totalReads: number;
  likesCount: number;
  primaryLevel: "Level 1" | "Level 2" | "Level 3";
  readTime: string;
  vocabCount: number;
  availableLevels: Array<"Level 1" | "Level 2" | "Level 3">;
  levelDetails: Record<string, CatalogLevelDetail>;
  createdAt?: string;
}

export interface CatalogResponseData {
  items: CatalogLesson[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  topicCounts: Record<string, number>;
}

export interface QuizOptionItem {
  key: string;
  text: string;
}

export interface QuizQuestionItem {
  id?: string;
  orderIndex: number;
  question: string;
  options: QuizOptionItem[];
  correctKey: string;
  explanation?: string;
}

export interface ReaderArticleData {
  id: string;
  topicGroup?: string;
  journeyId?: string;
  isStandalone?: boolean;
  titleEn: string;
  titleVi: string;
  topic: string;
  region?: string;
  level: string;
  cefrLevel?: string;
  wordCount?: number;
  readTime?: string;
  imageUrl?: string;
  summary?: string;
  shadowingAudioUrl?: string;
  summaryVi?: string;
  paragraphs: Array<{
    id?: string;
    orderIndex: number;
    enText: string;
    viText: string;
    audioTimestampStart?: number;
    audioTimestampEnd?: number;
  }>;
  vocabularies: VocabItem[];
  vocabMap: Record<string, VocabItem>;
  questions?: QuizQuestionItem[];
}

const unwrap = <T>(res: any): T => (res && res.data !== undefined ? res.data : res);

export const readerApiService = {
  // ─── 1. Fetch Post Detail by ID ──────────────────────────────────────────
  async getPostById(id: string, signal?: AbortSignal): Promise<ReadingPostItem | null> {
    try {
      const activeSignal = signal || AbortSignal.timeout(8000);
      const res = await fetch(`${API_BASE_URL}/api/posts/${encodeURIComponent(id)}`, { signal: activeSignal });
      if (!res.ok) return null;
      const json = await res.json();
      return unwrap<ReadingPostItem>(json);
    } catch (err: unknown) {
      if ((err as Error)?.name === 'AbortError') return null;
      console.warn(`[Reader API] Lỗi khi tải bài viết ID ${id}:`, err);
      return null;
    }
  },

  // ─── 2. Fetch Post by Topic Group & Level ────────────────────────────────
  async getPostByTopicGroupAndLevel(topicGroup: string, level: string): Promise<ReadingPostItem | null> {
    try {
      const searchParams = new URLSearchParams({
        topicGroup,
        level,
      });
      const res = await fetch(`${API_BASE_URL}/api/posts?${searchParams.toString()}`);
      if (!res.ok) return null;
      const json = await res.json();
      const list: ReadingPostItem[] = unwrap<ReadingPostItem[]>(json);
      return list && list.length > 0 ? list[0] : null;
    } catch (err: unknown) {
      if ((err as Error)?.name === 'AbortError') return null;
      console.warn(`[Reader API] Lỗi khi tìm bài theo topicGroup & level:`, err);
      return null;
    }
  },

  // ─── 3. Fetch All Available Posts ────────────────────────────────────────
  async getAllPosts(): Promise<ReadingPostItem[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/posts`);
      if (!res.ok) return [];
      const json = await res.json();
      return unwrap<ReadingPostItem[]>(json);
    } catch (err: unknown) {
      if ((err as Error)?.name === 'AbortError') return [];
      console.warn('[Reader API] Lỗi khi tải danh sách bài viết:', err);
      return [];
    }
  },

  // ─── 4. Convert Backend ReadingPost to ReaderArticleData ─────────────────
  mapPostToReaderData(post: ReadingPostItem): ReaderArticleData {
    const vocabMap: Record<string, VocabItem> = {};
    const mappedVocabs: VocabItem[] = [];

    if (post.vocabularies && Array.isArray(post.vocabularies)) {
      post.vocabularies.forEach((v) => {
        const key = v.word.trim().toLowerCase();
        const item: VocabItem = {
          id: v.id || key.replace(/\s+/g, '-'),
          word: v.word,
          pos: v.pos || (v.word.includes(' ') ? 'phrase' : 'word'),
          ipa: v.ipa || `/${key}/`,
          viMeaning: v.viMeaning,
          contextSentence: v.contextSentence || '',
          enDefinition: VOCAB_DATABASE[key]?.enDefinition,
        };
        vocabMap[key] = item;
        mappedVocabs.push(item);
      });
    }

    // Default image if missing
    const defaultImg =
      'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&w=1200&q=80';

    const mappedQuestions: QuizQuestionItem[] = [];
    if (post.questions && Array.isArray(post.questions)) {
      post.questions.forEach((q) => {
        let parsedOptions: QuizOptionItem[] = [];
        if (typeof q.options === 'string') {
          try {
            parsedOptions = JSON.parse(q.options);
          } catch {
            parsedOptions = [];
          }
        } else if (Array.isArray(q.options)) {
          parsedOptions = q.options;
        }

        mappedQuestions.push({
          id: q.id,
          orderIndex: q.orderIndex,
          question: q.question,
          options: parsedOptions,
          correctKey: q.correctKey,
          explanation: q.explanation,
        });
      });
    }

    return {
      id: post.id,
      topicGroup: post.topicGroup,
      titleEn: post.titleEn,
      titleVi: post.titleVi,
      topic: post.topic || 'Văn hóa & Phong tục',
      region: post.region || 'Việt Nam',
      level: post.level || 'Level 2',
      cefrLevel: post.level || 'B1',
      wordCount: post.wordCount,
      readTime: post.readTime || `${Math.max(1, Math.ceil((post.wordCount || 200) / 100))} phút`,
      imageUrl: post.imageUrl || defaultImg,
      summary: post.summary || '',
      shadowingAudioUrl: post.shadowingAudioUrl,
      paragraphs: post.paragraphs && post.paragraphs.length > 0
        ? post.paragraphs
        : [
            {
              orderIndex: 0,
              enText: post.contentEn || post.summary || '',
              viText: post.contentVi || '',
            },
          ],
      vocabularies: mappedVocabs,
      vocabMap,
      questions: mappedQuestions,
    };
  },

  // ─── 5. Fetch Grouped Catalog Lessons for Discovery Page ────────────────
  async getCatalog(params?: {
    topic?: string;
    level?: string;
    query?: string;
    region?: string;
    sortBy?: string;
    standalone?: boolean;
    page?: number;
    size?: number;
    signal?: AbortSignal;
  }): Promise<CatalogResponseData | null> {
    try {
      const sp = new URLSearchParams();
      if (params?.topic && params.topic !== 'All') sp.set('topic', params.topic);
      if (params?.level && params.level !== 'All') sp.set('level', params.level);
      if (params?.query) sp.set('query', params.query);
      if (params?.region) sp.set('region', params.region);
      if (params?.sortBy) sp.set('sortBy', params.sortBy);
      if (params?.standalone !== undefined) sp.set('standalone', String(params.standalone));
      if (params?.page !== undefined) sp.set('page', String(params.page));
      if (params?.size !== undefined) sp.set('size', String(params.size));

      const timeoutSignal = AbortSignal.timeout(12000);
      const activeSignal = params?.signal
        ? (typeof AbortSignal.any === 'function'
            ? AbortSignal.any([params.signal, timeoutSignal])
            : params.signal)
        : timeoutSignal;

      const res = await fetch(`${API_BASE_URL}/api/posts/catalog?${sp.toString()}`, {
        signal: activeSignal,
      });
      if (!res.ok) {
        let errorDetails = '';
        try {
          errorDetails = await res.text();
        } catch {
          errorDetails = '';
        }
        console.warn(
          `[Reader API] Lỗi khi tải danh mục catalog: HTTP ${res.status} ${res.statusText}${
            errorDetails ? ` - Chi tiết: ${errorDetails}` : ''
          }`
        );
        return null;
      }
      const json = await res.json();
      return unwrap<CatalogResponseData>(json);
    } catch (err: unknown) {
      const errObj = err as Error | undefined;
      if (errObj?.name === 'AbortError') {
        console.warn('[Reader API] Yêu cầu tải danh mục catalog đã bị hủy hoặc quá thời gian chờ (12000ms)');
        return null;
      }
      const message = errObj?.message || String(err);
      console.warn(`[Reader API] Lỗi khi tải danh mục catalog: ${message}`, err);
      return null;
    }
  },

  // ─── 6. Map Backend CatalogLesson to UI Lesson Model ─────────────────────
  mapCatalogLessonToDiscoveryLesson(item: CatalogLesson): Lesson {
    const safeSummary = item.summary || 'Khám phá bài học văn hóa Việt Nam độc đáo cùng VieCultures.';
    const resolvedSummaryVi = item.summaryVi || safeSummary;
    const safeReadTime = item.readTime || '3 phút đọc';
    const safeVocabCount = typeof item.vocabCount === 'number' ? item.vocabCount : 0;

    const defaultLevelDetail = (summaryText: string, summaryViText: string) => ({
      readTime: safeReadTime,
      vocabCount: safeVocabCount,
      summary: summaryText,
      summaryVi: summaryViText,
    });

    const levelDetails: Record<'Level 1' | 'Level 2' | 'Level 3', LevelDetail> = {
      'Level 1': item.levelDetails && item.levelDetails['Level 1']
        ? {
            readTime: item.levelDetails['Level 1'].readTime || '3 phút đọc',
            vocabCount: item.levelDetails['Level 1'].vocabCount ?? safeVocabCount,
            wordCount: item.levelDetails['Level 1'].wordCount,
            summary: item.levelDetails['Level 1'].summary || safeSummary,
            summaryVi: item.levelDetails['Level 1'].summaryVi || resolvedSummaryVi,
          }
        : defaultLevelDetail(safeSummary, resolvedSummaryVi),
      'Level 2': item.levelDetails && item.levelDetails['Level 2']
        ? {
            readTime: item.levelDetails['Level 2'].readTime || safeReadTime,
            vocabCount: item.levelDetails['Level 2'].vocabCount ?? safeVocabCount,
            wordCount: item.levelDetails['Level 2'].wordCount,
            summary: item.levelDetails['Level 2'].summary || safeSummary,
            summaryVi: item.levelDetails['Level 2'].summaryVi || resolvedSummaryVi,
          }
        : defaultLevelDetail(safeSummary, resolvedSummaryVi),
      'Level 3': item.levelDetails && item.levelDetails['Level 3']
        ? {
            readTime: item.levelDetails['Level 3'].readTime || '6 phút đọc',
            vocabCount: item.levelDetails['Level 3'].vocabCount ?? 12,
            wordCount: item.levelDetails['Level 3'].wordCount,
            summary: item.levelDetails['Level 3'].summary || safeSummary,
            summaryVi: item.levelDetails['Level 3'].summaryVi || resolvedSummaryVi,
          }
        : defaultLevelDetail(safeSummary, resolvedSummaryVi),
    };

    const availableLevels =
      item.availableLevels && item.availableLevels.length > 0
        ? item.availableLevels
        : (['Level 1', 'Level 2', 'Level 3'] as any);

    const iconMap: Record<string, string> = {
      Heritage: 'landmark',
      Cuisine: 'utensils',
      Crafts: 'palette',
      Nature: 'mountain',
      Folklore: 'lamp',
    };

    const categorySafe = item.category || 'Heritage';
    const categoryViSafe = item.categoryVi || 'Di sản văn hóa';

    return {
      id: item.id,
      title: item.titleEn || item.titleVi || 'Bài học văn hóa',
      vietnameseTitle: item.titleVi || item.titleEn || 'Bài học văn hóa',
      category: categorySafe,
      categoryVi: categoryViSafe,
      cefrLevel: item.primaryLevel || 'Level 2',
      availableLevels: ['Level 1', 'Level 2', 'Level 3'], // Luôn hỗ trợ cả 3 level để không bị mất bài khi user đổi tab level
      levelDetails,
      readTime: safeReadTime,
      vocabCount: safeVocabCount,
      summary: safeSummary,
      summaryVi: resolvedSummaryVi,
      gradient: 'from-amber-600/40 via-emerald-800/60 to-heritage-green/90',
      iconSymbol: iconMap[categorySafe] || 'landmark',
      imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&w=1200&q=80',
      featured: item.featured ?? false,
      isFromDatabase: true,
      journeyId: item.journeyId,
      isStandalone: item.isStandalone ?? !item.journeyId,
      dateAdded: item.createdAt || new Date().toISOString(),
    };
  },

  // ─── 7. Resolve Local Article Fallback (Curated Heritage Articles) ────────
  getLocalArticle(_id: string, _requestedLevel: string = 'Level 2'): ReaderArticleData | null {
    return null;
  },
};
