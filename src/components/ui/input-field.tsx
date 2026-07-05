import eyeIcon from '@/assets/icons/eye.svg';
import eyeOffIcon from '@/assets/icons/eye-off.svg';
import { cn } from '@/lib/utils';


export type InputState = 'default' | 'fill' | 'disabled' | 'error';

interface InputFieldProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  placeholder?: string;
  state?: InputState;
  helperText?: string;
  showPasswordToggle?: boolean;
  showPassword?: boolean;
  onTogglePassword?: () => void;
  className?: string;
}

export default function InputField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  autoComplete,
  placeholder,
  state = 'default',
  helperText,
  showPasswordToggle = false,
  showPassword = false,
  onTogglePassword,
  className,
}: InputFieldProps) {
  const isDisabled = state === 'disabled';
  const isError    = state === 'error';
  const inputType  = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;

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
          'flex items-center gap-2 h-12 px-4 py-2 rounded-xl border w-full',
          isError    && 'border-danger',
          isDisabled && 'border-neutral-300 bg-neutral-100',
          !isError && !isDisabled && 'border-neutral-300 bg-white',
        )}
      >
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          disabled={isDisabled}
          className={cn(
            'flex-1 min-w-0 bg-transparent outline-none text-md font-semibold text-neutral-950 tracking-t-2 placeholder:text-neutral-400',
            isDisabled && 'cursor-not-allowed text-black',
          )}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            disabled={isDisabled}
            className="cursor-pointer shrink-0 size-5 flex items-center justify-center"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword
              ? <img src={eyeIcon} alt="" className="size-5" />
              : <img src={eyeOffIcon} alt="" className="size-5" />}
          </button>
        )}
      </div>

      {isError && helperText && (
        <p className="text-sm font-medium text-danger tracking-t-3 w-full">
          {helperText}
        </p>
      )}
    </div>
  );
}
