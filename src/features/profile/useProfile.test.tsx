import type { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import authReducer from '@/features/auth/authSlice';
import { getMyProfile, updateMyProfile } from '@/lib/api/users';
import { queryKeys } from '@/lib/queryKeys';
import type { MyProfileResponse, User, UserProfile } from '@/types';
import { useMyProfile, useUpdateProfileMutation } from './useProfile';

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
vi.mock('@/lib/api/users', () => ({ getMyProfile: vi.fn(), updateMyProfile: vi.fn() }));

const me: User = { id: 1, name: 'Old Name', email: 'y@example.com', phone: '0800', profilePhoto: null, role: 'USER' };
const profile: UserProfile = { ...me, createdAt: '2026-01-01T00:00:00.000Z' };

function setup<T>(useHook: () => T) {
  const store = configureStore({ reducer: { auth: authReducer }, preloadedState: { auth: { token: 'jwt', user: me } } });
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  const invalidate = vi.spyOn(queryClient, 'invalidateQueries');
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </Provider>
  );
  const { result } = renderHook(useHook, { wrapper });
  return { result, store, invalidate };
}

describe('useMyProfile', () => {
  it('loads the profile with the loan statistics', async () => {
    const response: MyProfileResponse = {
      profile,
      loanStats: { borrowed: 1, late: 0, returned: 2, total: 3 },
      reviewsCount: 4,
    };
    vi.mocked(getMyProfile).mockResolvedValue(response);
    const { result } = setup(() => useMyProfile());

    await waitFor(() => expect(result.current.data).toEqual(response));
  });
});

describe('useUpdateProfileMutation', () => {
  beforeEach(() => {
    vi.mocked(updateMyProfile).mockReset();
    vi.mocked(toast.error).mockClear();
    vi.mocked(toast.success).mockClear();
  });

  it('sends the new details, keeps the logged-in user in sync, refreshes the profile and confirms', async () => {
    vi.mocked(updateMyProfile).mockResolvedValue({ ...profile, name: 'New Name', phone: '0811', profilePhoto: 'https://x/p.png' });
    const { result, store, invalidate } = setup(() => useUpdateProfileMutation());

    act(() => result.current.mutate({ name: 'New Name', phone: '0811' }));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(updateMyProfile).toHaveBeenCalledWith({ name: 'New Name', phone: '0811' });
    expect(store.getState().auth.user).toMatchObject({ name: 'New Name', phone: '0811', profilePhoto: 'https://x/p.png', email: 'y@example.com' });
    expect(JSON.parse(localStorage.getItem('booky_user') ?? '{}')).toMatchObject({ name: 'New Name' });
    expect(invalidate).toHaveBeenCalledWith({ queryKey: queryKeys.me.all });
    expect(toast.success).toHaveBeenCalledWith('Profile updated successfully.');
  });

  it('leaves the user untouched and shows the message when the update fails', async () => {
    vi.mocked(updateMyProfile).mockRejectedValue(new Error('Phone is invalid'));
    const { result, store } = setup(() => useUpdateProfileMutation());

    act(() => result.current.mutate({ name: 'New Name', phone: 'x' }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Phone is invalid'));
    expect(store.getState().auth.user).toEqual(me);
    expect(toast.success).not.toHaveBeenCalled();
  });
});
