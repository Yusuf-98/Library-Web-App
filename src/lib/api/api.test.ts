import type { AxiosAdapter, InternalAxiosRequestConfig } from 'axios';
import { afterEach, describe, expect, it } from 'vitest';
import { loginApi, registerApi } from '@/features/auth/api';
import api from '@/lib/axios';
import { getBooksByAuthor, getPopularAuthors } from './authors';
import { addCartItem, borrowFromCart, getCart, getCheckout, removeCartItem } from './cart';
import { createBook, deleteBook, getAdminBooks, getBookById, getBooks, getBooksByCategory, updateBook } from './books';
import { getCategories } from './categories';
import { borrowBook, getAdminLoans, getMyLoans, updateAdminLoan } from './loans';
import { addReview, deleteReview, getMyReviews, getReviews } from './reviews';
import { getAdminUsers, getMyProfile, updateMyProfile } from './users';

// These tests pin down the contract the app has with the backend: which path, method,
// query string and body each function sends, and which part of the { data } envelope it returns.
const defaultAdapter = api.defaults.adapter;
let sent: InternalAxiosRequestConfig;

function backendReplies(data: unknown = {}) {
  api.defaults.adapter = (async (config: InternalAxiosRequestConfig) => {
    sent = config;
    return { data: { success: true, message: 'ok', data }, status: 200, statusText: '', headers: {}, config };
  }) as AxiosAdapter;
}

afterEach(() => {
  api.defaults.adapter = defaultAdapter;
});

const body = () => JSON.parse(sent.data as string);
const form = () => Object.fromEntries((sent.data as FormData).entries());
const request = () => ({ method: sent.method, url: sent.url });

describe('books', () => {
  it('getBooks sends the search and filter parameters as a query string', async () => {
    backendReplies({ books: [], pagination: {} });
    await getBooks({ q: 'harry', minRating: 4, page: 2, limit: 10 });
    expect(request()).toEqual({ method: 'get', url: '/books' });
    expect(sent.params).toEqual({ q: 'harry', minRating: 4, page: 2, limit: 10 });
  });

  it('getBookById asks for one book', async () => {
    backendReplies({ id: 7 });
    expect(await getBookById(7)).toEqual({ id: 7 });
    expect(request()).toEqual({ method: 'get', url: '/books/7' });
  });

  it('getBooksByCategory is /books filtered by categoryId', async () => {
    backendReplies({ books: [], pagination: {} });
    await getBooksByCategory(3, { limit: 6, minRating: 4 });
    expect(request().url).toBe('/books');
    expect(sent.params).toEqual({ limit: 6, minRating: 4, categoryId: 3 });
  });

  it('getAdminBooks uses the admin list', async () => {
    backendReplies({ books: [], pagination: {} });
    await getAdminBooks({ status: 'available', q: 'x', page: 1, limit: 10 });
    expect(request()).toEqual({ method: 'get', url: '/admin/books' });
    expect(sent.params).toMatchObject({ status: 'available' });
  });

  it('createBook posts multipart form data, as strings, skipping empty fields', async () => {
    backendReplies({ id: 1 });
    const cover = new File(['x'], 'cover.png', { type: 'image/png' });
    await createBook({ title: 'T', isbn: '123', categoryId: 4, authorName: 'A', publishedYear: undefined, totalCopies: 3, availableCopies: 3, coverImage: cover });

    expect(request()).toEqual({ method: 'post', url: '/books' });
    expect(sent.data).toBeInstanceOf(FormData);
    expect(form()).toMatchObject({ title: 'T', isbn: '123', categoryId: '4', authorName: 'A', totalCopies: '3', availableCopies: '3' });
    expect(form().coverImage).toBeInstanceOf(File);
    expect(form()).not.toHaveProperty('publishedYear');
  });

  it('updateBook sends plain JSON (numbers stay numbers) when there is no new cover', async () => {
    backendReplies({ id: 5 });
    await updateBook(5, { title: 'T', publishedYear: 2020, totalCopies: 4 });
    expect(request()).toEqual({ method: 'put', url: '/books/5' });
    expect(body()).toEqual({ title: 'T', publishedYear: 2020, totalCopies: 4 });
  });

  it('updateBook switches to multipart only when a new cover file is uploaded', async () => {
    backendReplies({ id: 5 });
    await updateBook(5, { title: 'T', coverImage: new File(['x'], 'c.png', { type: 'image/png' }) });
    expect(sent.data).toBeInstanceOf(FormData);
    expect(form().coverImage).toBeInstanceOf(File);
  });

  it('deleteBook deletes by id', async () => {
    backendReplies({});
    await deleteBook(5);
    expect(request()).toEqual({ method: 'delete', url: '/books/5' });
  });
});

describe('cart and checkout', () => {
  it('getCart and getCheckout are plain reads', async () => {
    backendReplies({ cartId: 1, items: [], itemCount: 0 });
    await getCart();
    expect(request()).toEqual({ method: 'get', url: '/cart' });
    await getCheckout();
    expect(request()).toEqual({ method: 'get', url: '/cart/checkout' });
  });

  it('addCartItem posts the book id and returns the created item', async () => {
    backendReplies({ item: { id: 11, bookId: 4 } });
    expect(await addCartItem(4)).toEqual({ id: 11, bookId: 4 });
    expect(request()).toEqual({ method: 'post', url: '/cart/items' });
    expect(body()).toEqual({ bookId: 4 });
  });

  it('removeCartItem deletes by cart item id (not book id)', async () => {
    backendReplies({});
    await removeCartItem(11);
    expect(request()).toEqual({ method: 'delete', url: '/cart/items/11' });
  });

  it('borrowFromCart sends the items and duration, and the date only when given', async () => {
    backendReplies({ loans: [], failed: [], removedFromCart: 0, message: '' });
    await borrowFromCart([11, 12], 5, '2026-09-20');
    expect(request()).toEqual({ method: 'post', url: '/loans/from-cart' });
    expect(body()).toEqual({ itemIds: [11, 12], days: 5, borrowDate: '2026-09-20' });

    await borrowFromCart([11]);
    expect(body()).toEqual({ itemIds: [11], days: 3 });
  });
});

describe('loans', () => {
  it('getMyLoans passes the status filter, search and paging', async () => {
    backendReplies({ loans: [], pagination: {} });
    await getMyLoans({ status: 'overdue', q: 'code', page: 2, limit: 10 });
    expect(request()).toEqual({ method: 'get', url: '/loans/my' });
    expect(sent.params).toEqual({ status: 'overdue', q: 'code', page: 2, limit: 10 });
  });

  it('borrowBook posts the book and the number of days', async () => {
    backendReplies({ id: 1 });
    await borrowBook(9, 7);
    expect(request()).toEqual({ method: 'post', url: '/loans' });
    expect(body()).toEqual({ bookId: 9, days: 7 });
  });

  it('admin can list loans and mark one as returned', async () => {
    backendReplies({ loans: [], pagination: {} });
    await getAdminLoans({ status: 'active' });
    expect(request()).toEqual({ method: 'get', url: '/admin/loans' });

    backendReplies({ id: 3 });
    await updateAdminLoan(3, { status: 'RETURNED' });
    expect(request()).toEqual({ method: 'patch', url: '/admin/loans/3' });
    expect(body()).toEqual({ status: 'RETURNED' });
  });
});

describe('reviews', () => {
  it('getReviews reads the reviews of one book, paged', async () => {
    backendReplies({ bookId: 9, reviews: [], pagination: {} });
    await getReviews(9, { page: 2, limit: 6 });
    expect(request()).toEqual({ method: 'get', url: '/reviews/book/9' });
    expect(sent.params).toEqual({ page: 2, limit: 6 });
  });

  it('addReview posts book id, stars and comment, and returns just the review', async () => {
    backendReplies({ review: { id: 4, star: 5 }, bookStats: { rating: 5, reviewCount: 1 } });
    expect(await addReview(9, { star: 5, comment: 'Great' })).toEqual({ id: 4, star: 5 });
    expect(request()).toEqual({ method: 'post', url: '/reviews' });
    expect(body()).toEqual({ bookId: 9, star: 5, comment: 'Great' });
  });

  it('deleteReview deletes by review id', async () => {
    backendReplies({});
    await deleteReview(4);
    expect(request()).toEqual({ method: 'delete', url: '/reviews/4' });
  });

  it('getMyReviews returns only the list of reviews', async () => {
    backendReplies({ reviews: [{ id: 1 }], pagination: {} });
    expect(await getMyReviews()).toEqual([{ id: 1 }]);
    expect(request()).toEqual({ method: 'get', url: '/me/reviews' });
  });
});

describe('profile and users', () => {
  it('getMyProfile reads /me', async () => {
    backendReplies({ profile: {}, loanStats: {}, reviewsCount: 0 });
    await getMyProfile();
    expect(request()).toEqual({ method: 'get', url: '/me' });
  });

  it('updateMyProfile patches JSON and returns the profile', async () => {
    backendReplies({ profile: { name: 'New' } });
    expect(await updateMyProfile({ name: 'New', phone: '0811' })).toEqual({ name: 'New' });
    expect(request()).toEqual({ method: 'patch', url: '/me' });
    expect(body()).toEqual({ name: 'New', phone: '0811' });
  });

  it('updateMyProfile uses multipart when a photo is uploaded', async () => {
    backendReplies({ profile: {} });
    await updateMyProfile({ name: 'New', phone: '', profilePhoto: new File(['x'], 'me.png', { type: 'image/png' }) });
    expect(sent.data).toBeInstanceOf(FormData);
    expect(form().name).toBe('New');
    expect(form().profilePhoto).toBeInstanceOf(File);
    expect(form()).not.toHaveProperty('phone');
  });

  it('getAdminUsers lists users with search and paging', async () => {
    backendReplies({ users: [], pagination: {} });
    await getAdminUsers({ q: 'yus', page: 2, limit: 10 });
    expect(request()).toEqual({ method: 'get', url: '/admin/users' });
    expect(sent.params).toEqual({ q: 'yus', page: 2, limit: 10 });
  });
});

describe('authors and categories', () => {
  it('getPopularAuthors returns just the list', async () => {
    backendReplies({ authors: [{ id: 19 }] });
    expect(await getPopularAuthors()).toEqual([{ id: 19 }]);
    expect(request().url).toBe('/authors/popular');
  });

  it("getBooksByAuthor reads one author's books, including the author and the total count", async () => {
    const reply = { author: { id: 19, name: 'Z' }, bookCount: 10, books: [], pagination: {} };
    backendReplies(reply);
    expect(await getBooksByAuthor(19, { page: 1 })).toEqual(reply);
    expect(request().url).toBe('/authors/19/books');
  });

  it('getCategories returns just the list', async () => {
    backendReplies({ categories: [{ id: 1, name: 'Fiction' }] });
    expect(await getCategories()).toEqual([{ id: 1, name: 'Fiction' }]);
    expect(request().url).toBe('/categories');
  });
});

describe('auth', () => {
  it('loginApi posts the credentials and returns the token and user', async () => {
    backendReplies({ token: 'jwt', user: { id: 1 } });
    expect(await loginApi('a@b.co', 'secret')).toEqual({ token: 'jwt', user: { id: 1 } });
    expect(request()).toEqual({ method: 'post', url: '/auth/login' });
    expect(body()).toEqual({ email: 'a@b.co', password: 'secret' });
  });

  it('registerApi posts every field and returns the created user', async () => {
    backendReplies({ id: 2, name: 'Y' });
    const payload = { name: 'Y', email: 'a@b.co', phone: '0812', password: 'secret', confirmPassword: 'secret' };
    expect(await registerApi(payload)).toEqual({ id: 2, name: 'Y' });
    expect(request()).toEqual({ method: 'post', url: '/auth/register' });
    expect(body()).toEqual(payload);
  });
});
