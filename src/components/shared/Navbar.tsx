import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { FadeIn } from '@/components/common/StaggeredItems';
import logoBooky from '@/assets/images/logo-booky.png';
import johnDoeAvatar from '@/assets/images/john-doe.webp';
import searchIcon from '@/assets/icons/search.svg';
import bagIcon from '@/assets/icons/bag.svg';
import menuIcon from '@/assets/icons/menu.svg';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { logout } from '@/features/auth/authSlice';
import { openSearch, setSearchQuery } from '@/features/ui/uiSlice';
import { useImageError } from '@/hooks/useImageError';

export type NavbarVariant =
  | 'default'
  | 'no-background'
  | 'before-login'
  | 'admin';

interface NavbarProps {
  variant?: NavbarVariant;
  avatarSrc?: string;
  userName?: string;
  cartCount?: number;
  onCartClick?: () => void;
  onLoginClick?: () => void;
  onRegisterClick?: () => void;
  onLogoClick?: () => void;
  className?: string;
}

const ACCOUNT_MENU_ITEMS = [
  { label: 'Profile', path: '/profile' },
  { label: 'Borrowed List', path: '/loans' },
  { label: 'Reviews', path: '/reviews' },
];

const ADMIN_ACCOUNT_MENU_ITEMS = [
  { label: 'Profile', path: '/admin/profile' },
  { label: 'Borrowed List', path: '/admin/loans' },
  { label: 'User', path: '/admin/users' },
  { label: 'Book List', path: '/admin/books' },
];

export default function Navbar({
  variant = 'default',
  avatarSrc,
  userName,
  cartCount = 0,
  onCartClick,
  onLoginClick,
  onRegisterClick,
  onLogoClick,
  className,
}: NavbarProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    isUsable: avatarUsable,
    handleError: handleAvatarError,
    handleLoad: handleAvatarLoad,
  } = useImageError(avatarSrc);
  const searchQuery = useAppSelector((s) => s.ui.searchQuery);
  const hasShadow = variant !== 'no-background';

  // --- Handlers ---
  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <FadeIn instant className='w-full'>
      <nav
        className={cn(
          'flex items-center h-16 md:h-[clamp(64px,calc(45.71px+2.381vw),80px)] w-full mb-5',
          hasShadow && 'bg-white shadow-navbar',
          className
        )}
      >
        <div className='custom-container w-full flex items-center justify-between'>
          {/* Logo */}
          <button
            type='button'
            onClick={onLogoClick}
            className='cursor-pointer shrink-0 flex items-center gap-1 md:gap-3.75'
            aria-label='Home'
          >
            <img
              src={logoBooky}
              alt=''
              className='size-10 md:size-[clamp(40px,calc(37.71px+0.298vw),42px)] object-contain'
            />
            <span className='hidden md:inline text-display-md font-extrabold text-neutral-950'>
              Booky
            </span>
          </button>

          {/* Search bar */}
          {variant === 'default' && (
            <div className='hidden md:flex flex-1 items-center gap-1.5 h-11 px-4 py-2 mx-6 rounded-full border border-neutral-300 bg-white min-w-0 max-w-125'>
              <img src={searchIcon} alt='' className='shrink-0 size-5' />
              <input
                type='text'
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                placeholder='Search book'
                aria-label='Search book'
                className='flex-1 min-w-0 text-sm font-medium text-neutral-600 tracking-t-3 outline-none placeholder:text-neutral-600 bg-transparent'
              />
            </div>
          )}

          {/* Right icons */}
          {variant !== 'before-login' && (
            <div className='flex items-center gap-4 md:gap-[clamp(16px,calc(6.86px+1.19vw),24px)]'>
              {/* Search button */}
              {variant === 'default' && (
                <button
                  type='button'
                  onClick={() => dispatch(openSearch())}
                  className='cursor-pointer md:hidden shrink-0 size-6'
                  aria-label='Search'
                >
                  <img src={searchIcon} alt='' className='size-6' />
                </button>
              )}

              {/* Cart */}
              {(variant === 'default' || variant === 'no-background') && (
                <button
                  type='button'
                  onClick={onCartClick}
                  className='cursor-pointer relative shrink-0 size-7 md:size-[clamp(28px,calc(23.43px+0.595vw),32px)]'
                  aria-label='Cart'
                >
                  <img src={bagIcon} alt='' className='size-full' />
                  {cartCount > 0 && (
                    <span className='absolute -top-0.5 -right-1 bg-danger text-white text-[10px] font-bold size-4 rounded-full flex items-center justify-center'>
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </button>
              )}

              {/* Avatar */}
              {(variant === 'default' ||
                variant === 'no-background' ||
                variant === 'admin') && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      type='button'
                      className='cursor-pointer flex items-center gap-lg shrink-0'
                      aria-label='Account menu'
                    >
                      <span className='size-10 md:size-[clamp(40px,calc(30.86px+1.19vw),48px)] rounded-full overflow-hidden shrink-0'>
                        <img
                          src={avatarUsable ? avatarSrc : johnDoeAvatar}
                          onError={handleAvatarError}
                          onLoad={handleAvatarLoad}
                          alt=''
                          className='size-full object-cover'
                        />
                      </span>
                      {userName && (
                        <span className='hidden md:flex items-center gap-lg'>
                          <span className='text-lg font-semibold text-neutral-950 tracking-t-2 whitespace-nowrap'>
                            {userName}
                          </span>
                          <ChevronDown className='size-6 text-neutral-950' />
                        </span>
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align='end'
                    sideOffset={12}
                    collisionPadding={16}
                    className='bg-white shadow-card ring-0 rounded-2xl p-xl flex flex-col gap-xl w-[calc(100vw-var(--spacing-4xl))] md:w-46 md:min-w-46'
                  >
                    {(variant === 'admin'
                      ? ADMIN_ACCOUNT_MENU_ITEMS
                      : ACCOUNT_MENU_ITEMS
                    ).map((item) => (
                      <DropdownMenuItem
                        key={item.path}
                        onClick={() => navigate(item.path)}
                        className='cursor-pointer w-full p-0 rounded-none font-semibold text-neutral-950 hover-primary-300 tracking-t-2 text-sm md:text-md focus:bg-transparent'
                      >
                        {item.label}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className='cursor-pointer w-full p-0 rounded-none font-semibold text-danger tracking-t-2 text-sm md:text-md focus:bg-transparent'
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )}

          {/* Guest icons */}
          {variant === 'before-login' && (
            <div className='flex md:hidden items-center gap-4'>
              <button
                type='button'
                onClick={() => dispatch(openSearch())}
                className='cursor-pointer shrink-0 size-6'
                aria-label='Search'
              >
                <img src={searchIcon} alt='' className='size-6' />
              </button>
              <button
                type='button'
                onClick={onCartClick}
                className='cursor-pointer relative shrink-0 size-7'
                aria-label='Cart'
              >
                <img src={bagIcon} alt='' className='size-full' />
                {cartCount > 0 && (
                  <span className='absolute -top-0.5 -right-1 bg-danger text-white text-[10px] font-bold size-4 rounded-full flex items-center justify-center'>
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type='button'
                    className='cursor-pointer shrink-0 size-6'
                    aria-label='Menu'
                  >
                    <img src={menuIcon} alt='' className='size-6' />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align='end'
                  sideOffset={12}
                  collisionPadding={16}
                  className='bg-white shadow-card ring-0 rounded-2xl p-xl flex items-center gap-lg w-[calc(100vw-var(--spacing-4xl))]'
                >
                  <Button
                    type='button'
                    variant='outline'
                    onClick={onLoginClick}
                    className='flex-1 h-10 text-sm'
                  >
                    Login
                  </Button>
                  <Button
                    type='button'
                    variant='primary'
                    onClick={onRegisterClick}
                    className='flex-1 h-10 text-sm'
                  >
                    Register
                  </Button>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Guest buttons */}
          {variant === 'before-login' && (
            <div className='hidden md:flex items-center gap-4'>
              <Button
                type='button'
                variant='outline'
                onClick={onLoginClick}
                className='h-12 px-4 w-40.75'
              >
                Login
              </Button>
              <Button
                type='button'
                variant='primary'
                onClick={onRegisterClick}
                className='h-12 px-4 w-40.75'
              >
                Register
              </Button>
            </div>
          )}
        </div>
      </nav>
    </FadeIn>
  );
}
