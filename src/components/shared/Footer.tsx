import { cn } from '@/lib/utils';
import { FadeIn } from '@/components/common/StaggeredItems';
import logoBooky from '@/assets/images/logo-booky.png';
import facebookIcon from '@/assets/icons/facebook.svg';
import instagramIcon from '@/assets/icons/instagram.svg';
import linkedinIcon from '@/assets/icons/linkedin.svg';
import tiktokIcon from '@/assets/icons/tiktok.svg';

interface FooterProps {
  className?: string;
  onLogoClick?: () => void;
}

export default function Footer({ className, onLogoClick }: FooterProps) {
  const socialLinks = [
    { icon: facebookIcon, label: 'Facebook', href: 'https://www.facebook.com' },
    {
      icon: instagramIcon,
      label: 'Instagram',
      href: 'https://www.instagram.com',
    },
    { icon: linkedinIcon, label: 'LinkedIn', href: 'https://www.linkedin.com' },
    { icon: tiktokIcon, label: 'TikTok', href: 'https://www.tiktok.com' },
  ];

  return (
    <FadeIn className='w-full'>
      <footer
        className={cn(
          'bg-white border-t border-neutral-300 flex flex-col items-center px-4 py-10 md:flex-row md:justify-center md:px-37.5 md:py-20 mt-4 md:mt-23',
          className
        )}
      >
        <div className='flex flex-col items-center gap-4 w-full md:flex-1 md:gap-10'>
          {/* Logo */}
          <div className='flex flex-col items-center gap-4 md:gap-5.5 w-full'>
            <button
              type='button'
              onClick={onLogoClick}
              className='cursor-pointer flex items-center gap-2.75 md:gap-3.75'
              aria-label='Home'
            >
              <img
                src={logoBooky}
                alt=''
                className='size-8 md:size-10.5 object-contain'
              />
              <span className='text-display-md font-extrabold text-neutral-950'>
                Booky
              </span>
            </button>
            <p className='text-sm font-semibold text-neutral-950 text-center tracking-t-2 md:text-md'>
              Discover inspiring stories &amp; timeless knowledge, ready to
              borrow anytime. Explore online or visit our nearest library
              branch.
            </p>
          </div>

          {/* Social Media */}
          <div className='flex flex-col gap-5 w-49'>
            <p className='text-md font-bold text-neutral-950 text-center md:text-left tracking-t-2 md:tracking-t-none'>
              Follow on Social Media
            </p>
            <div className='flex items-center gap-3'>
              {socialLinks.map(({ icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target='_blank'
                  rel='noopener noreferrer'
                  aria-label={label}
                  className='social-link size-10 rounded-full border border-neutral-300 flex items-center justify-center hover-dark transition'
                >
                  <span
                    aria-hidden='true'
                    className='size-5 shrink-0 icon-mask'
                    style={
                      { '--icon-url': `url("${icon}")` } as React.CSSProperties
                    }
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </FadeIn>
  );
}
