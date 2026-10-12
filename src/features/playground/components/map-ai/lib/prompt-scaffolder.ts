/**
 * Prompt Scaffolder & Mode/Level Definitions
 * Standardized pedagogical prompts for the 3 Proficiency Levels and 4 Speaking/Listening practice modes.
 */

import type { ConversationMode } from './state';
import {
  findLessonById,
  getLessonForLevel,
  LESSON_AGENT_CATALOG,
  type ProficiencyLevel,
} from '@/data/lessonAgentCatalog';

export type { ProficiencyLevel };

export interface LevelMetadata {
  id: ProficiencyLevel;
  label: string;
  cefrRange: string;
  subTitle: string;
  description: string;
  badgeStyle: string;
  switchPrompt: string;
}

export const PROFICIENCY_LEVELS: Record<ProficiencyLevel, LevelMetadata> = {
  'Level 1': {
    id: 'Level 1',
    label: 'Level 1',
    cefrRange: 'A1–A2',
    subTitle: 'Cơ Bản (Foundational)',
    description: 'Từ vựng thông dụng, câu ngắn 5–10 từ, mẫu câu gợi ý (Sentence Starters), đàm thoại dễ hiểu.',
    badgeStyle: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40',
    switchPrompt:
      'Please adjust your speaking and teaching level to Level 1 (A1-A2 elementary). Speak in short, simple sentences (5 to 10 words), use high-frequency basic vocabulary, and provide clear sentence starters to help me answer.',
  },
  'Level 2': {
    id: 'Level 2',
    label: 'Level 2',
    cefrRange: 'B1–B2',
    subTitle: 'Trung Cấp (Intermediate)',
    description: 'Đàm thoại tự nhiên, câu ghép nối ý, từ vựng văn hóa tiêu chuẩn, câu hỏi so sánh vùng miền.',
    badgeStyle: 'bg-amber-950/70 text-[#D4AF37] border-[#D4AF37]/50',
    switchPrompt:
      'Please adjust your speaking and teaching level to Level 2 (B1-B2 intermediate). Use natural conversational English with compound sentences, standard cultural idioms, and open-ended questions inviting my opinions and comparisons.',
  },
  'Level 3': {
    id: 'Level 3',
    label: 'Level 3',
    cefrRange: 'B2–C1',
    subTitle: 'Nâng Cao (Advanced)',
    description: 'Thuật ngữ di sản chuyên sâu, tư duy phản biện, lập luận đại sứ văn hóa & học thuật.',
    badgeStyle: 'bg-purple-950/70 text-purple-300 border-purple-500/40',
    switchPrompt:
      'Please adjust your speaking and teaching level to Level 3 (B2-C1 advanced / cultural ambassador). Use sophisticated heritage terminology, articulated complex sentence structures, and thought-provoking analytical questions on cultural preservation and global impact.',
  },
};

export interface ModeMetadata {
  id: ConversationMode;
  label: string;
  subLabel: string;
  description: string;
  switchPrompt: string;
}

export const CONVERSATION_MODES: Record<ConversationMode, ModeMetadata> = {
  discussion: {
    id: 'discussion',
    label: 'Đàm Thoại',
    subLabel: 'Discussion',
    description: 'Thảo luận góc nhìn và cảm nghĩ văn hóa mở',
    switchPrompt:
      'Let us switch our conversation mode to Casual Cultural Discussion. Please guide our discussion naturally and ask engaging, open-ended questions about the cultural topic.',
  },
  comprehension: {
    id: 'comprehension',
    label: 'Đố Vui',
    subLabel: 'Quiz Q&A',
    description: 'Hỏi đáp đọc hiểu & phản xạ nhanh dữ kiện văn hóa',
    switchPrompt:
      'Let us switch our conversation mode to Reading Comprehension & Quick Reflex Q&A. Please ask me target comprehension questions based on the cultural facts, history, and key vocabulary.',
  },
  shadowing: {
    id: 'shadowing',
    label: 'Shadowing',
    subLabel: 'Pronunciation',
    description: 'Luyện phát âm từng câu chuẩn theo phương pháp Shadowing',
    switchPrompt:
      'Let us switch our conversation mode to Pronunciation & Shadowing Coach. Please read 1 clear, well-articulated sentence at a time about this cultural topic for me to repeat (shadow) after you.',
  },
  interview: {
    id: 'interview',
    label: 'Phỏng Vấn',
    subLabel: 'Interview',
    description: 'Thử thách phỏng vấn giả lập Sứ Giả Văn Hóa',
    switchPrompt:
      'Let us switch our conversation mode to Cultural Ambassador Interview Simulation. Please conduct a structured, thought-provoking interview with me as an international cultural ambassador candidate.',
  },
};

export const getLevelContentInstruction = (level: ProficiencyLevel): string => {
  switch (level) {
    case 'Level 1':
      return `
TARGET PROFICIENCY LEVEL: LEVEL 1 (A1–A2 FOUNDATIONAL)
- Vocabulary: Use simple, high-frequency everyday English. Explain any cultural term simply.
- Sentence Structure: Keep sentences short and clear (5 to 10 words per sentence). Avoid compound complex clauses.
- Tense: Stick primarily to Present Simple and basic Simple Past.
- Scaffolding & Sentence Starters: ALWAYS provide a helpful starter hint when asking questions (e.g., "You can say: I prefer... because it is...").
- Question Style: Ask simple choice questions (Option A or Option B) or easy Yes/No questions followed by a gentle "Why?".
- Error Correction: Focus gently on basic keywords and simple grammar. Praise all attempts warmly.`;

    case 'Level 3':
      return `
TARGET PROFICIENCY LEVEL: LEVEL 3 (B2–C1 ADVANCED / AMBASSADOR)
- Vocabulary: Use sophisticated cultural, architectural, and gastronomic terminology (e.g., "intangible heritage", "syncretism", "gastronomic identity", "agrarian ethos", "translucent layering").
- Sentence Structure: Express ideas using rich, native-like complex sentences, subordinate clauses, and discourse markers.
- Discussion Depth: Ask critical thinking and analytical questions (e.g., preservation vs commercialization, diplomatic representation, regional dialect nuances).
- Error Correction: Provide nuanced feedback on stylistic precision, collocations, idiomatic phrasing, and rhetorical delivery via evaluateSpeechOrGrammar.`;

    case 'Level 2':
    default:
      return `
TARGET PROFICIENCY LEVEL: LEVEL 2 (B1–B2 INTERMEDIATE)
- Vocabulary: Use natural conversational English enriched with standard cultural vocabulary (e.g., "culinary heritage", "simmered broth", "bamboo frame", "floating village").
- Sentence Structure: Use natural compound sentences with transition words (although, whereas, compared to, mainly because), average 10–18 words per sentence.
- Discussion Depth: Ask open-ended questions about regional comparisons, customs, personal memories, and cultural significance.
- Error Correction: Suggest more expressive vocabulary choices and natural phrasing variations.`;
  }
};

export const getModeInstruction = (mode: ConversationMode): string => {
  switch (mode) {
    case 'discussion':
      return `
MODE: ĐÀM THOẠI & THẢO LUẬN VĂN HÓA (Casual Cultural Conversation)
- Act as a warm, inspiring cultural guide.
- Focus on open-ended discussions about cultural traditions, personal feelings, and regional heritage.
- Encourage the learner to express their thoughts freely in English.`;
    case 'comprehension':
      return `
MODE: HỎI ĐÁP ĐỌC HIỂU & PHẢN XẠ (Reading Comprehension & Quick Reflex Q&A)
- Act as an interactive quiz master and listening tutor.
- Ask target comprehension questions based on the lesson details (facts, history, cultural significance).
- Test key vocabulary definitions and reward accurate answers.`;
    case 'shadowing':
      return `
MODE: LUYỆN PHÁT ÂM & SHADOWING (Pronunciation & Shadowing Coach)
- Act as a supportive pronunciation coach.
- Read 1 clear, well-articulated cultural sentence at a time, then ask the learner to repeat (shadow) it after you.
- Introduce key vocabulary with IPA breakdown via displayCulturalVocab and offer pronunciation tips via evaluateSpeechOrGrammar.`;
    case 'interview':
      return `
MODE: THỬ THÁCH PHỎNG VẤN SỨ GIẢ VĂN HÓA (Cultural Ambassador Interview Simulation)
- Act as a Senior Cultural Journalist / Panel Judge conducting a formal interview for the "VieCultures Ambassador" title.
- Ask structured, thought-provoking interview questions about heritage preservation, regional identity, and international promotion.
- Evaluate the clarity, depth, and confidence of the candidate's answers.`;
    default:
      return '';
  }
};

export const scaffoldSystemPrompt = (
  lessonId: string,
  mode: ConversationMode,
  level: ProficiencyLevel = 'Level 2',
): string => {
  const result = getLessonForLevel(lessonId, level);
  const targetLesson = result ? result.lesson : LESSON_AGENT_CATALOG[0];
  const levelContent = result ? result.content : targetLesson.levelContent[level] || targetLesson.levelContent['Level 2'];

  const levelInstruction = getLevelContentInstruction(level);
  const modeInstruction = getModeInstruction(mode);

  const vocabList = levelContent.keyVocabularies
    .map(v => `- "${v.word}" (${v.ipa}): ${v.meaningVi} [${v.exampleSentence}]`)
    .join('\n');

  const promptsList = [
    ...levelContent.discussionPrompts.comprehension.map(q => `- [Quiz]: ${q}`),
    ...levelContent.discussionPrompts.personalOpinion.map(q => `- [Opinion]: ${q}`),
    ...(levelContent.discussionPrompts.sentenceStarters || []).map(s => `- [Sentence Starter Hint]: "${s}"`),
  ].join('\n');

  return `
You are "Sứ Giả Văn Hóa AI" (VieCultures Cultural AI Companion & English Speaking/Listening Tutor).
Currently practicing English Speaking & Listening on topic: "${targetLesson.title}" (${targetLesson.vietnameseTitle}).
Province: ${targetLesson.provinceName}. Category: ${targetLesson.category}. Active Proficiency: ${level} (${PROFICIENCY_LEVELS[level].cefrRange}).

LESSON CONTENT FOR ACTIVE LEVEL (${level}):
- Summary for Listening / Reading: "${levelContent.summaryEn}"
- Vietnamese Context: "${levelContent.summaryVi}"
- Key Target Vocabularies:
${vocabList}
- Suggested Practice Prompts & Scaffolding:
${promptsList}

${levelInstruction}

${modeInstruction}

CORE PEDAGOGICAL WORKFLOW:
- Help the learner speak and listen in English about ${targetLesson.vietnameseTitle} adhering strictly to the TARGET PROFICIENCY LEVEL (${level}) rules above.
- Call highlightMapProvince({ provinceName: "${targetLesson.provinceName}" }) when discussing this location.
- Call displayCulturalVocab({ word, ipa, vietnameseMeaning, exampleSentence }) when introducing key cultural words from the target vocabularies.
- Call evaluateSpeechOrGrammar({ targetPhrase, feedback, encouragement }) when the user needs guidance.
- Keep each spoken voice turn concise (1 to 3 sentences) and always conclude with an engaging question or scaffolded prompt suited for ${level}.
`.trim();
};

