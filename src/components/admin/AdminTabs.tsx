import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

export type AdminTab = 'loans' | 'users' | 'books';

const TABS: { key: AdminTab; label: string; path: string }[] = [
  { key: 'loans', label: 'Borrowed List', path: '/admin/loans' },
  { key: 'users', label: 'User', path: '/admin/users' },
  { key: 'books', label: 'Book List', path: '/admin/books' },
];

export default function AdminTabs({ active }: { active: AdminTab }) {
  const navigate = useNavigate();

  return (
    <div className="bg-neutral-100 rounded-2xl flex gap-md h-14 p-md w-full md:w-[clamp(600px,calc(891.43px-20.24vw),736px)]">
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => navigate(tab.path)}
            className={cn(
              'cursor-pointer flex-1 h-10 flex items-center justify-center px-lg py-md text-sm md:text-md whitespace-nowrap',
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
