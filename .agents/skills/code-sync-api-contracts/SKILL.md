---
name: code-sync-api-contracts
description: Creates strongly typed API client services connecting React components to Spring Boot ApiResponse envelopes.
---

# Sync API Contracts (Frontend)

Standardizes typed fetch/Axios service clients connecting React components to backend endpoints.

## Directives
1. **Unified Envelope Unwrapping:**
   All services must parse the backend `ApiResponse<T>` envelope:
   ```typescript
   export interface ApiResponse<T> {
     success: boolean;
     message: string;
     data: T;
     timestamp: string;
   }
   ```
2. **Service Template:**
   ```typescript
   import type { ReadingPost, ApiResponse } from '@/types';

   const API_BASE = import.meta.env.VITE_API_BASE_URL;

   export async function fetchPostBySlug(slug: string): Promise<ReadingPost> {
     const response = await fetch(`${API_BASE}/api/v1/posts/${slug}`);
     if (!response.ok) {
       throw new Error(`Failed to fetch post: ${response.statusText}`);
     }
     const result: ApiResponse<ReadingPost> = await response.json();
     if (!result.success) {
       throw new Error(result.message || 'API operation reported failure');
     }
     return result.data;
   }
   ```
3. **Cache & State Integration:**
   * Integrate with local stores or React state.
   * Provide immediate optimistic UI updates where applicable (e.g. adding a flashcard or submitting a reflection).
