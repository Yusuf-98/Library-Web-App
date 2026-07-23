import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getCart, addCartItem } from '@/lib/api/cart';
import { getBookById } from '@/lib/api/books';
import type { Book } from '@/types';
import { borrowBook } from '@/lib/api/loans';
import { queryKeys } from '@/lib/queryKeys';
import { getErrorMessage } from '@/lib/utils';
import DetailBook from '@/components/common/DetailBook';
import { FadeInUp } from '@/components/common/StaggeredItems';
import arrowBackIcon from '@/assets/icons/arrow-back.svg';

export default function AdminBookPreviewPage() {
  const { id } = useParams<{ id: string }>();
  const bookId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: cart } = useQuery({
    queryKey: queryKeys.cart.all,
    queryFn: getCart,
  });
  const isInCart = (cart?.items ?? []).some((i) => i.bookId === bookId);

  const {
    data: book,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.books.detail(bookId),
    queryFn: () => getBookById(bookId),
    enabled: !!bookId,
  });

  const { mutate: borrowNow, isPending: isBorrowing } = useMutation({
    mutationFn: () => borrowBook(bookId, 7),
    onMutate: async () => {
      const previous = queryClient.getQueryData<Book>(
        queryKeys.books.detail(bookId)
      );
      queryClient.setQueryData<Book>(queryKeys.books.detail(bookId), (old) =>
        old
          ? { ...old, availableCopies: Math.max(0, old.availableCopies - 1) }
          : old
      );
      return { previous };
    },
    onSuccess: () => {
      toast.success('Book borrowed successfully!');
    },
    onError: (error, _vars, context) => {
      if (context?.previous)
        queryClient.setQueryData(queryKeys.books.detail(bookId), context.previous);
      toast.error(getErrorMessage(error, 'Failed to borrow. Please try again.'));
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.books.detail(bookId) }),
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

  const outOfStock = (book?.availableCopies ?? 0) <= 0;

  return (
    <>
      {/* Loading state */}
      {isLoading && (
        <div className='flex justify-center mt-10'>
          <span className='size-8 border-2 border-primary-300/30 border-t-primary-300 rounded-full animate-spin' />
        </div>
      )}

      {/* Error state */}
      {!isLoading && (isError || !book) && (
        <p className='text-sm text-accent-red text-center mt-10 tracking-t-2'>
          Failed to load book.
        </p>
      )}

      {!isLoading && book && (
        <main className='custom-container flex-1 pt-[clamp(0px,calc(-40.57px+4.76vw),28px)] pb-24 md:pb-80 flex flex-col gap-4xl'>
          {/* Back button */}
          <button
            type='button'
            onClick={() => navigate('/admin/books')}
            className='cursor-pointer flex gap-1.5 md:gap-lg items-center'
          >
            <img
              src={arrowBackIcon}
              alt=''
              className='size-6 md:size-8 shrink-0'
            />
            <span className='font-extrabold md:font-bold text-neutral-950 tracking-t-2 md:tracking-t-3 text-xl md:text-display-sm'>
              Preview Book
            </span>
          </button>

          {/* Book detail */}
          <FadeInUp>
            <DetailBook
              book={book}
              onAuthorClick={() => navigate(`/author/${book.author.id}`)}
              onAddToCart={() => addToCart()}
              onBorrow={() => borrowNow()}
              isInCart={isInCart}
              isAddingToCart={isAddingToCart}
              isBorrowing={isBorrowing}
              outOfStock={outOfStock}
            />
          </FadeInUp>
        </main>
      )}
    </>
  );
}
