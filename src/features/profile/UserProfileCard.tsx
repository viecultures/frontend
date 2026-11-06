import React, { useEffect, useState } from 'react';
import type { ApiResponseData } from '@/types/api.helper';

// Component mẫu tiêu thụ API User Profile theo Type-Safe OpenAPI Contract
export const UserProfileCard: React.FC = () => {
  type Profile = ApiResponseData<'get', '/api/v1/users/profile'>;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/v1/users/profile')
      .then((res) => {
        if (!res.ok) throw new Error('Không thể tải profile');
        return res.json() as Promise<Profile>;
      })
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Đang tải thông tin...</div>;
  if (error) return <div>Lỗi: {error}</div>;
  if (!profile) return <div>Không tìm thấy dữ liệu</div>;

  return (
    <article className="p-4 border rounded shadow-sm">
      <h2 className="text-xl font-bold">{profile.fullName}</h2>
      <p className="text-gray-600">{profile.email}</p>
      <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded">
        {profile.role}
      </span>
    </article>
  );
};
