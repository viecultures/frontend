export type AiProvider = 'GEMINI' | 'AZURE';

export type AiServiceType = 'CHAT' | 'TTS' | 'TRANSLATE' | 'STT';

export type AiKeyStatus = 'HEALTHY' | 'RATE_LIMITED' | 'EXHAUSTED';

export interface AiServiceConfigDto {
  id: string;
  provider: AiProvider;
  serviceType: AiServiceType;
  keyLabel: string;
  maskedKey: string;
  active: boolean;
  priority: number;
  status: AiKeyStatus;
  modelName?: string | null;
  region?: string | null;
  extraConfig?: string | null;
  cooldownUntil?: string | null;
  createdAt?: string;
  lastUsedAt?: string | null;
}

export interface CreateAiKeyPayload {
  provider: AiProvider;
  serviceType: AiServiceType;
  keyLabel: string;
  rawKey: string;
  priority: number;
  active: boolean;
  modelName?: string;
  region?: string;
  extraConfig?: string;
}

export interface UpdateAiKeyPayload {
  keyLabel?: string;
  serviceType?: AiServiceType;
  rawKey?: string;
  priority?: number;
  active?: boolean;
  modelName?: string;
  region?: string;
  extraConfig?: string;
}

export interface ServiceCostBreakdown {
  serviceType: AiServiceType;
  calls: number;
  costUsd: number;
}

export interface DailyCostPoint {
  date: string;
  geminiCost: number;
  azureCost: number;
}

export interface AiCostMetricsDto {
  totalEstimatedCostUsd: number;
  totalCalls: number;
  todayCostUsd: number;
  breakdownByService: ServiceCostBreakdown[];
  recentDailyCosts: DailyCostPoint[];
}

export interface AiUsageLogDto {
  id: string;
  provider: AiProvider;
  featureCode: string;
  modelName: string;
  promptTokens: number;
  completionTokens: number;
  characterCount: number;
  estimatedCostUsd: number;
  latencyMs: number;
  httpStatus: number;
  createdAt: string;
}

export interface AiUsageLogPageResponse {
  content: AiUsageLogDto[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export interface TestAiKeyResult {
  success: boolean;
  message: string;
  latencyMs?: number;
}

export interface TestAiKeyPayload {
  configId?: string;
  provider: AiProvider;
  serviceType?: AiServiceType;
  apiKey?: string;
  modelName?: string;
  region?: string;
}

export interface AzureRegionOption {
  id: string;
  name: string;
}

export interface SystemAiSettingsDto {
  geminiChatModel: string;
  geminiTranslateModel: string;
  geminiTtsModel?: string;
  geminiSttModel?: string;
  azureSpeechRegion: string;
  activeTtsProvider: string;
  availableGeminiModels: string[];
  availableAzureRegions: AzureRegionOption[];
}

export interface UpdateSystemAiSettingsPayload {
  geminiChatModel?: string;
  geminiTranslateModel?: string;
  geminiTtsModel?: string;
  geminiSttModel?: string;
  azureSpeechRegion?: string;
  activeTtsProvider?: string;
}


export type AiPromptCategory = 'COMPANION_CHAT' | 'TRANSLATION' | 'STT' | 'MAP_AI';

export interface AiPromptVariable {
  name: string;
  description: string;
}

export interface AiPromptConfigDto {
  key: string;
  name: string;
  description: string;
  category: AiPromptCategory;
  currentPrompt: string;
  defaultPrompt: string;
  isModified: boolean;
  supportedVariables: AiPromptVariable[];
  updatedAt?: string;
}

export interface UpdateAiPromptPayload {
  promptText: string;
}
