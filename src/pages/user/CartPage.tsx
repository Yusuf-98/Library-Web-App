import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import Footer from '@/components/shared/Footer';
import { Button } from '@/components/ui/button';
import { getCart, removeCartItem } from '@/lib/api/cart';
import { queryKeys } from '@/lib/queryKeys';
import { getErrorMessage } from '@/lib/utils';
import CartItemListSection from '@/components/sections/cart/CartItemListSection';
import CartSummaryPanel from '@/components/sections/cart/CartSummaryPanel';
import CartMobileSummaryBar from '@/components/sections/cart/CartMobileSummaryBar';
import { FadeInUp } from '@/components/common/StaggeredItems';

export default function CartPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // --- Queries ---
  const {
    data: cart,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.cart.all,
    queryFn: getCart,
  });

  // --- Selection ---
  const [selectedIds, setSelectedIds] = useState<Set<number> | null>(null);
  const [seededCart, setSeededCart] = useState<typeof cart>(undefined);

  if (cart && cart !== seededCart && selectedIds === null) {
    setSeededCart(cart);
    setSelectedIds(new Set(cart.items.map((i) => i.id)));
  }

  // --- Mutations ---
  const { mutate: removeItem } = useMutation({
    mutationFn: (itemId: number) => removeCartItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.all });
      toast.success('Removed from cart.');
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Failed to remove item. Please try again.'));
    },
  });

  // --- Derived ---
  const items = cart?.items ?? [];
  const allSelected =
    items.length > 0 && items.every((i) => selectedIds?.has(i.id));
  const selectedCount = items.filter((i) => selectedIds?.has(i.id)).length;

  // --- Handlers ---
  const toggleAll = () => {
    if (!cart) return;
    setSelectedIds(
      allSelected ? new Set() : new Set(cart.items.map((i) => i.id))
    );
  };

  const toggleItem = (itemId: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  const handleBorrow = () => {
    if (selectedCount === 0) {
      toast.error('Select at least one book to borrow.');
      return;
    }
    navigate('/checkout', {
      state: {
        itemIds: items.filter((i) => selectedIds?.has(i.id)).map((i) => i.id),
      },
    });
  };

  return (
    <>
      <main className='flex-1 custom-container mb-16 md:mt-8.5'>
        <div className='max-w-250 mx-auto flex flex-col gap-xl md:gap-[clamp(16px,calc(-2.29px+2.381vw),32px)]'>
          {/* Title */}
          <FadeInUp>
            <h1 className='font-bold text-neutral-950 text-display-xs md:text-[clamp(24px,calc(10.29px+1.786vw),36px)]'>
              My Cart
            </h1>
          </FadeInUp>

          {/* Loading state */}
          {isLoading && (
            <div className='flex justify-center py-10'>
              <span className='size-8 border-2 border-primary-300/30 border-t-primary-300 rounded-full animate-spin' />
            </div>
          )}

          {/* Error state */}
          {isError && (
            <p className='text-sm text-accent-red text-center py-10 tracking-t-2'>
              Failed to load your cart.
            </p>
          )}

          {/* Empty state */}
          {!isLoading && !isError && items.length === 0 && (
            <div className='flex flex-col items-center gap-lg py-10'>
              <p className='text-sm font-medium text-neutral-500 tracking-t-2 text-center'>
                Your cart is empty.
              </p>
              <Button
                type='button'
                variant='primary'
                className='w-50'
                onClick={() => navigate('/')}
              >
                Browse Books
              </Button>
            </div>
          )}

          {/* Cart */}
          {items.length > 0 && (
            <div className='flex gap-5xl items-start justify-center w-full'>
              <CartItemListSection
                items={items}
                selectedIds={selectedIds}
                allSelected={allSelected}
                onToggleAll={toggleAll}
                onToggleItem={toggleItem}
                onRemove={removeItem}
              />
              <FadeInUp>
                <CartSummaryPanel
                  selectedCount={selectedCount}
                  onBorrow={handleBorrow}
                />
              </FadeInUp>
            </div>
          )}
        </div>
      </main>

      {/* Sticky summary */}
      {items.length > 0 && (
        <CartMobileSummaryBar
          selectedCount={selectedCount}
          onBorrow={handleBorrow}
        />
      )}

      <div className='pb-24 md:pb-0'>
        <Footer onLogoClick={() => navigate('/')} />
      </div>
    </>
  );
}
