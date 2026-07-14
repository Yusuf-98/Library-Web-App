import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import CardMyReview from '@/components/user/CardMyReview';
import { FadeInUp, FadeIn } from '@/components/common/StaggeredItems';
import { getMyReviews } from '@/lib/api/reviews';
import { formatReviewDate } from '@/lib/utils';
import searchIcon from '@/assets/icons/search.svg';

export default function ReviewsPage() {
  const [query, setQuery] = useState('');

  const {
    data: reviews,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['reviews', 'my'],
    queryFn: getMyReviews,
  });

  const filtered = (reviews ?? []).filter((r) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      r.book.title.toLowerCase().includes(q) ||
      r.book.author.name.toLowerCase().includes(q)
    );
  });

  return (
    <div className='flex flex-col gap-3.75 md:gap-[clamp(15.04px,calc(4.8px+1.333vw),24px)] w-full'>
      {/* Title */}
      <FadeInUp>
        <h1 className='font-bold text-neutral-950 md:tracking-t-3 text-display-xs md:text-[clamp(24px,calc(19.43px+0.595vw),28px)]'>
          Reviews
        </h1>
      </FadeInUp>

      {/* Search */}
      <FadeIn delay={100}>
        <div className='flex items-center gap-1.5 h-11 md:h-12 px-xl py-md rounded-full border border-neutral-300 bg-white w-full md:w-136'>
          <img src={searchIcon} alt='' className='shrink-0 size-5' />
          <input
            type='text'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search Reviews'
            className='flex-1 min-w-0 text-sm font-medium text-neutral-600 tracking-t-3 outline-none placeholder:text-neutral-600 bg-transparent'
          />
        </div>
      </FadeIn>

      {/* Loading state */}
      {isLoading && (
        <div className='flex justify-center py-10'>
          <span className='size-8 border-2 border-primary-300/30 border-t-primary-300 rounded-full animate-spin' />
        </div>
      )}

      {/* Error state */}
      {isError && (
        <p className='text-sm text-accent-red text-center py-10 tracking-t-2'>
          Failed to load your reviews.
        </p>
      )}

      {/* Empty state */}
      {!isLoading && !isError && filtered.length === 0 && (
        <p className='text-sm font-medium text-neutral-500 tracking-t-2 text-center py-10'>
          No reviews found.
        </p>
      )}

      {/* Review list */}
      <div className='flex flex-col gap-[clamp(16px,calc(6.86px+1.19vw),24px)] w-full'>
        {filtered.map((review, index) => (
          <FadeInUp key={review.id} delay={(index % 3) * 250}>
            <CardMyReview
              createdAt={formatReviewDate(review.createdAt)}
              title={review.book.title}
              author={review.book.author.name}
              category={review.book.category.name}
              cover={review.book.coverImage}
              rating={review.star}
              comment={review.comment}
            />
          </FadeInUp>
        ))}
      </div>
    </div>
  );
}
