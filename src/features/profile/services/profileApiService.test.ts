import { test } from 'node:test';
import assert from 'node:assert/strict';
import { profileApiService } from './profileApiService';

test('local mode skips auth profile requests even when an old backend token is stored', async t => {
  const originalFetch = globalThis.fetch;
  const originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
  t.after(() => {
    globalThis.fetch = originalFetch;
    if (originalStorage) Object.defineProperty(globalThis, 'localStorage', originalStorage);
    else Reflect.deleteProperty(globalThis, 'localStorage');
  });
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true, value: { getItem: () => 'old-backend-token' },
  });
  let requests = 0;
  globalThis.fetch = async () => { requests++; throw new Error('Unexpected auth request'); };
  assert.equal(await profileApiService.fetchCurrentUser(), null);
  assert.equal(requests, 0);
});
