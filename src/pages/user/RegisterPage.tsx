import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import logoBooky from '@/assets/images/logo-booky.png';
import { registerApi, loginApi } from '@/features/auth/api';
import { setCredentials } from '@/features/auth/authSlice';
import { getErrorMessage } from '@/lib/utils';
import {
  validateRegistration,
  type RegisterErrors,
  type RegisterValues,
} from '@/lib/validation';
import InputField from '@/components/ui/input-field';
import { Button } from '@/components/ui/button';
import { FadeInUp } from '@/components/common/StaggeredItems';

export default function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<RegisterErrors>({});

  const { mutate: register, isPending } = useMutation({
    mutationFn: async () => {
      const cleanEmail = email.trim();
      await registerApi({
        name: name.trim(),
        email: cleanEmail,
        phone: phone.trim(),
        password,
        confirmPassword,
      });
      // Register doesn't return a session token, so log in right after
      // with the same credentials to get one.
      return loginApi(cleanEmail, password);
    },
    onSuccess: (data) => {
      dispatch(setCredentials({ user: data.user, token: data.token }));
      navigate('/');
    },
    onError: (error) => {
      setErrorMsg(
        getErrorMessage(error, 'Registration failed. Please check your details and try again.')
      );
    },
  });

  // Editing a field clears its own error.
  const field =
    (key: keyof RegisterValues, setter: (value: string) => void) =>
    (value: string) => {
      setter(value);
      setFieldErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const errors = validateRegistration({ name, email, phone, password, confirmPassword });
    setFieldErrors(errors);
    const firstInvalid = (
      ['name', 'email', 'phone', 'password', 'confirmPassword'] as const
    ).find((key) => errors[key]);
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }
    register();
  };

  return (
    <main className='min-h-screen bg-white'>
      <div className='mx-auto w-full max-w-98.25 md:max-w-100 px-6 md:px-0 pt-[clamp(40px,8.8svh,75px)] pb-10'>
        <FadeInUp className='flex flex-col gap-5'>
          {/* Logo */}
          <div className='flex items-center gap-3 shrink-0'>
            <img
              src={logoBooky}
              alt='Booky logo'
              className='size-8.25 shrink-0'
            />
            <span className='font-bold text-neutral-950 whitespace-nowrap text-6.25 leading-8.25'>
              Booky
            </span>
          </div>

          {/* Heading */}
          <div className='flex flex-col gap-0.5 md:gap-2 w-full'>
            <h1 className='text-display-xs md:text-display-sm font-bold text-neutral-950 md:tracking-t-2 w-full'>
              Register
            </h1>
            <p className='text-sm md:text-md font-semibold text-neutral-700 tracking-t-2 w-full'>
              Create your account to start borrowing books.
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className='flex flex-col gap-4'
          >
            <InputField
              id='name'
              label='Name'
              type='text'
              autoComplete='name'
              value={name}
              onChange={field('name', setName)}
              state={fieldErrors.name ? 'error' : 'default'}
              helperText={fieldErrors.name}
            />
            <InputField
              id='email'
              label='Email'
              type='email'
              autoComplete='email'
              value={email}
              onChange={field('email', setEmail)}
              state={fieldErrors.email ? 'error' : 'default'}
              helperText={fieldErrors.email}
            />
            <InputField
              id='phone'
              label='Nomor Handphone'
              type='tel'
              autoComplete='tel'
              value={phone}
              onChange={field('phone', setPhone)}
              state={fieldErrors.phone ? 'error' : 'default'}
              helperText={fieldErrors.phone}
            />
            <InputField
              id='password'
              label='Password'
              autoComplete='new-password'
              value={password}
              onChange={field('password', setPassword)}
              state={fieldErrors.password ? 'error' : 'default'}
              helperText={fieldErrors.password}
              showPasswordToggle
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword((v) => !v)}
            />
            <InputField
              id='confirmPassword'
              label='Confirm Password'
              autoComplete='new-password'
              value={confirmPassword}
              onChange={field('confirmPassword', setConfirmPassword)}
              state={fieldErrors.confirmPassword ? 'error' : 'default'}
              helperText={fieldErrors.confirmPassword}
              showPasswordToggle
              showPassword={showConfirmPassword}
              onTogglePassword={() => setShowConfirmPassword((v) => !v)}
            />

            {errorMsg && <p className='text-sm text-accent-red'>{errorMsg}</p>}

            <Button
              type='submit'
              variant='primary'
              fullWidth
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className='size-5 border-2 border-white/40 border-t-white rounded-full animate-spin' />
                  Submitting...
                </>
              ) : (
                'Submit'
              )}
            </Button>

            {/* Login link */}
            <div className='flex items-center justify-center gap-1 w-full text-sm md:text-md tracking-t-2 whitespace-nowrap'>
              <span className='font-semibold text-neutral-950'>
                Already have an account?
              </span>
              <Link
                to='/login'
                className='font-bold text-primary-300 hover:underline'
              >
                Log In
              </Link>
            </div>
          </form>
        </FadeInUp>
      </div>
    </main>
  );
}
