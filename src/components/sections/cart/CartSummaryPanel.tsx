import { Button } from '@/components/ui/button';

interface CartSummaryPanelProps {
  selectedCount: number;
  onBorrow: () => void;
}

export default function CartSummaryPanel({
  selectedCount,
  onBorrow,
}: CartSummaryPanelProps) {
  return (
    <div className='hidden md:flex flex-col gap-3xl bg-white shadow-card rounded-2xl p-2xl w-79.5 shrink-0'>
      {/* Heading */}
      <p className='font-bold text-neutral-950 tracking-t-2 text-xl'>
        Loan Summary
      </p>
      {/* Total */}
      <div className='flex items-center justify-between w-full text-md'>
        <p className='font-medium text-neutral-950 tracking-t-3'>Total Book</p>
        <p className='font-bold text-neutral-950 tracking-t-2'>
          {selectedCount} Items
        </p>
      </div>
      {/* Borrow button */}
      <Button type='button' variant='primary' className='w-full' onClick={onBorrow}>
        Borrow Book
      </Button>
    </div>
  );
}
