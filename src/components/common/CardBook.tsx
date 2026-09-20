import StarIcon from '@/assets/icons/star-24.svg';
import { Skeleton } from '@/components/ui/skeleton';
import { optimizeImageUrl } from '@/lib/imageUrl';
import { cn } from '@/lib/utils';

interface CardBookProps {
  title: string;
  author: string;
  cover: string;
  rating: number;
  onClick?: () => void;
  className?: string;
}

export default function CardBook({
  title,
  author,
  cover,
  rating,
  onClick,
  className,
}: CardBookProps) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        'cursor-pointer bg-white rounded-xl shadow-card text-left overflow-hidden flex flex-col w-50 transition-transform duration-500 ease-in-out hover-scale-102',
        className
      )}
    >
      {/* Cover */}
      <img
        src={optimizeImageUrl(cover, 400)}
        alt={title}
        loading='lazy'
        className='w-full aspect-2/3 object-cover'
      />

      {/* Info */}
      <div className='flex flex-col w-full p-xl gap-1'>
        <p className='font-bold text-neutral-900 tracking-t-3 line-clamp-1 text-lg'>
          {title}
        </p>
        <p className='font-medium text-neutral-700 tracking-t-3 line-clamp-1 text-md'>
          {author}
        </p>

        {/* Rating */}
        <div className='flex items-center gap-0.5'>
          <img src={StarIcon} alt='star icon' className='size-6 shrink-0' />
          <span className='font-semibold text-neutral-900 tracking-t-2 text-md'>
            {rating.toFixed(1)}
          </span>
        </div>
      </div>
    </button>
  );
}

/** Loading placeholder with the same box model as CardBook, so nothing moves when the real card arrives. */
export function CardBookSkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden='true'
      className={cn(
        'bg-white rounded-xl shadow-card overflow-hidden flex flex-col w-50',
        className
      )}
    >
      <Skeleton className='w-full aspect-2/3 rounded-none' />
      <div className='flex flex-col w-full p-xl gap-1'>
        <div className='text-lg'>
          <Skeleton className='w-3/4'>&nbsp;</Skeleton>
        </div>
        <div className='text-md'>
          <Skeleton className='w-1/2'>&nbsp;</Skeleton>
        </div>
        <div className='flex items-center gap-0.5'>
          <span className='size-6 shrink-0' />
          <div className='text-md w-10'>
            <Skeleton>&nbsp;</Skeleton>
          </div>
        </div>
      </div>
    </div>
  );
}
