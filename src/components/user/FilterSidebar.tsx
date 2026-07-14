import { cn } from '@/lib/utils';
import checkIcon from '@/assets/icons/check.svg';
import star24 from '@/assets/icons/star-24.svg';

interface FilterSidebarProps {
  categories: { id: number; name: string }[];
  selectedCategoryId?: number;
  onCategoryChange: (categoryId: number | undefined) => void;
  selectedRating?: number;
  onRatingChange: (rating: number | undefined) => void;
  className?: string;
}

function FilterCheckbox({ checked }: { checked: boolean }) {
  return (
    <div
      className={cn(
        'size-5 rounded-sm shrink-0 flex items-center justify-center',
        checked ? 'bg-primary-300' : 'border border-neutral-400',
      )}
    >
      {checked && <img src={checkIcon} alt="" className="size-3.5" />}
    </div>
  );
}

export default function FilterSidebar({
  categories,
  selectedCategoryId,
  onCategoryChange,
  selectedRating,
  onRatingChange,
  className,
}: FilterSidebarProps) {
  return (
    <div className={cn('bg-white rounded-xl flex flex-col gap-3xl py-xl shrink-0 w-66.5', className)}>
      {/* Category */}
      <div className="flex flex-col gap-2.5 px-xl">
        <p className="text-md font-extrabold text-neutral-950">FILTER</p>
        <p className="text-lg font-extrabold text-neutral-950 tracking-t-2">Category</p>
        {categories.map((category) => {
          const checked = selectedCategoryId === category.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onCategoryChange(checked ? undefined : category.id)}
              className="cursor-pointer flex items-center gap-md w-full text-left"
            >
              <FilterCheckbox checked={checked} />
              <span className="text-md font-medium text-neutral-950 tracking-t-3">{category.name}</span>
            </button>
          );
        })}
      </div>

      <div className="h-px w-full bg-neutral-200" />

      {/* Rating */}
      <div className="flex flex-col gap-2.5 px-xl items-center">
        <p className="text-lg font-extrabold text-neutral-950 tracking-t-2 w-full">Rating</p>
        <div className="flex flex-col items-start w-full">
          {[5, 4, 3, 2, 1].map((star) => {
            const checked = selectedRating === star;
            return (
              <button
                key={star}
                type="button"
                onClick={() => onRatingChange(checked ? undefined : star)}
                className="cursor-pointer flex items-center gap-md w-full p-md"
              >
                <FilterCheckbox checked={checked} />
                <span className="flex items-center gap-xxs">
                  <img src={star24} alt="" className="size-6" />
                  <span className="text-md font-normal text-neutral-950 tracking-t-2">{star}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
