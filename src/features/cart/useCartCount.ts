import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from '@/app/hooks';
import { getCart } from '@/lib/api/cart';
import { queryKeys } from '@/lib/queryKeys';

export function useCartCount() {
  const token = useAppSelector((s) => s.auth.token);

  const { data } = useQuery({
    queryKey: queryKeys.cart.all,
    queryFn: getCart,
    enabled: !!token,
  });

  return data?.itemCount ?? 0;
}
