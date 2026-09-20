import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { usePagedSearch } from './usePagedSearch';

describe('usePagedSearch', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('starts empty on page 1', () => {
    const { result } = renderHook(() => usePagedSearch());
    expect(result.current).toMatchObject({ query: '', debouncedQuery: '', page: 1 });
  });

  it('shows typed text at once but only exposes the debounced query later', () => {
    const { result } = renderHook(() => usePagedSearch());

    act(() => result.current.setQuery('harry'));
    expect(result.current.query).toBe('harry');
    expect(result.current.debouncedQuery).toBe('');

    act(() => vi.advanceTimersByTime(300));
    expect(result.current.debouncedQuery).toBe('harry');
  });

  it('keeps the current page while typing and restarts at page 1 once the search settles', () => {
    const { result } = renderHook(() => usePagedSearch());
    act(() => result.current.setPage(3));

    act(() => result.current.setQuery('harry'));
    expect(result.current.page).toBe(3);

    act(() => vi.advanceTimersByTime(300));
    expect(result.current.page).toBe(1);
  });

  it('does not touch the page when the query has not changed', () => {
    const { result } = renderHook(() => usePagedSearch());
    act(() => result.current.setPage(2));
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.page).toBe(2);
  });
});
