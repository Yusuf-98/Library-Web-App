import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import CardAdminBorrowedList from '@/components/admin/CardAdminBorrowedList';
import AdminSearchInput from '@/components/admin/AdminSearchInput';
import AdminStatusFilters from '@/components/admin/AdminStatusFilters';
import AdminPaginationFooter from '@/components/admin/AdminPaginationFooter';
import { FadeInUp, FadeIn } from '@/components/common/StaggeredItems';
import { usePagedSearch } from '@/hooks/usePagedSearch';
import { getAdminLoans, updateAdminLoan, type AdminLoansParams } from '@/lib/api/loans';
import { queryKeys } from '@/lib/queryKeys';
import { getErrorMessage } from '@/lib/utils';

const STATUS_FILTERS: { label: string; value: NonNullable<AdminLoansParams['status']> }[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Returned', value: 'returned' },
  { label: 'Overdue', value: 'overdue' },
];

function formatShort(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
}

function formatLong(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function AdminBorrowedListPage() {
  const queryClient = useQueryClient();

  const [status, setStatus] = useState<NonNullable<AdminLoansParams['status']>>('all');
  const { query, setQuery, debouncedQuery, page, setPage } = usePagedSearch();

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.admin.loans.list(status, debouncedQuery, page),
    queryFn: () => getAdminLoans({ status, q: debouncedQuery || undefined, page, limit: 10 }),
  });

  const { mutate: markReturned } = useMutation({
    mutationFn: (id: number) => updateAdminLoan(id, { status: 'RETURNED' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.loans.all });
      toast.success('Loan marked as returned.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to update loan. Please try again.'));
    },
  });

  const loans = data?.loans ?? [];

  return (
    <div className="flex flex-col gap-[clamp(15px,calc(4.71px+1.34vw),24px)] mt-[clamp(15px,calc(4.71px+1.34vw),24px)] w-full">
      <div className="flex flex-col gap-[clamp(15px,calc(4.71px+1.34vw),24px)] w-full md:w-150">
        {/* Title */}
        <FadeInUp>
          <p className="font-bold text-neutral-950 tracking-t-none md:tracking-t-3 text-display-xs md:text-display-sm">
            Borrowed List
          </p>
        </FadeInUp>

        {/* Search */}
        <FadeIn delay={100}>
          <AdminSearchInput
            value={query}
            onChange={setQuery}
            placeholder="Search"
          />
        </FadeIn>
      </div>

      {/* Status filter */}
      <FadeIn delay={200}>
        <AdminStatusFilters
          filters={STATUS_FILTERS}
          value={status}
          onChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
          chipClassName="text-md"
        />
      </FadeIn>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center py-10">
          <span className="size-8 border-2 border-primary-300/30 border-t-primary-300 rounded-full animate-spin" />
        </div>
      )}

      {/* Error state */}
      {isError && (
        <p className="text-sm text-accent-red text-center py-10 tracking-t-2">Failed to load loans.</p>
      )}

      {/* Empty state */}
      {!isLoading && !isError && loans.length === 0 && (
        <p className="text-sm font-medium text-neutral-500 tracking-t-2 text-center py-10">
          No loans found.
        </p>
      )}

      {/* Loan list */}
      <div className="flex flex-col gap-[clamp(15px,calc(4.71px+1.34vw),24px)] w-full">
        {loans.map((loan, index) => (
          <FadeInUp key={loan.id} delay={(index % 3) * 250}>
            <CardAdminBorrowedList
              title={loan.book.title}
              author={loan.book.author.name}
              category={loan.book.category.name}
              cover={loan.book.coverImage}
              displayStatus={loan.displayStatus}
              dueAt={formatLong(loan.dueAt)}
              borrowedAt={formatShort(loan.borrowedAt)}
              durationDays={loan.durationDays}
              borrowerName={loan.borrower.name}
              canReturn={loan.displayStatus !== 'Returned'}
              onMarkReturned={() => markReturned(loan.id)}
            />
          </FadeInUp>
        ))}
      </div>

      {/* Pagination */}
      {data && data.pagination.totalPages > 1 && (
        <AdminPaginationFooter
          page={page}
          totalPages={data.pagination.totalPages}
          total={data.pagination.total}
          limit={data.pagination.limit}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
