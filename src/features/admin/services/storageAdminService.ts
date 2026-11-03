import { API_BASE_URL } from '@/config/apiConfig';
import { getStoredToken } from '@/utils/auth-storage';

export interface FileUploadResponse {
  url: string;
  key?: string;
  fileName?: string;
  fileSize?: number;
  contentType?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errorCode?: string;
  timestamp?: string;
}

/**
 * Tải ảnh lên Cloudflare R2 qua endpoint Admin Storage
 * @param file Tệp hình ảnh cần upload
 * @param folder Thư mục lưu trữ trên storage (mặc định: 'general')
 * @returns Đường dẫn URL công khai của ảnh đã upload
 */
export async function uploadAdminImage(file: File, folder: string = 'general'): Promise<string> {
  if (!file) {
    throw new Error('Vui lòng chọn một tệp hình ảnh hợp lệ.');
  }

  const token = getStoredToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  const url = `${API_BASE_URL}/api/v1/admin/storage/upload`;
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Tải ảnh lên thất bại (HTTP ${res.status})`);
  }

  const json: ApiResponse<FileUploadResponse> = await res.json();
  if (!json.success || !json.data?.url) {
    throw new Error(json.message || 'Hệ thống không nhận được đường dẫn ảnh sau khi tải lên.');
  }

  return json.data.url;
}

export const storageAdminService = {
  uploadAdminImage,
};
