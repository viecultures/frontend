import type { ReadingPostItem } from '@/features/admin/types/adminTypes';
import { VOCAB_DATABASE, type VocabItem } from '@/data/readerData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

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
}

export const readerApiService = {
  // ─── 1. Fetch Post Detail by ID ──────────────────────────────────────────
  async getPostById(id: string): Promise<ReadingPostItem | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/api/posts/${id}`);
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
    const vocabMap: Record<string, VocabItem> = { ...VOCAB_DATABASE };
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
    };
  },
};
