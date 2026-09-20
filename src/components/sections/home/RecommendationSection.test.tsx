import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getBooks } from '@/lib/api/books';
import type { Book, PaginatedBooks } from '@/types';
import RecommendationSection from './RecommendationSection';

vi.mock('@/lib/api/books', () => ({ getBooks: vi.fn() }));

const book = (id: number) =>
  ({
    id,
    title: `Book ${id}`,
    author: { id: 1, name: 'Author' },
    coverImage: `https://example.com/${id}.png`,
    rating: 4,
  }) as Book;

const page = (books: Book[], pageNo: number, totalPages: number): PaginatedBooks => ({
  books,
  pagination: { page: pageNo, limit: 10, total: 3, totalPages },
});

function LocationProbe() {
  return <div data-testid='pathname'>{useLocation().pathname}</div>;
}

function setup() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <RecommendationSection />
        <LocationProbe />
      </MemoryRouter>
    </QueryClientProvider>
  );
  return userEvent.setup();
}

describe('RecommendationSection', () => {
  beforeEach(() => {
    vi.mocked(getBooks).mockReset();
  });

  it('shows ten skeleton cards while the first page loads, then the books', async () => {
    vi.mocked(getBooks).mockResolvedValue(page([book(1), book(2)], 1, 1));
    setup();

    const loading = screen.getByRole('status');
    expect(loading).toHaveTextContent('Loading books');
    expect(loading.querySelectorAll('[aria-hidden="true"]')).toHaveLength(10);

    expect(await screen.findByRole('button', { name: /Book 1/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Book 2/ })).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('opens a book when its card is clicked', async () => {
    vi.mocked(getBooks).mockResolvedValue(page([book(7)], 1, 1));
    const user = setup();
    await user.click(await screen.findByRole('button', { name: /Book 7/ }));
    expect(screen.getByTestId('pathname')).toHaveTextContent('/books/7');
  });

  it('loads the next page with "Load More", and hides the button after the last page', async () => {
    vi.mocked(getBooks)
      .mockResolvedValueOnce(page([book(1), book(2)], 1, 2))
      .mockResolvedValueOnce(page([book(3)], 2, 2));
    const user = setup();

    await user.click(await screen.findByRole('button', { name: 'Load More' }));

    expect(await screen.findByRole('button', { name: /Book 3/ })).toBeInTheDocument();
    expect(getBooks).toHaveBeenLastCalledWith({ limit: 10, page: 2 });
    expect(screen.queryByRole('button', { name: 'Load More' })).not.toBeInTheDocument();
  });

  it('says so when there are no books', async () => {
    vi.mocked(getBooks).mockResolvedValue(page([], 1, 1));
    setup();
    expect(await screen.findByText('No books available.')).toBeInTheDocument();
  });

  it('shows an error message when the request fails', async () => {
    vi.mocked(getBooks).mockRejectedValue(new Error('network'));
    setup();
    expect(await screen.findByText('Failed to load books.')).toBeInTheDocument();
  });
});
