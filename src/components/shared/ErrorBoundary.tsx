import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import logoBooky from '@/assets/images/logo-booky.png';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled render error:', error, info.componentStack);
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        role='alert'
        className='min-h-screen bg-neutral-25 flex flex-col items-center justify-center gap-6 px-6 text-center'
      >
        <img src={logoBooky} alt='' className='size-16 object-contain' />
        <div className='flex flex-col gap-2 max-w-100'>
          <h1 className='text-display-xs md:text-display-sm font-bold text-neutral-950'>
            Something went wrong
          </h1>
          <p className='text-sm md:text-md font-semibold text-neutral-700 tracking-t-2'>
            An unexpected error occurred. Reload the page to try again.
          </p>
        </div>
        <div className='flex flex-col sm:flex-row gap-3 w-full sm:w-auto'>
          <Button type='button' onClick={() => window.location.reload()} className='sm:w-45'>
            Reload page
          </Button>
          <Button
            type='button'
            variant='outline'
            onClick={() => window.location.assign('/')}
            className='sm:w-45'
          >
            Back to home
          </Button>
        </div>
      </div>
    );
  }
}
