import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Footer from '@/components/shared/Footer';
import { getCheckout } from '@/lib/api/cart';
import { queryKeys } from '@/lib/queryKeys';
import CheckoutSummarySection from '@/components/sections/checkout/CheckoutSummarySection';
import BorrowFormSection from '@/components/sections/checkout/BorrowFormSection';
import { FadeInUp } from '@/components/common/StaggeredItems';

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const stateItemIds = (location.state as { itemIds?: number[] } | null)
    ?.itemIds;

  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.cart.checkout,
    queryFn: getCheckout,
  });

  const items = useMemo(() => {
    if (!data) return [];
    if (!stateItemIds) return data.items;
    return data.items.filter((i) => stateItemIds.includes(i.id));
  }, [data, stateItemIds]);

  return (
    <>
      <main className='flex-1 custom-container my-8 md:-mb-4'>
        <div className='max-w-250 mx-auto flex flex-col gap-[clamp(16px,calc(-2.29px+2.381vw),32px)]'>
          {/* Title */}
          <FadeInUp>
            <h1 className='font-bold text-neutral-950 text-display-xs md:text-[clamp(24px,calc(10.29px+1.786vw),36px)]'>
              Checkout
            </h1>
          </FadeInUp>

          {/* Loading state */}
          {isLoading && (
            <div className='flex justify-center py-10'>
              <span className='size-8 border-2 border-primary-300/30 border-t-primary-300 rounded-full animate-spin' />
            </div>
          )}

          {/* Error / empty state */}
          {(isError || (!isLoading && items.length === 0)) && (
            <p className='text-sm text-accent-red text-center py-10 tracking-t-2'>
              {isError ? 'Failed to load checkout.' : 'No items to checkout.'}
            </p>
          )}

          {/* Summary + Borrow form */}
          {!isLoading && !isError && data && items.length > 0 && (
            <div className='flex flex-col md:flex-row gap-3xl md:gap-14.5 items-start justify-center w-full'>
              <FadeInUp className='min-w-0 w-full md:w-auto md:flex-[5.1] md:basis-76'>
                <CheckoutSummarySection user={data.user} items={items} />
              </FadeInUp>
              <FadeInUp
                delay={250}
                className='w-full md:w-auto md:flex-[4.9] md:basis-80 md:shrink'
              >
                <BorrowFormSection items={items} />
              </FadeInUp>
            </div>
          )}
        </div>
      </main>

      <Footer onLogoClick={() => navigate('/')} />
    </>
  );
}
