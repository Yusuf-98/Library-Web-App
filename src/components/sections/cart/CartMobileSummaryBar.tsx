import { Button } from '@/components/ui/button';

interface CartMobileSummaryBarProps {
  selectedCount: number;
  onBorrow: () => void;
}

export default function CartMobileSummaryBar({
  selectedCount,
  onBorrow,
}: CartMobileSummaryBarProps) {
  return (
    <div className='md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-card h-18 px-xl flex items-center justify-between'>
      {/* Total */}
      <div className='flex flex-col'>
        <p className='font-medium text-neutral-950 tracking-t-3 text-sm'>
          Total Book
        </p>
        <p className='font-bold text-neutral-950 tracking-t-2 text-sm'>
          {selectedCount} Items
        </p>
      </div>
      {/* Borrow button */}
      <Button
        type='button'
        variant='primary'
        className='w-37.5 h-10 text-sm'
        onClick={onBorrow}
      >
        Borrow Book
      </Button>
    </div>
  );
}
