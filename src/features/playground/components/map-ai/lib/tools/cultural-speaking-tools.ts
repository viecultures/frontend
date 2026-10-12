/**
 * Cultural Speaking & Listening Tutor Tools
 * Defines tools for real-time map synchronization, lesson discovery,
 * and vocabulary scaffolding during English speaking practice on Vietnamese cultural topics.
 */

import type { FunctionCall } from '../state';
import type { FunctionResponseScheduling } from '@google/genai';

export const culturalSpeakingTools: FunctionCall[] = [
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
            'A brief note on why this location is relevant to the conversation or reading lesson (e.g., "Phở Hà Nội", "Vịnh Hạ Long", "Cố đô Huế", "Chợ nổi Cái Răng").',
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
];
