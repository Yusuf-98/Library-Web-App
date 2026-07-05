import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '@/components/shared/Navbar';
import { useAppSelector } from '@/app/hooks';

export default function AdminLayout() {
  const navigate = useNavigate();
  const user = useAppSelector((s) => s.auth.user);

  return (
    <div className='min-h-screen bg-neutral-50 flex flex-col'>
      {/* Navbar */}
      <Navbar
        variant='admin'
        userName={user?.name}
        avatarSrc={user?.profilePhoto ?? undefined}
        onLogoClick={() => navigate('/admin/books')}
      />
      <Outlet />
    </div>
  );
}
