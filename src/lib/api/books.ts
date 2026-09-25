import api from '@/lib/axios';
import type { Book, PaginatedBooks } from '@/types';

// --- Early fetch ---
export const HOME_BOOKS_PARAMS = { limit: 10, page: 1 } as const;

const isHomeRequest = (params?: BooksParams) =>
  params?.limit === HOME_BOOKS_PARAMS.limit &&
  params.page === HOME_BOOKS_PARAMS.page &&
  Object.keys(params).length === Object.keys(HOME_BOOKS_PARAMS).length;

function takeEarlyBooks() {
  const early = window.__earlyBooks;
  window.__earlyBooks = undefined;
  return early;
}

// --- Public ---
export interface BooksParams {
  q?: string;
  categoryId?: number;
  authorId?: number;
  minRating?: number;
  page?: number;
  limit?: number;
}

const fetchBooks = (params?: BooksParams) =>
  api.get<PaginatedBooks>('/books', { params }).then((r) => r.data);

export const getBooks = (params?: BooksParams) => {
  const early = isHomeRequest(params) ? takeEarlyBooks() : undefined;
  if (!early) return fetchBooks(params);

  return early
    .then((envelope) => {
      if (!envelope.success) throw new Error('Early request failed');
      return envelope.data;
    })
    .catch(() => fetchBooks(params));
};

export const getBookById = (id: number) =>
  api.get<Book>(`/books/${id}`).then((r) => r.data);

export const getBooksByCategory = (categoryId: number, params?: Omit<BooksParams, 'categoryId'>) =>
  getBooks({ ...params, categoryId });

// --- Admin ---
export interface AdminBooksParams {
  q?: string;
  status?: 'all' | 'available' | 'borrowed' | 'returned';
  page?: number;
  limit?: number;
}

export const getAdminBooks = (params?: AdminBooksParams) =>
  api.get<PaginatedBooks>('/admin/books', { params }).then((r) => r.data);

// --- Create and update ---
export interface BookPayload {
  title: string;
  isbn: string;
  categoryId: number;
  authorId?: number;
  authorName?: string;
  description?: string;
  publishedYear?: number;
  totalCopies?: number;
  availableCopies?: number;
  coverImage?: File;
}

function toBookFormData(payload: Partial<BookPayload>) {
  const form = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    form.append(key, value instanceof File ? value : String(value));
  });
  return form;
}

export const createBook = (payload: BookPayload) =>
  api
    .post<Book>('/books', toBookFormData(payload), { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((r) => r.data);

export const updateBook = (id: number, payload: Partial<BookPayload>) => {
  if (payload.coverImage instanceof File) {
    return api
      .put<Book>(`/books/${id}`, toBookFormData(payload), { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data);
  }
  return api.put<Book>(`/books/${id}`, payload).then((r) => r.data);
};

export const deleteBook = (id: number) => api.delete(`/books/${id}`);
