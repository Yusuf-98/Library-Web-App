import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import type {
  Book,
  CartItem,
  CartResponse,
  CheckoutResponse,
  FromCartResponse,
} from '@/types';
import { borrowFromCart } from '@/lib/api/cart';
import { queryKeys } from '@/lib/queryKeys';
import { getErrorMessage } from '@/lib/utils';

interface BorrowVariables {
  days: 3 | 5 | 10;
  borrowDate: string;
}

interface BorrowMutationContext {
  previousCartQueries: [readonly unknown[], unknown][];
  previousBookQueries: (readonly [readonly unknown[], Book | undefined])[];
}

function computeReturnDate(borrowDate: string, days: number) {
  const d = new Date(borrowDate);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function useBorrowMutation(items: CartItem[]) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const itemIds = items.map((i) => i.id);

  return useMutation<
    FromCartResponse,
    unknown,
    BorrowVariables,
    BorrowMutationContext
  >({
    mutationFn: ({ days, borrowDate }) =>
      borrowFromCart(itemIds, days, borrowDate),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.all });
      await Promise.all(
        items.map((item) =>
          queryClient.cancelQueries({
            queryKey: queryKeys.books.detail(item.bookId),
          })
        )
      );

      const previousCartQueries = queryClient.getQueriesData<
        CartResponse | CheckoutResponse
      >({ queryKey: queryKeys.cart.all });
      const previousBookQueries = items.map(
        (item) =>
          [
            queryKeys.books.detail(item.bookId),
            queryClient.getQueryData<Book>(queryKeys.books.detail(item.bookId)),
          ] as const
      );

      queryClient.setQueriesData<CartResponse | CheckoutResponse>(
        { queryKey: queryKeys.cart.all },
        (old) => {
          if (!old) return old;
          const remaining = old.items.filter((i) => !itemIds.includes(i.id));
          return { ...old, items: remaining, itemCount: remaining.length };
        }
      );

      items.forEach((item) => {
        queryClient.setQueryData<Book>(
          queryKeys.books.detail(item.bookId),
          (old) =>
            old
              ? {
                  ...old,
                  availableCopies: Math.max(0, old.availableCopies - 1),
                }
              : old
        );
      });

      return { previousCartQueries, previousBookQueries };
    },
    onError: (error, _vars, context) => {
      context?.previousCartQueries.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      context?.previousBookQueries.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      toast.error(
        getErrorMessage(error, 'Failed to confirm borrow request. Please try again.')
      );
    },
    onSuccess: (result, variables) => {
      if (result.loans.length === 0) {
        toast.error(
          result.failed[0]?.reason ?? 'Failed to borrow. Please try again.'
        );
        return;
      }

      if (result.failed.length > 0) {
        toast.error(
          `${result.failed.length} book(s) could not be borrowed: ${result.failed
            .map((f) => f.reason)
            .join(', ')}`
        );
      }

      // Navigating here (not via mutate()'s call-level onSuccess) is
      // deliberate: onMutate's optimistic cart update can empty the
      // checkout list and unmount BorrowFormSection before the request
      // settles, which silently drops call-level callbacks.
      navigate('/checkout/success', {
        state: {
          itemCount: result.loans.length,
          returnDate: computeReturnDate(variables.borrowDate, variables.days),
        },
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.loans.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.me.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.books.all });
    },
  });
}
