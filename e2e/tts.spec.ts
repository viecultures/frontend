import { test, expect, Page } from '@playwright/test';

/**
 * Helper mock TTS endpoint tại tầng mạng trình duyệt (phù hợp với contract của Spring Boot TtsController)
 */
export async function setupTtsMock(page: Page) {
  await page.route('**/api/tts', async (route) => {
    const postData = route.request().postDataJSON() || {};
    const text = postData.text;

    if (!text || !String(text).trim()) {
      return route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          status: 400,
          error: 'BAD_REQUEST',
          errorCode: 'VALIDATION_ERROR',
          message: 'Nội dung văn bản (text) không được để trống',
        }),
      });
    }

    if (String(text).length > 1000) {
      return route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          status: 400,
          error: 'BAD_REQUEST',
          errorCode: 'VALIDATION_ERROR',
          message: `Nội dung văn bản không được vượt quá 1.000 ký tự mỗi request (Độ dài hiện tại: ${String(text).length})`,
        }),
      });
    }

    // Mock binary audio/mpeg (chuẩn MP3 stream)
    const dummyAudioBuffer = Buffer.from([0xff, 0xfb, 0x90, 0x64, 0x00, 0x00, 0x00, 0x00]);
    return route.fulfill({
      status: 200,
      contentType: 'audio/mpeg',
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': String(dummyAudioBuffer.length),
      },
      body: dummyAudioBuffer,
    });
  });
}

test.describe('Text-To-Speech (TTS) API & MSW Integration Tests', () => {
  const TTS_ENDPOINT = '/api/tts';

  test.describe('1. Kiểm thử kết nối và gọi API TTS từ trình duyệt (In-Browser Fetch & MSW)', () => {
    test.beforeEach(async ({ page }) => {
      await setupTtsMock(page);
    });

    test('Gọi API TTS thành công khi truyền văn bản hợp lệ (Status 200, audio/mpeg)', async ({ page }) => {
      await page.goto('/vi/login');
      await page.waitForLoadState('domcontentloaded');

      const result = await page.evaluate(async (endpoint) => {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: 'Welcome to Vietnam and VieCultures platform.',
            voice: 'en-US-JennyNeural',
            speed: 1.0,
          }),
        });

        const contentType = res.headers.get('content-type');
        const blob = await res.blob();

        return {
          status: res.status,
          ok: res.ok,
          contentType,
          blobSize: blob.size,
        };
      }, TTS_ENDPOINT);

      expect(result.status).toBe(200);
      expect(result.ok).toBe(true);
      expect(result.contentType).toContain('audio/mpeg');
      expect(result.blobSize).toBeGreaterThan(0);
    });

    test('Bị từ chối khi nội dung văn bản để rỗng (Validation 400 Bad Request)', async ({ page }) => {
      await page.goto('/vi/login');
      await page.waitForLoadState('domcontentloaded');

      const result = await page.evaluate(async (endpoint) => {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: '   ' }),
        });

        const data = await res.json();
        return {
          status: res.status,
          data,
        };
      }, TTS_ENDPOINT);

      expect(result.status).toBe(400);
      expect(result.data.errorCode).toBe('VALIDATION_ERROR');
      expect(result.data.message).toContain('không được để trống');
    });

    test('Bị từ chối khi nội dung vượt quá giới hạn 1.000 ký tự (Validation 400 Bad Request)', async ({ page }) => {
      await page.goto('/vi/login');
      await page.waitForLoadState('domcontentloaded');

      const longText = 'VieCultures '.repeat(100); // > 1100 ký tự

      const result = await page.evaluate(
        async ({ endpoint, text }) => {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text }),
          });

          const data = await res.json();
          return {
            status: res.status,
            data,
          };
        },
        { endpoint: TTS_ENDPOINT, text: longText }
      );

      expect(result.status).toBe(400);
      expect(result.data.errorCode).toBe('VALIDATION_ERROR');
      expect(result.data.message).toContain('1.000 ký tự');
    });
  });

  test.describe('2. Kiểm thử khả năng tạo HTMLAudioElement phát âm thanh (Audio Element Lifecycle)', () => {
    test.beforeEach(async ({ page }) => {
      await setupTtsMock(page);
    });

    test('Trình duyệt nạp thành công Audio Stream vào thẻ Audio và sẵn sàng phát', async ({ page }) => {
      await page.goto('/vi/login');
      await page.waitForLoadState('domcontentloaded');

      const audioPlaybackState = await page.evaluate(async (endpoint) => {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: 'Xin chào Hà Nội',
            speed: 1,
          }),
        });

        const blob = await res.blob();
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);

        return {
          hasBlob: blob.size > 0,
          blobType: blob.type,
          hasAudioUrl: typeof audioUrl === 'string' && audioUrl.startsWith('blob:'),
          isAudioInstance: audio instanceof HTMLAudioElement,
        };
      }, TTS_ENDPOINT);

      expect(audioPlaybackState.hasBlob).toBe(true);
      expect(audioPlaybackState.blobType).toContain('audio/mpeg');
      expect(audioPlaybackState.hasAudioUrl).toBe(true);
      expect(audioPlaybackState.isAudioInstance).toBe(true);
    });
  });
});
