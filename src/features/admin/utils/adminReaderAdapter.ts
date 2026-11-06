import type {
  CefrLevel,
  ParagraphPairDto,
  VocabItemDto,
  QuizQuestionDto,
  AudioTrackDto,
} from '../types/adminTypes';
import type {
  ReaderArticleData,
  QuizQuestionItem,
  QuizOptionItem,
} from '@/features/reader/services/readerApiService';
import type { VocabItem } from '@/data/readerData';

/**
 * Ánh xạ chuẩn từ cấp độ CEFR sang Reader Level (Level 1, Level 2, Level 3).
 * A1, A2 -> Level 1
 * B1, B2 -> Level 2
 * C1, C2 -> Level 3
 */
export function mapCefrToReaderLevel(level?: CefrLevel | string): 'Level 1' | 'Level 2' | 'Level 3' {
  if (!level) return 'Level 2';
  const normalized = level.trim().toUpperCase();
  if (normalized === 'A1' || normalized === 'A2' || normalized === 'LEVEL 1') {
    return 'Level 1';
  }
  if (normalized === 'C1' || normalized === 'C2' || normalized === 'LEVEL 3') {
    return 'Level 3';
  }
  return 'Level 2';
}

export interface AdminReaderAdapterInput {
  id?: string;
  titleEn: string;
  titleVi: string;
  topic: string;
  region?: string;
  level: CefrLevel;
  readTime?: string;
  imageUrl?: string;
  shadowingAudioUrl?: string;
  summary?: string;
  paragraphs: ParagraphPairDto[];
  vocabularies: VocabItemDto[];
  questions?: QuizQuestionDto[];
  voiceTracks?: AudioTrackDto[];
}

/**
 * Chuyển đổi dữ liệu từ biểu mẫu biên soạn bài viết của Admin sang định dạng ReaderArticleData
 * tương thích 100% với ReaderPage và BilingualReaderView.
 */
export function adaptAdminPostToReaderData(input: AdminReaderAdapterInput): ReaderArticleData {
  const defaultFallbackImage =
    'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&w=1200&q=80';

  // 1. Tính tổng số từ tiếng Anh trong các đoạn văn
  let totalWordCount = 0;
  if (input.paragraphs && input.paragraphs.length > 0) {
    totalWordCount = input.paragraphs.reduce((accumulatedWords, paragraph) => {
      const wordsInParagraph = paragraph.enText
        ? paragraph.enText.trim().split(/\s+/).filter(Boolean).length
        : 0;
      return accumulatedWords + wordsInParagraph;
    }, 0);
  }

  // 2. Phân giải URL âm thanh từ shadowingAudioUrl hoặc voiceTracks đầu tiên
  const resolvedAudioUrl =
    input.shadowingAudioUrl?.trim() ||
    input.voiceTracks?.[0]?.normalUrl?.trim() ||
    input.voiceTracks?.[0]?.slowUrl?.trim() ||
    '';

  // 3. Chuẩn hóa danh sách đoạn văn song ngữ
  const mappedParagraphs =
    input.paragraphs && input.paragraphs.length > 0
      ? input.paragraphs.map((p, index) => ({
          id: p.id || `para-preview-${index}`,
          orderIndex: typeof p.orderIndex === 'number' ? p.orderIndex : index,
          enText: p.enText || '',
          viText: p.viText || '',
          audioTimestampStart: p.audioTimestampStart,
          audioTimestampEnd: p.audioTimestampEnd,
        }))
      : [
          {
            id: 'para-preview-empty',
            orderIndex: 0,
            enText:
              input.summary ||
              'Cultural story draft preview. Add paragraphs on the left editor to preview bilingual layout.',
            viText:
              'Bản xem trước câu chuyện văn hóa. Hãy thêm các đoạn văn ở cột biên soạn bên trái để xem bố cục song ngữ trực tiếp.',
          },
        ];

  // 4. Chuẩn hóa danh sách từ vựng trọng tâm và xây dựng từ điển tra cứu nhanh (vocabMap)
  const vocabMap: Record<string, VocabItem> = {};
  const mappedVocabularies: VocabItem[] = [];

  (input.vocabularies || []).forEach((v, index) => {
    if (!v.word || !v.word.trim()) return;
    const cleanWord = v.word.trim();
    const item: VocabItem = {
      id: v.id || `vocab-preview-${index}`,
      word: cleanWord,
      pos: v.pos || 'từ vựng',
      ipa: v.ipa || '',
      viMeaning: v.viMeaning || '',
      enDefinition: v.usageNote || undefined,
      contextSentence: v.contextSentence || '',
      audioUrl: v.audioUrl || undefined,
    };
    mappedVocabularies.push(item);
    vocabMap[cleanWord.toLowerCase()] = item;
  });

  // 5. Chuẩn hóa danh sách câu hỏi trắc nghiệm ôn tập
  const mappedQuestions: QuizQuestionItem[] = (input.questions || []).map((q, qIndex) => {
    let parsedOptions: QuizOptionItem[] = [];
    if (typeof q.options === 'string') {
      try {
        const parsed = JSON.parse(q.options);
        if (Array.isArray(parsed)) {
          parsedOptions = parsed.map((opt, optIndex) => ({
            key: opt.key || String.fromCharCode(65 + optIndex),
            text: typeof opt === 'string' ? opt : opt.text || '',
          }));
        }
      } catch {
        parsedOptions = [];
      }
    } else if (Array.isArray(q.options)) {
      parsedOptions = q.options.map((opt, optIndex) => ({
        key: opt.key || String.fromCharCode(65 + optIndex),
        text: opt.text || '',
      }));
    }

    return {
      id: q.id || `quiz-preview-${qIndex}`,
      orderIndex: typeof q.orderIndex === 'number' ? q.orderIndex : qIndex,
      question: q.question || '',
      options: parsedOptions,
      correctKey: q.correctKey || 'A',
      explanation: q.explanation || '',
    };
  });

  const readerLevel = mapCefrToReaderLevel(input.level);
  const calculatedReadTime =
    input.readTime ||
    `${Math.max(1, Math.ceil((totalWordCount || 200) / 100))} phút đọc`;

  return {
    id: input.id || 'preview-draft',
    titleEn: input.titleEn?.trim() || 'Untitled Cultural Story',
    titleVi: input.titleVi?.trim() || 'Tiêu đề câu chuyện văn hóa',
    topic: input.topic || 'Văn hóa & Phong tục',
    region: input.region || 'Việt Nam',
    level: readerLevel,
    cefrLevel: input.level || 'B1',
    wordCount: totalWordCount,
    readTime: calculatedReadTime,
    imageUrl: input.imageUrl?.trim() || defaultFallbackImage,
    summary:
      input.summary?.trim() ||
      (mappedParagraphs[0]?.enText?.slice(0, 160) ?? ''),
    summaryVi: input.summary?.trim()
      ? undefined
      : (mappedParagraphs[0]?.viText?.slice(0, 160) ?? ''),
    shadowingAudioUrl: resolvedAudioUrl || undefined,
    paragraphs: mappedParagraphs,
    vocabularies: mappedVocabularies,
    vocabMap,
    questions: mappedQuestions,
  };
}
