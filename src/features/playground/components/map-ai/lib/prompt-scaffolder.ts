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


