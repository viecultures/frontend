import { Modality, type LiveConnectConfig, type FunctionDeclaration } from '@google/genai';
import { buildCulturalTutorPrompt } from './constants';
import type { CulturalTutorMode, CorrectionMode, MapContextMode, FunctionCall } from './state';

export interface SessionSettings {
  systemPrompt: string;
  model: string;
  voice: string;
  proficiencyLevel: string;
  tutorMode: CulturalTutorMode;
  correctionMode: CorrectionMode;
  mapContextMode: MapContextMode;
}

const mapTools = new Set(['highlightMapProvince', 'focusMapRegion']);
const lessonTools = new Set(['listCulturalLessons', 'loadLessonDiscussionPlan', 'recordLessonQuizResult']);

export function buildSessionConfiguration(settings: SessionSettings, tools: FunctionCall[]) {
  const systemPrompt = buildCulturalTutorPrompt(settings.systemPrompt, {
    mode: settings.tutorMode, correctionMode: settings.correctionMode,
    mapContextMode: settings.mapContextMode, level: settings.proficiencyLevel,
  });
  const declarations: FunctionDeclaration[] = tools
    .filter(tool => tool.isEnabled && !(settings.mapContextMode === 'off' && mapTools.has(tool.name))
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
