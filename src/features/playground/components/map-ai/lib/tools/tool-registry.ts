/**
 * Tool Registry for Cultural Speaking & Listening AI Tutor
 * Maps Gemini function calls to client actions (SVG map updates, vocabulary display, lesson loading, etc.).
 */

import { useLogStore, useSettings, type CulturalTutorMode } from '../state';
import { type MapMarker, useMapStore } from '../map-state';
import { dispatchTool } from './tool-dispatcher';
import { findProvinceById, findProvinceByName, svgCoordsToLatLng } from '../svg-map-controller';
import { debugLog } from '../debug-logger';
import { buildAiMapLessonPayload } from '../lesson-payload';
import { useAiMapLessonStore } from '../lesson-state';
import type { AiMapQuizResult } from '../../types';
import {
  findLessonById,
  filterLessons,
  searchLessonsByKeyword,
  getLessonForLevel,
  LESSON_AGENT_CATALOG,
  type ProficiencyLevel,
} from '@/data/lessonAgentCatalog';

/**
 * Context object passed to tool implementations.
 */
export interface ToolContext {
  setHeldGroundedResponse?: (response: any) => void;
  setHeldGroundingChunks?: (chunks: any) => void;
  allowMapTools?: boolean;
  tutorMode?: CulturalTutorMode;
  /** False once the session or tool call has been cancelled or replaced. */
  isCurrent?: () => boolean;
}

export class StaleToolCallError extends Error {
  constructor() { super('Tool call is no longer current.'); }
}

function mutate(context: ToolContext | undefined, action: () => void) {
  if (context?.isCurrent?.() === false) throw new StaleToolCallError();
  action();
}

export function mapToolsAllowed(context?: ToolContext) {
  return context?.allowMapTools !== false && useSettings.getState().mapContextMode !== 'off';
}

export type ToolImplementation = (
  params: any,
  context?: ToolContext,
) => Promise<string | object>;

/**
 * Registry of tool functions called by Gemini Live API.
 */
export const toolImplementations: Record<string, ToolImplementation> = {
  listCulturalLessons: async (params: {
    category?: 'Cuisine' | 'Heritage' | 'Crafts' | 'Nature' | 'Folklore';
    region?: 'north' | 'central' | 'south' | 'all';
    cefrLevel?: string;
    searchKeyword?: string;
  }, context) => {
    return await executeListCulturalLessons(params, context);
  },

  loadLessonDiscussionPlan: async (params: { lessonId: string; level?: ProficiencyLevel }, context) => {
    return await executeLoadLessonDiscussionPlan(params, context);
  },

  highlightMapProvince: async (params: { provinceName: string; culturalTopic?: string }, context) => {
    return await executeHighlightMapProvince(params, context);
  },

  focusMapRegion: async (params: { region: 'north' | 'central' | 'south' | 'all' }, context) => {
    return await executeFocusMapRegion(params, context);
  },

  displayCulturalVocab: async (params: {
    word: string;
    ipa?: string;
    vietnameseMeaning: string;
    exampleSentence?: string;
  }, context) => {
    return await executeDisplayCulturalVocab(params, context);
  },

  evaluateSpeechOrGrammar: async (params: {
    targetPhrase: string;
    feedback: string;
    encouragement?: string;
  }, context) => {
    return await executeEvaluateSpeechOrGrammar(params, context);
  },

  recordLessonQuizResult: async (params: { totalQuestions: number; correctAnswers: number }, context) => executeRecordLessonQuizResult(params, context),
};

/** Legacy callers get the same validation and guards as the Live dispatcher. */
export const toolRegistry: Record<string, ToolImplementation> = Object.fromEntries(
  Object.keys(toolImplementations).map(name => [name, (args: unknown, context?: ToolContext) => dispatchTool(name, args, context)]),
);

export const MAP_TOOL_NAMES = new Set(['highlightMapProvince', 'focusMapRegion']);

/**
 * Discovers and lists cultural lessons.
 */
async function executeListCulturalLessons(params: {
  category?: 'Cuisine' | 'Heritage' | 'Crafts' | 'Nature' | 'Folklore';
  region?: 'north' | 'central' | 'south' | 'all';
  cefrLevel?: string;
  searchKeyword?: string;
}, context?: ToolContext): Promise<object> {
  const { category, region, cefrLevel, searchKeyword } = params;

  let results = LESSON_AGENT_CATALOG;
  if (searchKeyword) {
    results = searchLessonsByKeyword(searchKeyword);
  } else if (category || region || cefrLevel) {
    results = filterLessons({ category, region, cefrLevel });
  }

  const activeLevel = useSettings.getState().proficiencyLevel;

  const previews = results.slice(0, 4).map(l => {
    const levelInfo = l.levelContent?.[activeLevel] || l.levelContent?.['Level 2'];
    return {
      lessonId: l.id,
      title: l.title,
      vietnameseTitle: l.vietnameseTitle,
      province: l.provinceName,
      level: l.cefrLevel,
      category: l.category,
      summary: levelInfo?.summaryVi || l.summaryVi,
    };
  });

  mutate(context, () => useLogStore.getState().addTurn({
    role: 'system',
    text: `**Danh sách bài học gợi ý (${activeLevel}):**\n${previews.map(p => `* **${p.vietnameseTitle}** - ${p.province} [\`${p.lessonId}\`]`).join('\n')}`,
    isFinal: true,
  }));

  return {
    count: previews.length,
    activeLevel,
    lessons: previews,
  };
}

/**
 * Loads a full lesson discussion plan and syncs map/settings.
 */
async function executeLoadLessonDiscussionPlan(params: {
  lessonId: string;
  level?: ProficiencyLevel;
}, context?: ToolContext): Promise<object> {
  const { lessonId, level } = params;
  const targetLevel = level || useSettings.getState().proficiencyLevel || 'Level 2';

  // getLessonForLevel intentionally falls back for UI consumers. A tool must
  // reject an unknown ID before that fallback can select an unrelated lesson.
  if (!findLessonById(lessonId)) return { error: 'LESSON_NOT_FOUND', message: `Unknown lesson: ${lessonId}` };
  const result = getLessonForLevel(lessonId, targetLevel);
  if (!result) return { error: 'LESSON_NOT_FOUND', message: `Unknown lesson: ${lessonId}` };
  const { lesson, content: levelContent } = result;

  const lessonPayload = buildAiMapLessonPayload(lesson.id, targetLevel);
  mutate(context, () => useSettings.getState().setActiveLessonId(lesson.id));
  if (lessonPayload) mutate(context, () => useAiMapLessonStore.getState().startLesson(lessonPayload));

  // Auto-focus map if lesson has a specific province
  if (mapToolsAllowed(context) && lesson.provinceId) {
    const province = findProvinceById(lesson.provinceId) || findProvinceByName(lesson.provinceName);
    if (province) {
      const geo = svgCoordsToLatLng(province.cx, province.cy);
      const marker: MapMarker = {
        position: { lat: geo.lat, lng: geo.lng, altitude: 0 },
        label: `${province.name} · ${lesson.vietnameseTitle}`,
        showLabel: true,
        placeId: province.id,
      };
      mutate(context, () => useMapStore.getState().selectProvince(province.id, { source: 'lesson', markers: [marker] }));
    }
  }

  const startersText = levelContent.discussionPrompts.sentenceStarters?.length
    ? `\n- *Mẫu câu gợi ý (Starters):* ${levelContent.discussionPrompts.sentenceStarters.map(s => `"${s}"`).join(', ')}`
    : '';

  mutate(context, () => useLogStore.getState().addTurn({
    role: 'system',
    text: `**Đã chọn bài luyện tập [${targetLevel}]:** **${lesson.vietnameseTitle}**\n- *Tiêu đề:* ${lesson.title}\n- *Tóm tắt luyện nghe:* ${levelContent.summaryEn}\n- *Nội dung:* ${levelContent.summaryVi}${startersText}`,
    isFinal: true,
  }));

  return {
    lessonId: lesson.id,
    title: lesson.title,
    vietnameseTitle: lesson.vietnameseTitle,
    province: lesson.provinceName,
    activeLevel: targetLevel,
    summaryForListening: levelContent.summaryEn,
    summaryVi: levelContent.summaryVi,
    keyVocabularies: levelContent.keyVocabularies,
    speakingPrompts: levelContent.discussionPrompts,
  };
}

/**
 * Geocodes location name to Vietnam SVG map province and sets camera focus.
 */
async function executeHighlightMapProvince(params: {
  provinceName: string;
  culturalTopic?: string;
}, context?: ToolContext): Promise<string> {
  const { provinceName, culturalTopic } = params;
  if (!provinceName) {
    debugLog.tool('highlightMapProvince', 'error', params, 'Missing provinceName');
    return 'No province specified.';
  }

  const province = findProvinceByName(provinceName);
  if (province) {
    const geo = svgCoordsToLatLng(province.cx, province.cy);
    const newMarker: MapMarker = {
      position: { lat: geo.lat, lng: geo.lng, altitude: 0 },
      label: `${province.name}${culturalTopic ? ` · ${culturalTopic}` : ''}`,
      showLabel: true,
      placeId: province.id,
    };
    if (!mapToolsAllowed(context)) return 'Map tools are disabled.';
    mutate(context, () => useMapStore.getState().selectProvince(province.id, { source: 'ai', markers: [newMarker] }));

    debugLog.tool('highlightMapProvince', 'success', params, {
      matchedId: province.id,
      matchedName: province.name,
      region: province.region,
      coords: geo,
    });
    debugLog.map(`Highlight province [${province.name}] (ID: ${province.id})`, {
      region: province.region,
      marker: newMarker,
    });

    return `Successfully highlighted ${province.name} on the Vietnam map (${culturalTopic || 'Cultural Context'}).`;
  }

  debugLog.tool(
    'highlightMapProvince',
    'error',
    params,
    `Tên tỉnh '${provinceName}' không khớp bất kỳ tỉnh nào trong 34 tỉnh SVG vector.`
  );
  return `Could not locate '${provinceName}' on the map. The map was not changed. Ask the learner to clarify the province name.`;
}

/**
 * Focuses one of the 3 main regions or the full country.
 */
async function executeFocusMapRegion(params: {
  region: 'north' | 'central' | 'south' | 'all';
}, context?: ToolContext): Promise<string> {
  const { region } = params;
  if (!mapToolsAllowed(context)) return 'Map tools are disabled.';
  mutate(context, () => useMapStore.getState().selectRegion(region, 'ai'));
  const labels: Record<string, string> = {
    north: 'Miền Bắc (Northern Vietnam)',
    central: 'Miền Trung (Central Vietnam)',
    south: 'Miền Nam (Southern Vietnam)',
    all: 'Toàn quốc Việt Nam (Full Map)',
  };

  debugLog.tool('focusMapRegion', 'success', params, `Đã chuyển vùng bản đồ: ${labels[region] || region}`);
  debugLog.map(`Focus region [${region}]`, { regionLabel: labels[region] });
  return `Focused map on ${labels[region] || region}.`;
}

/**
 * Adds a visual vocabulary card to the conversation log.
 */
async function executeDisplayCulturalVocab(params: {
  word: string;
  ipa?: string;
  vietnameseMeaning: string;
  exampleSentence?: string;
}, context?: ToolContext): Promise<string> {
  const { word, ipa, vietnameseMeaning, exampleSentence } = params;

  if ((context?.tutorMode ?? useSettings.getState().tutorMode) === 'guided-lesson') {
    mutate(context, () => useAiMapLessonStore.getState().markVocabulary([word]));
  }

  mutate(context, () => useLogStore.getState().addTurn({
    role: 'system',
    text: `**Từ Vựng Văn Hóa:** **${word}** ${ipa ? `\`${ipa}\`` : ''}\n- **Ý nghĩa:** ${vietnameseMeaning}\n${exampleSentence ? `- *Ví dụ:* "${exampleSentence}"` : ''}`,
    isFinal: true,
  }));

  return `Displayed vocabulary card for '${word}'.`;
}

/**
 * Logs gentle speech or grammar evaluation feedback.
 */
async function executeEvaluateSpeechOrGrammar(params: {
  targetPhrase: string;
  feedback: string;
  encouragement?: string;
}, context?: ToolContext): Promise<string> {
  const { targetPhrase, feedback, encouragement } = params;

  if ((context?.tutorMode ?? useSettings.getState().tutorMode) === 'guided-lesson') {
    mutate(context, () => useAiMapLessonStore.getState().completeStep('speak'));
  }

  mutate(context, () => useLogStore.getState().addTurn({
    role: 'system',
    text: `**Góp Ý Luyện Nói:**\n- **Câu luyện tập:** "${targetPhrase}"\n- **Gợi ý cải thiện:** ${feedback}\n${encouragement ? `- *Động viên:* ${encouragement}` : ''}`,
    isFinal: true,
  }));

  return `Speech feedback recorded.`;
}

async function executeRecordLessonQuizResult(params: { totalQuestions: number; correctAnswers: number }, context?: ToolContext): Promise<AiMapQuizResult> {
  const { totalQuestions, correctAnswers } = params;
  const result: AiMapQuizResult = { totalQuestions, correctAnswers, score: Math.round((correctAnswers / totalQuestions) * 100), passed: correctAnswers / totalQuestions >= 0.6 };
  mutate(context, () => useAiMapLessonStore.getState().setQuizScore(result));
  return result;
}
