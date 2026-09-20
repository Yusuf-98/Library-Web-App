import { toast } from 'sonner';
import type { Book } from '@/types';
import { optimizeImageUrl } from '@/lib/imageUrl';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import star24 from '@/assets/icons/star-24.svg';
import shareIcon from '@/assets/icons/share.svg';

interface DetailBookProps {
  book: Book;
  onAuthorClick: () => void;
  onAddToCart: () => void;
  onBorrow: () => void;
  isInCart: boolean;
  isAddingToCart: boolean;
  isBorrowing: boolean;
  outOfStock: boolean;
}

export default function DetailBook({
  book,
  onAuthorClick,
  onAddToCart,
  onBorrow,
  isInCart,
  isAddingToCart,
  isBorrowing,
  outOfStock,
}: DetailBookProps) {
  // --- Share ---
  const shareText = `${book.title} by ${book.author.name}`;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleShareWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${shareText} - ${shareUrl}`)}`,
      '_blank'
    );
  };

  const handleShareEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(book.title)}&body=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success('Link copied to clipboard.');
  };

  return (
    <>
      <div className='flex flex-col md:flex-row gap-9 items-center'>
        {/* Cover image */}
        <div className='bg-neutral-200 p-1.25 md:p-[clamp(5px,calc(1.57px+0.446vw),8px)] shrink-0'>
          <img
            src={optimizeImageUrl(book.coverImage, 640)}
            alt={book.title}
            className='object-cover aspect-2/3 w-53 md:w-[clamp(212px,calc(87.43px+16.22vw),321px)]'
          />
        </div>

        <div className='flex-1 min-w-0 flex flex-col gap-[clamp(16px,calc(11.43px+0.595vw),20px)] w-full'>
          <div className='flex flex-col gap-[clamp(12px,calc(0.57px+1.488vw),22px)]'>
            {/* Heading */}
            <div className='flex flex-col gap-[clamp(2px,calc(-0.29px+0.298vw),4px)]'>
              <span className='inline-flex self-start border border-neutral-300 rounded-sm px-2 text-sm font-bold text-neutral-950 tracking-t-2'>
                {book.category.name}
              </span>
              <p className='font-bold text-neutral-950 md:tracking-t-2 text-display-xs md:text-[clamp(24px,calc(19.43px+0.595vw),28px)]'>
                {book.title}
              </p>
              <button
                type='button'
                onClick={onAuthorClick}
                className='cursor-pointer font-semibold text-neutral-700 tracking-t-2 text-left text-sm md:text-[clamp(14px,calc(11.71px+0.298vw),16px)]'
              >
                {book.author.name}
              </button>
              <div className='flex items-center gap-0.5'>
                <img src={star24} alt='' className='size-6 shrink-0' />
                <span className='text-md font-bold text-neutral-900 tracking-t-2'>
                  {book.rating.toFixed(1)}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className='flex items-center gap-2xl w-full'>
              <div className='flex flex-col flex-1 md:flex-none md:w-25.5'>
                <span className='font-bold text-neutral-950 tracking-t-3 md:tracking-t-none text-lg md:text-[clamp(18px,calc(11.14px+0.893vw),24px)]'>
                  {book.availableCopies}
                </span>
                <span className='font-medium text-neutral-950 tracking-t-3 text-sm md:text-[clamp(14px,calc(11.71px+0.298vw),16px)]'>
                  Stock
                </span>
              </div>
              <div className='w-px self-stretch bg-neutral-300' />
              <div className='flex flex-col flex-1 md:flex-none md:w-25.5'>
                <span className='font-bold text-neutral-950 tracking-t-3 md:tracking-t-none text-lg md:text-[clamp(18px,calc(11.14px+0.893vw),24px)]'>
                  {book.rating.toFixed(1)}
                </span>
                <span className='font-medium text-neutral-950 tracking-t-3 text-sm md:text-[clamp(14px,calc(11.71px+0.298vw),16px)]'>
                  Rating
                </span>
              </div>
              <div className='w-px self-stretch bg-neutral-300' />
              <div className='flex flex-col flex-1 md:flex-none md:w-25.5'>
                <span className='font-bold text-neutral-950 tracking-t-3 md:tracking-t-none text-lg md:text-[clamp(18px,calc(11.14px+0.893vw),24px)]'>
                  {book.reviewCount}
                </span>
                <span className='font-medium text-neutral-950 tracking-t-3 text-sm md:text-[clamp(14px,calc(11.71px+0.298vw),16px)]'>
                  Reviews
                </span>
              </div>
            </div>
          </div>

          <div className='h-px w-full md:w-139.75 bg-neutral-300' />

          {/* Description */}
          <div className='flex flex-col gap-1'>
            <h2 className='text-xl font-bold text-neutral-950 tracking-t-2'>
              Description
            </h2>
            <p className='font-medium text-neutral-950 tracking-t-3 text-sm md:text-[clamp(14px,calc(11.71px+0.298vw),16px)]'>
              {book.description}
            </p>
          </div>

          {/* Actions */}
          <div className='hidden md:flex items-center gap-lg'>
            <Button
              type='button'
              variant='outline'
              disabled={isInCart || isAddingToCart || outOfStock}
              onClick={onAddToCart}
              className='w-50'
            >
              {isInCart ? 'Added to Cart' : 'Add to Cart'}
            </Button>
            <Button
              type='button'
              variant='primary'
              disabled={outOfStock || isBorrowing}
              onClick={onBorrow}
              className='w-50'
            >
              {outOfStock
                ? 'Out of Stock'
                : isBorrowing
                  ? 'Borrowing...'
                  : 'Borrow Book'}
            </Button>
          </div>
        </div>
      </div>

      {/* Sticky bar */}
      <div className='md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-card px-4 py-4 flex items-center gap-3 z-50'>
        <Button
          type='button'
          variant='outline'
          disabled={isInCart || isAddingToCart || outOfStock}
          onClick={onAddToCart}
          className='flex-1 h-10 text-sm'
        >
          {isInCart ? 'Added to Cart' : 'Add to Cart'}
        </Button>
        <Button
          type='button'
          variant='primary'
          disabled={outOfStock || isBorrowing}
          onClick={onBorrow}
          className='flex-1 h-10 text-sm'
        >
          {outOfStock
            ? 'Out of Stock'
            : isBorrowing
              ? 'Borrowing...'
              : 'Borrow Book'}
        </Button>
        {/* Share menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type='button'
              className='cursor-pointer shrink-0 size-10 flex items-center justify-center rounded-full border border-neutral-300'
              aria-label='Share'
            >
              <img src={shareIcon} alt='' className='size-5' />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align='end'
            className='bg-white shadow-card ring-0 rounded-2xl p-xl flex flex-col gap-xl w-38.5'
          >
            <DropdownMenuItem
              onClick={handleShareWhatsApp}
              className='cursor-pointer w-full p-0 rounded-none font-semibold text-neutral-950 tracking-t-2 text-sm focus:bg-transparent'
            >
              WhatsApp
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleShareEmail}
              className='cursor-pointer w-full p-0 rounded-none font-semibold text-neutral-950 tracking-t-2 text-sm focus:bg-transparent'
            >
              Email
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleCopyLink}
              className='cursor-pointer w-full p-0 rounded-none font-semibold text-neutral-950 tracking-t-2 text-sm focus:bg-transparent'
            >
              Copy Link
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
