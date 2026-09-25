import { useCallback, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { closeSearch, setSearchQuery } from '@/features/ui/uiSlice';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useOverlayA11y } from '@/hooks/useOverlayA11y';
import { getBooks } from '@/lib/api/books';
import { queryKeys } from '@/lib/queryKeys';
import CardBook from '@/components/common/CardBook';
import { FadeInUp } from '@/components/common/StaggeredItems';
import logoBooky from '@/assets/images/logo-booky.png';
import searchIcon from '@/assets/icons/search.svg';
import xCloseIcon from '@/assets/icons/x-close.svg';

export default function SearchOverlay() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // --- State ---
  const isSearchOpen = useAppSelector((s) => s.ui.isSearchOpen);
  const searchQuery = useAppSelector((s) => s.ui.searchQuery);

  const visible = isSearchOpen || searchQuery.trim().length > 0;

  const inputRef = useRef<HTMLInputElement>(null);
  const close = useCallback(() => dispatch(closeSearch()), [dispatch]);
  useOverlayA11y(visible, close, inputRef);

  // --- Search ---
  const debouncedQuery = useDebouncedValue(searchQuery);
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.books.search(debouncedQuery),
    queryFn: () => getBooks({ q: debouncedQuery }),
    enabled: debouncedQuery.trim().length > 0,
  });

  if (!visible) return null;

  // --- Derived ---
  const hasQuery = searchQuery.trim().length > 0;
  const isSettled = searchQuery === debouncedQuery;
  const books = hasQuery ? (data?.books ?? []) : [];
  const isSearching = hasQuery && (!isSettled || isLoading);

  return (
    <div
      role="region"
      aria-label="Search results"
      className="fixed inset-0 md:top-[clamp(64px,calc(45.71px+2.381vw),80px)] z-40 bg-white overflow-y-auto"
    >
      {/* Header */}
      <div className="md:hidden flex items-center gap-4 h-16 px-4 bg-white shadow-card">
        <img src={logoBooky} alt="" className="size-10 object-contain shrink-0" />
        <div className="flex flex-1 items-center gap-1.5 h-10 px-3 py-2 rounded-full border border-neutral-300 bg-white min-w-0">
          <img src={searchIcon} alt="" className="shrink-0 size-5" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            placeholder="Search book"
            aria-label="Search book"
            className="flex-1 min-w-0 text-sm font-medium text-neutral-600 tracking-t-3 outline-none placeholder:text-neutral-600 bg-transparent"
          />
        </div>
        <button type="button" onClick={close} className="cursor-pointer shrink-0 size-6" aria-label="Close search">
          <img src={xCloseIcon} alt="" className="size-6" />
        </button>
      </div>

      {/* Results */}
      <main aria-live="polite" className="custom-container py-6 md:py-[clamp(16px,calc(-20.57px+4.762vw),48px)]">
        {/* Prompt */}
        {!hasQuery && (
          <p className="text-sm font-medium text-neutral-500 tracking-t-2 text-center mt-10">
            Type to search for books
          </p>
        )}

        {/* Loading state */}
        {isSearching && books.length === 0 && (
          <div className="flex justify-center mt-10">
            <span className="size-8 border-2 border-primary-300/30 border-t-primary-300 rounded-full animate-spin" />
          </div>
        )}

        {/* Error state */}
        {isError && (
          <p className="text-sm font-medium text-accent-red tracking-t-2 text-center mt-10">
            Failed to search books. Please try again.
          </p>
        )}

        {/* Empty state */}
        {hasQuery && !isSearching && !isError && books.length === 0 && (
          <p className="text-sm font-medium text-neutral-500 tracking-t-2 text-center mt-10">
            No books found for "{searchQuery}"
          </p>
        )}

        {/* Results */}
        {!isError && books.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2xl">
            {books.map((book, index) => (
              <FadeInUp key={book.id} delay={(index % 5) * 80}>
                <CardBook
                  title={book.title}
                  author={book.author.name}
                  cover={book.coverImage}
                  rating={book.rating}
                  onClick={() => {
                    close();
                    navigate(`/books/${book.id}`);
                  }}
                  className="w-full"
                />
              </FadeInUp>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
