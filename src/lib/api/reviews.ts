import api from '@/lib/axios';
import type { CreatedReview, MyReview, Pagination, Review } from '@/types';

export const getReviews = (bookId: number, params?: { page?: number; limit?: number }) =>
  api
    .get<{ bookId: number; reviews: Review[]; pagination: Pagination }>(`/reviews/book/${bookId}`, { params })
    .then((r) => r.data);

export const addReview = (bookId: number, payload: { star: number; comment: string }) =>
  api
    .post<{ review: CreatedReview; bookStats: { rating: number; reviewCount: number } }>('/reviews', { bookId, ...payload })
    .then((r) => r.data.review);

export const deleteReview = (reviewId: number) => api.delete(`/reviews/${reviewId}`);

export const getMyReviews = () =>
  api.get<{ reviews: MyReview[]; pagination: Pagination }>('/me/reviews').then((r) => r.data.reviews);
