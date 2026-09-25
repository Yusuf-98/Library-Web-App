import type { AxiosAdapter, InternalAxiosRequestConfig } from 'axios';
import { afterEach, describe, expect, it, vi } from 'vitest';
import api from '@/lib/axios';
import type { PaginatedBooks } from '@/types';
import indexHtml from '../../../index.html?raw';
import { getBooks, HOME_BOOKS_PARAMS } from './books';

const defaultAdapter = api.defaults.adapter;
const adapter = vi.fn();

const page = { books: [{ id: 1 }], pagination: { page: 1 } } as unknown as PaginatedBooks;
const apiPage = { books: [{ id: 2 }], pagination: { page: 1 } } as unknown as PaginatedBooks;

function backendReplies() {
  adapter.mockImplementation(async (config: InternalAxiosRequestConfig) => ({
    data: { success: true, message: 'ok', data: apiPage },
    status: 200,
    statusText: '',
    headers: {},
    config,
  }));
  api.defaults.adapter = adapter as unknown as AxiosAdapter;
}

afterEach(() => {
  api.defaults.adapter = defaultAdapter;
  adapter.mockReset();
  window.__earlyBooks = undefined;
});

describe('getBooks early fetch', () => {
  it('uses the request started by index.html for the home page query, once', async () => {
    backendReplies();
    window.__earlyBooks = Promise.resolve({ success: true, data: page });

    expect(await getBooks({ ...HOME_BOOKS_PARAMS })).toBe(page);
    expect(adapter).not.toHaveBeenCalled();

    expect(await getBooks({ ...HOME_BOOKS_PARAMS })).toBe(apiPage);
    expect(adapter).toHaveBeenCalledTimes(1);
  });

  it('falls back to the API client when the early request fails', async () => {
    backendReplies();
    window.__earlyBooks = Promise.reject(new Error('offline'));

    expect(await getBooks({ ...HOME_BOOKS_PARAMS })).toBe(apiPage);
    expect(adapter).toHaveBeenCalledTimes(1);
  });

  it('falls back to the API client when the early response is an error envelope', async () => {
    backendReplies();
    window.__earlyBooks = Promise.resolve({ success: false, data: page });

    expect(await getBooks({ ...HOME_BOOKS_PARAMS })).toBe(apiPage);
    expect(adapter).toHaveBeenCalledTimes(1);
  });

  it.each([
    ['a search', { q: 'harry', ...HOME_BOOKS_PARAMS }],
    ['another page', { limit: HOME_BOOKS_PARAMS.limit, page: 2 }],
    ['another page size', { limit: 6, page: HOME_BOOKS_PARAMS.page }],
    ['a category', { ...HOME_BOOKS_PARAMS, categoryId: 3 }],
  ])('leaves the early request for the home page alone on %s', async (_label, params) => {
    backendReplies();
    const early = Promise.resolve({ success: true, data: page });
    window.__earlyBooks = early;

    expect(await getBooks(params)).toBe(apiPage);
    expect(window.__earlyBooks).toBe(early);
  });
});

describe('index.html early request', () => {
  it('asks for the same page the home page shows first', () => {
    const { limit, page: firstPage } = HOME_BOOKS_PARAMS;
    expect(indexHtml).toContain(`'/books?limit=${limit}&page=${firstPage}'`);
  });
});
