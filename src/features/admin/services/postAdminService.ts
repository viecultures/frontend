import type {
  ReadingPostPayload,
  ReadingPostItem,
  ParagraphPairDto,
  VocabItemDto,
  CefrLevel,
} from '../types/adminTypes';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export interface PostFilterParams {
  topic?: string;
  region?: string;
  topicGroup?: string;
  level?: string;
  query?: string;
}

export const postAdminService = {
  // ─── 1. API Calls ─────────────────────────────────────────────────────────

  async getPosts(params?: PostFilterParams): Promise<ReadingPostItem[]> {
    const searchParams = new URLSearchParams();
    if (params?.topic) searchParams.append('topic', params.topic);
    if (params?.region) searchParams.append('region', params.region);
    if (params?.topicGroup) searchParams.append('topicGroup', params.topicGroup);
    if (params?.level) searchParams.append('level', params.level);
    if (params?.query) searchParams.append('query', params.query);

    const url = `${API_BASE_URL}/api/posts${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Không thể tải danh sách bài viết (HTTP ${res.status})`);
    }
    return res.json();
  },

  async getPostById(id: string): Promise<ReadingPostItem> {
    const res = await fetch(`${API_BASE_URL}/api/posts/${id}`);
    if (!res.ok) {
      throw new Error(`Không tìm thấy bài viết ID: ${id}`);
    }
    return res.json();
  },

  async createPost(payload: ReadingPostPayload): Promise<ReadingPostItem> {
    const res = await fetch(`${API_BASE_URL}/api/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.text();
      throw new Error(errData || `Lỗi khi tạo bài viết (HTTP ${res.status})`);
    }
    return res.json();
  },

  async updatePost(id: string, payload: ReadingPostPayload): Promise<ReadingPostItem> {
    const res = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errData = await res.text();
      throw new Error(errData || `Lỗi khi cập nhật bài viết (HTTP ${res.status})`);
    }
    return res.json();
  },

  async deletePost(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE_URL}/api/posts/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error(`Lỗi khi xóa bài viết ID: ${id}`);
    }
    return res.json();
  },

  // ─── 2. Thông minh: Tự động chia đoạn song ngữ (Auto-Split Bilingual) ────

  autoSplitBilingual(enFullText: string, viFullText: string): ParagraphPairDto[] {
    const enParas = enFullText
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);

    const viParas = viFullText
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);

    const maxLength = Math.max(enParas.length, viParas.length);
    const result: ParagraphPairDto[] = [];

    for (let i = 0; i < maxLength; i++) {
      result.push({
        orderIndex: i,
        enText: enParas[i] || '',
        viText: viParas[i] || '',
        audioTimestampStart: 0,
        audioTimestampEnd: 0,
      });
    }

    return result;
  },

  // ─── 3. Thông minh: Parse danh sách từ vựng dạng Text ─────────────────────

  parseKeyVocabularyText(rawText: string, defaultLevel: CefrLevel = 'B1'): VocabItemDto[] {
    const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);
    const result: VocabItemDto[] = [];

    for (const line of lines) {
      // Bỏ qua dòng tiêu đề bảng nếu có
      if (line.toLowerCase().includes('word / phrase') || line.toLowerCase().includes('nghĩa tiếng việt')) {
        continue;
      }

      let word = '';
      let meaning = '';

      // Trường hợp 1: Dấu tab: word \t meaning
      if (line.includes('\t')) {
        const parts = line.split('\t').map((p) => p.trim());
        word = parts[0] || '';
        meaning = parts.slice(1).join(' ').trim();
      }
      // Trường hợp 2: Dấu gạch ngang dài / ngắn: "- word — meaning" hoặc "word - meaning"
      else if (line.includes('—') || line.includes('–') || line.includes(' - ')) {
        const delimiter = line.includes('—') ? '—' : line.includes('–') ? '–' : ' - ';
        const cleanLine = line.startsWith('-') ? line.substring(1).trim() : line;
        const parts = cleanLine.split(delimiter).map((p) => p.trim());
        word = parts[0] || '';
        meaning = parts.slice(1).join(' ').trim();
      }
      // Trường hợp 3: Dấu hai chấm: "word: meaning"
      else if (line.includes(':')) {
        const cleanLine = line.startsWith('-') ? line.substring(1).trim() : line;
        const parts = cleanLine.split(':').map((p) => p.trim());
        word = parts[0] || '';
        meaning = parts.slice(1).join(' ').trim();
      }

      if (word && meaning) {
        result.push({
          word,
          viMeaning: meaning,
          pos: word.includes(' ') ? 'phrase' : 'noun',
          level: defaultLevel,
          contextSentence: '',
        });
      }
    }

    return result;
  },

  // ─── 4. Thông minh: Phân tích 1 dòng dữ liệu TSV cực nhanh ──────────────────

  parseTsvRow(
    tsvLine: string,
    targetLevelIndex: 1 | 2 | 3 = 1
  ): Partial<ReadingPostPayload> | null {
    if (!tsvLine || !tsvLine.trim()) return null;

    const cols = tsvLine.split('\t');
    if (cols.length < 3) return null;

    const topic = cols[0]?.trim() || '';
    const region = cols[1]?.trim() || '';

    // Cột level: col 2 (Level 1), col 3 (Level 2), col 4 (Level 3)
    const levelColIdx = targetLevelIndex === 1 ? 2 : targetLevelIndex === 2 ? 3 : 4;
    const rawContent = cols[levelColIdx] || cols[2] || '';

    if (!rawContent) return null;

    // Trích xuất TITLE
    let titleEn = '';
    const titleMatch = rawContent.match(/TITLE\s+([^\n\r]+?)(?=\s+LEVEL|$)/i);
    if (titleMatch) {
      titleEn = titleMatch[1].trim();
    }

    // Trích xuất LEVEL CEFR
    let level: CefrLevel = 'B1';
    const levelMatch = rawContent.match(/LEVEL\s+([^\n\r]+?)(?=\s+ENGLISH READING|$)/i);
    if (levelMatch) {
      const lvlStr = levelMatch[1].toUpperCase();
      if (lvlStr.includes('A1')) level = 'A1';
      else if (lvlStr.includes('A2')) level = 'A2';
      else if (lvlStr.includes('B1')) level = 'B1';
      else if (lvlStr.includes('B2')) level = 'B2';
      else if (lvlStr.includes('C1')) level = 'C1';
      else if (lvlStr.includes('C2')) level = 'C2';
    }

    // Trích xuất ENGLISH READING & Word count
    let enReading = '';
    let wordCount = 0;
    const enMatch = rawContent.match(
      /ENGLISH READING\s+([\s\S]+?)(?=\s*(?:Word count:|\bVIETNAMESE TRANSLATION\b)|$)/i
    );
    if (enMatch) {
      enReading = enMatch[1].trim();
    }

    const wcMatch = rawContent.match(/Word count:\s*(\d+)/i);
    if (wcMatch) {
      wordCount = parseInt(wcMatch[1], 10);
    } else if (enReading) {
      wordCount = enReading.split(/\s+/).filter(Boolean).length;
    }

    // Trích xuất VIETNAMESE TRANSLATION
    let viTranslation = '';
    let titleVi = '';
    const viMatch = rawContent.match(
      /VIETNAMESE TRANSLATION\s+([\s\S]+?)(?=\s*(?:\bKEY VOCABULARY\b)|$)/i
    );
    if (viMatch) {
      viTranslation = viMatch[1].trim();
      // Lấy dòng đầu tiên của translation làm Title tiếng Việt nếu có
      const firstLine = viTranslation.split('\n')[0]?.trim();
      if (firstLine && firstLine.length < 150) {
        titleVi = firstLine;
      }
    }

    if (!titleVi) {
      titleVi = topic;
    }

    // Trích xuất KEY VOCABULARY
    let vocabularies: VocabItemDto[] = [];
    const vocabMatch = rawContent.match(/KEY VOCABULARY\s*([\s\S]+)$/i);
    if (vocabMatch) {
      const vocabRaw = vocabMatch[1].trim();
      vocabularies = this.parseKeyVocabularyText(vocabRaw, level);
    }

    // Chia cặp đoạn văn
    const paragraphs = this.autoSplitBilingual(enReading, viTranslation);

    return {
      topicGroup: topic,
      titleEn: titleEn || topic,
      titleVi: titleVi || topic,
      topic: 'Văn hóa & Phong tục',
      region: region,
      level,
      wordCount,
      readTime: `${Math.max(1, Math.ceil(wordCount / 100))} phút`,
      summary: enReading.slice(0, 200) + (enReading.length > 200 ? '...' : ''),
      contentEn: enReading,
      contentVi: viTranslation,
      paragraphs,
      vocabularies,
    };
  },

  // ─── 5. Quản lý Voice Models & Sinh Voice Track Bài Viết ──────────────────

  async getVoiceModels() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/voice/models`);
      if (!res.ok) throw new Error('Không thể tải danh sách model giọng đọc');
      return await res.json();
    } catch (err) {
      console.warn('[postAdminService] Lỗi tải voice models từ server, kích hoạt danh sách chuẩn:', err);
      return [
        {
          id: 'en-US-AmandaMultilingualNeural',
          name: 'Amanda (Nữ - Đa ngôn ngữ)',
          gender: 'Female',
          locale: 'en-US',
          description: 'Giọng Nữ chuẩn quốc tế, phát âm đa ngôn ngữ tự nhiên, truyền cảm và rõ ràng',
          isMultilingual: true,
          isPrimary: true,
        },
        {
          id: 'en-US-DustinMultilingualNeural',
          name: 'Dustin (Nam - Đa ngôn ngữ)',
          gender: 'Male',
          locale: 'en-US',
          description: 'Giọng Nam trầm ấm, phong thái điềm đạm, hỗ trợ đa ngôn ngữ chuẩn xác',
          isMultilingual: true,
          isPrimary: true,
        },
        {
          id: 'en-US-JennyNeural',
          name: 'Jenny (Nữ - Mỹ)',
          gender: 'Female',
          locale: 'en-US',
          description: 'Giọng Nữ bản ngữ Mỹ biểu cảm, ngữ điệu thân thiện, lý tưởng cho bài đọc học thuật',
          isMultilingual: false,
          isPrimary: true,
        },
        {
          id: 'en-US-GuyNeural',
          name: 'Guy (Nam - Mỹ)',
          gender: 'Male',
          locale: 'en-US',
          description: 'Giọng Nam Mỹ trầm bổng, phong cách kể chuyện truyền cảm hứng và cuốn hút',
          isMultilingual: false,
          isPrimary: true,
        },
        {
          id: 'en-US-AriaNeural',
          name: 'Aria (Nữ - Mỹ)',
          gender: 'Female',
          locale: 'en-US',
          description: 'Giọng Nữ năng động, sắc thái chuyên nghiệp, thích hợp phóng sự văn hóa',
          isMultilingual: false,
          isPrimary: false,
        },
        {
          id: 'en-US-DavisNeural',
          name: 'Davis (Nam - Mỹ)',
          gender: 'Male',
          locale: 'en-US',
          description: 'Giọng Nam đĩnh đạc, phát âm chậm rãi, chuẩn mực từng âm tiết',
          isMultilingual: false,
          isPrimary: false,
        },
      ];
    }
  },

  async generateVoiceTrack(payload: {
    text: string;
    voiceId: string;
    voiceName?: string;
    titleSlug?: string;
  }): Promise<{
    success: boolean;
    voiceId: string;
    voiceName: string;
    normalUrl?: string;
    slowUrl: string;
    fastUrl?: string;
    message?: string;
  }> {
    const res = await fetch(`${API_BASE_URL}/api/voice/generate-track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Lỗi khi tạo giọng đọc AI (HTTP ${res.status})`);
    }

    return res.json();
  },
};

