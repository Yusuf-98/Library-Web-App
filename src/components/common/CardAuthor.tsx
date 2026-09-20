import BookIcon from '@/assets/icons/book.svg';
import authorImage from '@/assets/images/author-image.png';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface CardAuthorProps {
  name: string;
  bookCount: number;
  avatar?: string;
  onClick?: () => void;
  className?: string;
}

export default function CardAuthor({
  name,
  bookCount,
  avatar,
  onClick,
  className,
}: CardAuthorProps) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        'cursor-pointer bg-white rounded-xl shadow-card flex items-center text-left w-full',
        'p-lg gap-lg md:p-[clamp(12px,calc(7.43px+0.595vw),16px)] md:gap-[clamp(12px,calc(7.43px+0.595vw),16px)]',
        'transition-transform duration-500 ease-in-out hover-scale-105',
        className
      )}
    >
      {/* Avatar */}
      <img
        src={avatar || authorImage}
        alt={name}
        loading='lazy'
        className='rounded-full object-cover shrink-0 size-15 md:size-[clamp(60px,calc(36px+3.125vw),81px)]'
      />

      {/* Info */}
      <div className='flex flex-col gap-0.5 min-w-0'>
        <p className='font-bold text-neutral-900 tracking-t-2 md:tracking-t-3 truncate text-md md:text-[clamp(16px,calc(13.71px+0.298vw),18px)]'>
          {name}
        </p>
        <div className='flex items-center gap-1.5'>
          <img src={BookIcon} alt='book icon' className='size-6 shrink-0' />
          <span className='font-medium text-neutral-950 tracking-t-3 text-sm md:text-[clamp(14px,calc(11.71px+0.298vw),16px)]'>
            {bookCount} books
          </span>
        </div>
      </div>
    </button>
  );
}

/** Loading placeholder with the same box model as CardAuthor. */
export function CardAuthorSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden='true'
      className={cn(
        'bg-white rounded-xl shadow-card flex items-center w-full',
        'p-lg gap-lg md:p-[clamp(12px,calc(7.43px+0.595vw),16px)] md:gap-[clamp(12px,calc(7.43px+0.595vw),16px)]',
        className
      )}
    >
      <Skeleton className='rounded-full shrink-0 size-15 md:size-[clamp(60px,calc(36px+3.125vw),81px)]' />
      <div className='flex flex-col gap-0.5 min-w-0'>
        <div className='w-32 text-md md:text-[clamp(16px,calc(13.71px+0.298vw),18px)]'>
          <Skeleton>&nbsp;</Skeleton>
        </div>
        <div className='flex items-center gap-1.5'>
          <span className='size-6 shrink-0' />
          <div className='w-16 text-sm md:text-[clamp(14px,calc(11.71px+0.298vw),16px)]'>
            <Skeleton>&nbsp;</Skeleton>
          </div>
        </div>
      </div>
    </div>
  );
}
