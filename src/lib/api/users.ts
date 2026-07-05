import api from '@/lib/axios';
import type { MyProfileResponse, UserProfile } from '@/types';

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  profilePhoto?: string | File;
}

export const getMyProfile = () => api.get<MyProfileResponse>('/me').then((r) => r.data);

export interface AdminUsersParams {
  q?: string;
  page?: number;
  limit?: number;
}

export const getAdminUsers = (params?: AdminUsersParams) =>
  api
    .get<{ users: UserProfile[]; pagination: { page: number; limit: number; total: number; totalPages: number } }>(
      '/admin/users',
      { params },
    )
    .then((r) => r.data);

export const updateMyProfile = (payload: UpdateProfilePayload) => {
  if (payload.profilePhoto instanceof File) {
    const form = new FormData();
    if (payload.name) form.append('name', payload.name);
    if (payload.phone) form.append('phone', payload.phone);
    form.append('profilePhoto', payload.profilePhoto);
    return api
      .patch<{ profile: UserProfile }>('/me', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data.profile);
  }
  return api.patch<{ profile: UserProfile }>('/me', payload).then((r) => r.data.profile);
};
