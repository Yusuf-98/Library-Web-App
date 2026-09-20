import { useQuery } from '@tanstack/react-query';
import Pagination from '@/components/shared/Pagination';
import AdminSearchInput from '@/components/admin/AdminSearchInput';
import { FadeInUp, FadeIn } from '@/components/common/StaggeredItems';
import { formatShortDateTime } from '@/lib/utils';
import { usePagedSearch } from '@/hooks/usePagedSearch';
import { getAdminUsers } from '@/lib/api/users';
import { queryKeys } from '@/lib/queryKeys';

const COLUMNS = ['No', 'Name', 'Nomor Handphone', 'Email', 'Created at'];

export default function AdminUserListPage() {
  // --- Query ---
  const { query, setQuery, debouncedQuery, page, setPage } = usePagedSearch();
  const limit = 10;

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.admin.users(debouncedQuery, page),
    queryFn: () => getAdminUsers({ q: debouncedQuery || undefined, page, limit }),
  });

  // --- Derived ---
  const users = data?.users ?? [];
  const pagination = data?.pagination;
  const from = pagination ? (pagination.page - 1) * pagination.limit + 1 : 0;
  const to = pagination
    ? Math.min(pagination.page * pagination.limit, pagination.total)
    : 0;

  return (
    <div className='flex flex-col w-full'>
      <div className='flex flex-col gap-[clamp(15px,calc(4.71px+1.34vw),24px)] w-full md:w-[clamp(600px,calc(891.43px-20.24vw),736px)] mt-[clamp(15px,calc(-2.14px+2.23vw),30px)]'>
        {/* Title */}
        <FadeInUp>
          <p className='font-bold text-neutral-950 tracking-t-2 text-display-xs md:text-display-sm'>
            User
          </p>
        </FadeInUp>

        {/* Search */}
        <FadeIn delay={100}>
          <AdminSearchInput
            value={query}
            onChange={setQuery}
            placeholder='Search user'
          />
        </FadeIn>
      </div>

      <div className='mt-[clamp(15px,calc(4.71px+1.34vw),24px)]'>
        {/* Loading state */}
        {isLoading && (
          <div className='flex justify-center py-10'>
            <span className='size-8 border-2 border-primary-300/30 border-t-primary-300 rounded-full animate-spin' />
          </div>
        )}

        {/* Error state */}
        {isError && (
          <p className='text-sm text-accent-red text-center py-10 tracking-t-2'>
            Failed to load users.
          </p>
        )}

        {/* Empty state */}
        {!isLoading && !isError && users.length === 0 && (
          <p className='text-sm font-medium text-neutral-500 tracking-t-2 text-center py-10'>
            No users found.
          </p>
        )}

        {users.length > 0 && (
          <>
            {/* Cards */}
            <div className='flex flex-col gap-3.75 w-full md:hidden'>
              {users.map((u, index) => (
                <FadeInUp
                  key={u.id}
                  delay={(index % 3) * 250}
                  className='bg-white rounded-xl shadow-card flex flex-col gap-1 p-lg w-full'
                >
                  <div className='flex items-center justify-between w-full'>
                    <span className='font-semibold text-neutral-950 tracking-t-2 text-sm'>
                      No
                    </span>
                    <span className='font-semibold text-neutral-950 tracking-t-2 text-sm'>
                      {from + index}
                    </span>
                  </div>
                  <div className='flex items-center justify-between w-full gap-md'>
                    <span className='font-semibold text-neutral-950 tracking-t-2 text-sm shrink-0'>
                      Name
                    </span>
                    <span className='font-semibold text-neutral-950 tracking-t-2 text-sm truncate'>
                      {u.name}
                    </span>
                  </div>
                  <div className='flex items-center justify-between w-full gap-md'>
                    <span className='font-semibold text-neutral-950 tracking-t-2 text-sm shrink-0'>
                      Email
                    </span>
                    <span className='font-bold text-neutral-950 tracking-t-2 text-sm truncate'>
                      {u.email}
                    </span>
                  </div>
                  <div className='flex items-center justify-between w-full gap-md'>
                    <span className='font-semibold text-neutral-950 tracking-t-2 text-sm shrink-0'>
                      Nomor Handphone
                    </span>
                    <span className='font-bold text-neutral-950 tracking-t-2 text-sm truncate'>
                      {u.phone || '-'}
                    </span>
                  </div>
                  <div className='flex items-center justify-between w-full gap-md'>
                    <span className='font-semibold text-neutral-950 tracking-t-2 text-sm shrink-0'>
                      Created at
                    </span>
                    <span className='font-bold text-neutral-950 tracking-t-2 text-sm truncate'>
                      {formatShortDateTime(u.createdAt)}
                    </span>
                  </div>
                </FadeInUp>
              ))}

              {pagination && (
                <FadeIn>
                  <Pagination
                    page={page}
                    totalPages={pagination.totalPages}
                    onPageChange={setPage}
                  />
                </FadeIn>
              )}
            </div>

            {/* Table */}
            <div className='hidden md:flex bg-white border border-neutral-300 shadow-[0px_0px_12px_rgba(203,202,202,0.2)] rounded-xl flex-col items-start p-xl w-full'>
              <div className='w-full'>
                {/* Header row */}
                <div className='flex items-start w-full'>
                  <div className='bg-neutral-50 flex items-center justify-center h-16 px-xl py-md w-11 shrink-0'>
                    <span className='font-bold text-neutral-950 tracking-t-2 text-sm whitespace-nowrap'>
                      {COLUMNS[0]}
                    </span>
                  </div>
                  {COLUMNS.slice(1).map((col) => (
                    <div
                      key={col}
                      className='bg-neutral-50 flex-1 min-w-0 flex items-center h-16 px-xl py-md'
                    >
                      <span className='font-bold text-neutral-950 tracking-t-2 text-sm whitespace-nowrap'>
                        {col}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Data rows */}
                {users.map((u, index) => (
                  <FadeInUp
                    key={u.id}
                    delay={(index % 3) * 250}
                    className='flex items-start w-full'
                  >
                    <div className='border-b border-neutral-300 flex items-center h-16 px-xl py-md w-11 shrink-0'>
                      <span className='font-semibold text-neutral-950 tracking-t-2 text-md'>
                        {from + index}
                      </span>
                    </div>
                    <div className='border-b border-neutral-300 flex-1 min-w-0 flex items-center h-16 px-xl py-md'>
                      <span className='font-semibold text-neutral-950 tracking-t-2 text-md truncate'>
                        {u.name}
                      </span>
                    </div>
                    <div className='border-b border-neutral-300 flex-1 min-w-0 flex items-center h-16 px-xl py-md'>
                      <span className='font-semibold text-neutral-950 tracking-t-2 text-md truncate'>
                        {u.phone || '-'}
                      </span>
                    </div>
                    <div className='border-b border-neutral-300 flex-1 min-w-0 flex items-center h-16 px-xl py-md'>
                      <span className='font-semibold text-neutral-950 tracking-t-2 text-md truncate'>
                        {u.email}
                      </span>
                    </div>
                    <div className='border-b border-neutral-300 flex-1 min-w-0 flex items-center h-16 px-xl py-md'>
                      <span className='font-semibold text-neutral-950 tracking-t-2 text-md truncate'>
                        {formatShortDateTime(u.createdAt)}
                      </span>
                    </div>
                  </FadeInUp>
                ))}
              </div>

              {/* Pagination footer */}
              {pagination && (
                <FadeIn className='w-full'>
                  <div className='flex items-center justify-between w-full px-3xl py-lg'>
                    <span className='font-medium text-neutral-950 tracking-t-3 text-md whitespace-nowrap'>
                      Showing {from} to {to} of {pagination.total} entries
                    </span>
                    <Pagination
                      page={page}
                      totalPages={pagination.totalPages}
                      onPageChange={setPage}
                      className='w-auto'
                    />
                  </div>
                </FadeIn>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
