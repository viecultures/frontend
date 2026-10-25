import { test, type TestContext } from 'node:test';
import assert from 'node:assert/strict';
import {
  clearAuthStorage,
  getStoredToken,
  getStoredUser,
  getUserRole,
  isAdminUser,
  setAuthSession,
  setStoredUser,
  getIsProUser,
  setIsProUser,
  getAiDailyTurnsUsed,
  incrementAiDailyTurns,
  getAiRemainingTurns,
  canSendAiTurn,
  resetAiDailyTurns,
  FREE_DAILY_AI_TURNS_LIMIT,
} from './auth-storage';

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

test('local sign-in replaces legacy backend tokens and remember-me selects the correct store', t => {
  const { local, session, events } = setup(t);
  local.setItem('token', 'stale-backend-token');
  local.setItem('vie_auth_token', 'stale-backend-token');
  local.setItem('vie_current_user', JSON.stringify({ role: 'ROLE_ADMIN' }));
  const user = { name: 'Local Learner', email: 'learner@example.com', role: 'ROLE_USER' };
  const observed: unknown[] = [];
  events.addEventListener('auth:change', () => observed.push(getStoredUser()));

  setAuthSession(user, null, false);
  assert.equal(getStoredToken(), null);
  assert.equal(isAdminUser(), false);
  assert.equal(local.getItem('vie_current_user'), null);
  assert.deepEqual(getStoredUser(), user);
  assert.deepEqual(observed, [user]);
  setStoredUser({ ...user, name: 'Updated Learner' });
  assert.equal(local.getItem('vie_current_user'), null);
  assert.equal(getStoredUser()?.name, 'Updated Learner');

  setAuthSession(user, null, true);
  assert.equal(session.getItem('vie_current_user'), null);
  assert.deepEqual(JSON.parse(local.getItem('vie_current_user')!), user);
  clearAuthStorage();
  assert.equal(getStoredUser(), null);
});

test('setIsProUser unlocks Pro status and synchronizes with stored user profile', t => {
  const { local, events } = setup(t);
  const user = { name: 'Learner One', email: 'learner1@example.com', role: 'ROLE_USER', isPro: false };
  local.setItem('vie_current_user', JSON.stringify(user));

  let subChanges = 0;
  events.addEventListener('subscription:change', () => { subChanges++; });

  assert.equal(getIsProUser(), false);
  setIsProUser(true);
  assert.equal(getIsProUser(), true);
  assert.equal(subChanges, 1);
  assert.equal(getStoredUser()?.isPro, true);

  setIsProUser(false);
  assert.equal(getIsProUser(), false);
  assert.equal(subChanges, 2);
  assert.equal(getStoredUser()?.isPro, false);
});

test('AI daily rate limiting allows 3 turns for free tier and unlimited for Pro tier', t => {
  const { local } = setup(t);
  assert.equal(FREE_DAILY_AI_TURNS_LIMIT, 3);
  assert.equal(getIsProUser(), false);

  // Initial state: 0 used, 3 remaining
  assert.equal(getAiDailyTurnsUsed(), 0);
  assert.equal(getAiRemainingTurns(), 3);
  assert.equal(canSendAiTurn(), true);

  // Turn 1
  incrementAiDailyTurns();
  assert.equal(getAiDailyTurnsUsed(), 1);
  assert.equal(getAiRemainingTurns(), 2);
  assert.equal(canSendAiTurn(), true);

  // Turn 2
  incrementAiDailyTurns();
  assert.equal(getAiDailyTurnsUsed(), 2);
  assert.equal(getAiRemainingTurns(), 1);
  assert.equal(canSendAiTurn(), true);

  // Turn 3
  incrementAiDailyTurns();
  assert.equal(getAiDailyTurnsUsed(), 3);
  assert.equal(getAiRemainingTurns(), 0);
  assert.equal(canSendAiTurn(), false);

  // Upgrading to Pro immediately lifts the rate limit
  setIsProUser(true);
  assert.equal(getIsProUser(), true);
  assert.equal(canSendAiTurn(), true);
  assert.equal(getAiRemainingTurns(), Infinity);

  // Reset turns
  resetAiDailyTurns();
  assert.equal(getAiDailyTurnsUsed(), 0);
});
