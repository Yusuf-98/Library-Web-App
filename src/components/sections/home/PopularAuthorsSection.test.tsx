import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getPopularAuthors } from '@/lib/api/authors';
import PopularAuthorsSection from './PopularAuthorsSection';

vi.mock('@/lib/api/authors', () => ({ getPopularAuthors: vi.fn() }));

function LocationProbe() {
  return <div data-testid='pathname'>{useLocation().pathname}</div>;
}

function setup() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <PopularAuthorsSection />
        <LocationProbe />
      </MemoryRouter>
    </QueryClientProvider>
  );
  return userEvent.setup();
}

describe('PopularAuthorsSection', () => {
  beforeEach(() => {
    vi.mocked(getPopularAuthors).mockReset();
  });

  it('shows skeleton cards while loading, then the authors with their book counts', async () => {
    vi.mocked(getPopularAuthors).mockResolvedValue([
      { id: 19, name: 'Zayn Mifta', bookCount: 10 },
      { id: 3, name: 'J. K. Rowling', bookCount: 4 },
    ]);
    setup();

    expect(screen.getByRole('status')).toHaveTextContent('Loading authors');

    expect(await screen.findByText('Zayn Mifta')).toBeInTheDocument();
    expect(screen.getByText('10 books')).toBeInTheDocument();
    expect(screen.getByText('4 books')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('opens the author page when a card is clicked', async () => {
    vi.mocked(getPopularAuthors).mockResolvedValue([{ id: 19, name: 'Zayn Mifta', bookCount: 10 }]);
    const user = setup();
    await user.click(await screen.findByRole('button', { name: /Zayn Mifta/ }));
    expect(screen.getByTestId('pathname')).toHaveTextContent('/author/19');
  });

  it('shows an error message when the request fails', async () => {
    vi.mocked(getPopularAuthors).mockRejectedValue(new Error('network'));
    setup();
    expect(await screen.findByText('Failed to load authors.')).toBeInTheDocument();
  });
});
