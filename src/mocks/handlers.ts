import { http, HttpResponse } from 'msw';
import type { ApiResponseData, RequestBody, ApiSchemas } from '@/types/api.helper';

// Dữ liệu mock User Profile chuẩn Type
export const mockUserProfile: ApiSchemas['UserProfileResponse'] = {
  id: 'usr-vieculture-001',
  fullName: 'Thien Luan (Designer Demo)',
  email: 'designer@viecultures.com',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
  role: 'ROLE_ADMIN',
  createdAt: '2026-01-01T00:00:00Z',
};

// Dữ liệu mock Admin Overview Stats
export const mockAdminOverview = {
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

// Dữ liệu mock Danh sách người dùng Admin
export const mockAdminUsers = {
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

export const handlers = [
  // 1. Auth & Current User
  http.get('*/api/v1/auth/me', () => {
    return HttpResponse.json({
      success: true,
      message: 'OK',
      data: {
        id: mockUserProfile.id,
        email: mockUserProfile.email,
        name: mockUserProfile.fullName,
        avatarUrl: mockUserProfile.avatarUrl,
        role: mockUserProfile.role,
        authProvider: 'LOCAL',
        englishLevel: 'B2',
        createdAt: mockUserProfile.createdAt,
      },
    });
  }),

  http.post('*/api/v1/auth/login', async ({ request }) => {
    const body = (await request.json().catch(() => ({}))) as Partial<RequestBody<'post', '/api/v1/auth/login'>>;
    const responseData: ApiResponseData<'post', '/api/v1/auth/login'> = {
      token: 'mock-jwt-token-abcdef123456',
      tokenType: 'Bearer',
      expiresIn: 86400,
      user: {
        ...mockUserProfile,
        email: body.email || mockUserProfile.email,
      },
    };
    return HttpResponse.json(responseData, { status: 200 });
  }),

  // 2. User Profile API
  http.get('*/api/v1/users/profile', () => {
    const responseData: ApiResponseData<'get', '/api/v1/users/profile'> = mockUserProfile;
    return HttpResponse.json(responseData, { status: 200 });
  }),

  http.put('*/api/v1/users/profile', async ({ request }) => {
    const body = (await request.json()) as RequestBody<'put', '/api/v1/users/profile'>;
    const updated: ApiResponseData<'put', '/api/v1/users/profile'> = {
      ...mockUserProfile,
      fullName: body.fullName,
      avatarUrl: body.avatarUrl ?? mockUserProfile.avatarUrl,
    };
    return HttpResponse.json(updated, { status: 200 });
  }),

  // 3. Admin Overview & Users (Để Designer xem trọn vẹn trang Admin)
  http.get('*/api/v1/admin/overview', () => {
    return HttpResponse.json(mockAdminOverview, { status: 200 });
  }),

  http.get('*/api/v1/admin/users', () => {
    return HttpResponse.json(mockAdminUsers, { status: 200 });
  }),
];
