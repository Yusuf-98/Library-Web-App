import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Footer from '@/components/shared/Footer';
import CardBook from '@/components/common/CardBook';
import CardAuthor from '@/components/common/CardAuthor';
import { FadeInUp } from '@/components/common/StaggeredItems';
import { getBooksByAuthor } from '@/lib/api/authors';
import { queryKeys } from '@/lib/queryKeys';

export default function BookByAuthorPage() {
  const { id } = useParams<{ id: string }>();
  const authorId = Number(id);
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.books.author(authorId),
    queryFn: () => getBooksByAuthor(authorId),
    enabled: !!authorId,
  });

  const books = data?.books ?? [];

  return (
    <>
      {/* Content */}
      <main className='custom-container flex-1 flex flex-col gap-[clamp(16px,calc(-11.43px+3.571vw),40px)] mb-7'>
        {/* Author info */}
        {!isLoading && data && books.length > 0 && (
          <FadeInUp>
            <CardAuthor name={data.author.name} bookCount={data.bookCount} />
          </FadeInUp>
        )}

        <div className='flex flex-col gap-[clamp(16px,calc(-2.29px+2.381vw),32px)]'>
          {/* Title */}
          <FadeInUp>
            <h1 className='font-extrabold text-neutral-950 text-display-xs md:text-[clamp(24px,calc(10.29px+1.786vw),36px)]'>
              Book List
            </h1>
          </FadeInUp>
          {/* Loading state */}
          {isLoading && (
            <div className='flex justify-center mt-10'>
              <span className='size-8 border-2 border-primary-300/30 border-t-primary-300 rounded-full animate-spin' />
            </div>
          )}
          {/* Error state */}
          {isError && (
            <p className='text-sm text-accent-red text-center mt-10 tracking-t-2'>
              Failed to load books.
            </p>
          )}

          {/* Empty state */}
          {!isLoading && books.length === 0 && !isError && (
            <p className='text-sm font-medium text-neutral-500 tracking-t-2 text-center mt-10'>
              No books found for this author.
            </p>
          )}

          {/* Book grid */}
          {books.length > 0 && (
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-2xl'>
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
        </div>
      </main>

      <Footer onLogoClick={() => navigate('/')} />
    </>
  );
}
