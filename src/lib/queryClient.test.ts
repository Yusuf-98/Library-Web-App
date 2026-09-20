import { describe, expect, it } from 'vitest';
import { ApiError } from './apiError';
import { shouldRetry } from './queryClient';

describe('shouldRetry', () => {
  it('retries a network error once', () => {
    expect(shouldRetry(0, new Error('Network Error'))).toBe(true);
    expect(shouldRetry(1, new Error('Network Error'))).toBe(false);
  });

  it('retries a server error once', () => {
    expect(shouldRetry(0, new ApiError('boom', 500))).toBe(true);
    expect(shouldRetry(1, new ApiError('boom', 500))).toBe(false);
  });

  it.each([400, 401, 403, 404, 422])('never retries a %i, it will not change', (status) => {
    expect(shouldRetry(0, new ApiError('client error', status))).toBe(false);
  });

  it('still retries when rate limited (429)', () => {
    expect(shouldRetry(0, new ApiError('slow down', 429))).toBe(true);
  });
});
