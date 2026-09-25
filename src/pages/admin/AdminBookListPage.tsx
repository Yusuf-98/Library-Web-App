import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import AdminSearchInput from '@/components/admin/AdminSearchInput';
import AdminStatusFilters from '@/components/admin/AdminStatusFilters';
import AdminPaginationFooter from '@/components/admin/AdminPaginationFooter';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { FadeInUp, FadeIn } from '@/components/common/StaggeredItems';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  getAdminBooks,
  deleteBook,
  type AdminBooksParams,
} from '@/lib/api/books';
import { usePagedSearch } from '@/hooks/usePagedSearch';
import { optimizeImageUrl } from '@/lib/imageUrl';
import { queryKeys } from '@/lib/queryKeys';
import { getErrorMessage } from '@/lib/utils';
import starIcon from '@/assets/icons/star-24.svg';
import moreIcon from '@/assets/icons/more.svg';

const STATUS_FILTERS: {
  label: string;
  value: NonNullable<AdminBooksParams['status']>;
}[] = [
  { label: 'All', value: 'all' },
  { label: 'Available', value: 'available' },
  { label: 'Borrowed', value: 'borrowed' },
  { label: 'Returned', value: 'returned' },
];

export default function AdminBookListPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // --- State ---
  const [status, setStatus] =
    useState<NonNullable<AdminBooksParams['status']>>('all');
  const { query, setQuery, debouncedQuery, page, setPage } = usePagedSearch();
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // --- Queries ---
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.admin.books.list(status, debouncedQuery, page),
    queryFn: () =>
      getAdminBooks({ status, q: debouncedQuery || undefined, page, limit: 10 }),
  });

  // --- Mutations ---
  const { mutate: confirmDelete, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => deleteBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.books.all });
      toast.success('Book deleted.');
      setDeleteId(null);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to delete book. It may still have active loans.'));
    },
  });

  // --- Derived ---
  const books = data?.books ?? [];

  return (
    <>
      <div className='flex flex-col gap-[clamp(15px,calc(4.71px+1.34vw),24px)] mt-[clamp(15px,calc(4.71px+1.34vw),24px)] w-full'>
        <div className='flex flex-col gap-[clamp(15px,calc(4.71px+1.34vw),24px)] w-full md:w-150'>
          {/* Title */}
          <FadeInUp>
            <p className='font-bold text-neutral-950 tracking-t-none md:tracking-t-3 text-display-xs md:text-display-sm'>
              Book List
            </p>
          </FadeInUp>

          {/* Add button */}
          <FadeIn delay={40}>
            <Button
              type='button'
              variant='primary'
              fullWidth
              className='h-11 md:h-12 md:w-60'
              onClick={() => navigate('/admin/books/new')}
            >
              Add Book
            </Button>
          </FadeIn>

          {/* Search */}
          <FadeIn delay={80}>
            <AdminSearchInput
              value={query}
              onChange={setQuery}
              placeholder='Search book'
            />
          </FadeIn>

          {/* Status filter */}
          <FadeIn delay={120}>
            <AdminStatusFilters
              filters={STATUS_FILTERS}
              value={status}
              onChange={(v) => {
                setStatus(v);
                setPage(1);
              }}
              className='w-full'
            />
          </FadeIn>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className='flex justify-center py-10'>
            <span className='size-8 border-2 border-primary-300/30 border-t-primary-300 rounded-full animate-spin' />
          </div>
        )}

        {/* Error state */}
        {isError && (
          <p className='text-sm text-accent-red text-center py-10 tracking-t-2'>
            Failed to load books.
          </p>
        )}

        {/* Empty state */}
        {!isLoading && !isError && books.length === 0 && (
          <p className='text-sm font-medium text-neutral-500 tracking-t-2 text-center py-10'>
            No books found.
          </p>
        )}

        {/* Book list */}
        <div className='flex flex-col gap-xl w-full'>
          {books.map((book, index) => (
            <FadeInUp
              key={book.id}
              delay={(index % 3) * 80}
              className='bg-white rounded-2xl shadow-card flex items-center justify-between gap-xl p-xl md:p-2xl w-full'
            >
              <div className='flex-1 min-w-0 flex gap-lg md:gap-xl items-center'>
                <img
                  src={optimizeImageUrl(book.coverImage, 200)}
                  alt={book.title}
                  loading='lazy'
                  className='w-23 h-34.5 object-cover shrink-0'
                />
                <div className='flex-1 min-w-0 flex flex-col gap-0.5 md:gap-xs'>
                  <span className='inline-flex self-start border border-neutral-300 rounded-sm px-md text-sm font-bold text-neutral-950 tracking-t-2'>
                    {book.category.name}
                  </span>
                  <p className='font-bold text-black md:text-neutral-950 tracking-t-2 md:tracking-t-3 text-sm md:text-lg'>
                    {book.title}
                  </p>
                  <p className='font-medium text-neutral-700 tracking-t-3 text-sm md:text-md'>
                    {book.author.name}
                  </p>
                  <div className='flex items-center gap-0.5'>
                    <img src={starIcon} alt='' className='size-6 shrink-0' />
                    <span className='font-bold text-neutral-900 tracking-t-2 text-sm md:text-md'>
                      {book.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type='button'
                    className='cursor-pointer shrink-0 size-6 md:hidden'
                    aria-label='More actions'
                  >
                    <img src={moreIcon} alt='' className='size-full' />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align='end'
                  className='bg-white shadow-card ring-0 rounded-2xl p-xl flex flex-col gap-xl w-38.5'
                >
                  <DropdownMenuItem
                    onClick={() => navigate(`/admin/books/${book.id}/preview`)}
                    className='cursor-pointer w-full p-0 rounded-none font-semibold text-neutral-950 tracking-t-2 text-sm focus:bg-transparent'
                  >
                    Preview
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate(`/admin/books/${book.id}/edit`)}
                    className='cursor-pointer w-full p-0 rounded-none font-semibold text-neutral-950 tracking-t-2 text-sm focus:bg-transparent'
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setDeleteId(book.id)}
                    className='cursor-pointer w-full p-0 rounded-none font-semibold text-danger tracking-t-2 text-sm focus:bg-transparent'
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Buttons */}
              <div className='hidden md:flex gap-3.25 items-center shrink-0'>
                <Button
                  type='button'
                  variant='outline'
                  className='w-23.75 h-12'
                  onClick={() => navigate(`/admin/books/${book.id}/preview`)}
                >
                  Preview
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  className='w-23.75 h-12'
                  onClick={() => navigate(`/admin/books/${book.id}/edit`)}
                >
                  Edit
                </Button>
                <Button
                  type='button'
                  variant='outline'
                  className='w-23.75 h-12 text-danger'
                  onClick={() => setDeleteId(book.id)}
                >
                  Delete
                </Button>
              </div>
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

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        isConfirming={isDeleting}
        onConfirm={() => deleteId !== null && confirmDelete(deleteId)}
      />
    </>
  );
}
