import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PageFallback from '@/components/shared/PageFallback';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import AdminRoute from '@/components/shared/AdminRoute';
import SearchOverlay from '@/components/shared/SearchOverlay';
import ScrollToTop from '@/components/shared/ScrollToTop';
import UserLayout from '@/components/layouts/UserLayout';
import AccountSectionLayout from '@/components/layouts/AccountSectionLayout';

const Toaster = lazy(() =>
  import('@/components/ui/sonner').then((m) => ({ default: m.Toaster }))
);
const AdminLayout = lazy(() => import('@/components/layouts/AdminLayout'));
const AdminSectionLayout = lazy(
  () => import('@/components/layouts/AdminSectionLayout')
);

const LoginPage = lazy(() => import('@/pages/user/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/user/RegisterPage'));
const HomePage = lazy(() => import('@/pages/user/HomePage'));
const BookDetailPage = lazy(() => import('@/pages/user/BookDetailPage'));
const CategoryPage = lazy(() => import('@/pages/user/CategoryPage'));
const BookByAuthorPage = lazy(() => import('@/pages/user/BookByAuthorPage'));
const CartPage = lazy(() => import('@/pages/user/CartPage'));
const CheckoutPage = lazy(() => import('@/pages/user/CheckoutPage'));
const SuccessPage = lazy(() => import('@/pages/user/SuccessPage'));
const MyLoansPage = lazy(() => import('@/pages/user/MyLoansPage'));
const MyProfilePage = lazy(() => import('@/pages/user/MyProfilePage'));
const ReviewsPage = lazy(() => import('@/pages/user/ReviewsPage'));

const AdminBookListPage = lazy(() => import('@/pages/admin/AdminBookListPage'));
const AdminBookFormPage = lazy(() => import('@/pages/admin/AdminBookFormPage'));
const AdminBookPreviewPage = lazy(
  () => import('@/pages/admin/AdminBookPreviewPage')
);
const AdminUserListPage = lazy(() => import('@/pages/admin/AdminUserListPage'));
const AdminBorrowedListPage = lazy(
  () => import('@/pages/admin/AdminBorrowedListPage')
);
const AdminProfilePage = lazy(() => import('@/pages/admin/AdminProfilePage'));

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* Public */}
          <Route element={<UserLayout />}>
            <Route path='/' element={<HomePage />} />
            <Route path='/books/:id' element={<BookDetailPage />} />
            <Route path='/category/:id' element={<CategoryPage />} />
            <Route path='/author/:id' element={<BookByAuthorPage />} />
          </Route>

          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />

          {/* User */}
          <Route element={<ProtectedRoute />}>
            <Route path='/checkout/success' element={<SuccessPage />} />
            <Route element={<UserLayout />}>
              <Route path='/cart' element={<CartPage />} />
              <Route path='/checkout' element={<CheckoutPage />} />
              <Route element={<AccountSectionLayout />}>
                <Route path='/loans' element={<MyLoansPage />} />
                <Route path='/profile' element={<MyProfilePage />} />
                <Route path='/reviews' element={<ReviewsPage />} />
              </Route>
            </Route>
          </Route>

          {/* Admin */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route element={<AdminSectionLayout />}>
                <Route path='/admin/books' element={<AdminBookListPage />} />
                <Route path='/admin/users' element={<AdminUserListPage />} />
                <Route path='/admin/loans' element={<AdminBorrowedListPage />} />
              </Route>
              <Route path='/admin/books/new' element={<AdminBookFormPage />} />
              <Route
                path='/admin/books/:id/edit'
                element={<AdminBookFormPage />}
              />
              <Route
                path='/admin/books/:id/preview'
                element={<AdminBookPreviewPage />}
              />
              <Route path='/admin/profile' element={<AdminProfilePage />} />
            </Route>
          </Route>

          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </Suspense>
      <SearchOverlay />
      <Suspense fallback={null}>
        <Toaster
          position='top-right'
          offset={{ top: 20, right: 120 }}
          mobileOffset={{ top: 20, right: 16 }}
        />
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
