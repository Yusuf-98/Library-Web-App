import searchIcon from '@/assets/icons/search.svg';

interface AdminSearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function AdminSearchInput({
  value,
  onChange,
  placeholder = 'Search',
}: AdminSearchInputProps) {
  return (
    <div className="flex items-center gap-1.5 h-11 md:h-12 px-xl py-md rounded-full border border-neutral-300 bg-white w-full">
      <img src={searchIcon} alt="" className="shrink-0 size-5" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 min-w-0 text-sm font-medium text-neutral-600 tracking-t-3 outline-none placeholder:text-neutral-600 bg-transparent"
      />
    </div>
  );
}
