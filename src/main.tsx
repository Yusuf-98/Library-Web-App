import { StrictMode, startTransition } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { store } from './app/store';
import { queryClient } from './lib/queryClient';
import ErrorBoundary from './components/shared/ErrorBoundary';
import './index.css';
import App from './App.tsx';

startTransition(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ErrorBoundary>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <App />
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </Provider>
      </ErrorBoundary>
    </StrictMode>
  );
});
