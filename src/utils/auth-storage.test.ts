import { test, type TestContext } from 'node:test';
import assert from 'node:assert/strict';
import { clearAuthStorage, getStoredToken, getUserRole, isAdminUser } from './auth-storage';

function storage() {
  const values = new Map<string, string>();
  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => { values.set(key, value); },
    removeItem: (key: string) => { values.delete(key); },
  };
}

function setup(t: TestContext) {
  const local = storage(), session = storage(), events = new EventTarget();
  for (const [key, value] of Object.entries({ localStorage: local, sessionStorage: session, window: events })) {
    const original = Object.getOwnPropertyDescriptor(globalThis, key);
    Object.defineProperty(globalThis, key, { configurable: true, value });
    t.after(() => {
      if (original) Object.defineProperty(globalThis, key, original);
      else Reflect.deleteProperty(globalThis, key);
    });
  }
  return { local, session, events };
}

test('logout clears known auth keys in both stores and preserves unrelated drafts/settings', t => {
  const { local, session, events } = setup(t);
  const keys = ['vie_current_user', 'vie_auth_token', 'vie_user_is_pro', 'token', 'jwt', 'authToken', 'accessToken', 'access_token', 'vie_token', 'vie_jwt', 'user', 'currentUser', 'auth', 'viecultures_user_profile'];
  let changes = 0;
  events.addEventListener('auth:change', () => { changes++; });
  for (const store of [local, session]) {
    keys.forEach(key => store.setItem(key, 'old-session'));
    store.setItem('editor_authored_draft', 'draft');
    store.setItem('theme', 'dark');
    store.setItem('map_api_token', 'map-setting');
  }
  clearAuthStorage();
  for (const store of [local, session]) {
    keys.forEach(key => assert.equal(store.getItem(key), null, key));
    assert.equal(store.getItem('editor_authored_draft'), 'draft');
    assert.equal(store.getItem('theme'), 'dark');
    assert.equal(store.getItem('map_api_token'), 'map-setting');
  }
  assert.equal(changes, 1);
  assert.equal(getStoredToken(), null);
});

test('a profile without a role cannot obtain admin access', t => {
  const { local } = setup(t);
  local.setItem('vie_current_user', JSON.stringify({ name: 'Learner', email: 'learner@example.test' }));
  assert.equal(getUserRole(), 'ROLE_USER');
  assert.equal(isAdminUser(), false);
});

test('backend JWT role takes precedence over a stale stored profile role', t => {
  const { local } = setup(t);
  local.setItem('vie_current_user', JSON.stringify({ role: 'ADMIN' }));
  const payload = Buffer.from(JSON.stringify({ role: 'ROLE_USER' })).toString('base64url');
  local.setItem('vie_auth_token', `header.${payload}.signature`);
  assert.equal(isAdminUser(), false);
});

test('explicit backend admin roles remain supported', t => {
  const { local } = setup(t);
  local.setItem('vie_current_user', JSON.stringify({ role: 'ROLE_ADMIN' }));
  assert.equal(isAdminUser(), true);
});
