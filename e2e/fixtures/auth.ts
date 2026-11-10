import { test as base, type Page } from '@playwright/test';

export const ADMIN_CREDENTIALS = {
  email: 'admin@viecultures.com',
  password: '123456',
  name: 'Quan Tri Vien (Admin)',
  role: 'ROLE_ADMIN',
};

// Valid base64Url encoded JWT token with exp = 2000000000 (May 2033) and role = ROLE_ADMIN
export const MOCK_ADMIN_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiUk9MRV9BRE1JTiIsImVtYWlsIjoiYWRtaW5AdmllY3VsdHVyZXMuY29tIiwibmFtZSI6IlF1YW4gVHJpIFZpZW4gKEFkbWluKSIsImV4cCI6MjAwMDAwMDAwMH0=.e2e_signature';

export const MOCK_ADMIN_USER = {
  id: 'usr-admin-01',
  name: ADMIN_CREDENTIALS.name,
  email: ADMIN_CREDENTIALS.email,
  role: ADMIN_CREDENTIALS.role,
  authProvider: 'LOCAL',
};

export const LEARNER_CREDENTIALS = {
  email: 'learner@example.com',
  password: 'demo123',
  name: 'Học Viên Thử Nghiệm',
  role: 'ROLE_USER',
};

// Valid base64Url encoded JWT token with exp = 2000000000 (May 2033) and role = ROLE_USER
export const MOCK_LEARNER_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiUk9MRV9VU0VSIiwiZW1haWwiOiJsZWFybmVyQGV4YW1wbGUuY29tIiwibmFtZSI6Ikjhu41jIFZpw6puIFRo4butIE5naGnhu4dtIiwiZXhwIjoyMDAwMDAwMDAwfQ.mock_signature';

export const MOCK_LEARNER_USER = {
  id: 'usr-learner-01',
  name: LEARNER_CREDENTIALS.name,
  email: LEARNER_CREDENTIALS.email,
  role: LEARNER_CREDENTIALS.role,
  authProvider: 'LOCAL',
  isPro: true,
};

export const MOCK_COMPANION_QUOTA = {
  remainingDailyTurns: 10,
  isPro: true,
  totalDailyQuota: 20,
  remainingTurns: 10,
  dailyLimit: 20,
};

export const MOCK_COMPANION_CHAT_REPLY = {
  reply:
    'Phở là món ăn truyền thống nổi tiếng của Việt Nam với nước dùng ninh từ xương bò và thảo mộc.',
  suggestedPrompts: ['Lịch sử phở', 'Các loại phở'],
  remainingDailyTurns: 9,
  referencedLessons: [],
};

export const MOCK_COMPANION_TRANSLATION = {
  translatedContent:
    'Pho is a famous traditional Vietnamese dish with broth simmered from beef bones and herbs.',
  translatedText:
    'Pho is a famous traditional Vietnamese dish with broth simmered from beef bones and herbs.',
  targetLanguage: 'en',
};

export const MOCK_OVERVIEW_DATA = {
  success: true,
  message: 'Thành công',
  data: {
    totalUsers: 1250,
    activeLearnersWeek: 480,
    totalPosts: 36,
    publishedPosts: 32,
    totalReads: 14200,
    avgReadsPerPost: 394,
    cefrCoverage: { B1: 15, B2: 12, C1: 5 },
    regionCoverage: { north: 14, central: 10, south: 12 },
    systemStatus: 'OPERATIONAL',
  },
};

export const MOCK_USERS_DATA = {
  success: true,
  message: 'Thành công',
  data: {
    content: [
      {
        id: 'usr-01',
        fullName: 'Nguyễn Văn An',
        email: 'an.nguyen@example.com',
        role: 'ROLE_USER',
        enabled: true,
        createdAt: '2026-02-15T08:30:00Z',
        stats: { totalReads: 24, completedQuizzes: 18, streakDays: 7 },
      },
      {
        id: 'usr-02',
        fullName: 'Trần Thị Mai',
        email: 'mai.tran@example.com',
        role: 'ROLE_ADMIN',
        enabled: true,
        createdAt: '2026-01-10T09:00:00Z',
        stats: { totalReads: 85, completedQuizzes: 70, streakDays: 30 },
      },
    ],
    page: 0,
    size: 10,
    totalElements: 2,
    totalPages: 1,
    last: true,
  },
};

export const MOCK_POSTS_DATA = [
  {
    id: 'post-pho-hanoi-01',
    titleEn: 'The Soul of Hanoi: Phở Bò Heritage',
    titleVi: 'Hồn cốt Hà Nội: Di sản Phở Bò',
    topic: 'Ẩm thực truyền thống',
    region: 'Hà Nội',
    level: 'B2',
    wordCount: 420,
    readTime: '4 phút',
    totalReads: 120,
    vocabCount: 8,
    questionCount: 3,
    featured: true,
    summary: 'Khám phá lịch sử và nét tinh túy của bát phở bò truyền thống xứ Hà Thành.',
    paragraphs: [
      {
        orderIndex: 1,
        enText: 'Pho is more than just a noodle soup in Vietnam.',
        viText: 'Phở không chỉ đơn thuần là một món súp mì ở Việt Nam.',
      },
    ],
    vocabularies: [
      {
        id: 'vocab-01',
        word: 'broth',
        viMeaning: 'nước dùng',
        level: 'B2',
      },
    ],
    questions: [],
  },
];

export const MOCK_JOURNEYS_DATA = [
  {
    id: 'journey-cuisine-hanoi',
    titleEn: 'Cuisine Heritage of Hanoi',
    titleVi: 'Hành trình ẩm thực Hà Nội',
    theme: 'cuisine',
    provinceId: 'Hà Nội',
    region: 'north',
    description: 'Lộ trình khám phá các món ăn ngàn năm văn hiến',
    status: 'published',
  },
];

export const MOCK_VOCAB_DATA = {
  content: [
    {
      id: 'vocab-01',
      word: 'broth',
      ipa: '/brɒθ/',
      pos: 'noun',
      viMeaning: 'nước dùng',
      level: 'B2',
      postId: 'post-pho-hanoi-01',
      postTitleEn: 'The Soul of Hanoi: Phở Bò Heritage',
      postTitleVi: 'Hồn cốt Hà Nội: Di sản Phở Bò',
    },
  ],
  totalElements: 1,
  totalPages: 1,
  page: 0,
  size: 10,
};

export const MOCK_ACTIVITY_LOGS = {
  content: [
    {
      id: 'log-01',
      userEmail: 'admin@viecultures.com',
      userName: 'Quan Tri Vien (Admin)',
      activityType: 'LOGIN',
      description: 'Đăng nhập hệ thống quản trị thành công',
      createdAt: '2026-11-09T07:00:00Z',
    },
  ],
  totalElements: 1,
  totalPages: 1,
  page: 0,
  size: 10,
};

/**
 * Cài đặt hệ thống mock API đầy đủ cho phân hệ Admin bằng Playwright page.route.
 * Giúp bộ test chạy độc lập, tốc độ cao, không phụ thuộc trạng thái server backend.
 */
export async function setupAdminApiMocks(page: Page): Promise<void> {
  // Auth Login mock
  await page.route('**/api/v1/auth/login', async (route) => {
    if (route.request().method() === 'POST') {
      const postData = route.request().postDataJSON() || {};
      if (
        postData.email === ADMIN_CREDENTIALS.email &&
        postData.password === ADMIN_CREDENTIALS.password
      ) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            message: 'Đăng nhập thành công',
            data: {
              token: MOCK_ADMIN_JWT,
              tokenType: 'Bearer',
              expiresIn: 86400,
              user: MOCK_ADMIN_USER,
            },
          }),
        });
        return;
      }

      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Tài khoản hoặc mật khẩu không chính xác',
        }),
      });
      return;
    }
    await route.fallback();
  });

  // Auth Me mock
  await page.route('**/api/v1/auth/me', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        message: 'OK',
        data: MOCK_ADMIN_USER,
      }),
    });
  });

  // Admin Overview
  await page.route('**/api/v1/admin/overview', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_OVERVIEW_DATA),
    });
  });

  // Admin Users
  await page.route('**/api/v1/admin/users*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_USERS_DATA),
    });
  });

  // Posts list & detail
  await page.route('**/api/posts*', async (route) => {
    const url = route.request().url();
    if (url.includes('/api/posts/post-pho-hanoi-01')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_POSTS_DATA[0]),
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_POSTS_DATA),
    });
  });

  // Journeys list
  await page.route('**/api/journeys*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_JOURNEYS_DATA),
    });
  });

  // Vocabularies
  await page.route('**/api/admin/vocabularies*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_VOCAB_DATA),
    });
  });
  await page.route('**/api/vocabularies*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_VOCAB_DATA),
    });
  });

  // Activity logs
  await page.route('**/api/v1/admin/activity-logs*', async (route) => {
    if (route.request().url().includes('/stats')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            totalActions24h: 18,
            activeAdmins24h: 2,
            topReadPosts: [],
          },
        }),
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: MOCK_ACTIVITY_LOGS,
      }),
    });
  });

  // AI Configs
  await page.route('**/api/v1/admin/ai-configs*', async (route) => {
    const url = route.request().url();
    if (url.includes('/metrics')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { totalTokensUsed: 125000, totalCostUsd: 1.25, totalRequests: 320 },
        }),
      });
      return;
    }
    if (url.includes('/settings')) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: { defaultProvider: 'GEMINI', rateLimitPerMinute: 60, autoFallbackEnabled: true },
        }),
      });
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: [] }),
    });
  });

  // Voice models for Post Editor
  await page.route('**/api/posts/voice-models', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        {
          id: 'azure-vi-hoaimy',
          name: 'Hoài My (Nữ - Miền Bắc)',
          gender: 'female',
          locale: 'vi-VN',
          description: 'Giọng đọc miền Bắc truyền cảm',
        },
      ]),
    });
  });

  // Subscriptions
  await page.route('**/api/v1/admin/subscriptions*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: { plans: [], transactions: [], totalRevenue: 0 },
      }),
    });
  });
}

/**
 * Tiêm trực tiếp phiên đăng nhập Admin vào localStorage của trình duyệt trước khi trang tải.
 */
export async function injectAdminStorageSession(page: Page): Promise<void> {
  await page.addInitScript(
    ({ user, token }) => {
      window.localStorage.setItem('vie_current_user', JSON.stringify(user));
      window.localStorage.setItem('vie_auth_token', token);
    },
    { user: MOCK_ADMIN_USER, token: MOCK_ADMIN_JWT }
  );
}

/**
 * Thực hiện đăng nhập chuẩn qua giao diện form đăng nhập `/vi/login`.
 */
export async function loginAsAdminViaUI(page: Page): Promise<void> {
  await page.goto('/vi/login');
  await page.waitForLoadState('domcontentloaded');

  const emailInput = page.locator('#email');
  const passwordInput = page.locator('#password');
  const submitButton = page.locator('button[type="submit"].auth-submit-btn');

  await emailInput.fill(ADMIN_CREDENTIALS.email);
  await passwordInput.fill(ADMIN_CREDENTIALS.password);
  await submitButton.click();
}

/**
 * Fixture mở rộng của Playwright cung cấp sẵn trang Admin hoặc Learner đã xác thực
 */
export const test = base.extend<{
  adminPage: Page;
  learnerPage: Page;
}>({
  adminPage: async ({ page }, use) => {
    await setupAdminApiMocks(page);
    await injectAdminStorageSession(page);
    await page.goto('/vi/admin/dashboard');
    await page.waitForLoadState('domcontentloaded');
    await use(page);
  },
  learnerPage: async ({ page }, use) => {
    await setupLearnerApiMocks(page);
    await injectLearnerStorageSession(page);
    await page.goto('/vi/home');
    await page.waitForLoadState('domcontentloaded');
    await use(page);
  },
});

/**
 * Cài đặt hệ thống mock API cho các dịch vụ AI Companion & Voice Session.
 */
export async function setupCompanionApiMocks(page: Page): Promise<void> {
  // Companion Quota mock (GET and POST)
  await page.route('**/api/v1/companion/quota', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        message: 'OK',
        remainingDailyTurns: MOCK_COMPANION_QUOTA.remainingDailyTurns,
        isPro: MOCK_COMPANION_QUOTA.isPro,
        totalDailyQuota: MOCK_COMPANION_QUOTA.totalDailyQuota,
        data: MOCK_COMPANION_QUOTA,
      }),
    });
  });

  // Companion Chat history mock
  await page.route('**/api/v1/companion/history*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        data: [],
      }),
    });
  });

  // Companion Chat message mock
  await page.route('**/api/v1/companion/chat', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'OK',
          reply: MOCK_COMPANION_CHAT_REPLY.reply,
          suggestedPrompts: MOCK_COMPANION_CHAT_REPLY.suggestedPrompts,
          remainingDailyTurns: MOCK_COMPANION_CHAT_REPLY.remainingDailyTurns,
          data: MOCK_COMPANION_CHAT_REPLY,
        }),
      });
      return;
    }
    await route.fallback();
  });

  // Companion Translate mock
  await page.route('**/api/v1/companion/translate', async (route) => {
    if (route.request().method() === 'POST') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'OK',
          translatedContent: MOCK_COMPANION_TRANSLATION.translatedContent,
          translatedText: MOCK_COMPANION_TRANSLATION.translatedText,
          targetLanguage: MOCK_COMPANION_TRANSLATION.targetLanguage,
          data: MOCK_COMPANION_TRANSLATION,
        }),
      });
      return;
    }
    await route.fallback();
  });

  // Voice Live Session API Key mock
  await page.route('**/api/voice/live-session', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        message: 'OK',
        data: {
          apiKey: 'mock-gemini-live-key',
        },
      }),
    });
  });
}

/**
 * Cài đặt hệ thống mock API cho phân hệ Học Viên (Learner) và AI Companion.
 */
export async function setupLearnerApiMocks(page: Page): Promise<void> {
  // Auth Login mock
  await page.route('**/api/v1/auth/login', async (route) => {
    if (route.request().method() === 'POST') {
      const postData = route.request().postDataJSON() || {};
      if (
        postData.email === LEARNER_CREDENTIALS.email &&
        postData.password === LEARNER_CREDENTIALS.password
      ) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            message: 'Đăng nhập thành công',
            data: {
              token: MOCK_LEARNER_JWT,
              tokenType: 'Bearer',
              expiresIn: 86400,
              user: MOCK_LEARNER_USER,
            },
          }),
        });
        return;
      }

      if (
        postData.email === ADMIN_CREDENTIALS.email &&
        postData.password === ADMIN_CREDENTIALS.password
      ) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            message: 'Đăng nhập thành công',
            data: {
              token: MOCK_ADMIN_JWT,
              tokenType: 'Bearer',
              expiresIn: 86400,
              user: MOCK_ADMIN_USER,
            },
          }),
        });
        return;
      }

      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Tài khoản hoặc mật khẩu không chính xác',
        }),
      });
      return;
    }
    await route.fallback();
  });

  // Auth Me mock
  await page.route('**/api/v1/auth/me', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        message: 'OK',
        data: MOCK_LEARNER_USER,
      }),
    });
  });

  // Posts list & detail
  await page.route('**/api/posts*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_POSTS_DATA),
    });
  });

  // Journeys list
  await page.route('**/api/journeys*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_JOURNEYS_DATA),
    });
  });

  // Vocabularies
  await page.route('**/api/vocabularies*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_VOCAB_DATA),
    });
  });

  // Cài đặt các mock endpoint cho AI Companion & Voice
  await setupCompanionApiMocks(page);
}

/**
 * Tiêm trực tiếp phiên đăng nhập Học viên vào localStorage và sessionStorage trước khi tải trang.
 */
export async function injectLearnerStorageSession(page: Page): Promise<void> {
  await page.addInitScript(
    ({ user, token }) => {
      window.localStorage.setItem('vie_current_user', JSON.stringify(user));
      window.localStorage.setItem('vie_auth_token', token);
      window.localStorage.setItem('vie_user_is_pro', 'true');
      window.sessionStorage.setItem('vie_current_user', JSON.stringify(user));
      window.sessionStorage.setItem('vie_auth_token', token);
      window.sessionStorage.setItem('vie_user_is_pro', 'true');
    },
    { user: MOCK_LEARNER_USER, token: MOCK_LEARNER_JWT }
  );
}

/**
 * Thực hiện đăng nhập học viên qua giao diện form `/vi/login`.
 */
export async function loginAsLearnerViaUI(page: Page): Promise<void> {
  await page.goto('/vi/login');
  await page.waitForLoadState('domcontentloaded');

  const emailInput = page.locator('#email');
  const passwordInput = page.locator('#password');
  const submitButton = page.locator('button[type="submit"].auth-submit-btn');

  await emailInput.fill(LEARNER_CREDENTIALS.email);
  await passwordInput.fill(LEARNER_CREDENTIALS.password);
  await submitButton.click();
}

export { expect } from '@playwright/test';
