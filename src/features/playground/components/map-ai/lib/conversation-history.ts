import type { Content } from '@google/genai';
import type { ConversationTurn } from './conversation-state';

export const RESUME_HISTORY_MAX_TURNS = 12;
export const RESUME_HISTORY_MAX_CHARS = 12_000;

/** UTF-16 length budget, without cutting a surrogate pair at the suffix boundary. */
function unicodeSuffix(text: string, maxChars: number): string {
  let start = Math.max(0, text.length - maxChars);
  const first = text.charCodeAt(start);
  const previous = text.charCodeAt(start - 1);
  if (first >= 0xdc00 && first <= 0xdfff && previous >= 0xd800 && previous <= 0xdbff) start++;
  return text.slice(start);
}

/** Only explicitly conversational sources may be replayed as conversation content. */
function isReplayable(turn: Pick<ConversationTurn, 'role' | 'source' | 'text'>): boolean {
  return (turn.role === 'user' || turn.role === 'agent')
    && (turn.source === 'composer' || turn.source === 'suggestion' || turn.source === 'map'
      || turn.source === 'text' || turn.source === 'transcription');
}

/** Newest nonempty conversation text, returned chronologically; never mutates turns. */
export function buildResumeHistory(
  turns: readonly Pick<ConversationTurn, 'role' | 'source' | 'text'>[],
): Content[] {
  const history: Content[] = [];
  let remaining = RESUME_HISTORY_MAX_CHARS;
  for (let index = turns.length - 1; index >= 0 && history.length < RESUME_HISTORY_MAX_TURNS && remaining > 0; index--) {
    const turn = turns[index];
    if (!isReplayable(turn)) continue;
    const text = turn.text.trim();
    if (!text) continue;
    const suffix = unicodeSuffix(text, remaining);
    if (suffix.trim()) {
      history.push({ role: turn.role === 'agent' ? 'model' : 'user', parts: [{ text: suffix }] });
      remaining -= suffix.length;
    }
    // A partial oldest turn exhausts the suffix even if a surrogate cost one unit.
    if (suffix.length < text.length) break;
  }
  return history.reverse();
}
