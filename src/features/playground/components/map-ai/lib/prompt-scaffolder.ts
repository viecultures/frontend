/**
 * Prompt Scaffolder & Mode/Level Definitions
 * Standardized pedagogical prompts for the 3 Proficiency Levels and 4 Speaking/Listening practice modes.
 */

import type { ConversationMode } from './state';
import type { ProficiencyLevel } from '@/data/lessonAgentCatalog';

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
    description: 'Nói CHẬM, chia 2-3 đoạn ngắn, câu 5-10 từ, ngữ pháp A1 (There is, People make, Children like), từ vựng Starters-Movers.',
    badgeStyle: 'bg-emerald-950/70 text-emerald-300 border-emerald-500/40',
    switchPrompt:
      'Please adjust your teaching and speaking level to Level 1 (A1 Elementary):\n- SPEAKING PACE: Speak at a slow, calm pace with clear pauses between short sentences.\n- STRUCTURE: Split your response into 2-3 short chunks. Each sentence must be very short (5-10 words) with only ONE main idea.\n- GRAMMAR: Strictly prioritize Present Simple, basic frames (It is/They are, There is/There are, People have/make/use, Children like, It comes from, It is made from, In the past, Today). Avoid compound sentences, conditionals, relative clauses, or complex passive voice.\n- VOCABULARY: Use simple A1 Starters/Movers words. Keep Vietnamese cultural terms intact (Tết, tò he, áo dài, bánh chưng, phở) and proper names with full marks (Hà Nội, TP. Hồ Chí Minh).\n- SCAFFOLDING: Always provide sentence starters (e.g., "You can say: I like...") when asking questions.',
  },
  'Level 2': {
    id: 'Level 2',
    label: 'Level 2',
    cefrRange: 'B1–B2',
    subTitle: 'Trung Cấp (Intermediate)',
    description: 'Tốc độ đàm thoại vừa phải, câu ghép 10–18 từ, từ vựng văn hóa tiêu chuẩn, câu hỏi so sánh vùng miền.',
    badgeStyle: 'bg-amber-950/70 text-[#D4AF37] border-[#D4AF37]/50',
    switchPrompt:
      'Please adjust your speaking and teaching level to Level 2 (B1-B2 intermediate). Speak at a moderate, natural conversational pace. Use compound sentences (10-18 words), standard cultural idioms, and open-ended questions comparing Vietnamese regions and personal cultural memories.',
  },
  'Level 3': {
    id: 'Level 3',
    label: 'Level 3',
    cefrRange: 'B2–C1',
    subTitle: 'Nâng Cao (Advanced)',
    description: 'Tốc độ lưu loát bản ngữ, câu phức học thuật, thuật ngữ di sản chuyên sâu, tư duy phản biện & bảo tồn.',
    badgeStyle: 'bg-purple-950/70 text-purple-300 border-purple-500/40',
    switchPrompt:
      'Please adjust your speaking and teaching level to Level 3 (B2-C1 advanced / cultural ambassador). Speak at a fluent, articulate native pace. Use sophisticated heritage terminology (intangible cultural heritage, architectural syncretism, agrarian ethos), complex rhetorical structures, and thought-provoking analytical questions on cultural preservation and global impact.',
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


