import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { addReview, deleteReview } from '@/lib/api/reviews';
import { queryKeys } from '@/lib/queryKeys';
import { getErrorMessage } from '@/lib/utils';

// --- Add and edit ---
export function useUpsertReviewMutation(bookId: number | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { star: number; comment: string }) =>
      addReview(bookId!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.my });
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.book(bookId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.books.detail(bookId) });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to submit review. Please try again.'));
    },
  });
}

// --- Delete ---
export function useDeleteReviewMutation(bookId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (reviewId: number) => deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.book(bookId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.books.detail(bookId) });
      toast.success('Review deleted.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to delete review. Please try again.'));
    },
  });
}
