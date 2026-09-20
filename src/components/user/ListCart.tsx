import { cn } from '@/lib/utils';
import checkIcon from '@/assets/icons/check.svg';
import trashIcon from '@/assets/icons/trash-red.svg';
import BookInfo from '@/components/common/BookInfo';

interface ListCartProps {
  title: string;
  author: string;
  category: string;
  cover: string;
  checked: boolean;
  onToggle: () => void;
  onRemove: () => void;
  className?: string;
}

export default function ListCart({
  title,
  author,
  category,
  cover,
  checked,
  onToggle,
  onRemove,
  className,
}: ListCartProps) {
  return (
    <div className={cn('flex items-start justify-between gap-xl w-full', className)}>
      <div className="flex items-start gap-xl">
        {/* Checkbox */}
        <button
          type="button"
          role="checkbox"
          aria-checked={checked}
          onClick={onToggle}
          className={cn(
            'cursor-pointer mt-0.75 size-5 rounded-sm shrink-0 flex items-center justify-center',
            checked ? 'bg-primary-300' : 'border border-neutral-400',
          )}
        >
          {checked && <img src={checkIcon} alt="" className="size-3.5" />}
        </button>

        {/* Book */}
        <BookInfo cover={cover} title={title} author={author} category={category} />
      </div>

      {/* Remove */}
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove from cart"
        className="cursor-pointer shrink-0 size-5 flex items-center justify-center"
      >
        <img src={trashIcon} alt="" className="size-5" />
      </button>
    </div>
  );
}
