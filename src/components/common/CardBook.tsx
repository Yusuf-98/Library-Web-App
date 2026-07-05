import StarIcon from '@/assets/icons/star-24.svg';
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
      <img src={cover} alt={title} className='w-full aspect-2/3 object-cover' />

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
