import { describe, expect, it } from 'vitest';
import { ApiError, isNotFoundError } from './apiError';

describe('ApiError', () => {
  it('is an Error that carries the backend message and the HTTP status', () => {
    const error = new ApiError('Book not found', 404);
    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ApiError);
    expect(error.message).toBe('Book not found');
    expect(error.status).toBe(404);
    expect(error.name).toBe('ApiError');
  });
});

describe('isNotFoundError', () => {
  it('is true only for an ApiError with status 404', () => {
    expect(isNotFoundError(new ApiError('Book not found', 404))).toBe(true);
  });

  it.each([400, 401, 403, 500])('is false for status %i', (status) => {
    expect(isNotFoundError(new ApiError('nope', status))).toBe(false);
  });

  it('is false for plain errors and non-errors', () => {
    expect(isNotFoundError(new Error('Book not found'))).toBe(false);
    expect(isNotFoundError('404')).toBe(false);
    expect(isNotFoundError(undefined)).toBe(false);
  });
});
