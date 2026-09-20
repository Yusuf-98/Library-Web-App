import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface CardCategoryProps {
  name: string;
  icon: string;
  onClick?: () => void;
  className?: string;
}

export default function CardCategory({
  name,
  icon,
  onClick,
  className,
}: CardCategoryProps) {
  return (
    <button
      type='button'
      onClick={onClick}
      className={cn(
        'cursor-pointer bg-white rounded-2xl shadow-card',
        'w-full flex-1 min-w-0 flex flex-col items-start justify-center gap-lg',
        'p-md md:p-[clamp(8px,calc(3.43px+0.595vw),12px)]',
        'transition-transform duration-500 ease-in-out hover-scale-105',
        className
      )}
    >
      {/* Icon container */}
      <div className='w-full bg-primary-150 flex items-center justify-center shrink-0 p-1.4 md:p-[clamp(5.6px,calc(4.69px+0.119vw),6.4px)] rounded-[10.56px] md:rounded-[clamp(10.56px,calc(8.91px+0.214vw),12px)]'>
        <img
          src={icon}
          alt={name}
          className='object-cover size-11.2 md:size-[clamp(44.8px,calc(37.49px+0.952vw),51.2px)]'
        />
      </div>

      {/* Name */}
      <p className='font-semibold text-neutral-950 md:tracking-t-2 truncate w-full text-left text-xs md:text-[clamp(12px,calc(7.43px+0.595vw),16px)]'>
        {name}
      </p>
    </button>
  );
}

// --- Skeleton ---
export function CardCategorySkeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden='true'
      className={cn(
        'bg-white rounded-2xl shadow-card',
        'w-full flex-1 min-w-0 flex flex-col items-start justify-center gap-lg',
        'p-md md:p-[clamp(8px,calc(3.43px+0.595vw),12px)]',
        className
      )}
    >
      {/* Icon */}
      <div className='w-full flex items-center justify-center shrink-0 md:p-[clamp(5.6px,calc(4.69px+0.119vw),6.4px)]'>
        <Skeleton className='size-13 md:size-[clamp(44.8px,calc(37.49px+0.952vw),51.2px)] rounded-lg' />
      </div>
      <div className='w-full text-xs md:text-[clamp(12px,calc(7.43px+0.595vw),16px)]'>
        <Skeleton className='w-2/3'>&nbsp;</Skeleton>
      </div>
    </div>
  );
}
