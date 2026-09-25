import type { PaginatedBooks } from '@/types';

interface EarlyBooksResponse {
  success: boolean;
  data: PaginatedBooks;
}

declare global {
  interface Window {
    __earlyBooks?: Promise<EarlyBooksResponse>;
  }
}
