import type { VocabItem } from '@/data/readerData';
import { VOCAB_DATABASE, extractSentenceContext } from '@/data/readerData';

// In-memory cache for ultra-fast instantaneous lookups (0ms on repeat)
const VOCAB_MEMORY_CACHE = new Map<string, VocabItem>();

// In-flight promise memoization to eliminate race conditions and duplicated API hits
const IN_FLIGHT_LOOKUPS = new Map<string, Promise<VocabItem>>();

// Common cultural tutor vocabulary pre-cached for 100% offline & instant lookup
const CURATED_CULTURAL_VOCAB: Record<string, Omit<VocabItem, 'id' | 'contextSentence'>> = {
  bustling: {
    word: 'bustling',
    pos: 'adjective',
    ipa: '/ˈbʌs.lɪŋ/',
    viMeaning: 'Nhộn nhịp, hối hả, sôi động, tấp nập người qua lại.',
    enDefinition: 'Full of lively activity, energy, and moving people or traffic.',
  },
  profound: {
    word: 'profound',
    pos: 'adjective',
    ipa: '/prəˈfaʊnd/',
    viMeaning: 'Sâu sắc, thâm thúy, uyên thâm, có ý nghĩa to lớn.',
    enDefinition: 'Having or showing great knowledge, insight, or emotional depth.',
  },
  heritage: {
    word: 'heritage',
    pos: 'noun',
    ipa: '/ˈher.ɪ.tɪdʒ/',
    viMeaning: 'Di sản (văn hóa, lịch sử hoặc thiên nhiên truyền đời).',
    enDefinition: 'Features belonging to the culture of a particular society, such as traditions, languages, or buildings, that were created in the past and still have historical importance.',
  },
  indigenous: {
    word: 'indigenous',
    pos: 'adjective',
    ipa: '/ɪnˈdɪdʒ.ə.nəs/',
    viMeaning: 'Bản địa, thuộc về cư dân hoặc thực vật/động vật nguyên thủy tại địa phương.',
    enDefinition: 'Originating or occurring naturally in a particular place; native.',
  },
  tranquil: {
    word: 'tranquil',
    pos: 'adjective',
    ipa: '/ˈtræŋ.kwɪl/',
    viMeaning: 'Thanh bình, yên ả, tĩnh lặng.',
    enDefinition: 'Free from disturbance; calm, peaceful, and quiet.',
  },
  harmonious: {
    word: 'harmonious',
    pos: 'adjective',
    ipa: '/hɑːˈməʊ.ni.əs/',
    viMeaning: 'Hài hòa, hòa quyện, êm dịu.',
    enDefinition: 'Forming a pleasing or consistent whole; free from disagreement or discord.',
  },
  picturesque: {
    word: 'picturesque',
    pos: 'adjective',
    ipa: '/ˌpɪk.tʃərˈesk/',
    viMeaning: 'Đẹp như tranh vẽ, thơ mộng, độc đáo.',
    enDefinition: 'Visually attractive, especially in a quaint or charming way.',
  },
  savory: {
    word: 'savory',
    pos: 'adjective',
    ipa: '/ˈseɪ.vər.i/',
    viMeaning: 'Đậm đà, có vị mặn thơm ngon (không ngọt).',
    enDefinition: 'Belonging to the category that is salty or spicy rather than sweet.',
  },
  delicacy: {
    word: 'delicacy',
    pos: 'noun',
    ipa: '/ˈdel.ɪ.kə.si/',
    viMeaning: 'Món cao lương mỹ vị, món đặc sản quý hiếm.',
    enDefinition: 'Something especially rare, expensive, or pleasing to eat.',
  },
  sanctuary: {
    word: 'sanctuary',
    pos: 'noun',
    ipa: '/ˈsæŋk.tʃu.ə.ri/',
    viMeaning: 'Thánh địa, nơi trú ẩn linh thiêng, chốn an bình.',
    enDefinition: 'A place of refuge or safety; a holy or sacred place.',
  },
  resilient: {
    word: 'resilient',
    pos: 'adjective',
    ipa: '/rɪˈzɪl.i.ənt/',
    viMeaning: 'Kiên cường, bền bỉ, có khả năng phục hồi nhanh chóng.',
    enDefinition: 'Able to withstand or recover quickly from difficult conditions.',
  },
  authentic: {
    word: 'authentic',
    pos: 'adjective',
    ipa: '/ɔːˈθen.tɪk/',
    viMeaning: 'Chân thực, nguyên bản, đích thực.',
    enDefinition: 'Of undisputed origin and not a copy; genuine.',
  },
  intricate: {
    word: 'intricate',
    pos: 'adjective',
    ipa: '/ˈɪn.trɪ.kət/',
    viMeaning: 'Tinh xảo, tỉ mỉ, phức tạp nhiều chi tiết.',
    enDefinition: 'Very complicated or detailed in design or construction.',
  },
  festivity: {
    word: 'festivity',
    pos: 'noun',
    ipa: '/feˈstɪv.ə.ti/',
    viMeaning: 'Không khí lễ hội, sự kiện mừng vui náo nhiệt.',
    enDefinition: 'The celebration of something in a happy and lively way.',
  },
  hospitality: {
    word: 'hospitality',
    pos: 'noun',
    ipa: '/ˌhɒs.pɪˈtæl.ə.ti/',
    viMeaning: 'Lòng hiếu khách, sự đón tiếp nồng hậu chu đáo.',
    enDefinition: 'The friendly and generous reception and entertainment of guests, visitors, or strangers.',
  },
  artisan: {
    word: 'artisan',
    pos: 'noun',
    ipa: '/ˌɑː.tɪˈzæn/',
    viMeaning: 'Nghệ nhân, thợ thủ công lành nghề.',
    enDefinition: 'A worker in a skilled trade, especially one that involves making things by hand.',
  },
  culinary: {
    word: 'culinary',
    pos: 'adjective',
    ipa: '/ˈkʌl.ɪ.nər.i/',
    viMeaning: 'Thuộc về ẩm thực, nghệ thuật nấu nướng.',
    enDefinition: 'Connected with cooking or kitchens.',
  },
  embrace: {
    word: 'embrace',
    pos: 'verb / noun',
    ipa: '/ɪmˈbreɪs/',
    viMeaning: 'Đón nhận, ôm ấp, đón chào nồng nhiệt, bao bọc.',
    enDefinition: 'To accept something enthusiastically; to hold someone closely in one\'s arms.',
  },
  embracing: {
    word: 'embracing',
    pos: 'verb (present participle)',
    ipa: '/ɪmˈbreɪ.sɪŋ/',
    viMeaning: 'Đón nhận, ôm ấp, mở lòng đón chào, bao bọc.',
    enDefinition: 'Accepting or welcoming eagerly; including or encompassing.',
  },
  flourish: {
    word: 'flourish',
    pos: 'verb',
    ipa: '/ˈflʌr.ɪʃ/',
    viMeaning: 'Phát triển hưng thịnh, nở rộ, thăng hoa.',
    enDefinition: 'To grow or develop in a healthy or vigorous way; to thrive.',
  },
  immerse: {
    word: 'immerse',
    pos: 'verb',
    ipa: '/ɪˈmɜːs/',
    viMeaning: 'Hòa mình, đắm chìm vào không gian văn hóa.',
    enDefinition: 'To involve oneself deeply in a particular activity or interest.',
  },
  cherish: {
    word: 'cherish',
    pos: 'verb',
    ipa: '/ˈtʃer.ɪʃ/',
    viMeaning: 'Trân trọng, yêu thương, nâng niu gìn giữ.',
    enDefinition: 'To protect and care for someone or something lovingly.',
  },
  vibrant: {
    word: 'vibrant',
    pos: 'adjective',
    ipa: '/ˈvaɪ.brənt/',
    viMeaning: 'Sống động, tràn đầy sức sống, rực rỡ.',
    enDefinition: 'Full of energy and life; bright and striking.',
  },
};

// Map grammatical tags to clean descriptions
const POS_LABELS: Record<string, string> = {
  n: 'Danh từ (noun)',
  noun: 'Danh từ (noun)',
  v: 'Động từ (verb)',
  verb: 'Động từ (verb)',
  adj: 'Tính từ (adjective)',
  adjective: 'Tính từ (adjective)',
  adv: 'Phó từ (adverb)',
  adverb: 'Phó từ (adverb)',
  phrase: 'Cụm từ (phrase)',
  idiom: 'Thành ngữ (idiom)',
};

/**
 * Fetch Vietnamese translation for a word or phrase
 * Uses Google Translate (GTX) as primary high-speed source with MyMemory as fallback
 */
async function fetchVietnameseTranslation(word: string): Promise<string | null> {
  const clean = word.trim();
  if (!clean) return null;

  // 1. Google Translate (GTX free endpoint - ultra-fast, no daily quota, CORS enabled)
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=${encodeURIComponent(clean)}`,
      { signal: controller.signal }
    );
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      const translated = data?.[0]?.[0]?.[0]?.trim();
      if (
        translated &&
        translated.toLowerCase() !== clean.toLowerCase() &&
        !translated.includes('translate_a')
      ) {
        return translated;
      }
    }
  } catch {
    // Continue to fallback
  }

  // 2. Secondary fallback: MyMemory
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=en|vi`,
      { signal: controller.signal }
    );
    clearTimeout(timer);
    if (res.ok) {
      const data = await res.json();
      const translation = data?.responseData?.translatedText?.trim();
      if (
        translation &&
        !translation.toUpperCase().includes('MYMEMORY WARNING') &&
        !translation.toUpperCase().includes('QUERY LENGTH LIMIT') &&
        translation.toLowerCase() !== clean.toLowerCase()
      ) {
        return translation;
      }
    }
  } catch {
    // Fall through
  }

  return null;
}

/**
 * Fetch definition, IPA, and tags from Datamuse API (fast, CORS-enabled, CloudFront SGN edge)
 */
async function fetchDatamuseInfo(word: string): Promise<{
  ipa?: string;
  pos?: string;
  definition?: string;
} | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2000);
  try {
    const res = await fetch(
      `https://api.datamuse.com/words?sp=${encodeURIComponent(word)}&md=dpr&ipa=1&max=1`,
      { signal: controller.signal }
    );
    clearTimeout(timer);
    if (!res.ok) return null;
    const items = await res.json();
    if (!Array.isArray(items) || items.length === 0) return null;

    const item = items[0];
    let ipa: string | undefined;
    let pos: string | undefined;
    let definition: string | undefined;

    if (Array.isArray(item.tags)) {
      for (const tag of item.tags) {
        if (typeof tag === 'string' && tag.startsWith('ipa_pron:')) {
          const rawIpa = tag.replace('ipa_pron:', '').trim();
          ipa = rawIpa.startsWith('/') ? rawIpa : `/${rawIpa}/`;
        } else if (['n', 'v', 'adj', 'adv'].includes(tag)) {
          pos = POS_LABELS[tag] || tag;
        }
      }
    }

    if (Array.isArray(item.defs) && item.defs.length > 0) {
      const firstDef = item.defs[0];
      if (typeof firstDef === 'string') {
        const parts = firstDef.split('\t');
        if (parts.length > 1) {
          definition = parts[1].trim();
          if (!pos && POS_LABELS[parts[0]]) {
            pos = POS_LABELS[parts[0]];
          }
        } else {
          definition = firstDef.trim();
        }
      }
    }

    return { ipa, pos, definition };
  } catch {
    clearTimeout(timer);
    return null;
  }
}

/**
 * Fetch definitions from Wiktionary REST API as an enrichment source
 */
async function fetchWiktionaryInfo(word: string): Promise<{
  definition?: string;
  pos?: string;
  example?: string;
} | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 2200);
  try {
    const res = await fetch(
      `https://en.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(word)}`,
      {
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      }
    );
    clearTimeout(timer);
    if (!res.ok) return null;
    const data = await res.json();
    const enEntries = data?.en;
    if (!Array.isArray(enEntries) || enEntries.length === 0) return null;

    const firstEntry = enEntries[0];
    const pos = firstEntry?.partOfSpeech || 'Word';
    const definitions = firstEntry?.definitions;
    if (!Array.isArray(definitions) || definitions.length === 0) return null;

    const firstDefObj = definitions[0];
    const rawDef = firstDefObj?.definition || '';
    // Strip HTML tags for clean display
    const cleanDef = rawDef.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/g, ' ').trim();
    
    let example: string | undefined;
    if (Array.isArray(firstDefObj.examples) && firstDefObj.examples.length > 0) {
      example = String(firstDefObj.examples[0]).replace(/<[^>]*>/g, '').trim();
    }

    return {
      definition: cleanDef,
      pos: POS_LABELS[pos.toLowerCase()] || pos,
      example,
    };
  } catch {
    clearTimeout(timer);
    return null;
  }
}

/**
 * Clean and normalize a raw word clicked in chat
 */
export function sanitizeChatWord(rawWord: string): string {
  return rawWord
    .replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '')
    .trim();
}

function getWordVariations(word: string): string[] {
  const variations: string[] = [];
  if (word.endsWith('ing') && word.length > 4) {
    variations.push(word.slice(0, -3));
    variations.push(word.slice(0, -3) + 'e');
  } else if (word.endsWith('ed') && word.length > 4) {
    variations.push(word.slice(0, -2));
    variations.push(word.slice(0, -1));
  } else if (word.endsWith('s') && word.length > 3) {
    variations.push(word.slice(0, -1));
  }
  return variations;
}

export const PROFANE_PHRASES: string[] = [
  'mother fucker', 'mother fucking', 'son of a bitch',
  // Tiếng Việt đa âm tiết và cụm từ nhạy cảm
  'đụ má mày', 'địt mẹ mày', 'địt con mẹ mày', 'địt con mẹ', 'đụ mẹ mày',
  'đụ má', 'du ma', 'đụ mẹ', 'du me', 'duma', 'dume', 'đù má', 'du me may',
  'địt mẹ', 'dit me', 'dit con me',
  'vãi lồn', 'vai lon', 'hãm lồn', 'ham lon', 'nứng lồn', 'nung lon',
  'con cặc', 'con cac', 'ăn cặc', 'an cac', 'ăn lồn', 'an lon',
  'chó đẻ', 'cho de', 'mẹ kiếp', 'me kiep', 'đồ chó', 'do cho',
  'cút mẹ mày đi', 'cut me may di', 'biến mẹ mày đi',
];

export const PROFANITY_BLACKLIST = new Set([
  // English vulgarities, curses & slurs
  'fuck', 'fucking', 'fucked', 'fucker', 'fuckers', 'fucks', 'motherfucker', 'motherfucking', 'clusterfuck',
  'shit', 'shits', 'shitty', 'bullshit', 'horseshit', 'dipshit', 'shat',
  'bitch', 'bitches', 'bitching', 'bitchy',
  'cunt', 'cunts',
  'dick', 'dicks', 'dickhead', 'dickheads',
  'cock', 'cocks', 'cocksucker', 'cocksuckers',
  'pussy', 'pussies',
  'asshole', 'assholes', 'dumbass', 'dumbasses', 'jackass', 'jackasses', 'asswipe',
  'bastard', 'bastards',
  'slut', 'sluts', 'slutty', 'whore', 'whores',
  'wanker', 'wankers',
  'damn', 'damnit', 'dammit',
  'twat', 'twats',
  'prick', 'pricks',
  'nigger', 'nigga', 'niggers', 'niggas',
  'faggot', 'faggots', 'fag', 'fags',
  'retard', 'retarded',
  'blowjob', 'handjob', 'cum', 'jizz',

  // Vietnamese vulgar single words & acronyms
  'đụ', 'đù',
  'địt',
  'lồn', 'lồ̀n',
  'buồi',
  'cặc',
  'đéo', 'đéch', 'đếch', 'đách',
  'vcl', 'vkl', 'vl', 'cl', 'cc', 'clgt',
  'dcm', 'đcm', 'dcmm', 'đcmm', 'dm', 'đm',
]);

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const ALL_PROFANITY_ENTRIES = [
  ...PROFANE_PHRASES,
  ...Array.from(PROFANITY_BLACKLIST),
].sort((a, b) => b.length - a.length);

const COMPILED_PATTERNS = ALL_PROFANITY_ENTRIES
  .map(escapeRegExp)
  .join('|');

const PROFANITY_REGEX = new RegExp(
  `(?<=^|[^\\p{L}\\p{N}])(?:${COMPILED_PATTERNS}|fuck\\p{L}*|shit\\p{L}*|bitch\\p{L}*|cunt\\p{L}*|asshole\\p{L}*)(?=$|[^\\p{L}\\p{N}])`,
  'giu'
);

/**
 * Mask any profanity / vulgar language in text with asterisks (*****)
 */
export function maskProfanity(text: string): string {
  if (!text) return text;
  return text.replace(PROFANITY_REGEX, '*****');
}

export function isProfaneWord(text: string): boolean {
  if (!text) return false;
  const clean = text.trim();
  if (!clean) return false;

  const masked = maskProfanity(clean);
  if (masked.includes('*****')) return true;

  const tokens = clean.toLowerCase().split(/\s+/).map(t => t.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, ''));
  for (const token of tokens) {
    if (!token) continue;
    if (PROFANITY_BLACKLIST.has(token)) return true;
    for (const root of ['fuck', 'shit', 'bitch', 'cunt', 'asshole', 'dick', 'cock', 'puss']) {
      if (token.startsWith(root) && token.length <= root.length + 5) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Instant Dictionary Lookup Service
 * Multi-tier: Memory Cache -> Local DB -> Datamuse/Wiktionary + MyMemory -> Graceful fallback
 */
export async function lookupWordInstant(
  rawWord: string,
  contextSentence?: string
): Promise<VocabItem> {
  const cleanWord = sanitizeChatWord(rawWord);
  const lowerWord = cleanWord.toLowerCase();

  if (!cleanWord) {
    return {
      id: 'empty',
      word: rawWord,
      pos: 'word',
      ipa: '/-/',
      viMeaning: 'Không có dữ liệu từ vựng.',
      contextSentence: contextSentence || '',
    };
  }

  // Intercept profanity / vulgar language immediately - masked with *****
  if (isProfaneWord(cleanWord)) {
    const profaneResult: VocabItem = {
      id: lowerWord,
      word: '*****',
      pos: 'từ nhạy cảm',
      ipa: '/-/',
      viMeaning: 'Từ này thuộc nhóm ngôn từ nhạy cảm / không phù hợp.',
      enDefinition: 'This word contains profanity or vulgar language and is blocked in the VieCultures educational environment.',
      contextSentence: contextSentence ? maskProfanity(contextSentence) : '"*****"',
      isProfane: true,
    };
    VOCAB_MEMORY_CACHE.set(lowerWord, profaneResult);
    return profaneResult;
  }

  // 1. Check in-memory cache (only return if it has a valid translation)
  if (VOCAB_MEMORY_CACHE.has(lowerWord)) {
    const cached = VOCAB_MEMORY_CACHE.get(lowerWord)!;
    if (cached.viMeaning && !cached.viMeaning.startsWith('Nghĩa theo ngữ cảnh') && !cached.viMeaning.startsWith('Nghĩa trong ngữ cảnh')) {
      return contextSentence ? { ...cached, contextSentence } : cached;
    }
  }

  // 2. Check local reader database (VOCAB_DATABASE)
  if (VOCAB_DATABASE[lowerWord]) {
    const local = VOCAB_DATABASE[lowerWord];
    const result: VocabItem = {
      ...local,
      contextSentence: contextSentence || local.contextSentence,
    };
    VOCAB_MEMORY_CACHE.set(lowerWord, result);
    return result;
  }



  // 3. Check curated cultural tutor dictionary (including inflections)
  const candidateKeys = [lowerWord, ...getWordVariations(lowerWord)];
  for (const candidate of candidateKeys) {
    if (CURATED_CULTURAL_VOCAB[candidate]) {
      const curated = CURATED_CULTURAL_VOCAB[candidate];
      const isInflected = candidate !== lowerWord;
      const result: VocabItem = {
        id: lowerWord,
        word: cleanWord,
        pos: isInflected ? `${curated.pos} (từ gốc "${candidate}")` : curated.pos,
        ipa: curated.ipa,
        viMeaning: curated.viMeaning,
        enDefinition: curated.enDefinition,
        contextSentence: contextSentence || `Found in tutor discussion: "${cleanWord}".`,
      };
      VOCAB_MEMORY_CACHE.set(lowerWord, result);
      return result;
    }
  }

  // 4. Return in-flight promise if one is already executing for this word
  if (IN_FLIGHT_LOOKUPS.has(lowerWord)) {
    const pending = await IN_FLIGHT_LOOKUPS.get(lowerWord)!;
    return contextSentence ? { ...pending, contextSentence } : pending;
  }

  const lookupPromise = (async (): Promise<VocabItem> => {
    // Multi-word phrase branch
    if (lowerWord.includes(' ')) {
      try {
        const viTranslation = await fetchVietnameseTranslation(cleanWord);
        const item: VocabItem = {
          id: lowerWord.replace(/\s+/g, '-'),
          word: cleanWord,
          pos: 'Cụm từ (phrase)',
          ipa: `/${lowerWord}/`,
          viMeaning: viTranslation || `Cụm từ tiếng Anh: "${cleanWord}".`,
          enDefinition: `English cultural phrase or collocation: "${cleanWord}".`,
          contextSentence: contextSentence || `Context: "${cleanWord}" in conversation.`,
        };
        if (viTranslation) {
          VOCAB_MEMORY_CACHE.set(lowerWord, item);
        }
        return item;
      } catch {
        // Continue to fallback
      }
    }

    // Single-word branch
    try {
      const [datamuseData, wiktionaryData, viTranslation] = await Promise.all([
        fetchDatamuseInfo(lowerWord),
        fetchWiktionaryInfo(lowerWord),
        fetchVietnameseTranslation(cleanWord),
      ]);

      const ipa = datamuseData?.ipa || `/${lowerWord}/`;
      const pos = datamuseData?.pos || wiktionaryData?.pos || 'Từ vựng tiếng Anh';
      const enDefinition =
        datamuseData?.definition ||
        wiktionaryData?.definition ||
        `English vocabulary item: ${cleanWord}.`;
      const viMeaning =
        viTranslation ||
        `Từ tiếng Anh: "${cleanWord}".`;
      const sentence =
        contextSentence ||
        wiktionaryData?.example ||
        `Context: "...${cleanWord}..." in English conversation.`;

      const item: VocabItem = {
        id: lowerWord.replace(/\s+/g, '-'),
        word: cleanWord,
        pos,
        ipa,
        viMeaning,
        enDefinition,
        contextSentence: sentence,
      };

      if (viTranslation) {
        VOCAB_MEMORY_CACHE.set(lowerWord, item);
      }
      return item;
    } catch {
      const fallbackItem: VocabItem = {
        id: lowerWord.replace(/\s+/g, '-'),
        word: cleanWord,
        pos: 'Từ vựng tiếng Anh',
        ipa: `/${lowerWord}/`,
        viMeaning: `Từ tiếng Anh: "${cleanWord}".`,
        enDefinition: `Contextual vocabulary: ${cleanWord}.`,
        contextSentence: contextSentence || `Context: "${cleanWord}" in conversation.`,
      };
      return fallbackItem;
    }
  })();

  IN_FLIGHT_LOOKUPS.set(lowerWord, lookupPromise);
  try {
    const result = await lookupPromise;
    return result;
  } finally {
    IN_FLIGHT_LOOKUPS.delete(lowerWord);
  }
}
