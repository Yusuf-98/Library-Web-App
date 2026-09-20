import api from '@/lib/axios';
import type { Author, AuthorBooksResponse } from '@/types';

export const getPopularAuthors = () =>
  api.get<{ authors: Author[] }>('/authors/popular').then((r) => r.data.authors);

export const getBooksByAuthor = (authorId: number, params?: { page?: number; limit?: number }) =>
  api.get<AuthorBooksResponse>(`/authors/${authorId}/books`, { params }).then((r) => r.data);
