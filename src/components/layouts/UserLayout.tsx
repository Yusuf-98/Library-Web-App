import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '@/components/shared/Navbar';
import { useAppSelector } from '@/app/hooks';
import { useCartCount } from '@/features/cart/useCartCount';

export default function UserLayout() {
  const navigate = useNavigate();
  const cartCount = useCartCount();
  const user = useAppSelector((s) => s.auth.user);
  const isLoggedIn = !!user;

  return (
    <div className='min-h-screen bg-neutral-50 flex flex-col'>
      {/* Navbar */}
      <Navbar
        variant={isLoggedIn ? 'default' : 'before-login'}
        cartCount={cartCount}
        userName={user?.name}
        avatarSrc={user?.profilePhoto ?? undefined}
        onLogoClick={() => navigate('/')}
        onCartClick={() => navigate('/cart')}
        onLoginClick={() => navigate('/login')}
        onRegisterClick={() => navigate('/register')}
      />
      <Outlet />
    </div>
  );
}
