import { cn } from '@/lib/utils';
import BookInfo from '@/components/common/BookInfo';
import starIcon from '@/assets/icons/star-24.svg';

interface CardMyReviewProps {
  createdAt: string;
  title: string;
  author: string;
  category: string;
  cover: string;
  rating: number;
  comment: string;
  className?: string;
}

export default function CardMyReview({
  createdAt,
  title,
  author,
  category,
  cover,
  rating,
  comment,
  className,
}: CardMyReviewProps) {
  return (
    <div className={cn('bg-white rounded-2xl shadow-card flex flex-col gap-xl md:gap-2xl p-xl md:p-2xl w-full', className)}>
      <p className="font-semibold text-neutral-950 tracking-t-2 text-sm md:text-md">{createdAt}</p>

      <div className="h-px w-full bg-neutral-300" />

      <BookInfo cover={cover} title={title} author={author} category={category} />

      <div className="h-px w-full bg-neutral-300" />

      <div className="flex flex-col gap-md w-full">
        <div className="flex gap-0.5 items-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <img key={i} src={starIcon} alt="" className={cn('size-6', i < rating ? '' : 'opacity-30')} />
          ))}
        </div>
        <p className="font-semibold text-neutral-950 tracking-t-2 text-sm md:text-md">{comment}</p>
      </div>
    </div>
  );
}
