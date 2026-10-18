import { getApiBaseUrl } from '@/config/apiConfig';

export interface OtpActionResponse {
  success: boolean;
  message: string;
  cooldownSeconds?: number;
  verified?: boolean;
}

export const authMailService = {
  /**
   * 1. Gửi OTP đặt lại mật khẩu
   */
  async sendForgotPasswordOtp(email: string): Promise<OtpActionResponse> {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/api/v1/auth/forgot-password/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim() }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Lỗi khi gửi mã OTP. Vui lòng thử lại.');
    }
    return response.json();
  },

  /**
   * 2. Xác minh OTP 6 số
   */
  async verifyForgotPasswordOtp(email: string, otpCode: string): Promise<OtpActionResponse> {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/api/v1/auth/forgot-password/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), otpCode: otpCode.trim() }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Mã OTP không hợp lệ hoặc đã hết hạn.');
    }
    return response.json();
  },

  /**
   * 3. Đặt lại mật khẩu mới
   */
  async resetPassword(email: string, otpCode: string, newPassword: string): Promise<OtpActionResponse> {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/api/v1/auth/forgot-password/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.trim(),
        otpCode: otpCode.trim(),
        newPassword: newPassword.trim(),
      }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Lỗi khi đổi mật khẩu.');
    }
    return response.json();
  },

  /**
   * 4. Gửi email xác thực tài khoản
   */
  async sendVerifyEmailOtp(email: string): Promise<OtpActionResponse> {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/api/v1/auth/verify-email/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim() }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Lỗi khi gửi email xác thực.');
    }
    return response.json();
  },

  /**
   * 5. Xác nhận email
   */
  async confirmEmail(email: string, otpCode: string): Promise<OtpActionResponse> {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/api/v1/auth/verify-email/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), otpCode: otpCode.trim() }),
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Mã xác thực không hợp lệ.');
    }
    return response.json();
  },

  /**
   * 6. Kiểm tra kết nối SMTP
   */
  async testSmtpConnection(toEmail: string): Promise<OtpActionResponse> {
    const baseUrl = getApiBaseUrl();
    const response = await fetch(`${baseUrl}/api/v1/mail/test-connection?toEmail=${encodeURIComponent(toEmail.trim())}`, {
      method: 'POST',
    });
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.message || 'Lỗi khi thử nghiệm kết nối gửi mail.');
    }
    return response.json();
  },
};
