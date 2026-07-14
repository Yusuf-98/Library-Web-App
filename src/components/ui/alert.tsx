import { X } from 'lucide-react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';


const alertVariants = cva(
  'flex items-center gap-2 h-10 px-3 py-2 rounded-md',
  {
    variants: {
      variant: {
        success: 'bg-accent-green',
        danger:  'bg-accent-red',
      },
    },
    defaultVariants: {
      variant: 'success',
    },
  }
);

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  onClose?: () => void;
}

function Alert({ className, variant, onClose, children, ...props }: AlertProps) {
  return (
    <div
      role="alert"
      data-slot="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      <p className="flex-1 min-w-0 text-sm font-semibold text-white tracking-t-2">
        {children}
      </p>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="cursor-pointer shrink-0 size-4 flex items-center justify-center text-white hover:opacity-70 transition"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}

export { Alert };
