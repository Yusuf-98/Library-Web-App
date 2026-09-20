import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import authReducer from '@/features/auth/authSlice';
import { loginApi, registerApi } from '@/features/auth/api';
import type { User } from '@/types';
import RegisterPage from './RegisterPage';

vi.mock('@/features/auth/api', () => ({ registerApi: vi.fn(), loginApi: vi.fn() }));

const user: User = {
  id: 1,
  name: 'Yusuf',
  email: 'yusuf@example.com',
  phone: '081234567890',
  profilePhoto: null,
  role: 'USER',
};

function LocationProbe() {
  return <div data-testid='pathname'>{useLocation().pathname}</div>;
}

function setup() {
  const store = configureStore({ reducer: { auth: authReducer } });
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
  render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/register']}>
          <RegisterPage />
          <LocationProbe />
        </MemoryRouter>
      </QueryClientProvider>
    </Provider>
  );
  return { store, user: userEvent.setup() };
}

const submit = () => screen.getByRole('button', { name: 'Submit' });
const input = (label: string) => screen.getByLabelText(label);

async function fillForm(
  u: ReturnType<typeof userEvent.setup>,
  values: Partial<Record<'Name' | 'Email' | 'Nomor Handphone' | 'Password' | 'Confirm Password', string>>
) {
  for (const [label, value] of Object.entries(values)) {
    await u.type(input(label), value);
  }
}

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.mocked(registerApi).mockReset();
    vi.mocked(loginApi).mockReset();
  });

  it('shows an error under every empty field and does not call the API', async () => {
    const { user: u } = setup();
    await u.click(submit());

    expect(screen.getByText('Name is required.')).toBeInTheDocument();
    expect(screen.getByText('Email is required.')).toBeInTheDocument();
    expect(screen.getByText('Phone number is required.')).toBeInTheDocument();
    expect(screen.getByText('Password is required.')).toBeInTheDocument();
    expect(screen.getByText('Please confirm your password.')).toBeInTheDocument();
    expect(registerApi).not.toHaveBeenCalled();
  });

  it('moves focus to the first invalid field and links the message to it', async () => {
    const { user: u } = setup();
    await fillForm(u, { Name: 'Yusuf' });
    await u.click(submit());

    const email = input('Email');
    expect(email).toHaveFocus();
    expect(email).toHaveAttribute('aria-invalid', 'true');
    expect(email).toHaveAccessibleDescription('Email is required.');
    expect(input('Name')).not.toHaveAttribute('aria-invalid');
  });

  it('explains an invalid email, a short password and a mismatch', async () => {
    const { user: u } = setup();
    await fillForm(u, {
      Name: 'Yusuf',
      Email: 'not-an-email',
      'Nomor Handphone': '0812',
      Password: '123',
      'Confirm Password': '456',
    });
    await u.click(submit());

    expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument();
    expect(screen.getByText('Password must be at least 6 characters.')).toBeInTheDocument();
    expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
    expect(registerApi).not.toHaveBeenCalled();
  });

  it('clears a field error as soon as that field is edited', async () => {
    const { user: u } = setup();
    await u.click(submit());
    expect(screen.getByText('Name is required.')).toBeInTheDocument();

    await u.type(input('Name'), 'Y');

    expect(screen.queryByText('Name is required.')).not.toBeInTheDocument();
    expect(screen.getByText('Email is required.')).toBeInTheDocument();
  });

  it('registers with trimmed text, logs in, stores the session and goes home', async () => {
    vi.mocked(registerApi).mockResolvedValue(user);
    vi.mocked(loginApi).mockResolvedValue({ token: 'jwt-token', user });
    const { store, user: u } = setup();

    await fillForm(u, {
      Name: '  Yusuf  ',
      Email: 'yusuf@example.com',
      'Nomor Handphone': ' 081234567890 ',
      Password: 'secret1',
      'Confirm Password': 'secret1',
    });
    await u.click(submit());

    expect(registerApi).toHaveBeenCalledExactlyOnceWith({
      name: 'Yusuf',
      email: 'yusuf@example.com',
      phone: '081234567890',
      password: 'secret1',
      confirmPassword: 'secret1',
    });
    expect(loginApi).toHaveBeenCalledExactlyOnceWith('yusuf@example.com', 'secret1');
    await waitFor(() => expect(screen.getByTestId('pathname').textContent).toBe('/'));
    expect(store.getState().auth).toMatchObject({ token: 'jwt-token', user });
  });

  it('shows the server message when registration is rejected', async () => {
    vi.mocked(registerApi).mockRejectedValue(new Error('Email already registered'));
    const { user: u } = setup();

    await fillForm(u, {
      Name: 'Yusuf',
      Email: 'yusuf@example.com',
      'Nomor Handphone': '0812',
      Password: 'secret1',
      'Confirm Password': 'secret1',
    });
    await u.click(submit());

    expect(await screen.findByText('Email already registered')).toBeInTheDocument();
    expect(loginApi).not.toHaveBeenCalled();
    expect(screen.getByTestId('pathname')).toHaveTextContent('/register');
  });
});
