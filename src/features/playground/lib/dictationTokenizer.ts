export interface StaticToken {
  id: string;
  rawChar: string;
  normalizedChar: string;
  isTypeable: boolean;
  isPunctuation: boolean;
  isSpace: boolean;
  wordIndex: number;
  tokenIndex: number;
}

export interface StaticWord {
  wordIndex: number;
  rawWord: string;
  tokens: StaticToken[];
  hasTypeable: boolean;
}

export interface TokenizedSentence {
  rawSentence: string;
  words: StaticWord[];
  tokens: StaticToken[];
  typeableIndices: number[];
  totalTypeableCount: number;
}

const TYPEABLE_REGEX = /^[\p{L}\p{N}]$/u;
const SPACE_REGEX = /^\s$/;

/**
 * Tokenizes a sentence into static tokens and words.
 * Static tokens are immutable and used as the source of truth for rendering and comparison.
 */
export function tokenizeSentence(raw: string): TokenizedSentence {
  const normalizedText = (raw || '').normalize('NFC');
  const tokens: StaticToken[] = [];
  const words: StaticWord[] = [];
  const typeableIndices: number[] = [];

  let currentWordIndex = 0;
  let currentWordTokens: StaticToken[] = [];
  let currentWordRaw = '';

  for (let i = 0; i < normalizedText.length; i++) {
    const rawChar = normalizedText[i];
    const isSpace = SPACE_REGEX.test(rawChar);
    const isTypeable = TYPEABLE_REGEX.test(rawChar);
    const isPunctuation = !isSpace && !isTypeable;

    const token: StaticToken = {
      id: `w${currentWordIndex}-t${i}`,
      rawChar,
      normalizedChar: rawChar.toLowerCase(),
      isTypeable,
      isPunctuation,
      isSpace,
      wordIndex: currentWordIndex,
      tokenIndex: i,
    };

    tokens.push(token);

    if (isTypeable) {
      typeableIndices.push(i);
    }

    if (isSpace) {
      if (currentWordTokens.length > 0) {
        words.push({
          wordIndex: currentWordIndex,
          rawWord: currentWordRaw,
          tokens: currentWordTokens,
          hasTypeable: currentWordTokens.some(t => t.isTypeable),
        });
        currentWordTokens = [];
        currentWordRaw = '';
        currentWordIndex++;
      }
    } else {
      currentWordTokens.push(token);
      currentWordRaw += rawChar;
    }
  }

  if (currentWordTokens.length > 0) {
    words.push({
      wordIndex: currentWordIndex,
      rawWord: currentWordRaw,
      tokens: currentWordTokens,
      hasTypeable: currentWordTokens.some(t => t.isTypeable),
    });
  }

  return {
    rawSentence: normalizedText,
    words,
    tokens,
    typeableIndices,
    totalTypeableCount: typeableIndices.length,
  };
}

/**
 * Normalize an input keystroke or character for comparison.
 */
export function normalizeInputChar(char: string): string {
  if (!char) return '';
  return char.normalize('NFC').toLowerCase();
}

/**
 * Resolves an incoming keystroke/character against the expected target character,
 * handling Telex/IME composite transformations on English texts (e.g. typing 'o'+'o' -> 'ô' for 'Cooking',
 * 'o'+'w' -> 'ơ' for 'bowl', 'u'+'s' -> 'ú' for 'just').
 */
export function resolveInputChar(inputChar: string, targetChar: string): string {
  if (!inputChar || !targetChar) return inputChar || '';

  const normInput = inputChar.normalize('NFC').toLowerCase();
  const normTarget = targetChar.normalize('NFC').toLowerCase();

  // 1. Direct match (exact character, handles both English and Vietnamese target like 'ở')
  if (normInput === normTarget) {
    return normTarget;
  }

  // 2. If target is an ASCII alphanumeric letter, check Telex composite transformations
  const isTargetAscii = /^[a-z0-9]$/i.test(normTarget);
  if (isTargetAscii) {
    // Telex w combinations: aw -> ă, ow -> ơ, uw -> ư
    if (normTarget === 'w' && (normInput === 'ă' || normInput === 'ơ' || normInput === 'ư')) {
      return 'w';
    }

    // Telex tone mark keys: s (sắc), f (huyền), r (hỏi), x (ngã), j (nặng)
    const acuteChars = ['á', 'ắ', 'ấ', 'é', 'ế', 'í', 'ó', 'ố', 'ớ', 'ú', 'ứ', 'ý'];
    const graveChars = ['à', 'ằ', 'ầ', 'è', 'ề', 'ì', 'ò', 'ồ', 'ờ', 'ù', 'ừ', 'ỳ'];
    const hookChars  = ['ả', 'ẳ', 'ẩ', 'ẻ', 'ể', 'ỉ', 'ỏ', 'ổ', 'ở', 'ủ', 'ử', 'ỷ'];
    const tildeChars = ['ã', 'ẵ', 'ẫ', 'ẽ', 'ễ', 'ĩ', 'õ', 'ỗ', 'ỡ', 'ũ', 'ữ', 'ỹ'];
    const dotChars   = ['ạ', 'ặ', 'ậ', 'ẹ', 'ệ', 'ị', 'ọ', 'ộ', 'ợ', 'ụ', 'ự', 'ỵ'];

    if (normTarget === 's' && acuteChars.includes(normInput)) return 's';
    if (normTarget === 'f' && graveChars.includes(normInput)) return 'f';
    if (normTarget === 'r' && hookChars.includes(normInput)) return 'r';
    if (normTarget === 'x' && tildeChars.includes(normInput)) return 'x';
    if (normTarget === 'j' && dotChars.includes(normInput)) return 'j';

    // Base letter decomposition: ô -> o, ê -> e, đ -> d, â -> a, etc.
    const baseInput = normInput
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'd');

    if (baseInput === normTarget) {
      return normTarget;
    }
  }

  return normInput;
}
