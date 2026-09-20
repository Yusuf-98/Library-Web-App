import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import chevronLeftIcon from '@/assets/icons/chevron-left.svg';
import chevronRightIcon from '@/assets/icons/chevron-right.svg';

const FRONT_WINDOW_SIZE = 3;

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

type PageItem = number | 'ellipsis';

// --- Helpers ---
function getVisiblePages(page: number, totalPages: number): PageItem[] {
  if (totalPages <= FRONT_WINDOW_SIZE + 1) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const start = Math.max(1, Math.min(page - 1, totalPages - FRONT_WINDOW_SIZE));
  const front = Array.from({ length: FRONT_WINDOW_SIZE }, (_, i) => start + i);
  const lastFront = front[front.length - 1];

  if (lastFront === totalPages - 1) {
    return [...front, totalPages];
  }
  return [...front, 'ellipsis', totalPages];
}

// --- Page input ---
function PageInput({
  totalPages,
  onSubmit,
  onCancel,
}: {
  totalPages: number;
  onSubmit: (page: number) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const commit = () => {
    const parsed = Number(value);
    if (Number.isInteger(parsed) && parsed >= 1 && parsed <= totalPages) {
      onSubmit(parsed);
    } else {
      onCancel();
    }
  };

  return (
    <input
      ref={inputRef}
      type='number'
      min={1}
      max={totalPages}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') commit();
        if (e.key === 'Escape') onCancel();
      }}
      placeholder='#'
      className='w-12 h-8 text-center rounded-lg border border-neutral-300 text-md font-medium text-neutral-950 tracking-t-3 outline-none'
    />
  );
}

// --- Pagination ---
export default function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  const [isEditingMobile, setIsEditingMobile] = useState(false);
  const [isEditingEllipsis, setIsEditingEllipsis] = useState(false);
  const visiblePages = getVisiblePages(page, totalPages);

  const goPrevious = () => onPageChange(Math.max(1, page - 1));
  const goNext = () => onPageChange(Math.min(totalPages, page + 1));

  return (
    <div className={cn('flex items-center gap-xl w-full', className)}>
      {/* Previous */}
      <button
        type='button'
        disabled={page <= 1}
        onClick={goPrevious}
        className='cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex gap-1.5 items-center font-medium text-neutral-950 tracking-t-3 text-md shrink-0'
      >
        <img src={chevronLeftIcon} alt='' className='size-6' />
        <span className='hidden md:inline'>Previous</span>
      </button>

      {/* Mobile */}
      <div className='flex md:hidden flex-1 items-center justify-center'>
        {isEditingMobile ? (
          <PageInput
            totalPages={totalPages}
            onSubmit={(p) => {
              onPageChange(p);
              setIsEditingMobile(false);
            }}
            onCancel={() => setIsEditingMobile(false)}
          />
        ) : (
          <button
            type='button'
            onClick={() => setIsEditingMobile(true)}
            className='cursor-pointer font-medium text-neutral-950 tracking-t-3 text-md'
          >
            Page {page} of {totalPages}
          </button>
        )}
      </div>

      {/* Desktop */}
      <div className='hidden md:flex items-center flex-1 min-w-0 justify-center'>
        {visiblePages.map((item, idx) =>
          item === 'ellipsis' ? (
            isEditingEllipsis ? (
              <div key={`ellipsis-${idx}`} className='flex items-center justify-center size-10 shrink-0'>
                <PageInput
                  totalPages={totalPages}
                  onSubmit={(p) => {
                    onPageChange(p);
                    setIsEditingEllipsis(false);
                  }}
                  onCancel={() => setIsEditingEllipsis(false)}
                />
              </div>
            ) : (
              <button
                key={`ellipsis-${idx}`}
                type='button'
                onClick={() => setIsEditingEllipsis(true)}
                className='cursor-pointer flex flex-col items-center justify-center p-md size-10 font-medium tracking-t-3 text-md text-neutral-950 shrink-0'
              >
                ...
              </button>
            )
          ) : (
            <button
              key={item}
              type='button'
              onClick={() => onPageChange(item)}
              className={cn(
                'cursor-pointer flex flex-col items-center justify-center p-md size-10 font-medium tracking-t-3 text-md text-neutral-950 shrink-0',
                item === page && 'border border-neutral-300 rounded-lg'
              )}
            >
              {item}
            </button>
          )
        )}
      </div>

      {/* Next */}
      <button
        type='button'
        disabled={page >= totalPages}
        onClick={goNext}
        className='cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex gap-1.5 items-center font-medium text-neutral-950 tracking-t-3 text-md shrink-0'
      >
        <span className='hidden md:inline'>Next</span>
        <img src={chevronRightIcon} alt='' className='size-6' />
      </button>
    </div>
  );
}
