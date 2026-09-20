import type { Loan } from '@/types';
import CardBorrowedList from '@/components/user/CardBorrowedList';
import { FadeInUp } from '@/components/common/StaggeredItems';
import { Button } from '@/components/ui/button';

// --- Helpers ---
function formatShort(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatLong(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

interface LoansListSectionProps {
  loans: Loan[];
  isLoading: boolean;
  isError: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onFetchNextPage: () => void;
  onGiveReview: (bookId: number) => void;
}

export default function LoansListSection({
  loans,
  isLoading,
  isError,
  hasNextPage,
  isFetchingNextPage,
  onFetchNextPage,
  onGiveReview,
}: LoansListSectionProps) {
  return (
    <>
      {/* Loading state */}
      {isLoading && (
        <div className='flex justify-center py-10'>
          <span className='size-8 border-2 border-primary-300/30 border-t-primary-300 rounded-full animate-spin' />
        </div>
      )}

      {/* Error state */}
      {isError && (
        <p className='text-sm text-accent-red text-center py-10 tracking-t-2'>
          Failed to load your loans.
        </p>
      )}

      {/* Empty state */}
      {!isLoading && !isError && loans.length === 0 && (
        <p className='text-sm font-medium text-neutral-500 tracking-t-2 text-center py-10'>
          No loans found.
        </p>
      )}

      {/* Loan list */}
      <div className='flex flex-col gap-[clamp(15px,calc(13.86px+0.1488vw),16px)] items-center w-full'>
        {loans.map((loan, index) => (
          <FadeInUp key={loan.id} delay={(index % 3) * 250} className='w-full'>
            <CardBorrowedList
              title={loan.book.title}
              author={loan.book.author.name}
              category={loan.book.category.name}
              cover={loan.book.coverImage}
              displayStatus={loan.displayStatus}
              dueAt={formatLong(loan.dueAt)}
              borrowedAt={formatShort(loan.borrowedAt)}
              durationDays={loan.durationDays}
              onGiveReview={() => onGiveReview(loan.book.id)}
            />
          </FadeInUp>
        ))}

        {/* Load more */}
        {hasNextPage && (
          <FadeInUp>
            <Button
              type='button'
              variant='outline'
              className='w-50'
              disabled={isFetchingNextPage}
              onClick={onFetchNextPage}
            >
              {isFetchingNextPage ? 'Loading...' : 'Load More'}
            </Button>
          </FadeInUp>
        )}
      </div>
    </>
  );
}
