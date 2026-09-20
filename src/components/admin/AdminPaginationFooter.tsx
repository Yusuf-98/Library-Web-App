import Pagination from '@/components/shared/Pagination';
import { FadeIn } from '@/components/common/StaggeredItems';

interface AdminPaginationFooterProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function AdminPaginationFooter({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
}: AdminPaginationFooterProps) {
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <FadeIn className="w-full">
      {/* Mobile pager */}
      <div className="md:hidden">
        <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
      </div>
      {/* Desktop footer */}
      <div className="hidden md:flex items-center justify-between w-full px-3xl py-lg">
        <span className="font-medium text-neutral-950 tracking-t-3 text-md whitespace-nowrap">
          Showing {from} to {to} of {total} entries
        </span>
        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          className="w-auto"
        />
      </div>
    </FadeIn>
  );
}
