import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import CardCategory, { CardCategorySkeleton } from '@/components/common/CardCategory';
import { FadeInUp } from '@/components/common/StaggeredItems';
import { getCategories } from '@/lib/api/categories';
import { getCategoryIcon, HOME_CATEGORY_ORDER } from '@/lib/categoryIcons';
import { queryKeys } from '@/lib/queryKeys';
import { cn } from '@/lib/utils';
import { SectionError } from './SectionState';

const CATEGORY_WINDOW = 6;
const CATEGORY_WINDOW_STARTS = [0, 1, 3];
const CATEGORY_SWIPE_THRESHOLD = 50;

export default function CategorySection() {
  const navigate = useNavigate();

  const {
    data: categories,
    isLoading: categoriesLoading,
    isError: categoriesError,
  } = useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: getCategories,
  });

  const [categoryPage, setCategoryPage] = useState(0);
  const categoryPointerStartX = useRef<number | null>(null);

  const orderedCategories = HOME_CATEGORY_ORDER.map((name) =>
    (categories ?? []).find((c) => c.name.toLowerCase() === name.toLowerCase())
  ).filter((c): c is NonNullable<typeof c> => !!c);
  const visibleCategories = orderedCategories.slice(
    CATEGORY_WINDOW_STARTS[categoryPage],
    CATEGORY_WINDOW_STARTS[categoryPage] + CATEGORY_WINDOW
  );

  const handleCategoryPointerDown = (e: React.PointerEvent) => {
    categoryPointerStartX.current = e.clientX;
  };
  const handleCategoryPointerUp = (e: React.PointerEvent) => {
    if (categoryPointerStartX.current === null) return;
    const delta = e.clientX - categoryPointerStartX.current;
    if (delta > CATEGORY_SWIPE_THRESHOLD)
      setCategoryPage((p) => Math.max(0, p - 1));
    else if (delta < -CATEGORY_SWIPE_THRESHOLD)
      setCategoryPage((p) => Math.min(2, p + 1));
    categoryPointerStartX.current = null;
  };

  return (
    <>
      {/* Pagination dots (the row is reserved while loading so the categories don't jump down) */}
      {(categoriesLoading ||
        (!categoriesError && orderedCategories.length > CATEGORY_WINDOW)) && (
          <FadeInUp>
            <div className='flex items-center justify-center -mt-1 md:-mt-7.5 mb-2.5 md:mb-0'>
              {CATEGORY_WINDOW_STARTS.map((_, i) =>
                categoriesLoading ? (
                  <span
                    key={i}
                    aria-hidden='true'
                    className='size-6 -my-[9px] md:-my-2'
                  />
                ) : (
                  // 24px hit area around a small dot; the negative margin keeps the row as tall as the dots.
                  <button
                    key={i}
                    type='button'
                    aria-label={`Category page ${i + 1}`}
                    onClick={() => setCategoryPage(i)}
                    className='cursor-pointer flex size-6 items-center justify-center -my-[9px] md:-my-2'
                  >
                    <span
                      className={cn(
                        'block h-1.5 md:h-2 rounded-full transition-all',
                        i === categoryPage
                          ? 'w-6 bg-primary-300'
                          : 'w-1.5 md:w-2 bg-neutral-300'
                      )}
                    />
                  </button>
                )
              )}
            </div>
          </FadeInUp>
        )}

      {/* Category */}
      <section className='flex flex-col gap-lg'>
        {categoriesLoading && (
          <div role='status' className='grid grid-cols-3 gap-lg md:flex md:gap-xl'>
            <span className='sr-only'>Loading categories</span>
            {Array.from({ length: CATEGORY_WINDOW }, (_, i) => (
              <div key={i} className='flex-1 min-w-0'>
                <CardCategorySkeleton />
              </div>
            ))}
          </div>
        )}
        {categoriesError && (
          <SectionError message='Failed to load categories.' />
        )}

        {!categoriesLoading && !categoriesError && (
          <div
            className='grid grid-cols-3 gap-lg md:flex md:gap-xl'
            onPointerDown={handleCategoryPointerDown}
            onPointerUp={handleCategoryPointerUp}
          >
            {visibleCategories.map((category, index) => (
              <FadeInUp
                key={category.id}
                delay={index * 250}
                className='flex-1 min-w-0'
              >
                <CardCategory
                  name={category.name}
                  icon={getCategoryIcon(category.name)}
                  onClick={() => navigate(`/category/${category.id}`)}
                />
              </FadeInUp>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
