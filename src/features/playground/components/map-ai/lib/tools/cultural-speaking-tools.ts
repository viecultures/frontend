/**
 * Cultural Speaking & Listening Tutor Tools
 * Defines tools for real-time map synchronization, lesson discovery,
 * and vocabulary scaffolding during English speaking practice on Vietnamese cultural topics.
 */

import type { FunctionCall } from '../state';
import type { FunctionResponseScheduling } from '@google/genai';

export const culturalSpeakingTools: FunctionCall[] = [
  {
    name: 'openMap',
    description: 'Opens the Vietnam map panel in AI Map Chat. Call when the learner asks to open or see the map. Optionally focus one province or region. Without arguments, show the whole country.',
    parameters: {
      type: 'OBJECT',
      properties: {
        provinceName: { type: 'STRING', description: 'Province or city name, e.g. Hà Nội. Omit region when using this.' },
        region: { type: 'STRING', enum: ['north', 'central', 'south', 'all'], description: 'Optional region. Omit provinceName when using this.' },
      },
    },
    isEnabled: true,
  },
  {
    name: 'openArticleDetail',
    description: 'Opens the bilingual article detail panel inside AI Map Chat while keeping the conversation available. Use when the learner asks to open or read a specific article. Obtain the exact articleId from getVieCultureArticles; never invent IDs.',
    parameters: {
      type: 'OBJECT',
      properties: { articleId: { type: 'STRING', description: 'Exact article id returned by getVieCultureArticles.' } },
      required: ['articleId'],
    },
    isEnabled: true,
  },
  {
    name: 'listCulturalLessons',
    description:
      'Discovers and returns a curated list of Vietnamese cultural reading/speaking lessons based on region, topic category, proficiency level (Level 1, Level 2, Level 3), or search keyword.',
    parameters: {
      type: 'OBJECT',
      properties: {
        category: {
          type: 'STRING',
          description: 'Cultural topic category.',
          enum: ['Cuisine', 'Heritage', 'Crafts', 'Nature', 'Folklore'],
        },
        region: {
          type: 'STRING',
          description: 'Geographic region in Vietnam.',
          enum: ['north', 'central', 'south', 'all'],
        },
        cefrLevel: {
          type: 'STRING',
          description: 'Target English proficiency level (Level 1 [A1-A2], Level 2 [B1-B2], or Level 3 [B2-C1]).',
          enum: ['Level 1', 'Level 2', 'Level 3', 'A2', 'B1', 'B2'],
        },
        searchKeyword: {
          type: 'STRING',
          description: 'Free-text search keyword (e.g., "Phở", "Hạ Long", "Hội An", "coffee", "bánh chưng").',
        },
      },
    },
    isEnabled: true,
  },
  {
    name: 'loadLessonDiscussionPlan',
    description:
      'Loads the comprehensive pedagogical discussion plan for a specific lesson: English & Vietnamese summary tailored to the learner\'s level, key vocabulary with IPA, and speaking discussion prompts with sentence starters.',
    parameters: {
      type: 'OBJECT',
      properties: {
        lessonId: {
          type: 'STRING',
          description: 'The unique lesson identifier (e.g. "pho-hanoi-history", "ha-long-bay", "gong-culture-tay-nguyen", "non-la-culture", "my-son-sanctuary", "floating-markets-mekong", "nem-ran-spring-rolls", "dong-ho-paintings").',
        },
        level: {
          type: 'STRING',
          description: 'Target proficiency level (Level 1 [A1-A2], Level 2 [B1-B2], or Level 3 [B2-C1]). If omitted, the currently active session level is used.',
          enum: ['Level 1', 'Level 2', 'Level 3'],
        },
      },
      required: ['lessonId'],
    },
    isEnabled: true,
  },
  {
    name: 'highlightMapProvince',
    description:
      'Highlights and focuses a specific province or city on the Vietnam SVG Map when discussing a location or landmark (e.g., Hà Nội, Thừa Thiên Huế, Quảng Nam, TP. Hồ Chí Minh, Ninh Bình, Cần Thơ, Lâm Đồng, Bắc Ninh).',
    parameters: {
      type: 'OBJECT',
      properties: {
        provinceName: {
          type: 'STRING',
          description:
            'The name of the Vietnamese province or city in Vietnamese or English (e.g., "Hà Nội", "Huế", "TP. Hồ Chí Minh", "Quảng Ninh", "Quảng Nam", "Lâm Đồng", "Bắc Ninh", "Cần Thơ").',
        },
        culturalTopic: {
          type: 'STRING',
          description:
            'A very short 2-3 word topic name (max 20 characters) for the map pin (e.g., "Chợ nổi Cái Răng", "Phở Hà Nội", "Cố đô Huế"). Never provide long sentences, descriptions, or lists.',
        },
      },
      required: ['provinceName'],
    },
    isEnabled: true,
  },
  {
    name: 'focusMapRegion',
    description:
      'Zooms or shifts focus to a major cultural geographic region of Vietnam (Northern Vietnam, Central Vietnam, Southern Vietnam, or the entire country).',
    parameters: {
      type: 'OBJECT',
      properties: {
        region: {
          type: 'STRING',
          description: 'The region to focus on.',
          enum: ['north', 'central', 'south', 'all'],
        },
      },
      required: ['region'],
    },
    isEnabled: true,
    scheduling: 'INTERRUPT' as unknown as FunctionResponseScheduling,
  },
  {
    name: 'displayCulturalVocab',
    description:
      'Displays an interactive vocabulary & pronunciation scaffold card in the chat console when introducing or explaining cultural words, idioms, or academic vocabulary from the reading lesson.',
    parameters: {
      type: 'OBJECT',
      properties: {
        word: {
          type: 'STRING',
          description: 'The English word or phrase (e.g. "culinary heritage", "simmered broth", "limestone karst", "conical hat").',
        },
        ipa: {
          type: 'STRING',
          description: 'IPA phonetic transcription for pronunciation practice (e.g. "/ˈkʌl.ɪ.nər.i ˈher.ɪ.tɪdʒ/").',
        },
        vietnameseMeaning: {
          type: 'STRING',
          description: 'Vietnamese translation and cultural nuance.',
        },
        exampleSentence: {
          type: 'STRING',
          description: 'An illustrative example sentence from the lesson or cultural context.',
        },
      },
      required: ['word', 'vietnameseMeaning'],
    },
    isEnabled: true,
  },
  {
    name: 'evaluateSpeechOrGrammar',
    description:
      'Provides gentle, encouraging feedback on the learner\'s spoken English, highlighting strong points, suggesting better vocabulary, or providing pronunciation tips.',
    parameters: {
      type: 'OBJECT',
      properties: {
        targetPhrase: {
          type: 'STRING',
          description: 'The phrase or concept the learner attempted.',
        },
        feedback: {
          type: 'STRING',
          description: 'Constructive suggestions for improved phrasing, grammar, or vocabulary.',
        },
        encouragement: {
          type: 'STRING',
          description: 'A warm compliment or positive reinforcement in Vietnamese or English.',
        },
      },
      required: ['targetPhrase', 'feedback'],
    },
    isEnabled: true,
  },
  {
    name: 'recordLessonQuizResult',
    description: 'Records the final score after the learner completes the guided lesson quiz. Use only after all quiz answers are collected.',
    parameters: {
      type: 'OBJECT',
      properties: {
        totalQuestions: { type: 'INTEGER', description: 'Total quiz questions.' },
        correctAnswers: { type: 'INTEGER', description: 'Number of correct answers.' },
      },
      required: ['totalQuestions', 'correctAnswers'],
    },
    isEnabled: true,
  },
  {
    name: 'getVieCultureArticles',
    description:
      'Searches and retrieves curated bilingual Vietnamese cultural reading articles from the VieCultures platform library by province, landmark topic, category (Heritage, Cuisine, Crafts, Nature, Folklore), or keyword. Use this whenever the learner asks about reading articles, cultural stories, or what VieCultures has to offer.',
    parameters: {
      type: 'OBJECT',
      properties: {
        provinceName: {
          type: 'STRING',
          description: 'Name of the province or city (e.g. "Cần Thơ", "Hà Nội", "Huế", "Quảng Nam", "Lâm Đồng").',
        },
        topic: {
          type: 'STRING',
          description: 'Search topic or landmark name (e.g. "Chợ nổi Cái Răng", "Phở", "Vịnh Hạ Long", "áo dài", "bánh mì").',
        },
        category: {
          type: 'STRING',
          description: 'Cultural topic category.',
          enum: ['Cuisine', 'Heritage', 'Crafts', 'Nature', 'Folklore'],
        },
      },
    },
    isEnabled: true,
  },
];

