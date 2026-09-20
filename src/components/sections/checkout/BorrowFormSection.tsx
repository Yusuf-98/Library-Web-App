import { useState } from 'react';
import { toast } from 'sonner';
import type { CartItem } from '@/types';
import { Button } from '@/components/ui/button';
import DatePicker from '@/components/ui/date-picker';
import { addDaysISO, cn, formatLongDate, todayLocalISO } from '@/lib/utils';
import { useBorrowMutation } from '@/features/checkout/useBorrowMutation';
import checkIcon from '@/assets/icons/check.svg';

const DURATIONS: (3 | 5 | 10)[] = [3, 5, 10];

// --- Radio ---
function Radio({ checked }: { checked: boolean }) {
  return (
    <div
      className={cn(
        'size-6 rounded-full shrink-0 flex items-center justify-center',
        checked ? 'bg-primary-300' : 'border border-neutral-400'
      )}
    >
      {checked && <div className='size-2.5 rounded-full bg-white' />}
    </div>
  );
}

interface BorrowFormSectionProps {
  items: CartItem[];
}

export default function BorrowFormSection({ items }: BorrowFormSectionProps) {
  // --- State ---
  const [borrowDate, setBorrowDate] = useState(todayLocalISO());
  const [days, setDays] = useState<3 | 5 | 10>(3);
  const [agreeReturn, setAgreeReturn] = useState(false);
  const [agreePolicy, setAgreePolicy] = useState(false);

  const returnDate = addDaysISO(borrowDate, days);

  // --- Mutation ---
  const { mutate: confirmBorrow, isPending } = useBorrowMutation(items);

  const canSubmit =
    items.length > 0 && agreeReturn && agreePolicy && !isPending;

  // --- Handlers ---
  const handleSubmit = () => {
    if (items.length === 0) return;
    if (!agreeReturn || !agreePolicy) {
      toast.error('Please agree to both terms before continuing.');
      return;
    }
    confirmBorrow({ days, borrowDate });
  };

  return (
    <div className='bg-white shadow-card rounded-3xl flex flex-col gap-xl md:gap-3xl p-xl md:p-2xl w-full'>
      {/* Heading */}
      <p className='font-bold text-neutral-950 tracking-t-2 text-xl md:text-[clamp(20px,calc(10.86px+1.19vw),28px)]'>
        Complete Your Borrow Request
      </p>

      {/* Borrow date */}
      <div className='flex flex-col gap-0.5 w-full'>
        <label
          htmlFor='borrow-date'
          className='text-sm font-bold text-neutral-950 tracking-t-2 w-full'
        >
          Borrow Date
        </label>
        <DatePicker
          id='borrow-date'
          value={borrowDate}
          min={todayLocalISO()}
          onChange={setBorrowDate}
        />
      </div>

      {/* Duration */}
      <div className='flex flex-col gap-lg w-full'>
        <p className='font-bold text-neutral-950 tracking-t-2 text-sm md:text-md'>
          Borrow Duration
        </p>
        {DURATIONS.map((d) => (
          <button
            key={d}
            type='button'
            onClick={() => setDays(d)}
            className='cursor-pointer flex items-center gap-md md:gap-[clamp(8px,calc(-0.05px+1.048vw),15.04px)]'
          >
            <Radio checked={days === d} />
            <span className='font-semibold text-neutral-950 tracking-t-2 text-sm md:text-md'>
              {d} Days
            </span>
          </button>
        ))}
      </div>

      {/* Return date preview */}
      <div className='bg-primary-100 rounded-xl flex flex-col p-lg md:p-[clamp(12px,calc(7.43px+0.595vw),16px)] w-full'>
        <p className='font-bold text-neutral-950 tracking-t-2 text-sm md:text-md w-full'>
          Return Date
        </p>
        <p className='text-sm md:text-md'>
          <span className='font-medium text-neutral-950 tracking-t-3'>
            Please return the book no later than{' '}
          </span>
          <br className='md:hidden' />
          <span className='font-bold text-danger tracking-t-3 md:tracking-t-2 text-md'>
            {formatLongDate(returnDate)}
          </span>
        </p>
      </div>

      {/* Agreements */}
      <div className='flex flex-col gap-md w-full'>
        <label className='flex items-center gap-md md:gap-xl w-full cursor-pointer'>
          <input
            type='checkbox'
            checked={agreeReturn}
            onChange={(e) => setAgreeReturn(e.target.checked)}
            className='sr-only peer'
          />
          <span className='size-5 rounded-sm border border-neutral-400 shrink-0 flex items-center justify-center peer-checked:bg-primary-300 peer-checked:border-primary-300'>
            {agreeReturn && (
              <img src={checkIcon} alt='' className='size-3.5' />
            )}
          </span>
          <span className='flex-1 font-semibold text-neutral-950 tracking-t-2 text-sm md:text-md'>
            I agree to return the book(s) before the due date.
          </span>
        </label>
        <label className='flex items-center gap-md md:gap-xl w-full cursor-pointer'>
          <input
            type='checkbox'
            checked={agreePolicy}
            onChange={(e) => setAgreePolicy(e.target.checked)}
            className='sr-only peer'
          />
          <span className='size-5 rounded-sm border border-neutral-400 shrink-0 flex items-center justify-center peer-checked:bg-primary-300 peer-checked:border-primary-300'>
            {agreePolicy && (
              <img src={checkIcon} alt='' className='size-3.5' />
            )}
          </span>
          <span className='flex-1 font-semibold text-neutral-950 tracking-t-2 text-sm md:text-md'>
            I accept the library borrowing policy.
          </span>
        </label>
      </div>

      {/* Submit */}
      <Button
        type='button'
        variant='primary'
        className='w-full'
        disabled={!canSubmit}
        onClick={handleSubmit}
      >
        {isPending ? 'Confirming...' : 'Confirm & Borrow'}
      </Button>
    </div>
  );
}
