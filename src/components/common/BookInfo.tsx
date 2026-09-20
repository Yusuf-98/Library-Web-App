import type { ReactNode } from 'react';
import { optimizeImageUrl } from '@/lib/imageUrl';
import { cn } from '@/lib/utils';

interface BookInfoProps {
  cover: string;
  title: string;
  author: string;
  category: string;
  className?: string;
  coverClassName?: string;
  titleClassName?: string;
  children?: ReactNode;
}

// --- Styles ---
const DEFAULT_COVER =
  'w-17.5 h-26.5 md:w-[clamp(70.08px,calc(45.03px+3.262vw),92px)] md:h-[clamp(106.08px,calc(69.51px+4.762vw),138.08px)] object-cover shrink-0';
const DEFAULT_TITLE =
  'font-bold text-neutral-950 tracking-t-2 md:tracking-t-3 text-md md:text-lg';

export default function BookInfo({
  cover,
  title,
  author,
  category,
  className,
  coverClassName,
  titleClassName,
  children,
}: BookInfoProps) {
  return (
    <div className={cn('flex items-center gap-lg md:gap-xl', className)}>
      {/* Cover */}
      <img src={optimizeImageUrl(cover, 200)} alt={title} loading="lazy" className={cn(DEFAULT_COVER, coverClassName)} />
      {/* Details */}
      <div className="flex flex-col gap-xs w-49">
        <span className="inline-flex self-start border border-neutral-300 rounded-sm px-md text-sm font-bold text-neutral-950 tracking-t-2">
          {category}
        </span>
        <p className={cn(DEFAULT_TITLE, titleClassName)}>{title}</p>
        <p className="font-medium text-neutral-700 tracking-t-3 text-sm md:text-md">{author}</p>
        {children}
      </div>
    </div>
  );
}
