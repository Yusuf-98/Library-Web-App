import { optimizeImageUrl } from '@/lib/imageUrl';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CardAdminBorrowedListProps {
  title: string;
  author: string;
  category: string;
  cover: string;
  displayStatus: string;
  dueAt: string;
  borrowedAt: string;
  durationDays: number;
  borrowerName: string;
  canReturn: boolean;
  onMarkReturned?: () => void;
  className?: string;
}

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  Active: { bg: 'bg-success/5', text: 'text-success' },
  Returned: { bg: 'bg-success/5', text: 'text-success' },
  Overdue: { bg: 'bg-danger/5', text: 'text-danger' },
};

export default function CardAdminBorrowedList({
  title,
  author,
  category,
  cover,
  displayStatus,
  dueAt,
  borrowedAt,
  durationDays,
  borrowerName,
  canReturn,
  onMarkReturned,
  className,
}: CardAdminBorrowedListProps) {
  const statusStyle = STATUS_STYLE[displayStatus] ?? STATUS_STYLE.Active;

  const bookInfo = (
    <div className="flex flex-col gap-xs w-49">
      <span className="inline-flex self-start border border-neutral-300 rounded-sm px-md text-sm font-bold text-neutral-950 tracking-t-2">
        {category}
      </span>
      <p className="font-bold text-neutral-950 tracking-t-2 text-md md:text-xl">{title}</p>
      <p className="font-medium text-neutral-700 tracking-t-3 text-sm md:text-md">{author}</p>
      <div className="flex items-center gap-md">
        <span className="font-bold text-neutral-950 tracking-t-2 text-sm md:text-md whitespace-nowrap">{borrowedAt}</span>
        <span className="size-0.5 rounded-full bg-neutral-950 shrink-0" />
        <span className="font-bold text-neutral-950 tracking-t-2 text-sm md:text-md whitespace-nowrap">Duration {durationDays} Days</span>
      </div>
    </div>
  );

  const borrowerInfo = (
    <>
      <div className="flex flex-col">
        <span className="font-semibold text-neutral-950 tracking-t-2 text-sm md:text-md">borrower's name</span>
        <span className="font-bold text-neutral-950 tracking-t-2 text-md md:text-xl">{borrowerName}</span>
      </div>
      {canReturn && (
        <Button type="button" variant="outline" className="w-full md:w-45.5 h-10" onClick={onMarkReturned}>
          Mark Returned
        </Button>
      )}
    </>
  );

  return (
    <div className={cn('bg-white rounded-2xl shadow-card flex flex-col gap-xl md:gap-2xl p-xl md:p-2xl w-full', className)}>
      <div className="flex items-start justify-between w-full flex-wrap gap-xs">
        <div className="flex items-center gap-lg">
          <span className="font-bold text-neutral-950 tracking-t-2 text-sm md:text-md">Status</span>
          <span className={cn('h-8 flex items-center justify-center px-md rounded-xs', statusStyle.bg, statusStyle.text, 'font-bold text-sm tracking-t-2')}>
            {displayStatus}
          </span>
        </div>
        <div className="flex items-center gap-lg">
          <span className="font-bold text-neutral-950 tracking-t-2 text-sm md:text-md">Due Date</span>
          <span className="flex items-center px-md py-xxs rounded-xs bg-danger/10 text-danger font-bold text-sm tracking-t-2">
            {dueAt}
          </span>
        </div>
      </div>

      <div className="h-px w-full bg-neutral-300" />

      {/* Mobile: stacked */}
      <div className="flex flex-col gap-lg w-full md:hidden">
        <img src={optimizeImageUrl(cover, 200)} alt={title} loading="lazy" className="w-23 h-34.5 object-cover shrink-0" />
        {bookInfo}
        <div className="h-px w-full bg-neutral-300" />
        <div className="flex flex-col gap-md">{borrowerInfo}</div>
      </div>

      {/* Desktop: side by side */}
      <div className="hidden md:flex items-center justify-center w-full">
        <div className="flex flex-1 gap-xl items-center min-w-0">
          <img src={optimizeImageUrl(cover, 200)} alt={title} loading="lazy" className="w-23 h-34.5 object-cover shrink-0" />
          {bookInfo}
        </div>
        <div className="flex flex-col items-end gap-md">{borrowerInfo}</div>
      </div>
    </div>
  );
}
