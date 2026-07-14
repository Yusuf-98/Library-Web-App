import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Footer from '@/components/shared/Footer';
import CardBook from '@/components/common/CardBook';
import { FadeInUp, FadeInLeft } from '@/components/common/StaggeredItems';
import FilterSidebar from '@/components/user/FilterSidebar';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet';
import { getBooksByCategory } from '@/lib/api/books';
import { getCategories } from '@/lib/api/categories';
import { HOME_CATEGORY_ORDER } from '@/lib/categoryIcons';
import filterLinesIcon from '@/assets/icons/filter-lines.svg';

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const categoryId = Number(id);
  const navigate = useNavigate();
  const [minRating, setMinRating] = useState<number | undefined>(undefined);

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['books', 'category', categoryId, minRating],
    queryFn: () => getBooksByCategory(categoryId, { minRating }),
    enabled: !!categoryId,
  });

  const books = data?.books ?? [];
  const filterCategories = (categories ?? []).filter((c) =>
    HOME_CATEGORY_ORDER.includes(c.name)
  );

  return (
    <>
      {/* Content */}
      <main className='custom-container flex-1 flex flex-col gap-xl md:gap-5xl'>
        {/* Title */}
        <FadeInUp>
          <h1 className='font-extrabold text-neutral-950 text-display-xs md:text-[clamp(24px,calc(10.29px+1.786vw),36px)]'>
            Book List
          </h1>
        </FadeInUp>

        {/* Filter trigger (mobile) */}
        <Sheet>
          <SheetTrigger asChild>
            <button
              type='button'
              className='md:hidden cursor-pointer bg-white rounded-xl shadow-card h-13 p-3 flex items-center justify-between w-full'
            >
              <span className='font-extrabold text-neutral-950 text-sm'>
                FILTER
              </span>
              <img src={filterLinesIcon} alt='' className='size-5' />
            </button>
          </SheetTrigger>
          <SheetContent
            side='bottom'
            className='rounded-t-2xl max-h-[85vh] overflow-y-auto'
          >
            <SheetTitle className='sr-only'>Filter</SheetTitle>
            <FilterSidebar
              className='w-full shadow-none'
              categories={filterCategories}
              selectedCategoryId={categoryId}
              onCategoryChange={(newId) =>
                navigate(newId ? `/category/${newId}` : '/')
              }
              selectedRating={minRating}
              onRatingChange={setMinRating}
            />
          </SheetContent>
        </Sheet>

        <div className='flex gap-xl md:gap-5xl items-start'>
          {/* Filter sidebar (desktop) */}
          <FadeInLeft className='hidden md:block'>
            <FilterSidebar
              categories={filterCategories}
              selectedCategoryId={categoryId}
              onCategoryChange={(newId) =>
                navigate(newId ? `/category/${newId}` : '/')
              }
              selectedRating={minRating}
              onRatingChange={setMinRating}
            />
          </FadeInLeft>

          {/* Book grid */}
          <div className='flex-1 min-w-0'>
            {isLoading && (
              <div className='flex justify-center mt-10'>
                <span className='size-8 border-2 border-primary-300/30 border-t-primary-300 rounded-full animate-spin' />
              </div>
            )}

            {isError && (
              <p className='text-sm text-accent-red text-center mt-10 tracking-t-2'>
                Failed to load books.
              </p>
            )}

            {!isLoading && books.length === 0 && !isError && (
              <p className='text-sm font-medium text-neutral-500 tracking-t-2 text-center mt-10'>
                No books in this category.
              </p>
            )}

            {books.length > 0 && (
              <div className='grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-xl md:gap-2xl'>
                {books.map((book, index) => (
                  <FadeInUp key={book.id} delay={(index % 4) * 250}>
                    <CardBook
                      title={book.title}
                      author={book.author.name}
                      cover={book.coverImage}
                      rating={book.rating}
                      onClick={() => navigate(`/books/${book.id}`)}
                      className='w-full'
                    />
                  </FadeInUp>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer onLogoClick={() => navigate('/')} />
    </>
  );
}
