import { Dialog, DialogPortal, DialogOverlay, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  isConfirming?: boolean;
  onConfirm: () => void;
}

export default function ConfirmDialog({
  open,
  onOpenChange,
  title = 'Delete Data',
  description = "Once deleted, you won't be able to recover this data.",
  confirmLabel = 'Confirm',
  isConfirming = false,
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent
          showCloseButton={false}
          className="max-w-[calc(100%-var(--spacing-4xl))] md:max-w-113 flex flex-col gap-xl md:gap-4xl p-2xl rounded-2xl bg-white"
        >
          {/* Title + description */}
          <div className="flex flex-col gap-lg w-full">
            <p className="font-bold text-neutral-950 tracking-t-2 md:tracking-t-3 text-md md:text-lg">{title}</p>
            <p className="font-semibold text-neutral-950 tracking-t-2 text-sm md:text-md">{description}</p>
          </div>
          {/* Actions */}
          <div className="flex items-center gap-xl w-full">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-10 md:h-11 text-sm md:text-md"
              disabled={isConfirming}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="flex-1 h-10 md:h-11 text-sm md:text-md bg-accent-red text-neutral-25 hover:opacity-90"
              disabled={isConfirming}
              onClick={onConfirm}
            >
              {isConfirming ? 'Deleting...' : confirmLabel}
            </Button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
