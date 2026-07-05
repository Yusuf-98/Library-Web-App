import api from '@/lib/axios';
import type { Author, PaginatedBooks } from '@/types';

export const getAuthors = (q?: string) =>
  api.get<{ authors: Author[] }>('/authors', { params: q ? { q } : undefined }).then((r) => r.data.authors);

export const getPopularAuthors = () =>
  api.get<{ authors: Author[] }>('/authors/popular').then((r) => r.data.authors);

export const getBooksByAuthor = (authorId: number, params?: { page?: number; limit?: number }) =>
  api.get<PaginatedBooks>(`/authors/${authorId}/books`, { params }).then((r) => r.data);
