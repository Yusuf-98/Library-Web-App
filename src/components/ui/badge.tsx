import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center justify-center px-2 py-0.5 rounded-xs text-sm font-bold tracking-t-2 whitespace-nowrap',
  {
    variants: {
      variant: {
        green:  'bg-success/5  text-success',
        red:    'bg-danger/5 text-danger',
        yellow: 'bg-warning/5 text-warning',
      },
    },
    defaultVariants: {
      variant: 'green',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge };
