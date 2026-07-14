import api from '@/lib/axios';
import type { CartItem, CartResponse, CheckoutResponse, FromCartResponse } from '@/types';

export const getCart = () => api.get<CartResponse>('/cart').then((r) => r.data);

export const addCartItem = (bookId: number) =>
  api.post<{ item: CartItem }>('/cart/items', { bookId }).then((r) => r.data.item);

export const removeCartItem = (itemId: number) =>
  api.delete(`/cart/items/${itemId}`).then((r) => r.data);

export const clearCart = () => api.delete('/cart').then((r) => r.data);

export const getCheckout = () => api.get<CheckoutResponse>('/cart/checkout').then((r) => r.data);

export const borrowFromCart = (itemIds: number[], days: 3 | 5 | 10 = 3, borrowDate?: string) =>
  api
    .post<FromCartResponse>('/loans/from-cart', { itemIds, days, ...(borrowDate ? { borrowDate } : {}) })
    .then((r) => r.data);
