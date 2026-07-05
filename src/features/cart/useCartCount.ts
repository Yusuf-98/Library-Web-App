import { useQuery } from '@tanstack/react-query';
import { useAppSelector } from '@/app/hooks';
import { getCart } from '@/lib/api/cart';

export function useCartCount() {
  const token = useAppSelector((s) => s.auth.token);

  const { data } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
    enabled: !!token,
  });

  return data?.itemCount ?? 0;
}
