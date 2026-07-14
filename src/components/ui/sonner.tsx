import { useTheme } from 'next-themes';
import { Toaster as Sonner, type ToasterProps } from 'sonner';
import alertCloseIcon from '@/assets/icons/alert-close.svg';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group'
      closeButton
      icons={{
        close: <img src={alertCloseIcon} alt='' className='size-4' />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            'flex! items-center gap-md min-h-10 max-w-100! px-lg py-md rounded-md',
          title: 'font-semibold text-sm tracking-t-2 text-white',
          icon: 'hidden',
          closeButton:
            'static order-2 shrink-0 ml-auto size-4 border-0 bg-transparent p-0 m-0',
          success: 'bg-accent-green!',
          error: 'bg-accent-red!',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
