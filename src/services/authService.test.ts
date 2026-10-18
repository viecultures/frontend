import { test } from 'node:test';
import assert from 'node:assert/strict';
import { authService } from './authService';

test('Google login preserves the backend avatar, role and access token', async t => {
  const original = globalThis.fetch;
  t.after(() => { globalThis.fetch = original; });
  globalThis.fetch = async (input, init) => {
    assert.equal(String(input), '/api/v1/auth/google');
    assert.equal(init?.method, 'POST');
    assert.deepEqual(JSON.parse(init?.body as string), { idToken: 'google-credential' });
    return Response.json({ success: true, data: {
      accessToken: 'backend-access-token', expiresIn: 3600,
      user: { name: 'Learner', email: 'learner@example.test', avatarUrl: '/avatar.png', role: 'ROLE_USER' },
    } });
  };
  const result = await authService.loginWithGoogle('google-credential');
  assert.deepEqual(result, {
    token: 'backend-access-token', expiresIn: 3600,
    user: { name: 'Learner', email: 'learner@example.test', avatar: '/avatar.png', role: 'ROLE_USER' },
  });
});

test('Google login never promotes a missing backend role to admin', async t => {
  const original = globalThis.fetch;
  t.after(() => { globalThis.fetch = original; });
  globalThis.fetch = async () => Response.json({ success: true, data: {
    accessToken: 'token', user: { email: 'learner@example.test' },
  } });
  assert.equal((await authService.loginWithGoogle('credential')).user.role, 'ROLE_USER');
});

test('Google login surfaces backend failures without creating an auth result', async t => {
  const original = globalThis.fetch;
  t.after(() => { globalThis.fetch = original; });
  globalThis.fetch = async () => Response.json({ success: false, message: 'Invalid Google credential' }, { status: 401 });
  await assert.rejects(authService.loginWithGoogle('invalid'), /Invalid Google credential/);
});
