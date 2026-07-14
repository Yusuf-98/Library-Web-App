import api from '@/lib/axios';
import type { Book, PaginatedBooks } from '@/types';

export interface BooksParams {
  q?: string;
  categoryId?: number;
  authorId?: number;
  minRating?: number;
  page?: number;
  limit?: number;
}

export const getBooks = (params?: BooksParams) =>
  api.get<PaginatedBooks>('/books', { params }).then((r) => r.data);

export const getBookById = (id: number) =>
  api.get<Book>(`/books/${id}`).then((r) => r.data);

export const getBooksByCategory = (categoryId: number, params?: Omit<BooksParams, 'categoryId'>) =>
  getBooks({ ...params, categoryId });

export interface AdminBooksParams {
  q?: string;
  status?: 'all' | 'available' | 'borrowed' | 'returned';
  page?: number;
  limit?: number;
}

export const getAdminBooks = (params?: AdminBooksParams) =>
  api.get<PaginatedBooks>('/admin/books', { params }).then((r) => r.data);

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

export const updateBook = (id: number, payload: Partial<BookPayload>) =>
  api
    .put<Book>(`/books/${id}`, toBookFormData(payload), { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((r) => r.data);

export const deleteBook = (id: number) => api.delete(`/books/${id}`);
