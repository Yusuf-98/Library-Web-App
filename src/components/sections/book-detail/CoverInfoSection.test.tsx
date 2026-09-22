import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getCart, addCartItem } from '@/lib/api/cart';
import type { Book, CartResponse, User } from '@/types';
import CoverInfoSection from './CoverInfoSection';

vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));
vi.mock('@/lib/api/cart', () => ({ getCart: vi.fn(), addCartItem: vi.fn() }));

const book: Book = {
  id: 1,
  title: 'Clean Code',
  description: 'A handbook of agile software craftsmanship.',
  isbn: '9780132350884',
  publishedYear: 2008,
  coverImage: 'https://example.com/cover.png',
  rating: 4.5,
  reviewCount: 12,
  totalCopies: 5,
  availableCopies: 3,
  borrowCount: 20,
  authorId: 1,
  categoryId: 1,
  author: { id: 1, name: 'Robert C. Martin' },
  category: { id: 1, name: 'Education' },
};

const user: User = {
  id: 1,
  name: 'Yusuf',
  email: 'yusuf@example.com',
  phone: '081234567890',
  profilePhoto: null,
  role: 'USER',
};

const cartOf = (...items: CartResponse['items']): CartResponse => ({
  cartId: 1,
  items,
  itemCount: items.length,
});

function LocationProbe() {
  const location = useLocation();
  return (
    <p data-testid='location'>
      {location.pathname} {JSON.stringify(location.state)}
    </p>
  );
}

function setup(props: Partial<React.ComponentProps<typeof CoverInfoSection>> = {}) {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/books/1']}>
        <CoverInfoSection book={book} bookId={book.id} user={user} isInCart={false} {...props} />
        <LocationProbe />
      </MemoryRouter>
    </QueryClientProvider>
  );
  return userEvent.setup();
}

const borrowButton = () => screen.getAllByRole('button', { name: 'Borrow Book' })[0];
const addToCartButton = () => screen.getAllByRole('button', { name: 'Add to Cart' })[0];
const location = () => screen.getByTestId('location').textContent;

describe('CoverInfoSection', () => {
  beforeEach(() => {
    vi.mocked(getCart).mockReset();
    vi.mocked(addCartItem).mockReset();
    vi.mocked(toast.error).mockClear();
    vi.mocked(toast.success).mockClear();
  });

  it('goes to checkout with the new cart item when borrowing succeeds', async () => {
    vi.mocked(addCartItem).mockResolvedValue({ id: 42, bookId: book.id, addedAt: '', book });
    const u = setup();

    await u.click(borrowButton());

    await waitFor(() => expect(location()).toContain('/checkout'));
    expect(location()).toContain(JSON.stringify({ itemIds: [42] }));
  });

  it('falls back to the existing cart item when the book is already in the cart', async () => {
    vi.mocked(addCartItem).mockRejectedValue(new Error('Book already in cart'));
    vi.mocked(getCart).mockResolvedValue(
      cartOf({ id: 7, bookId: book.id, addedAt: '', book })
    );
    const u = setup();

    await u.click(borrowButton());

    await waitFor(() => expect(location()).toContain('/checkout'));
    expect(location()).toContain(JSON.stringify({ itemIds: [7] }));
    expect(toast.error).not.toHaveBeenCalled();
  });

  it('shows an error toast when borrowing fails for another reason', async () => {
    vi.mocked(addCartItem).mockRejectedValue(new Error('Out of stock'));
    vi.mocked(getCart).mockResolvedValue(cartOf());
    const u = setup();

    await u.click(borrowButton());

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith('Out of stock'));
    expect(location()).toContain('/books/1');
  });

  it('sends a logged-out user to login instead of borrowing', async () => {
    const u = setup({ user: null });

    await u.click(borrowButton());

    expect(location()).toContain('/login');
    expect(addCartItem).not.toHaveBeenCalled();
  });

  it('adds to cart and shows a success toast', async () => {
    vi.mocked(addCartItem).mockResolvedValue({ id: 5, bookId: book.id, addedAt: '', book });
    const u = setup();

    await u.click(addToCartButton());

    await waitFor(() => expect(toast.success).toHaveBeenCalledWith('Added to cart.'));
    expect(location()).toContain('/books/1');
  });

  it('sends a logged-out user to login instead of adding to cart', async () => {
    const u = setup({ user: null });

    await u.click(addToCartButton());

    expect(location()).toContain('/login');
    expect(addCartItem).not.toHaveBeenCalled();
  });

  it('disables borrowing when the book is out of stock', () => {
    setup({ book: { ...book, availableCopies: 0 } });

    expect(screen.getAllByRole('button', { name: 'Out of Stock' })[0]).toBeDisabled();
  });
});
