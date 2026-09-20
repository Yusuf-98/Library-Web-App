import type { CartItem } from '@/types';
import ListCart from '@/components/user/ListCart';
import { FadeInUp } from '@/components/common/StaggeredItems';
import checkIcon from '@/assets/icons/check.svg';

interface CartItemListSectionProps {
  items: CartItem[];
  selectedIds: Set<number> | null;
  allSelected: boolean;
  onToggleAll: () => void;
  onToggleItem: (itemId: number) => void;
  onRemove: (itemId: number) => void;
}

export default function CartItemListSection({
  items,
  selectedIds,
  allSelected,
  onToggleAll,
  onToggleItem,
  onRemove,
}: CartItemListSectionProps) {
  return (
    <div className='flex-1 min-w-0 flex flex-col gap-xl md:gap-3xl items-start'>
      {/* Select all */}
      <div className='flex items-center gap-xl'>
        <button
          type='button'
          role='checkbox'
          aria-checked={allSelected}
          onClick={onToggleAll}
          className={`cursor-pointer size-5 rounded-sm shrink-0 flex items-center justify-center ${allSelected ? 'bg-primary-300' : 'border border-neutral-400'}`}
        >
          {allSelected && <img src={checkIcon} alt='' className='size-3.5' />}
        </button>
        <span className='font-semibold text-neutral-950 tracking-t-2 text-md'>
          Select All
        </span>
      </div>

      {/* Items */}
      {items.map((item, index) => (
        <FadeInUp
          key={item.id}
          delay={(index % 3) * 250}
          className='flex flex-col gap-xl md:gap-3xl w-full'
        >
          <ListCart
            title={item.book.title}
            author={item.book.author.name}
            category={item.book.category.name}
            cover={item.book.coverImage}
            checked={!!selectedIds?.has(item.id)}
            onToggle={() => onToggleItem(item.id)}
            onRemove={() => onRemove(item.id)}
          />
          {index < items.length - 1 && (
            <div className='h-px w-full bg-neutral-200' />
          )}
        </FadeInUp>
      ))}
    </div>
  );
}
