import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import authReducer from '@/features/auth/authSlice';
import uiReducer from '@/features/ui/uiSlice';
import { getBooks } from '@/lib/api/books';
import type { Book, PaginatedBooks } from '@/types';
import SearchOverlay from './SearchOverlay';

vi.mock('@/lib/api/books', () => ({ getBooks: vi.fn() }));

const makeBook = (id: number) =>
  ({
    id,
    title: `Test Book ${id}`,
    author: { id: 1, name: 'Author One' },
    coverImage: `https://example.com/${id}.png`,
    rating: 4,
  }) as Book;

const results = (books: Book[]): PaginatedBooks => ({
  books,
  pagination: { page: 1, limit: 12, total: books.length, totalPages: 1 },
});

function LocationProbe() {
  return <div data-testid='pathname'>{useLocation().pathname}</div>;
}

function renderOverlay(ui: { isSearchOpen: boolean; searchQuery: string }) {
  const store = configureStore({
    reducer: { auth: authReducer, ui: uiReducer },
    preloadedState: { ui: { selectedCategory: '', ...ui } },
  });
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <SearchOverlay />
          <LocationProbe />
        </MemoryRouter>
      </QueryClientProvider>
    </Provider>
  );
  return { store, user: userEvent.setup() };
}

const overlay = () => screen.queryByRole('region', { name: 'Search results' });

describe('SearchOverlay', () => {
  beforeEach(() => {
    vi.mocked(getBooks).mockReset();
    vi.mocked(getBooks).mockResolvedValue(results([makeBook(1), makeBook(2)]));
  });

  it('renders nothing while closed and the query is empty', () => {
    renderOverlay({ isSearchOpen: false, searchQuery: '' });
    expect(overlay()).not.toBeInTheDocument();
    expect(getBooks).not.toHaveBeenCalled();
  });

  it('prompts for a query when opened with nothing typed, and focuses its input', () => {
    renderOverlay({ isSearchOpen: true, searchQuery: '' });
    expect(screen.getByText('Type to search for books')).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Search book' })).toHaveFocus();
    expect(getBooks).not.toHaveBeenCalled();
  });

  it('searches with the query, lists the results and locks page scroll', async () => {
    renderOverlay({ isSearchOpen: false, searchQuery: 'test' });

    expect(await screen.findByRole('button', { name: /Test Book 1/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Test Book 2/ })).toBeInTheDocument();
    expect(getBooks).toHaveBeenCalledWith({ q: 'test' });
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('says when nothing matches', async () => {
    vi.mocked(getBooks).mockResolvedValue(results([]));
    renderOverlay({ isSearchOpen: false, searchQuery: 'zzz' });
    expect(await screen.findByText('No books found for "zzz"')).toBeInTheDocument();
  });

  it('shows an error message when the request fails', async () => {
    vi.mocked(getBooks).mockRejectedValue(new Error('network'));
    renderOverlay({ isSearchOpen: false, searchQuery: 'test' });
    expect(await screen.findByText('Failed to search books. Please try again.')).toBeInTheDocument();
  });

  it('closes on Escape, clearing the query and restoring scroll', async () => {
    const { store, user } = renderOverlay({ isSearchOpen: true, searchQuery: 'test' });
    await screen.findByRole('button', { name: /Test Book 1/ });

    await user.keyboard('{Escape}');

    expect(overlay()).not.toBeInTheDocument();
    expect(store.getState().ui).toMatchObject({ isSearchOpen: false, searchQuery: '' });
    expect(document.body.style.overflow).toBe('');
  });

  it('closes the overlay when a result is opened, so the book page is visible', async () => {
    const { store, user } = renderOverlay({ isSearchOpen: false, searchQuery: 'test' });

    await user.click(await screen.findByRole('button', { name: /Test Book 2/ }));

    expect(screen.getByTestId('pathname')).toHaveTextContent('/books/2');
    expect(overlay()).not.toBeInTheDocument();
    expect(store.getState().ui.searchQuery).toBe('');
  });

  it('has a close button that dismisses the overlay', async () => {
    const { store, user } = renderOverlay({ isSearchOpen: true, searchQuery: '' });
    await user.click(screen.getByRole('button', { name: 'Close search' }));
    expect(store.getState().ui.isSearchOpen).toBe(false);
    expect(overlay()).not.toBeInTheDocument();
  });
});
