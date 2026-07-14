import type { CartItem, CheckoutUser } from '@/types';
import BookInfo from '@/components/common/BookInfo';
import { FadeInUp } from '@/components/common/StaggeredItems';

interface CheckoutSummarySectionProps {
  user: CheckoutUser;
  items: CartItem[];
}

export default function CheckoutSummarySection({
  user,
  items,
}: CheckoutSummarySectionProps) {
  return (
    <div className='flex flex-col gap-[clamp(16px,calc(-2.29px+2.381vw),32px)] w-full'>
      {/* User information */}
      <div className='flex flex-col gap-[clamp(8px,calc(-1.14px+1.19vw),16px)] w-full'>
        <p className='font-bold text-neutral-950 tracking-t-3 md:tracking-t-none text-lg md:text-[clamp(18.08px,calc(11.31px+0.881vw),24px)]'>
          User Information
        </p>
        <div className='flex items-center justify-between h-7.5 w-full text-sm md:text-md'>
          <p className='font-medium text-neutral-950 tracking-t-3'>Name</p>
          <p className='font-bold text-neutral-950 tracking-t-2'>{user.name}</p>
        </div>
        <div className='flex items-center justify-between h-7.5 w-full text-sm md:text-md'>
          <p className='font-medium text-neutral-950 tracking-t-3'>Email</p>
          <p className='font-bold text-neutral-950 tracking-t-2'>{user.email}</p>
        </div>
        <div className='flex items-center justify-between h-7.5 w-full text-sm md:text-md'>
          <p className='font-medium text-neutral-950 tracking-t-3'>
            Nomor Handphone
          </p>
          <p className='font-bold text-neutral-950 tracking-t-2'>
            {user.nomorHandphone}
          </p>
        </div>
      </div>

      <div className='h-px w-full bg-neutral-300' />

      {/* Book list */}
      <div className='flex flex-col gap-xl w-full'>
        <p className='font-bold text-neutral-950 tracking-t-3 md:tracking-t-none text-lg md:text-[clamp(18.08px,calc(11.31px+0.881vw),24px)]'>
          Book List
        </p>
        {items.map((item, index) => (
          <FadeInUp key={item.id} delay={(index % 3) * 250}>
            <BookInfo
              cover={item.book.coverImage}
              title={item.book.title}
              author={item.book.author.name}
              category={item.book.category.name}
              className='w-full'
              titleClassName='font-bold text-neutral-950 tracking-t-2 text-md md:text-[clamp(16px,calc(11.43px+0.595vw),20px)]'
            />
          </FadeInUp>
        ))}
      </div>
    </div>
  );
}
