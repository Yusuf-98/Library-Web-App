import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getCategories } from '@/lib/api/categories';
import CategorySection from './CategorySection';

vi.mock('@/lib/api/categories', () => ({ getCategories: vi.fn() }));

// The nine categories the home page shows, plus one that it deliberately hides.
const NAMES = ['Fiction', 'Non-Fiction', 'Self-Improvement', 'Finance', 'Science', 'Education', 'Lifestyle', 'Religious', 'Science-Fiction', 'Computer'];
const categories = NAMES.map((name, i) => ({ id: i + 1, name }));

function LocationProbe() {
  return <div data-testid='pathname'>{useLocation().pathname}</div>;
}

function setup() {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <CategorySection />
        <LocationProbe />
      </MemoryRouter>
    </QueryClientProvider>
  );
  return userEvent.setup();
}

const card = (name: string) => screen.getByText(name, { selector: 'p' });

describe('CategorySection', () => {
  beforeEach(() => {
    vi.mocked(getCategories).mockReset();
    vi.mocked(getCategories).mockResolvedValue(categories);
  });

  it('holds the space with skeleton cards while loading, without exposing the dots yet', () => {
    setup();
    expect(screen.getByRole('status')).toHaveTextContent('Loading categories');
    expect(screen.queryByRole('button', { name: /Category page/ })).not.toBeInTheDocument();
  });

  it('shows the first six categories, in the configured order, once loaded', async () => {
    setup();
    expect(await screen.findByText('Fiction', { selector: 'p' })).toBeInTheDocument();
    for (const name of ['Non-Fiction', 'Self-Improvement', 'Finance', 'Science', 'Education']) {
      expect(card(name)).toBeInTheDocument();
    }
    expect(screen.queryByText('Lifestyle', { selector: 'p' })).not.toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('never shows a category that is not in the configured list', async () => {
    setup();
    await screen.findByText('Fiction', { selector: 'p' });
    expect(screen.queryByText('Computer', { selector: 'p' })).not.toBeInTheDocument();
  });

  it('opens the category page when a card is clicked', async () => {
    const user = setup();
    await user.click(await screen.findByText('Finance', { selector: 'p' }));
    expect(screen.getByTestId('pathname')).toHaveTextContent('/category/4');
  });

  it('pages through the categories with the dots', async () => {
    const user = setup();
    await screen.findByText('Fiction', { selector: 'p' });
    expect(screen.getAllByRole('button', { name: /Category page/ })).toHaveLength(3);

    await user.click(screen.getByRole('button', { name: 'Category page 3' }));

    expect(card('Religious')).toBeInTheDocument();
    expect(card('Science-Fiction')).toBeInTheDocument();
    expect(screen.queryByText('Fiction', { selector: 'p' })).not.toBeInTheDocument();
  });

  it('shows an error message when categories cannot be loaded', async () => {
    vi.mocked(getCategories).mockRejectedValue(new Error('network'));
    setup();
    expect(await screen.findByText('Failed to load categories.')).toBeInTheDocument();
  });
});
