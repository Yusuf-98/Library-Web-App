import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getBooksByAuthor } from '@/lib/api/authors';
import { ApiError } from '@/lib/apiError';
import { shouldRetry } from '@/lib/queryClient';
import type { AuthorBooksResponse, Book } from '@/types';
import BookByAuthorPage from './BookByAuthorPage';

vi.mock('@/lib/api/authors', () => ({ getBooksByAuthor: vi.fn() }));

const book = {
  id: 5,
  title: 'Clean Code',
  author: { id: 19, name: 'Zayn Mifta' },
  coverImage: 'https://example.com/5.png',
  rating: 4.8,
} as Book;

function renderAt(path: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: shouldRetry, retryDelay: 0 } },
  });
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path='/author/:id' element={<BookByAuthorPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('BookByAuthorPage', () => {
  beforeEach(() => {
    vi.mocked(getBooksByAuthor).mockReset();
  });

  it('shows the author and the total book count from the API, not the size of the page', async () => {
    vi.mocked(getBooksByAuthor).mockResolvedValue({
      author: { id: 19, name: 'Zayn Mifta' },
      bookCount: 10,
      books: [book],
      pagination: { page: 1, limit: 12, total: 10, totalPages: 1 },
    } satisfies AuthorBooksResponse);
    renderAt('/author/19');

    expect(await screen.findByText('10 books')).toBeInTheDocument();
    expect(screen.getAllByText('Zayn Mifta').length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /Clean Code/ })).toBeInTheDocument();
  });

  it('says the author was not found on a 404, without retrying', async () => {
    vi.mocked(getBooksByAuthor).mockRejectedValue(new ApiError('Author not found', 404));
    renderAt('/author/99999');

    expect(await screen.findByText('Author not found.')).toBeInTheDocument();
    expect(screen.queryByText('Failed to load books.')).not.toBeInTheDocument();
    expect(screen.queryByText('No books found for this author.')).not.toBeInTheDocument();
    expect(getBooksByAuthor).toHaveBeenCalledTimes(1);
  });

  it('treats a non-numeric id as not found without calling the API', () => {
    renderAt('/author/abc');

    expect(screen.getByText('Author not found.')).toBeInTheDocument();
    expect(getBooksByAuthor).not.toHaveBeenCalled();
  });

  it('keeps the generic message for other failures', async () => {
    vi.mocked(getBooksByAuthor).mockRejectedValue(new ApiError('Internal error', 500));
    renderAt('/author/19');

    expect(await screen.findByText('Failed to load books.')).toBeInTheDocument();
    expect(screen.queryByText('Author not found.')).not.toBeInTheDocument();
  });

  it('shows the empty state for a real author with no books', async () => {
    vi.mocked(getBooksByAuthor).mockResolvedValue({
      author: { id: 19, name: 'Zayn Mifta' },
      bookCount: 0,
      books: [],
      pagination: { page: 1, limit: 12, total: 0, totalPages: 0 },
    });
    renderAt('/author/19');

    expect(await screen.findByText('No books found for this author.')).toBeInTheDocument();
    expect(screen.queryByText('Author not found.')).not.toBeInTheDocument();
  });
});
