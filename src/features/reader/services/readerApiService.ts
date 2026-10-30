import type { ReadingPostItem } from '@/features/admin/types/adminTypes';
import type { VocabItem } from '@/data/readerData';
import { LESSONS_DATA, type Lesson, type LevelDetail } from '@/data/discoveryData';
import { VIETNAM_LANDMARKS } from '@/data/landmarksData';
import { resolveDeckCards } from '@/data/flashcardsData';
import { API_BASE_URL } from '@/config/apiConfig';
import { getDefaultReaderArticle } from '../data/defaultReaderArticle';
import { getSeriesArticle } from '@/data/series';

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
}

export interface CatalogLesson {
  id: string;
  topicGroup?: string;
  titleEn: string;
  titleVi: string;
  category: "Heritage" | "Cuisine" | "Crafts" | "Nature" | "Folklore";
  categoryVi: string;
  region: string;
  imageUrl: string;
  summary: string;
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

export const readerApiService = {
  // ─── 1. Fetch Post Detail by ID ──────────────────────────────────────────
  async getPostById(id: string): Promise<ReadingPostItem | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/posts/${encodeURIComponent(id)}`, { signal: AbortSignal.timeout(8000) });
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
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
      const list: ReadingPostItem[] = await res.json();
      return list && list.length > 0 ? list[0] : null;
    } catch (err) {
      console.warn(`[Reader API] Lỗi khi tìm bài theo topicGroup & level:`, err);
      return null;
    }
  },

  // ─── 3. Fetch All Available Posts ────────────────────────────────────────
  async getAllPosts(): Promise<ReadingPostItem[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/posts`);
      if (!res.ok) return [];
      return await res.json();
    } catch (err) {
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
          enDefinition: v.usageNote || undefined,
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
    page?: number;
    size?: number;
  }): Promise<CatalogResponseData | null> {
    try {
      const sp = new URLSearchParams();
      if (params?.topic && params.topic !== 'All') sp.set('topic', params.topic);
      if (params?.level && params.level !== 'All') sp.set('level', params.level);
      if (params?.query) sp.set('query', params.query);
      if (params?.region) sp.set('region', params.region);
      if (params?.sortBy) sp.set('sortBy', params.sortBy);
      if (params?.page !== undefined) sp.set('page', String(params.page));
      if (params?.size !== undefined) sp.set('size', String(params.size));

      const res = await fetch(`${API_BASE_URL}/api/posts/catalog?${sp.toString()}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.warn('[Reader API] Lỗi khi tải danh mục catalog:', err);
      return null;
    }
  },

  // ─── 6. Map Backend CatalogLesson to UI Lesson Model ─────────────────────
  mapCatalogLessonToDiscoveryLesson(item: CatalogLesson): Lesson {
    const safeSummary = item.summary || 'Khám phá bài học văn hóa Việt Nam độc đáo cùng VieCultures.';
    const safeReadTime = item.readTime || '3 phút đọc';
    const safeVocabCount = typeof item.vocabCount === 'number' ? item.vocabCount : 0;

    const defaultLevelDetail = (summaryText: string) => ({
      readTime: safeReadTime,
      vocabCount: safeVocabCount,
      summary: summaryText,
    });

    const levelDetails: Record<'Level 1' | 'Level 2' | 'Level 3', LevelDetail> = {
      'Level 1': item.levelDetails && item.levelDetails['Level 1']
        ? {
            readTime: item.levelDetails['Level 1'].readTime || '3 phút đọc',
            vocabCount: item.levelDetails['Level 1'].vocabCount ?? safeVocabCount,
            wordCount: item.levelDetails['Level 1'].wordCount,
            summary: item.levelDetails['Level 1'].summary || safeSummary,
          }
        : defaultLevelDetail(safeSummary),
      'Level 2': item.levelDetails && item.levelDetails['Level 2']
        ? {
            readTime: item.levelDetails['Level 2'].readTime || safeReadTime,
            vocabCount: item.levelDetails['Level 2'].vocabCount ?? safeVocabCount,
            wordCount: item.levelDetails['Level 2'].wordCount,
            summary: item.levelDetails['Level 2'].summary || safeSummary,
          }
        : {
            readTime: safeReadTime,
            vocabCount: safeVocabCount,
            summary: safeSummary,
          },
      'Level 3': item.levelDetails && item.levelDetails['Level 3']
        ? {
            readTime: item.levelDetails['Level 3'].readTime || '6 phút đọc',
            vocabCount: item.levelDetails['Level 3'].vocabCount ?? 12,
            wordCount: item.levelDetails['Level 3'].wordCount,
            summary: item.levelDetails['Level 3'].summary || safeSummary,
          }
        : {
            readTime: '6 phút đọc',
            vocabCount: 12,
            summary: safeSummary,
          },
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
      gradient: 'from-amber-600/40 via-emerald-800/60 to-heritage-green/90',
      iconSymbol: iconMap[categorySafe] || 'landmark',
      imageUrl: item.imageUrl || 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&w=1200&q=80',
      featured: item.featured ?? false,
      isFromDatabase: true,
      dateAdded: item.createdAt || new Date().toISOString(),
    };
  },

  // ─── 7. Resolve Local Article Fallback (Curated Heritage Articles) ────────
  getLocalArticle(id: string, requestedLevel: string = 'Level 2'): ReaderArticleData | null {
    if (!id) return null;

    const seriesArticle = getSeriesArticle(id);
    if (seriesArticle) return seriesArticle;

    const normalize = (s: string) => s.toLowerCase().trim().replace(/[-_\s]+/g, '');
    const normTarget = normalize(id);
    if (normTarget === 'tetholiday' || normTarget === 'tetfestivities') {
      return getDefaultReaderArticle(requestedLevel);
    }

    // 1. Check in LESSONS_DATA
    const lesson = LESSONS_DATA.find((l) => normalize(l.id) === normTarget);
    if (lesson) {
      const safeLevel: 'Level 1' | 'Level 2' | 'Level 3' =
        requestedLevel === 'Level 1' || requestedLevel === 'Level 3' ? requestedLevel : 'Level 2';
      const levelDetail = lesson.levelDetails?.[safeLevel] || lesson.levelDetails?.['Level 2'];
      const vocabMap: Record<string, VocabItem> = {};
      const vocabList: VocabItem[] = [];

      const cards = resolveDeckCards(lesson.id);
      if (cards.length > 0) {
        cards.forEach((c) => {
          const item: VocabItem = {
            id: c.id,
            word: c.word,
            pos: c.pos,
            ipa: c.ipa,
            viMeaning: c.viMeaning,
            contextSentence: c.contextEn,
            enDefinition: c.viDefinition,
          };
          vocabMap[c.word.toLowerCase()] = item;
          vocabList.push(item);
        });
      }

      return {
        id: lesson.id,
        titleEn: lesson.title,
        titleVi: lesson.vietnameseTitle,
        topic: lesson.categoryVi,
        region: 'Việt Nam',
        level: requestedLevel,
        cefrLevel: requestedLevel,
        wordCount: levelDetail?.wordCount || 320,
        readTime: levelDetail?.readTime || lesson.readTime,
        imageUrl: lesson.imageUrl,
        summary: levelDetail?.summary || lesson.summary,
        paragraphs: [
          {
            orderIndex: 0,
            enText: levelDetail?.summary || lesson.summary,
            viText: lesson.vietnameseTitle + ' là một trong những nét đẹp văn hóa độc đáo của Việt Nam.',
          },
          {
            orderIndex: 1,
            enText: `Discovering ${lesson.title} offers deeper insights into the traditions and timeless spirit of Vietnamese heritage.`,
            viText: `Khám phá ${lesson.vietnameseTitle} mang lại những hiểu biết sâu sắc hơn về truyền thống và tinh thần bất biến của di sản Việt.`,
          },
        ],
        vocabularies: vocabList,
        vocabMap,
      };
    }

    // 2. Check in VIETNAM_LANDMARKS
    const landmark = VIETNAM_LANDMARKS.find((lm) => normalize(lm.id) === normTarget);
    if (landmark) {
      const vocabMap: Record<string, VocabItem> = {};
      const vocabList: VocabItem[] = [];

      resolveDeckCards(landmark.id).forEach(card => {
        const item: VocabItem = { id: card.id, word: card.word, pos: card.pos, ipa: card.ipa,
          viMeaning: card.viMeaning, contextSentence: card.contextEn, enDefinition: card.viDefinition };
        vocabMap[item.word.toLowerCase()] = item;
        vocabList.push(item);
      });

      return {
        id: landmark.id,
        titleEn: landmark.title,
        titleVi: landmark.titleVi,
        topic: landmark.category,
        region: landmark.region === 'north' ? 'Miền Bắc' : landmark.region === 'central' ? 'Miền Trung' : 'Miền Nam',
        level: requestedLevel,
        cefrLevel: landmark.level || requestedLevel,
        wordCount: 280,
        readTime: landmark.readTime,
        imageUrl: landmark.image,
        summary: landmark.subtitle,
        paragraphs: [
          {
            orderIndex: 0,
            enText: landmark.excerptEn,
            viText: landmark.excerptVi,
          },
          {
            orderIndex: 1,
            enText: landmark.speakingSentenceEn,
            viText: landmark.speakingSentenceVi,
          },
        ],
        vocabularies: vocabList,
        vocabMap,
      };
    }

    return null;
  },
};
