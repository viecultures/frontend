import { z } from 'zod';
import { useSettings } from '../state';
import {
  MAP_TOOL_NAMES,
  StaleToolCallError,
  mapToolsAllowed,
  toolImplementations,
  type ToolContext,
} from './tool-registry';

export type { ToolContext } from './tool-registry';

const text = z.string().trim().min(1).max(4000);
const region = z.enum(['north', 'central', 'south', 'all']);
const level = z.enum(['Level 1', 'Level 2', 'Level 3']);

export const toolSchemas = {
  listCulturalLessons: z.strictObject({
    category: z.enum(['Cuisine', 'Heritage', 'Crafts', 'Nature', 'Folklore']).optional(),
    region: region.optional(),
    cefrLevel: z.enum(['Level 1', 'Level 2', 'Level 3', 'A2', 'B1', 'B2']).optional(),
    searchKeyword: text.optional(),
  }),
  loadLessonDiscussionPlan: z.strictObject({ lessonId: text, level: level.optional() }),
  highlightMapProvince: z.strictObject({ provinceName: text, culturalTopic: text.optional() }),
  focusMapRegion: z.strictObject({ region }),
  displayCulturalVocab: z.strictObject({
    word: text, ipa: text.optional(), vietnameseMeaning: text, exampleSentence: text.optional(),
  }),
  evaluateSpeechOrGrammar: z.strictObject({
    targetPhrase: text, feedback: text, encouragement: text.optional(),
  }),
  recordLessonQuizResult: z.strictObject({
    totalQuestions: z.number().int().positive(),
    correctAnswers: z.number().int().nonnegative(),
  }).refine(value => value.correctAnswers <= value.totalQuestions, {
    message: 'correctAnswers cannot exceed totalQuestions', path: ['correctAnswers'],
  }),
  getVieCultureArticles: z.strictObject({
    provinceName: text.optional(),
    topic: text.optional(),
    category: z.enum(['Cuisine', 'Heritage', 'Crafts', 'Nature', 'Folklore']).optional(),
  }),
} satisfies Record<string, z.ZodType>;

const GUIDED_TOOL_NAMES = new Set(['listCulturalLessons', 'loadLessonDiscussionPlan', 'recordLessonQuizResult']);

/** All validation and policy checks run before an implementation can mutate state. */
export async function dispatchTool(name: string, args: unknown, context: ToolContext = {}): Promise<object | string> {
  try {
    if (context.isCurrent?.() === false) return { error: 'STALE_CALL', message: 'Tool call is no longer current.' };
    if (!Object.hasOwn(toolSchemas, name)) return { error: 'UNKNOWN_TOOL', message: `Unknown tool: ${name}` };
    const parsed = toolSchemas[name as keyof typeof toolSchemas].safeParse(args === undefined ? {} : args);
    if (!parsed.success) {
      return {
        error: 'INVALID_ARGUMENTS',
        message: `Invalid arguments for ${name}`,
        issues: parsed.error.issues.map(issue => ({ path: issue.path.join('.'), message: issue.message })),
      };
    }
    if (MAP_TOOL_NAMES.has(name) && !mapToolsAllowed(context)) {
      return { error: 'MAP_TOOLS_DISABLED', message: 'Map tools are disabled for this session.' };
    }
    const tutorMode = context.tutorMode ?? useSettings.getState().tutorMode;
    if (GUIDED_TOOL_NAMES.has(name) && tutorMode !== 'guided-lesson') {
      return { error: 'GUIDED_MODE_REQUIRED', message: 'This tool requires guided lesson mode.' };
    }
    if (context.isCurrent?.() === false) throw new StaleToolCallError();
    return await toolImplementations[name](parsed.data, context);
  } catch (error) {
    if (error instanceof StaleToolCallError) return { error: 'STALE_CALL', message: error.message };
    return { error: 'TOOL_FAILED', message: error instanceof Error ? error.message : 'Tool execution failed.' };
  }
}
