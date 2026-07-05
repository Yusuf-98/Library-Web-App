import { Outlet, useLocation } from 'react-router-dom';
import AdminTabs, { type AdminTab } from '@/components/admin/AdminTabs';
import { FadeIn } from '@/components/common/StaggeredItems';

const ACTIVE_TAB_BY_PATH: Record<string, AdminTab> = {
  '/admin/books': 'books',
  '/admin/loans': 'loans',
  '/admin/users': 'users',
};

export default function AdminSectionLayout() {
  const { pathname } = useLocation();
  const active = ACTIVE_TAB_BY_PATH[pathname] ?? 'books';

  return (
    <main className='flex-1 custom-container pt-[clamp(0px,calc(-40.57px+4.76vw),28px)] pb-xl md:pb-[clamp(16px,calc(-20.57px+4.762vw),48px)]'>
      {/* Tabs */}
      <FadeIn>
        <AdminTabs active={active} />
      </FadeIn>

      <Outlet />
    </main>
  );
}
