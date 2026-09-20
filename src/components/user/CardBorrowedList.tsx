import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import BookInfo from '@/components/common/BookInfo';

interface CardBorrowedListProps {
  title: string;
  author: string;
  category: string;
  cover: string;
  displayStatus: string;
  dueAt: string;
  borrowedAt: string;
  durationDays: number;
  onGiveReview?: () => void;
  className?: string;
}

const STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  Active: { bg: 'bg-success/5', text: 'text-success' },
  Returned: { bg: 'bg-success/5', text: 'text-success' },
  Overdue: { bg: 'bg-danger/5', text: 'text-danger' },
};

export default function CardBorrowedList({
  title,
  author,
  category,
  cover,
  displayStatus,
  dueAt,
  borrowedAt,
  durationDays,
  onGiveReview,
  className,
}: CardBorrowedListProps) {
  const statusStyle = STATUS_STYLE[displayStatus] ?? STATUS_STYLE.Active;

  return (
    <div className={cn('bg-white rounded-2xl shadow-card flex flex-col gap-xl md:gap-2xl p-xl md:p-2xl w-full', className)}>
      {/* Status */}
      <div className="flex items-start justify-between w-full flex-wrap gap-xs">
        <div className="flex items-center gap-xs md:gap-lg">
          <span className="font-bold text-neutral-950 tracking-t-2 text-sm md:text-md">Status</span>
          <span className={cn('h-8 flex items-center justify-center px-md rounded-xs', statusStyle.bg, statusStyle.text, 'font-bold text-sm tracking-t-2')}>
            {displayStatus}
          </span>
        </div>
        <div className="flex items-center gap-xs md:gap-lg">
          <span className="font-bold text-neutral-950 tracking-t-2 text-sm md:text-md">Due Date</span>
          <span className="flex items-center px-md py-xxs rounded-xs bg-danger/10 text-danger font-bold text-sm tracking-t-2">
            {dueAt}
          </span>
        </div>
      </div>

      <div className="h-px w-full bg-neutral-300" />

      {/* Book */}
      <div className="flex flex-col gap-3xl md:gap-0 md:flex-row md:items-center md:justify-between w-full">
        <BookInfo
          cover={cover}
          title={title}
          author={author}
          category={category}
          className="gap-xl"
          coverClassName="w-23 h-34.5"
          titleClassName="font-bold text-neutral-950 tracking-t-2 text-md md:text-xl"
        >
          <div className="flex items-center gap-md">
            <span className="font-bold text-neutral-950 tracking-t-2 text-sm md:text-md">{borrowedAt}</span>
            <span className="size-0.5 rounded-full bg-neutral-950" />
            <span className="font-bold text-neutral-950 tracking-t-2 text-sm md:text-md">Duration {durationDays} Days</span>
          </div>
        </BookInfo>

        <Button
          type="button"
          variant="primary"
          onClick={onGiveReview}
          disabled={displayStatus !== 'Returned'}
          className="w-full md:w-45.5 h-10"
        >
          Give Review
        </Button>
      </div>
    </div>
  );
}
