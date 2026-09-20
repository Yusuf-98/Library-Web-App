import starIcon from '@/assets/icons/star-24.svg';
import { cn } from '@/lib/utils';

interface CardReviewProps {
  name: string;
  avatar?: string;
  rating: number;
  date: string;
  comment: string;
  isOwn?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

export default function CardReview({
  name,
  avatar,
  rating,
  date,
  comment,
  isOwn,
  onEdit,
  onDelete,
  className,
}: CardReviewProps) {
  return (
    <div className={cn('bg-white rounded-2xl shadow-card p-xl flex flex-col gap-xl', className)}>
      {/* Header */}
      <div className="flex items-center gap-lg">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            loading="lazy"
            className="rounded-full object-cover shrink-0 size-[clamp(58px,calc(51.14px+0.893vw),64px)]"
          />
        ) : (
          <div className="rounded-full bg-primary-150 text-primary-300 font-bold flex items-center justify-center shrink-0 size-[clamp(58px,calc(51.14px+0.893vw),64px)]">
            {name.trim().slice(0, 2).toUpperCase()}
          </div>
        )}
        <div className="flex flex-col flex-1 min-w-0">
          <p className="font-bold text-neutral-950 tracking-t-2 truncate text-sm md:text-[clamp(14px,calc(9.43px+0.595vw),18px)]">
            {name}
          </p>
          <p className="font-medium text-neutral-950 tracking-t-3 text-sm md:text-[clamp(14px,calc(11.71px+0.298vw),16px)]">
            {date}
          </p>
        </div>
        {isOwn && (
          <div className="flex items-center gap-md shrink-0">
            <button
              type="button"
              onClick={onEdit}
              className="cursor-pointer text-sm font-semibold text-primary-300 tracking-t-2"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="cursor-pointer text-sm font-semibold text-accent-red tracking-t-2"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-md w-full">
        <div className="flex items-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <img
              key={i}
              src={starIcon}
              alt=""
              className={cn('size-6', i < rating ? '' : 'opacity-30')}
            />
          ))}
        </div>
        <p className="font-semibold text-neutral-950 tracking-t-2 text-sm md:text-[clamp(14px,calc(11.71px+0.298vw),16px)]">
          {comment}
        </p>
      </div>
    </div>
  );
}
