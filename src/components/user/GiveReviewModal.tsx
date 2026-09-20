import { useState } from 'react';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogPortal, DialogOverlay, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import xCloseIcon from '@/assets/icons/x-close.svg';
import { useUpsertReviewMutation } from '@/features/reviews/useReviewMutations';

interface GiveReviewModalProps {
  bookId: number | null;
  initialReview?: { star: number; comment: string } | null;
  onOpenChange: (open: boolean) => void;
}

export default function GiveReviewModal({ bookId, initialReview, onOpenChange }: GiveReviewModalProps) {
  // --- State ---
  const isEditing = !!initialReview;
  const [rating, setRating] = useState(initialReview?.star ?? 0);
  const [comment, setComment] = useState(initialReview?.comment ?? '');

  // --- Mutation ---
  const { mutate: submit, isPending } = useUpsertReviewMutation(bookId);

  // --- Handlers ---
  const handleSubmit = () => {
    if (rating === 0 || comment.trim().length === 0) {
      toast.error('Please add a rating and comment.');
      return;
    }
    submit(
      { star: rating, comment },
      {
        onSuccess: () => {
          toast.success(isEditing ? 'Review updated.' : 'Review submitted.');
          setRating(0);
          setComment('');
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <Dialog open={bookId !== null} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent
          showCloseButton={false}
          className="max-w-[calc(100%-var(--spacing-4xl))] md:max-w-109.75 flex flex-col items-center gap-3xl p-xl md:p-3xl rounded-2xl bg-white"
        >
          {/* Header */}
          <div className="flex items-center justify-between w-full">
            <p className="font-bold md:font-extrabold text-neutral-950 tracking-t-3 md:tracking-t-none text-lg md:text-display-xs">
              {isEditing ? 'Edit Review' : 'Give Review'}
            </p>
            <button type="button" onClick={() => onOpenChange(false)} className="cursor-pointer shrink-0 size-6">
              <img src={xCloseIcon} alt="Close" className="size-6" />
            </button>
          </div>

          {/* Star rating */}
          <div className="flex flex-col items-center justify-center w-full">
            <p className="font-bold md:font-extrabold text-neutral-950 tracking-t-2 md:tracking-t-none text-sm md:text-md text-center w-full">
              Give Rating
            </p>
            <div className="flex gap-1 items-center justify-center w-full">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i + 1)}
                  aria-label={`Rate ${i + 1} star`}
                  className="cursor-pointer"
                >
                  <Star
                    className={cn(
                      'size-10 md:size-[clamp(40px,calc(29.76px+1.333vw),48.96px)]',
                      i < rating ? 'fill-accent-yellow text-accent-yellow' : 'fill-neutral-200 text-neutral-200',
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Please share your thoughts about this book"
            className="border border-neutral-300 rounded-xl h-58.75 px-lg py-md w-full text-sm md:text-md font-normal text-neutral-950 placeholder:text-neutral-500 tracking-t-3 outline-none resize-none"
          />

          {/* Submit */}
          <Button type="button" variant="primary" className="w-full h-10 md:h-12 text-sm md:text-md" disabled={isPending} onClick={handleSubmit}>
            {isPending ? 'Sending...' : 'Send'}
          </Button>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
