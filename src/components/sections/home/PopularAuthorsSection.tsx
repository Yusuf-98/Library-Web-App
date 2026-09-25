import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import CardAuthor, { CardAuthorSkeleton } from '@/components/common/CardAuthor';
import { FadeInUp } from '@/components/common/StaggeredItems';
import { getPopularAuthors } from '@/lib/api/authors';
import { queryKeys } from '@/lib/queryKeys';
import { SectionError } from './SectionState';

export default function PopularAuthorsSection() {
  const navigate = useNavigate();

  // --- Query ---
  const {
    data: authors,
    isLoading: authorsLoading,
    isError: authorsError,
  } = useQuery({
    queryKey: queryKeys.authors.popular,
    queryFn: getPopularAuthors,
  });

  return (
    <section className='flex flex-col gap-4'>
      {/* Title */}
      <FadeInUp>
        <h2 className='text-display-xs md:text-[clamp(24px,calc(10.29px+1.786vw),36px)] font-bold text-neutral-950 tracking-t-2'>
          Popular Authors
        </h2>
      </FadeInUp>

      {/* Loading state */}
      {authorsLoading && (
        <div
          role='status'
          className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2xl'
        >
          <span className='sr-only'>Loading authors</span>
          {Array.from({ length: 10 }, (_, i) => (
            <CardAuthorSkeleton key={i} />
          ))}
        </div>
      )}
      {/* Error state */}
      {authorsError && <SectionError message='Failed to load authors.' />}

      {/* Author grid */}
      {!authorsLoading && !authorsError && (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2xl'>
          {(authors ?? []).map((author, index) => (
            <FadeInUp key={author.id} delay={(index % 4) * 80}>
              <CardAuthor
                name={author.name}
                bookCount={author.bookCount}
                onClick={() => navigate(`/author/${author.id}`)}
              />
            </FadeInUp>
          ))}
        </div>
      )}
    </section>
  );
}
