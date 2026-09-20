import { render, screen } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import authReducer from '@/features/auth/authSlice';
import type { User } from '@/types';
import AdminRoute from './AdminRoute';
import ProtectedRoute from './ProtectedRoute';

const user = (role: string): User => ({
  id: 1,
  name: 'Test',
  email: 't@example.com',
  phone: '0800',
  profilePhoto: null,
  role,
});

function renderAt(path: string, auth: { token: string | null; user: User | null }) {
  const store = configureStore({ reducer: { auth: authReducer }, preloadedState: { auth } });
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path='/cart' element={<p>cart page</p>} />
          </Route>
          <Route element={<AdminRoute />}>
            <Route path='/admin/books' element={<p>admin books page</p>} />
          </Route>
          <Route path='/login' element={<p>login page</p>} />
          <Route path='/' element={<p>home page</p>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
}

describe('ProtectedRoute', () => {
  it('sends a visitor without a token to the login page', () => {
    renderAt('/cart', { token: null, user: null });
    expect(screen.getByText('login page')).toBeInTheDocument();
    expect(screen.queryByText('cart page')).not.toBeInTheDocument();
  });

  it('lets a logged-in user through', () => {
    renderAt('/cart', { token: 'jwt', user: user('USER') });
    expect(screen.getByText('cart page')).toBeInTheDocument();
  });
});

describe('AdminRoute', () => {
  it('sends a visitor who is not logged in to the login page', () => {
    renderAt('/admin/books', { token: null, user: null });
    expect(screen.getByText('login page')).toBeInTheDocument();
  });

  it('keeps a normal user out of the admin area and sends them home', () => {
    renderAt('/admin/books', { token: 'jwt', user: user('USER') });
    expect(screen.getByText('home page')).toBeInTheDocument();
    expect(screen.queryByText('admin books page')).not.toBeInTheDocument();
  });

  it('lets an admin in', () => {
    renderAt('/admin/books', { token: 'jwt', user: user('ADMIN') });
    expect(screen.getByText('admin books page')).toBeInTheDocument();
  });

  it('matches the role exactly (lower case is not an admin)', () => {
    renderAt('/admin/books', { token: 'jwt', user: user('admin') });
    expect(screen.getByText('home page')).toBeInTheDocument();
  });
});
