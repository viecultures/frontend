import { test } from 'node:test';
import assert from 'node:assert/strict';
import { backendAuthService as authService } from './authService';
import { authService as activeAuthService } from './authService';
import { localAuthService } from './localAuthService';

test('local email sign-in creates learners and social demo grants Thien Luan admin without network requests or tokens', async t => {
  const original = globalThis.fetch;
  t.after(() => { globalThis.fetch = original; });
  globalThis.fetch = async () => { throw new Error('Local authentication must never call fetch'); };

  assert.equal(activeAuthService, localAuthService);
  const login = await activeAuthService.login(' Admin@VieCultures.com ', 'demo123');
  assert.deepEqual(login, {
    token: null,
    user: { name: 'admin', email: 'admin@viecultures.com', role: 'ROLE_USER' },
  });
  const registration = await activeAuthService.register(' New@Example.com ', 'demo123', ' Local Learner ');
  assert.equal(registration.user.name, 'Local Learner');
  assert.equal(registration.user.email, 'new@example.com');
  assert.equal(registration.user.role, 'ROLE_USER');
  assert.equal(registration.token, null);
  assert.deepEqual(await localAuthService.loginDemo(), {
    token: null,
    user: { name: 'Thien Luan', email: 'thienluan@example.com', role: 'ROLE_ADMIN' },
  });
});

test('local sign-in validates inputs and does not treat Google credentials as verified identities', async () => {
  await assert.rejects(localAuthService.login('invalid-email', 'demo123'), /email hợp lệ/);
  await assert.rejects(localAuthService.login('learner@example.com', 'short'), /6 ký tự/);
  await assert.rejects(localAuthService.register('learner@example.com', 'demo123', ' '), /họ và tên/);
  await assert.rejects(localAuthService.loginWithGoogle('unverified-credential'), /tạm tắt/);
});

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

test('password login sends credentials to the backend and uses its authenticated user', async t => {
  const original = globalThis.fetch;
  t.after(() => { globalThis.fetch = original; });
  globalThis.fetch = async (input, init) => {
    assert.equal(String(input), '/api/v1/auth/login');
    assert.equal(init?.method, 'POST');
    assert.deepEqual(JSON.parse(init?.body as string), { email: 'learner@example.test', password: ' secret ' });
    return Response.json({ success: true, data: {
      token: 'password-access-token', user: { email: 'learner@example.test', name: 'From backend', role: 'STUDENT' },
    } });
  };
  const result = await authService.login(' learner@example.test ', ' secret ');
  assert.equal(result.token, 'password-access-token');
  assert.equal(result.user.name, 'From backend');
  assert.equal(result.user.role, 'STUDENT');
});

test('registration sends the backend name field without choosing its own role', async t => {
  const original = globalThis.fetch;
  t.after(() => { globalThis.fetch = original; });
  globalThis.fetch = async (input, init) => {
    assert.equal(String(input), '/api/v1/auth/register');
    assert.deepEqual(JSON.parse(init?.body as string), {
      email: 'new@example.test', password: 'secret123', name: 'New Learner',
    });
    return Response.json({ success: true, data: {
      accessToken: 'registered-token', user: { email: 'new@example.test', name: 'New Learner', role: 'ROLE_USER' },
    } }, { status: 201 });
  };
  const result = await authService.register(' new@example.test ', 'secret123', ' New Learner ');
  assert.equal(result.token, 'registered-token');
});

test('password login rejects bad credentials and incomplete success responses', async t => {
  const original = globalThis.fetch;
  t.after(() => { globalThis.fetch = original; });
  globalThis.fetch = async () => Response.json({ success: false, message: 'Sai mật khẩu' }, { status: 401 });
  await assert.rejects(authService.login('learner@example.test', 'wrong'), /Sai mật khẩu/);
  for (const data of [
    { user: { email: 'learner@example.test' } },
    { accessToken: 'token' },
  ]) {
    globalThis.fetch = async () => Response.json({ success: true, data });
    await assert.rejects(authService.login('learner@example.test', 'secret123'), /không hợp lệ/);
  }
});
