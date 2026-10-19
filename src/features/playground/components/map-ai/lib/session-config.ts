import { Modality, type LiveConnectConfig, type FunctionDeclaration } from '@google/genai';
import { buildCulturalTutorPrompt } from './constants';
import type { CulturalTutorMode, CorrectionMode, MapContextMode, FunctionCall } from './state';
import { CHAT_TOOL_NAMES } from './tools/tool-dispatcher';
import { MAP_TOOL_NAMES } from './tools/tool-registry';

export interface SessionSettings {
  systemPrompt: string;
  model: string;
  voice: string;
  proficiencyLevel: string;
  tutorMode: CulturalTutorMode;
  correctionMode: CorrectionMode;
  mapContextMode: MapContextMode;
}

const lessonTools = new Set(['listCulturalLessons', 'loadLessonDiscussionPlan', 'recordLessonQuizResult']);

export function buildSessionConfiguration(settings: SessionSettings, tools: FunctionCall[], view: 'chat' | 'immersive' | null = 'chat') {
  let systemPrompt = buildCulturalTutorPrompt(settings.systemPrompt, {
    mode: settings.tutorMode, correctionMode: settings.correctionMode,
    mapContextMode: settings.mapContextMode, level: settings.proficiencyLevel,
  });
  if (view === 'chat') {
    systemPrompt += `\nAI MAP CHAT PANELS: The conversation starts with the map hidden. ${settings.mapContextMode === 'off'
      ? 'Map tools are disabled; do not open the map.'
      : 'Call openMap to open the map when requested. highlightMapProvince and focusMapRegion also open the map while focusing a location.'}
When asked to open or read a specific article, call getVieCultureArticles to find its exact ID, then call openArticleDetail({ articleId }). If multiple articles match and the learner has not chosen one, present the choices first. Article search alone does not open a panel. These panels stay inside the chat so the conversation continues. Do not claim to have opened anything unless its tool succeeds.`;
  }
  const declarations: FunctionDeclaration[] = tools
    .filter(tool => tool.isEnabled && !(view !== 'chat' && CHAT_TOOL_NAMES.has(tool.name))
      && !(settings.mapContextMode === 'off' && MAP_TOOL_NAMES.has(tool.name))
      && !(settings.tutorMode === 'free-conversation' && lessonTools.has(tool.name)))
    .map(({ name, description, parameters }) => ({ name, description, parameters }));
  const config: LiveConnectConfig = {
    responseModalities: [Modality.AUDIO],
    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: settings.voice } } },
    inputAudioTranscription: {}, outputAudioTranscription: {},
    systemInstruction: { parts: [{ text: systemPrompt }] },
    ...(declarations.length ? { tools: [{ functionDeclarations: declarations }] } : {}),
  };
  return { config, systemPrompt, model: settings.model };
}
