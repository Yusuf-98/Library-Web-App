import { cn } from '@/lib/utils';

interface AdminStatusFiltersProps<T extends string> {
  filters: { label: string; value: T }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  chipClassName?: string;
}

export default function AdminStatusFilters<T extends string>({
  filters,
  value,
  onChange,
  className,
  chipClassName,
}: AdminStatusFiltersProps<T>) {
  return (
    <div className={cn('flex items-center gap-md md:gap-lg flex-wrap', className)}>
      {filters.map((f) => (
        <button
          key={f.value}
          type="button"
          onClick={() => onChange(f.value)}
          className={cn(
            'cursor-pointer h-10 flex items-center justify-center px-xl py-md rounded-full text-sm md:text-md tracking-t-2',
            value === f.value
              ? 'bg-primary-100 border border-primary-300 text-primary-300 font-bold'
              : 'border border-neutral-300 text-neutral-950 font-semibold',
            chipClassName,
          )}
        >
          {f.label}
        </button>
      ))}
    </div>
  );
}
