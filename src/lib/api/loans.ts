import api from '@/lib/axios';
import type { AdminLoan, Loan, Pagination } from '@/types';

export interface LoansParams {
  status?: 'all' | 'active' | 'returned' | 'overdue';
  q?: string;
  page?: number;
  limit?: number;
}

export const getMyLoans = (params?: LoansParams) =>
  api.get<{ loans: Loan[]; pagination: Pagination }>('/loans/my', { params }).then((r) => r.data);

export const borrowBook = (bookId: number, days: number) =>
  api.post<Loan>('/loans', { bookId, days }).then((r) => r.data);

export const returnBook = (loanId: number) =>
  api.patch<Loan>(`/loans/${loanId}/return`).then((r) => r.data);

export interface AdminLoansParams {
  status?: 'all' | 'active' | 'returned' | 'overdue';
  q?: string;
  page?: number;
  limit?: number;
}

export const getAdminLoans = (params?: AdminLoansParams) =>
  api.get<{ loans: AdminLoan[]; pagination: Pagination }>('/admin/loans', { params }).then((r) => r.data);

export const updateAdminLoan = (id: number, payload: { dueAt?: string; status?: string }) =>
  api.patch<AdminLoan>(`/admin/loans/${id}`, payload).then((r) => r.data);
