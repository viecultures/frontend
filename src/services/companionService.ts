import { getApiBaseUrl } from '@/config/apiConfig';
import { getStoredToken, getStoredUser } from '@/utils/auth-storage';
import type {
  CompanionChatMessage,
  CompanionChatRequest,
  CompanionChatResponse,
  CompanionTranslateRequest,
  CompanionTranslateResponse,
  CompanionQuotaResponse,
} from '@/types/companion';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errorCode?: string;
}

export interface ICompanionService {
  sendMessage(request: CompanionChatRequest): Promise<CompanionChatResponse>;
  translateMessage(request: CompanionTranslateRequest): Promise<CompanionTranslateResponse>;
  getChatHistory(lessonId?: string): Promise<CompanionChatMessage[]>;
  saveChatHistory(messages: CompanionChatMessage[], lessonId?: string): Promise<void>;
  clearChatHistory(lessonId?: string): Promise<void>;
  getQuota(): Promise<CompanionQuotaResponse>;
}

class CompanionService implements ICompanionService {
  private getStorageKey(lessonId?: string): string {
    const user = getStoredUser();
    const userKey = user?.email || 'guest';
    return `viecultures_companion_history_${userKey}_${lessonId || 'global'}`;
  }

  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    const token = getStoredToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  /**
   * Send user message to VieCultures AI Cultural Companion
   */
  async sendMessage(request: CompanionChatRequest): Promise<CompanionChatResponse> {
    const baseUrl = getApiBaseUrl();
    const token = getStoredToken();
    const endpoint = `${baseUrl}/api/v1/companion/chat`;

    console.log('[companionService] Sending chat request to:', endpoint, { request, hasToken: !!token });

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: this.getAuthHeaders(),
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
      console.error('[companionService] Fetch failed in sendMessage:', err);
      throw err;
    }
  }

  /**
   * Translate message between Vietnamese and English
   */
  async translateMessage(request: CompanionTranslateRequest): Promise<CompanionTranslateResponse> {
    const baseUrl = getApiBaseUrl();
    const endpoint = `${baseUrl}/api/v1/companion/translate`;

    console.log('[companionService] Translating message:', { endpoint, request });

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(request),
        signal: AbortSignal.timeout(15000),
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => null);
        console.error('[companionService] Translation HTTP error received:', response.status, errorJson);
        throw new Error(errorJson?.message || `Translation failed with status ${response.status}`);
      }

      const json = await response.json();
      console.log('[companionService] Translation response received:', json);
      if (json && typeof json === 'object') {
        if ('data' in json && json.data) {
          return json.data as CompanionTranslateResponse;
        }
        if ('translatedText' in json) {
          return json as CompanionTranslateResponse;
        }
      }
      throw new Error('Invalid translation response format from server');
    } catch (err) {
      console.error('[companionService] Translation failed in translateMessage:', err);
      throw err;
    }
  }

  /**
   * Retrieve chat history from server if authenticated, fallback to localStorage
   */
  async getChatHistory(lessonId?: string): Promise<CompanionChatMessage[]> {
    const storageKey = this.getStorageKey(lessonId);
    const token = getStoredToken();

    if (token) {
      try {
        const baseUrl = getApiBaseUrl();
        const query = lessonId ? `?lessonId=${encodeURIComponent(lessonId)}` : '';
        const endpoint = `${baseUrl}/api/v1/companion/history${query}`;

        const response = await fetch(endpoint, {
          method: 'GET',
          headers: this.getAuthHeaders(),
          signal: AbortSignal.timeout(10000),
        });

        if (response.ok) {
          const json = await response.json();
          const remoteMessages: CompanionChatMessage[] = json?.data || json || [];
          if (Array.isArray(remoteMessages)) {
            try {
              localStorage.setItem(storageKey, JSON.stringify(remoteMessages));
            } catch (storageErr) {
              console.error('[companionService] Failed to cache history in localStorage:', storageErr);
            }
            return remoteMessages;
          }
        } else {
          console.error('[companionService] History fetch responded with status:', response.status);
        }
      } catch (remoteErr) {
        console.error('[companionService] Remote history fetch failed, falling back to localStorage:', remoteErr);
      }
    }

    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (localErr) {
      console.error('[companionService] Local storage history parsing failed:', localErr);
    }

    return [];
  }

  /**
   * Save chat history to localStorage and sync with server if authenticated
   */
  async saveChatHistory(messages: CompanionChatMessage[], lessonId?: string): Promise<void> {
    const storageKey = this.getStorageKey(lessonId);

    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch (storageErr) {
      console.error('[companionService] Failed to save history to localStorage:', storageErr);
    }

    const token = getStoredToken();
    if (token) {
      try {
        const baseUrl = getApiBaseUrl();
        const endpoint = `${baseUrl}/api/v1/companion/history`;

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: this.getAuthHeaders(),
          body: JSON.stringify({
            lessonId: lessonId || null,
            messages,
          }),
          signal: AbortSignal.timeout(10000),
        });

        if (!response.ok) {
          console.error('[companionService] Server history sync failed with status:', response.status);
        }
      } catch (remoteErr) {
        console.error('[companionService] Remote history sync failed:', remoteErr);
      }
    }
  }

  /**
   * Clear chat history in localStorage and on server if authenticated
   */
  async clearChatHistory(lessonId?: string): Promise<void> {
    const storageKey = this.getStorageKey(lessonId);

    try {
      localStorage.removeItem(storageKey);
    } catch (storageErr) {
      console.error('[companionService] Failed to remove history from localStorage:', storageErr);
    }

    const token = getStoredToken();
    if (token) {
      try {
        const baseUrl = getApiBaseUrl();
        const query = lessonId ? `?lessonId=${encodeURIComponent(lessonId)}` : '';
        const endpoint = `${baseUrl}/api/v1/companion/history${query}`;

        const response = await fetch(endpoint, {
          method: 'DELETE',
          headers: this.getAuthHeaders(),
          signal: AbortSignal.timeout(10000),
        });

        if (!response.ok) {
          console.error('[companionService] Server history delete failed with status:', response.status);
        }
      } catch (remoteErr) {
        console.error('[companionService] Remote history delete failed:', remoteErr);
      }
    }
  }

  /**
   * Fetch current authenticated user's daily quota and remaining turns
   */
  async getQuota(): Promise<CompanionQuotaResponse> {
    const baseUrl = getApiBaseUrl();
    const endpoint = `${baseUrl}/api/v1/companion/quota`;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: this.getAuthHeaders(),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('AUTH_REQUIRED');
      }
      throw new Error(`Failed to fetch companion quota: ${response.status}`);
    }

    const payload: ApiResponse<CompanionQuotaResponse> = await response.json();
    if (!payload.success || !payload.data) {
      throw new Error(payload.message || 'Invalid quota response from server');
    }
    return payload.data;
  }
}

export const companionService: ICompanionService = new CompanionService();
