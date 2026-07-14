import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getBooksByCategory } from '@/lib/api/books';
import CardBook from '@/components/common/CardBook';
import { FadeInUp } from '@/components/common/StaggeredItems';

interface RelatedBooksSectionProps {
  bookId: number;
  categoryId: number;
}

export default function RelatedBooksSection({
  bookId,
  categoryId,
}: RelatedBooksSectionProps) {
  const navigate = useNavigate();

  const { data: relatedData } = useQuery({
    queryKey: ['books', 'related', categoryId],
    queryFn: () => getBooksByCategory(categoryId, { limit: 6 }),
  });
  const relatedBooks = (relatedData?.books ?? [])
    .filter((b) => b.id !== bookId)
    .slice(0, 5);

  if (relatedBooks.length === 0) return null;

  return (
    <>
      {/* Divider */}
      <div className='h-px w-full bg-neutral-300' />
      <div className='flex flex-col gap-[clamp(20px,calc(-2.86px+2.976vw),40px)]'>
        {/* Title */}
        <FadeInUp>
          <h2 className='font-bold text-neutral-950 md:tracking-t-2 text-display-xs md:text-[clamp(24px,calc(10.29px+1.786vw),36px)]'>
            Related Books
          </h2>
        </FadeInUp>
        {/* Book grid */}
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-xl md:gap-2xl'>
          {relatedBooks.map((b, index) => (
            <FadeInUp key={b.id} delay={(index % 5) * 250}>
              <CardBook
                title={b.title}
                author={b.author.name}
                cover={b.coverImage}
                rating={b.rating}
                onClick={() => navigate(`/books/${b.id}`)}
                className='w-full'
              />
            </FadeInUp>
          ))}
        </div>
      </div>
    </>
  );
}
