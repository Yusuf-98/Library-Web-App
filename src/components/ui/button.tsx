import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from 'radix-ui';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 h-12 p-2 rounded-full text-md font-bold tracking-t-2 transition active:scale-[0.98] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap',
  {
    variants: {
      variant: {
        primary: 'bg-primary-300 text-neutral-25 hover-dim',
        outline:
          'border border-neutral-300 text-neutral-950 hover-dark',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({
  className,
  variant,
  fullWidth,
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : 'button';
  return (
    <Comp
      data-slot='button'
      className={cn(buttonVariants({ variant, fullWidth, className }))}
      {...props}
    />
  );
}

export { Button };
