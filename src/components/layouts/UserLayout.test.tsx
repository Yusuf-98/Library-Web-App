import { render, screen } from '@testing-library/react';
import { lazy } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import authReducer from '@/features/auth/authSlice';
import uiReducer from '@/features/ui/uiSlice';
import UserLayout from './UserLayout';

const NeverLoads = lazy(() => new Promise<never>(() => {}));

function setup(page: React.ReactNode) {
  const store = configureStore({ reducer: { auth: authReducer, ui: uiReducer } });
  render(
    <Provider store={store}>
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route element={<UserLayout />}>
              <Route path='/' element={page} />
            </Route>
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    </Provider>
  );
}

describe('UserLayout', () => {
  it('renders the page below the navbar', () => {
    setup(<p>home content</p>);

    expect(screen.getByRole('button', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByText('home content')).toBeInTheDocument();
  });

  it('keeps the navbar on screen while a lazy page is still loading', () => {
    setup(<NeverLoads />);

    expect(screen.getByRole('button', { name: 'Home' })).toBeInTheDocument();
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();
  });
});
