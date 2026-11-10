import { test, expect, LEARNER_CREDENTIALS, setupLearnerApiMocks } from './fixtures/auth';

test.describe('Learner & AI Companion E2E Flow', () => {
  test('Hành trình hoàn chỉnh của học viên: Đăng nhập -> AI Companion -> Dịch thuật tin nhắn -> AI Workspace', async ({
    page,
  }) => {
    // Cài đặt toàn bộ mock API cho phân hệ học viên, AI Companion và Voice Session
    await setupLearnerApiMocks(page);

    // =========================================================================
    // Bước 1: Học viên đăng nhập tại /vi/login, kiểm tra chuyển hướng vào /vi/home
    // =========================================================================
    await page.goto('/vi/login');
    await page.waitForLoadState('domcontentloaded');

    const emailInput = page.locator('#email');
    const passwordInput = page.locator('#password');
    const submitBtn = page.locator('button[type="submit"].auth-submit-btn');

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitBtn).toBeVisible();

    await emailInput.fill(LEARNER_CREDENTIALS.email);
    await passwordInput.fill(LEARNER_CREDENTIALS.password);
    await submitBtn.click();

    // Xác nhận điều hướng thành công về trang chủ học viên /vi/home
    await expect(page).toHaveURL(/\/vi\/home/);

    // =========================================================================
    // Bước 2: Mở Chatbot nổi (CompanionFloatingButton) và kiểm tra CompanionChatDrawer
    // =========================================================================
    const floatingBtn = page
      .locator(
        'button[aria-label*="Trợ lý"], button[aria-label*="Companion"], button.group.fixed.bottom-6.right-6'
      )
      .first();
    await expect(floatingBtn).toBeVisible({ timeout: 15000 });
    await floatingBtn.click();

    const chatDrawer = page.locator('div[role="dialog"]').first();
    await expect(chatDrawer).toBeVisible({ timeout: 10000 });

    // Kiểm tra câu chào ban đầu từ Mascot / Assistant
    const initialGreeting = chatDrawer.getByText(/Xin chào! Tôi là Trợ lý VieCultures/i);
    await expect(initialGreeting).toBeVisible({ timeout: 10000 });

    // =========================================================================
    // Bước 3: Gửi tin nhắn "Kể cho tôi nghe về phở Hà Nội" và nhận câu trả lời AI
    // =========================================================================
    const chatInput = chatDrawer.locator('textarea');
    await expect(chatInput).toBeVisible();
    await chatInput.fill('Kể cho tôi nghe về phở Hà Nội');

    const sendBtn = chatDrawer
      .locator(
        'button[aria-label="Gửi tin nhắn"], button[type="button"]:has(svg.lucide-send-horizontal)'
      )
      .first();
    await expect(sendBtn).toBeEnabled();
    await sendBtn.click();

    // Kiểm tra bong bóng tin nhắn của học viên
    const userMessage = chatDrawer
      .locator('.vc-msg-in')
      .filter({ hasText: 'Kể cho tôi nghe về phở Hà Nội' });
    await expect(userMessage).toBeVisible({ timeout: 10000 });

    // Kiểm tra câu trả lời từ AI Companion xuất hiện
    const aiMessage = chatDrawer
      .locator('.vc-msg-in')
      .filter({ hasText: 'Phở là món ăn truyền thống nổi tiếng của Việt Nam' })
      .first();
    await expect(aiMessage).toBeVisible({ timeout: 15000 });

    // =========================================================================
    // Bước 4: Thao tác dịch thuật tin nhắn AI sang tiếng Anh
    // =========================================================================
    await aiMessage.hover();

    const translateBtn = aiMessage
      .locator(
        'button:has-text("Dịch sang EN"), button[title*="Dịch"], button:has(svg.lucide-languages)'
      )
      .first();
    await expect(translateBtn).toBeVisible();
    await translateBtn.click();

    // Kiểm tra khối dịch thuật tiếng Anh xuất hiện
    const translatedContent = aiMessage.getByText(
      'Pho is a famous traditional Vietnamese dish with broth simmered from beef bones and herbs.'
    );
    await expect(translatedContent).toBeVisible({ timeout: 10000 });

    // =========================================================================
    // Bước 5: Điều hướng sang trang AI Workspace (/vi/ai-workspace)
    // =========================================================================
    const expandBtn = chatDrawer
      .locator(
        'button[aria-label="Mở rộng ra Không gian AI"], button[title="Mở rộng ra Không gian AI"], button:has(svg.lucide-maximize-2)'
      )
      .first();
    await expect(expandBtn).toBeVisible();
    await expandBtn.click();

    await expect(page).toHaveURL(/\/vi\/ai-workspace/);
    await page.waitForLoadState('domcontentloaded');

    // =========================================================================
    // Bước 6: Kiểm tra các thành phần giao diện trên trang AI Workspace
    // =========================================================================
    // 1. Tiêu đề Mascot AI
    const pageHeaderTitle = page.locator('.ai-workspace-page-header .ai-workspace-page-title');
    await expect(pageHeaderTitle).toBeVisible({ timeout: 15000 });
    await expect(pageHeaderTitle.locator('h2')).toHaveText(/Trợ lý Văn hóa/i);

    // 2. Bản đồ / Khung tương tác Map AI
    const mapWorkspace = page.locator('.map-panel, .map-ai-app, .console-panel').first();
    await expect(mapWorkspace).toBeVisible({ timeout: 15000 });

    // 3. Thanh điều khiển ControlTray
    const controlTray = page.locator('section.control-tray');
    await expect(controlTray).toBeVisible({ timeout: 15000 });

    // 4. Nút Micro (Voice toggle)
    const micButton = controlTray.locator('.action-button.mic-button');
    await expect(micButton).toBeVisible();

    // 5. Nút điều chỉnh tốc độ nói AI (AI speaking pace)
    const paceButton = controlTray.locator('.action-button.ai-speaking-pace-button');
    await expect(paceButton).toBeVisible();

    // 6. Ô nhập liệu tương tác prompt (Mở bằng nút bàn phím nếu đang ở chế độ co gọn)
    const keyboardToggleBtn = controlTray.locator('.action-button.keyboard-toggle-button');
    if (await keyboardToggleBtn.isVisible()) {
      const isInputVisible = await controlTray.locator('textarea.prompt-input').isVisible();
      if (!isInputVisible) {
        await keyboardToggleBtn.click();
      }
    }
    const promptInput = controlTray.locator('textarea.prompt-input');
    await expect(promptInput).toBeVisible();
  });

  test('Xác thực khởi tạo phiên học viên với fixture learnerPage và mở AI Companion', async ({
    learnerPage,
  }) => {
    const page = learnerPage;

    // Kiểm tra trang chủ học viên đã tải với URL /vi/home
    await expect(page).toHaveURL(/\/vi\/home/);

    // Nút Chatbot nổi phải hiển thị sẵn sàng
    const floatingBtn = page
      .locator(
        'button[aria-label*="Trợ lý"], button[aria-label*="Companion"], button.group.fixed.bottom-6.right-6'
      )
      .first();
    await expect(floatingBtn).toBeVisible({ timeout: 15000 });
    await floatingBtn.click();

    // Drawer trò chuyện mở ra và hiển thị tiêu đề và trạng thái Pro
    const chatDrawer = page.locator('div[role="dialog"]').first();
    await expect(chatDrawer).toBeVisible({ timeout: 10000 });
    await expect(chatDrawer.getByText(/Trợ lý Văn hóa/i).first()).toBeVisible();

    // Trực tiếp mở Không gian AI từ nút mở rộng
    const expandBtn = chatDrawer
      .locator(
        'button[aria-label="Mở rộng ra Không gian AI"], button[title="Mở rộng ra Không gian AI"], button:has(svg.lucide-maximize-2)'
      )
      .first();
    await expect(expandBtn).toBeVisible();
    await expandBtn.click();

    await expect(page).toHaveURL(/\/vi\/ai-workspace/);
    await expect(page.locator('section.control-tray')).toBeVisible({ timeout: 15000 });
  });
});
