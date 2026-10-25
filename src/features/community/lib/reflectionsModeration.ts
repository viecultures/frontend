/**
 * Domain 06: Community Reflections - Moderation, Lemmatization, and Validation
 *
 * Implements:
 * - No-Judgment Policy: Never score grammar, encourage expression.
 * - Passive Moderation (EC-03.1): Keyword filter for hate speech/spam, flags as 'pending_review'.
 * - Lemmatization (EC-03.2): Matches root vocab words with common morphological forms.
 * - Validation (EC-03.3): Minimum 10 characters required to publish.
 */

export interface ModerationResult {
  isClean: boolean;
  status: 'published' | 'pending_review';
  reason?: string;
  flaggedKeywords?: string[];
}

export interface VocabDetectionResult {
  matchedVocabIds: string[];
  matchedWords: string[];
}

export interface ValidationResult {
  isValid: boolean;
  length: number;
  minLength: number;
  error?: string;
}

// ─── 1. Passive Moderation Filter (EC-03.1) ──────────────────────────────────
// Flags commercial spam links, malicious domains, and vulgar/toxic words.
const SPAM_LINK_REGEX =
  /(?:https?:\/\/|ftps?:\/\/|www\.)[^\s]+|\b[a-zA-Z0-9-]+\.(?:com|org|net|xyz|ru|cn|cc|top|biz|info|vip|club)\b/i;

const PROFANITY_PATTERNS: RegExp[] = [
  // English vulgarities / toxic slurs
  /\b(fuck|fucking|fucker|shit|bitch|bastard|asshole|cunt|dick|pussy|whore|slut|nigger|faggot)\b/i,
  // Vietnamese vulgarities / profanities
  /\b(đụ|địt|đéo|lồn|buồi|cặc|chó đẻ|khốn nạn|óc chó|đĩ|vãi lồn|đm|vcl|đkm|dcm|đcm)\b/i,
  // Commercial gambling / scam terms
  /\b(casino|gambling|betting|cờ bạc|lô đề|đánh bạc|kèo bóng|vay tiền nóng|vay tiền nhanh)\b/i,
];

/**
 * Evaluates whether reflection text passes passive community moderation.
 * If spam or toxic patterns are found, marks status as 'pending_review' rather than crashing or blocking.
 */
export function checkPassiveModeration(text: string): ModerationResult {
  if (!text || typeof text !== 'string') {
    return { isClean: true, status: 'published' };
  }

  const flagged: string[] = [];

  // 1. Check for spam links
  const spamMatch = text.match(SPAM_LINK_REGEX);
  if (spamMatch) {
    flagged.push(spamMatch[0]);
  }

  // 2. Check for toxic / prohibited words
  for (const pattern of PROFANITY_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      flagged.push(match[0]);
    }
  }

  if (flagged.length > 0) {
    return {
      isClean: false,
      status: 'pending_review',
      reason: 'Contains commercial links or sensitive keywords. Queued for community safety review.',
      flaggedKeywords: flagged,
    };
  }

  return {
    isClean: true,
    status: 'published',
  };
}

// ─── 2. Lemmatization & Vocab Detection (EC-03.2) ─────────────────────────────
/**
 * Generates regular morphological variants of an English word (singular/plural, verb forms).
 */
export function getWordVariants(word: string): string[] {
  const clean = word.trim().toLowerCase();
  if (clean.length < 3) return [clean];

  const variants = new Set<string>([clean]);

  // Standard plurals and verb suffixes
  variants.add(`${clean}s`);
  variants.add(`${clean}es`);
  variants.add(`${clean}ed`);
  variants.add(`${clean}ing`);

  // Words ending in 'e' (e.g. preserve -> preserved, preserving)
  if (clean.endsWith('e')) {
    const stem = clean.slice(0, -1);
    variants.add(`${clean}d`);
    variants.add(`${stem}ing`);
    variants.add(`${stem}ed`);
  }

  // Words ending in consonant + 'y' (e.g. city -> cities, dynasty -> dynasties)
  if (clean.endsWith('y') && !/[aeiou]y$/i.test(clean)) {
    const stem = clean.slice(0, -1);
    variants.add(`${stem}ies`);
    variants.add(`${stem}ied`);
  }

  // Irregular / common culture-relevant pairs
  const IRREGULARS: Record<string, string[]> = {
    child: ['children'],
    custom: ['customs'],
    tradition: ['traditions'],
    leaf: ['leaves'],
    story: ['stories'],
    city: ['cities'],
    dynasty: ['dynasties'],
    hero: ['heroes'],
    belief: ['beliefs'],
    recipe: ['recipes'],
  };

  if (IRREGULARS[clean]) {
    IRREGULARS[clean].forEach((v) => variants.add(v));
  }

  return Array.from(variants);
}

/**
 * Detects whether vocabulary items appear in user text (using lemmatization).
 */
export function detectUsedVocab(
  text: string,
  vocabList: Array<{ id: string; word: string }>
): VocabDetectionResult {
  if (!text || !vocabList || vocabList.length === 0) {
    return { matchedVocabIds: [], matchedWords: [] };
  }

  const normalized = ` ${text.toLowerCase().replace(/[^a-zA-Z0-9\s-]/g, ' ')} `;
  const matchedIds = new Set<string>();
  const matchedWords = new Set<string>();

  for (const item of vocabList) {
    if (!item.word) continue;
    const variants = getWordVariants(item.word);
    for (const variant of variants) {
      // Escape for regex and check word boundary
      const escaped = variant.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(?:^|\\s|\\b)${escaped}(?:\\b|\\s|$)`, 'i');
      if (regex.test(normalized)) {
        matchedIds.add(item.id);
        matchedWords.add(item.word);
        break;
      }
    }
  }

  return {
    matchedVocabIds: Array.from(matchedIds),
    matchedWords: Array.from(matchedWords),
  };
}

// ─── 3. Reflection Validation (EC-03.3) ───────────────────────────────────────
export const MIN_REFLECTION_LENGTH = 10;

export function validateReflectionText(text: string): ValidationResult {
  const trimmed = (text || '').trim();
  const length = trimmed.length;

  if (length < MIN_REFLECTION_LENGTH) {
    return {
      isValid: false,
      length,
      minLength: MIN_REFLECTION_LENGTH,
      error: `Please write at least ${MIN_REFLECTION_LENGTH} characters (${length}/${MIN_REFLECTION_LENGTH}).`,
    };
  }

  return {
    isValid: true,
    length,
    minLength: MIN_REFLECTION_LENGTH,
  };
}
