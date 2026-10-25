/**
 * Centralized API & Environment Configuration
 * Strictly reads from environment variables without hardcoded fallback ports or default data.
 */

export const BACKEND_PORT = import.meta.env?.VITE_BACKEND_PORT || '';

export const API_BASE_URL: string = (
  import.meta.env?.VITE_API_BASE_URL ||
  (BACKEND_PORT ? `http://localhost:${BACKEND_PORT}` : '') ||
  ''
).replace(/\/+$/, '');

export const getApiBaseUrl = (): string => API_BASE_URL;
