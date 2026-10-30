import { getApiBaseUrl } from '@/config/apiConfig';
import { getStoredToken } from '@/utils/auth-storage';

export interface WikipediaImage {
  url: string;
  filePageUrl: string;
  artist: string;
  license: string;
  licenseUrl: string;
}

export interface WikipediaSource {
  title: string;
  extract: string;
  url: string;
  image: WikipediaImage | null;
}

export interface WikipediaSearchResult {
  provider: 'Wikipedia';
  fetchedAt: string;
  cached: boolean;
  sources: WikipediaSource[];
}

export async function searchWikipedia(query: string, language: 'en' | 'vi'): Promise<WikipediaSearchResult> {
  const params = new URLSearchParams({ q: query.trim(), lang: language });
  const token = getStoredToken();
  const response = await fetch(`${getApiBaseUrl()}/api/v1/ai-workspace/sources/wikipedia?${params}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) {
    if (response.status === 400) throw new Error('Use a short public topic without contact details.');
    if (response.status === 429) throw new Error('Wikipedia search is temporarily rate limited. Try again later.');
    throw new Error('Wikipedia sources are unavailable right now.');
  }
  const envelope = await response.json();
  if (!envelope?.success || !Array.isArray(envelope?.data?.sources)) {
    throw new Error('Wikipedia returned an invalid result.');
  }
  return envelope.data as WikipediaSearchResult;
}
