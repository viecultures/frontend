/**
 * Type definitions for Vietnam Heritage English EdTech Platform
 */

export interface CulturalHeritageSite {
  id: string;
  name: string;
  englishTitle: string;
  region: 'Bắc Bộ' | 'Trung Bộ' | 'Nam Bộ';
  category: 'Di sản UNESCO' | 'Ẩm thực & Triết lý' | 'Làng nghề thủ công' | 'Nghệ thuật diễn xướng';
  province: string;
  x: number; // SVG coordinate x
  y: number; // SVG coordinate y
  established?: string;
  unescoStatus?: string;
  vocabularyList: {
    word: string;
    ipa: string;
    pos: string;
    meaning: string;
    collocation: string;
  }[];
  presentationSnippet: string;
  culturalInsight: string;
  cefrLevel: 'B1' | 'B2' | 'C1';
}

export interface RegionSummary {
  id: string;
  name: string;
  englishName: string;
  sitesCount: number;
  vocabTerms: number;
  highlightCategory: string;
  description: string;
  culturalTheme: string;
}

export interface CulturalNuanceItem {
  id: string;
  category: 'Ẩm thực (Cuisine)' | 'Lễ hội & Tết (Festivals)' | 'Làng nghề (Crafts)' | 'Lối sống & Triết lý (Ethos)';
  vietnameseTerm: string;
  literalTranslation: string; // Bad translation (dịch máy ngô nghê)
  whyLiteralFails: string;
  nuancedEnglishPhrase: string; // Elegant international English
  cefrLevel: 'B2' | 'C1';
  ipa: string;
  contextUsage: string;
  culturalStory: string;
}

export interface EditorialArticle {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  readTime: string;
  author: string;
  publishedDate: string;
  excerpt: string;
  contentParagraphs: string[];
  keyTerms: {
    term: string;
    definition: string;
    ipa: string;
    context: string;
    pos?: string;
  }[];
}

export interface LearningPathwayStep {
  step: string;
  title: string;
  englishTitle: string;
  duration: string;
  objective: string;
  description: string;
  deliverable: string;
}

// Backward compatibility interfaces for unused archive templates
export interface BoroughData {
  borough: string;
  hives: number;
  sites: number;
  description: string;
}

export interface RooftopSite {
  id: string;
  name: string;
  borough: string;
  buildingType: string;
  hives: number;
  wildflowerAreaSqM: number;
  honeyHarvestKg: number;
  jarsDonated: number;
  rainwaterL: number;
  x: number;
  y: number;
  isKeyStory?: boolean;
  storyNote?: string;
  addressSnippet?: string;
}

export interface SectorImpact {
  buildingType: string;
  sites: number;
  hives: number;
  wildflowerArea: number;
  honeyHarvestKg: number;
  jarsDonated: number;
  corporateSponsorship: number;
  primaryRole: string;
}

export interface StrategicGoal {
  title: string;
  pillar: string;
  metric: string;
  description: string;
  targetDate: string;
}

export interface NarrativeStory {
  title: string;
  location: string;
  borough: string;
  heroStat: string;
  statLabel: string;
  body: string;
  quote?: string;
  quoteAuthor?: string;
}
