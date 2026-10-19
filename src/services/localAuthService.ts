import type { AuthResult } from './authService';

function createLocalSession(email: string, password: string, name?: string): AuthResult {
  const normalizedEmail = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new Error('Vui lòng nhập email hợp lệ.');
  }
  if (password.length < 6) {
    throw new Error('Mật khẩu dùng thử cần ít nhất 6 ký tự.');
  }
  if (name !== undefined && !name.trim()) {
    throw new Error('Vui lòng nhập họ và tên.');
  }

  // This is a local demo profile, not a backend identity. Never persist the password.
  return {
    token: null,
    user: {
      name: name?.trim() || normalizedEmail.split('@')[0],
      email: normalizedEmail,
      role: 'ROLE_USER',
    },
  };
}

export const localAuthService = {
  async loginDemo(): Promise<AuthResult> {
    return {
      token: null,
      user: { name: 'Thien Luan', email: 'thienluan@example.com', role: 'ROLE_ADMIN' },
    };
  },
  async login(email: string, password: string): Promise<AuthResult> {
    return createLocalSession(email, password);
  },
  async register(email: string, password: string, name: string): Promise<AuthResult> {
    return createLocalSession(email, password, name);
  },
  async loginWithGoogle(_idToken: string): Promise<AuthResult> {
    throw new Error('Đăng nhập Google đang tạm tắt trong chế độ dùng thử.');
  },
};
