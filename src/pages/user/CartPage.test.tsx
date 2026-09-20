import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getCart, removeCartItem } from '@/lib/api/cart';
import type { Book, CartItem, CartResponse } from '@/types';
import CartPage from './CartPage';

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
vi.mock('@/lib/api/cart', () => ({ getCart: vi.fn(), removeCartItem: vi.fn() }));

const item = (id: number, title: string): CartItem => ({
  id,
  bookId: id * 10,
  addedAt: '',
  book: {
    id: id * 10,
    title,
    coverImage: `https://example.com/${id}.png`,
    author: { id: 1, name: 'Author' },
    category: { id: 1, name: 'Fiction' },
  } as Book,
});

const cartOf = (...items: CartItem[]): CartResponse => ({ cartId: 1, items, itemCount: items.length });
const two = cartOf(item(11, 'Clean Code'), item(12, 'Hooked'));

function Checkout() {
  return <p data-testid='checkout-state'>{JSON.stringify(useLocation().state)}</p>;
}

function setup() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/cart']}>
        <Routes>
          <Route path='/cart' element={<CartPage />} />
          <Route path='/checkout' element={<Checkout />} />
          <Route path='/' element={<p>home page</p>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
  return userEvent.setup();
}

const borrowButton = () => screen.getAllByRole('button', { name: 'Borrow Book' })[0];
const checkboxes = () => screen.getAllByRole('checkbox'); // [Select All, ...items]
const itemCount = (n: number) => screen.getAllByText(`${n} Items`).length > 0;

describe('CartPage', () => {
  beforeEach(() => {
    vi.mocked(getCart).mockReset();
    vi.mocked(removeCartItem).mockReset();
    vi.mocked(toast.error).mockClear();
    vi.mocked(toast.success).mockClear();
  });

  it('tells the user when the cart is empty and offers to browse', async () => {
    vi.mocked(getCart).mockResolvedValue(cartOf());
    const user = setup();

    expect(await screen.findByText('Your cart is empty.')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Browse Books' }));
    expect(screen.getByText('home page')).toBeInTheDocument();
  });

  it('shows an error message when the cart cannot be loaded', async () => {
    vi.mocked(getCart).mockRejectedValue(new Error('network'));
    setup();
    expect(await screen.findByText('Failed to load your cart.')).toBeInTheDocument();
  });

  it('lists the books with everything selected by default', async () => {
    vi.mocked(getCart).mockResolvedValue(two);
    setup();

    expect(await screen.findByText('Clean Code')).toBeInTheDocument();
    expect(screen.getByText('Hooked')).toBeInTheDocument();
    expect(checkboxes()).toHaveLength(3);
    checkboxes().forEach((box) => expect(box).toBeChecked());
    expect(itemCount(2)).toBe(true);
  });

  it('updates the total and the Select All state when one book is deselected', async () => {
    vi.mocked(getCart).mockResolvedValue(two);
    const user = setup();
    await screen.findByText('Clean Code');

    await user.click(checkboxes()[1]);

    expect(checkboxes()[1]).not.toBeChecked();
    expect(checkboxes()[2]).toBeChecked();
    expect(checkboxes()[0]).not.toBeChecked();
    expect(itemCount(1)).toBe(true);
  });

  it('Select All clears everything, then selects everything again', async () => {
    vi.mocked(getCart).mockResolvedValue(two);
    const user = setup();
    await screen.findByText('Clean Code');

    await user.click(checkboxes()[0]);
    checkboxes().forEach((box) => expect(box).not.toBeChecked());
    expect(itemCount(0)).toBe(true);

    await user.click(checkboxes()[0]);
    checkboxes().forEach((box) => expect(box).toBeChecked());
    expect(itemCount(2)).toBe(true);
  });

  it('refuses to continue with nothing selected', async () => {
    vi.mocked(getCart).mockResolvedValue(two);
    const user = setup();
    await screen.findByText('Clean Code');
    await user.click(checkboxes()[0]);

    await user.click(borrowButton());

    expect(toast.error).toHaveBeenCalledWith('Select at least one book to borrow.');
    expect(screen.queryByTestId('checkout-state')).not.toBeInTheDocument();
  });

  it('goes to checkout with only the selected cart item ids', async () => {
    vi.mocked(getCart).mockResolvedValue(two);
    const user = setup();
    await screen.findByText('Clean Code');
    await user.click(checkboxes()[1]);

    await user.click(borrowButton());

    expect(JSON.parse(screen.getByTestId('checkout-state').textContent ?? '')).toEqual({ itemIds: [12] });
  });

  it('removes a book by its cart item id and refreshes the list', async () => {
    vi.mocked(getCart).mockResolvedValueOnce(two).mockResolvedValueOnce(cartOf(item(12, 'Hooked')));
    vi.mocked(removeCartItem).mockResolvedValue({});
    const user = setup();
    const row = (await screen.findByText('Clean Code')).closest('div.flex.items-start.justify-between') as HTMLElement;

    await user.click(within(row).getByRole('button', { name: 'Remove from cart' }));

    expect(removeCartItem).toHaveBeenCalledWith(11);
    await waitFor(() => expect(screen.queryByText('Clean Code')).not.toBeInTheDocument());
    expect(screen.getByText('Hooked')).toBeInTheDocument();
    expect(toast.success).toHaveBeenCalledWith('Removed from cart.');
  });

  it('keeps the book and shows the reason when removing fails', async () => {
    vi.mocked(getCart).mockResolvedValue(two);
    vi.mocked(removeCartItem).mockRejectedValue(new Error('Item not found'));
    const user = setup();
    await screen.findByText('Clean Code');

    await user.click(screen.getAllByRole('button', { name: 'Remove from cart' })[0]);

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Item not found'));
    expect(screen.getByText('Clean Code')).toBeInTheDocument();
  });
});
