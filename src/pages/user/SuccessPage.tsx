import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '@/components/shared/Navbar';
import { FadeInUp } from '@/components/common/StaggeredItems';
import { Button } from '@/components/ui/button';
import { useAppSelector } from '@/app/hooks';
import { useCartCount } from '@/features/cart/useCartCount';
import { formatLongDate } from '@/lib/utils';
import successCheck from '@/assets/icons/success-check.svg';

export default function SuccessPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const cartCount = useCartCount();
  const user = useAppSelector((s) => s.auth.user);

  const returnDate = (location.state as { returnDate?: string } | null)
    ?.returnDate;

  return (
    <div className='min-h-screen bg-neutral-50 flex flex-col'>
      <Navbar
        variant='default'
        cartCount={cartCount}
        userName={user?.name}
        avatarSrc={user?.profilePhoto ?? undefined}
        onLogoClick={() => navigate('/')}
        onCartClick={() => navigate('/cart')}
      />

      <main className='flex-1 flex items-center justify-center custom-container py-45 md:py-59'>
        <FadeInUp className='flex flex-col items-center gap-3xl md:gap-4xl w-full max-w-159.5'>
          {/* Success icon */}
          <img src={successCheck} alt='' className='size-29.25 mb-4' />

          {/* Title + subtitle */}
          <div className='flex flex-col items-center gap-md text-center w-full'>
            <p className='font-bold text-neutral-950 tracking-t-2 text-xl md:text-[clamp(20px,calc(10.86px+1.19vw),28px)]'>
              Borrowing Successful!
            </p>
            <p className='font-semibold text-neutral-950 tracking-t-2 text-md md:text-[clamp(16px,calc(13.71px+0.298vw),18px)]'>
              Your book has been successfully borrowed. Please return it by{' '}
              {returnDate && (
                <span className='text-danger'>
                  {formatLongDate(returnDate)}
                </span>
              )}
            </p>
          </div>

          {/* CTA */}
          <Button
            type='button'
            variant='primary'
            className='w-71.5'
            onClick={() => navigate('/loans')}
          >
            See Borrowed List
          </Button>
        </FadeInUp>
      </main>
    </div>
  );
}
