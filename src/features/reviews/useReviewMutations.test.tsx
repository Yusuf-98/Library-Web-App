import type { ReactNode } from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { addReview, deleteReview } from '@/lib/api/reviews';
import { queryKeys } from '@/lib/queryKeys';
import { useDeleteReviewMutation, useUpsertReviewMutation } from './useReviewMutations';

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
vi.mock('@/lib/api/reviews', () => ({ addReview: vi.fn(), deleteReview: vi.fn() }));

function setup<T>(useHook: () => T) {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  const invalidate = vi.spyOn(queryClient, 'invalidateQueries');
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  const { result } = renderHook(useHook, { wrapper });
  const invalidated = () => invalidate.mock.calls.map(([filters]) => filters?.queryKey);
  return { result, invalidated };
}

describe('useUpsertReviewMutation', () => {
  beforeEach(() => {
    vi.mocked(addReview).mockReset();
    vi.mocked(deleteReview).mockReset();
    vi.mocked(toast.error).mockClear();
    vi.mocked(toast.success).mockClear();
  });

  it('posts the review for the book and refreshes my reviews, the book reviews and the book itself', async () => {
    vi.mocked(addReview).mockResolvedValue({ id: 1 } as never);
    const { result, invalidated } = setup(() => useUpsertReviewMutation(9));

    act(() => result.current.mutate({ star: 5, comment: 'Great' }));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(addReview).toHaveBeenCalledWith(9, { star: 5, comment: 'Great' });
    expect(invalidated()).toEqual([queryKeys.reviews.my, queryKeys.reviews.book(9), queryKeys.books.detail(9)]);
  });

  it('shows the server message when the review is rejected', async () => {
    vi.mocked(addReview).mockRejectedValue(new Error('You can only review books you have borrowed and returned'));
    const { result, invalidated } = setup(() => useUpsertReviewMutation(9));

    act(() => result.current.mutate({ star: 4, comment: 'Nice' }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith('You can only review books you have borrowed and returned')
    );
    expect(invalidated()).toEqual([]);
  });

  it('falls back to a generic message when the error has no text', async () => {
    vi.mocked(addReview).mockRejectedValue('boom');
    const { result } = setup(() => useUpsertReviewMutation(9));

    act(() => result.current.mutate({ star: 4, comment: 'Nice' }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Failed to submit review. Please try again.'));
  });
});

describe('useDeleteReviewMutation', () => {
  beforeEach(() => {
    vi.mocked(deleteReview).mockReset();
    vi.mocked(toast.error).mockClear();
    vi.mocked(toast.success).mockClear();
  });

  it('deletes the review by id, refreshes the book and confirms', async () => {
    vi.mocked(deleteReview).mockResolvedValue({} as never);
    const { result, invalidated } = setup(() => useDeleteReviewMutation(9));

    act(() => result.current.mutate(77));

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(deleteReview).toHaveBeenCalledWith(77);
    expect(invalidated()).toEqual([queryKeys.reviews.book(9), queryKeys.books.detail(9)]);
    expect(toast.success).toHaveBeenCalledWith('Review deleted.');
  });

  it('shows the error and does not refresh anything when deleting fails', async () => {
    vi.mocked(deleteReview).mockRejectedValue(new Error('Forbidden'));
    const { result, invalidated } = setup(() => useDeleteReviewMutation(9));

    act(() => result.current.mutate(77));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Forbidden'));
    expect(invalidated()).toEqual([]);
    expect(toast.success).not.toHaveBeenCalled();
  });
});
