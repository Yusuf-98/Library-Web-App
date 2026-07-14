import { cn } from '@/lib/utils';


export type TextareaState = 'default' | 'fill' | 'disabled' | 'error';

interface TextareaProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  state?: TextareaState;
  helperText?: string;
  rows?: number;
  className?: string;
}

export default function Textarea({
  id,
  label,
  value,
  onChange,
  placeholder,
  state = 'default',
  helperText,
  rows = 4,
  className,
}: TextareaProps) {
  const isDisabled = state === 'disabled';
  const isError    = state === 'error';

  return (
    <div className={cn('flex flex-col gap-0.5 w-full bg-white', className)}>
      <label
        htmlFor={id}
        className="text-sm font-bold text-neutral-950 tracking-t-2 w-full"
      >
        {label}
      </label>

      <div
        className={cn(
          'flex px-4 py-2 rounded-xl border w-full',
          isError    && 'border-danger',
          isDisabled && 'border-neutral-300 bg-neutral-100',
          !isError && !isDisabled && 'border-neutral-300 bg-white',
        )}
        style={{ height: '101px' }}
      >
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={isDisabled}
          rows={rows}
          className={cn(
            'flex-1 min-w-0 h-full bg-transparent outline-none resize-none text-sm text-neutral-950 placeholder:text-neutral-400 w-full',
            isDisabled && 'cursor-not-allowed text-black font-semibold',
          )}
        />
      </div>

      {isError && helperText && (
        <p className="text-sm font-medium text-danger tracking-t-3 w-full">
          {helperText}
        </p>
      )}
    </div>
  );
}
