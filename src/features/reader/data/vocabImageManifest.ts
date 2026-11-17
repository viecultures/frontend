/**
 * Curated vocabulary image manifest.
 * Maps stable vocabulary IDs or normalized word slugs to curated WebP cultural illustration assets.
 * When an entry is absent, components must render a clean text-only card without placeholders.
 */

export interface VocabImageEntry {
  id: string;
  word: string;
  imageUrl: string;
  altText?: string;
}

export const VOCAB_IMAGE_MANIFEST: Record<string, VocabImageEntry> = {
  // Cultural Cuisine Items - Only mapped where image directly illustrates the vocabulary concept
  'pho': {
    id: 'pho',
    word: 'pho',
    imageUrl: '/images/series/pho-hanoi.webp',
    altText: 'Traditional bowl of Hanoi Pho noodle soup',
  },
  'pho-hanoi': {
    id: 'pho-hanoi',
    word: 'pho',
    imageUrl: '/images/series/pho-hanoi.webp',
    altText: 'Traditional bowl of Hanoi Pho',
  },
  'bun-cha': {
    id: 'bun-cha',
    word: 'bun cha',
    imageUrl: '/images/series/bun-cha.webp',
    altText: 'Hanoi bun cha with grilled pork and rice vermicelli',
  },
  'banh-cay': {
    id: 'banh-cay',
    word: 'banh cay',
    imageUrl: '/images/series/banh-cay-thai-binh.webp',
    altText: 'Banh cay traditional spicy sweet rice cake',
  },
  'ca-kho': {
    id: 'ca-kho',
    word: 'braised fish',
    imageUrl: '/images/series/ca-kho-vu-dai.webp',
    altText: 'Traditional Vietnamese braised fish in claypot',
  },
  'ca-kho-vu-dai': {
    id: 'ca-kho-vu-dai',
    word: 'braised fish',
    imageUrl: '/images/series/ca-kho-vu-dai.webp',
    altText: 'Vu Dai traditional slow-braised fish',
  },
  'cha-ca': {
    id: 'cha-ca',
    word: 'grilled fish',
    imageUrl: '/images/series/cha-ca-la-vong.webp',
    altText: 'Cha ca La Vong turmeric seasoned grilled fish',
  },
  'cha-ca-la-vong': {
    id: 'cha-ca-la-vong',
    word: 'grilled fish',
    imageUrl: '/images/series/cha-ca-la-vong.webp',
    altText: 'Cha ca La Vong turmeric grilled fish',
  },
  'com-chay': {
    id: 'com-chay',
    word: 'scorched rice',
    imageUrl: '/images/series/com-chay-ninh-binh.webp',
    altText: 'Crispy scorched rice specialty of Ninh Binh',
  },
  'banh-mi': {
    id: 'banh-mi',
    word: 'banh mi',
    imageUrl: '/images/landing/banh-mi.webp',
    altText: 'Vietnamese baguette sandwich with rich savory fillings',
  },

  // Cultural Crafts & Landmarks
  'bat-trang': {
    id: 'bat-trang',
    word: 'ceramics',
    imageUrl: '/images/landing/bat-trang.webp',
    altText: 'Bat Trang traditional handmade ceramics',
  },
  'dong-ho': {
    id: 'dong-ho',
    word: 'woodblock print',
    imageUrl: '/images/landing/dong-ho.webp',
    altText: 'Dong Ho traditional folk woodcut print',
  },
  'hoi-an-lanterns': {
    id: 'hoi-an-lanterns',
    word: 'lanterns',
    imageUrl: '/images/landing/hoi-an-lanterns.webp',
    altText: 'Colorful silk lanterns illuminating ancient Hoi An streets',
  },
  'hue-citadel': {
    id: 'hue-citadel',
    word: 'citadel',
    imageUrl: '/images/landing/hue-citadel.webp',
    altText: 'Imperial Citadel of Hue historical architecture',
  },
  'mu-cang-chai': {
    id: 'mu-cang-chai',
    word: 'terraces',
    imageUrl: '/images/landing/mu-cang-chai.webp',
    altText: 'Majestic terraced rice fields of Mu Cang Chai',
  },
};

/**
 * Resolve optional curated image URL for a vocabulary item.
 * Returns undefined if no curated image asset exists.
 */
export function getVocabImageUrl(vocabId?: string, word?: string): string | undefined {
  if (vocabId && VOCAB_IMAGE_MANIFEST[vocabId]?.imageUrl) {
    return VOCAB_IMAGE_MANIFEST[vocabId].imageUrl;
  }
  if (word) {
    const slug = word.toLowerCase().trim().replace(/[\s_]+/g, '-');
    if (VOCAB_IMAGE_MANIFEST[slug]?.imageUrl) {
      return VOCAB_IMAGE_MANIFEST[slug].imageUrl;
    }
  }
  return undefined;
}
