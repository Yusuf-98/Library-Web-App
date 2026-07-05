import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { Book, User } from '@/types';
import { getCart, addCartItem } from '@/lib/api/cart';
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

  const { mutate: borrowNow, isPending: isBorrowing } = useMutation({
    mutationFn: () => addCartItem(bookId),
    onSuccess: (cartItem) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      navigate('/checkout', { state: { itemIds: [cartItem.id] } });
    },
    onError: async () => {
      try {
        const cart = await getCart();
        const existing = cart.items.find((i) => i.bookId === bookId);
        if (existing) {
          navigate('/checkout', { state: { itemIds: [existing.id] } });
          return;
        }
      } catch {
        // ignore, fall through to error toast
      }
      toast.error('Failed to start borrow request. Please try again.');
    },
  });

  const { mutate: addToCart, isPending: isAddingToCart } = useMutation({
    mutationFn: () => addCartItem(bookId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Added to cart.');
    },
    onError: () => {
      toast.error('Failed to add to cart. Please try again.');
    },
  });

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
