import type { paths, components } from './api-schema';

/** Toàn bộ paths trong OpenAPI */
export type ApiPaths = paths;

/** Toàn bộ schema DTOs / Entities */
export type ApiSchemas = components['schemas'];

/**
 * Trích xuất Request Body type của một endpoint
 * Ví dụ: RequestBody<'post', '/api/v1/auth/login'>
 */
export type RequestBody<
  M extends 'get' | 'post' | 'put' | 'delete' | 'patch',
  P extends keyof paths,
> = paths[P][M] extends {
  requestBody: {
    content: {
      'application/json': infer B;
    };
  };
}
  ? B
  : paths[P][M] extends {
        requestBody?: {
          content: {
            'application/json': infer B;
          };
        };
      }
    ? B | undefined
    : never;

/**
 * Trích xuất Response Data type theo mã HTTP status (mặc định 200)
 * Ví dụ: ApiResponseData<'get', '/api/v1/users/profile'> -> UserProfileResponse
 */
export type ApiResponseData<
  M extends 'get' | 'post' | 'put' | 'delete' | 'patch',
  P extends keyof paths,
  Status extends number = 200,
> = paths[P][M] extends {
  responses: {
    [K in Status]: {
      content: {
        'application/json': infer R;
      };
    };
  };
}
  ? R
  : never;

/**
 * Trích xuất Path parameters
 * Ví dụ: PathParams<'get', '/api/v1/users/{id}'>
 */
export type PathParams<
  M extends 'get' | 'post' | 'put' | 'delete' | 'patch',
  P extends keyof paths,
> = paths[P][M] extends {
  parameters: {
    path: infer Param;
  };
}
  ? Param
  : Record<string, never>;

/**
 * Trích xuất Query parameters
 */
export type QueryParams<
  M extends 'get' | 'post' | 'put' | 'delete' | 'patch',
  P extends keyof paths,
> = paths[P][M] extends {
  parameters: {
    query?: infer Query;
  };
}
  ? Query
  : Record<string, never>;
