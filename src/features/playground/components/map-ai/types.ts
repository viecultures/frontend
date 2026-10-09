export interface VoiceOption {
  id: string;
  name: string;
  gender: 'Nữ' | 'Nam';
  tone: string;
  description: string;
  pitch: number;
  rate: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
  focusedProvinceId?: string;
  suggestedItinerary?: string[];
  culturalTags?: string[];
}

export interface MapAiResponse {
  text: string;
  focusedProvinceId?: string;
  suggestedItinerary?: string[];
  culturalTags?: string[];
}

export interface ProvinceCultureData {
  id: string;
  name: string;
  slug: string;
  region: 'north' | 'central' | 'south';
  regionName: string;
  capital: string;
  area: string;
  population: string;
  heritageType?: string;
  unescoTitle?: string;
  landmarks: string[];
  specialties: string[];
  itinerary: string[];
  englishVocab: { word: string; ipa: string; meaning: string }[];
  summary: string;
  travelTips: string;
}

export interface MapAiSettingsState {
  selectedVoice: string;
  speechRate: number;
  speechPitch: number;
  selectedModel: string;
  customApiKey: string;
  selectedPersona: string;
  autoSyncMap: boolean;
}
