import { useState } from 'react';
import { useDebouncedValue } from './useDebouncedValue';

export function usePagedSearch(delay?: number) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, delay);
  const [page, setPage] = useState(1);

  const [pageQuery, setPageQuery] = useState(debouncedQuery);
  if (pageQuery !== debouncedQuery) {
    setPageQuery(debouncedQuery);
    setPage(1);
  }

  return { query, setQuery, debouncedQuery, page, setPage };
}
