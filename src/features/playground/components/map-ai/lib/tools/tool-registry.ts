/**
 * Tool Registry for Cultural Speaking & Listening AI Tutor
 * Maps Gemini function calls to client actions (SVG map updates, vocabulary display, lesson loading, etc.).
 */

import { type MapMarker, useMapStore, useLogStore, useSettings } from '../state';
import { findProvinceById, findProvinceByName, svgCoordsToLatLng } from '../svg-map-controller';
import {
  findLessonById,
  filterLessons,
  searchLessonsByKeyword,
  LESSON_AGENT_CATALOG,
} from '@/data/lessonAgentCatalog';

/**
 * Context object passed to tool implementations.
 */
export interface ToolContext {
  setHeldGroundedResponse?: (response: any) => void;
  setHeldGroundingChunks?: (chunks: any) => void;
}

export type ToolImplementation = (
  params: any,
  context: ToolContext,
) => Promise<string | object>;

/**
 * Registry of tool functions called by Gemini Live API.
 */
export const toolRegistry: Record<string, ToolImplementation> = {
  listCulturalLessons: async (params: {
    category?: 'Cuisine' | 'Heritage' | 'Crafts' | 'Nature' | 'Folklore';
    region?: 'north' | 'central' | 'south' | 'all';
    cefrLevel?: 'A2' | 'B1' | 'B2';
    searchKeyword?: string;
  }) => {
    return await executeListCulturalLessons(params);
  },

  loadLessonDiscussionPlan: async (params: { lessonId: string }) => {
    return await executeLoadLessonDiscussionPlan(params);
  },

  highlightMapProvince: async (params: { provinceName: string; culturalTopic?: string }) => {
    return await executeHighlightMapProvince(params);
  },

  focusMapRegion: async (params: { region: 'north' | 'central' | 'south' | 'all' }) => {
    return await executeFocusMapRegion(params);
  },

  displayCulturalVocab: async (params: {
    word: string;
    ipa?: string;
    vietnameseMeaning: string;
    exampleSentence?: string;
  }) => {
    return await executeDisplayCulturalVocab(params);
  },

  evaluateSpeechOrGrammar: async (params: {
    targetPhrase: string;
    feedback: string;
    encouragement?: string;
  }) => {
    return await executeEvaluateSpeechOrGrammar(params);
  },
};

/**
 * Discovers and lists cultural lessons.
 */
async function executeListCulturalLessons(params: {
  category?: 'Cuisine' | 'Heritage' | 'Crafts' | 'Nature' | 'Folklore';
  region?: 'north' | 'central' | 'south' | 'all';
  cefrLevel?: 'A2' | 'B1' | 'B2';
  searchKeyword?: string;
}): Promise<object> {
  const { category, region, cefrLevel, searchKeyword } = params;

  let results = LESSON_AGENT_CATALOG;
  if (searchKeyword) {
    results = searchLessonsByKeyword(searchKeyword);
  } else if (category || region || cefrLevel) {
    results = filterLessons({ category, region, cefrLevel });
  }

  const previews = results.slice(0, 4).map(l => ({
    lessonId: l.id,
    title: l.title,
    vietnameseTitle: l.vietnameseTitle,
    province: l.provinceName,
    level: l.cefrLevel,
    category: l.category,
    summary: l.summaryVi,
  }));

  useLogStore.getState().addTurn({
    role: 'system',
    text: `**Danh sách chủ đề gợi ý:**\n${previews.map(p => `* **${p.vietnameseTitle}** (${p.level}) - ${p.province} [\`${p.lessonId}\`]`).join('\n')}`,
    isFinal: true,
  });

  return {
    count: previews.length,
    lessons: previews,
  };
}

/**
 * Loads a full lesson discussion plan and syncs map/settings.
 */
async function executeLoadLessonDiscussionPlan(params: { lessonId: string }): Promise<object> {
  const { lessonId } = params;
  const lesson = findLessonById(lessonId) || LESSON_AGENT_CATALOG[0];

  useSettings.getState().setActiveLessonId(lesson.id);

  // Auto-focus map if lesson has a specific province
  if (lesson.provinceId) {
    const province = findProvinceById(lesson.provinceId) || findProvinceByName(lesson.provinceName);
    if (province) {
      const geo = svgCoordsToLatLng(province.cx, province.cy);
      useMapStore.getState().setCameraTarget({
        provinceId: province.id,
        region: province.region,
        lat: geo.lat,
        lng: geo.lng,
      });
      useMapStore.getState().setHighlightedPlaceId(province.id);

      const marker: MapMarker = {
        position: { lat: geo.lat, lng: geo.lng, altitude: 0 },
        label: `${province.name} · ${lesson.vietnameseTitle}`,
        showLabel: true,
        placeId: province.id,
      };
      useMapStore.getState().setMarkers([marker]);
    }
  }

  useLogStore.getState().addTurn({
    role: 'system',
    text: `**Đã chọn bài luyện tập:** **${lesson.vietnameseTitle}**\n- *Tiêu đề tiếng Anh:* ${lesson.title}\n- *Trình độ:* ${lesson.cefrLevel} · ${lesson.durationMinutes} phút\n- *Tóm tắt:* ${lesson.summaryVi}`,
    isFinal: true,
  });

  return {
    lessonId: lesson.id,
    title: lesson.title,
    vietnameseTitle: lesson.vietnameseTitle,
    province: lesson.provinceName,
    cefrLevel: lesson.cefrLevel,
    summaryForListening: lesson.summaryEn,
    keyVocabularies: lesson.keyVocabularies,
    speakingPrompts: lesson.discussionPrompts,
  };
}

/**
 * Geocodes location name to Vietnam SVG map province and sets camera focus.
 */
async function executeHighlightMapProvince(params: {
  provinceName: string;
  culturalTopic?: string;
}): Promise<string> {
  const { provinceName, culturalTopic } = params;
  if (!provinceName) return 'No province specified.';

  const province = findProvinceByName(provinceName);
  if (province) {
    const geo = svgCoordsToLatLng(province.cx, province.cy);
    useMapStore.getState().setCameraTarget({
      provinceId: province.id,
      region: province.region,
      lat: geo.lat,
      lng: geo.lng,
    });
    useMapStore.getState().setHighlightedPlaceId(province.id);

    const newMarker: MapMarker = {
      position: { lat: geo.lat, lng: geo.lng, altitude: 0 },
      label: `${province.name}${culturalTopic ? ` · ${culturalTopic}` : ''}`,
      showLabel: true,
      placeId: province.id,
    };
    useMapStore.getState().setMarkers([newMarker]);

    return `Successfully highlighted ${province.name} on the Vietnam map (${culturalTopic || 'Cultural Context'}).`;
  }

  return `Province '${provinceName}' noted.`;
}

/**
 * Focuses one of the 3 main regions or the full country.
 */
async function executeFocusMapRegion(params: {
  region: 'north' | 'central' | 'south' | 'all';
}): Promise<string> {
  const { region } = params;
  useMapStore.getState().setCameraTarget({ region: region || 'all' });
  useMapStore.getState().setHighlightedPlaceId(null);
  const labels: Record<string, string> = {
    north: 'Miền Bắc (Northern Vietnam)',
    central: 'Miền Trung (Central Vietnam)',
    south: 'Miền Nam (Southern Vietnam)',
    all: 'Toàn quốc Việt Nam (Full Map)',
  };
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
}): Promise<string> {
  const { word, ipa, vietnameseMeaning, exampleSentence } = params;

  useLogStore.getState().addTurn({
    role: 'system',
    text: `📚 **Từ Vựng Văn Hóa:** **${word}** ${ipa ? `\`${ipa}\`` : ''}\n- **Ý nghĩa:** ${vietnameseMeaning}\n${exampleSentence ? `- *Ví dụ:* "${exampleSentence}"` : ''}`,
    isFinal: true,
  });

  return `Displayed vocabulary card for '${word}'.`;
}

/**
 * Logs gentle speech or grammar evaluation feedback.
 */
async function executeEvaluateSpeechOrGrammar(params: {
  targetPhrase: string;
  feedback: string;
  encouragement?: string;
}): Promise<string> {
  const { targetPhrase, feedback, encouragement } = params;

  useLogStore.getState().addTurn({
    role: 'system',
    text: `✨ **Góp Ý Luyện Nói:**\n- **Câu luyện tập:** "${targetPhrase}"\n- **Gợi ý cải thiện:** ${feedback}\n${encouragement ? `- 💡 *Động viên:* ${encouragement}` : ''}`,
    isFinal: true,
  });

  return `Speech feedback recorded.`;
}