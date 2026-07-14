import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import AdminRoute from '@/components/shared/AdminRoute';
import SearchOverlay from '@/components/shared/SearchOverlay';
import ScrollToTop from '@/components/shared/ScrollToTop';
import UserLayout from '@/components/layouts/UserLayout';
import AccountSectionLayout from '@/components/layouts/AccountSectionLayout';
import AdminLayout from '@/components/layouts/AdminLayout';
import AdminSectionLayout from '@/components/layouts/AdminSectionLayout';

import LoginPage from '@/pages/user/LoginPage';
import RegisterPage from '@/pages/user/RegisterPage';
import HomePage from '@/pages/user/HomePage';
import BookDetailPage from '@/pages/user/BookDetailPage';
import CategoryPage from '@/pages/user/CategoryPage';
import BookByAuthorPage from '@/pages/user/BookByAuthorPage';
import CartPage from '@/pages/user/CartPage';
import CheckoutPage from '@/pages/user/CheckoutPage';
import SuccessPage from '@/pages/user/SuccessPage';
import MyLoansPage from '@/pages/user/MyLoansPage';
import MyProfilePage from '@/pages/user/MyProfilePage';
import ReviewsPage from '@/pages/user/ReviewsPage';

import AdminBookListPage from '@/pages/admin/AdminBookListPage';
import AdminBookFormPage from '@/pages/admin/AdminBookFormPage';
import AdminBookPreviewPage from '@/pages/admin/AdminBookPreviewPage';
import AdminUserListPage from '@/pages/admin/AdminUserListPage';
import AdminBorrowedListPage from '@/pages/admin/AdminBorrowedListPage';
import AdminProfilePage from '@/pages/admin/AdminProfilePage';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public, browsable without login */}
        <Route element={<UserLayout />}>
          <Route path='/' element={<HomePage />} />
          <Route path='/books/:id' element={<BookDetailPage />} />
          <Route path='/category/:id' element={<CategoryPage />} />
          <Route path='/author/:id' element={<BookByAuthorPage />} />
        </Route>

        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />

        {/* User (requires login) */}
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
      <SearchOverlay />
      <Toaster
        position='top-right'
        offset={{ top: 20, right: 120 }}
        mobileOffset={{ top: 20, right: 16 }}
      />
    </BrowserRouter>
  );
}

export default App;
