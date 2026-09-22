import { useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import InputField from '@/components/ui/input-field';
import Textarea from '@/components/ui/textarea-field';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getBookById, createBook, updateBook } from '@/lib/api/books';
import { getCategories } from '@/lib/api/categories';
import { HOME_CATEGORY_ORDER } from '@/lib/categoryIcons';
import { queryKeys } from '@/lib/queryKeys';
import { getErrorMessage } from '@/lib/utils';
import CoverImageSection from '@/components/sections/admin-book-form/CoverImageSection';
import { FadeInUp } from '@/components/common/StaggeredItems';
import arrowBackIcon from '@/assets/icons/arrow-back.svg';

export default function AdminBookFormPage() {
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  const bookId = Number(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // --- Queries ---
  const { data: categories } = useQuery({
    queryKey: queryKeys.categories.all,
    queryFn: getCategories,
  });
  const filteredCategories = (categories ?? []).filter((c) =>
    HOME_CATEGORY_ORDER.includes(c.name)
  );
  const { data: existingBook, isLoading: isLoadingBook } = useQuery({
    queryKey: queryKeys.books.detail(bookId),
    queryFn: () => getBookById(bookId),
    enabled: isEdit,
  });

  // --- Form state ---
  const [title, setTitle] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [isbn, setIsbn] = useState('');
  const [publishedYear, setPublishedYear] = useState('');
  const [totalCopies, setTotalCopies] = useState('');
  const [description, setDescription] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Edit seeding ---
  const [seededBookId, setSeededBookId] = useState<number | null>(null);
  if (existingBook && seededBookId !== existingBook.id) {
    setSeededBookId(existingBook.id);
    setTitle(existingBook.title);
    setAuthorName(existingBook.author.name);
    setCategoryId(String(existingBook.categoryId));
    setIsbn(existingBook.isbn);
    setPublishedYear(
      existingBook.publishedYear ? String(existingBook.publishedYear) : ''
    );
    setTotalCopies(String(existingBook.totalCopies));
    setDescription(existingBook.description ?? '');
  }

  // --- Cover handlers ---
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  };

  const handleDeleteImage = () => {
    setCoverFile(null);
    setCoverPreview(null);
  };

  const currentCoverSrc = coverPreview ?? existingBook?.coverImage;

  // --- Mutation ---
  const { mutate: submit, isPending } = useMutation({
    mutationFn: () => {
      const payload = {
        title,
        isbn,
        categoryId: Number(categoryId),
        authorName,
        description,
        publishedYear: publishedYear ? Number(publishedYear) : undefined,
        totalCopies: totalCopies ? Number(totalCopies) : undefined,
        availableCopies: isEdit
          ? undefined
          : totalCopies
            ? Number(totalCopies)
            : undefined,
        ...(coverFile ? { coverImage: coverFile } : {}),
      };
      return isEdit ? updateBook(bookId, payload) : createBook(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.books.all });
      if (isEdit)
        queryClient.invalidateQueries({
          queryKey: queryKeys.books.detail(bookId),
        });
      toast.success(isEdit ? 'Edit Success' : 'Add Success');
      navigate('/admin/books');
    },
    onError: (error) => {
      toast.error(
        getErrorMessage(
          error,
          `Failed to ${isEdit ? 'update' : 'add'} book. Please check the fields and try again.`
        )
      );
    },
  });

  // --- Submit ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !isbn || !categoryId) {
      toast.error('Title, ISBN, and Category are required.');
      return;
    }
    submit();
  };

  // --- Loading state ---
  if (isEdit && isLoadingBook) {
    return (
      <div className='flex justify-center py-10'>
        <span className='size-8 border-2 border-primary-300/30 border-t-primary-300 rounded-full animate-spin' />
      </div>
    );
  }

  return (
    <main className='flex-1 custom-container pt-[clamp(0px,calc(-40.57px+4.76vw),28px)] pb-xl md:pb-[clamp(16px,calc(-20.57px+4.762vw),48px)]'>
      <FadeInUp className='w-full md:w-132.25 mx-auto'>
        <form
          onSubmit={handleSubmit}
          className='flex flex-col gap-xl w-full'
        >
          {/* Header */}
          <div className='flex items-center gap-1.5 md:gap-lg'>
            <button
              type='button'
              onClick={() => navigate('/admin/books')}
              aria-label='Back to book list'
              className='cursor-pointer shrink-0 size-6 md:size-8 flex items-center justify-center'
            >
              <img src={arrowBackIcon} alt='' className='size-full' />
            </button>
            <p className='font-extrabold md:font-bold text-neutral-950 tracking-t-2 md:tracking-t-none text-xl md:text-display-xs'>
              {isEdit ? 'Edit Book' : 'Add Book'}
            </p>
          </div>

          {/* Title field */}
          <InputField
            id='title'
            label='Title'
            value={title}
            onChange={setTitle}
          />
          {/* Author field */}
          <InputField
            id='author'
            label='Author'
            value={authorName}
            onChange={setAuthorName}
          />

          {/* Category select */}
          <div className='flex flex-col gap-0.5 w-full'>
            <label
              htmlFor='category'
              className='text-sm font-bold text-neutral-950 tracking-t-2 w-full'
            >
              Category
            </label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger id='category' className='text-md tracking-t-2 text-neutral-950'>
                <SelectValue placeholder='Select Category' />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ISBN field */}
          <InputField id='isbn' label='ISBN' value={isbn} onChange={setIsbn} />
          {/* Published year field */}
          <InputField
            id='published-year'
            label='Published Year'
            type='number'
            value={publishedYear}
            onChange={setPublishedYear}
          />
          {/* Total copies field */}
          <InputField
            id='total-copies'
            label='Total Copies'
            type='number'
            value={totalCopies}
            onChange={setTotalCopies}
          />

          {/* Description field */}
          <Textarea
            id='description'
            label='Description'
            value={description}
            onChange={setDescription}
            rows={4}
          />

          {/* Cover image */}
          <CoverImageSection
            currentCoverSrc={currentCoverSrc}
            fileInputRef={fileInputRef}
            onCoverChange={handleCoverChange}
            onDeleteImage={handleDeleteImage}
            canDelete={!!coverPreview}
          />

          {/* Submit button */}
          <Button
            type='submit'
            variant='primary'
            className='w-full'
            disabled={isPending}
          >
            {isPending ? 'Saving...' : 'Save'}
          </Button>
      </form>
      </FadeInUp>
    </main>
  );
}
