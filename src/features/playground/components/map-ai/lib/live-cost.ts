import type { UsageMetadata } from '@google/genai';

export interface LiveUsageSample {
  connectionId: string;
  at: string;
  model: string;
  view: 'chat' | 'immersive' | null;
  tutorMode: string;
  voiceInteractionMode: string;
  promptTokenCount?: number;
  responseTokenCount?: number;
  thoughtsTokenCount?: number;
  totalTokenCount?: number;
  promptTokensDetails?: Array<{ modality?: string; tokenCount?: number }>;
  responseTokensDetails?: Array<{ modality?: string; tokenCount?: number }>;
  estimatedUsd: number | null;
}

const LIVE_RATES_PER_MILLION = {
  input: { TEXT: 0.75, AUDIO: 3, IMAGE: 1, VIDEO: 1 },
  output: { TEXT: 4.5, AUDIO: 12 },
} as const;

function pricedTokens(
  details: UsageMetadata['promptTokensDetails'] | UsageMetadata['responseTokensDetails'],
  rates: Readonly<Record<string, number>>,
): number | null {
  if (!details?.length) return null;
  let cost = 0;
  for (const detail of details) {
    const rate = detail.modality ? rates[detail.modality] : undefined;
    if (rate === undefined || detail.tokenCount === undefined) return null;
    cost += detail.tokenCount * rate / 1_000_000;
  }
  return cost;
}

/** Rough Standard-tier estimate for known Live models and reported modalities only. */
export function makeLiveUsageSample(
  usage: UsageMetadata,
  context: Pick<LiveUsageSample, 'connectionId' | 'model' | 'view' | 'tutorMode' | 'voiceInteractionMode'>,
): LiveUsageSample {
  const pricedModel = context.model === 'gemini-3.1-flash-live-preview'
    || context.model === 'gemini-3.8-live'
    || context.model === 'gemini-3.8-live-extended-thinking';
  const inputCost = pricedModel ? pricedTokens(usage.promptTokensDetails, LIVE_RATES_PER_MILLION.input) : null;
  const outputCost = pricedModel ? pricedTokens(usage.responseTokensDetails, LIVE_RATES_PER_MILLION.output) : null;
  return {
    ...context,
    at: new Date().toISOString(),
    promptTokenCount: usage.promptTokenCount,
    responseTokenCount: usage.responseTokenCount,
    thoughtsTokenCount: usage.thoughtsTokenCount,
    totalTokenCount: usage.totalTokenCount,
    promptTokensDetails: usage.promptTokensDetails?.map(({ modality, tokenCount }) => ({ modality, tokenCount })),
    responseTokensDetails: usage.responseTokensDetails?.map(({ modality, tokenCount }) => ({ modality, tokenCount })),
    estimatedUsd: inputCost !== null && outputCost !== null ? inputCost + outputCost : null,
  };
}
