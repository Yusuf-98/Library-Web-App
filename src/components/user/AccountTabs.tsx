import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useRovingTabs } from '@/hooks/useRovingTabs';

export type AccountTab = 'profile' | 'loans' | 'reviews';

// --- Config ---
const TABS: { key: AccountTab; label: string; path: string }[] = [
  { key: 'profile', label: 'Profile', path: '/profile' },
  { key: 'loans', label: 'Borrowed List', path: '/loans' },
  { key: 'reviews', label: 'Reviews', path: '/reviews' },
];

const TABPANEL_ID = 'account-tabpanel';
const tabId = (key: AccountTab) => `account-tab-${key}`;

// --- Tab list ---
export default function AccountTabs({ active }: { active: AccountTab }) {
  const navigate = useNavigate();
  const { tabRefs, onKeyDown } = useRovingTabs(TABS.length);

  return (
    <div
      role="tablist"
      aria-label="Account sections"
      className="bg-neutral-100 rounded-2xl flex gap-md h-14 p-md w-full md:w-139.25"
    >
      {TABS.map((tab, index) => {
        const isActive = tab.key === active;
        return (
          <button
            key={tab.key}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
            id={tabId(tab.key)}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={TABPANEL_ID}
            tabIndex={isActive ? 0 : -1}
            onKeyDown={(e) => onKeyDown(e, index)}
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

// --- Panel ---
export function AccountTabPanel({
  active,
  children,
}: {
  active: AccountTab;
  children: ReactNode;
}) {
  return (
    <div role="tabpanel" id={TABPANEL_ID} aria-labelledby={tabId(active)}>
      {children}
    </div>
  );
}
