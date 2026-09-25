import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import type { Book, Review, User } from '@/types';
import { formatReviewDate } from '@/lib/utils';
import { getReviews } from '@/lib/api/reviews';
import { queryKeys } from '@/lib/queryKeys';
import { useDeleteReviewMutation } from '@/features/reviews/useReviewMutations';
import CardReview from '@/components/common/CardReview';
import GiveReviewModal from '@/components/user/GiveReviewModal';
import { FadeInUp } from '@/components/common/StaggeredItems';
import { Button } from '@/components/ui/button';
import star34 from '@/assets/icons/star-34.svg';

interface ReviewsSectionProps {
  bookId: number;
  book: Book;
  user: User | null;
}

export default function ReviewsSection({ bookId, book, user }: ReviewsSectionProps) {
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  const {
    data: reviewsData,
    isLoading: reviewsLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: queryKeys.reviews.book(bookId),
    queryFn: ({ pageParam }) =>
      getReviews(bookId, { page: pageParam, limit: 6 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
    enabled: !!bookId,
  });
  const reviews = reviewsData?.pages.flatMap((p) => p.reviews) ?? [];

  const { mutate: removeReview } = useDeleteReviewMutation(bookId);

  return (
    <>
      <div className='flex flex-col gap-4.5'>
        {/* Heading */}
        <FadeInUp>
          <div className='flex flex-col gap-1 md:gap-[clamp(4px,calc(-5.14px+1.19vw),12px)]'>
            <h2 className='font-bold text-neutral-950 text-display-xs md:text-[clamp(24px,calc(10.29px+1.786vw),36px)]'>
              Review
            </h2>
            <div className='flex items-center gap-1'>
              <img
                src={star34}
                alt=''
                className='size-[clamp(24px,calc(12.57px+1.488vw),34px)]'
              />
              <span className='font-bold text-neutral-950 tracking-t-2 md:tracking-t-none text-md md:text-[clamp(16px,calc(11.43px+0.595vw),20px)]'>
                {book.rating.toFixed(1)} ({book.reviewCount} Ulasan)
              </span>
            </div>
          </div>
        </FadeInUp>

        {/* Loading state */}
        {reviewsLoading && (
          <div className='flex justify-center py-6'>
            <span className='size-6 border-2 border-primary-300/30 border-t-primary-300 rounded-full animate-spin' />
          </div>
        )}

        {/* Empty state */}
        {!reviewsLoading && reviews.length === 0 && (
          <p className='text-sm font-medium text-neutral-500 tracking-t-2 text-center py-6'>
            No reviews yet. Be the first to review!
          </p>
        )}

        {/* Review list */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-2xl gap-y-4.5'>
          {reviews.map((review, index) => (
            <FadeInUp key={review.id} delay={(index % 2) * 80}>
              <CardReview
                name={review.user.name}
                avatar={
                  user?.id === review.userId
                    ? (user?.profilePhoto ?? undefined)
                    : `https://ui-avatars.com/api/?name=${encodeURIComponent(review.user.name)}`
                }
                rating={review.star}
                date={formatReviewDate(review.createdAt)}
                comment={review.comment}
                isOwn={user?.id === review.userId}
                onEdit={() => setEditingReview(review)}
                onDelete={() => removeReview(review.id)}
              />
            </FadeInUp>
          ))}
        </div>

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
      </div>

      <GiveReviewModal
        key={editingReview?.id ?? 'new'}
        bookId={editingReview ? bookId : null}
        initialReview={
          editingReview
            ? { star: editingReview.star, comment: editingReview.comment }
            : null
        }
        onOpenChange={(open) => !open && setEditingReview(null)}
      />
    </>
  );
}
