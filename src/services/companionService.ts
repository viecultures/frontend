import { getApiBaseUrl } from '@/config/apiConfig';
import { getStoredToken } from '@/utils/auth-storage';
import type { CompanionChatRequest, CompanionChatResponse } from '@/types/companion';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errorCode?: string;
}

export const companionService = {
  /**
   * Send user message to VieCultures AI Cultural Companion
   */
  async sendMessage(request: CompanionChatRequest): Promise<CompanionChatResponse> {
    const baseUrl = getApiBaseUrl();
    const token = getStoredToken();
    const endpoint = `${baseUrl}/api/v1/companion/chat`;

    console.log('[companionService] Sending request to:', endpoint, { request, hasToken: !!token });

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(request),
        signal: AbortSignal.timeout(25000),
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => null);
        console.error('[companionService] HTTP error received:', response.status, errorJson);
        if (response.status === 403) {
          throw new Error(
            errorJson?.message || 'Daily limit of 3 free companion chats reached. Please upgrade to Pro for unlimited interactions.'
          );
        }
        throw new Error(
          errorJson?.message || `Request failed with status ${response.status}: Unable to get companion reply`
        );
      }

      const json: ApiResponse<CompanionChatResponse> = await response.json();
      console.log('[companionService] Received successful response:', json);
      return json.data;
    } catch (err) {
      console.error('[companionService] Fetch failed:', err);
      throw err;
    }
  },
};
