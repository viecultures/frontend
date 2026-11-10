/**
 * assetHelper.ts — Single source of truth for resolving asset URLs (R2 CDN, local public, external, fallback).
 * Adheres to VieCultures asset architecture.
 */

const R2_PUBLIC_BASE: string = (import.meta.env.VITE_R2_PUBLIC_URL || '').replace(/\/+$/, '');

export type AssetCategory = 'cuisine' | 'heritage' | 'culture' | 'general';

/**
 * Tra cứu ảnh đại diện mặc định theo chuyên mục khi bài viết/hành trình chưa có ảnh hoặc tải lỗi.
 */
export function getDefaultCategoryImage(category?: string | null): string {
  if (!category) {
    return '/images/defaults/cuisine.webp';
  }

  const normalized = category.toLowerCase().trim();

  if (
    normalized.includes('ẩm thực') ||
    normalized.includes('am thuc') ||
    normalized.includes('cuisine') ||
    normalized.includes('food') ||
    normalized.includes('nấu ăn')
  ) {
    return '/images/defaults/cuisine.webp';
  }

  if (
    normalized.includes('di sản') ||
    normalized.includes('di san') ||
    normalized.includes('heritage') ||
    normalized.includes('lịch sử') ||
    normalized.includes('history') ||
    normalized.includes('thắng cảnh')
  ) {
    return '/images/defaults/heritage.webp';
  }

  if (
    normalized.includes('văn hóa') ||
    normalized.includes('van hoa') ||
    normalized.includes('culture') ||
    normalized.includes('phong tục') ||
    normalized.includes('đời sống') ||
    normalized.includes('truyền thống')
  ) {
    return '/images/defaults/culture.webp';
  }

  return '/images/defaults/cuisine.webp';
}

/**
 * Phân giải đường dẫn tài nguyên hình ảnh thành URL hợp lệ:
 * 1. Nếu là external URL (http/https) hoặc blob/data URL -> Giữ nguyên.
 * 2. Nếu là /images/cuisine/... hoặc đường dẫn thuộc R2 Storage -> Ghép VITE_R2_PUBLIC_URL nếu có.
 * 3. Nếu là đường dẫn local tĩnh (như /images/landing, /images/defaults, /brand...) -> Dùng trực tiếp.
 * 4. Nếu không có URL hoặc chuỗi rỗng -> Trả về ảnh mặc định theo category.
 */
export function resolveAssetUrl(url?: string | null, category?: string | null): string {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return getDefaultCategoryImage(category);
  }

  const trimmed = url.trim();

  // 1. External hoặc Blob/Data URL
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  ) {
    return trimmed;
  }

  // 2. Chuẩn hóa path tương đối
  const cleanPath = trimmed.startsWith('/') ? trimmed.slice(1) : trimmed;

  // 3. Đường dẫn thuộc R2 Storage (như images/cuisine/..., posts/..., journeys/..., audio/...)
  const isR2Asset =
    cleanPath.startsWith('images/cuisine/') ||
    cleanPath.startsWith('posts/') ||
    cleanPath.startsWith('journeys/');

  if (isR2Asset && R2_PUBLIC_BASE) {
    return `${R2_PUBLIC_BASE}/${cleanPath}`;
  }

  // 4. Mặc định dùng relative path từ public root
  return `/${cleanPath}`;
}
