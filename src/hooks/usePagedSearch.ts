import { useState } from 'react';
import { useDebouncedValue } from './useDebouncedValue';

/** Search box + page state for a paginated list; a new (debounced) search always restarts at page 1. */
export function usePagedSearch(delay?: number) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, delay);
  const [page, setPage] = useState(1);

  // Adjusted during render, so the old query is never fetched for page 1.
  const [pageQuery, setPageQuery] = useState(debouncedQuery);
  if (pageQuery !== debouncedQuery) {
    setPageQuery(debouncedQuery);
    setPage(1);
  }

  return { query, setQuery, debouncedQuery, page, setPage };
}
