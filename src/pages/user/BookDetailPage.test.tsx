import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import authReducer from '@/features/auth/authSlice';
import { getBookById } from '@/lib/api/books';
import { ApiError } from '@/lib/apiError';
import { shouldRetry } from '@/lib/queryClient';
import BookDetailPage from './BookDetailPage';

vi.mock('@/lib/api/books', () => ({ getBookById: vi.fn() }));
vi.mock('@/lib/api/cart', () => ({ getCart: vi.fn() }));

function renderAt(path: string) {
  const store = configureStore({ reducer: { auth: authReducer } });
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: shouldRetry, retryDelay: 0 } },
  });
  render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[path]}>
          <Routes>
            <Route path='/books/:id' element={<BookDetailPage />} />
            <Route path='/' element={<p>home page</p>} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    </Provider>
  );
  return userEvent.setup();
}

describe('BookDetailPage error states', () => {
  beforeEach(() => {
    vi.mocked(getBookById).mockReset();
  });

  it('says the book was not found on a 404, without retrying', async () => {
    vi.mocked(getBookById).mockRejectedValue(new ApiError('Book not found', 404));
    renderAt('/books/1');

    expect(await screen.findByText('Book not found. It may have been removed.')).toBeInTheDocument();
    expect(screen.queryByText('Failed to load book.')).not.toBeInTheDocument();
    expect(getBookById).toHaveBeenCalledTimes(1);
  });

  it('offers a way back home from the not-found state', async () => {
    vi.mocked(getBookById).mockRejectedValue(new ApiError('Book not found', 404));
    const user = renderAt('/books/1');

    await user.click(await screen.findByRole('button', { name: 'Back to Home' }));

    expect(screen.getByText('home page')).toBeInTheDocument();
  });

  it('treats a non-numeric id as not found without calling the API', () => {
    renderAt('/books/abc');

    expect(screen.getByText('Book not found. It may have been removed.')).toBeInTheDocument();
    expect(getBookById).not.toHaveBeenCalled();
  });

  it('keeps the generic message for other failures, retrying a server error once', async () => {
    vi.mocked(getBookById).mockRejectedValue(new ApiError('Internal error', 500));
    renderAt('/books/1');

    expect(await screen.findByText('Failed to load book.')).toBeInTheDocument();
    expect(screen.queryByText(/Book not found/)).not.toBeInTheDocument();
    await waitFor(() => expect(getBookById).toHaveBeenCalledTimes(2));
  });
});
