import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import authReducer from '@/features/auth/authSlice';
import { loginApi } from '@/features/auth/api';
import type { User } from '@/types';
import LoginPage from './LoginPage';

vi.mock('@/features/auth/api', () => ({ loginApi: vi.fn() }));

const person = (role: string): User => ({
  id: 1,
  name: 'Yusuf',
  email: 'yusuf@example.com',
  phone: '0812',
  profilePhoto: null,
  role,
});

function LocationProbe() {
  return <div data-testid='pathname'>{useLocation().pathname}</div>;
}

function setup() {
  const store = configureStore({ reducer: { auth: authReducer } });
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/login']}>
          <LoginPage />
          <LocationProbe />
        </MemoryRouter>
      </QueryClientProvider>
    </Provider>
  );
  return { store, user: userEvent.setup() };
}

const submit = () => screen.getByRole('button', { name: 'Login' });

describe('LoginPage', () => {
  beforeEach(() => {
    vi.mocked(loginApi).mockReset();
  });

  it('is the main landmark of the page', () => {
    setup();
    expect(screen.getByRole('main')).toContainElement(screen.getByRole('heading', { name: 'Login' }));
  });

  it('asks for both fields and does not call the API when they are empty', async () => {
    const { user } = setup();
    await user.click(submit());

    expect(screen.getAllByText('This field is required.').length).toBeGreaterThan(0);
    expect(loginApi).not.toHaveBeenCalled();
  });

  it('logs a normal user in, keeps the session, and goes home', async () => {
    vi.mocked(loginApi).mockResolvedValue({ token: 'jwt-user', user: person('USER') });
    const { store, user } = setup();

    await user.type(screen.getByLabelText('Email'), 'yusuf@example.com');
    await user.type(screen.getByLabelText('Password'), 'secret1');
    await user.click(submit());

    expect(loginApi).toHaveBeenCalledExactlyOnceWith('yusuf@example.com', 'secret1');
    await waitFor(() => expect(screen.getByTestId('pathname').textContent).toBe('/'));
    expect(store.getState().auth).toMatchObject({ token: 'jwt-user', user: { role: 'USER' } });
    expect(localStorage.getItem('booky_token')).toBe('jwt-user');
  });

  it('sends an admin straight to the admin book list', async () => {
    vi.mocked(loginApi).mockResolvedValue({ token: 'jwt-admin', user: person('ADMIN') });
    const { user } = setup();

    await user.type(screen.getByLabelText('Email'), 'admin@example.com');
    await user.type(screen.getByLabelText('Password'), 'secret1');
    await user.click(submit());

    await waitFor(() => expect(screen.getByTestId('pathname').textContent).toBe('/admin/books'));
  });

  it('shows the message from the server and stays on the page when the login is refused', async () => {
    vi.mocked(loginApi).mockRejectedValue(new Error('Invalid password'));
    const { store, user } = setup();

    await user.type(screen.getByLabelText('Email'), 'yusuf@example.com');
    await user.type(screen.getByLabelText('Password'), 'wrong');
    await user.click(submit());

    expect((await screen.findAllByText('Invalid password')).length).toBeGreaterThan(0);
    expect(screen.getByTestId('pathname')).toHaveTextContent('/login');
    expect(store.getState().auth.token).toBeNull();
  });

  it('can reveal and hide the password', async () => {
    const { user } = setup();
    const password = screen.getByLabelText('Password');
    expect(password).toHaveAttribute('type', 'password');

    await user.click(screen.getByRole('button', { name: 'Show password' }));
    expect(password).toHaveAttribute('type', 'text');

    await user.click(screen.getByRole('button', { name: 'Hide password' }));
    expect(password).toHaveAttribute('type', 'password');
  });

  it('links to the register page', () => {
    setup();
    expect(screen.getByRole('link', { name: 'Register' })).toHaveAttribute('href', '/register');
  });
});
