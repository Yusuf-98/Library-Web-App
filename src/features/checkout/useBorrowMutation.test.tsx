import type { ReactNode } from 'react';
import { act, renderHook, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { borrowFromCart } from '@/lib/api/cart';
import { queryKeys } from '@/lib/queryKeys';
import type { Book, CartItem, CartResponse, CheckoutResponse, FromCartResponse } from '@/types';
import { useBorrowMutation } from './useBorrowMutation';

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
vi.mock('@/lib/api/cart', () => ({ borrowFromCart: vi.fn() }));

const book = (id: number, availableCopies: number) => ({ id, title: `Book ${id}`, availableCopies }) as Book;
const item = (id: number, bookId: number, copies: number): CartItem => ({ id, bookId, addedAt: '', book: book(bookId, copies) });

const items = [item(11, 1, 3), item(12, 2, 2)];
const cart: CartResponse = { cartId: 1, items, itemCount: 2 };
const checkout: CheckoutResponse = { user: { name: 'Y', email: 'y@example.com', nomorHandphone: '0812' }, items, itemCount: 2 };
const loan = { id: 5, userId: 1, bookId: 1, status: 'BORROWED', borrowedAt: '', dueAt: '', returnedAt: null, returnByMessage: '' };
const reply = (overrides: Partial<FromCartResponse>): FromCartResponse => ({ loans: [], failed: [], removedFromCart: 0, message: '', ...overrides });

function LocationSpy() {
  const { pathname, state } = useLocation();
  return (
    <>
      <div data-testid='pathname'>{pathname}</div>
      <div data-testid='state'>{JSON.stringify(state)}</div>
    </>
  );
}

function setup() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  queryClient.setQueryData(queryKeys.cart.all, cart);
  queryClient.setQueryData(queryKeys.cart.checkout, checkout);
  queryClient.setQueryData(queryKeys.books.detail(1), book(1, 3));
  queryClient.setQueryData(queryKeys.books.detail(2), book(2, 2));

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        {children}
        <LocationSpy />
      </MemoryRouter>
    </QueryClientProvider>
  );
  const { result } = renderHook(() => useBorrowMutation(items), { wrapper });

  let resolve!: (value: FromCartResponse) => void;
  let reject!: (reason: unknown) => void;
  vi.mocked(borrowFromCart).mockReturnValue(
    new Promise<FromCartResponse>((res, rej) => {
      resolve = res;
      reject = rej;
    })
  );
  const borrow = () => act(() => result.current.mutate({ days: 5, borrowDate: '2026-09-20' }));

  return { queryClient, borrow, resolve: (v: FromCartResponse) => act(async () => resolve(v)), reject: (e: unknown) => act(async () => reject(e)) };
}

const copies = (queryClient: QueryClient, id: number) => queryClient.getQueryData<Book>(queryKeys.books.detail(id))?.availableCopies;

describe('useBorrowMutation', () => {
  beforeEach(() => {
    vi.mocked(borrowFromCart).mockReset();
    vi.mocked(toast.error).mockClear();
  });

  it('sends the selected cart items with the chosen duration and date', async () => {
    const { borrow } = setup();
    borrow();
    await waitFor(() => expect(borrowFromCart).toHaveBeenCalledWith([11, 12], 5, '2026-09-20'));
  });

  it('empties the cart and lowers stock at once, before the server answers', async () => {
    const { queryClient, borrow } = setup();
    borrow();

    await waitFor(() => expect(queryClient.getQueryData(queryKeys.cart.all)).toMatchObject({ items: [], itemCount: 0 }));
    expect(queryClient.getQueryData(queryKeys.cart.checkout)).toMatchObject({ items: [], itemCount: 0 });
    expect(copies(queryClient, 1)).toBe(2);
    expect(copies(queryClient, 2)).toBe(1);
  });

  it('never lowers stock below zero', async () => {
    const { queryClient, borrow } = setup();
    queryClient.setQueryData(queryKeys.books.detail(1), book(1, 0));
    borrow();
    await waitFor(() => expect(queryClient.getQueryData(queryKeys.cart.all)).toMatchObject({ items: [] }));
    expect(copies(queryClient, 1)).toBe(0);
  });

  it('goes to the success page with the loan count and the computed return date', async () => {
    const { borrow, resolve } = setup();
    borrow();
    await resolve(reply({ loans: [loan, { ...loan, id: 6 }], removedFromCart: 2 }));

    await waitFor(() => expect(screen.getByTestId('pathname')).toHaveTextContent('/checkout/success'));
    expect(JSON.parse(screen.getByTestId('state').textContent ?? '')).toEqual({ itemCount: 2, returnDate: '2026-09-25' });
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('refreshes the cart, loans, profile and books afterwards', async () => {
    const { queryClient, borrow, resolve } = setup();
    const invalidate = vi.spyOn(queryClient, 'invalidateQueries');
    borrow();
    await resolve(reply({ loans: [loan] }));

    await waitFor(() => expect(invalidate).toHaveBeenCalledTimes(4));
    const keys = invalidate.mock.calls.map(([filters]) => filters?.queryKey);
    expect(keys).toEqual([queryKeys.cart.all, queryKeys.loans.all, queryKeys.me.all, queryKeys.books.all]);
  });

  it('shows the reason and stays put when nothing could be borrowed', async () => {
    const { borrow, resolve } = setup();
    borrow();
    await resolve(reply({ failed: [{ cartItemId: 11, bookId: 1, reason: 'Out of stock' }] }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Out of stock'));
    expect(screen.getByTestId('pathname')).toHaveTextContent('/');
    expect(screen.getByTestId('pathname').textContent).toBe('/');
  });

  it('falls back to a generic message when nothing was borrowed and no reason is given', async () => {
    const { borrow, resolve } = setup();
    borrow();
    await resolve(reply({}));
    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Failed to borrow. Please try again.'));
  });

  it('reports the books that failed but still continues when some were borrowed', async () => {
    const { borrow, resolve } = setup();
    borrow();
    await resolve(
      reply({ loans: [loan], failed: [{ cartItemId: 12, bookId: 2, reason: 'Out of stock' }] })
    );

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('1 book(s) could not be borrowed: Out of stock'));
    await waitFor(() => expect(screen.getByTestId('pathname')).toHaveTextContent('/checkout/success'));
    expect(JSON.parse(screen.getByTestId('state').textContent ?? '')).toMatchObject({ itemCount: 1 });
  });

  it('puts the cart and stock back and shows the error when the request fails', async () => {
    const { queryClient, borrow, reject } = setup();
    borrow();
    await waitFor(() => expect(queryClient.getQueryData(queryKeys.cart.all)).toMatchObject({ items: [] }));

    await reject(new Error('Server down'));

    await waitFor(() => expect(queryClient.getQueryData(queryKeys.cart.all)).toEqual(cart));
    expect(queryClient.getQueryData(queryKeys.cart.checkout)).toEqual(checkout);
    expect(copies(queryClient, 1)).toBe(3);
    expect(copies(queryClient, 2)).toBe(2);
    expect(toast.error).toHaveBeenCalledWith('Server down');
    expect(screen.getByTestId('pathname').textContent).toBe('/');
  });
});
