import { test } from 'node:test';
import assert from 'node:assert/strict';
import { postAdminService } from './postAdminService';
import type { ReadingPostPayload } from '../types/adminTypes';

test('post mutations carry the stored backend JWT', async t => {
  const originalFetch = globalThis.fetch;
  const originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  t.after(() => {
    globalThis.fetch = originalFetch;
    if (originalStorage) Object.defineProperty(globalThis, 'localStorage', originalStorage);
    else Reflect.deleteProperty(globalThis, 'localStorage');
  });
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: (key: string) => key === 'vie_auth_token' ? 'backend-jwt' : null,
  } });
  const methods: string[] = [];
  globalThis.fetch = async (_input, init) => {
    assert.equal(new Headers(init?.headers).get('Authorization'), 'Bearer backend-jwt');
    methods.push(init?.method || 'GET');
    return Response.json({ id: 'post-id', success: true });
  };
  await postAdminService.createPost({ titleEn: 'Integration test' } as ReadingPostPayload);
  await postAdminService.updatePost('post-id', { titleEn: 'Updated' } as ReadingPostPayload);
  await postAdminService.deletePost('post-id');
  assert.deepEqual(methods, ['POST', 'PUT', 'DELETE']);
});
