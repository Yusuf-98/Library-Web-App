import { useNavigate } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import CardBook from '@/components/common/CardBook';
import { FadeInUp } from '@/components/common/StaggeredItems';
import { Button } from '@/components/ui/button';
import { getBooks } from '@/lib/api/books';
import { queryKeys } from '@/lib/queryKeys';
import { SectionLoading, SectionError } from './SectionState';

export default function RecommendationSection() {
  const navigate = useNavigate();

  const {
    data: booksData,
    isLoading: booksLoading,
    isError: booksError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: queryKeys.books.home,
    queryFn: ({ pageParam }) => getBooks({ limit: 10, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
  });

  const books = booksData?.pages.flatMap((p) => p.books) ?? [];

  return (
    <section className='flex flex-col gap-[clamp(20px,calc(-2.86px+2.976vw),40px)]'>
      {/* Title */}
      <FadeInUp>
        <h2 className='text-display-xs md:text-[clamp(24px,calc(10.29px+1.786vw),36px)] font-bold text-neutral-950'>
          Recommendation
        </h2>
      </FadeInUp>

      {booksLoading && <SectionLoading />}
      {booksError && <SectionError message='Failed to load books.' />}

      {!booksLoading && !booksError && books.length === 0 && (
        <p className='text-sm font-medium text-neutral-500 tracking-t-2 py-6 text-center'>
          No books available.
        </p>
      )}

      {/* Book grid */}
      {books.length > 0 && (
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2xl'>
          {books.map((book, index) => (
            <FadeInUp key={book.id} delay={(index % 5) * 250}>
              <CardBook
                title={book.title}
                author={book.author.name}
                cover={book.coverImage}
                rating={book.rating}
                onClick={() => navigate(`/books/${book.id}`)}
                className='w-full'
              />
            </FadeInUp>
          ))}
        </div>
      )}

      {hasNextPage && (
        <FadeInUp className='mx-auto'>
          <Button
            type='button'
            variant='outline'
            className='w-37.5 h-10 md:w-50 md:h-12'
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
          >
            {isFetchingNextPage ? 'Loading...' : 'Load More'}
          </Button>
        </FadeInUp>
      )}
    </section>
  );
}
