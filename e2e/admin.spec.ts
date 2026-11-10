import { test, expect, ADMIN_CREDENTIALS, setupAdminApiMocks } from './fixtures/auth';

test.describe('Admin Flow E2E Tests', () => {
  test.describe('Kịch bản 1: Admin Authentication & RBAC Guard', () => {
    test('Chưa đăng nhập khi truy cập /vi/admin phải bị chặn và chuyển hướng về trang /vi/login', async ({
      page,
    }) => {
      await setupAdminApiMocks(page);

      // Truy cập trực tiếp trang quản trị khi chưa có phiên đăng nhập
      await page.goto('/vi/admin');

      // Route guard (RequireRole) phải redirect về /vi/login kèm query redirect
      await expect(page).toHaveURL(/\/vi\/login\?redirect=%2Fvi%2Fadmin/);

      // Form đăng nhập phải hiển thị sẵn sàng
      await expect(page.locator('#email')).toBeVisible();
      await expect(page.locator('#password')).toBeVisible();
      await expect(page.locator('button[type="submit"].auth-submit-btn')).toBeVisible();
    });

    test('Đăng nhập thành công với tài khoản Admin và chuyển hướng hợp lệ đến trang Admin', async ({
      page,
    }) => {
      await setupAdminApiMocks(page);

      // Đi tới trang đăng nhập với tham số redirect về trang quản trị
      await page.goto('/vi/login?redirect=%2Fvi%2Fadmin');
      await page.waitForLoadState('domcontentloaded');

      // Điền thông tin tài khoản Admin do người dùng cung cấp
      await page.locator('#email').fill(ADMIN_CREDENTIALS.email);
      await page.locator('#password').fill(ADMIN_CREDENTIALS.password);

      // Bấm nút đăng nhập
      await page.locator('button[type="submit"].auth-submit-btn').click();

      // Kỳ vọng chuyển hướng thành công đến phân hệ Admin
      await expect(page).toHaveURL(/\/vi\/admin(\/dashboard)?/);

      // Thanh điều hướng phân hệ quản trị chính phải hiển thị
      const adminNav = page.locator('div[role="navigation"][aria-label="Thanh điều hướng quản trị phân hệ"]');
      await expect(adminNav).toBeVisible();
    });
  });

  test.describe('Kịch bản 2: Admin Navigation & Tabs', () => {
    test('Điều hướng mượt mà giữa các tab quản trị (posts, content, users, vocabularies, logs, dashboard)', async ({
      adminPage,
    }) => {
      const page = adminPage;

      // 1. Tab Mặc định: Dashboard / Tổng quan
      await expect(page).toHaveURL(/\/vi\/admin\/dashboard/);
      const sidebar = page.locator('div[role="navigation"][aria-label="Thanh điều hướng quản trị phân hệ"]');
      await expect(sidebar).toBeVisible();

      // 2. Mở menu accordion "Quản lý nội dung"
      const contentMenuBtn = sidebar.locator('button[title="Quản lý nội dung"]');
      await contentMenuBtn.click();
      await expect(page).toHaveURL(/\/vi\/admin\/content\?tab=posts/);

      // 3. Tab Kho bài viết (posts)
      const postsSubBtn = page.locator('button:has-text("Kho Bài viết")');
      await expect(postsSubBtn).toBeVisible();
      await postsSubBtn.click();
      await expect(page).toHaveURL(/tab=posts/);
      await expect(page.getByText('The Soul of Hanoi: Phở Bò Heritage').first()).toBeVisible();

      // 4. Tab Lộ trình học (journeys)
      const journeysSubBtn = page.locator('button:has-text("Lộ trình học")');
      await journeysSubBtn.click();
      await expect(page).toHaveURL(/tab=journeys/);

      // 5. Tab Từ vựng & Thuật ngữ (vocabularies)
      const vocabSubBtn = page.locator('button:has-text("Từ vựng & Thuật ngữ")');
      await vocabSubBtn.click();
      await expect(page).toHaveURL(/tab=vocabularies/);

      // 6. Tab Học viên CRM (users)
      const usersBtn = sidebar.locator('button[title="Học viên CRM"]');
      await usersBtn.click();
      await expect(page).toHaveURL(/\/vi\/admin\/users/);
      await expect(page.getByRole('heading', { name: 'Quản trị học viên & Phân quyền' })).toBeVisible();
      await expect(page.getByText('an.nguyen@example.com')).toBeVisible();

      // 7. Tab Nhật ký & Lịch sử (logs/history)
      const historyBtn = sidebar.locator('button[title="Nhật ký & Lịch sử"]');
      await historyBtn.click();
      await expect(page).toHaveURL(/\/vi\/admin\/history/);
      await expect(page.getByText('Nhật ký')).toBeVisible();

      // 8. Quay lại Dashboard (Tổng quan)
      const dashboardBtn = sidebar.getByRole('button', { name: 'Tổng quan' });
      await dashboardBtn.click();
      await expect(page).toHaveURL(/\/vi\/admin\/dashboard/);
    });
  });

  test.describe('Kịch bản 3: Admin Post Editor & Content Interaction', () => {
    test('Mở trang biên tập bài viết mới và kiểm tra giao diện soạn thảo', async ({
      adminPage,
    }) => {
      const page = adminPage;

      // Đến tab quản lý bài viết
      await page.goto('/vi/admin/content?tab=posts');
      await page.waitForLoadState('domcontentloaded');

      // Tìm nút "Thêm bài viết mới"
      const newPostBtn = page.locator('button:has-text("Thêm bài viết mới")');
      await expect(newPostBtn).toBeVisible();
      await newPostBtn.click();

      // Kỳ vọng điều hướng đến trang tạo bài viết mới
      await expect(page).toHaveURL(/\/vi\/admin\/posts\/new/);

      // Kiểm tra tiêu đề trang Studio tạo bài đọc mới
      await expect(page.getByRole('heading', { name: 'Tạo bài đọc mới (Studio)' })).toBeVisible();

      // Kiểm tra ô nhập tiêu đề tiếng Anh
      const titleEnInput = page.getByPlaceholder('e.g. The Ancient Colors of Bat Trang Pottery');
      await expect(titleEnInput).toBeVisible();

      // Kiểm tra ô nhập tiêu đề tiếng Việt
      const titleViInput = page.getByPlaceholder('e.g. Sắc màu cổ kính của gốm Bát Tràng');
      await expect(titleViInput).toBeVisible();

      // Nút quay lại danh sách bài đọc trong Studio Header
      const backBtn = page.getByRole('button', { name: 'Quản lý bài đọc' });
      await expect(backBtn).toBeVisible();
      await backBtn.click();

      // Đã quay về trang danh sách bài viết
      await expect(page).toHaveURL(/\/vi\/admin\/content\?tab=posts/);
    });

    test('Mở modal xem trước bài đọc (Preview Content) và đóng thành công', async ({
      adminPage,
    }) => {
      const page = adminPage;

      // Vào tab quản lý bài viết
      await page.goto('/vi/admin/content?tab=posts');
      await page.waitForLoadState('domcontentloaded');

      // Đảm bảo bài viết hiển thị trong danh sách
      const postTitle = page.getByText('The Soul of Hanoi: Phở Bò Heritage').first();
      await expect(postTitle).toBeVisible();

      // Bấm nút xem trước gắn liền với dòng bài viết (icon con mắt)
      const postRow = page.locator('tr, div').filter({ hasText: 'The Soul of Hanoi: Phở Bò Heritage' }).first();
      const previewBtn = postRow.locator('button[title="Xem bài"], button[title="Xem trước"], button:has(svg.lucide-eye)').first();
      await expect(previewBtn).toBeVisible();
      await previewBtn.click();

      // Kiểm tra modal xem trước hiển thị
      const modalTitle = page.getByText('Xem trước bài đọc');
      await expect(modalTitle).toBeVisible();
      await expect(page.locator('[role="dialog"]').getByText('The Soul of Hanoi: Phở Bò Heritage')).toBeVisible();

      // Bấm nút đóng modal xem trước
      const closeBtn = page.locator('button[aria-label="Đóng xem trước"]');
      await expect(closeBtn).toBeVisible();
      await closeBtn.click();

      // Modal xem trước đã được đóng
      await expect(modalTitle).not.toBeVisible();
    });
  });
});
