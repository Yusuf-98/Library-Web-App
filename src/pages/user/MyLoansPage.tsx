import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import GiveReviewModal from '@/components/user/GiveReviewModal';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { getMyLoans, type LoansParams } from '@/lib/api/loans';
import { queryKeys } from '@/lib/queryKeys';
import LoansFilterBar from '@/components/sections/my-loans/LoansFilterBar';
import LoansListSection from '@/components/sections/my-loans/LoansListSection';
import { FadeInUp } from '@/components/common/StaggeredItems';

export default function MyLoansPage() {
  // --- State ---
  const [status, setStatus] =
    useState<NonNullable<LoansParams['status']>>('all');
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query);
  const [reviewBookId, setReviewBookId] = useState<number | null>(null);

  // --- Queries ---
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: queryKeys.loans.my(status, debouncedQuery),
    queryFn: ({ pageParam }) =>
      getMyLoans({ status, q: debouncedQuery || undefined, page: pageParam, limit: 10 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.pagination.page < lastPage.pagination.totalPages
        ? lastPage.pagination.page + 1
        : undefined,
  });

  // --- Derived ---
  const loans = data?.pages.flatMap((p) => p.loans) ?? [];

  return (
    <>
      <div className='flex flex-col gap-3.75 md:gap-[clamp(15.04px,calc(4.8px+1.333vw),24px)] w-full'>
        {/* Title */}
        <FadeInUp>
          <h1 className='font-extrabold text-neutral-950 md:tracking-t-3 text-display-xs md:text-[clamp(24px,calc(19.43px+0.595vw),28px)]'>
            Borrowed List
          </h1>
        </FadeInUp>

        {/* Filters */}
        <LoansFilterBar
          query={query}
          onQueryChange={setQuery}
          status={status}
          onStatusChange={setStatus}
        />

        {/* Loan list */}
        <LoansListSection
          loans={loans}
          isLoading={isLoading}
          isError={isError}
          hasNextPage={!!hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onFetchNextPage={() => fetchNextPage()}
          onGiveReview={setReviewBookId}
        />
      </div>

      <GiveReviewModal
        bookId={reviewBookId}
        onOpenChange={(open) => !open && setReviewBookId(null)}
      />
    </>
  );
}
