import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Book, User } from '@/types';
import { getCart, addCartItem } from '@/lib/api/cart';
import { queryKeys } from '@/lib/queryKeys';
import { getErrorMessage } from '@/lib/utils';
import DetailBook from '@/components/common/DetailBook';

interface CoverInfoSectionProps {
  book: Book;
  bookId: number;
  user: User | null;
  isInCart: boolean;
}

export default function CoverInfoSection({
  book,
  bookId,
  user,
  isInCart,
}: CoverInfoSectionProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // --- Mutations ---
  const { mutate: borrowNow, isPending: isBorrowing } = useMutation({
    mutationFn: () => addCartItem(bookId),
    onSuccess: (cartItem) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
      navigate('/checkout', { state: { itemIds: [cartItem.id] } });
    },
    onError: async (error) => {
      try {
        const cart = await getCart();
        const existing = cart.items.find((i) => i.bookId === bookId);
        if (existing) {
          navigate('/checkout', { state: { itemIds: [existing.id] } });
          return;
        }
      } catch {
        // ignore
      }
      toast.error(getErrorMessage(error, 'Failed to start borrow request. Please try again.'));
    },
  });

  const { mutate: addToCart, isPending: isAddingToCart } = useMutation({
    mutationFn: () => addCartItem(bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
      toast.success('Added to cart.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to add to cart. Please try again.'));
    },
  });

  // --- Handlers ---
  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart();
  };

  const handleBorrowNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    borrowNow();
  };

  // --- Derived ---
  const outOfStock = (book?.availableCopies ?? 0) <= 0;

  return (
    <DetailBook
      book={book}
      onAuthorClick={() => navigate(`/author/${book.author.id}`)}
      onAddToCart={handleAddToCart}
      onBorrow={handleBorrowNow}
      isInCart={isInCart}
      isAddingToCart={isAddingToCart}
      isBorrowing={isBorrowing}
      outOfStock={outOfStock}
    />
  );
}
