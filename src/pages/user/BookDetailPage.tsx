import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from '@/app/hooks';
import { getCart } from '@/lib/api/cart';
import { getBookById } from '@/lib/api/books';
import { queryKeys } from '@/lib/queryKeys';
import Footer from '@/components/shared/Footer';
import CoverInfoSection from '@/components/sections/book-detail/CoverInfoSection';
import { FadeInUp } from '@/components/common/StaggeredItems';
import ReviewsSection from '@/components/sections/book-detail/ReviewsSection';
import RelatedBooksSection from '@/components/sections/book-detail/RelatedBooksSection';
import chevronIcon from '@/assets/icons/chevron-down.svg';

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const bookId = Number(id);
  const navigate = useNavigate();

  const user = useAppSelector((s) => s.auth.user);
  const isLoggedIn = !!user;

  const { data: cart } = useQuery({
    queryKey: queryKeys.cart.all,
    queryFn: getCart,
    enabled: isLoggedIn,
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
        <>
          <main className='custom-container flex-1 py-6 md:py-8 flex flex-col gap-[clamp(24px,calc(-21.71px+5.952vw),64px)]'>
            {/* Content: Breadcrumb + Cover/Info */}
            <div className='flex flex-col gap-xl md:gap-[clamp(16px,calc(6.86px+1.19vw),24px)]'>
              {/* Breadcrumb */}
              <div className='flex items-center gap-1 text-sm font-semibold tracking-t-2 flex-wrap'>
                <button
                  type='button'
                  onClick={() => navigate('/')}
                  className='cursor-pointer text-primary-300'
                >
                  Home
                </button>
                <img src={chevronIcon} alt='' className='size-4' />
                <button
                  type='button'
                  onClick={() => navigate(`/category/${book.category.id}`)}
                  className='cursor-pointer text-primary-300'
                >
                  {book.category.name}
                </button>
                <img src={chevronIcon} alt='' className='size-4' />
                <span className='text-neutral-950 truncate'>{book.title}</span>
              </div>

              {/* Cover + Info */}
              <FadeInUp>
                <CoverInfoSection
                  book={book}
                  bookId={bookId}
                  user={user}
                  isInCart={isInCart}
                />
              </FadeInUp>
            </div>

            {/* Divider */}
            <div className='h-px w-full bg-neutral-300' />

            {/* Reviews */}
            <ReviewsSection bookId={bookId} book={book} user={user} />

            {/* Related books */}
            <RelatedBooksSection bookId={bookId} categoryId={book.categoryId} />
          </main>

          <div className='pb-24 md:pb-0'>
            <Footer onLogoClick={() => navigate('/')} />
          </div>
        </>
      )}
    </>
  );
}
