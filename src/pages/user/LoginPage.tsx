import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import logoBooky from '@/assets/images/logo-booky.png';
import { loginApi } from '@/features/auth/api';
import { setCredentials } from '@/features/auth/authSlice';
import { getErrorMessage } from '@/lib/utils';
import InputField from '@/components/ui/input-field';
import { Button } from '@/components/ui/button';
import { FadeInUp } from '@/components/common/StaggeredItems';

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { mutate: login, isPending } = useMutation({
    mutationFn: () => loginApi(email, password),
    onSuccess: (data) => {
      dispatch(setCredentials({ user: data.user, token: data.token }));
      navigate(data.user.role === 'ADMIN' ? '/admin/books' : '/');
    },
    onError: (error) => {
      setErrorMsg(getErrorMessage(error, 'Invalid email or password. Please try again.'));
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('This field is required.');
      return;
    }
    login();
  };

  return (
    <main className='min-h-screen bg-white'>
      <div className='mx-auto w-full max-w-98.25 md:max-w-100 px-8.5 md:px-0 pt-[clamp(60px,25.5svh,217px)] pb-10'>
        <FadeInUp className='flex flex-col gap-5'>
          {/* Logo */}
          <div className='flex items-center gap-3 shrink-0'>
            <img
              src={logoBooky}
              alt='Booky logo'
              className='size-8.25 shrink-0'
            />
            <span className='font-bold text-neutral-950 whitespace-nowrap text-[25.14px] leading-8.25'>
              Booky
            </span>
          </div>

          {/* Heading */}
          <div className='flex flex-col gap-0.5 md:gap-2 w-full'>
            <h1 className='text-display-xs md:text-display-sm font-bold text-neutral-950 md:tracking-t-2 w-full'>
              Login
            </h1>
            <p className='text-sm md:text-md font-semibold text-neutral-700 tracking-t-2 w-full'>
              Sign in to manage your library account.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className='flex flex-col gap-4'
          >
            <InputField
              id='email'
              label='Email'
              type='email'
              autoComplete='email'
              value={email}
              onChange={setEmail}
              state={errorMsg ? 'error' : 'default'}
              helperText={errorMsg}
            />
            <InputField
              id='password'
              label='Password'
              autoComplete='current-password'
              value={password}
              onChange={setPassword}
              showPasswordToggle
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword((v) => !v)}
              state={errorMsg ? 'error' : 'default'}
              helperText={errorMsg}
            />

            <Button
              type='submit'
              variant='primary'
              fullWidth
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className='size-5 border-2 border-white/40 border-t-white rounded-full animate-spin' />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>

            {/* Register link */}
            <div className='flex items-center justify-center gap-1 w-full text-sm md:text-md tracking-t-2 whitespace-nowrap'>
              <span className='font-semibold text-neutral-950'>
                Don't have an account?
              </span>
              <Link
                to='/register'
                className='font-bold text-primary-300 hover:underline'
              >
                Register
              </Link>
            </div>
          </form>
        </FadeInUp>
      </div>
    </main>
  );
}
