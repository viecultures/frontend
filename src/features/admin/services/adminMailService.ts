import { API_BASE_URL } from '@/config/apiConfig';
import { getStoredToken } from '@/utils/auth-storage';

export interface SendEmailNotificationPayload {
  toEmail: string;
  subject?: string;
  headline?: string;
  messageContent?: string;
  actionUrl?: string;
  actionText?: string;
  recipientName?: string;
}

export interface MailActionResponse {
  success: boolean;
  message: string;
}

const getMailHeaders = (): Record<string, string> => {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const adminMailService = {
  /**
   * Gửi email thông báo hoặc bản tin văn hóa theo template Warm Heritage
   * POST /api/v1/mail/send-notification
   */
  async sendNotification(payload: SendEmailNotificationPayload): Promise<MailActionResponse> {
    const url = `${API_BASE_URL}/api/v1/mail/send-notification`;
    const res = await fetch(url, {
      method: 'POST',
      headers: getMailHeaders(),
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Lỗi khi gửi email thông báo (HTTP ${res.status})`);
    }

    return res.json();
  },

  /**
   * Kiểm tra kết nối Gmail SMTP Ping
   * POST /api/v1/mail/test-connection?toEmail=...
   */
  async testConnection(toEmail: string): Promise<MailActionResponse> {
    const url = `${API_BASE_URL}/api/v1/mail/test-connection?toEmail=${encodeURIComponent(toEmail.trim())}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: getMailHeaders(),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Lỗi khi kiểm tra kết nối SMTP (HTTP ${res.status})`);
    }

    return res.json();
  },
};
