import { AxiosError, type AxiosAdapter, type InternalAxiosRequestConfig } from 'axios';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { store } from '@/app/store';
import { logout, setCredentials } from '@/features/auth/authSlice';
import { ApiError, isNotFoundError } from './apiError';
import api from './axios';

const defaultAdapter = api.defaults.adapter;
let lastConfig: InternalAxiosRequestConfig | undefined;

function respondWith(status: number, data: unknown) {
  api.defaults.adapter = (async (config: InternalAxiosRequestConfig) => {
    lastConfig = config;
    const response = { data, status, statusText: '', headers: {}, config };
    if (status >= 400) {
      throw new AxiosError('Request failed', 'ERR_BAD_REQUEST', config, null, response);
    }
    return response;
  }) as AxiosAdapter;
}

afterEach(() => {
  api.defaults.adapter = defaultAdapter;
  lastConfig = undefined;
  store.dispatch(logout());
});

describe('api client responses', () => {
  it('unwraps the { success, data } envelope', async () => {
    respondWith(200, { success: true, message: 'ok', data: { id: 7 } });
    expect((await api.get('/books/7')).data).toEqual({ id: 7 });
  });

  it('rejects a success:false envelope with its message', async () => {
    respondWith(200, { success: false, message: 'Something is off' });
    await expect(api.get('/x')).rejects.toThrow('Something is off');
  });

  it('turns an error response into an ApiError that keeps the status and message', async () => {
    respondWith(404, { success: false, message: 'Book not found' });

    const error = await api.get('/books/1').catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ message: 'Book not found', status: 404 });
    expect(isNotFoundError(error)).toBe(true);
  });

  it('keeps validation errors as ApiError too, with their own status', async () => {
    respondWith(400, { success: false, message: 'Valid email required, Min 6 chars password' });
    const error = await api.post('/auth/register', {}).catch((e: unknown) => e);
    expect(error).toMatchObject({ message: 'Valid email required, Min 6 chars password', status: 400 });
    expect(isNotFoundError(error)).toBe(false);
  });

  it('passes the original error through when the response has no message', async () => {
    respondWith(500, {});
    const error = await api.get('/x').catch((e: unknown) => e);
    expect(error).toBeInstanceOf(AxiosError);
    expect(error).not.toBeInstanceOf(ApiError);
  });

  it('logs the user out on a 401', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {}); // jsdom cannot navigate
    store.dispatch(
      setCredentials({
        user: { id: 1, name: 'A', email: 'a@b.co', phone: '1', profilePhoto: null, role: 'USER' },
        token: 'jwt',
      })
    );
    respondWith(401, { success: false, message: 'Unauthorized' });

    await api.get('/me').catch(() => {});

    expect(store.getState().auth).toMatchObject({ token: null, user: null });
  });
});

describe('api client requests', () => {
  it('sends the stored token as a Bearer header', async () => {
    store.dispatch(
      setCredentials({
        user: { id: 1, name: 'A', email: 'a@b.co', phone: '1', profilePhoto: null, role: 'USER' },
        token: 'jwt-123',
      })
    );
    respondWith(200, { success: true, message: 'ok', data: {} });

    await api.get('/me');

    expect(lastConfig?.headers.Authorization).toBe('Bearer jwt-123');
  });

  it('sends no Authorization header when logged out', async () => {
    respondWith(200, { success: true, message: 'ok', data: {} });
    await api.get('/books');
    expect(lastConfig?.headers.Authorization).toBeUndefined();
  });
});
