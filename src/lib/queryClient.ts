import { QueryClient } from '@tanstack/react-query';
import { ApiError } from './apiError';

// A 4xx answer will not change on a retry (429 aside), so only transient
// failures such as network errors and 5xx are retried, once.
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
