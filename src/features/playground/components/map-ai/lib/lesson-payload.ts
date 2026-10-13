import {
  getLessonForLevel,
  LESSON_AGENT_CATALOG,
  type ProficiencyLevel,
} from '@/data/lessonAgentCatalog';
import type { AiMapLessonPayload, AiMapQuizQuestion } from '../types';

const levels: ProficiencyLevel[] = ['Level 1', 'Level 2', 'Level 3'];

export function buildAiMapLessonPayload(lessonId: string, level: ProficiencyLevel): AiMapLessonPayload | null {
  const result = getLessonForLevel(lessonId, level);
  if (!result) return null;
  const { lesson, content } = result;
  const otherProvinces = LESSON_AGENT_CATALOG
    .filter(item => item.provinceId !== lesson.provinceId)
    .slice(0, 2)
    .map(item => item.provinceName);
  const otherCategories = LESSON_AGENT_CATALOG
    .filter(item => item.category !== lesson.category)
    .map(item => item.category)
    .filter((value, index, values) => values.indexOf(value) === index)
    .slice(0, 2);
  const question = (id: string, prompt: string, correct: string, alternatives: string[], explanation: string): AiMapQuizQuestion => ({
    id,
    prompt,
    options: [correct, ...alternatives].map((label, index) => ({ id: `${id}-${index}`, label })),
    correctOptionId: `${id}-0`,
    explanation,
  });
  return {
    lessonId: lesson.id,
    title: lesson.title,
    vietnameseTitle: lesson.vietnameseTitle,
    provinceId: lesson.provinceId,
    provinceName: lesson.provinceName,
    level,
    durationMinutes: lesson.durationMinutes,
    summaryEn: content.summaryEn,
    summaryVi: content.summaryVi,
    vocabulary: content.keyVocabularies,
    listeningPrompts: content.discussionPrompts.comprehension,
    speakingPrompts: content.discussionPrompts.personalOpinion,
    comprehensionQuestions: [
      question('province', 'Which province is this lesson about?', lesson.provinceName, otherProvinces, 'The lesson location is shown in the lesson header.'),
      question('category', 'What cultural category does this lesson explore?', lesson.category, otherCategories, 'This is the catalog category for the lesson.'),
      question('level', 'Which learning level are you practising?', level, levels.filter(item => item !== level), 'The lesson adapts its language to your selected level.'),
    ],
    relatedArticleIds: [lesson.id],
  };
}
