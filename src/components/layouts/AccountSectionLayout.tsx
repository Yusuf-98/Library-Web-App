import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import AccountTabs, { type AccountTab } from '@/components/user/AccountTabs';
import Footer from '@/components/shared/Footer';
import { FadeIn } from '@/components/common/StaggeredItems';
import { cn } from '@/lib/utils';

const ACTIVE_TAB_BY_PATH: Record<string, AccountTab> = {
  '/profile': 'profile',
  '/loans': 'loans',
  '/reviews': 'reviews',
};

export default function AccountSectionLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const active = ACTIVE_TAB_BY_PATH[pathname] ?? 'profile';

  return (
    <>
      <main
        className={cn(
          'flex-1 custom-container md:py-[clamp(16px,calc(-20.57px+4.762vw),26px)]',
          active === 'profile' ? 'mb-10' : 'mb-8'
        )}
      >
        <div className='max-w-250 mx-auto'>
          {/* Tabs */}
          <FadeIn className='mb-3.75 md:mb-[clamp(15.04px,calc(4.8px+1.333vw),24px)]'>
            <AccountTabs active={active} />
          </FadeIn>

          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <Footer onLogoClick={() => navigate('/')} />
    </>
  );
}
