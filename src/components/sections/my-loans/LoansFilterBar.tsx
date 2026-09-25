import type { LoansParams } from '@/lib/api/loans';
import { cn } from '@/lib/utils';
import { FadeIn } from '@/components/common/StaggeredItems';
import searchIcon from '@/assets/icons/search.svg';

const STATUS_FILTERS: {
  label: string;
  value: NonNullable<LoansParams['status']>;
}[] = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Returned', value: 'returned' },
  { label: 'Overdue', value: 'overdue' },
];

interface LoansFilterBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  status: NonNullable<LoansParams['status']>;
  onStatusChange: (status: NonNullable<LoansParams['status']>) => void;
}

export default function LoansFilterBar({
  query,
  onQueryChange,
  status,
  onStatusChange,
}: LoansFilterBarProps) {
  return (
    <>
      {/* Search */}
      <FadeIn>
        <div className='flex items-center gap-1.5 h-11 px-xl py-md rounded-full border border-neutral-300 bg-white w-full md:w-136'>
          <img src={searchIcon} alt='' className='shrink-0 size-5' />
          <input
            type='text'
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder='Search book'
            className='flex-1 min-w-0 text-sm font-medium text-neutral-600 tracking-t-3 outline-none placeholder:text-neutral-600 bg-transparent'
          />
        </div>
      </FadeIn>

      {/* Filter pills */}
      <FadeIn delay={40}>
        <div className='flex items-center gap-md md:gap-lg flex-wrap'>
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              type='button'
              onClick={() => onStatusChange(f.value)}
              className={cn(
                'cursor-pointer h-10 flex items-center justify-center px-xl py-md rounded-full tracking-t-2',
                status === f.value
                  ? 'text-md bg-primary-100 border border-primary-300 text-primary-300 font-bold'
                  : 'text-sm md:text-md border border-neutral-300 text-neutral-950 font-semibold'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </FadeIn>
    </>
  );
}
