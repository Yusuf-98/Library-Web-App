import { QueryClient } from '@tanstack/react-query';
import { ApiError } from './apiError';

export function shouldRetry(failureCount: number, error: unknown) {
  const isClientError =
    error instanceof ApiError &&
    error.status >= 400 &&
    error.status < 500 &&
    error.status !== 429;
  return !isClientError && failureCount < 1;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      retry: shouldRetry,
    },
  },
});
