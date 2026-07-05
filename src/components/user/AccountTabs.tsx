import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export type AccountTab = 'profile' | 'loans' | 'reviews';

const TABS: { key: AccountTab; label: string; path: string }[] = [
  { key: 'profile', label: 'Profile', path: '/profile' },
  { key: 'loans', label: 'Borrowed List', path: '/loans' },
  { key: 'reviews', label: 'Reviews', path: '/reviews' },
];

export default function AccountTabs({ active }: { active: AccountTab }) {
  const navigate = useNavigate();

  return (
    <div className="bg-neutral-100 rounded-2xl flex gap-md h-14 p-md w-full md:w-139.25">
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => navigate(tab.path)}
            className={cn(
              'cursor-pointer grow shrink-0 basis-0 md:flex-none md:w-43.75 h-10 flex items-center justify-center px-lg py-md text-sm md:text-md whitespace-nowrap',
              isActive
                ? 'bg-white shadow-card rounded-xl font-bold text-neutral-950 tracking-t-2'
                : 'font-medium text-neutral-600 tracking-t-3',
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
