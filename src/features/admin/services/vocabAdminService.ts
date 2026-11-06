import type {
  AdminVocabItem,
  VocabFilterParams,
  VocabFormData,
  PageResponse,
} from '../types/adminVocabTypes';
import { API_BASE_URL } from '@/config/apiConfig';
import { getStoredToken } from '@/utils/auth-storage';

interface ApiResponseWrapper<T> {
  success?: boolean;
  message?: string;
  data?: T;
  content?: AdminVocabItem[];
  totalElements?: number;
  totalPages?: number;
  page?: number;
  size?: number;
}

const getAuthHeaders = (): Record<string, string> => {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

export const vocabAdminService = {
  /**
   * Lay danh sach tu vung co phan trang va bo loc (Search, CEFR Level, Post ID).
   * Goi GET /api/admin/vocabularies voi co che du phong sang /api/vocabularies neu endpoint quan tri chua co.
   */
  async fetchVocabularies(params: VocabFilterParams = {}): Promise<PageResponse<AdminVocabItem>> {
    const page = params.page ?? 0;
    const size = params.size ?? 10;
    const searchParams = new URLSearchParams();

    if (params.search?.trim()) {
      searchParams.append('search', params.search.trim());
    }
    if (params.level && params.level !== 'ALL') {
      searchParams.append('level', params.level);
    }
    if (params.postId) {
      searchParams.append('postId', params.postId);
    }
    searchParams.append('page', String(page));
    searchParams.append('size', String(size));

    const adminUrl = `${API_BASE_URL}/api/admin/vocabularies?${searchParams.toString()}`;

    try {
      const res = await fetch(adminUrl, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (res.ok) {
        const json: ApiResponseWrapper<PageResponse<AdminVocabItem>> | PageResponse<AdminVocabItem> = await res.json();

        // Truong hop backend tra ve envelope { data: { content, totalElements... } }
        if ('data' in json && json.data && Array.isArray(json.data.content)) {
          return json.data;
        }

        // Truong hop backend tra ve truc tiep PageResponse { content, totalElements... }
        if ('content' in json && Array.isArray(json.content)) {
          return {
            content: json.content,
            totalElements: json.totalElements ?? json.content.length,
            totalPages: json.totalPages ?? Math.ceil((json.totalElements ?? json.content.length) / size),
            page: json.page ?? page,
            size: json.size ?? size,
          };
        }
      }

      // Neu endpoint admin tra ve 404 (chua khoi tao backend admin controller), fallback goi /api/vocabularies
      if (res.status === 404) {
        return await this.fetchVocabulariesFallback(params);
      }

      const errorData = await res.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Loi tai danh sach tu vung tu may chu (HTTP ${res.status})`
      );
    } catch (err: unknown) {
      if (err instanceof Error && err.message.includes('404')) {
        return await this.fetchVocabulariesFallback(params);
      }
      throw err;
    }
  },

  /**
   * Fallback truy van danh sach tu vung qua endpoint public /api/vocabularies khi backend admin chua mount
   */
  async fetchVocabulariesFallback(params: VocabFilterParams): Promise<PageResponse<AdminVocabItem>> {
    const page = params.page ?? 0;
    const size = params.size ?? 10;
    const search = params.search?.trim() || '';
    const level = params.level && params.level !== 'ALL' ? params.level : '';

    const fallbackUrl = search
      ? `${API_BASE_URL}/api/vocabularies?search=${encodeURIComponent(search)}&limit=100`
      : `${API_BASE_URL}/api/vocabularies/popular?limit=100`;

    const res = await fetch(fallbackUrl, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      throw new Error(`Khong the ket noi den may chu tu vung (HTTP ${res.status})`);
    }

    const items: AdminVocabItem[] = await res.json();
    let filtered = Array.isArray(items) ? items : [];

    if (level) {
      filtered = filtered.filter((item) => (item.level || '').toUpperCase() === level.toUpperCase());
    }

    if (params.postId) {
      filtered = filtered.filter((item) => item.postId === params.postId);
    }

    const totalElements = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalElements / size));
    const startIdx = page * size;
    const paginated = filtered.slice(startIdx, startIdx + size);

    return {
      content: paginated,
      totalElements,
      totalPages,
      page,
      size,
    };
  },

  /**
   * Tao moi mot tu vung vao he thong
   * POST /api/admin/vocabularies
   */
  async createVocabulary(data: VocabFormData): Promise<AdminVocabItem> {
    const res = await fetch(`${API_BASE_URL}/api/admin/vocabularies`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Khong the tao tu vung moi (HTTP ${res.status})`);
    }

    const json = await res.json();
    return (json.data || json) as AdminVocabItem;
  },

  /**
   * Cap nhat thong tin mot tu vung theo ID
   * PUT /api/admin/vocabularies/${id}
   */
  async updateVocabulary(id: string, data: VocabFormData): Promise<AdminVocabItem> {
    const res = await fetch(`${API_BASE_URL}/api/admin/vocabularies/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Khong the cap nhat tu vung ID: ${id} (HTTP ${res.status})`);
    }

    const json = await res.json();
    return (json.data || json) as AdminVocabItem;
  },

  /**
   * Xoa mot tu vung khoi he thong
   * DELETE /api/admin/vocabularies/${id}
   */
  async deleteVocabulary(id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/admin/vocabularies/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Khong the xoa tu vung ID: ${id} (HTTP ${res.status})`);
    }
  },

  /**
   * Tra cuu tu dien AI thong minh de tu dong dien POS, IPA, nghia tieng Viet, dinh nghia tieng Anh
   * GET /api/vocabularies/lookup?word=...&contextSentence=...
   */
  async lookupWordAI(word: string, contextSentence?: string): Promise<AdminVocabItem> {
    const params = new URLSearchParams();
    params.append('word', word.trim());
    if (contextSentence?.trim()) {
      params.append('contextSentence', contextSentence.trim());
    }

    const res = await fetch(`${API_BASE_URL}/api/vocabularies/lookup?${params.toString()}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `AI khong the tra cuu tu "${word}" (HTTP ${res.status})`);
    }

    const data = await res.json();
    return {
      id: data.id || '',
      word: data.word || word,
      pos: data.pos || '',
      ipa: data.ipa || '',
      viMeaning: data.viMeaning || '',
      enDefinition: data.enDefinition || '',
      contextSentence: data.contextSentence || contextSentence || '',
      audioUrl: data.audioUrl || '',
      level: data.level || 'B1',
      searchCount: data.searchCount || 0,
      postId: data.postId,
      postTitleEn: data.postTitleEn,
      postTitleVi: data.postTitleVi,
      journeyId: data.journeyId,
      journeyTitleEn: data.journeyTitleEn,
      usageNote: data.usageNote,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};
